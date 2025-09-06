import os
import fnmatch

def delete_temp_videos(folder_path):
    deleted_files = []
    for filename in os.listdir(folder_path):
        # Match files that contain 'vf' or 'vostfr' in the filename, but not the merged file
        if fnmatch.fnmatch(filename, '*vf*.mp4') or fnmatch.fnmatch(filename, '*vostfr*.mp4'):
            full_path = os.path.join(folder_path, filename)
            try:
                os.remove(full_path)
                deleted_files.append(filename)
                print(f"Deleted: {filename}")
            except Exception as e:
                print(f"Failed to delete {filename}: {e}")
    
    if not deleted_files:
        print("No temporary video files found for deletion.")

# Example usage after merging
folder_path = 'D:/_Anime/aot2'
delete_temp_videos(folder_path)
