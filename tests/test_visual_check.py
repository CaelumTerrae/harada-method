#!/usr/bin/env python3
"""
Visual testing script for Harada Method application.
Tests landing page and chart view for visual elements.
"""

from playwright.sync_api import sync_playwright
import sys

def test_landing_page(page):
    """Test landing page visual elements"""
    print("\n=== Testing Landing Page ===")
    issues = []
    
    # Navigate to landing page
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    
    # Take screenshot
    page.screenshot(path='landing_page.png', full_page=True)
    print("✓ Screenshot saved: landing_page.png")
    
    # Check 1: Decorative gradient bar at the top
    gradient_bar = page.locator('div').filter(has_text='').first
    try:
        # Look for a gradient element at the top
        gradient_elements = page.locator('[class*="gradient"], [style*="gradient"]').all()
        if len(gradient_elements) == 0:
            issues.append("❌ No decorative gradient bar found at the top")
        else:
            print("✓ Gradient bar found")
    except Exception as e:
        issues.append(f"❌ Error checking gradient bar: {str(e)}")
    
    # Check 2: "Goal-Setting Framework" label
    try:
        framework_label = page.get_by_text("Goal-Setting Framework", exact=False)
        if framework_label.count() > 0:
            print("✓ 'Goal-Setting Framework' label found")
        else:
            issues.append("❌ 'Goal-Setting Framework' label not found")
    except Exception as e:
        issues.append(f"❌ Error checking framework label: {str(e)}")
    
    # Check 3: "Harada Method" title with "Method" in lighter color
    try:
        harada_title = page.get_by_text("Harada Method", exact=False)
        if harada_title.count() > 0:
            print("✓ 'Harada Method' title found")
            # Check if it's large (we can't easily verify color without inspecting styles)
            title_element = harada_title.first
            font_size = title_element.evaluate('el => window.getComputedStyle(el).fontSize')
            print(f"  Title font size: {font_size}")
        else:
            issues.append("❌ 'Harada Method' title not found")
    except Exception as e:
        issues.append(f"❌ Error checking title: {str(e)}")
    
    # Check 4: "How it works" section with 3 steps
    try:
        how_it_works = page.get_by_text("How it works", exact=False)
        if how_it_works.count() > 0:
            print("✓ 'How it works' section found")
            
            # Check for steps 01, 02, 03
            step_01 = page.get_by_text("01", exact=False)
            step_02 = page.get_by_text("02", exact=False)
            step_03 = page.get_by_text("03", exact=False)
            
            steps_found = []
            if step_01.count() > 0:
                steps_found.append("01")
            if step_02.count() > 0:
                steps_found.append("02")
            if step_03.count() > 0:
                steps_found.append("03")
            
            if len(steps_found) == 3:
                print(f"✓ All 3 steps found: {', '.join(steps_found)}")
            else:
                issues.append(f"❌ Not all steps found. Found: {', '.join(steps_found) if steps_found else 'none'}")
        else:
            issues.append("❌ 'How it works' section not found")
    except Exception as e:
        issues.append(f"❌ Error checking steps: {str(e)}")
    
    # Check 5: "Your Charts" section
    try:
        your_charts = page.get_by_text("Your Charts", exact=False)
        if your_charts.count() > 0:
            print("✓ 'Your Charts' section found")
            
            # Look for chart links/cards
            chart_links = page.locator('a[href*="/chart/"]').all()
            if len(chart_links) > 0:
                print(f"✓ Found {len(chart_links)} saved chart(s)")
                return chart_links
            else:
                print("⚠ No saved charts found (this may be expected)")
                return []
        else:
            issues.append("❌ 'Your Charts' section not found")
            return []
    except Exception as e:
        issues.append(f"❌ Error checking charts section: {str(e)}")
        return []
    
    if issues:
        print("\n=== Landing Page Issues ===")
        for issue in issues:
            print(issue)
    
    return []

