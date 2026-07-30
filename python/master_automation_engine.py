import os
import sys
import json
import time

from ml_topic_engine import MLTopicEngine
from hindi_script_generator import HindiScriptGenerator
from hindi_tts_engine import HindiTTSEngine

class MasterAutomationEngine:
    def __init__(self, output_base="output"):
        self.output_base = output_base
        self.ml_engine = MLTopicEngine()
        self.script_gen = HindiScriptGenerator()
        self.tts_engine = HindiTTSEngine()

    def run_pipeline(self, content_type="short"):
        output_id = f"{content_type}_{int(time.time()*1000)}"
        output_dir = os.path.join(self.output_base, output_id)
        os.makedirs(output_dir, exist_ok=True)

        print(f"\n=============================================================")
        print(f"🔥 PYTHON ADVANCED ML & AUTOMATION ENGINE START [{content_type.upper()}] 🔥")
        print(f"=============================================================")

        # Step 1: ML Topic Predictor & Zero-Repetition Similarity Check
        print(f"Step 1/5: Running Python ML Topic Predictor & Cosine Similarity Deduplication...")
        topic = self.ml_engine.predict_viral_topic(content_type)
        print(f"Predicted Topic: '{topic['titleHindi']}' (Viral Score: {topic['viralScore']}/100)")
        print(f"ML Dedup Result: {topic['dedupCheck']}")

        # Step 2: High-Retention Hindi Script Synthesis
        print(f"Step 2/5: Synthesizing Pattern-Interrupt Hindi Script...")
        script = self.script_gen.generate_short_script(topic["keyword"], topic["category"])

        # Step 3: Hindi Voiceover Speech & SRT Subtitles
        print(f"Step 3/5: Synthesizing Hindi Neural Speech & Synchronized Devanagari SRT...")
        audio_manifest = self.tts_engine.generate_hindi_audio(script, output_dir)

        # Step 4: Manifest & Output Preparation
        print(f"Step 4/5: Finalizing video payload manifest...")
        manifest = {
            "outputId": output_id,
            "type": content_type,
            "topic": topic,
            "script": script,
            "audio": audio_manifest,
            "status": "COMPLETED_VIA_PYTHON_ML_ENGINE"
        }

        manifest_path = os.path.join(output_dir, "python_manifest.json")
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)

        print(f"Step 5/5: Python ML Engine execution finished successfully!")
        print(f"Saved Manifest -> {manifest_path}")
        print(f"=============================================================\n")

        return manifest

if __name__ == "__main__":
    content_type = sys.argv[1] if len(sys.argv) > 1 else "short"
    engine = MasterAutomationEngine()
    engine.run_pipeline(content_type)
