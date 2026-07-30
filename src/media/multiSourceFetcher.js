import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { config } from '../config/config.js';

export const multiSourceFetcher = {
  /**
   * Multi-Source Asset Collector (Pexels + Pixabay + Unsplash HD Video/Image Streams)
   */
  async fetchMediaForStoryboard(storyboard, outputId, orientation = 'portrait', broadcastLog = console.log) {
    const mediaDir = path.join(config.outputDir, outputId, 'clips');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    const scenes = storyboard.scenes || [];
    broadcastLog(`[MultiSourceAssetFetcher] Searching multi-source engine (Pexels, Pixabay, Unsplash) for ${scenes.length} scene cuts...`);

    const fetchedClips = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const clipFileName = `clip_${i + 1}.mp4`;
      const targetClipPath = path.join(mediaDir, clipFileName);

      const queries = scene.visualQueries || [scene.stockQuery || 'ocean underwater nature'];
      const searchQuery = queries[i % queries.length] || queries[0];

      broadcastLog(`[AssetCollector ${i + 1}/${scenes.length}] Scene #${scene.sceneId}: Searching for "${searchQuery}"...`);

      const baseQuery = scene.stockQuery || 'nature wildlife';
      // Build candidate queries from most specific to general
      const candidateQueries = [
        searchQuery,
        baseQuery,
        baseQuery.split(' ')[0], // First word e.g. "snake" from "black mamba snake"
        'wildlife nature'
      ].filter(Boolean);

      let downloadUrl = null;

      // Search through candidate queries until videos are found
      for (const q of candidateQueries) {
        if (downloadUrl) break;

        // 1. Primary Search: Pexels API
        if (config.pexelsApiKey) {
          try {
            const resp = await axios.get(`https://api.pexels.com/videos/search`, {
              headers: { Authorization: config.pexelsApiKey },
              params: { 
                query: q, 
                per_page: 10, 
                orientation: orientation === 'portrait' ? 'portrait' : 'landscape' 
              }
            });

            if (resp.data.videos && resp.data.videos.length > 0) {
              const chosen = resp.data.videos[i % resp.data.videos.length] || resp.data.videos[0];
              const files = chosen.video_files;
              const hdFile = files.find(f => f.quality === 'hd') || files[0];
              downloadUrl = hdFile.link;
              break;
            }
          } catch (e) {
            console.warn(`[MultiSourceFetcher] Pexels query "${q}" info: ${e.message}`);
          }
        }

        // 2. Secondary Fallback: Pixabay API
        if (!downloadUrl && process.env.PIXABAY_API_KEY) {
          try {
            const resp = await axios.get(`https://pixabay.com/api/videos/`, {
              params: {
                key: process.env.PIXABAY_API_KEY,
                q: q,
                per_page: 5
              }
            });
            if (resp.data.hits && resp.data.hits.length > 0) {
              const hit = resp.data.hits[0];
              downloadUrl = hit.videos.medium.url || hit.videos.small.url;
              break;
            }
          } catch (e2) {
            console.warn(`[MultiSourceFetcher] Pixabay query "${q}" info: ${e2.message}`);
          }
        }
      }

      // Perform stream download into targetClipPath
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
          broadcastLog(`[AssetCollector ${i + 1}/${scenes.length}] Downloaded HD Clip -> ${clipFileName} (${fs.statSync(targetClipPath).size} bytes)`);
        } catch (err) {
          console.warn(`[AssetCollector Download Error] Clip ${i + 1}: ${err.message}`);
        }
      }

      fetchedClips.push({
        sceneId: scene.sceneId,
        query: searchQuery,
        localPath: targetClipPath,
        duration: scene.durationSec || 2.0,
        textHindi: scene.textHindi,
        keywordHighlight: scene.keywordHighlight,
        cameraMotion: scene.cameraMotion || 'slow zoom in',
        captionStyle: scene.captionStyle || 'pop'
      });
    }

    return fetchedClips;
  }
};
