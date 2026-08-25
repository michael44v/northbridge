import asyncio
from playwright.async_api import async_playwright

async def function_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 1. Test Vintage Landing Page at /
        print("Testing Landing Page at /...")
        await page.goto("http://localhost:5174/")
        await page.wait_for_selector("#signin")
        landing_title = await page.inner_text("h1")
        print("Landing Title:", landing_title)
        assert "savings account" in landing_title.lower()

        # Take screenshot of landing page
        await page.screenshot(path="verification_landing.png")

        # 2. Test Admin Login and User Creation
        print("Testing Admin User Creation...")
        await page.goto("http://localhost:5174/admin/login")
        await page.fill('input[name="email"]', "admin@example.com")
        await page.fill('input[name="password"]', "AdminPass123!")
        await page.click('button[type="submit"]')
        await page.wait_for_url("**/admin")

        await page.goto("http://localhost:5174/admin/users")
        await page.wait_for_selector("text=Create Account / User")
        await page.click("text=Create Account / User")

        await page.wait_for_selector("text=Create New User Account")
        await page.fill('input[placeholder="e.g. Alex Logan"]', "Test New User")
        await page.fill('input[placeholder="e.g. alex@example.com"]', "testnewuser@example.com")
        await page.fill('input[placeholder="e.g. +44 7123 456789"]', "+447000000099")
        await page.fill('input[placeholder="Password"]', "UserPass123!")
        await page.fill('input[placeholder="Auto-generated 10-digit number"]', "9876543210")

        await page.click('button[type="submit"]:has-text("Create Account")')
        await page.wait_for_selector("text=Test New User")
        print("User created successfully!")

        await page.screenshot(path="verification_admin_created.png")

        await browser.close()

asyncio.run(function_test())
