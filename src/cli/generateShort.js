import { scheduleManager } from '../scheduler/scheduleManager.js';

async function main() {
  console.log('[CLI] Generating Hindi Viral Short (Target 11 PM Release)...');
  try {
    const topic = "The Terrifying Secret of Black Hole Singularity Revealed #Shorts";
    const res = await scheduleManager.generateAndPublishVideo('short', null, topic);
    console.log('[CLI SUCCESS] Short generated & published PUBLIC on YouTube:', res.registered ? res.registered.titleHindi : res.scriptPayload.titleHindi);
    process.exit(0);
  } catch (e) {
    console.error('[CLI ERROR]', e);
    process.exit(1);
  }
}

main();
