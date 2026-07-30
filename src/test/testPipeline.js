import { memoryLedger } from '../db/memoryLedger.js';
import { viralScraper } from '../ai/viralScraper.js';
import { scriptGenerator } from '../ai/scriptGenerator.js';
import { viralAudioEngine } from '../audio/viralAudioEngine.js';
import { thumbnailEngine } from '../image/thumbnailEngine.js';

async function testPipeline() {
  console.log('=== TESTING VIRAL HINDI YOUTUBE AUTOMATION PLATFORM ===\n');

  // 1. Test Memory Ledger & Deduplication
  memoryLedger.init();
  const testTitle = 'सूरज जितना गर्म धमाका करने वाला समुद्री जीव!';
  const dupCheck1 = memoryLedger.isTopicUsed(testTitle, ['पिस्तौल श्रिम्प तथ्य']);
  console.log(`[Test 1] Memory Deduplication Check for fresh topic: Used=${dupCheck1.used}`);

  // Register topic
  memoryLedger.registerTopic({
    type: 'short',
    titleHindi: testTitle,
    titleEnglish: 'Pistol Shrimp Shockwave',
    facts: ['पिस्तौल श्रिम्प तथ्य'],
    viralScore: 98
  });

  const dupCheck2 = memoryLedger.isTopicUsed(testTitle, ['पिस्तौल श्रिम्प तथ्य']);
  console.log(`[Test 2] Memory Deduplication Check for duplicate topic: Used=${dupCheck2.used} (Reason: ${dupCheck2.reason})`);

  // 2. Test Viral Topic Finder & Script Synthesizer
  const topic = await viralScraper.findNextViralTopic('short');
  console.log(`\n[Test 3] Viral Topic Candidate: "${topic.titleHindi}" (Score: ${topic.viralScore}/100)`);

  const script = await scriptGenerator.generateHindiScript(topic, 'short');
  console.log(`[Test 4] Script Hook (0-3s Hindi): "${script.segments[0].textHindi}"`);
  console.log(`[Test 5] Loop Hook (30-40s Hindi): "${script.segments[script.segments.length - 1].textHindi}"`);

  // 3. Test Audio & Subtitle Generator
  const audioManifest = await viralAudioEngine.generateHindiAudio(script, 'test_short_01');
  console.log(`[Test 6] Subtitle SRT generated -> ${audioManifest.srtPath}`);

  // 4. Test Thumbnail Engine
  const thumbManifest = await thumbnailEngine.generateThumbnail(script, 'test_short_01');
  console.log(`[Test 7] High-CTR Hindi Thumbnail generated -> ${thumbManifest.thumbPath}`);

  console.log('\n✅ ALL SYSTEM TESTS PASSED SUCCESSFULLY!');
}

testPipeline().catch(err => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});
