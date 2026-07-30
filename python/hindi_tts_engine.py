import os
import json
import urllib.request
import urllib.parse

class HindiTTSEngine:
    def format_srt_time(self, seconds):
        hrs = int(seconds // 3600)
        mins = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"

    def generate_hindi_audio(self, script_payload, output_dir):
        os.makedirs(output_dir, exist_ok=True)
        audio_path = os.path.join(output_dir, "narration_hindi.mp3")
        srt_path = os.path.join(output_dir, "subtitles_hindi.srt")

        segments = script_payload.get("segments", [])
        srt_content = ""
        current_time = 0.0
        audio_chunks = []

        for idx, seg in enumerate(segments):
            start_str = self.format_srt_time(current_time)
            duration = float(seg.get("timeSec", 5))
            current_time += duration
            end_str = self.format_srt_time(current_time)

            text_hindi = seg.get("textHindi", "")
            srt_content += f"{idx + 1}\n{start_str} --> {end_str}\n{text_hindi}\n\n"

            # Download crystal-clear Hindi TTS audio chunk from Google Translate REST API
            try:
                encoded_text = urllib.parse.quote(text_hindi)
                tts_url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={encoded_text}&tl=hi&client=tw-ob"
                req = urllib.request.Request(tts_url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req) as response:
                    audio_chunks.append(response.read())
            except Exception as e:
                print(f"[PythonTTS Warning] Chunk {idx+1} fallback: {e}")

        # Save SRT file
        with open(srt_path, "w", encoding="utf-8") as f:
            f.write(srt_content)

        # Save MP3 audio narration
        if audio_chunks:
            with open(audio_path, "wb") as f:
                for chunk in audio_chunks:
                    f.write(chunk)
            print(f"[PythonTTS] Real Hindi MP3 voiceover saved -> {audio_path} ({os.path.getsize(audio_path)} bytes)")

        return {
            "audioPath": audio_path,
            "srtPath": srt_path,
            "durationTotalSec": current_time
        }

if __name__ == "__main__":
    engine = HindiTTSEngine()
    sample_payload = {
        "titleHindi": "यह जीव पानी के अंदर सूरज जितना ताकतोवर धमाका करता है!",
        "segments": [{"textHindi": "क्या आप जानते हैं समुद्र का यह छोटा सा जीव!", "timeSec": 5}]
    }
    manifest = engine.generate_hindi_audio(sample_payload, "output/py_test")
    print(json.dumps(manifest, indent=2))
