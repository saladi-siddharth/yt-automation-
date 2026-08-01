import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import cors from 'cors';
import { config } from '../config/config.js';
import { scheduleManager } from '../scheduler/scheduleManager.js';
import { memoryLedger } from '../db/memoryLedger.js';
import { youtubeUploader } from '../upload/youtubeUploader.js';
import { tidbClient } from '../db/tidbClient.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(config.rootDir, 'public')));
app.use('/output', express.static(config.outputDir));

const logHistory = [];

// Broadcast message to all connected dashboard WebSockets
function broadcast(data) {
  const payload = typeof data === 'string' ? JSON.stringify({ type: 'log', message: data }) : JSON.stringify(data);
  
  if (typeof data === 'string' || (data && data.type === 'log')) {
    logHistory.push(payload);
    if (logHistory.length > 200) logHistory.shift(); // Keep last 200 logs in memory
  }

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

// REST API Endpoints
app.get('/api/stats', (req, res) => {
  res.json(memoryLedger.getStats());
});

app.get('/api/schedule', (req, res) => {
  res.json(scheduleManager.getScheduleOverview());
});

import fs from 'fs';

app.get('/api/tidb/videos', async (req, res) => {
  try {
    const videos = await tidbClient.getAllVideos();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/library', (req, res) => {
  try {
    const memory = memoryLedger.getMemory();
    const outputDir = config.outputDir;
    const library = [];

    if (fs.existsSync(outputDir)) {
      const dirs = fs.readdirSync(outputDir);
      
      dirs.forEach(dirName => {
        const dirPath = path.join(outputDir, dirName);
        if (fs.statSync(dirPath).isDirectory()) {
          const manifestPath = path.join(dirPath, 'render_manifest.json');
          let manifest = null;
          if (fs.existsSync(manifestPath)) {
            try {
              manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            } catch (e) {}
          }

          // Check if mp4 exists
          const files = fs.readdirSync(dirPath);
          const mp4File = files.find(f => f.endsWith('.mp4'));
          const svgFile = files.find(f => f.endsWith('.svg'));
          const srtFile = files.find(f => f.endsWith('.srt'));

          if (mp4File) {
            const isShort = dirName.startsWith('short') || (manifest && manifest.type === 'short');
            const memoryMatch = memory.topics.find(t => t.outputId === dirName) || {};

            library.push({
              id: dirName,
              type: isShort ? 'short' : 'long',
              titleHindi: manifest ? manifest.titleHindi : (memoryMatch.titleHindi || dirName),
              titleEnglish: manifest ? manifest.titleEnglish : (memoryMatch.titleEnglish || ''),
              viralScore: memoryMatch.viralScore || 95,
              videoUrl: `/output/${dirName}/${mp4File}`,
              thumbnailUrl: svgFile ? `/output/${dirName}/${svgFile}` : '',
              srtUrl: srtFile ? `/output/${dirName}/${srtFile}` : '',
              durationSec: manifest ? manifest.durationSec : (isShort ? 40 : 600),
              createdAt: manifest ? manifest.renderedAt : (memoryMatch.timestamp || new Date().toISOString()),
              dateFormatted: new Date(manifest ? manifest.renderedAt : (memoryMatch.timestamp || Date.now())).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            });
          }
        }
      });
    }

    // Sort newest first
    library.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(library);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OAuth YouTube Authorization Endpoints
app.get('/auth/youtube', (req, res) => {
  try {
    const url = youtubeUploader.getAuthUrl();
    res.redirect(url);
  } catch (err) {
    res.status(500).send(`OAuth Error: ${err.message}`);
  }
});

app.get('/oauth2callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (code) {
      await youtubeUploader.handleCallback(code);
      broadcast('[YouTubeOAuth] Channel authorization successful! Scheduled uploads activated.');
      res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #0a0c10; color: #00ff88;">
          <h1>🎉 YouTube Channel Successfully Connected!</h1>
          <p>Your OAuth tokens have been securely saved. You can close this window and return to your Studio Dashboard.</p>
          <a href="/" style="color: #00f2fe; text-decoration: none; font-weight: bold;">Return to Studio Dashboard</a>
        </div>
      `);
    } else {
      res.status(400).send('Missing authorization code');
    }
  } catch (err) {
    res.status(500).send(`Authentication Failed: ${err.message}`);
  }
});

app.post('/api/generate/short', async (req, res) => {
  try {
    const result = await scheduleManager.generateAndPublishVideo('short');
    broadcast({ type: 'stats', stats: memoryLedger.getStats() });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Secure Cloud Webhook Trigger Endpoints (For Cron-Job.org / External Schedulers)
app.get('/api/cron/short', async (req, res) => {
  const secretKey = req.query.key || req.headers['x-cron-key'];
  const expectedKey = process.env.CRON_SECRET || 'viral_secret_123';
  
  if (secretKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Cron Secret Key' });
  }

  try {
    broadcast('[CloudWebhook] Triggered automated Shorts generation via Cloud Webhook!');
    const result = await scheduleManager.generateAndPublishVideo('short');
    broadcast({ type: 'stats', stats: memoryLedger.getStats() });
    res.json({ success: true, message: 'Short generation triggered', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/cron/long', async (req, res) => {
  const secretKey = req.query.key || req.headers['x-cron-key'];
  const expectedKey = process.env.CRON_SECRET || 'viral_secret_123';
  
  if (secretKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Cron Secret Key' });
  }

  try {
    broadcast('[CloudWebhook] Triggered automated Long video generation via Cloud Webhook!');
    const result = await scheduleManager.generateAndPublishVideo('long');
    broadcast({ type: 'stats', stats: memoryLedger.getStats() });
    res.json({ success: true, message: 'Long video generation triggered', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/generate/long', async (req, res) => {
  try {
    const result = await scheduleManager.generateAndPublishVideo('long');
    broadcast({ type: 'stats', stats: memoryLedger.getStats() });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

app.post('/api/generate/python', async (req, res) => {
  try {
    const type = req.body.type || 'short';
    broadcast(`[PythonML] Triggering Python Master Automation Engine (${type})...`);
    
    const pyScript = path.join(config.rootDir, 'python', 'master_automation_engine.py');
    const { stdout, stderr } = await execPromise(`python "${pyScript}" ${type}`);
    
    broadcast(stdout);
    res.json({ success: true, stdout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

wss.on('connection', (ws) => {
  console.log('[WebSocket] Client connected to Studio Dashboard');
  ws.send(JSON.stringify({ type: 'log', message: '[WebSocket] Connected to Viral Hindi YouTube Studio Log Stream' }));
  
  // Restore log history for refreshed pages
  logHistory.forEach(log => {
    if (ws.readyState === 1) ws.send(log);
  });
  
  ws.send(JSON.stringify({ type: 'stats', stats: memoryLedger.getStats() }));
});

// Start Server & Scheduler
server.listen(config.port, () => {
  console.log(`\n=============================================================`);
  console.log(`🔥 VIRAL HINDI YOUTUBE AUTOMATION STUDIO IS RUNNING! 🔥`);
  console.log(`=============================================================`);
  console.log(`🌐 Dashboard URL : http://localhost:${config.port}`);
  console.log(`📅 Daily Shorts  : ${config.shortsPerDay} per day (09:00, 16:00, 20:00 IST)`);
  console.log(`🎬 Long Videos   : ${config.longVideosPerWeek} per week (${config.longVideoDays.join(', ')} @ 18:00 IST)`);
  console.log(`=============================================================\n`);

  scheduleManager.init((msg) => broadcast(msg));
});
