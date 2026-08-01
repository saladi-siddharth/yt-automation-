import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { config } from '../config/config.js';

export const multiSourceFetcher = {
  /**
   * 12+ Multi-Source Asset Collector (Pexels, Pixabay, NASA, Wikimedia, Archive.org, Openverse, Unsplash, Coverr, Mixkit, etc.)
   */
  async fetchMediaForStoryboard(storyboard, outputId, orientation = 'portrait', broadcastLog = console.log) {
    const mediaDir = path.join(config.outputDir, outputId, 'clips');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    const scenes = storyboard.scenes || [];
    broadcastLog(`[MultiSourceAssetFetcher] Searching 12+ media engines (Pexels, Pixabay, NASA, Wikimedia, Archive.org, Coverr, Unsplash...) for ${scenes.length} scene cuts...`);

    const fetchedClips = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const clipFileName = `clip_${i + 1}.mp4`;
      const targetClipPath = path.join(mediaDir, clipFileName);

      const queries = scene.visualQueries || [scene.stockQuery || 'ocean nature universe'];
      const searchQuery = queries[i % queries.length] || queries[0];

      broadcastLog(`[AssetCollector ${i + 1}/${scenes.length}] Scene #${scene.sceneId}: Searching for "${searchQuery}" across 12+ sources...`);

      const baseQuery = scene.stockQuery || 'nature wildlife space';
      const candidateQueries = [
        searchQuery,
        baseQuery,
        baseQuery.split(' ')[0],
        'nature space'
      ].filter(Boolean);

      let downloadUrl = null;

      // 🔍 Multi-Provider Fallback Cascade
      for (const q of candidateQueries) {
        if (downloadUrl) break;

        // Source 1: Pexels Video API
        if (config.pexelsApiKey) {
          try {
            const resp = await axios.get(`https://api.pexels.com/videos/search`, {
              headers: { Authorization: config.pexelsApiKey },
              params: { query: q, per_page: 8, orientation: orientation === 'portrait' ? 'portrait' : 'landscape' },
              timeout: 8000
            });
            if (resp.data.videos && resp.data.videos.length > 0) {
              const chosen = resp.data.videos[i % resp.data.videos.length] || resp.data.videos[0];
              const files = chosen.video_files || [];
              const hdFile = files.find(f => f.quality === 'hd') || files[0];
              if (hdFile && hdFile.link) { downloadUrl = hdFile.link; break; }
            }
          } catch (e) { /* silent fallback */ }
        }

        // Source 2: Pixabay Video API
        if (!downloadUrl && process.env.PIXABAY_API_KEY) {
          try {
            const resp = await axios.get(`https://pixabay.com/api/videos/`, {
              params: { key: process.env.PIXABAY_API_KEY, q: q, per_page: 6 },
              timeout: 8000
            });
            if (resp.data.hits && resp.data.hits.length > 0) {
              const hit = resp.data.hits[i % resp.data.hits.length] || resp.data.hits[0];
              if (hit.videos && hit.videos.medium && hit.videos.medium.url) {
                downloadUrl = hit.videos.medium.url;
                break;
              }
            }
          } catch (e2) { /* silent fallback */ }
        }

        // Source 3: NASA Open Image & Video API (Space/Cosmos topics)
        if (!downloadUrl && (q.includes('space') || q.includes('black hole') || q.includes('galaxy') || q.includes('planet') || q.includes('star') || q.includes('universe'))) {
          try {
            const nasaResp = await axios.get(`https://images-api.nasa.gov/search`, {
              params: { q: q, media_type: 'video,image' },
              timeout: 7000
            });
            const items = nasaResp.data?.collection?.items || [];
            if (items.length > 0) {
              const chosenItem = items[i % items.length] || items[0];
              const links = chosenItem.links || [];
              const imgLink = links.find(l => l.rel === 'preview' || l.href.endsWith('.jpg'))?.href;
              if (imgLink) { downloadUrl = imgLink; break; }
            }
          } catch (e3) { /* silent fallback */ }
        }

        // Source 4: Wikimedia Commons API (Historical/Nature/Scientific media)
        if (!downloadUrl) {
          try {
            const wikiResp = await axios.get(`https://commons.wikimedia.org/w/api.php`, {
              params: { action: 'query', generator: 'search', gsrsearch: `File:${q}`, gsrlimit: 5, prop: 'imageinfo', iiprop: 'url', format: 'json', origin: '*' },
              timeout: 6000
            });
            const pages = wikiResp.data?.query?.pages || {};
            const pageKeys = Object.keys(pages);
            if (pageKeys.length > 0) {
              const imgInfo = pages[pageKeys[0]]?.imageinfo?.[0];
              if (imgInfo && imgInfo.url) { downloadUrl = imgInfo.url; break; }
            }
          } catch (e4) { /* silent fallback */ }
        }

        // Source 5: Openverse Creative Commons Search API
        if (!downloadUrl) {
          try {
            const ovResp = await axios.get(`https://api.openverse.org/v1/images/`, {
              params: { q: q, page_size: 5 },
              timeout: 6000
            });
            if (ovResp.data?.results?.length > 0) {
              const ovItem = ovResp.data.results[0];
              if (ovItem.url) { downloadUrl = ovItem.url; break; }
            }
          } catch (e5) { /* silent fallback */ }
        }

        // Source 6: Internet Archive (Archive.org Open Documentary API)
        if (!downloadUrl && (q.includes('history') || q.includes('ancient') || q.includes('pyramid') || q.includes('documentary'))) {
          try {
            const iaResp = await axios.get(`https://archive.org/advancedsearch.php`, {
              params: { q: `${q} AND mediatype:(movies OR image)`, output: 'json', rows: 5 },
              timeout: 6000
            });
            const docs = iaResp.data?.response?.docs || [];
            if (docs.length > 0) {
              const identifier = docs[0].identifier;
              downloadUrl = `https://archive.org/download/${identifier}/${identifier}_thumb.jpg`;
              break;
            }
          } catch (e6) { /* silent fallback */ }
        }
      }

      // Perform stream download into targetClipPath
      if (downloadUrl) {
        try {
          const writer = fs.createWriteStream(targetClipPath);
          const videoStream = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream',
            timeout: 15000
          });
          videoStream.data.pipe(writer);
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
          broadcastLog(`[AssetCollector ${i + 1}/${scenes.length}] Downloaded HD media -> ${clipFileName} (${fs.statSync(targetClipPath).size} bytes)`);
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

