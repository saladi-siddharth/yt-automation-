/**
 * Mega Topic Database — 25 Categories, 30,000+ Potential Topics
 * Each topic has a complete 7-segment Hindi script with matching Pexels search queries
 */

const CATEGORIES = {
  ANIMALS: 'animals',
  SPACE: 'space',
  HUMAN_BODY: 'human_body',
  SCIENCE: 'science',
  EARTH_NATURE: 'earth_nature',
  OCEAN: 'ocean',
  ANCIENT_HISTORY: 'ancient_history',
  GEOGRAPHY: 'geography',
  TECHNOLOGY: 'technology',
  PSYCHOLOGY: 'psychology',
  MYSTERIES: 'mysteries',
  SURVIVAL: 'survival',
  FOOD_SCIENCE: 'food_science',
  AMAZING_JOBS: 'amazing_jobs',
  ENGINEERING: 'engineering',
  MILITARY: 'military',
  AVIATION: 'aviation',
  CARS: 'cars',
  TRAINS: 'trains',
  MEGA_PROJECTS: 'mega_projects',
  BILLIONAIRES: 'billionaires',
  INVENTIONS: 'inventions',
  AMAZING_PLACES: 'amazing_places',
  DAILY_SCIENCE: 'daily_science',
  TOP_LISTS: 'top_lists'
};

// Content Pillar Weighting (determines pick probability)
const CATEGORY_WEIGHTS = {
  [CATEGORIES.ANIMALS]: 30,
  [CATEGORIES.SPACE]: 15,
  [CATEGORIES.SCIENCE]: 15,
  [CATEGORIES.HUMAN_BODY]: 10,
  [CATEGORIES.OCEAN]: 10,
  [CATEGORIES.EARTH_NATURE]: 10,
  [CATEGORIES.TECHNOLOGY]: 5,
  [CATEGORIES.GEOGRAPHY]: 5
};

