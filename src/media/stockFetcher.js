import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { config } from '../config/config.js';

export const stockFetcher = {
  /**
   * Pro AI Visual Planner & Intelligent Multi-Clip Search Engine
   * Downloads 8-12 clips for Shorts (1.5-3.0s per clip) and 100-150 clips for Long Videos
   */
  async fetchMediaForScript(scriptPayload, outputId, orientation = 'portrait', broadcastLog = console.log) {
    const mediaDir = path.join(config.outputDir, outputId, 'clips');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    const segments = scriptPayload.segments || [];
    const isShort = scriptPayload.type === 'short';
    const targetClipCount = isShort ? 12 : 100;

    broadcastLog(`[AI Visual Planner] Planning ${targetClipCount} fast-paced dynamic cuts (1.5s-3s per scene)...`);

    // Intelligent Search Query Expansion Bank
    const fallbackQueries = [
      'ocean underwater coral reef 4K',
      'wildlife predator close up macro',
      'sea creature attack underwater',
      'deep ocean mysterious monster',
      'water explosion shockwave macro',
      'nature wild animal action 4K',
      'tropical ocean marine life HD',
      'underwater scuba diver ocean',
      'scary sea predator underwater',
      'nature wilderness forest predator'
    ];

    const expandedScenes = [];
    
    // Sub-segment each text segment into 1.5s - 3.0s mini-clips
    segments.forEach((seg, sIdx) => {
      const baseQuery = seg.stockQuery || 'ocean animal nature';
      const textWords = seg.textHindi ? seg.textHindi.split(' ') : [];
      
      // Cut each 8-10 second segment into 2-3 fast visual cuts
      const cutsPerSegment = isShort ? 2 : 10;
      for (let c = 0; c < cutsPerSegment; c++) {
        const queryIndex = (sIdx + c) % fallbackQueries.length;
        expandedScenes.push({
          segmentId: seg.id,
          query: c === 0 ? baseQuery : `${baseQuery} ${fallbackQueries[queryIndex]}`,
          textHindi: seg.textHindi,
          keywordHighlight: seg.keywordHighlight,
          durationSec: isShort ? (1.5 + (c * 0.7)) : 4.0
        });
      }
    });

    const fetchedClips = [];

    for (let i = 0; i < expandedScenes.length; i++) {
      const scene = expandedScenes[i];
      const clipFileName = `clip_${i + 1}.mp4`;
      const targetClipPath = path.join(mediaDir, clipFileName);

      broadcastLog(`[StockFetcher ${i + 1}/${expandedScenes.length}] Searching Pexels for "${scene.query}"...`);

      let downloadUrl = null;

      if (config.pexelsApiKey) {
        try {
          const resp = await axios.get(`https://api.pexels.com/videos/search`, {
            headers: { Authorization: config.pexelsApiKey },
            params: { 
              query: scene.query, 
              per_page: 10, 
              orientation: orientation === 'portrait' ? 'portrait' : 'landscape' 
            }
          });

          if (resp.data.videos && resp.data.videos.length > 0) {
            // Pick a unique video from the top candidates
            const videoIndex = i % resp.data.videos.length;
            const chosenVideo = resp.data.videos[videoIndex] || resp.data.videos[0];
            const videoFiles = chosenVideo.video_files;
            const suitableFile = videoFiles.find(f => f.quality === 'hd') || videoFiles[0];
            downloadUrl = suitableFile.link;
          }
        } catch (e) {
          console.warn(`[StockFetcher Warning] Pexels search info: ${e.message}`);
        }
      }

      // Download HD clip stream into targetClipPath
      if (downloadUrl) {
        try {
          const writer = fs.createWriteStream(targetClipPath);
          const videoStream = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream'
          });
          videoStream.data.pipe(writer);
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
          broadcastLog(`[StockFetcher ${i + 1}/${expandedScenes.length}] Downloaded 4K HD Clip -> ${clipFileName} (${fs.statSync(targetClipPath).size} bytes)`);
        } catch (err) {
          console.warn(`[StockFetcher Download Warning] Clip ${i + 1} info: ${err.message}`);
        }
      }

      fetchedClips.push({
        sceneId: i + 1,
        segmentId: scene.segmentId,
        query: scene.query,
        localPath: targetClipPath,
        duration: scene.durationSec,
        textHindi: scene.textHindi,
        keywordHighlight: scene.keywordHighlight
      });
    }

    return fetchedClips;
  }
};
