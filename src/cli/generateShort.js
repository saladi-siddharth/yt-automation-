import { scheduleManager } from '../scheduler/scheduleManager.js';

async function main() {
  console.log('[CLI] Generating Hindi Viral Short...');
  try {
    const res = await scheduleManager.generateAndPublishVideo('short', null);
    console.log('[CLI SUCCESS] Short generated & published PUBLIC on YouTube:', res.registered ? res.registered.titleHindi : res.scriptPayload.titleHindi);
    process.exit(0);
  } catch (e) {
    console.error('[CLI ERROR]', e);
    process.exit(1);
  }
}

main();
