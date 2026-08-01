import { youtubeUploader } from '../upload/youtubeUploader.js';

async function main() {
  const videoId = 'nayx5I9u79I';
  // 11:00 PM IST tonight = 2026-08-01T23:00:00+05:30 -> 2026-08-01T17:30:00.000Z
  const targetISO = '2026-08-01T17:30:00.000Z';

  console.log(`Scheduling video ${videoId} to publish at 11:00 PM IST (${targetISO})...`);
  try {
    await youtubeUploader.updateVideoSchedule({ videoId, publishAtISO: targetISO });
    console.log(`[SUCCESS] Video ${videoId} is now scheduled to automatically release publicly at 11:00 PM IST tonight!`);
    process.exit(0);
  } catch (e) {
    console.error(`[ERROR] Scheduling failed:`, e.message);
    process.exit(1);
  }
}

main();
