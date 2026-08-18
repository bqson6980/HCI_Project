import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

def render(html_path, output_png):
    # Đảm bảo thư mục output tồn tại
    Path(output_png).parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 800})
        page.goto(f"file://{Path(html_path).resolve()}")
        # Chụp toàn bộ thẻ persona card
        element = page.query_selector(".card")
        if element:
            element.screenshot(path=output_png)
        else:
            page.screenshot(path=output_png, full_page=True)
        browser.close()
    print(f"Rendered successfully: {output_png}")

if __name__ == "__main__":
    html_input = sys.argv[1] if len(sys.argv) > 1 else "templates/persona/index.html"
    png_output = sys.argv[2] if len(sys.argv) > 2 else "output/persona.png"
    render(html_input, png_output)