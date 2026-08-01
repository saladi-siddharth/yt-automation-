import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { config } from '../config/config.js';

const TOKEN_PATH = path.join(config.dataDir, 'youtube_tokens.json');

export const youtubeUploader = {
  getOAuth2Client() {
    const clientId = process.env.YOUTUBE_CLIENT_ID || config.youtubeClientId || 'default_client_id';
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || config.youtubeClientSecret || 'default_client_secret';
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI || `http://localhost:${config.port}/oauth2callback`;

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  },

  /**
   * Generate Auth URL for connecting YouTube Channel
   */
  getAuthUrl() {
    const oauth2Client = this.getOAuth2Client();
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly'
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes
    });
  },

  /**
   * Handle OAuthCallback code and save refresh token
   */
  async handleCallback(code) {
    const oauth2Client = this.getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (!fs.existsSync(config.dataDir)) {
      fs.mkdirSync(config.dataDir, { recursive: true });
    }

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), 'utf-8');
    console.log('[YouTubeOAuth] Successfully authenticated & saved tokens!');
    return tokens;
  },

  /**
   * Get authenticated YouTube API client (Checks Env Secret & Local Token File)
   */
  getAuthenticatedClient() {
    let tokens = null;

    // 1. Check process.env.YOUTUBE_TOKENS_JSON directly
    if (process.env.YOUTUBE_TOKENS_JSON) {
      try {
        const rawStr = String(process.env.YOUTUBE_TOKENS_JSON).trim().replace(/^'+|'+$/g, '').replace(/^"+|"+$/g, '');
        tokens = JSON.parse(rawStr);
        console.log('[YouTubeOAuth] Loaded tokens from YOUTUBE_TOKENS_JSON environment variable.');
      } catch (e) {
        console.warn('[YouTubeOAuth] Failed parsing YOUTUBE_TOKENS_JSON env:', e.message);
      }
    }

    // 2. Check token file on disk
    if (!tokens && fs.existsSync(TOKEN_PATH)) {
      try {
        tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
        console.log('[YouTubeOAuth] Loaded tokens from data/youtube_tokens.json file.');
      } catch (e) {
        console.warn('[YouTubeOAuth] Failed to load tokens file:', e.message);
      }
    }

    if (!tokens || (!tokens.access_token && !tokens.refresh_token)) {
      console.warn('[YouTubeOAuth] No valid OAuth tokens found in env or data/youtube_tokens.json.');
      return null;
    }

    try {
      const oauth2Client = this.getOAuth2Client();
      oauth2Client.setCredentials(tokens);
      return google.youtube({ version: 'v3', auth: oauth2Client });
    } catch (e) {
      console.warn('[YouTubeOAuth] Client initialization error:', e.message);
      return null;
    }
  },

  /**
   * Upload video file directly to YouTube channel
   */
  async uploadVideo({ videoPath, title, description, tags, privacyStatus = 'public', publishAt = null }) {
    const youtube = this.getAuthenticatedClient();
    if (!youtube) {
      console.log('[YouTubeUploader] ⚠️ YouTube Channel not connected or tokens missing! Video saved locally in output/ directory.');
      return { success: false, reason: 'Channel tokens not present or invalid. Connect channel via dashboard or set YOUTUBE_TOKENS_JSON secret.' };
    }

    console.log(`[YouTubeUploader] Uploading "${title}" to YouTube (Privacy: ${privacyStatus})...`);

    try {
      const res = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: title.substring(0, 100),
            description: description || title,
            tags: tags || ['viral facts hindi', 'documentary'],
            categoryId: '27' // Education / Knowledge
          },
          status: {
            privacyStatus: privacyStatus || 'public', // Set to 'public' for immediate publishing
            selfDeclaredMadeForKids: false,
            publishAt: publishAt || undefined
          }
        },
        media: {
          body: fs.createReadStream(videoPath)
        }
      });

      const videoId = res.data.id;
      const videoUrl = `https://youtu.be/${videoId}`;
      const studioUrl = `https://studio.youtube.com/video/${videoId}/edit`;

      console.log(`[YouTubeUploader SUCCESS] Video uploaded! Video ID: ${videoId}`);
      console.log(`[YouTubeUploader Link] Live Video URL: ${videoUrl}`);
      console.log(`[YouTubeUploader Studio] Manage in YouTube Studio: ${studioUrl}`);

      return { success: true, videoId, url: videoUrl, studioUrl };
    } catch (err) {
      console.error(`[YouTubeUploader ERROR] Upload failed: ${err.message}`);
      return { success: false, reason: err.message };
    }
  },

  /**
   * Schedule an existing video for specific future publication timestamp
   */
  async updateVideoSchedule({ videoId, publishAtISO }) {
    const youtube = this.getAuthenticatedClient();
    if (!youtube) throw new Error('YouTube client authentication failed.');

    const getRes = await youtube.videos.list({
      part: ['snippet', 'status'],
      id: [videoId]
    });

    if (!getRes.data.items || getRes.data.items.length === 0) {
      throw new Error(`Video ID ${videoId} not found on YouTube.`);
    }

    const item = getRes.data.items[0];
    const snippet = item.snippet;

    const res = await youtube.videos.update({
      part: ['snippet', 'status'],
      requestBody: {
        id: videoId,
        snippet: {
          title: snippet.title,
          description: snippet.description,
          categoryId: snippet.categoryId || '27'
        },
        status: {
          privacyStatus: 'private',
          publishAt: publishAtISO,
          selfDeclaredMadeForKids: false
        }
      }
    });

    console.log(`[YouTubeSchedule SUCCESS] Scheduled video ${videoId} for automatic public release at ${publishAtISO}!`);
    return res.data;
  }
};

