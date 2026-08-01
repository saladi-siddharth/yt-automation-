import { scheduleManager } from '../scheduler/scheduleManager.js';

async function main() {
  console.log('[CLI] Generating Hindi Viral Long Video...');
  try {
    const targetPublishTime = new Date();
    targetPublishTime.setMinutes(targetPublishTime.getMinutes() + 60);
    const res = await scheduleManager.generateAndPublishVideo('long', targetPublishTime);
    console.log('[CLI SUCCESS] Long Video generated:', res.registered ? res.registered.titleHindi : res.scriptPayload.titleHindi);
    process.exit(0);
  } catch (e) {
    console.error('[CLI ERROR]', e);
    process.exit(1);
  }
}

main();
