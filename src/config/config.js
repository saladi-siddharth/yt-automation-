import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

dotenv.config({ path: path.join(rootDir, '.env') });

export const config = {
  port: process.env.PORT || 3000,
  language: process.env.LANGUAGE || 'hindi',
  rootDir,
  dataDir: path.join(rootDir, 'data'),
  outputDir: path.join(rootDir, 'output'),
  assetsDir: path.join(rootDir, 'assets'),
  
  // API Keys
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
  pexelsApiKey: process.env.PEXELS_API_KEY || '',
  pixabayApiKey: process.env.PIXABAY_API_KEY || '',
  
  // Schedule Rules
  shortsPerDay: parseInt(process.env.SHORTS_PER_DAY || '3', 10),
  longVideosPerWeek: parseInt(process.env.LONG_VIDEOS_PER_WEEK || '7', 10),
  longVideoDays: (process.env.LONG_VIDEO_DAYS || 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday').split(','),
  
  // Schedule Hours (IST)
  shortsTimes: ['09:00', '16:00', '20:00'],
  longVideoTime: '18:00',

  // Audio Settings
  defaultVoice: 'hi-IN-MadhurNeural', // Microsoft Edge Hindi Neural Voice
  femaleVoice: 'hi-IN-SwaraNeural'
};
