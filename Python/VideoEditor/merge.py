import os
from moviepy import VideoFileClip

def merge_audio_video(folder_path):
    # Get all video files in the folder
    files = [f for f in os.listdir(folder_path) if f.endswith(".mp4")]

    # Create dictionaries for quick lookup
    vostfr_files = {}
    vf_files = {}

    # Populate the dictionaries
    for file in files:
        filename = file.lower()
        if "vostfr" in filename:
            key = filename.split("vostfr")[0].strip()
            vostfr_files[key] = file
        elif "vf" in filename:
            key = filename.split("vf")[0].strip()
            vf_files[key] = file

    # Loop through matching keys
    for key in vostfr_files.keys():
        if key in vf_files:
            vostfr_path = os.path.join(folder_path, vostfr_files[key])
            vf_path = os.path.join(folder_path, vf_files[key])
            output_path = os.path.join(folder_path, f"{key}_merged.mp4")

            print(f"Merging video: {vostfr_files[key]} + audio: {vf_files[key]} --> {key}_merged.mp4")

            try:
                # Load clips
                audio_clip = VideoFileClip(vf_path).audio
                video_clip = VideoFileClip(vostfr_path).without_audio()

                # Combine video and audio
                final_clip = video_clip.with_audio(audio_clip)

                # Write the output file
                final_clip.write_videofile(output_path, codec="libx264", audio_codec="aac", fps=video_clip.fps)

                # Cleanup
                video_clip.close()
                audio_clip.close()
                final_clip.close()

            except Exception as e:
                print(f"Error processing {key}: {e}")
        else:
            print(f"No matching 'vf' file for: {vostfr_files[key]}")

# === Usage ===

folder_path = 'D:/_Anime/aot2'
merge_audio_video(folder_path)
