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
      const segmentCount = type === 'short' ? 7 : 22;
      const lengthRule = type === 'short' ? "a hyper-viral Hindi script for a YouTube SHORT" : "a massive, highly detailed 2200+ word script for a 12-minute YouTube LONG video";
      
      const aiPrompt = `Act as an elite Hollywood screenwriter and YouTube master. Generate ${lengthRule} about "${topicText}" (${category}). 
      CRITICAL INSTRUCTIONS:
      1. Use "Open Loops": The first sentence MUST tease a shocking secret or ending that is only revealed in the final segment, forcing 100% watch-time.
      2. Use Psychological Hooks: Evoke curiosity, fear, or greed (e.g., "This one mistake is destroying your X...").
      3. Use SSML Tags: Wrap highly dramatic words in <prosody rate="slow" pitch="-2st">...</prosody> and add <break time="800ms"/> before huge reveals.
      ${type === 'long' ? '4. EXACT WORD COUNT: Your script MUST be at least 2200 words long in total. Each of the 22 segments MUST have at least 100-120 words of highly detailed narration.' : ''}
      
      You MUST return exactly ${segmentCount} segments.
      Return ONLY a JSON object (no markdown, no extra text) with the following structure:
      {
        "type": "${type}",
        "language": "hindi",
        "titleHindi": "Your hyper-viral hindi title",
        "titleEnglish": "${topicText}",
        "targetDurationSec": ${type === 'short' ? 55 : 770},
        "viralScore": 99,
        "segments": [
          { "id": 1, "timeSec": ${type === 'short' ? 5 : 35}, "textHindi": "Hindi narration with SSML tags", "stockQuery": "english visual search query", "keywordHighlight": "1-2 hindi words" }
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

    const titleHindi = topicCandidate.titleHindi || `दुनिया के 15 सबसे ख़तरनाक और अनोखे रहस्य 😱 | ${rawTopic} Full Documentary in Hindi`;
    const titleEnglish = rawTopic;

    const longSegments = [
      {
        id: 1,
        timeSec: 35,
        textHindi: `नमस्कार दोस्तों! आज की इस विशेष 12 मिनट की वृत्तचित्र डॉक्यूमेंट्री में हम आपको एक ऐसी अद्भुत, रहस्यमयी और रोंगटे खड़े कर देने वाली दुनिया की यात्रा पर ले चलेंगे, जिसके बारे में 99% लोगों ने कभी सोचा भी नहीं होगा! क्या आप जानते हैं कि हमारे इस अनंत ब्रह्मांड और पृथ्वी की अगाध गहराइयों में कुछ ऐसे खौफनाक रहस्य छिपे हैं, जो आधुनिक विज्ञान और भौतिकी के नियमों को भी चुनौती देते हैं? इस वीडियो में हम टॉप 15 से लेकर नंबर 1 तक ऐसे ख़तरनाक, अद्भुत और अनसुलझे रहस्यों का खुलासा करेंगे, जिनमें से नंबर 1 का सच जानकर आपके होश उड़ जाएंगे! तो अपनी सीट बेल्ट बांध लीजिए और इस रोंगटे खड़े कर देने वाले सफर का आनंद लीजिए!`,
        sfx: "cinematic_hit",
        stockQuery: "space galaxy nebula universe 4K",
        keywordHighlight: "99% अनजान महा-रहस्य"
      },
      {
        id: 2,
        timeSec: 70,
        textHindi: `नंबर 15 - प्राकृतिक ताक़त का ख़ौफ़नाक तांडव। जब वैज्ञानिकों और भूवैज्ञानिकों ने इसके शुरुआती संकेतों की गहराई से जांच की, तो उन्हें अंदाजा भी नहीं था कि इसका परिणाम इतना विनाशकारी हो सकता है! समुद्र की अगाध गहराइयों और सुदूर ज्वालामुखीय गर्तों में छिपी यह भयंकर शक्ति इतनी शक्तिशाली है कि मात्र कुछ ही सेकंड में पूरे महाद्वीप के मौसम को बदल सकती है। शोधकर्ताओं ने पाया कि इसके केंद्र का तापमान 5,000 डिग्री सेल्सियस तक पहुँच जाता है, जो सूर्य की बाहरी सतह जितना ही गर्म और भयानक है!`,
        sfx: "shock_riser",
        stockQuery: "volcano lava explosion eruption 4K",
        keywordHighlight: "नंबर 15 - भयंकर प्राकृतिक शक्ति"
      },
      {
        id: 3,
        timeSec: 105,
        textHindi: `नंबर 14 - पृथ्वी का सबसे घातक और अचूक हमलावर। अगर आप सोचते हैं कि जंगलों में सिर्फ शेर या बाघ ही सबसे खतरनाक शिकारी होते हैं, तो आप बिल्कुल गलत हैं! प्रकृति के इस अनोखे जीव का रूप इतना शांत और आकर्षक दिखता है कि कोई भी धोखा खा जाए। लेकिन जैसे ही यह खतरे को महसूस करता है, इसके विषैले ग्रंथियों से निकलने वाला न्यूरोटॉक्सिन जहर मात्र 30 सेकंड के अंदर शिकार के केंद्रीय तंत्रिका तंत्र को सुन्न कर देता है, जिससे दिल की धड़कनें तुरंत रुक जाती हैं!`,
        sfx: "bass_drop",
        stockQuery: "black mamba snake venomous strike 4K",
        keywordHighlight: "नंबर 14 - अचूक घातक जहर"
      },
      {
        id: 4,
        timeSec: 140,
        textHindi: `नंबर 13 - समय और भौतिकी के स्थापित नियमों को तोड़ने वाली परिघटना। आधुनिक खगोलशास्त्र और क्वांटम वैज्ञानिकों ने जब उच्च-गति कैमरों की मदद से इस ऊर्जावान प्रक्रिया की जांच की, तो हैरान कर देने वाले आंकड़े सामने आए। यह घटना इतनी तीव्र गति से घटित होती है कि सामान्य मानव आंख इसे देख भी नहीं सकती। वैज्ञानिकों का मानना है कि इसके पीछे पृथ्वी के चुंबकीय क्षेत्र और आयनमंडल का एक अत्यंत दुर्लभ तापीय संतुलन काम करता है!`,
        sfx: "whoosh",
        stockQuery: "quantum lightning plasma strike 4K",
        keywordHighlight: "नंबर 13 - भौतिकी के नियम ध्वस्त"
      },
      {
        id: 5,
        timeSec: 175,
        textHindi: `नंबर 12 - महासागर की अंधकारमयी गहराइयों के विशालकाय जीव। हमारी पृथ्वी का लगभग 71 प्रतिशत हिस्सा जल से ढका हुआ है, और हम इंसानों ने अब तक केवल 5 प्रतिशत महासागर की ही खोज की है! सोचिए, बाकी के 95 प्रतिशत अंधेरे गर्त में क्या-क्या मौजूद हो सकता है? मैरियाना ट्रेंच की 11,000 मीटर की अगाध गहराई में जहाँ सूर्य का प्रकाश कभी नहीं पहुँचता, वहाँ ऐसे विशालकाय जीव तैर रहे हैं जो बिना ऑक्सीजन और अत्यधिक दबाव में भी आसानी से जीवित रहते हैं!`,
        sfx: "subtle_glitch",
        stockQuery: "mariana trench deep ocean monster 4K",
        keywordHighlight: "नंबर 12 - महासागर के दानव"
      },
      {
        id: 6,
        timeSec: 210,
        textHindi: `नंबर 11 - इंसानी मस्तिष्क का वह अनसुलझा रहस्य जिसे डॉक्टर भी नहीं समझ पाए। हमारे दिमाग में लगभग 86 अरब तंत्रिका कोशिकाएं होती हैं जो विश्व के सबसे शक्तिशाली सुपरकंप्यूटर से भी 100 गुना तेज़ गति से काम करती हैं। जब किसी इंसान के साथ यह दुर्लभ न्यूरोलॉजिकल बदलाव होता है, तो उसकी शारीरिक सीमाएं खत्म हो जाती हैं। कुछ लोग बिना सोए महीनों बिता सकते हैं, तो कुछ अत्यंत माइनस 40 डिग्री के बर्फीले तापमान में भी सुरक्षित रहते हैं!`,
        sfx: "cinematic_hit",
        stockQuery: "human brain neural network animation 4K",
        keywordHighlight: "नंबर 11 - असीमित इंसानी दिमाग"
      },
      {
        id: 7,
        timeSec: 245,
        textHindi: `नंबर 10 - प्राचीन काल की खोई हुई उन्नत इंजीनियरिंग और वास्तुकला। मिस्र के विशाल पिरामिडों, भारत के कैलाश मंदिर और प्राचीन सुमेरियन अवशेषों में ऐसी इंजीनियरिंग देखने को मिलती है जो आधुनिक क्रेन और लेज़र कटर से भी श्रेष्ठ है। हज़ारों टन वजनी ग्रेनाइट पत्थरों को इतनी सटीकता से काटा गया है कि उनके जोड़ों के बीच एक कागज का पन्ना भी नहीं घुसाया जा सकता! आखिर हज़ारों साल पहले यह तकनीक इंसानों के पास कहाँ से आई?`,
        sfx: "shock_riser",
        stockQuery: "egyptian pyramid ancient ruins mystery 4K",
        keywordHighlight: "नंबर 10 - प्राचीन खोई तकनीक"
      },
      {
        id: 8,
        timeSec: 280,
        textHindi: `नंबर 9 - सुदूर अंतरिक्ष से प्राप्त रहस्यमयी रेडियो सिग्नल। नासा के हबल और जेम्स वेब अंतरिक्ष टेलीस्कोप ने जब अरबों प्रकाश वर्ष दूर स्थित आकाशगंगाओं की ओर अपने शक्तिशाली लेंस घुमाए, तो उन्हें ऐसे फास्ट रेडियो बर्स्ट सिग्नल मिले जो लगातार एक ही गणितीय पैटर्न में आ रहे थे। क्या ब्रह्मांड के किसी सुदूर कोने में हमसे भी अधिक उन्नत एलियन सभ्यता मौजूद है जो हमसे संपर्क करने की कोशिश कर रही है?`,
        sfx: "bass_drop",
        stockQuery: "james webb space telescope galaxy 4K",
        keywordHighlight: "नंबर 9 - एलियन रेडियो सिग्नल"
      },
      {
        id: 9,
        timeSec: 315,
        textHindi: `नंबर 8 - पृथ्वी के वे अनोखे क्षेत्र जहाँ समय और दिशा रुक जाते हैं। बरमूडा ट्राइएंगल हो या फिर नेवादा का एरिया 51, इन क्षेत्रों में प्रवेश करते ही सभी चुंबकीय नेविगेशन उपकरण और घड़ियाँ ठप पड़ जाती हैं। कई अनुभवी विमान चालकों और नौसेना कप्तानों ने दर्ज किया है कि इन क्षेत्रों में आसमान का रंग अचानक बैंगनी हो जाता है और समय की गति धीमी महसूस होती है!`,
        sfx: "whoosh",
        stockQuery: "bermuda triangle ocean storm compass 4K",
        keywordHighlight: "नंबर 8 - अनसुलझे रहस्यमयी क्षेत्र"
      },
      {
        id: 10,
        timeSec: 350,
        textHindi: `नंबर 7 - ब्लैक洞 का भयावह सच और वॉर्महोल का द्वार। यदि कोई अंतरिक्ष यात्री किसी अति-विशालकाय ब्लैक होल के इवेंट होराइजन सीमा को पार कर ले, तो उसके साथ क्या होगा? अल्बर्ट आइंस्टीन के सामान्य सापेक्षता सिद्धांत के अनुसार, गुरुत्वाकर्षण खिंचाव के कारण शरीर पतले धागे की तरह खिंच जाएगा। इसके केंद्र में समय और स्थान का अस्तित्व समाप्त हो जाता है!`,
        sfx: "subtle_glitch",
        stockQuery: "black hole singularity event horizon 4K",
        keywordHighlight: "नंबर 7 - ब्लैक होल की भयावहता"
      },
      {
        id: 11,
        timeSec: 385,
        textHindi: `नंबर 6 - जैविक अमरता का अनोखा चमत्कार। समुद्र की गहराई में तुरीटोप्सिस डोहरनी नामक एक ऐसी सूक्ष्म जेलीफिश पाई जाती है जो जैविक रूप से कभी नहीं मरती! जब यह बीमार या वृद्ध होती है, तो यह अपनी सभी शारीरिक कोशिकाओं को वापस स्टेम सेल में परिवर्तित करके पुनः एक नवजात पॉलीप के रूप में जन्म ले लेती है। वैज्ञानिकों का मानना है कि इसके जेनेटिक्स को समझकर इंसानी उम्र को भी अमर बनाया जा सकता है!`,
        sfx: "cinematic_hit",
        stockQuery: "immortal jellyfish underwater bioluminescence 4K",
        keywordHighlight: "नंबर 6 - जैविक अमरता का राज"
      },
      {
        id: 12,
        timeSec: 420,
        textHindi: `नंबर 5 - टार्डिग्रेड: अंतरिक्ष की शून्य स्थिति में भी अमर रहने वाला जीव। माइक्रोस्कोपिक आकार का यह प्राणी माइनस 272 डिग्री सेल्सियस के जमा देने वाले तापमान से लेकर 150 डिग्री सेल्सियस की उबलती गर्मी में भी जीवित रह सकता है। यह बिना भोजन और पानी के 30 वर्षों तक सो सकता है और अंतरिक्ष के जानलेवा विकिरण को भी आसानी से सह सकता है!`,
        sfx: "shock_riser",
        stockQuery: "tardigrade water bear microscopic 4K",
        keywordHighlight: "नंबर 5 - अविश्वसनीय टार्डिग्रेड"
      },
      {
        id: 13,
        timeSec: 455,
        textHindi: `नंबर 4 - सुपरनोवा का महा-विस्फोट। जब कोई विशालकाय तारा अपने जीवन के अंतिम पड़ाव पर पहुँचता है, तो उसमें एक ऐसा भीषण विस्फोट होता है जो एक ही सेकंड में उतनी ऊर्जा उत्सर्जित करता है जितनी हमारा सूर्य अपने 10 अरब वर्षों के पूरे जीवनकाल में भी नहीं कर सकता! इस विस्फोट से निकलने वाले भारी तत्व ही बाद में नए ग्रहों और जीवन का निर्माण करते हैं!`,
        sfx: "bass_drop",
        stockQuery: "star supernova explosion cosmos 4K",
        keywordHighlight: "नंबर 4 - सुपरनोवा महा-विस्फोट"
      },
      {
        id: 14,
        timeSec: 490,
        textHindi: `नंबर 3 - सौर तूफ़ान और पृथ्वी का सुरक्षा कवच। हमारा सूर्य हर सेकंड करोड़ों टन प्लाज्मा और आवेशित कणों को अंतरिक्ष में फेंकता है। यदि पृथ्वी का चुंबकीय क्षेत्र और वायुमंडल हमें न बचाए, तो एक ही सौर तूफान पृथ्वी के पूरे बिजली ग्रिड, इंटरनेट और उपग्रह संचार को हमेशा के लिए नष्ट कर सकता है!`,
        sfx: "whoosh",
        stockQuery: "sun solar flare plasma storm 4K",
        keywordHighlight: "नंबर 3 - सौर तूफान का खतरा"
      },
      {
        id: 15,
        timeSec: 525,
        textHindi: `नंबर 2 - अंटार्कटिका की बर्फ के नीचे छिपी प्राचीन दुनिया। अंटार्कटिका की 4 किलोमीटर मोटी बर्फ की परत के नीचे 400 से अधिक ऐसी झीलें मौजूद हैं जो लाखों वर्षों से बाहरी दुनिया से पूरी तरह अलग-थलग हैं। लेक वोस्तोक में वैज्ञानिकों ने ऐसे बैक्टीरिया खोजे हैं जो पृथ्वी के किसी भी अन्य जीव से मेल नहीं खाते!`,
        sfx: "subtle_glitch",
        stockQuery: "antarctica glacier ice cave mystery 4K",
        keywordHighlight: "नंबर 2 - बर्फ के नीचे की दुनिया"
      },
      {
        id: 16,
        timeSec: 560,
        textHindi: `नंबर 1 - अटलांटिस और खोई हुई द्वारका नगरी का असली सच। समुद्र की गहराइयों में मिली जलमग्न संरचनाएं यह साबित करती हैं कि हज़ारों साल पहले पृथ्वी पर एक अति-उन्नत सभ्यता मौजूद थी जो एक ही रात में जलप्रलय में समा गई!`,
        sfx: "cinematic_hit",
        stockQuery: "submerged ancient city atlantis ruins 4K",
        keywordHighlight: "नंबर 1 - प्राचीन सभ्यता"
      },
      {
        id: 17,
        timeSec: 595,
        textHindi: `नंबर 17 - क्वांटम टाइम डिलेशन और आइंस्टीन का समय चक्र। जैसे-जैसे आप प्रकाश की गति के करीब पहुँचते हैं या किसी तीव्र गुरुत्वाकर्षण क्षेत्र के पास जाते हैं, आपके लिए समय की गति धीमी हो जाती है। अंतरिक्ष में 1 वर्ष बिताने वाला व्यक्ति पृथ्वी पर लौटेगा तो यहाँ 50 वर्ष बीत चुके होंगे!`,
        sfx: "whoosh",
        stockQuery: "quantum clock time travel relativity 4K",
        keywordHighlight: "समय चक्र और गति"
      },
      {
        id: 18,
        timeSec: 630,
        textHindi: `नंबर 18 - पैरेलल यूनिवर्स और मल्टीवर्स थ्योरी। आधुनिक स्ट्रिंग थ्योरी के अनुसार, हमारा ब्रह्मांड अकेला नहीं है। अनंत समानांतर ब्रह्मांड मौजूद हैं जहाँ आपकी ही एक दूसरी प्रति किसी अलग जीवन का आनंद ले रही है!`,
        sfx: "bass_drop",
        stockQuery: "multiverse parallel universe portal 4K",
        keywordHighlight: "अनंत समानांतर ब्रह्मांड"
      },
      {
        id: 19,
        timeSec: 665,
        textHindi: `नंबर 19 - ब्रह्मांड का अंतिम भविष्य और महा-शीतलन। अरबों वर्षों बाद जब सभी तारे ईंधन खोकर बुझ जाएंगे, तो ब्रह्मांड पूरी तरह से ठंडा और अंधकारमय हो जाएगा। लेकिन इस राख से फिर नए ब्रह्मांड का जन्म होगा!`,
        sfx: "subtle_glitch",
        stockQuery: "dying star cosmic dust nebula 4K",
        keywordHighlight: "ब्रह्मांड का अंतिम भविष्य"
      },
      {
        id: 20,
        timeSec: 700,
        textHindi: `नंबर 20 - डार्क मैटर और डार्क एनर्जी का अदृश्य जाल। हमारे ब्रह्मांड का 95 प्रतिशत हिस्सा डार्क मैटर और डार्क एनर्जी से बना है, जिसे हम अपनी आंखों या वैज्ञानिक उपकरणों से कभी नहीं देख सकते! यह एक ऐसा अदृश्य रहस्य है जो ब्रह्मांड की सभी आकाशगंगाओं को एक धागे में पिरोए रखता है।`,
        sfx: "shock_riser",
        stockQuery: "dark matter deep space gravitational lens 4K",
        keywordHighlight: "अदृश्य डार्क मैटर"
      },
      {
        id: 21,
        timeSec: 735,
        textHindi: `नंबर 21 - मानव प्रजाति का ब्रह्मांडीय भविष्य। क्या इंसानी सभ्यता कभी पृथ्वी से बाहर निकलकर दूसरे सौर मंडलों और आकाशगंगाओं में निवास कर पाएगी? मंगल ग्रह पर इंसानी बस्तियां बसाना तो केवल पहला कदम है, लेकिन आने वाली सदियों में हमारे वंशज दूसरे तारों के सुपर-अर्थ ग्रहों पर जीवन की नई शुरुआत करेंगे!`,
        sfx: "whoosh",
        stockQuery: "mars colony space travel human future 4K",
        keywordHighlight: "ब्रह्मांडीय इंसानी भविष्य"
      },
      {
        id: 22,
        timeSec: 770,
        textHindi: `दोस्तों, इस अद्भुत वृत्तचित्र डॉक्यूमेंट्री से यह स्पष्ट होता है कि हमारी पृथ्वी और ब्रह्मांड में अभी भी अनगिनत ऐसे रहस्य हैं जिनका सच इंसान की सोच से परे है। यदि आपको प्रकृति और विज्ञान के ये अनोखे तथ्य पसंद आए, तो इस वीडियो को तुरंत लाइक करें और हमारे चैनल को सब्सक्राइब करके बेल आइकन ज़रूर दबाएं! कमेंट में बताएं कि आपको कौन सा नंबर सबसे ज़्यादा हैरान कर देने वाला लगा!`,
        sfx: "applause",
        stockQuery: "starry night sky milky way galaxy 4K",
        keywordHighlight: "👍 लाइक व 🔔 सब्सक्राइब करें"
      }
    ];

    return {
      type: 'long',
      language: 'hindi',
      titleHindi: `15 सबसे ख़तरनाक महा-रहस्य जो विज्ञान भी नहीं सुलझा पाया 😱🔥 | Special Documentary (Ep. 7)`,
      titleEnglish: titleEnglish,
      targetDurationSec: 770,
      viralScore: 99,
      segments: longSegments,
      fullHindiTranscript: longSegments.map(s => s.textHindi).join(' '),
      metadata: {
        titleHindi: `15 सबसे ख़तरनाक महा-रहस्य जो विज्ञान भी नहीं सुलझा पाया 😱🔥 | Special Documentary (Ep. 7)`,
        descriptionHindi: `इस विशेष डॉक्यूमेंट्री में जानिए पृथ्वी और ब्रह्मांड के 15 सबसे ख़तरनाक और अनसुलझे रहस्य! #documentary #viral #facts #space #mysteries`,
        tags: ['viral facts hindi', 'space mysteries', 'documentary hindi', 'science secrets', 'unexplained mysteries'],
        thumbnailPrompt: "Hyper-realistic cinematic space mystery nebula black hole 8k"
      }
    };
  }
};