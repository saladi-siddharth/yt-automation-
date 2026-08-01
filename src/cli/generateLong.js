import { scheduleManager } from '../scheduler/scheduleManager.js';

async function main() {
  console.log('[CLI] Generating Hindi Viral Long Video (Topic: Space Mysteries)...');
  try {
    const topic = "15 Most Shocking Space Mysteries That Science Cannot Explain";
    const res = await scheduleManager.generateAndPublishVideo('long', null, topic);
    console.log('[CLI SUCCESS] Long Video generated & published PUBLIC on YouTube:', res.registered ? res.registered.titleHindi : res.scriptPayload.titleHindi);
    process.exit(0);
  } catch (e) {
    console.error('[CLI ERROR]', e);
    process.exit(1);
  }
}

main();
