import asyncio
from playwright.async_api import async_playwright

async def main():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on("console", lambda msg: errors.append(f"CONSOLE {msg.type}: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(f"PAGEERROR: {exc}"))

        await page.goto("http://localhost:8911/index.html", wait_until="networkidle")
        await page.wait_for_timeout(500)

        # Check EPR output populated on load
        epr_text = await page.eval_on_selector("#epr-output", "el => el.innerText")
        assert "PAEDIATRIC MENTAL HEALTH ASSESSMENT" in epr_text, "EPR note did not populate on load"
        print("PASS: EPR note populated on DOMContentLoaded")

        await page.screenshot(path="screenshot_full.png", full_page=True)

        # Fill some fields
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

        epr_text2 = await page.eval_on_selector("#epr-output", "el => el.innerText")
        assert "Test Patient" in epr_text2, "Name not reflected in note"
        assert "Cutting/burning" in epr_text2, "Self-harm form not reflected in note"
        assert "PRT Criteria Met: Yes" in epr_text2, "PRT criteria not reflected"
        assert "Discharge Readiness" in epr_text2, "Discharge readiness not reflected"
        print("PASS: Form fields reflected live in EPR note")

        await page.screenshot(path="screenshot_filled.png", full_page=True)

        # Test copy button doesn't throw
        await page.click("#copy-rich-text-btn")
        await page.wait_for_timeout(300)
        btn_text = await page.eval_on_selector("#copy-rich-text-btn", "el => el.textContent")
        print(f"Copy button text after click: {btn_text}")

        # Reload and check localStorage persistence
        await page.reload(wait_until="networkidle")
        await page.wait_for_timeout(500)
        name_val = await page.eval_on_selector("#p_name", "el => el.value")
        assert name_val == "Test Patient", f"localStorage did not persist name, got: {name_val}"
        print("PASS: localStorage persisted across reload")

        await page.screenshot(path="screenshot_reloaded.png", full_page=True)

        await browser.close()

    if errors:
        print("=== ERRORS/CONSOLE ISSUES ===")
        for e in errors:
            print(e)
    else:
        print("PASS: No console/page errors detected")

asyncio.run(main())
