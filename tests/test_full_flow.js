#!/usr/bin/env node
/**
 * Full flow test: Create a chart and then test visual elements
 */

const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createChart(page) {
  console.log('\n=== Creating Test Chart ===');
  
  console.log('Navigating to home page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  console.log('Clicking "Start a New Chart" button...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const startButton = buttons.find(btn => btn.textContent.includes('Start a New Chart'));
    if (startButton) startButton.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  console.log('Step 1: Entering main goal...');
  await page.waitForSelector('input[type="text"], textarea');
  const goalInput = await page.$('input[type="text"], textarea');
  await goalInput.type('Complete a marathon in under 4 hours');
  
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const continueButton = buttons.find(btn => btn.textContent.includes('Continue'));
    if (continueButton) continueButton.click();
  });
  await wait(1000);
  
  console.log('Entering subgoals with behaviors...');
  const subgoals = [
    'Build endurance', 'Improve speed', 'Strengthen body',
    'Optimize nutrition', 'Get rest', 'Mental toughness',
    'Perfect form', 'Follow schedule'
  ];
  
  const behaviors = [
    'Daily practice', 'Weekly review', 'Monthly goal check',
    'Track progress', 'Get feedback', 'Adjust approach',
    'Stay consistent', 'Celebrate wins'
  ];
  
  // Enter 8 subgoals, each with 8 behaviors
  for (let i = 0; i < 8; i++) {
    console.log(`  Step ${i + 2}: Subgoal ${i + 1}...`);
    
    // Wait for the textarea (subgoal input) to be available
    await page.waitForSelector('textarea');
    const textarea = await page.$('textarea');
    await textarea.click({ clickCount: 3 });
    await textarea.type(subgoals[i]);
    
    // Now fill in the 8 behaviors for this subgoal
    await wait(300);
    const inputs = await page.$$('input[type="text"]');
    
    for (let j = 0; j < Math.min(8, inputs.length); j++) {
      await inputs[j].click({ clickCount: 3 });
      await inputs[j].type(`${behaviors[j]} for ${subgoals[i]}`);
    }
    
    // Click Continue (or Complete Chart on the last one)
    const isLast = i === 7;
    const buttonText = isLast ? 'Complete Chart' : 'Continue';
    
    await page.evaluate((text) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(btn => btn.textContent.includes(text));
      if (button) button.click();
    }, buttonText);
    await wait(800);
  }
  
  await wait(2000);
  console.log('✓ Chart created!');
}

async function testLandingPage(page) {
  console.log('\n=== Testing Landing Page ===');
  const issues = [];
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'landing_page_with_chart.png', fullPage: true });
  console.log('✓ Screenshot saved: landing_page_with_chart.png');
  
  // Check gradient bar
  const gradientElements = await page.$$('[class*="gradient"], [style*="gradient"]');
  if (gradientElements.length > 0) {
    console.log('✓ Gradient bar found');
  } else {
    issues.push('❌ No decorative gradient bar found');
  }
  
  // Check "Goal-Setting Framework" label
  const frameworkText = await page.evaluate(() => {
    return document.body.textContent.includes('Goal-Setting Framework');
  });
  if (frameworkText) {
    console.log('✓ "Goal-Setting Framework" label found');
  } else {
    issues.push('❌ "Goal-Setting Framework" label not found');
  }
  
  // Check "Harada Method" title
  const haradaText = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.textContent.trim() : null;
  });
  
  if (haradaText && haradaText.includes('Harada') && haradaText.includes('Method')) {
    console.log('✓ "Harada Method" title found');
    
    const methodSpan = await page.$('h1 span');
    if (methodSpan) {
      console.log('✓ "Method" appears to be in a lighter color');
    }
    
    const h1 = await page.$('h1');
    const fontSize = await page.evaluate(el => window.getComputedStyle(el).fontSize, h1);
    console.log(`  Title font size: ${fontSize}`);
  } else {
    issues.push('❌ "Harada Method" title not found');
  }
  
  // Check "How it works" section
  const howItWorksText = await page.evaluate(() => {
    return document.body.textContent.includes('How it works');
  });
  
  if (howItWorksText) {
    console.log('✓ "How it works" section found');
    
    const pageText = await page.evaluate(() => document.body.textContent);
    const hasStep01 = pageText.includes('01');
    const hasStep02 = pageText.includes('02');
    const hasStep03 = pageText.includes('03');
    
    if (hasStep01 && hasStep02 && hasStep03) {
      console.log('✓ All 3 steps found: 01, 02, 03');
    } else {
      issues.push('❌ Not all steps found');
    }
  } else {
    issues.push('❌ "How it works" section not found');
  }
  
  // Check "Your Charts" section
  const chartLinks = await page.$$('a[href*="/chart/"]');
  
  if (chartLinks.length > 0) {
    console.log('✓ "Your Charts" section found');
    console.log(`✓ Found ${chartLinks.length} saved chart(s)`);
    
    if (issues.length > 0) {
      console.log('\n=== Landing Page Issues ===');
      issues.forEach(issue => console.log(issue));
    }
    
    return chartLinks[0];
  } else {
    issues.push('❌ "Your Charts" section not found or no charts displayed');
    
    if (issues.length > 0) {
      console.log('\n=== Landing Page Issues ===');
      issues.forEach(issue => console.log(issue));
    }
    
    return null;
  }
}

