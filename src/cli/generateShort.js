import { scheduleManager } from '../scheduler/scheduleManager.js';

async function main() {
  console.log('[CLI] Generating Hindi Viral Short (Scheduled for 11:00 PM IST Tonight)...');
  try {
    const targetPublishTime = new Date();
    targetPublishTime.setHours(23, 0, 0, 0); // 11:00 PM IST tonight
    const topic = "The Most Terrifying Deep Sea Monster Discovered #Shorts";
    const res = await scheduleManager.generateAndPublishVideo('short', targetPublishTime, topic);
    console.log('[CLI SUCCESS] Scheduled Short generated & registered for 11 PM release:', res.registered ? res.registered.titleHindi : res.scriptPayload.titleHindi);
    process.exit(0);
  } catch (e) {
    console.error('[CLI ERROR]', e);
    process.exit(1);
  }
}

main();
