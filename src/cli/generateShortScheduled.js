import { scheduleManager } from '../scheduler/scheduleManager.js';
import { config } from '../config/config.js';

async function main() {
  console.log('[CLI] Generating Hindi Viral Short scheduled dynamically for the next slot...');
  try {
    const now = new Date();
    let targetDate = null;

    // Find the next upcoming slot in config.shortsTimes (e.g. ['08:00', '16:00', '20:00'])
    const slots = config.shortsTimes.map(timeStr => {
      const [h, m] = timeStr.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    });

    // Sort slots ascending
    slots.sort((a, b) => a.getTime() - b.getTime());

    // Find first slot that is in the future
    for (const slot of slots) {
      if (slot.getTime() > now.getTime()) {
        targetDate = slot;
        break;
      }
    }

    // If all slots today have passed, pick the first slot tomorrow
    if (!targetDate) {
      const [h, m] = config.shortsTimes[0].split(':').map(Number);
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 1);
      targetDate.setHours(h, m, 0, 0);
    }

    console.log(`[CLI] Next available publishing slot calculated: ${targetDate.toString()} (ISO: ${targetDate.toISOString()})`);

    const res = await scheduleManager.generateAndPublishVideo('short', targetDate);
    console.log('[CLI SUCCESS] Short generated and scheduled successfully!');
    process.exit(0);
  } catch (e) {
    console.error('[CLI ERROR]', e);
    process.exit(1);
  }
}

main();
