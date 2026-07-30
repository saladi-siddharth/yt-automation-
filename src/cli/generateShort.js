import { scheduleManager } from '../scheduler/scheduleManager.js';

async function main() {
  console.log('[CLI] Generating Hindi Viral Short...');
  try {
    const targetPublishTime = new Date();
    targetPublishTime.setMinutes(targetPublishTime.getMinutes() + 15);
    const res = await scheduleManager.generateAndPublishVideo('short', targetPublishTime);
    console.log('[CLI SUCCESS] Short generated:', res.registered.titleHindi);
    process.exit(0);
  } catch (e) {
    console.error('[CLI ERROR]', e);
    process.exit(1);
  }
}

main();
