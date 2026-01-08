from playwright.sync_api import sync_playwright

def verify_aria_labels():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the local server
        page.goto("http://localhost:3000")

        # 1. Verify Footer Inputs and Buttons
        # Scroll to bottom
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

        # Check input aria-label
        email_input = page.get_by_label("Email address")
        if email_input.count() > 0:
            print("SUCCESS: Found email input with aria-label='Email address'")
        else:
            print("FAILURE: Did not find email input with aria-label='Email address'")

        # Check submit button aria-label
        submit_btn = page.get_by_label("Subscribe")
        if submit_btn.count() > 0:
            print("SUCCESS: Found submit button with aria-label='Subscribe'")
        else:
            print("FAILURE: Did not find submit button with aria-label='Subscribe'")

        # 2. Verify Mobile Menu Close Button (simulate mobile)
        page.set_viewport_size({"width": 375, "height": 667})
        # Wait for resize to stabilize
        page.wait_for_timeout(1000)

        # Scroll to top to see the menu button
        page.evaluate("window.scrollTo(0, 0)")

        # Open mobile menu
        # Sometimes elements are unstable during resize/load. Force click or wait for stable.
        menu_btn = page.get_by_label("Toggle Menu")
        # Ensure it's in viewport
        menu_btn.scroll_into_view_if_needed()
        menu_btn.wait_for(state="visible")
        menu_btn.click(force=True)

        # Wait for menu to open
        page.wait_for_timeout(1000)

        # Check close button
        close_btn = page.get_by_label("Close menu")
        if close_btn.count() > 0:
            print("SUCCESS: Found mobile menu close button with aria-label='Close menu'")
        else:
            print("FAILURE: Did not find mobile menu close button with aria-label='Close menu'")

        # Take screenshot of mobile menu
        page.screenshot(path="verification/mobile_menu.png")

        # Close menu
        close_btn.click(force=True)

        # 3. Verify Project Modal (on desktop)
        page.set_viewport_size({"width": 1280, "height": 720})
        # Wait for resize
        page.wait_for_timeout(1000)

        # Open a project (assuming there's a way to click one, e.g. first project card)
        # Scroll to work section
        page.goto("http://localhost:3000/#work")
        page.wait_for_timeout(1000)

        # Click a project. The cards probably have an onClick.
        # I'll try to find a project card by text "NOVA"
        project_card = page.get_by_text("NOVA").first
        if project_card.count() > 0:
             # It might be inside a button or clickable div
             # Ensure it's in viewport
             project_card.scroll_into_view_if_needed()
             project_card.click(force=True)
             page.wait_for_timeout(1000)

             # Check modal close button
             modal_close = page.get_by_label("Close modal")
             if modal_close.count() > 0:
                 print("SUCCESS: Found modal close button with aria-label='Close modal'")
             else:
                 print("FAILURE: Did not find modal close button with aria-label='Close modal'")

             page.screenshot(path="verification/project_modal.png")
        else:
            print("WARNING: Could not find project NOVA to test modal")

        browser.close()

if __name__ == "__main__":
    verify_aria_labels()
