import pyautogui
import time

print("You have 5 seconds to get your desktop ready...")
time.sleep(5)

absolute_path = "C:/Users/Vishnu Narayanan/Documents/GitHub/Academics/Python/Autodownload/images/"
# Locate the Brave icon on the screen
broser_icon_path = absolute_path + "brave_icon.jpg"
location = pyautogui.locateCenterOnScreen(broser_icon_path, confidence=0.8)

if location:
    pyautogui.click(location)  # Click the icon
    print("Brave browser opened.")
else:
    print("Could not find Brave icon. Make sure 'brave_icon.jpg' matches the icon on your screen.")

time.sleep(5)

watch_button_path = absolute_path + "watch_episode_button.jpg"
location = pyautogui.locateCenterOnScreen(watch_button_path, confidence=0.8)

if location:
    pyautogui.click(location)  # Click the icon
    print("Clicked on the watch episode button.")
else:
    print("Could not find watch episode button. Make sure 'watch_episode_button.jpg' matches the button on your screen.")