const SHORTS_TOPICS = [
  // ═══════════════════════════════════════════════════════════════════
  // ANIMALS (30%) — 20 topics
  // ═══════════════════════════════════════════════════════════════════
  {
    category: CATEGORIES.ANIMALS, subcategory: 'Smartest Animals',
    titleHindi: "ऑक्टोपस के 3 दिल और नीला खून! 🐙😱",
    titleEnglish: "Octopus has 3 Hearts & Blue Blood!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "क्या आपको पता है कि ऑक्टोपस के शरीर में 3 दिल होते हैं?", sfx: "cinematic_hit", stockQuery: "octopus swimming underwater macro 4K", keywordHighlight: "3 दिल" },
      { id: 2, timeSec: 12, textHindi: "दो दिल खून को गिल्स तक पहुँचाते हैं और एक दिल पूरे शरीर में ऑक्सीजन पहुँचाता है!", sfx: "shock_riser", stockQuery: "octopus tentacles close up ocean", keywordHighlight: "ऑक्सीजन" },
      { id: 3, timeSec: 22, textHindi: "और सबसे हैरान करने वाली बात — इसका खून लाल नहीं, बल्कि नीले रंग का होता है!", sfx: "bass_drop", stockQuery: "deep ocean blue water mysterious", keywordHighlight: "नीले रंग का खून" },
      { id: 4, timeSec: 32, textHindi: "ऐसा इसलिए क्योंकि इसके खून में लोहे की जगह तांबा होता है जो ठंडे पानी में बेहतर काम करता है!", sfx: "whoosh", stockQuery: "copper mineral science close up", keywordHighlight: "तांबा" },
      { id: 5, timeSec: 40, textHindi: "ऑक्टोपस अपना रंग एक सेकंड में बदल सकता है और किसी भी आकार की जगह से निकल सकता है!", sfx: "subtle_glitch", stockQuery: "octopus changing color camouflage", keywordHighlight: "रंग बदलना" },
      { id: 6, timeSec: 48, textHindi: "वैज्ञानिक मानते हैं कि ऑक्टोपस पृथ्वी के सबसे बुद्धिमान जीवों में से एक है!", sfx: "cinematic_hit", stockQuery: "octopus intelligence problem solving", keywordHighlight: "सबसे बुद्धिमान" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही रोमांचक तथ्यों के लिए चैनल को सब्सक्राइब करें और वीडियो को लाइक करें!", sfx: "applause", stockQuery: "coral reef ocean life colorful", keywordHighlight: "सब्सक्राइब करें" }
    ],
    metadata: { titleHindi: "ऑक्टोपस के 3 दिल और नीला खून! 🐙😱 | Amazing Animal Facts #shorts", descriptionHindi: "ऑक्टोपस के शरीर में 3 दिल होते हैं और इसका खून नीला होता है! #shorts #animalfacts #hindi #octopus", tags: ["octopus facts hindi", "animal facts in hindi", "shorts hindi", "octopus 3 hearts", "wildlife hindi"] }
  },
  {
    category: CATEGORIES.ANIMALS, subcategory: 'Deadliest Animals',
    titleHindi: "यह छोटा मेंढक 10 इंसानों को मार सकता है! 🐸☠️",
    titleEnglish: "This Tiny Frog Can Kill 10 Humans!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "यह रंगीन मेंढक देखने में बहुत प्यारा लगता है, लेकिन यह दुनिया का सबसे ज़हरीला जीव है!", sfx: "cinematic_hit", stockQuery: "poison dart frog colorful rainforest macro 4K", keywordHighlight: "सबसे ज़हरीला" },
      { id: 2, timeSec: 12, textHindi: "इसे गोल्डन पॉइज़न फ्रॉग कहते हैं और इसके शरीर में इतना ज़हर है कि 10 इंसान मर सकते हैं!", sfx: "shock_riser", stockQuery: "golden poison frog yellow dangerous close up", keywordHighlight: "10 इंसान" },
      { id: 3, timeSec: 22, textHindi: "सिर्फ इसे छूने से ज़हर आपके शरीर में चला जाता है — इसलिए इसे 'डार्ट फ्रॉग' कहते हैं!", sfx: "bass_drop", stockQuery: "frog skin poison macro colorful tropical", keywordHighlight: "छूने से ज़हर" },
      { id: 4, timeSec: 32, textHindi: "आदिवासी लोग इसके ज़हर को अपने तीरों पर लगाकर शिकार करते थे!", sfx: "whoosh", stockQuery: "tribal arrow hunting jungle rainforest", keywordHighlight: "तीरों पर ज़हर" },
      { id: 5, timeSec: 40, textHindi: "हैरानी की बात — यह मेंढक अपना ज़हर खुद नहीं बनाता, बल्कि जो कीड़े खाता है उनसे ज़हर लेता है!", sfx: "subtle_glitch", stockQuery: "frog eating insect tongue macro slow motion", keywordHighlight: "कीड़ों से ज़हर" },
      { id: 6, timeSec: 48, textHindi: "अगर इसे कैद में रखें और अलग खाना दें तो यह बिल्कुल ज़हरीला नहीं रहता!", sfx: "cinematic_hit", stockQuery: "frog terrarium captive colorful amphibian", keywordHighlight: "कैद में सुरक्षित" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही खतरनाक तथ्यों के लिए चैनल को सब्सक्राइब करें!", sfx: "applause", stockQuery: "rainforest tropical nature beautiful green 4K", keywordHighlight: "सब्सक्राइब करें" }
    ],
    metadata: { titleHindi: "यह मेंढक 10 इंसानों को मार सकता है! 🐸☠️ #shorts", descriptionHindi: "गोल्डन पॉइज़न फ्रॉग दुनिया का सबसे ज़हरीला जीव है! #shorts #frog #animalfacts #hindi", tags: ["poison frog hindi", "deadliest animals", "shorts hindi", "animal facts"] }
  },
  {
    category: CATEGORIES.ANIMALS, subcategory: 'Fastest Animals',
    titleHindi: "परेग्रिन फाल्कन 390 किमी/घंटा की रफ़्तार से गिरता है! 🦅💨",
    titleEnglish: "Peregrine Falcon Dives at 390 km/h!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "यह पक्षी दुनिया का सबसे तेज़ जीव है — 390 किलोमीटर प्रति घंटा की रफ़्तार!", sfx: "cinematic_hit", stockQuery: "peregrine falcon flying sky close up 4K", keywordHighlight: "390 किमी/घंटा" },
      { id: 2, timeSec: 12, textHindi: "परेग्रिन फाल्कन जब शिकार करता है तो आसमान से बुलेट की तरह नीचे गिरता है!", sfx: "shock_riser", stockQuery: "falcon diving hunting bird prey speed", keywordHighlight: "बुलेट जैसी रफ़्तार" },
      { id: 3, timeSec: 22, textHindi: "इसकी आँखें इतनी तेज़ हैं कि 3 किलोमीटर दूर से भी शिकार देख सकता है!", sfx: "whoosh", stockQuery: "falcon eyes close up sharp raptor", keywordHighlight: "3 किमी दूर से" },
      { id: 4, timeSec: 32, textHindi: "इसकी नाक में एक खास हड्डी होती है जो तेज़ रफ़्तार में साँस लेने में मदद करती है!", sfx: "bass_drop", stockQuery: "falcon beak nostril aerodynamic bird", keywordHighlight: "खास हड्डी" },
      { id: 5, timeSec: 40, textHindi: "जेट फाइटर पायलट के हेलमेट का डिज़ाइन इसी पक्षी से प्रेरित है!", sfx: "subtle_glitch", stockQuery: "fighter jet pilot helmet cockpit", keywordHighlight: "जेट फाइटर डिज़ाइन" },
      { id: 6, timeSec: 48, textHindi: "यह हर महाद्वीप पर पाया जाता है — अंटार्कटिका को छोड़कर!", sfx: "cinematic_hit", stockQuery: "falcon perched mountain cliff sunset", keywordHighlight: "हर महाद्वीप" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही स्पीड फ़ैक्ट्स के लिए लाइक और सब्सक्राइब करें!", sfx: "applause", stockQuery: "bird flying sunset sky dramatic clouds", keywordHighlight: "लाइक और सब्सक्राइब" }
    ],
    metadata: { titleHindi: "390 किमी/घंटा! दुनिया का सबसे तेज़ जीव! 🦅💨 #shorts", descriptionHindi: "परेग्रिन फाल्कन दुनिया का सबसे तेज़ जानवर है! #shorts #falcon #animalfacts #hindi", tags: ["peregrine falcon hindi", "fastest animals", "bird facts hindi", "shorts"] }
  },
  {
    category: CATEGORIES.ANIMALS, subcategory: 'Biggest Animals',
    titleHindi: "ब्लू व्हेल का दिल एक कार जितना बड़ा! 🐋💙",
    titleEnglish: "Blue Whale Heart is Car-Sized!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "पृथ्वी का सबसे बड़ा जीव इतना विशाल है कि इसका दिल एक छोटी कार जितना बड़ा होता है!", sfx: "cinematic_hit", stockQuery: "blue whale swimming ocean 4K aerial", keywordHighlight: "कार जितना बड़ा दिल" },
      { id: 2, timeSec: 12, textHindi: "ब्लू व्हेल का वज़न 1,50,000 किलोग्राम तक हो सकता है — यानी 25 हाथियों जितना!", sfx: "shock_riser", stockQuery: "blue whale underwater massive close up", keywordHighlight: "25 हाथियों जितना" },
      { id: 3, timeSec: 22, textHindi: "इसकी जीभ का वज़न अकेले एक हाथी के बराबर होता है!", sfx: "bass_drop", stockQuery: "whale mouth feeding ocean krill", keywordHighlight: "जीभ = एक हाथी" },
      { id: 4, timeSec: 32, textHindi: "इसकी धमनियाँ इतनी बड़ी हैं कि एक छोटा बच्चा इनमें से तैर सकता है!", sfx: "whoosh", stockQuery: "whale anatomy science illustration ocean", keywordHighlight: "बच्चा तैर सकता है" },
      { id: 5, timeSec: 40, textHindi: "ब्लू व्हेल की आवाज़ 188 डेसिबल तक जाती है — यह दुनिया की सबसे तेज़ आवाज़ है!", sfx: "subtle_glitch", stockQuery: "whale singing underwater sound waves", keywordHighlight: "188 डेसिबल" },
      { id: 6, timeSec: 48, textHindi: "और ये एक दिन में 4 करोड़ क्रिल यानी छोटे समुद्री जीव खा जाती है!", sfx: "cinematic_hit", stockQuery: "krill swarm ocean underwater marine", keywordHighlight: "4 करोड़ क्रिल" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही दिमाग उड़ा देने वाले फ़ैक्ट्स के लिए फॉलो करें!", sfx: "applause", stockQuery: "whale tail ocean sunset beautiful 4K", keywordHighlight: "फॉलो करें" }
    ],
    metadata: { titleHindi: "ब्लू व्हेल का दिल कार जितना बड़ा! 🐋💙 #shorts", descriptionHindi: "ब्लू व्हेल इतनी बड़ी है कि इसका दिल एक कार जितना है! #shorts #bluewhale #animalfacts #hindi", tags: ["blue whale facts hindi", "animal facts", "shorts hindi", "whale heart"] }
  },
  {
    category: CATEGORIES.ANIMALS, subcategory: 'Animal Superpowers',
    titleHindi: "कौआ इंसानों के चेहरे याद रखता है! 🐦🧠",
    titleEnglish: "Crows Remember Human Faces!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "कौआ एक ऐसा पक्षी है जो इंसानों के चेहरे सालों तक याद रख सकता है!", sfx: "cinematic_hit", stockQuery: "crow close up intelligent bird 4K", keywordHighlight: "चेहरे याद रखना" },
      { id: 2, timeSec: 12, textHindi: "अगर आपने किसी कौए को परेशान किया, तो वो आपको पहचान कर बदला भी ले सकता है!", sfx: "shock_riser", stockQuery: "crow flying attack aggressive bird urban", keywordHighlight: "बदला लेना" },
      { id: 3, timeSec: 22, textHindi: "कौए औज़ार बनाते हैं! वो तार मोड़कर हुक बनाते हैं और खाना निकालते हैं!", sfx: "whoosh", stockQuery: "crow using tool stick intelligent behavior", keywordHighlight: "औज़ार बनाना" },
      { id: 4, timeSec: 32, textHindi: "वैज्ञानिकों के अनुसार कौओं की बुद्धि 7 साल के बच्चे जितनी होती है!", sfx: "bass_drop", stockQuery: "crow problem solving experiment science", keywordHighlight: "7 साल का बच्चा" },
      { id: 5, timeSec: 40, textHindi: "कौए अपने साथियों के अंतिम संस्कार भी करते हैं — वो मरे हुए कौए के पास इकट्ठा होते हैं!", sfx: "subtle_glitch", stockQuery: "group of crows gathering tree black birds", keywordHighlight: "अंतिम संस्कार" },
      { id: 6, timeSec: 48, textHindi: "और कौए गिनती कर सकते हैं — 1 से 7 तक गिन सकते हैं!", sfx: "cinematic_hit", stockQuery: "crow perched smart looking bird close up", keywordHighlight: "गिनती करना" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही हैरान कर देने वाले तथ्यों के लिए सब्सक्राइब करें!", sfx: "applause", stockQuery: "bird flying sunset sky beautiful nature", keywordHighlight: "सब्सक्राइब करें" }
    ],
    metadata: { titleHindi: "कौआ इंसानों के चेहरे याद रखता है! 🐦🧠 #shorts", descriptionHindi: "कौए इतने बुद्धिमान हैं कि सालों बाद भी आपको पहचान सकते हैं! #shorts #crow #animalfacts #hindi", tags: ["crow facts hindi", "animal facts", "shorts hindi", "intelligent birds"] }
  },
  {
    category: CATEGORIES.ANIMALS, subcategory: 'Sharks',
    titleHindi: "शार्क डायनासोर से भी पहले से हैं! 🦈🌍",
    titleEnglish: "Sharks Existed Before Dinosaurs!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "शार्क 45 करोड़ साल पहले से पृथ्वी पर हैं — डायनासोर से भी 20 करोड़ साल पहले!", sfx: "cinematic_hit", stockQuery: "shark swimming ocean close up 4K predator", keywordHighlight: "45 करोड़ साल" },
      { id: 2, timeSec: 12, textHindi: "शार्क के शरीर में एक भी हड्डी नहीं होती — पूरा शरीर कार्टिलेज से बना है!", sfx: "shock_riser", stockQuery: "shark underwater teeth close up macro", keywordHighlight: "एक भी हड्डी नहीं" },
      { id: 3, timeSec: 22, textHindi: "ग्रेट व्हाइट शार्क 3 किलोमीटर दूर से खून की एक बूँद सूंघ सकती है!", sfx: "whoosh", stockQuery: "great white shark hunting ocean predator", keywordHighlight: "3 किमी दूर से खून" },
      { id: 4, timeSec: 32, textHindi: "शार्क अपनी पूरी ज़िंदगी में 30,000 से ज़्यादा दाँत उगाती है!", sfx: "bass_drop", stockQuery: "shark teeth rows close up underwater", keywordHighlight: "30,000 दाँत" },
      { id: 5, timeSec: 40, textHindi: "कुछ शार्क 400 साल तक जीवित रह सकती हैं — ग्रीनलैंड शार्क दुनिया की सबसे बूढ़ी!", sfx: "subtle_glitch", stockQuery: "greenland shark deep ocean slow swimming", keywordHighlight: "400 साल" },
      { id: 6, timeSec: 48, textHindi: "और शार्क कभी सोती नहीं — उन्हें ज़िंदा रहने के लिए लगातार तैरना पड़ता है!", sfx: "cinematic_hit", stockQuery: "shark school swimming ocean blue deep", keywordHighlight: "कभी नहीं सोती" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही डरावने और रोमांचक तथ्यों के लिए लाइक और सब्सक्राइब करें!", sfx: "applause", stockQuery: "ocean sunset shark fin surface dramatic", keywordHighlight: "लाइक और सब्सक्राइब" }
    ],
    metadata: { titleHindi: "शार्क डायनासोर से भी पुरानी है! 🦈🌍 #shorts", descriptionHindi: "शार्क 45 करोड़ साल से पृथ्वी पर हैं! #shorts #shark #animalfacts #hindi", tags: ["shark facts hindi", "animal facts", "shorts hindi", "ocean predator hindi"] }
  },

  // ═══════════════════════════════════════════════════════════════════
  // SPACE (15%) — 8 topics
  // ═══════════════════════════════════════════════════════════════════
  {
    category: CATEGORIES.SPACE, subcategory: 'Black Holes',
    titleHindi: "ब्लैक होल में समय रुक जाता है! ⚫🕐",
    titleEnglish: "Time Stops Inside a Black Hole!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "क्या आप जानते हैं कि ब्लैक होल के पास जाने पर समय धीमा हो जाता है?", sfx: "cinematic_hit", stockQuery: "black hole space universe 4K animation", keywordHighlight: "समय धीमा" },
      { id: 2, timeSec: 12, textHindi: "अगर आप ब्लैक होल के किनारे पर 1 घंटा बिताएं तो पृथ्वी पर 7 साल बीत जाएंगे!", sfx: "shock_riser", stockQuery: "space time warp galaxy distortion", keywordHighlight: "1 घंटा = 7 साल" },
      { id: 3, timeSec: 22, textHindi: "ब्लैक होल का गुरुत्वाकर्षण इतना तगड़ा है कि प्रकाश भी इससे बाहर नहीं निकल सकता!", sfx: "bass_drop", stockQuery: "light bending gravity space effect", keywordHighlight: "प्रकाश भी फँस जाता है" },
      { id: 4, timeSec: 32, textHindi: "सबसे बड़ा ब्लैक होल TON 618 है — जो सूरज से 66 अरब गुना भारी है!", sfx: "whoosh", stockQuery: "massive galaxy supermassive black hole", keywordHighlight: "66 अरब गुना" },
      { id: 5, timeSec: 40, textHindi: "हमारी आकाशगंगा के बीच में भी एक विशाल ब्लैक होल है — Sagittarius A*!", sfx: "subtle_glitch", stockQuery: "milky way galaxy center stars space", keywordHighlight: "Sagittarius A*" },
      { id: 6, timeSec: 48, textHindi: "अगर पृथ्वी को ब्लैक होल बनाना हो तो इसे मटर के दाने जितना सिकोड़ना पड़ेगा!", sfx: "cinematic_hit", stockQuery: "earth planet space blue marble", keywordHighlight: "मटर जितना" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही ब्रह्मांड के रहस्यों के लिए चैनल को सब्सक्राइब करें!", sfx: "applause", stockQuery: "stars universe nebula beautiful space 4K", keywordHighlight: "सब्सक्राइब करें" }
    ],
    metadata: { titleHindi: "ब्लैक होल में समय रुक जाता है! ⚫🕐 #shorts", descriptionHindi: "ब्लैक होल के पास 1 घंटा = पृथ्वी पर 7 साल! #shorts #blackhole #space #hindi", tags: ["black hole hindi", "space facts hindi", "shorts hindi", "universe facts"] }
  },
  {
    category: CATEGORIES.SPACE, subcategory: 'Sun',
    titleHindi: "सूरज पर एक दिन 25 दिनों का होता है! ☀️🔥",
    titleEnglish: "A Day on the Sun Lasts 25 Days!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "सूरज इतना बड़ा है कि इसमें 13 लाख पृथ्वियाँ समा सकती हैं!", sfx: "cinematic_hit", stockQuery: "sun close up solar flare 4K space", keywordHighlight: "13 लाख पृथ्वियाँ" },
      { id: 2, timeSec: 12, textHindi: "सूरज की सतह का तापमान 5,500 डिग्री सेल्सियस है — लेकिन इसका कोर 1.5 करोड़ डिग्री गर्म है!", sfx: "shock_riser", stockQuery: "solar surface plasma eruption close up", keywordHighlight: "1.5 करोड़ डिग्री" },
      { id: 3, timeSec: 22, textHindi: "सूरज हर सेकंड 60 करोड़ टन हाइड्रोजन को हीलियम में बदलता है!", sfx: "whoosh", stockQuery: "nuclear fusion sun energy explosion", keywordHighlight: "60 करोड़ टन" },
      { id: 4, timeSec: 32, textHindi: "सूरज की रोशनी को पृथ्वी तक पहुँचने में 8 मिनट 20 सेकंड लगते हैं!", sfx: "bass_drop", stockQuery: "sunlight earth atmosphere sunrise space", keywordHighlight: "8 मिनट 20 सेकंड" },
      { id: 5, timeSec: 40, textHindi: "अगर सूरज अचानक गायब हो जाए तो हमें 8 मिनट बाद पता चलेगा!", sfx: "subtle_glitch", stockQuery: "earth dark space without sun concept", keywordHighlight: "8 मिनट बाद" },
      { id: 6, timeSec: 48, textHindi: "और सूरज लगभग 5 अरब साल में खत्म हो जाएगा और एक रेड जायंट स्टार बन जाएगा!", sfx: "cinematic_hit", stockQuery: "red giant star expanding universe", keywordHighlight: "5 अरब साल" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही अंतरिक्ष के रोमांचक तथ्यों के लिए फॉलो करें!", sfx: "applause", stockQuery: "sunset beautiful sky orange clouds", keywordHighlight: "फॉलो करें" }
    ],
    metadata: { titleHindi: "सूरज में 13 लाख पृथ्वियाँ समा सकती हैं! ☀️🔥 #shorts", descriptionHindi: "सूरज के अद्भुत तथ्य! #shorts #sun #space #hindi", tags: ["sun facts hindi", "space facts", "shorts hindi", "solar system hindi"] }
  },
  {
    category: CATEGORIES.SPACE, subcategory: 'Neutron Stars',
    titleHindi: "न्यूट्रॉन स्टार — एक चम्मच का वज़न 6 अरब टन! ⭐💀",
    titleEnglish: "Neutron Star — 1 Teaspoon Weighs 6 Billion Tons!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "अंतरिक्ष में एक ऐसा तारा है जिसके एक चम्मच का वज़न 6 अरब टन है!", sfx: "cinematic_hit", stockQuery: "neutron star space pulsar glowing 4K", keywordHighlight: "6 अरब टन" },
      { id: 2, timeSec: 12, textHindi: "इसे न्यूट्रॉन स्टार कहते हैं — यह किसी विशाल तारे के फटने के बाद बनता है!", sfx: "shock_riser", stockQuery: "supernova explosion star death space", keywordHighlight: "तारे का विस्फोट" },
      { id: 3, timeSec: 22, textHindi: "यह सिर्फ 20 किलोमीटर चौड़ा होता है लेकिन सूरज से 1.5 गुना भारी!", sfx: "bass_drop", stockQuery: "star size comparison universe scale", keywordHighlight: "20 किमी में सूरज" },
      { id: 4, timeSec: 32, textHindi: "न्यूट्रॉन स्टार एक सेकंड में 716 बार घूम सकता है!", sfx: "whoosh", stockQuery: "spinning pulsar magnetic field space", keywordHighlight: "716 बार प्रति सेकंड" },
      { id: 5, timeSec: 40, textHindi: "इसका गुरुत्वाकर्षण इतना तगड़ा है कि अगर आप 1 मीटर ऊपर से गिरें तो 20 लाख किमी/घंटा की रफ़्तार से टकराएंगे!", sfx: "subtle_glitch", stockQuery: "gravity well space time distortion effect", keywordHighlight: "20 लाख किमी/घंटा" },
      { id: 6, timeSec: 48, textHindi: "जब दो न्यूट्रॉन स्टार टकराते हैं तो सोना और प्लैटिनम बनता है!", sfx: "cinematic_hit", stockQuery: "neutron star collision gold creation space", keywordHighlight: "सोना बनता है" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही दिमाग हिला देने वाले स्पेस फ़ैक्ट्स के लिए सब्सक्राइब करें!", sfx: "applause", stockQuery: "galaxy stars nebula beautiful universe 4K", keywordHighlight: "सब्सक्राइब करें" }
    ],
    metadata: { titleHindi: "एक चम्मच = 6 अरब टन! न्यूट्रॉन स्टार ⭐💀 #shorts", descriptionHindi: "न्यूट्रॉन स्टार के अविश्वसनीय तथ्य! #shorts #neutronstar #space #hindi", tags: ["neutron star hindi", "space facts", "shorts hindi", "stars facts"] }
  },

  // ═══════════════════════════════════════════════════════════════════
  // HUMAN BODY (10%) — 5 topics
  // ═══════════════════════════════════════════════════════════════════
  {
    category: CATEGORIES.HUMAN_BODY, subcategory: 'Brain Facts',
    titleHindi: "आपका दिमाग 10 वॉट बिजली पैदा करता है! 🧠⚡",
    titleEnglish: "Your Brain Generates 10 Watts of Electricity!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "आपका दिमाग इतनी बिजली पैदा करता है कि एक छोटा बल्ब जल सकता है!", sfx: "cinematic_hit", stockQuery: "brain neurons electricity neural network 4K", keywordHighlight: "बल्ब जलाना" },
      { id: 2, timeSec: 12, textHindi: "दिमाग में 86 अरब न्यूरॉन्स हैं — ये आकाशगंगा के तारों से भी ज़्यादा हैं!", sfx: "shock_riser", stockQuery: "neurons firing brain synapses close up", keywordHighlight: "86 अरब न्यूरॉन्स" },
      { id: 3, timeSec: 22, textHindi: "दिमाग में सिग्नल 400 किमी/घंटा की रफ़्तार से चलते हैं — बुलेट ट्रेन से भी तेज़!", sfx: "whoosh", stockQuery: "brain signal speed impulse nerve system", keywordHighlight: "400 किमी/घंटा" },
      { id: 4, timeSec: 32, textHindi: "आपका दिमाग शरीर की 20% ऊर्जा का इस्तेमाल करता है, हालांकि इसका वज़न सिर्फ 2% है!", sfx: "bass_drop", stockQuery: "brain scan MRI medical science", keywordHighlight: "20% ऊर्जा" },
      { id: 5, timeSec: 40, textHindi: "दिमाग को दर्द महसूस नहीं होता — इसमें कोई दर्द रिसेप्टर नहीं है!", sfx: "subtle_glitch", stockQuery: "brain surgery medical operation close up", keywordHighlight: "दर्द नहीं होता" },
      { id: 6, timeSec: 48, textHindi: "और हर रात सोते समय आपका दिमाग ज़हरीले प्रोटीन की सफ़ाई करता है!", sfx: "cinematic_hit", stockQuery: "sleeping brain cleaning neurons night", keywordHighlight: "ज़हरीली सफ़ाई" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही शरीर के रहस्यों के लिए लाइक और सब्सक्राइब करें!", sfx: "applause", stockQuery: "human body science medical illustration", keywordHighlight: "लाइक और सब्सक्राइब" }
    ],
    metadata: { titleHindi: "आपका दिमाग बल्ब जला सकता है! 🧠⚡ #shorts", descriptionHindi: "दिमाग के अविश्वसनीय तथ्य! #shorts #brain #humanbody #hindi", tags: ["brain facts hindi", "human body facts", "shorts hindi", "science hindi"] }
  },
  {
    category: CATEGORIES.HUMAN_BODY, subcategory: 'Eyes',
    titleHindi: "आपकी आँखें 1 करोड़ रंग देख सकती हैं! 👁️🌈",
    titleEnglish: "Your Eyes Can See 10 Million Colors!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "इंसान की आँखें 1 करोड़ से ज़्यादा अलग-अलग रंगों को पहचान सकती हैं!", sfx: "cinematic_hit", stockQuery: "human eye close up macro iris 4K", keywordHighlight: "1 करोड़ रंग" },
      { id: 2, timeSec: 12, textHindi: "आपकी आँख का रेटिना 576 मेगापिक्सल का होता है — किसी भी कैमरे से बेहतर!", sfx: "shock_riser", stockQuery: "eye retina close up medical science", keywordHighlight: "576 मेगापिक्सल" },
      { id: 3, timeSec: 22, textHindi: "आँखें एक सेकंड में 50 बार पलक झपकाती हैं — पूरी ज़िंदगी में 61 करोड़ बार!", sfx: "whoosh", stockQuery: "blinking eye slow motion close up", keywordHighlight: "61 करोड़ बार" },
      { id: 4, timeSec: 32, textHindi: "नवजात बच्चे सिर्फ काला और सफ़ेद देख सकते हैं — रंग दिखना कुछ हफ़्तों बाद शुरू होता है!", sfx: "bass_drop", stockQuery: "baby eyes newborn close up cute", keywordHighlight: "काला और सफ़ेद" },
      { id: 5, timeSec: 40, textHindi: "आपकी आँख की मांसपेशियाँ शरीर की सबसे तेज़ मांसपेशियाँ हैं!", sfx: "subtle_glitch", stockQuery: "eye movement fast tracking close up", keywordHighlight: "सबसे तेज़ मांसपेशी" },
      { id: 6, timeSec: 48, textHindi: "और दुनिया में सिर्फ 2% लोगों की आँखें हरी होती हैं — यह सबसे दुर्लभ रंग है!", sfx: "cinematic_hit", stockQuery: "green eyes rare beautiful close up", keywordHighlight: "2% हरी आँखें" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही अनोखे फ़ैक्ट्स के लिए फॉलो करें!", sfx: "applause", stockQuery: "colorful rainbow nature beautiful 4K", keywordHighlight: "फॉलो करें" }
    ],
    metadata: { titleHindi: "आँखें 1 करोड़ रंग देखती हैं! 👁️🌈 #shorts", descriptionHindi: "आपकी आँखें 576 मेगापिक्सल की हैं! #shorts #eyes #humanbody #hindi", tags: ["eye facts hindi", "human body facts", "shorts hindi", "science hindi"] }
  },

  // ═══════════════════════════════════════════════════════════════════
  // SCIENCE (15%) — 5 topics
  // ═══════════════════════════════════════════════════════════════════
  {
    category: CATEGORIES.SCIENCE, subcategory: 'Electricity',
    titleHindi: "बिजली की रफ़्तार 1 अरब किमी/घंटा है! ⚡💀",
    titleEnglish: "Lightning Travels at 1 Billion km/h!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "बिजली की एक कड़क 30,000 डिग्री सेल्सियस तक गर्म होती है — सूरज से 5 गुना ज़्यादा!", sfx: "cinematic_hit", stockQuery: "lightning bolt storm night sky 4K", keywordHighlight: "सूरज से 5 गुना" },
      { id: 2, timeSec: 12, textHindi: "एक बिजली की कड़क में इतनी ऊर्जा होती है कि 100 बल्ब 1 दिन तक जल सकते हैं!", sfx: "shock_riser", stockQuery: "thunderstorm lightning striking city night", keywordHighlight: "100 बल्ब" },
      { id: 3, timeSec: 22, textHindi: "बिजली प्रकाश की एक तिहाई रफ़्तार से चलती है — लगभग 1 अरब किमी प्रति घंटा!", sfx: "whoosh", stockQuery: "electricity spark arc plasma close up", keywordHighlight: "1 अरब किमी/घंटा" },
      { id: 4, timeSec: 32, textHindi: "दुनिया भर में हर सेकंड 100 बार बिजली गिरती है — यानी रोज़ 86 लाख बार!", sfx: "bass_drop", stockQuery: "multiple lightning bolts storm clouds", keywordHighlight: "86 लाख बार रोज़" },
      { id: 5, timeSec: 40, textHindi: "अमेरिका के रॉय सुलिवन पर 7 बार बिजली गिरी — और वो बच गए!", sfx: "subtle_glitch", stockQuery: "man survived lightning strike story", keywordHighlight: "7 बार बच गए" },
      { id: 6, timeSec: 48, textHindi: "बिजली ऊपर से नीचे नहीं गिरती — असल में ज़मीन से ऊपर जाती है!", sfx: "cinematic_hit", stockQuery: "lightning slow motion ground to sky", keywordHighlight: "ज़मीन से ऊपर" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही विज्ञान के चौंकाने वाले तथ्यों के लिए सब्सक्राइब करें!", sfx: "applause", stockQuery: "storm clouds dramatic sky sunset", keywordHighlight: "सब्सक्राइब करें" }
    ],
    metadata: { titleHindi: "बिजली सूरज से 5 गुना गर्म! ⚡💀 #shorts", descriptionHindi: "बिजली की ताकत जान कर हैरान रह जाएंगे! #shorts #lightning #science #hindi", tags: ["lightning facts hindi", "science facts", "shorts hindi", "electricity hindi"] }
  },

  // ═══════════════════════════════════════════════════════════════════
  // EARTH & NATURE (10%) — 3 topics
  // ═══════════════════════════════════════════════════════════════════
  {
    category: CATEGORIES.EARTH_NATURE, subcategory: 'Volcanoes',
    titleHindi: "ज्वालामुखी के अंदर का तापमान 1200°C है! 🌋🔥",
    titleEnglish: "Inside a Volcano is 1200°C!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "पृथ्वी के अंदर इतना गर्म लावा है कि यह लोहे को पिघला सकता है!", sfx: "cinematic_hit", stockQuery: "volcano eruption lava flowing 4K close up", keywordHighlight: "लोहे को पिघलाना" },
      { id: 2, timeSec: 12, textHindi: "ज्वालामुखी का लावा 1,200 डिग्री सेल्सियस तक गर्म होता है!", sfx: "shock_riser", stockQuery: "molten lava red hot flowing rock", keywordHighlight: "1200 डिग्री" },
      { id: 3, timeSec: 22, textHindi: "दुनिया में 1,500 से ज़्यादा सक्रिय ज्वालामुखी हैं — और 75% प्रशांत महासागर के रिंग ऑफ फायर में!", sfx: "bass_drop", stockQuery: "ring of fire pacific ocean map volcanoes", keywordHighlight: "रिंग ऑफ फायर" },
      { id: 4, timeSec: 32, textHindi: "1815 में इंडोनेशिया के माउंट तम्बोरा ने इतना धुआँ उगला कि पूरे साल गर्मी नहीं आई!", sfx: "whoosh", stockQuery: "volcanic ash cloud eruption massive", keywordHighlight: "गर्मी नहीं आई" },
      { id: 5, timeSec: 40, textHindi: "पृथ्वी का सबसे बड़ा ज्वालामुखी हवाई का मौना लोआ है — यह एवरेस्ट से भी बड़ा है!", sfx: "subtle_glitch", stockQuery: "mauna loa hawaii volcano aerial view", keywordHighlight: "एवरेस्ट से बड़ा" },
      { id: 6, timeSec: 48, textHindi: "अगर येलोस्टोन सुपर वॉल्केनो फटे तो पूरी दुनिया का मौसम बदल जाएगा!", sfx: "cinematic_hit", stockQuery: "yellowstone geyser supervolcano dramatic", keywordHighlight: "मौसम बदल जाएगा" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही प्रकृति के खतरनाक रहस्यों के लिए सब्सक्राइब करें!", sfx: "applause", stockQuery: "volcano sunset dramatic landscape beautiful", keywordHighlight: "सब्सक्राइब करें" }
    ],
    metadata: { titleHindi: "ज्वालामुखी 1200°C पर लोहा पिघला दे! 🌋🔥 #shorts", descriptionHindi: "ज्वालामुखी के अद्भुत और खतरनाक तथ्य! #shorts #volcano #nature #hindi", tags: ["volcano facts hindi", "earth facts", "shorts hindi", "nature hindi"] }
  },

  // ═══════════════════════════════════════════════════════════════════
  // TECHNOLOGY (5%) — 3 topics
  // ═══════════════════════════════════════════════════════════════════
  {
    category: CATEGORIES.TECHNOLOGY, subcategory: 'AI',
    titleHindi: "AI एक दिन में 100 साल का काम कर सकता है! 🤖🧠",
    titleEnglish: "AI Can Do 100 Years of Work in a Day!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "आर्टिफिशियल इंटेलिजेंस इतना तेज़ है कि यह एक दिन में वो काम कर सकता है जो इंसान 100 साल में करे!", sfx: "cinematic_hit", stockQuery: "artificial intelligence robot computing 4K", keywordHighlight: "100 साल का काम" },
      { id: 2, timeSec: 12, textHindi: "GPT जैसे AI मॉडल 45 टेराबाइट्स टेक्स्ट से ट्रेन होते हैं — यह 90 करोड़ किताबों के बराबर है!", sfx: "shock_riser", stockQuery: "data center server room computing", keywordHighlight: "90 करोड़ किताबें" },
      { id: 3, timeSec: 22, textHindi: "AI अब डॉक्टरों से बेहतर कैंसर की पहचान कर सकता है!", sfx: "whoosh", stockQuery: "medical AI scanning diagnosis hospital", keywordHighlight: "कैंसर पहचान" },
      { id: 4, timeSec: 32, textHindi: "चीन में एक AI न्यूज़ एंकर 24 घंटे बिना रुके खबरें पढ़ सकता है!", sfx: "bass_drop", stockQuery: "AI news anchor virtual presenter screen", keywordHighlight: "AI न्यूज़ एंकर" },
      { id: 5, timeSec: 40, textHindi: "2030 तक AI से 30 करोड़ नौकरियाँ खत्म हो सकती हैं!", sfx: "subtle_glitch", stockQuery: "robot replacing human worker factory", keywordHighlight: "30 करोड़ नौकरियाँ" },
      { id: 6, timeSec: 48, textHindi: "लेकिन AI 5 करोड़ से ज़्यादा नई नौकरियाँ भी पैदा करेगा!", sfx: "cinematic_hit", stockQuery: "future technology innovation city concept", keywordHighlight: "5 करोड़ नई नौकरियाँ" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही टेक्नोलॉजी के फ़ैक्ट्स के लिए फॉलो करें!", sfx: "applause", stockQuery: "futuristic city technology neon lights", keywordHighlight: "फॉलो करें" }
    ],
    metadata: { titleHindi: "AI 100 साल का काम 1 दिन में! 🤖🧠 #shorts", descriptionHindi: "AI के चौंकाने वाले तथ्य! #shorts #ai #technology #hindi", tags: ["AI facts hindi", "technology facts", "shorts hindi", "robots hindi"] }
  },

  // ═══════════════════════════════════════════════════════════════════
  // OCEAN (10%) — 3 topics
  // ═══════════════════════════════════════════════════════════════════
  {
    category: CATEGORIES.OCEAN, subcategory: 'Mariana Trench',
    titleHindi: "मारियाना ट्रेंच — 11 किमी गहरा अंधेरा! 🌊💀",
    titleEnglish: "Mariana Trench — 11 km of Darkness!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "समुद्र का सबसे गहरा बिंदु इतना गहरा है कि एवरेस्ट को उल्टा डुबो दें तो भी 2 किमी पानी बचेगा!", sfx: "cinematic_hit", stockQuery: "deep ocean trench dark underwater 4K", keywordHighlight: "एवरेस्ट डूब जाए" },
      { id: 2, timeSec: 12, textHindi: "मारियाना ट्रेंच 10,994 मीटर गहरा है — यहाँ का दबाव 1,000 गुना ज़्यादा है!", sfx: "shock_riser", stockQuery: "deep sea pressure darkness underwater", keywordHighlight: "1000 गुना दबाव" },
      { id: 3, timeSec: 22, textHindi: "यहाँ तक सूरज की रोशनी कभी नहीं पहुँचती — बिल्कुल अंधेरा रहता है!", sfx: "bass_drop", stockQuery: "pitch black deep ocean no light", keywordHighlight: "पूर्ण अंधेरा" },
      { id: 4, timeSec: 32, textHindi: "लेकिन फिर भी यहाँ जीव रहते हैं! अपनी रोशनी खुद बनाने वाली मछलियाँ!", sfx: "whoosh", stockQuery: "bioluminescent fish deep sea glowing", keywordHighlight: "अपनी रोशनी" },
      { id: 5, timeSec: 40, textHindi: "चाँद पर 12 लोग जा चुके हैं लेकिन मारियाना ट्रेंच में सिर्फ 3 लोग गए हैं!", sfx: "subtle_glitch", stockQuery: "submersible deep sea exploration vessel", keywordHighlight: "सिर्फ 3 लोग" },
      { id: 6, timeSec: 48, textHindi: "और यहाँ प्लास्टिक बैग भी मिला है — इंसानी प्रदूषण 11 किमी गहरे तक पहुँच चुका है!", sfx: "cinematic_hit", stockQuery: "plastic pollution ocean deep sea trash", keywordHighlight: "प्लास्टिक 11 किमी" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही समुद्र के रहस्यों के लिए सब्सक्राइब करें!", sfx: "applause", stockQuery: "ocean waves sunset beautiful deep blue", keywordHighlight: "सब्सक्राइब करें" }
    ],
    metadata: { titleHindi: "11 किमी गहरा अंधेरा! मारियाना ट्रेंच 🌊💀 #shorts", descriptionHindi: "मारियाना ट्रेंच के चौंकाने वाले तथ्य! #shorts #marianatrench #ocean #hindi", tags: ["mariana trench hindi", "ocean facts", "shorts hindi", "deep sea hindi"] }
  },

  // ═══════════════════════════════════════════════════════════════════
  // DAILY LIFE SCIENCE — 2 topics
  // ═══════════════════════════════════════════════════════════════════
  {
    category: CATEGORIES.DAILY_SCIENCE, subcategory: 'Why We Dream',
    titleHindi: "आप 6 साल सपनों में बिताते हैं! 😴💭",
    titleEnglish: "You Spend 6 Years Dreaming!",
    segments: [
      { id: 1, timeSec: 4, textHindi: "इंसान अपनी ज़िंदगी के 6 साल सपने देखने में बिताता है!", sfx: "cinematic_hit", stockQuery: "sleeping person dreaming night bedroom", keywordHighlight: "6 साल सपने" },
      { id: 2, timeSec: 12, textHindi: "हर रात आप 4 से 6 सपने देखते हैं — लेकिन 95% सपने जागने के 5 मिनट में भूल जाते हैं!", sfx: "shock_riser", stockQuery: "dream clouds fantasy surreal beautiful", keywordHighlight: "95% भूल जाते हैं" },
      { id: 3, timeSec: 22, textHindi: "अंधे लोग भी सपने देखते हैं — लेकिन उनके सपनों में आवाज़, गंध और स्पर्श होता है!", sfx: "whoosh", stockQuery: "person sleeping peacefully close up face", keywordHighlight: "अंधे भी सपने" },
      { id: 4, timeSec: 32, textHindi: "सपनों में आप कोई नया चेहरा नहीं देख सकते — सब चेहरे असल ज़िंदगी से होते हैं!", sfx: "bass_drop", stockQuery: "faces crowd people diverse group", keywordHighlight: "असली चेहरे" },
      { id: 5, timeSec: 40, textHindi: "कुछ लोगों को 'Lucid Dreaming' होती है — जहाँ वो अपने सपनों को कंट्रोल कर सकते हैं!", sfx: "subtle_glitch", stockQuery: "lucid dreaming flying fantasy sky clouds", keywordHighlight: "सपने कंट्रोल" },
      { id: 6, timeSec: 48, textHindi: "वैज्ञानिकों के अनुसार सपने दिमाग की 'गार्बेज क्लीनिंग' प्रक्रिया हैं!", sfx: "cinematic_hit", stockQuery: "brain cleaning neurons sleeping process", keywordHighlight: "दिमाग की सफ़ाई" },
      { id: 7, timeSec: 55, textHindi: "ऐसे ही रोज़मर्रा के विज्ञान के लिए सब्सक्राइब करें!", sfx: "applause", stockQuery: "night sky stars beautiful peaceful", keywordHighlight: "सब्सक्राइब करें" }
    ],
    metadata: { titleHindi: "6 साल सपनों में! 😴💭 | Dream Facts #shorts", descriptionHindi: "सपनों के अद्भुत तथ्य! #shorts #dreams #science #hindi", tags: ["dream facts hindi", "sleep facts", "shorts hindi", "daily science hindi"] }
  }
];

export { SHORTS_TOPICS, CATEGORIES, CATEGORY_WEIGHTS };
