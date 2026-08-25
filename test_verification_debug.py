import asyncio
from playwright.async_api import async_playwright

async def function_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

        await page.goto("http://localhost:5174/admin/login")
        await page.fill('input[name="email"]', "admin@example.com")
        await page.fill('input[name="password"]', "AdminPass123!")
        await page.click('button[type="submit"]')

        await asyncio.sleep(3)
        await page.screenshot(path="admin_login_debug.png")
        print("Current URL:", page.url)

        await browser.close()

asyncio.run(function_test())
