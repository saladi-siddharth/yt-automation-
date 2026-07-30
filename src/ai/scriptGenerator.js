import { config } from '../config/config.js';
import axios from 'axios';
import { SHORTS_TOPICS } from './topicDatabase.js';

export const scriptGenerator = {
  /**
   * Gemini AI Script Call (Fallback to internal engine)
   */
  async generateWithGemini(prompt) {
    if (!config.geminiApiKey) return null;
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.geminiApiKey}`;
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
      });
      if (response.data && response.data.candidates && response.data.candidates[0]) {
        const rawText = response.data.candidates[0].content.parts[0].text;
        const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedJson);
      }
    } catch (e) {
      console.warn(`[GeminiAPI] Call info, using internal generator: ${e.message}`);
      return null;
    }
  },

  /**
   * Generate complete viral Hindi script payload for Shorts or Long videos
   */
  async generateHindiScript(topicCandidate, type = 'short') {
    const keyword = topicCandidate.keyword || 'Animals';
    const category = topicCandidate.category || 'Nature';
    const topicText = topicCandidate.titleEnglish || keyword;

    if (config.geminiApiKey && topicCandidate.isRawIdea) {
      const segmentCount = type === 'short' ? 7 : 10;
      const aiPrompt = `Act as an elite Hollywood screenwriter and YouTube master. Generate a hyper-viral Hindi script for a YouTube ${type.toUpperCase()} about "${topicText}" (${category}). 
      CRITICAL INSTRUCTIONS:
      1. Use "Open Loops": The first sentence MUST tease a shocking secret or ending that is only revealed in the final segment, forcing 100% watch-time.
      2. Use Psychological Hooks: Evoke curiosity, fear, or greed (e.g., "This one mistake is destroying your X...").
      3. Use SSML Tags: Wrap highly dramatic words in <prosody rate="slow" pitch="-2st">...</prosody> and add <break time="800ms"/> before huge reveals.
      
      You MUST return exactly ${segmentCount} segments.
      Return ONLY a JSON object (no markdown, no extra text) with the following structure:
      {
        "type": "${type}",
        "language": "hindi",
        "titleHindi": "Your hyper-viral hindi title",
        "titleEnglish": "${topicText}",
        "targetDurationSec": ${type === 'short' ? 55 : 660},
        "viralScore": 99,
        "segments": [
          { "id": 1, "timeSec": 5, "textHindi": "Hindi narration with SSML tags", "stockQuery": "english visual search query", "keywordHighlight": "1-2 hindi words" }
        ],
        "fullHindiTranscript": "Full combined narration",
        "metadata": {
          "titleHindi": "Title", "descriptionHindi": "Desc", "tags": ["tag1", "tag2"], "thumbnailPrompt": "Midjourney style prompt"
        }
      }`;
      const aiResponse = await this.generateWithGemini(aiPrompt);
      if (aiResponse) {
        console.log(`[GeminiAI] Successfully generated Pro-Level dynamic AI script for "${topicText}"!`);
        return aiResponse;
      }
    }

    if (type === 'short') {
      return this.generateHindiShortScript(keyword, category);
    } else {
      return this.generateHindiLongScript(topicCandidate);
    }
  },

  /**
   * Generate 50-60 Seconds Full Hindi Short Script (7 Segments)
   * Picks from 25-category mega topic database (Animals, Space, Science, Human Body, Ocean, etc.)
   */
  generateHindiShortScript(keyword, category) {
    const topicIndex = Date.now() % SHORTS_TOPICS.length;
    const chosen = SHORTS_TOPICS[topicIndex];

    console.log(`[ScriptGenerator] Selected category: ${chosen.category} | Subcategory: ${chosen.subcategory} | Topic: ${chosen.titleEnglish}`);

    return {
      type: 'short',
      language: 'hindi',
      titleHindi: chosen.titleHindi,
      titleEnglish: chosen.titleEnglish,
      targetDurationSec: 55,
      viralScore: 99,
      segments: chosen.segments,
      fullHindiTranscript: chosen.segments.map(s => s.textHindi).join(' '),
      metadata: chosen.metadata
    };
  },

  /**
   * Generate 10 to 12 Minutes Full Hindi Long Video Script (600 - 720 Seconds)
   */
  generateHindiLongScript(topicCandidate) {
    const titleHindi = topicCandidate.titleHindi || "दुनिया के 10 सबसे ख़तरनाक और अनोखे जीव 😱 | Top 10 Deadliest Animals in Hindi";
    
    return {
      type: 'long',
      language: 'hindi',
      titleHindi,
      titleEnglish: topicCandidate.titleEnglish || "Top 10 Deadliest & Most Mysterious Creatures on Earth",
      targetDurationSec: 660,
      viralScore: 99,

      introHook: "नमस्कार दोस्तों! आज की इस 11 मिनट की स्पेशल वीडियो में हम आपको पृथ्वी पर रहने वाले 10 ऐसे ख़तरनाक और अनोखे जीवों की दुनिया में ले चलेंगे, जिनके कारनामे देखकर आपके रोंगटे खड़े हो जाएंगे! वीडियो को अंत तक ज़रूर देखें!",

      segments: [
        { id: 1, timeSec: 60, textHindi: "दोस्तों, पृथ्वी का 70 प्रतिशत हिस्सा समुद्र से ढका हुआ है, जहाँ ऐसे-ऐसे रहस्यमयी जीव रहते हैं जिनकी ताक़त का अंदाज़ा लगाना भी नामुमकिन है! चलिए शुरू करते हैं नंबर 10 से!", stockQuery: "wildlife dangerous ocean intro 4K", keywordHighlight: "10 ख़तरनाक जीव" },
        { id: 2, timeSec: 120, textHindi: "नंबर 10 - पिस्तौल श्रिम्प। यह नन्हा सा जीव समुद्र की गहराइयों में 4,000 डिग्री सेल्सियस का धमाका करता है!", stockQuery: "pistol shrimp underwater action", keywordHighlight: "नंबर 10 - पिस्तौल श्रिम्प" },
        { id: 3, timeSec: 180, textHindi: "नंबर 9 - बॉक्स जेलीफ़िश। इसका ज़हर 2 मिनट में इंसान के दिल की धड़कन रोक देता है!", stockQuery: "box jellyfish swimming deep ocean", keywordHighlight: "नंबर 9 - बॉक्स जेलीफ़िश" },
        { id: 4, timeSec: 240, textHindi: "नंबर 8 - ब्लैक मम्बा। यह सांप 20 किलोमीटर प्रति घंटा की रफ़्तार से हमला करता है!", stockQuery: "black mamba snake strike jungle", keywordHighlight: "नंबर 8 - ब्लैक मम्बा" },
        { id: 5, timeSec: 300, textHindi: "नंबर 7 - साल्टवॉटर क्रोकोडाइल। दुनिया की सबसे शक्तिशाली बाइट फ़ोर्स!", stockQuery: "saltwater crocodile underwater hunting", keywordHighlight: "नंबर 7 - मगरमच्छ" },
        { id: 6, timeSec: 360, textHindi: "नंबर 6 - गोल्डन पॉइज़न फ्रॉग। इसे छूने मात्र से 20 इंसानों की जान जा सकती है!", stockQuery: "golden poison dart frog rainforest", keywordHighlight: "नंबर 6 - ज़हरीला मेंढक" },
        { id: 7, timeSec: 420, textHindi: "नंबर 5 - ग्रेट व्हाइट शार्क। 300 नुकीले दांत और मीलों दूर से ख़ून सूंघने की ताक़त!", stockQuery: "great white shark ocean hunting 4K", keywordHighlight: "नंबर 5 - ग्रेट व्हाइट शार्क" },
        { id: 8, timeSec: 480, textHindi: "नंबर 4 - अफ़्रीकी हाथी। एक ही झटके में किसी भी शिकारी को कुचल सकता है!", stockQuery: "african elephant safari charging", keywordHighlight: "नंबर 4 - अफ़्रीकी हाथी" },
        { id: 9, timeSec: 540, textHindi: "नंबर 3 - कॉन शेल स्नेल। घातक न्यूरोटॉक्सिन तीर छोड़ता है जिसका कोई तोड़ नहीं!", stockQuery: "cone snail underwater reef", keywordHighlight: "नंबर 3 - कॉन शेल" },
        { id: 10, timeSec: 600, textHindi: "नंबर 2 - ग्रिज़ली बियर। एक ही पंजे के वार से रीढ़ की हड्डी तोड़ सकता है!", stockQuery: "grizzly bear river fishing salmon", keywordHighlight: "नंबर 2 - ग्रिज़ली भालू" },
        { id: 11, timeSec: 660, textHindi: "नंबर 1 - ब्लू-रिंग्ड ऑक्टोपस! पलक झपकते ही पैरालाइज़ कर देने वाला ज़हर! ऐसे ही रोमांचक वीडियो के लिए सब्सक्राइब करें!", stockQuery: "blue ringed octopus venomous ocean", keywordHighlight: "नंबर 1 - ऑक्टोपस" }
      ],

      fullHindiTranscript: "नमस्कार दोस्तों! आज दुनिया के 10 सबसे ख़तरनाक जीव... नंबर 10 पिस्तौल श्रिम्प, नंबर 9 बॉक्स जेलीफ़िश, नंबर 8 ब्लैक मम्बा, नंबर 7 मगरमच्छ, नंबर 6 ज़हरीला मेंढक, नंबर 5 ग्रेट व्हाइट शार्क, नंबर 4 अफ़्रीकी हाथी, नंबर 3 कॉन शेल, नंबर 2 ग्रिज़ली भालू, और नंबर 1 ब्लू-रिंग्ड ऑक्टोपस!",

      metadata: {
        titleHindi: "दुनिया के 10 सबसे ख़तरनाक जीव 😱 | Unbelievable Animal Facts in Hindi",
        descriptionHindi: "इस 11-मिनट की स्पेशल वीडियो में जानिए पृथ्वी के 10 सबसे ख़तरनाक जीवों के बारे में! #animalfacts #hindi #wildlife #nature",
        tags: ["animal facts hindi", "top 10 deadliest animals hindi", "wildlife hindi", "nature facts hindi"],
        thumbnailPrompt: "Split-screen glowing ocean monster and black mamba snake with bold yellow Hindi title '10 सबसे ख़तरनाक जीव!'"
      }
    };
  }
};
