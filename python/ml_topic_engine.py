import json
import os
import math
import random
from collections import Counter

# Advanced Python ML Deduplication & Viral Scoring Engine
class MLTopicEngine:
    def __init__(self, data_dir="data"):
        self.data_dir = data_dir
        self.memory_path = os.path.join(data_dir, "topic_memory.json")
        self._ensure_storage()

    def _ensure_storage(self):
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir, exist_ok=True)
        if not os.path.exists(self.memory_path):
            with open(self.memory_path, "w", encoding="utf-8") as f:
                json.dump({"topics": [], "factsHash": {}}, f, ensure_ascii=False, indent=2)

    def load_memory(self):
        self._ensure_storage()
        try:
            with open(self.memory_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"topics": [], "factsHash": {}}

    def _tokenize(self, text):
        import re
        words = re.findall(r'[\w\u0900-\u097F]+', text.lower())
        return [w for w in words if len(w) > 2]

    def _cosine_similarity(self, text1, text2):
        vec1 = Counter(self._tokenize(text1))
        vec2 = Counter(self._tokenize(text2))
        
        intersection = set(vec1.keys()) & set(vec2.keys())
        numerator = sum([vec1[x] * vec2[x] for x in intersection])
        
        sum1 = sum([vec1[x]**2 for x in vec1.keys()])
        sum2 = sum([vec2[x]**2 for x in vec2.keys()])
        denominator = math.sqrt(sum1) * math.sqrt(sum2)
        
        if not denominator:
            return 0.0
        return float(numerator) / denominator

    def is_topic_used(self, title_hindi, facts_list=None):
        memory = self.load_memory()
        for item in memory.get("topics", []):
            existing_title = item.get("titleHindi", "")
            sim = self._cosine_similarity(title_hindi, existing_title)
            if sim > 0.45:
                return True, f"High ML Cosine Similarity ({round(sim*100, 1)}%) to '{existing_title}'"
        return False, "Unique Topic"

    def predict_viral_topic(self, content_type="short"):
        categories = [
            {"cat": "Deep Sea Monsters", "kw": "pistol shrimp", "score": 97},
            {"cat": "Deadliest Predators", "kw": "box jellyfish", "score": 98},
            {"cat": "Superpowers", "kw": "immortal jellyfish", "score": 95},
            {"cat": "Bizarre Intelligence", "kw": "octopus 9 brains", "score": 96}
        ]
        choice = random.choice(categories)
        
        if content_type == "short":
            title = f"इस जीव का यह ख़तरनाक सच आपको हैरान कर देगा! 😱"
        else:
            title = f"दुनिया के 10 सबसे ख़तरनाक और अनोखे जीव! 😱 | Deep Sea Predators"

        used, reason = self.is_topic_used(title)
        return {
            "type": content_type,
            "category": choice["cat"],
            "keyword": choice["kw"],
            "viralScore": choice["score"],
            "titleHindi": title,
            "isUnique": not used,
            "dedupCheck": reason
        }

if __name__ == "__main__":
    engine = MLTopicEngine()
    topic = engine.predict_viral_topic("short")
    print(json.dumps(topic, ensure_ascii=False, indent=2))
