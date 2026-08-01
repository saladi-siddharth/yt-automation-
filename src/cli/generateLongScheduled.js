import { scheduleManager } from '../scheduler/scheduleManager.js';

async function main() {
  console.log('[CLI] Generating Hindi Viral Long Video scheduled for tomorrow 12:00 PM...');
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(12, 0, 0, 0);
    console.log(`[CLI] Target Publish Date: ${targetDate.toString()} (ISO: ${targetDate.toISOString()})`);

    const res = await scheduleManager.generateAndPublishVideo('long', targetDate);
    console.log('[CLI SUCCESS] Long Video generated and scheduled successfully!');
    process.exit(0);
  } catch (e) {
    console.error('[CLI ERROR]', e);
    process.exit(1);
  }
}

main();
