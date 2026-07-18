import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto("http://localhost:8911/index.html", wait_until="networkidle")
        await page.wait_for_timeout(500)

        await page.fill("#p_name", "Test Patient")
        await page.fill("#p_age", "15")
        await page.check("#sh_current_si")
        await page.check("input.sh-form-check[value='Cutting/burning']")
        await page.fill("#sh_assessment_coverage", "Remorseful, parents aware, no risk from others.")
        await page.check("#sh_prt_criteria_met")
        await page.select_option("#sh_camhs_crisis", label="Yes \u2014 Crisis Team")
        await page.fill("#sh_consent_obtained_by", "Dr Turner")
        await page.check("#dc_medically_fit")
        await page.check("#dc_psychologically_stable")
        await page.wait_for_timeout(300)

        # scroll down a bit so EPR panel sticky area is fully visible
        await page.evaluate("window.scrollTo(0, 800)")
        await page.wait_for_timeout(300)
        await page.screenshot(path="screenshot_epr_panel.png")

        await browser.close()

asyncio.run(main())
