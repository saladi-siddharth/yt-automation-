import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { config } from '../config/config.js';

const TOKEN_PATH = path.join(config.dataDir, 'youtube_tokens.json');

export const youtubeUploader = {
  getOAuth2Client() {
    const clientId = process.env.YOUTUBE_CLIENT_ID || config.youtubeClientId;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || config.youtubeClientSecret;
    const redirectUri = `http://localhost:${config.port}/oauth2callback`;

    if (!clientId || !clientSecret) {
      throw new Error('YouTube Client ID or Client Secret is missing in .env');
    }

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
   * Get authenticated YouTube API client
   */
  getAuthenticatedClient() {
    if (!fs.existsSync(TOKEN_PATH)) {
      return null;
    }
    try {
      const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
      const oauth2Client = this.getOAuth2Client();
      oauth2Client.setCredentials(tokens);
      return google.youtube({ version: 'v3', auth: oauth2Client });
    } catch (e) {
      console.warn('[YouTubeOAuth] Failed to load tokens:', e.message);
      return null;
    }
  },

  /**
   * Upload video file directly to YouTube channel
   */
  async uploadVideo({ videoPath, title, description, tags, privacyStatus = 'private' }) {
    const youtube = this.getAuthenticatedClient();
    if (!youtube) {
      console.log('[YouTubeUploader] Channel not connected yet. Video saved locally in output directory.');
      return { success: false, reason: 'Channel not authenticated via OAuth' };
    }

    console.log(`[YouTubeUploader] Uploading "${title}" to YouTube...`);

    const res = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags: tags || ['animal facts hindi', 'shorts'],
          categoryId: '15' // Pets & Animals
        },
        status: {
          privacyStatus, // 'private', 'unlisted', or 'public'
          selfDeclaredMadeForKids: false
        }
      },
      media: {
        body: fs.createReadStream(videoPath)
      }
    });

    console.log(`[YouTubeUploader] Upload successful! Video ID: ${res.data.id}`);
    return { success: true, videoId: res.data.id, url: `https://youtu.be/${res.data.id}` };
  }
};
