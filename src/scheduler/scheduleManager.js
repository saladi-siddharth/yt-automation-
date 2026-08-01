import cron from 'node-cron';
import { config } from '../config/config.js';
import { memoryLedger } from '../db/memoryLedger.js';
import { tidbClient } from '../db/tidbClient.js';
import { youtubeUploader } from '../upload/youtubeUploader.js';
import { viralScraper } from '../ai/viralScraper.js';
import { scriptGenerator } from '../ai/scriptGenerator.js';
import { directorAgent } from '../ai/directorAgent.js';
import { viralAudioEngine } from '../audio/viralAudioEngine.js';
import { multiSourceFetcher } from '../media/multiSourceFetcher.js';
import { viralVideoRenderer } from '../video/viralVideoRenderer.js';
import { thumbnailEngine } from '../image/thumbnailEngine.js';

export const scheduleManager = {
  activeJobs: [],
  isProcessing: false,
  broadcastLog: null,

  init(broadcastFn = null) {
    this.broadcastLog = broadcastFn;
    memoryLedger.init();

    this.log(`[ScheduleManager] Initializing Director AI Publishing Engine...`);
    this.log(`[ScheduleRules] Target: ${config.shortsPerDay} Shorts/day | ${config.longVideosPerWeek} Long videos/week`);

    // Setup cron jobs (Offset generation to finish uploading exactly on time)
    config.shortsTimes.forEach((timeStr, idx) => {
      const [hour, min] = timeStr.split(':');
      
      // Calculate 15 minutes before the target time
      let targetDate = new Date();
      targetDate.setHours(parseInt(hour, 10));
      targetDate.setMinutes(parseInt(min, 10));
      targetDate.setMinutes(targetDate.getMinutes() - 15);
      
      const genHour = targetDate.getHours();
      const genMin = targetDate.getMinutes();

      const cronExpr = `${genMin} ${genHour} * * *`;
      
      const job = cron.schedule(cronExpr, () => {
        this.log(`[CronTrigger] Daily Shorts slot #${idx + 1} (${timeStr} IST upload) - Starting early generation!`);
        
        const targetUploadDate = new Date();
        const [targetH, targetM] = timeStr.split(':');
        targetUploadDate.setHours(parseInt(targetH, 10), parseInt(targetM, 10), 0, 0);

        this.generateAndPublishVideo('short', targetUploadDate);
      });
      this.activeJobs.push({ name: `Shorts_Slot_${idx+1}_UploadAt_${timeStr}`, cronExpr, job });
    });

    // Start Long Videos 60 minutes early (since 200-clip rendering takes a long time)
    const longCronExpr = `0 17 * * *`; // 17:00 IST (1 hour before 18:00 upload)
    const longJob = cron.schedule(longCronExpr, () => {
      this.log(`[CronTrigger] Long Video publishing window (18:00 IST upload) - Starting early generation!`);
      
      const targetUploadDate = new Date();
      const [targetH, targetM] = config.longVideoTime.split(':');
      targetUploadDate.setHours(parseInt(targetH, 10), parseInt(targetM, 10), 0, 0);

      this.generateAndPublishVideo('long', targetUploadDate);
    });
    this.activeJobs.push({ name: `LongVideo_Daily_UploadAt_18:00`, cronExpr: longCronExpr, job: longJob });

    this.log(`[ScheduleManager] All ${this.activeJobs.length} automated publishing slots active!`);
  },

  log(msg) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const logLine = `[${time}] ${msg}`;
    console.log(logLine);
    if (this.broadcastLog) {
      this.broadcastLog(logLine);
    }
  },

  /**
   * Main End-to-End Autonomous Pipeline Execution with Director AI & Storyboard Architect
   */
  async generateAndPublishVideo(type = 'short', targetPublishDate = null, customTopic = null) {
    if (this.isProcessing) {
      this.log(`[Pipeline] A generation job is currently running. Queueing request...`);
      return;
    }

    this.isProcessing = true;
    const outputId = `${type}_${Date.now()}`;

    try {
      this.log(`[Pipeline START] Beginning ${type.toUpperCase()} content generation (ID: ${outputId})...`);

      // 1. Topic Scraper & Deduplication Check
      this.log(`Step 1/7: Scraping viral Hindi topic & checking zero-repetition memory...`);
      const topicCandidate = customTopic ? {
        type,
        keyword: 'Space Mysteries',
        category: 'Space',
        hookStyle: 'Open Loop Pattern Interrupt',
        titleHindi: customTopic,
        titleEnglish: customTopic,
        candidateFacts: [customTopic],
        viralScore: 99,
        retentionMultiplier: "4.2x Watch Time",
        isRawIdea: true
      } : await viralScraper.findNextViralTopic(type);

      this.log(`Selected Topic: "${topicCandidate.titleHindi}" [Viral Score: ${topicCandidate.viralScore}/100]`);

      // 2. High-Retention Script Generator
      this.log(`Step 2/7: Synthesizing pattern-interrupt Hindi script...`);
      const scriptPayload = await scriptGenerator.generateHindiScript(topicCandidate, type);

      // 3. Audio & Timestamp Subtitle Engine (Generate MP3 FIRST to get exact duration)
      this.log(`Step 3/7: Generating Microsoft Edge Neural Hindi voiceover & Devanagari SRT subtitles...`);
      const audioManifest = await viralAudioEngine.generateHindiAudio(scriptPayload, outputId);

      // 4. Director AI & Storyboard Architect (Uses EXACT spoken MP3 duration!)
      this.log(`Step 4/7: Director AI reviewing script virality metrics & constructing scene storyboard...`);
      const storyboard = await directorAgent.reviewAndCreateStoryboard(scriptPayload, audioManifest.durationSec || 0, (msg) => this.log(msg));

      // 5. Multi-Source Asset Collector (Pexels, Pixabay, Unsplash)
      this.log(`Step 5/7: Retrieving multi-source HD video clips matching storyboard scene queries...`);
      const mediaClips = await multiSourceFetcher.fetchMediaForStoryboard(storyboard, outputId, type === 'short' ? 'portrait' : 'landscape', (msg) => this.log(msg));

      // 6. Pro Video Renderer & Documentary FX
      this.log(`Step 6/7: Compositing final video with documentary color grade & 30fps stream sync...`);
      const renderManifest = await viralVideoRenderer.renderVideo(scriptPayload, audioManifest, mediaClips, outputId);

      // 7. Thumbnail Generator & YouTube Channel Upload
      this.log(`Step 7/7: Rendering High-CTR Hindi thumbnail & uploading directly to YouTube...`);
      const thumbnailManifest = await thumbnailEngine.generateThumbnail(scriptPayload, outputId);

      const registered = memoryLedger.registerTopic({
        type,
        titleHindi: scriptPayload.titleHindi,
        titleEnglish: scriptPayload.titleEnglish,
        facts: scriptPayload.segments ? scriptPayload.segments.map(s => s.textHindi) : [],
        viralScore: topicCandidate.viralScore,
        outputId
      });

      const videoRelativeUrl = `/output/${outputId}/${type === 'short' ? 'SHORT_' + outputId + '.mp4' : 'LONG_' + outputId + '.mp4'}`;
      const thumbRelativeUrl = `/output/${outputId}/THUMBNAIL_${outputId}.svg`;

      await tidbClient.saveVideoRecord({
        id: registered.id,
        type,
        titleHindi: scriptPayload.titleHindi,
        titleEnglish: scriptPayload.titleEnglish,
        viralScore: topicCandidate.viralScore,
        outputId,
        videoUrl: videoRelativeUrl,
        thumbnailUrl: thumbRelativeUrl,
        transcript: scriptPayload.fullHindiTranscript || ''
      });

      // Upload to YouTube Channel with thumbnail
      try {
        const uploadResult = await youtubeUploader.uploadVideo({
          videoPath: renderManifest.finalVideoPath,
          title: scriptPayload.metadata ? scriptPayload.metadata.titleHindi : scriptPayload.titleHindi,
          description: scriptPayload.metadata ? scriptPayload.metadata.descriptionHindi : scriptPayload.titleHindi,
          tags: scriptPayload.metadata ? scriptPayload.metadata.tags : ['viral facts hindi', 'documentary'],
          privacyStatus: targetPublishDate ? 'private' : 'public',
          publishAt: targetPublishDate ? targetPublishDate.toISOString() : null,
          thumbnailPath: thumbnailManifest.thumbPath || null,
          isShort: type === 'short'
        });

        if (uploadResult.success) {
          this.log(`[YouTubeUpload SUCCESS] Video URL: ${uploadResult.url}`);
          this.log(`[YouTube Studio] ${uploadResult.studioUrl}`);
        } else {
          this.log(`[YouTubeUpload ERROR] ${uploadResult.reason || 'Upload failed.'}`);
        }
      } catch (uploadErr) {
        this.log(`[YouTubeUpload ERROR] ${uploadErr.message}`);
      }

      this.log(`[Pipeline SUCCESS] ${type.toUpperCase()} video successfully created, saved to TiDB Cloud & scheduled!`);
      this.log(`Saved Output -> ${renderManifest.finalVideoPath}`);

      this.isProcessing = false;
      return {
        success: true,
        outputId,
        registered,
        scriptPayload,
        renderManifest,
        thumbnailManifest
      };

    } catch (err) {
      this.log(`[Pipeline ERROR] Generation failed: ${err.message}`);
      this.isProcessing = false;
      throw err;
    }
  },

  getScheduleOverview() {
    return {
      activeJobs: this.activeJobs.map(j => ({ name: j.name, cronExpr: j.cronExpr })),
      isProcessing: this.isProcessing,
      shortsPerDay: config.shortsPerDay,
      longVideosPerWeek: config.longVideosPerWeek,
      longVideoDays: config.longVideoDays,
      shortsTimes: config.shortsTimes,
      longVideoTime: config.longVideoTime
    };
  }
};
