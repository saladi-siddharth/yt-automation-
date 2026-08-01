import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { config } from '../config/config.js';

const ffmpegPath = ffmpegInstaller.path;

export const thumbnailEngine = {
  /**
   * World's Best Aesthetic High-CTR Hindi Thumbnail Engine
   * Extracts real HD frame from video content, applies +35% contrast/saturation pop,
   * and renders ultra-eye-catching 1080p JPG thumbnail matching the video topic.
   */
  async generateThumbnail(scriptPayload, outputId) {
    const thumbDir = path.join(config.outputDir, outputId);
    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true });
    }

    const thumbJpgPath = path.join(thumbDir, `THUMBNAIL_${outputId}.jpg`);
    const isShort = scriptPayload.type === 'short';
    const width = isShort ? 1080 : 1280;
    const height = isShort ? 1920 : 720;

    // UPGRADE: Use bundled Poppins-Bold font to support full Hindi Devanagari rendering without black boxes
    const fontPath = 'data/fonts/Poppins-Bold.ttf';

    const rawTitle = scriptPayload.titleHindi || scriptPayload.titleEnglish || "Viral Mystery";
    const cleanTitle = rawTitle.replace(/'/g, '').replace(/"/g, '').replace(/:/g, ' ').substring(0, 42);

    const badgeText = isShort ? "🔥 99% लोग नहीं जानते!" : "🚨 पर्दाफ़ाश: सबसे बड़ा सच!";

    const clip1Path = path.join(thumbDir, 'clips', 'clip_1.mp4');

    if (fs.existsSync(clip1Path)) {
      try {
        console.log(`[ThumbnailEngine] Extracting real HD video frame from clip_1.mp4 for topic "${cleanTitle}"...`);
        const titleY = isShort ? height - 350 : height - 120;
        const titleFontSize = isShort ? 54 : 48;

        const ffmpegCmd = `"${ffmpegPath}" -y -ss 00:00:01 -i "${clip1Path}" -vf "crop=w=iw*0.95:h=ih*0.95:x=iw*0.025:y=ih*0.025,scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},eq=contrast=1.30:saturation=1.40,drawtext=fontfile='${fontPath}':text='${badgeText}':fontcolor=white:fontsize=36:box=1:boxcolor=0xE50914@0.95:boxborderw=12:x=40:y=40,drawtext=fontfile='${fontPath}':text='${cleanTitle}':fontcolor=0xFFD700:fontsize=${titleFontSize}:borderw=4:bordercolor=black:shadowx=3:shadowy=3:shadowcolor=black@0.9:x=(w-text_w)/2:y=${titleY}" -vframes 1 -q:v 2 "${thumbJpgPath}"`;
        execSync(ffmpegCmd, { stdio: 'ignore' });

        if (fs.existsSync(thumbJpgPath)) {
          console.log(`[ThumbnailEngine] World's Best Aesthetic High-CTR JPG Thumbnail rendered -> ${thumbJpgPath}`);
          return { thumbPath: thumbJpgPath, width, height, mainTitleHindi: cleanTitle };
        }
      } catch (err) {
        console.warn(`[ThumbnailEngine Warning] Frame extraction fallback: ${err.message}`);
      }
    }

    // Fallback: Generate high-contrast SVG
    const svgPath = path.join(thumbDir, `THUMBNAIL_${outputId}.svg`);
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#0a0a1a"/><text x="50%" y="50%" fill="#FFD700" font-size="48" font-weight="bold" text-anchor="middle">${cleanTitle}</text></svg>`;
    fs.writeFileSync(svgPath, svgContent, 'utf-8');
    return { thumbPath: svgPath, width, height, mainTitleHindi: cleanTitle };
  }
};

