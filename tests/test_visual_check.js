#!/usr/bin/env node
/**
 * Visual testing script for Harada Method application.
 * Tests landing page and chart view for visual elements.
 */

const puppeteer = require('puppeteer');

async function testLandingPage(page) {
  console.log('\n=== Testing Landing Page ===');
  const issues = [];
  
  // Navigate to landing page
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Take screenshot
  await page.screenshot({ path: 'landing_page.png', fullPage: true });
  console.log('✓ Screenshot saved: landing_page.png');
  
  // Check 1: Decorative gradient bar at the top
  try {
    const gradientElements = await page.$$('[class*="gradient"], [style*="gradient"]');
    if (gradientElements.length === 0) {
      issues.push('❌ No decorative gradient bar found at the top');
    } else {
      console.log('✓ Gradient bar found');
    }
  } catch (e) {
    issues.push(`❌ Error checking gradient bar: ${e.message}`);
  }
  
  // Check 2: "Goal-Setting Framework" label
  try {
    const frameworkLabel = await page.$('text/Goal-Setting Framework');
    if (frameworkLabel) {
      console.log('✓ "Goal-Setting Framework" label found');
    } else {
      issues.push('❌ "Goal-Setting Framework" label not found');
    }
  } catch (e) {
    issues.push(`❌ Error checking framework label: ${e.message}`);
  }
  
  // Check 3: "Harada Method" title (may be split across lines)
  try {
    const haradaText = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.textContent.trim() : null;
    });
    
    if (haradaText && haradaText.includes('Harada') && haradaText.includes('Method')) {
      console.log('✓ "Harada Method" title found');
      
      // Check if "Method" is in a lighter color (span with opacity/muted class)
      const methodSpan = await page.$('h1 span');
      if (methodSpan) {
        const opacity = await page.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.opacity || style.color;
        }, methodSpan);
        console.log(`  "Method" styling: ${opacity}`);
        console.log('✓ "Method" appears to be in a lighter color');
      }
      
      // Check font size
      const h1 = await page.$('h1');
      const fontSize = await page.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      }, h1);
      console.log(`  Title font size: ${fontSize}`);
    } else {
      issues.push('❌ "Harada Method" title not found');
    }
  } catch (e) {
    issues.push(`❌ Error checking title: ${e.message}`);
  }
  
  // Check 4: "How it works" section with 3 steps
  try {
    const howItWorks = await page.$('text/How it works');
    if (howItWorks) {
      console.log('✓ "How it works" section found');
      
      // Check for steps
      const step01 = await page.$('text/01');
      const step02 = await page.$('text/02');
      const step03 = await page.$('text/03');
      
      const stepsFound = [];
      if (step01) stepsFound.push('01');
      if (step02) stepsFound.push('02');
      if (step03) stepsFound.push('03');
      
      if (stepsFound.length === 3) {
        console.log(`✓ All 3 steps found: ${stepsFound.join(', ')}`);
      } else {
        issues.push(`❌ Not all steps found. Found: ${stepsFound.join(', ') || 'none'}`);
      }
    } else {
      issues.push('❌ "How it works" section not found');
    }
  } catch (e) {
    issues.push(`❌ Error checking steps: ${e.message}`);
  }
  
  // Check 5: "Your Charts" section (only appears if charts exist)
  try {
    // Look for chart links first
    const chartLinks = await page.$$('a[href*="/chart/"]');
    
    if (chartLinks.length > 0) {
      console.log('✓ "Your Charts" section found');
      console.log(`✓ Found ${chartLinks.length} saved chart(s)`);
      
      if (issues.length > 0) {
        console.log('\n=== Landing Page Issues ===');
        issues.forEach(issue => console.log(issue));
      }
      
      return chartLinks;
    } else {
      console.log('⚠ "Your Charts" section not visible (no charts saved yet)');
      console.log('  Note: This section only appears when charts exist');
      
      if (issues.length > 0) {
        console.log('\n=== Landing Page Issues ===');
        issues.forEach(issue => console.log(issue));
      }
      
      return [];
    }
  } catch (e) {
    issues.push(`❌ Error checking charts section: ${e.message}`);
    
    if (issues.length > 0) {
      console.log('\n=== Landing Page Issues ===');
      issues.forEach(issue => console.log(issue));
    }
    
    return [];
  }
}

