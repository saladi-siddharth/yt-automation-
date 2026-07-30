# 🚀 Viral Hindi YouTube Automation Studio

An autonomous, 100% hands-free YouTube Shorts and Long Video generation engine. This system automatically researches viral topics, generates highly engaging Hindi scripts, synthesizes neural voiceovers, fetches HD stock footage, edits the video with professional MrBeast-style effects (zoom/pans, animated captions, color grading), and publishes directly to YouTube on a scheduled basis.

## ✨ Features
- **🤖 Autonomous Scheduler**: Runs completely in the background. Default schedule: Shorts at 09:00, 16:00, and 20:00 IST. Long videos at 18:00 IST on Tue, Thu, Sun.
- **📚 25-Category Topic Engine**: Over 30,000+ unique topics (Space, Animals, Science, etc.) with strict 0% repetition memory.
- **🎬 Professional AI Video Editor**: 
  - Documentary Color Grading
  - Ken Burns Zoom & Pan effects on every clip
  - Animated Devanagari Hindi Captions with Keyword Highlights
  - Cinematic Vignettes & Gradient Bars
  - Retention Progress Bars
- **🎙️ Neural Hindi Audio**: High-retention TTS using Microsoft Edge Neural voices (`hi-IN-MadhurNeural`).
- **🌐 Real-Time Dashboard**: Monitor logs, view the media library, and trigger manual generations via the local web dashboard (`http://localhost:3000`).
- **☁️ Cloud Sync**: Automatically syncs video metadata to TiDB Cloud.

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saladi-siddharth/yt-automation-.git
   cd yt-automation-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Rename `.env.example` to `.env` and add your API keys:
   ```env
   PORT=3000
   LANGUAGE=hindi
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   PEXELS_API_KEY=your_pexels_api_key
   PIXABAY_API_KEY=your_pixabay_api_key
   ```

4. **Start the Studio Engine:**
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your browser to access the dashboard and connect your YouTube channel.

## 📁 Directory Structure
- `/src/ai/`: Brain of the operation (Script Generation, Director Agent, Topic Database)
- `/src/audio/`: TTS and Subtitle Generation (FFmpeg)
- `/src/video/`: The Professional FFmpeg multi-layer compositor
- `/src/web/`: Express Web Dashboard and API
- `/src/scheduler/`: The Cron-based scheduling system
- `/public/`: Frontend UI assets
- `/output/`: (Ignored) Stores all generated MP4s, MP3s, and SRTs.

## ⚠️ Disclaimer
This tool is for educational purposes. Ensure you comply with the API terms of service for YouTube, Pexels, and Pixabay.

## 📄 License
MIT License
