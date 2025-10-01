from playwright.sync_api import Page, expect

def test_dark_mode_and_visualizations(page: Page):
    """
    This test verifies that:
    1. The dark mode toggle works and changes the background color.
    2. The visualizations are rendered correctly after an analysis.
    """
    # 1. Navigate to the app
    page.goto("http://localhost:5173")

    # 2. Toggle dark mode and take a screenshot
    toggle_button = page.get_by_role("button", name="テーマを切り替え")
    toggle_button.click()
    page.wait_for_timeout(500)  # Wait for theme to apply
    page.screenshot(path="jules-scratch/verification/dark_mode_verification.png")

    # 3. Fill in the form and run an analysis
    page.get_by_placeholder("例：ある工場では、製品Aと製品Bを生産している...").fill("都市における災害時避難所配置計画を立案してください。")
    page.get_by_role("button", name="自動分析開始").click()

    # 4. Wait for the analysis to complete and navigate to the visualization tab
    expect(page.get_by_text("分析実行中...")).to_be_hidden(timeout=60000)
    page.get_by_role("tab", name="可視化").click()

    # 5. Verify that the visualizations are visible
    expect(page.get_by_text("プロセルフロー図")).to_be_visible()
    expect(page.get_by_text("パレートフロントの概念図: 3目的間のトレードオフ")).to_be_visible()
    expect(page.get_by_text("避難所配置計画の性能比較表（概念例）")).to_be_visible()

    # 6. Take a screenshot of the visualizations
    page.screenshot(path="jules-scratch/verification/visualization_verification.png")