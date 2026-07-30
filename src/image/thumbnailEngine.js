import fs from 'fs';
import path from 'path';
import { config } from '../config/config.js';

export const thumbnailEngine = {
  /**
   * Generates a High-CTR Hindi Thumbnail manifest and SVG/HTML visual layout
   */
  async generateThumbnail(scriptPayload, outputId) {
    const thumbDir = path.join(config.outputDir, outputId);
    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true });
    }

    const thumbPath = path.join(thumbDir, `THUMBNAIL_${outputId}.svg`);
    const isShort = scriptPayload.type === 'short';
    const width = isShort ? 1080 : 1280;
    const height = isShort ? 1920 : 720;

    const mainTitleHindi = isShort 
      ? "सूरज जितना बड़ा धमाका!" 
      : "10 सबसे ख़तरनाक जीव! 😱";
    
    const badgeTextHindi = "ग़लती से भी मत छूना! ⚠️";

    // High-CTR SVG visual thumbnail layout with bold Devanagari Hindi typography
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f0c29"/>
      <stop offset="50%" stop-color="#302b63"/>
      <stop offset="100%" stop-color="#24243e"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="100%" height="100%" fill="url(#bgGrad)" />
  
  <!-- Vignette overlay -->
  <rect width="100%" height="100%" fill="black" opacity="0.35" />

  <!-- Red Shock Badge -->
  <g transform="translate(${width * 0.05}, ${height * 0.12})">
    <rect width="420" height="70" rx="12" fill="#FF0033" filter="url(#glow)" />
    <text x="210" y="46" font-family="sans-serif" font-weight="900" font-size="32" fill="#FFFFFF" text-anchor="middle">
      ${badgeTextHindi}
    </text>
  </g>

  <!-- Main Hindi Headline Title -->
  <g transform="translate(${width * 0.05}, ${height * 0.72})">
    <rect width="${width * 0.9}" height="140" rx="20" fill="#000000" opacity="0.85" stroke="#FFD700" stroke-width="4" />
    <text x="${(width * 0.9) / 2}" y="92" font-family="'Noto Sans Devanagari', 'Mukta', sans-serif" font-weight="900" font-size="${isShort ? 54 : 64}" fill="#FFD700" text-anchor="middle" filter="url(#glow)">
      ${mainTitleHindi}
    </text>
  </g>
</svg>
`;

    fs.writeFileSync(thumbPath, svgContent, 'utf-8');
    console.log(`[ThumbnailEngine] High-CTR Hindi Thumbnail rendered -> ${thumbPath}`);

    return {
      thumbPath,
      width,
      height,
      mainTitleHindi,
      badgeTextHindi
    };
  }
};