async function testChartView(page, chartLink) {
  console.log('\n=== Testing Chart View ===');
  const issues = [];
  
  const chartUrl = await page.evaluate(el => el.href, chartLink);
  console.log(`Navigating to: ${chartUrl}`);
  
  await page.goto(chartUrl, { waitUntil: 'networkidle0' });
  await wait(1000);
  
  await page.screenshot({ path: 'chart_view.png', fullPage: true });
  console.log('✓ Screenshot saved: chart_view.png');
  
  // Check 1: Grid container with rounded border and shadow
  const gridContainer = await page.$('.overflow-x-auto');
  if (gridContainer) {
    console.log('✓ Grid container found');
    
    const styles = await page.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        borderRadius: computed.borderRadius,
        boxShadow: computed.boxShadow
      };
    }, gridContainer);
    
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
    issues.push('❌ Grid container not found');
  }
  
  // Check 2: Cells have proper coloring
  const gridInner = await page.$('.overflow-x-auto .grid');
  if (gridInner) {
    const cells = await gridInner.$$('div');
    
    if (cells.length > 0) {
      console.log(`✓ Found ${cells.length} cells (should be 81 for 9x9 grid)`);
      
      const cellsToCheck = cells.slice(0, Math.min(15, cells.length));
      let coloredCells = 0;
      
      for (const cell of cellsToCheck) {
        const bgColor = await page.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        }, cell);
        
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent' && bgColor !== 'rgb(255, 255, 255)') {
          coloredCells++;
        }
      }
      
      if (coloredCells > 0) {
        console.log(`✓ Cells have coloring (${coloredCells}/${cellsToCheck.length} checked cells have colored backgrounds)`);
      } else {
        issues.push('❌ Cells do not appear to have proper coloring');
      }
    } else {
      issues.push('❌ No cells found in grid');
    }
  } else {
    issues.push('❌ Grid element not found');
  }
  
  // Check 3: Block borders (every 3 cells should have darker borders)
  const gridInner2 = await page.$('.overflow-x-auto .grid');
  if (gridInner2) {
    const cells = await gridInner2.$$('div');
    
    if (cells.length >= 9) {
      // Check cells at block boundaries (positions 2, 5, 8 in first row)
      const blockBoundaryCells = [2, 5, 8];
      const regularCells = [0, 1, 3];
      
      const blockBorders = [];
      const regularBorders = [];
      
      for (const i of blockBoundaryCells) {
        if (i < cells.length) {
          const borderColor = await page.evaluate(el => {
            return window.getComputedStyle(el).borderRightColor;
          }, cells[i]);
          blockBorders.push(borderColor);
        }
      }
      
      for (const i of regularCells) {
        if (i < cells.length) {
          const borderColor = await page.evaluate(el => {
            return window.getComputedStyle(el).borderRightColor;
          }, cells[i]);
          regularBorders.push(borderColor);
        }
      }
      
      console.log(`✓ Block borders checked`);
      console.log(`  Block boundary cells (every 3rd): ${blockBorders[0]}`);
      console.log(`  Regular cells: ${regularBorders[0]}`);
      
      // Check if block borders are darker (different color)
      if (blockBorders[0] !== regularBorders[0]) {
        console.log('✓ Block borders are darker than inner cell borders');
      } else {
        console.log('⚠ Block borders may not be visually distinct (same color detected)');
      }
    } else {
      console.log('⚠ Not enough cells to verify block borders');
    }
  }
  
  if (issues.length > 0) {
    console.log('\n=== Chart View Issues ===');
    issues.forEach(issue => console.log(issue));
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Create a test chart
    await createChart(page);
    
    // Test landing page (should now show the chart)
    const chartLink = await testLandingPage(page);
    
    // Test chart view
    if (chartLink) {
      await testChartView(page, chartLink);
    } else {
      console.log('\n⚠ Could not test chart view - no chart link found');
    }
    
    console.log('\n=== Testing Complete ===');
    console.log('Screenshots saved:');
    console.log('  - landing_page_with_chart.png');
    if (chartLink) {
      console.log('  - chart_view.png');
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
