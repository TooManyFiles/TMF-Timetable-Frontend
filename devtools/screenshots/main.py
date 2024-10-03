import time
import os
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from PIL import Image
screenshots_dir = '../../public/screenshots'
manifest_path = '../../manifest.json'
screenshots_uri = '/public/screenshots/'
# List of websites with optional interactions
websites = [
    {
        "url": "http://localhost:5500/login.html",
        "name": "login",
    },
    {
        "url": "http://localhost:5500/onboarding.html",
        "name": "getting-started",
    },
    {
        "url": "http://localhost:5500/",
        "name": "example",
    },
    {
        "url": "http://localhost:5500/",
        "name": "example2",
        "interactions": lambda driver: interact_example(driver)
    }
    # Add more websites with specific interactions here
]

def interact_example(driver):
    """Example interaction: Click a button, wait for element."""
    try:
        time.sleep(1)
        driver.find_element(By.ID, "m1").click()
        time.sleep(1)
    except Exception as e:
        print(f"Interaction failed: {e}")


def interact_example2(driver):
    """Example interaction: Scroll to bottom."""
    try:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)  # Wait for scroll to complete
    except Exception as e:
        print(f"Interaction failed: {e}")
        


manifest = {"screenshots": []}

# Ensure the screenshots directory exists
if not os.path.exists(screenshots_dir):
    os.makedirs(screenshots_dir)

# Load existing manifest.json if it exists
if os.path.exists(manifest_path):
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
        

running_in_github_actions = os.getenv('GITHUB_ACTIONS') == 'true'

# Set up Chrome options for Selenium
chrome_options = Options()
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--window-size=1280x800')
chrome_options.add_argument("--headless")  # Run headless
chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems

chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration
driver = None
if running_in_github_actions:
    driver = webdriver.Remote(
        command_executor='http://localhost:4444/wd/hub',
        options=chrome_options
    )
else:
    # Initialize WebDriver
    driver = webdriver.Chrome(options=chrome_options)
    
if not screenshots_uri.endswith('/'):
    screenshots_uri += '/'
if not screenshots_dir.endswith('/'):
    screenshots_dir += '/'

def capture_screenshot(site, viewport_size, form_factor):
    """Capture screenshot for the given viewport size."""
    driver.set_window_rect(0,0,*viewport_size)
    screenshot_path = f"{screenshots_dir}{site['name']}-{form_factor}.png"
    driver.save_screenshot(screenshot_path)
    
    # Use PIL to open the screenshot and get its size
    with Image.open(screenshot_path) as img:
        actual_width, actual_height = img.size
    # Check the aspect ratio condition
    if form_factor == "wide" and actual_width > 2.3 * actual_height:
        print(f"Error: Screenshot width ({actual_width}px) exceeds 2.3 times the height ({actual_height}px).")
    print(f"Captured screenshot for {site['name']} - {form_factor}: {actual_width}x{actual_height}")  # Print actual sizes
    
    # Check if the screenshot src already exists in the manifest
    existing_entry = next((entry for entry in manifest["screenshots"] if entry["src"] == f"{screenshots_uri}{site['name']}-{form_factor}.png"), None)

    if existing_entry:
        # Update the existing entry
        existing_entry["sizes"] = f"{actual_width}x{actual_height}"  # Update sizes
        existing_entry["type"] = "image/png"  # Ensure type is set
        existing_entry["form_factor"] = form_factor  # Update form factor
    else:
        # Add a new entry to the manifest
        manifest["screenshots"].append({
            "src": f"{screenshots_uri}{site['name']}-{form_factor}.png",
            "sizes": f"{actual_width}x{actual_height}",  # Use actual dimensions
            "type": "image/png",
            "form_factor": form_factor
        })

for site in websites:
    try:
        # Visit the website
        driver.get(site["url"])

        # Perform any interactions defined for this website
        if "interactions" in site and callable(site["interactions"]):
            site["interactions"](driver)
        
        # Capture wide (desktop) screenshot
        capture_screenshot(site, (1000, 654), "wide")  # Example width

        # Capture narrow (mobile) screenshot
        capture_screenshot(site, (469, 505), "narrow")  # Maintain existing size or adjust slightly if necessary



        print(f"Captured screenshots for {site['url']}")

    except Exception as e:
        print(f"Failed to capture {site['url']}: {e}")

# Close the WebDriver
driver.quit()

# Write the updated manifest.json file back
with open(manifest_path, 'w') as f:
    json.dump(manifest, f, indent=2)

print("Manifest updated at ../../manifest.json.")