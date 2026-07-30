import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { EdgeTTS } from 'node-edge-tts';
import { config } from '../config/config.js';

export const viralAudioEngine = {
  /**
   * Generates Microsoft Edge Neural Hindi speech voiceovers
   * Voice: hi-IN-MadhurNeural (deep male narrator)
   * Rate: +12% faster for energetic pacing
   * Volume: +15% louder for clarity
   * Pitch: +2Hz for a crisper, more authoritative tone
   */
  async generateHindiAudio(scriptPayload, outputId) {
    const audioDir = path.join(config.outputDir, outputId);
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const audioFilePath = path.join(audioDir, 'narration_hindi.mp3');
    const srtFilePath = path.join(audioDir, 'subtitles_hindi.srt');

    console.log(`[AudioEngine] Generating Microsoft Edge Neural Hindi voiceover for "${scriptPayload.titleHindi}"...`);
    console.log(`[AudioEngine] Voice: hi-IN-MadhurNeural | Rate: +12% | Volume: +15% | Pitch: +2Hz`);

    const segments = scriptPayload.segments || [];
    let srtContent = '';
    let currentTime = 0;
    const audioBuffers = [];

    for (let idx = 0; idx < segments.length; idx++) {
      const seg = segments[idx];
      const startTimeStr = this.formatSrtTime(currentTime);
      const duration = seg.timeSec || 5;
      currentTime += duration;
      const endTimeStr = this.formatSrtTime(currentTime);

      srtContent += `${idx + 1}\n`;
      srtContent += `${startTimeStr} --> ${endTimeStr}\n`;
      srtContent += `${seg.textHindi}\n\n`;

      const chunkAudioPath = path.join(audioDir, `speech_chunk_${idx + 1}.mp3`);
      let success = false;

      // Try EdgeTTS with enhanced voice settings
      try {
        const tts = new EdgeTTS({
          voice: 'hi-IN-MadhurNeural',
          lang: 'hi-IN',
          outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
          rate: '+12%',
          volume: '+15%',
          pitch: '+2Hz'
        });
        await tts.ttsPromise(seg.textHindi, chunkAudioPath);
        if (fs.existsSync(chunkAudioPath) && fs.statSync(chunkAudioPath).size > 500) {
          audioBuffers.push(fs.readFileSync(chunkAudioPath));
          success = true;
        }
      } catch (e) {
        console.warn(`[AudioEngine] EdgeTTS chunk ${idx + 1} info: ${e.message}`);
      }

      // Fallback to Google Translate TTS
      if (!success) {
        try {
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(seg.textHindi)}&tl=hi&client=tw-ob`;
          const resp = await axios.get(ttsUrl, { responseType: 'arraybuffer' });
          audioBuffers.push(Buffer.from(resp.data));
        } catch (err) {
          console.warn(`[AudioEngine] Fallback chunk ${idx + 1} error: ${err.message}`);
        }
      }
    }

    fs.writeFileSync(srtFilePath, srtContent, 'utf-8');

    if (audioBuffers.length > 0) {
      const fullAudioBuffer = Buffer.concat(audioBuffers);
      fs.writeFileSync(audioFilePath, fullAudioBuffer);
      console.log(`[AudioEngine] Premium Neural Hindi MP3 narration saved -> ${audioFilePath} (${fullAudioBuffer.length} bytes)`);
    }

    return {
      audioPath: audioFilePath,
      srtPath: srtFilePath,
      durationTotalSec: currentTime,
      segments: scriptPayload.segments,
      voiceUsed: 'hi-IN-MadhurNeural (+12% rate, +15% volume, +2Hz pitch)'
    };
  },

  formatSrtTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    const millis = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
    return `${hrs}:${mins}:${secs},${millis}`;
  }
};
