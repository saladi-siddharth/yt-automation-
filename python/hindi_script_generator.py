import json

class HindiScriptGenerator:
    def generate_short_script(self, keyword, category):
        return {
            "type": "short",
            "language": "hindi",
            "titleHindi": "यह जीव पानी के अंदर सूरज जितना ताकतोवर धमाका करता है! 😱",
            "titleEnglish": f"Mind-Blowing Secret of {keyword}",
            "targetDurationSec": 40,
            "viralScore": 98,
            "segments": [
                {
                    "id": 1,
                    "timeSec": 3,
                    "textHindi": "क्या आप जानते हैं समुद्र का यह छोटा सा जीव सूरज जितना गर्म धमाका कर सकता है?",
                    "textEnglish": "Did you know this small sea creature can create an explosion as hot as the sun?",
                    "stockQuery": "pistol shrimp underwater ocean HD",
                    "keywordHighlight": "सूरज जितना गर्म धमाका"
                },
                {
                    "id": 2,
                    "timeSec": 10,
                    "textHindi": "इसे 'पिस्तौल श्रिम्प' कहते हैं! जब यह अपना पंजा झपटता है, तो पानी में 4,000 डिग्री सेल्सियस का बुलबुला बनता है!",
                    "textEnglish": "It's called the Pistol Shrimp! When it snaps its claw, it creates a bubble of 4,000°C!",
                    "stockQuery": "shrimp claw attack underwater macro",
                    "keywordHighlight": "4,000 डिग्री सेल्सियस"
                },
                {
                    "id": 3,
                    "timeSec": 20,
                    "textHindi": "यह धमाका इतना तेज़ होता है कि इसकी आवाज़ किसी जेट विमान की आवाज़ से भी ज़्यादा तेज़ होती है!",
                    "textEnglish": "This explosion is louder than a jet engine!",
                    "stockQuery": "jet engine explosion sound wave concept",
                    "keywordHighlight": "जेट विमान से भी तेज़"
                },
                {
                    "id": 4,
                    "timeSec": 30,
                    "textHindi": "और सबसे हैरानी की बात यह है कि यह झटका शिकार को एक ही सेकंड में बेहोश कर देता है!",
                    "textEnglish": "And most shockingly, it knocks out prey in just one second!",
                    "stockQuery": "ocean predator attack sea life",
                    "keywordHighlight": "एक ही सेकंड में बेहोश"
                },
                {
                    "id": 5,
                    "timeSec": 40,
                    "textHindi": "इसीलिए वैज्ञानिक कहते हैं...",
                    "textEnglish": "And that's why scientists say...",
                    "stockQuery": "underwater ocean mysterious depth",
                    "keywordHighlight": "इसीलिए वैज्ञानिक"
                }
            ],
            "fullHindiTranscript": "क्या आप जानते हैं समुद्र का यह छोटा सा जीव सूरज जितना गर्म धमाका कर सकता है? इसे 'पिस्तौल श्रिम्प' कहते हैं! जब यह अपना पंजा झपटता है, तो पानी में 4,000 डिग्री सेल्सियस का बुलबुला बनता है! यह धमाका इतना तेज़ होता है कि इसकी आवाज़ किसी जेट विमान की आवाज़ से भी ज़्यादा तेज़ होती है! और सबसे हैरानी की बात यह है कि यह झटका शिकार को एक ही सेकंड में बेहोश कर देता है! इसीलिए वैज्ञानिक कहते हैं..."
        }

if __name__ == "__main__":
    gen = HindiScriptGenerator()
    script = gen.generate_short_script("Pistol Shrimp", "Deep Sea")
    print(json.dumps(script, ensure_ascii=False, indent=2))