def test_chart_view(page, chart_url):
    """Test chart view visual elements"""
    print("\n=== Testing Chart View ===")
    issues = []
    
    # Navigate to chart
    page.goto(chart_url)
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)  # Extra wait for rendering
    
    # Take screenshot
    page.screenshot(path='chart_view.png', full_page=True)
    print("✓ Screenshot saved: chart_view.png")
    
    # Check 1: Grid with rounded border and shadow
    try:
        # Look for grid container
        grid = page.locator('[class*="grid"], table, [role="grid"]').first
        if grid.count() > 0:
            print("✓ Grid found")
            
            # Check border radius and shadow
            border_radius = grid.evaluate('el => window.getComputedStyle(el).borderRadius')
            box_shadow = grid.evaluate('el => window.getComputedStyle(el).boxShadow')
            
            if border_radius and border_radius != '0px':
                print(f"✓ Grid has rounded border: {border_radius}")
            else:
                issues.append("❌ Grid does not have rounded border")
            
            if box_shadow and box_shadow != 'none':
                print(f"✓ Grid has shadow: {box_shadow}")
            else:
                issues.append("❌ Grid does not have shadow")
        else:
            issues.append("❌ Grid not found")
    except Exception as e:
        issues.append(f"❌ Error checking grid: {str(e)}")
    
    # Check 2: Cells have proper coloring
    try:
        cells = page.locator('td, [role="gridcell"]').all()
        if len(cells) > 0:
            print(f"✓ Found {len(cells)} cells")
            
            # Check a few cells for background color
            colored_cells = 0
            for i, cell in enumerate(cells[:10]):  # Check first 10 cells
                bg_color = cell.evaluate('el => window.getComputedStyle(el).backgroundColor')
                if bg_color and bg_color not in ['rgba(0, 0, 0, 0)', 'transparent']:
                    colored_cells += 1
            
            if colored_cells > 0:
                print(f"✓ Cells have coloring ({colored_cells}/{min(10, len(cells))} checked cells have background color)")
            else:
                issues.append("❌ Cells do not appear to have proper coloring")
        else:
            issues.append("❌ No cells found in grid")
    except Exception as e:
        issues.append(f"❌ Error checking cell coloring: {str(e)}")
    
    # Check 3: Block borders (every 3 cells) darker than inner borders
    try:
        # This is complex to verify programmatically, so we'll do a basic check
        cells = page.locator('td, [role="gridcell"]').all()
        if len(cells) >= 9:  # Need at least 9 cells to check block borders
            # Check border styles on a few cells
            cell_borders = []
            for i in [0, 3, 6]:  # Check cells at block boundaries
                if i < len(cells):
                    border = cells[i].evaluate('el => window.getComputedStyle(el).borderWidth')
                    cell_borders.append(border)
            
            print(f"✓ Cell border widths sampled: {', '.join(cell_borders)}")
            print("  (Manual verification needed for block vs inner border darkness)")
        else:
            print("⚠ Not enough cells to verify block borders")
    except Exception as e:
        issues.append(f"❌ Error checking block borders: {str(e)}")
    
    if issues:
        print("\n=== Chart View Issues ===")
        for issue in issues:
            print(issue)
    
    return issues

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            # Test landing page
            chart_links = test_landing_page(page)
            
            # Test chart view if charts exist
            if chart_links:
                # Get the first chart URL
                chart_url = chart_links[0].get_attribute('href')
                if not chart_url.startswith('http'):
                    chart_url = f"http://localhost:3000{chart_url}"
                
                print(f"\nNavigating to chart: {chart_url}")
                test_chart_view(page, chart_url)
            else:
                print("\n⚠ No charts available to test chart view")
                print("Please create a chart first to test the chart view.")
        
        finally:
            browser.close()
        
        print("\n=== Testing Complete ===")
        print("Screenshots saved:")
        print("  - landing_page.png")
        if chart_links:
            print("  - chart_view.png")

if __name__ == '__main__':
    main()
