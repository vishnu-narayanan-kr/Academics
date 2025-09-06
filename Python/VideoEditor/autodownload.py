from playwright.sync_api import sync_playwright
import time

url = "https://franime.fr/anime/dr-stone?s=2&ep=1&lang=vo&anime_id=42080"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto(url)
    print(page.title())

    time.sleep(2)  # Wait for the page to load
    #page.click('button:has-text("Regarder l\'épisode")')

    # Look for the checkbox element
    checkbox = page.query_selector("input[type='checkbox']")

    if checkbox:
        print("Verify Human page is shown. Checking the box...")
        checkbox.check()  # or page.check("input[type='checkbox']")
    else:
        print("No 'verify human' checkbox found, continuing...")

    #page.pause()
    input("Press Enter to close the browser...")
    #browser.close()
