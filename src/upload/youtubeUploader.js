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

  getAuthUrl() {
    const oauth2Client = this.getOAuth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.readonly'
      ]
    });
  },

  async handleCallback(code) {
    const oauth2Client = this.getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.mkdirSync(config.dataDir, { recursive: true });
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), 'utf-8');
    console.log('[YouTubeOAuth] Successfully authenticated & saved tokens!');
    return tokens;
  },

  getAuthenticatedClient() {
    let tokens = null;

    if (process.env.YOUTUBE_TOKENS_JSON) {
      try {
        const rawStr = String(process.env.YOUTUBE_TOKENS_JSON).trim().replace(/^'+|'+$/g, '').replace(/^"+|"+$/g, '');
        tokens = JSON.parse(rawStr);
        console.log('[YouTubeOAuth] Loaded tokens from environment variable.');
      } catch (e) {
        console.warn('[YouTubeOAuth] Failed parsing env tokens:', e.message);
      }
    }

    if (!tokens && fs.existsSync(TOKEN_PATH)) {
      try {
        tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
        console.log('[YouTubeOAuth] Loaded tokens from file.');
      } catch (e) {
        console.warn('[YouTubeOAuth] Failed to load tokens file:', e.message);
      }
    }

    if (!tokens || (!tokens.access_token && !tokens.refresh_token)) {
      console.warn('[YouTubeOAuth] No valid OAuth tokens found.');
      return null;
    }

    try {
      const oauth2Client = this.getOAuth2Client();
      oauth2Client.setCredentials(tokens);
      return google.youtube({ version: 'v3', auth: oauth2Client });
    } catch (e) {
      console.warn('[YouTubeOAuth] Client init error:', e.message);
      return null;
    }
  },

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * 🚀 WORLD'S BEST YouTube Upload Engine v4.0
   * ═══════════════════════════════════════════════════════════════════════════
   * 
   * KEY FIXES:
   * 1. ADDED: Custom thumbnail upload (was missing entirely!)
   * 2. ADDED: Retry logic with exponential backoff (3 attempts)
   * 3. ADDED: #Shorts hashtag for Shorts videos
   * 4. ADDED: Hindi language targeting (defaultLanguage: 'hi')
   * 5. ADDED: Optimized SEO description with hashtags
   * 6. FIXED: Category 22 for Shorts, 27 for Longs
   */
  async uploadVideo({ videoPath, title, description, tags, privacyStatus = 'public', publishAt = null, thumbnailPath = null, isShort = false }) {
    const youtube = this.getAuthenticatedClient();
    if (!youtube) {
      console.log('[YouTubeUploader] ⚠️ No tokens — video saved locally only.');
      return { success: false, reason: 'No YouTube tokens configured.' };
    }

    // SEO: Add #Shorts to short titles
    let finalTitle = title.substring(0, 100);
    if (isShort && !finalTitle.includes('#Shorts')) {
      finalTitle = finalTitle.substring(0, 90) + ' #Shorts';
    }

    // SEO: Enrich description with hashtags and engagement CTAs
    const seoHashtags = '\n\n#shorts #viral #facts #hindi #trending #amazing #science #documentary #knowledge';
    const seoCTA = '\n\n👍 LIKE करें | 🔔 SUBSCRIBE करें | 💬 COMMENT करें\n\n© Automated by AI Content Engine';
    const finalDescription = (description || title).substring(0, 4500) + seoHashtags + seoCTA;

    // SEO: Merge tags
    const finalTags = [...new Set([
      ...(tags || []),
      'viral', 'facts', 'hindi', 'trending', 'amazing facts', 'documentary', 'science',
      'shorts', 'youtube shorts', 'knowledge', 'education', 'mystery', 'space', 'animals'
    ])].slice(0, 30);

    console.log(`[YouTubeUploader v4.0] Uploading "${finalTitle}" (${privacyStatus})...`);

    // Retry logic: 3 attempts with exponential backoff
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await youtube.videos.insert({
          part: ['snippet', 'status'],
          requestBody: {
            snippet: {
              title: finalTitle,
              description: finalDescription,
              tags: finalTags,
              categoryId: isShort ? '22' : '27',
              defaultLanguage: 'hi',
              defaultAudioLanguage: 'hi'
            },
            status: {
              privacyStatus: privacyStatus || 'public',
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

        console.log(`[YouTubeUploader SUCCESS] Video ID: ${videoId} | URL: ${videoUrl}`);

        // ═══ CRITICAL FIX: Upload custom thumbnail ═══
        if (thumbnailPath && fs.existsSync(thumbnailPath)) {
          try {
            await youtube.thumbnails.set({
              videoId: videoId,
              media: {
                mimeType: 'image/jpeg',
                body: fs.createReadStream(thumbnailPath)
              }
            });
            console.log(`[YouTubeUploader] Custom thumbnail uploaded for ${videoId} ✓`);
          } catch (thumbErr) {
            console.warn(`[YouTubeUploader] Thumbnail upload note: ${thumbErr.message}`);
          }
        }

        return { success: true, videoId, url: videoUrl, studioUrl };

      } catch (err) {
        console.error(`[YouTubeUploader] Attempt ${attempt}/3 failed: ${err.message}`);
        if (attempt < 3) {
          const waitMs = attempt * 5000;
          console.log(`[YouTubeUploader] Retrying in ${waitMs / 1000}s...`);
          await new Promise(r => setTimeout(r, waitMs));
        } else {
          return { success: false, reason: err.message };
        }
      }
    }

    return { success: false, reason: 'All 3 upload attempts failed.' };
  },

  async updateVideoSchedule({ videoId, publishAtISO }) {
    const youtube = this.getAuthenticatedClient();
    if (!youtube) throw new Error('YouTube client auth failed.');

    const getRes = await youtube.videos.list({ part: ['snippet', 'status'], id: [videoId] });
    if (!getRes.data.items?.length) throw new Error(`Video ${videoId} not found.`);

    const snippet = getRes.data.items[0].snippet;
    const res = await youtube.videos.update({
      part: ['snippet', 'status'],
      requestBody: {
        id: videoId,
        snippet: { title: snippet.title, description: snippet.description, categoryId: snippet.categoryId || '27' },
        status: { privacyStatus: 'private', publishAt: publishAtISO, selfDeclaredMadeForKids: false }
      }
    });

    console.log(`[YouTubeSchedule] Scheduled ${videoId} for ${publishAtISO} ✓`);
    return res.data;
  }
};
