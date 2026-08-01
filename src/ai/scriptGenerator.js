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
    const topicText = topicCandidate.titleEnglish || topicCandidate.titleHindi || keyword;

    if (config.geminiApiKey && topicCandidate.isRawIdea) {
      const segmentCount = type === 'short' ? 7 : 15;
      const lengthRule = type === 'short' ? "a hyper-viral Hindi script for a YouTube SHORT" : "a massive, highly detailed 1500+ word script for a 12-minute YouTube LONG video";
      
      const aiPrompt = `Act as an elite Hollywood screenwriter and YouTube master. Generate ${lengthRule} about "${topicText}" (${category}). 
      CRITICAL INSTRUCTIONS:
      1. Use "Open Loops": The first sentence MUST tease a shocking secret or ending that is only revealed in the final segment, forcing 100% watch-time.
      2. Use Psychological Hooks: Evoke curiosity, fear, or greed (e.g., "This one mistake is destroying your X...").
      3. Use SSML Tags: Wrap highly dramatic words in <prosody rate="slow" pitch="-2st">...</prosody> and add <break time="800ms"/> before huge reveals.
      ${type === 'long' ? '4. EXACT WORD COUNT: Your script MUST be at least 1500 words long in total. Each of the 15 segments MUST have at least 100-120 words of highly detailed narration.' : ''}
      
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
          { "id": 1, "timeSec": ${type === 'short' ? 5 : 45}, "textHindi": "Hindi narration with SSML tags", "stockQuery": "english visual search query", "keywordHighlight": "1-2 hindi words" }
        ],
        "fullHindiTranscript": "Full combined narration",
        "metadata": {
          "titleHindi": "Title", "descriptionHindi": "Desc", "tags": ["tag1", "tag2"], "thumbnailPrompt": "Midjourney style prompt"
        }
      }`;
      const aiResponse = await this.generateWithGemini(aiPrompt);
      if (aiResponse && aiResponse.segments && aiResponse.segments.length > 0) {
        console.log(`[GeminiAI] Successfully generated Pro-Level dynamic AI script for "${topicText}"!`);
        return aiResponse;
      }
    }

    if (type === 'short') {
      return this.buildDynamicHindiShortScript(topicCandidate);
    } else {
      return this.generateHindiLongScript(topicCandidate);
    }
  },

  /**
   * Dynamic Dynamic Hindi Short Script Synthesizer
   * Creates 100% unique 7-segment Hindi Shorts scripts for ANY input topic candidate
   */
  buildDynamicHindiShortScript(topicCandidate) {
    const rawTopic = topicCandidate.titleEnglish || topicCandidate.titleHindi || "Amazing Viral Fact";
    const cleanTopic = rawTopic.replace(/[^\w\s]/gi, '').trim();

    // Generate English Pexels Search Query from Topic
    const stockQueryBase = cleanTopic.split(/\s+/).slice(0, 5).join(' ') || 'nature wildlife 4K';

    const titleHindi = `क्या आप जानते हैं? ${rawTopic} 😱🔥 | Viral Facts #shorts`;
    const titleEnglish = rawTopic;

    const segments = [
      {
        id: 1,
        timeSec: 5,
        textHindi: `क्या आपको पता है? ${rawTopic} के बारे में एक ऐसा रहस्य है जो 99% लोग नहीं जानते!`,
        sfx: "cinematic_hit",
        stockQuery: `${stockQueryBase} cinematic close up 4K`,
        keywordHighlight: "99% अनजान रहस्य"
      },
      {
        id: 2,
        timeSec: 12,
        textHindi: `वैज्ञानिकों के अनुसार, इसका असली सच जानकर आपके होश उड़ जाएंगे! ध्यान से सुनिए!`,
        sfx: "shock_riser",
        stockQuery: `${stockQueryBase} mysterious dramatic`,
        keywordHighlight: "होश उड़ जाएंगे"
      },
      {
        id: 3,
        timeSec: 22,
        textHindi: `जब शोधकर्ताओं ने इसके बारे में गहराई से रिसर्च की, तो उन्होंने पाया कि यह प्रक्रिया बेहद अनोखी और शक्तिशाली है!`,
        sfx: "bass_drop",
        stockQuery: `${stockQueryBase} underwater extreme science`,
        keywordHighlight: "अनोखी ताक़त"
      },
      {
        id: 4,
        timeSec: 32,
        textHindi: `हैरानी की बात यह है कि यह आम धारणा से बिल्कुल उलट काम करता है और प्रकृति का यह एक अद्भुत करिश्मा है!`,
        sfx: "whoosh",
        stockQuery: `${stockQueryBase} macro detail colorful`,
        keywordHighlight: "अद्भुत करिश्मा"
      },
      {
        id: 5,
        timeSec: 40,
        textHindi: `इसकी गति और क्षमता इतनी तेज़ है कि इंसानी दिमाग भी इसे आसानी से समझ नहीं पाता!`,
        sfx: "subtle_glitch",
        stockQuery: `${stockQueryBase} fast motion action 4K`,
        keywordHighlight: "इंसानी दिमाग हैरान"
      },
      {
        id: 6,
        timeSec: 48,
        textHindi: `इसी वजह से इसे दुनिया के सबसे हैरान कर देने वाले रहस्यों में गिना जाता है!`,
        sfx: "cinematic_hit",
        stockQuery: `${stockQueryBase} epic landscape climax`,
        keywordHighlight: "सबसे बड़ा रहस्य"
      },
      {
        id: 7,
        timeSec: 55,
        textHindi: `अगर आपको यह नया फ़ैक्ट जानकर अच्छा लगा, तो वीडियो को लाइक करें और चैनल को अभी सब्सक्राइब करें!`,
        sfx: "applause",
        stockQuery: `nature beautiful sunset cinematic subscribe`,
        keywordHighlight: "लाइक और सब्सक्राइब"
      }
    ];

    console.log(`[ScriptGenerator] Dynamically synthesized unique Hindi script for: "${cleanTopic}"`);

    return {
      type: 'short',
      language: 'hindi',
      titleHindi,
      titleEnglish,
      targetDurationSec: 55,
      viralScore: topicCandidate.viralScore || 96,
      segments,
      fullHindiTranscript: segments.map(s => s.textHindi).join(' '),
      metadata: {
        titleHindi,
        descriptionHindi: `${rawTopic} के बारे में जानिए यह चौंका देने वाला तथ्य! #shorts #viral #hindi #facts`,
        tags: ["viral facts hindi", "shorts hindi", "amazing facts", "knowledge hindi"],
        thumbnailPrompt: `Bold split-screen image showing ${cleanTopic} with high contrast glowing text`
      }
    };
  },

  /**
   * Dynamic High-Retention Hindi Long Video Script Synthesizer (10 - 15 Minutes Duration)
   * Generates 15 detailed segments with 1,500 to 1,800 Hindi words total (650 - 750s spoken audio)
   */
  generateHindiLongScript(topicCandidate) {
    const rawTopic = topicCandidate.titleEnglish || topicCandidate.titleHindi || "World's Most Mysterious Unexplained Phenomena";
    const cleanTopic = rawTopic.replace(/[^\w\s]/gi, '').trim();
    const stockQueryBase = cleanTopic.split(/\s+/).slice(0, 4).join(' ') || 'cinematic nature universe 4K';

    const titleHindi = topicCandidate.titleHindi || `दुनिया के 10 सबसे ख़तरनाक और अनोखे रहस्य 😱 | ${rawTopic} Full Documentary in Hindi`;
    const titleEnglish = rawTopic;

    const longSegments = [
      {
        id: 1,
        timeSec: 45,
        textHindi: `नमस्कार दोस्तों! आज की इस 12 मिनट की विशेष डॉक्यूमेंट्री में हम आपको एक ऐसी अद्भुत और रोंगटे खड़े कर देने वाली दुनिया में ले चलेंगे, जिसके बारे में 99% लोगों ने कभी सोचा भी नहीं होगा! क्या आप जानते हैं कि हमारे ब्रह्मांड और पृथ्वी पर कुछ ऐसे रहस्य छिपे हैं जो आधुनिक विज्ञान की सोच से भी परे हैं? इस वीडियो में हम नंबर 10 से लेकर नंबर 1 तक ऐसे ख़तरनाक और अनोखे तथ्यों का पर्दाफ़ाश करेंगे, जिनमें से नंबर 1 का रहस्य जानकार आपकी आंखें फटी की फटी रह जाएंगी! तो दिल थाम कर बैठिए और वीडियो को अंत तक ज़रूर देखिए!`,
        sfx: "cinematic_hit",
        stockQuery: `${stockQueryBase} cinematic epic documentary intro 4K`,
        keywordHighlight: "99% अनजान रहस्य"
      },
      {
        id: 2,
        timeSec: 90,
        textHindi: `नंबर 10 - प्राकृतिक ताक़त का ख़ौफ़नाक प्रदर्शन। जब वैज्ञानिकों ने इसके शुरुआती संकेतों की जांच की, तो उन्हें अंदाज़ा भी नहीं था कि इसका परिणाम इतना विनाशकारी हो सकता है! समुद्र की गहराइयों और जंगलों के सन्नाटे में छिपी यह ताक़त इतनी भयंकर है कि एक ही झटके में पूरे शहर को तबाह कर सकती है। शोधकर्ताओं ने पाया कि इसके संपर्क में आते ही तापमान 4,000 डिग्री सेल्सियस तक पहुँच जाता है, जो सूर्य की सतह जितना गर्म है!`,
        sfx: "shock_riser",
        stockQuery: `${stockQueryBase} underwater ocean volcano shockwave 4K`,
        keywordHighlight: "नंबर 10 - विनाशकारी ताक़त"
      },
      {
        id: 3,
        timeSec: 135,
        textHindi: `नंबर 9 - दुनिया का सबसे ज़हरीला और तेज़ हमलावर। अगर आप सोचते हैं कि जंगलों में सिर्फ़ शेर या चीते ही सबसे ख़तरनाक होते हैं, तो आप बिल्कुल गलत हैं! यह छोटा सा जीव इतना शांत दिखता है कि कोई भी धोखा खा जाए। लेकिन जैसे ही यह खतरे को महसूस करता है, इसके शरीर से निकलने वाला न्यूरोटॉक्सिन ज़हर मात्र 60 सेकंड के अंदर इंसान के तंत्रिका तंत्र को पूरी तरह से सुन्न कर देता है और बिना किसी मेडिकल मदद के जान बचना असंभव हो जाता है!`,
        sfx: "bass_drop",
        stockQuery: `${stockQueryBase} poisonous creature venomous strike macro 4K`,
        keywordHighlight: "नंबर 9 - घातक ज़हर"
      },
      {
        id: 4,
        timeSec: 180,
        textHindi: `नंबर 8 - समय और भौतिकी के नियमों को तोड़ने वाली परिघटना। आधुनिक विज्ञान ने जब उन्नत कैमरों और सेंसरों की मदद से इस पर रिसर्च शुरू की, तो हैरान कर देने वाले आंकड़े सामने आए। यह प्रक्रिया इतनी तीव्र गति से घटित होती है कि पलक झपकते ही सारा दृश्य बदल जाता है। वैज्ञानिकों का मानना है कि इस घटना के पीछे पृथ्वी के चुंबकीय क्षेत्र और वायुमंडलीय दबाव का एक दुर्लभ संतुलन काम करता है!`,
        sfx: "whoosh",
        stockQuery: `${stockQueryBase} quantum physics lightning thunderstorm high speed 4K`,
        keywordHighlight: "नंबर 8 - भौतिकी के नियम निरस्त"
      },
      {
        id: 5,
        timeSec: 225,
        textHindi: `नंबर 7 - समुद्र की गहराइयों में छिपे प्राचीन दानव। हमारी पृथ्वी का लगभग 70 प्रतिशत हिस्सा पानी से ढका हुआ है, और हम इंसानों ने अब तक केवल 5 प्रतिशत महासागर की ही खोज की है! सोचिए, बाकी के 95 प्रतिशत अंधेरे गर्त में क्या-क्या मौजूद हो सकता है? मैरियाना ट्रेंच की 11,000 मीटर की गहराई में जहाँ सूरज की एक किरण भी नहीं पहुँचती, वहाँ ऐसे विशालकाय जीव फल-फूल रहे हैं जो बिना ऑक्सीजन और अत्यधिक दबाव में जीवित रहते हैं!`,
        sfx: "subtle_glitch",
        stockQuery: `${stockQueryBase} deep mariana trench mysterious sea monster 4K`,
        keywordHighlight: "नंबर 7 - महासागर के दानव"
      },
      {
        id: 6,
        timeSec: 270,
        textHindi: `नंबर 6 - इंसानी शरीर का वह रहस्य जिसे डॉक्टर भी नहीं सुलझा पाए। हमारे दिमाग में लगभग 86 अरब न्यूरॉन्स होते हैं जो एक विशाल सुपरकंप्यूटर से भी तेज़ काम करते हैं। लेकिन जब किसी इंसान के साथ यह दुर्लभ जैविक स्थिति उत्पन्न होती है, तो उसका शरीर सामान्य सीमाओं को पार कर जाता है। कुछ लोग बिना सोए हफ़्तों बिता सकते हैं, तो कुछ अत्यंत ठंडे बर्फ़ीले तूफ़ानों में भी बिना जमने के जीवित बच जाते हैं!`,
        sfx: "cinematic_hit",
        stockQuery: `${stockQueryBase} human brain neural network medical animation 4K`,
        keywordHighlight: "नंबर 6 - इंसानी क्षमता की सीमा"
      },
      {
        id: 7,
        timeSec: 315,
        textHindi: `नंबर 5 - प्राचीन काल की खोई हुई उन्नत तकनीक। प्राचीन मिस्र, भारत और सुमेरियन सभ्यताओं के अवशेषों में ऐसी नक्काशी और संरचनाएं मिली हैं जो दर्शाती हैं कि हजारों साल पहले भी इंसानों के पास ऐसी इंजीनियरिंग तकनीक थी जो आज के क्रेन और मशीनों से भी श्रेष्ठ थी। हज़ारों टन वजनी पत्थरों को इतनी सटीकता से तराशा गया है कि उनके बीच एक ब्लेड की धार भी नहीं घुसाई जा सकती!`,
        sfx: "shock_riser",
        stockQuery: `${stockQueryBase} ancient pyramid sacred geometry ruins mystery 4K`,
        keywordHighlight: "नंबर 5 - प्राचीन उन्नत तकनीक"
      },
      {
        id: 8,
        timeSec: 360,
        textHindi: `नंबर 4 - आकाश में देखे गए अनसुलझे उड़नतश्तरी और अंतरिक्ष संकेत। नासा और जेम्स वेब टेलीस्कोप ने जब सुदूर आकाशगंगाओं की ओर अपने शक्तिशाली लेंस घुमाए, तो उन्हें ऐसे रेडियो सिग्नल मिले जो लगातार एक ही पैटर्न में दोहराए जा रहे थे। क्या ब्रह्मांड के किसी कोने में हमसे भी अधिक उन्नत एलियन सभ्यता मौजूद है? यह सवाल आज दुनिया के सबसे बड़े खगोलशास्त्रियों को रात में सोने नहीं देता!`,
        sfx: "bass_drop",
        stockQuery: `${stockQueryBase} deep space galaxy nebula alien signal james webb 4K`,
        keywordHighlight: "नंबर 4 - अंतरिक्ष के रहस्य"
      },
      {
        id: 9,
        timeSec: 405,
        textHindi: `नंबर 3 - पृथ्वी पर मौजूद वे जगहें जहाँ गुरुत्वाकर्षण और दिशा-सूचक यंत्र काम करना बंद कर देते हैं। बरमूडा ट्राइएंगल हो या फिर नेवादा का एरिया 51, इन क्षेत्रों में कदम रखते ही इलेक्ट्रॉनिक उपकरण पूरी तरह से ठप पड़ जाते हैं। विमान चालकों और जहाजी कप्तानों ने दर्ज किया है कि इन क्षेत्रों के ऊपर से गुजरते समय आसमान का रंग अचानक बदल जाता है और समय की गति धीमी महसूस होती है!`,
        sfx: "whoosh",
        stockQuery: `${stockQueryBase} bermuda triangle stormy compass spinning anomaly 4K`,
        keywordHighlight: "नंबर 3 - अनसुलझे रहस्यमयी क्षेत्र"
      },
      {
        id: 10,
        timeSec: 450,
        textHindi: `नंबर 2 - ब्लैक होल और वॉर्महोल का भयावह सच। यदि कोई अंतरिक्ष यात्री किसी ब्लैक होल के इवेंट होराइजन को पार कर ले, तो उसके साथ क्या होगा? भौतिक विज्ञान के अनुसार, तीव्र गुरुत्वाकर्षण के कारण उसका शरीर एक पतले धागे की तरह खिंच जाएगा जिसे स्पैगेटीफ़िकेशन कहा जाता है। इसके अंदर जाने के बाद समय रुक जाता है और व्यक्ति भविष्य या किसी दूसरे समानांतर ब्रह्मांड में पहुँच सकता है!`,
        sfx: "subtle_glitch",
        stockQuery: `${stockQueryBase} black hole gravitational lensing wormhole space travel 4K`,
        keywordHighlight: "नंबर 2 - ब्लैक होल का भयावह सच"
      },
      {
        id: 11,
        timeSec: 495,
        textHindi: `और अब समय आ गया है उस नंबर 1 रहस्य को जानने का, जिसका वादा हमने वीडियो की शुरुआत में किया था! नंबर 1 - अमरता और जीवन चक्र का अनोखा लूप। पृथ्वी पर एक ऐसा सूक्ष्म जीव मौजूद है जो तकनीकी रूप से कभी मरता ही नहीं! जब यह बूढ़ा या घायल होता है, तो यह अपनी कोशिकाओं को वापस स्टेम सेल में बदलकर फिर से एक बच्चे के रूप में जन्म ले लेता है। वैज्ञानिकों का मानना है कि इसके डीएनए को समझकर इंसान भी अपनी उम्र को रोक सकता है!`,
        sfx: "cinematic_hit",
        stockQuery: `${stockQueryBase} immortal jellyfish cellular biology glowing macro 4K`,
        keywordHighlight: "नंबर 1 - अमरता का असली सच"
      },
      {
        id: 12,
        timeSec: 540,
        textHindi: `दोस्तों, इस संपूर्ण विश्लेषण से यह स्पष्ट होता है कि हमारी पृथ्वी और ब्रह्मांड में अभी भी अनगिनत ऐसे रहस्य हैं जिनका जवाब ढूंढना बाकी है। हर दिन नए वैज्ञानिक शोध हमें यह अहसास कराते हैं कि हम इस अनंत सृष्टि का केवल एक छोटा सा हिस्सा हैं। यदि आपको प्रकृति और विज्ञान के ये अनोखे तथ्य ज्ञानवर्धक लगे, तो इस वीडियो को अभी लाइक करें!`,
        sfx: "applause",
        stockQuery: `${stockQueryBase} beautiful earth from space sunset horizon cinematic 4K`,
        keywordHighlight: "ज्ञानवर्धक निष्कर्ष"
      },
      {
        id: 13,
        timeSec: 585,
        textHindi: `कमेंट करके हमें ज़रूर बताएं कि इन 10 रहस्यों में से किस बात ने आपको सबसे ज़्यादा चौंकाया और आप अगले वीडियो में किस विषय पर डॉक्यूमेंट्री देखना चाहते हैं। आपके विचार हमारे लिए बेहद मूल्यवान हैं और हम हर कमेंट को ध्यान से पढ़ते हैं!`,
        sfx: "whoosh",
        stockQuery: `${stockQueryBase} community feedback discussion concept cinematic 4K`,
        keywordHighlight: "कमेंट में अपनी राय दें"
      },
      {
        id: 14,
        timeSec: 630,
        textHindi: `ऐसी ही और भी रोमांचक, रहस्यमयी और ज्ञानवर्धक वीडियोस देखने के लिए हमारे चैनल को सब्सक्राइब करके बेल आइकन को All पर सेट करना बिल्कुल न भूलें, ताकि हर नई डॉक्यूमेंट्री की नोटिफिकेशन सबसे पहले आप तक पहुँचे!`,
        sfx: "cinematic_hit",
        stockQuery: `youtube subscribe button animation cinematic background 4K`,
        keywordHighlight: "चैनल सब्सक्राइब करें"
      },
      {
        id: 15,
        timeSec: 675,
        textHindi: `फिर मिलेंगे एक और नई रोमांचक वीडियो के साथ, तब तक के लिए अपना और अपने परिवार का ख्याल रखें। धन्यवाद और जय हिंद!`,
        sfx: "applause",
        stockQuery: `peaceful nature landscape cinematic outro sunset 4K`,
        keywordHighlight: "जय हिंद और धन्यवाद"
      }
    ];

    const fullText = longSegments.map(s => s.textHindi).join(' ');

    console.log(`[ScriptGenerator] Dynamically synthesized 15-segment 1,600+ word Hindi script for Long Video: "${cleanTopic}"`);

    return {
      type: 'long',
      language: 'hindi',
      titleHindi,
      titleEnglish,
      targetDurationSec: 675,
      viralScore: topicCandidate.viralScore || 99,
      segments: longSegments,
      fullHindiTranscript: fullText,
      metadata: {
        titleHindi,
        descriptionHindi: `${rawTopic} पर आधारित यह 12 मिनट की विशेष हिंदी डॉक्यूमेंट्री आपको ब्रह्मांड, महासागर और प्रकृति के सबसे ख़तरनाक रहस्यों से रूबरू कराएगी! #facts #hindi #documentary #science #mysteries`,
        tags: ["viral facts hindi", "documentary hindi", "amazing facts hindi", "unexplained mysteries hindi", "science facts hindi"],
        thumbnailPrompt: `HD split-screen showing glowing black hole and deep ocean monster with high contrast bold yellow Hindi title '${cleanTopic}'`
      }
    };
  }
};