async function testChartView(page, chartUrl) {
  console.log('\n=== Testing Chart View ===');
  const issues = [];
  
  // Navigate to chart
  await page.goto(chartUrl, { waitUntil: 'networkidle0' });
  await page.waitForTimeout(1000); // Extra wait for rendering
  
  // Take screenshot
  await page.screenshot({ path: 'chart_view.png', fullPage: true });
  console.log('✓ Screenshot saved: chart_view.png');
  
  // Check 1: Grid with rounded border and shadow
  try {
    const grid = await page.$('[class*="grid"], table, [role="grid"]');
    if (grid) {
      console.log('✓ Grid found');
      
      const styles = await page.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          borderRadius: computed.borderRadius,
          boxShadow: computed.boxShadow
        };
      }, grid);
      
      if (styles.borderRadius && styles.borderRadius !== '0px') {
        console.log(`✓ Grid has rounded border: ${styles.borderRadius}`);
      } else {
        issues.push('❌ Grid does not have rounded border');
      }
      
      if (styles.boxShadow && styles.boxShadow !== 'none') {
        console.log(`✓ Grid has shadow: ${styles.boxShadow}`);
      } else {
        issues.push('❌ Grid does not have shadow');
      }
    } else {
      issues.push('❌ Grid not found');
    }
  } catch (e) {
    issues.push(`❌ Error checking grid: ${e.message}`);
  }
  
  // Check 2: Cells have proper coloring
  try {
    const cells = await page.$$('td, [role="gridcell"]');
    if (cells.length > 0) {
      console.log(`✓ Found ${cells.length} cells`);
      
      // Check first 10 cells for background color
      const cellsToCheck = cells.slice(0, Math.min(10, cells.length));
      let coloredCells = 0;
      
      for (const cell of cellsToCheck) {
        const bgColor = await page.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        }, cell);
        
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          coloredCells++;
        }
      }
      
      if (coloredCells > 0) {
        console.log(`✓ Cells have coloring (${coloredCells}/${cellsToCheck.length} checked cells have background color)`);
      } else {
        issues.push('❌ Cells do not appear to have proper coloring');
      }
    } else {
      issues.push('❌ No cells found in grid');
    }
  } catch (e) {
    issues.push(`❌ Error checking cell coloring: ${e.message}`);
  }
  
  // Check 3: Block borders
  try {
    const cells = await page.$$('td, [role="gridcell"]');
    if (cells.length >= 9) {
      // Check border styles on cells at block boundaries
      const cellBorders = [];
      for (const i of [0, 3, 6]) {
        if (i < cells.length) {
          const border = await page.evaluate(el => {
            return window.getComputedStyle(el).borderWidth;
          }, cells[i]);
          cellBorders.push(border);
        }
      }
      
      console.log(`✓ Cell border widths sampled: ${cellBorders.join(', ')}`);
      console.log('  (Manual verification needed for block vs inner border darkness)');
    } else {
      console.log('⚠ Not enough cells to verify block borders');
    }
  } catch (e) {
    issues.push(`❌ Error checking block borders: ${e.message}`);
  }
  
  if (issues.length > 0) {
    console.log('\n=== Chart View Issues ===');
    issues.forEach(issue => console.log(issue));
  }
  
  return issues;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  let chartLinks = [];
  
  try {
    // Test landing page
    chartLinks = await testLandingPage(page);
    
    // Test chart view if charts exist
    if (chartLinks && chartLinks.length > 0) {
      const chartUrl = await page.evaluate(el => el.href, chartLinks[0]);
      console.log(`\nNavigating to chart: ${chartUrl}`);
      await testChartView(page, chartUrl);
    } else {
      console.log('\n⚠ No charts available to test chart view');
      console.log('Please create a chart first to test the chart view.');
    }
  } finally {
    await browser.close();
  }
  
  console.log('\n=== Testing Complete ===');
  console.log('Screenshots saved:');
  console.log('  - landing_page.png');
  if (chartLinks && chartLinks.length > 0) {
    console.log('  - chart_view.png');
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
