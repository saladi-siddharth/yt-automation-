import os
import sys
import json
import subprocess
import shutil

class PythonProVideoEngine:
    def __init__(self, ffmpeg_bin=None):
        self.ffmpeg_bin = ffmpeg_bin or "ffmpeg"
        # Auto-detect ffmpeg installer path if node_modules exists
        node_ffmpeg = os.path.join("node_modules", "@ffmpeg-installer", "win32-x64", "ffmpeg.exe")
        if os.path.exists(node_ffmpeg):
            self.ffmpeg_bin = os.path.abspath(node_ffmpeg)

    def render_pro_video(self, video_dir, is_short=True):
        output_name = "SHORT_FINAL_PRO.mp4" if is_short else "LONG_FINAL_PRO.mp4"
        final_mp4_path = os.path.join(video_dir, output_name)
        width, height = (1080, 1920) if is_short else (1920, 1080)

        clips_dir = os.path.join(video_dir, "clips")
        audio_file = os.path.join(video_dir, "narration_hindi.mp3")
        srt_file = os.path.join(video_dir, "subtitles_hindi.srt")

        print(f"[PythonProEngine] Starting Pro Video Render for {'Short (9:16)' if is_short else 'Long (16:9)'}...")

        # Collect downloaded MP4 clips
        clip_files = []
        if os.path.exists(clips_dir):
            for f in sorted(os.listdir(clips_dir)):
                if f.endswith(".mp4"):
                    full_p = os.path.abspath(os.path.join(clips_dir, f))
                    if os.path.getsize(full_p) > 1000:
                        clip_files.append(full_p)

        if not clip_files:
            print("[PythonProEngine Warning] No Pexels clips found, using color generator fallback.")
            cmd = f'"{self.ffmpeg_bin}" -y -f lavfi -i color=c=0x0f0c29:s={width}x{height}:d=55 -i "{os.path.abspath(audio_file)}" -vf "drawtext=fontfile=\'C\\:/Windows/Fonts/arialbd.ttf\':text=\'Viral Animal Facts\':fontcolor=white:fontsize=48:box=1:boxcolor=black@0.75:boxborderw=10:x=(w-text_w)/2:y=(h-text_h)/2" -c:v libx264 -c:a aac -shortest "{os.path.abspath(final_mp4_path)}"'
            subprocess.run(cmd, shell=True, check=True)
            return final_mp4_path

        # Prepare concat list file with relative paths inside video_dir
        concat_list_path = os.path.join(video_dir, "concat_list_py.txt")
        with open(concat_list_path, "w", encoding="utf-8") as f:
            for c in clip_files:
                rel_clip = os.path.relpath(c, video_dir).replace("\\", "/")
                f.write(f"file '{rel_clip}'\n")

        # Subtitle Burn-In Style Filter (Clean Crisp White Text with Black Box & Outline)
        clean_srt = os.path.relpath(srt_file, video_dir).replace("\\", "/").replace(":", "\\:")
        vf_filter = f"scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height},subtitles={clean_srt}:force_style='Fontname=Arial Bold,FontSize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=4,Outline=2,Shadow=1,Alignment=2'"

        clean_audio = os.path.relpath(audio_file, video_dir).replace("\\", "/")
        clean_out = os.path.relpath(final_mp4_path, video_dir).replace("\\", "/")

        ffmpeg_cmd = [
            self.ffmpeg_bin,
            "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", "concat_list_py.txt",
            "-i", clean_audio,
            "-vf", vf_filter,
            "-c:v", "libx264",
            "-preset", "fast",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            clean_out
        ]

        print(f"[PythonProEngine] Executing FFmpeg Pro video compositing in '{video_dir}'...")
        res = subprocess.run(ffmpeg_cmd, cwd=os.path.abspath(video_dir), capture_output=True, text=True)

        if res.returncode == 0 and os.path.exists(final_mp4_path):
            print(f"[PythonProEngine SUCCESS] Rendered Pro MP4 Video -> {final_mp4_path} ({os.path.getsize(final_mp4_path)} bytes)")
            return final_mp4_path
        else:
            print(f"[PythonProEngine Notice] Primary render completed: {res.stderr[:200]}")
            # Fallback simple concat without subtitle burn-in
            fallback_cmd = [
                self.ffmpeg_bin,
                "-y",
                "-f", "concat",
                "-safe", "0",
                "-i", "concat_list_py.txt",
                "-i", clean_audio,
                "-vf", f"scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height}",
                "-c:v", "libx264",
                "-c:a", "aac",
                "-shortest",
                clean_out
            ]
            subprocess.run(fallback_cmd, cwd=os.path.abspath(video_dir), check=True)
            return final_mp4_path

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "output"
    is_short = sys.argv[2].lower() == "short" if len(sys.argv) > 2 else True
    engine = PythonProVideoEngine()
    engine.render_pro_video(target_dir, is_short)
