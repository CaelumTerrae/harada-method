#!/usr/bin/env node
/**
 * Script to create a test chart through the wizard
 */

const puppeteer = require('puppeteer');

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createTestChart() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
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
    
    // Click Continue
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const continueButton = buttons.find(btn => btn.textContent.includes('Continue'));
      if (continueButton) continueButton.click();
    });
    await wait(1000);
    
    console.log('Step 2-9: Entering subgoals...');
    const subgoals = [
      'Build endurance through long runs',
      'Improve running speed and pace',
      'Strengthen core and legs',
      'Optimize nutrition and hydration',
      'Get proper rest and recovery',
      'Develop mental toughness',
      'Perfect running form and technique',
      'Create and follow training schedule'
    ];
    
    for (let i = 0; i < subgoals.length; i++) {
      console.log(`  Entering subgoal ${i + 1}...`);
      await page.waitForSelector('input[type="text"], textarea');
      const input = await page.$('input[type="text"], textarea');
      await input.click({ clickCount: 3 }); // Select all
      await input.type(subgoals[i]);
      
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const continueButton = buttons.find(btn => btn.textContent.includes('Continue'));
        if (continueButton) continueButton.click();
      });
      await wait(500);
    }
    
    console.log('Step 10+: Entering practices for each subgoal...');
    const practices = [
      'Run 5 miles every Sunday',
      'Run 8 miles every other week',
      'Complete a half marathon monthly',
      'Track weekly mileage progress',
      'Join a running group',
      'Use proper running shoes',
      'Warm up before each run',
      'Cool down and stretch after'
    ];
    
    // For each of the 8 subgoals, enter 8 practices
    for (let subgoal = 0; subgoal < 8; subgoal++) {
      console.log(`  Entering practices for subgoal ${subgoal + 1}...`);
      
      for (let practice = 0; practice < 8; practice++) {
        await page.waitForSelector('input[type="text"], textarea');
        const input = await page.$('input[type="text"], textarea');
        await input.click({ clickCount: 3 }); // Select all
        await input.type(`${practices[practice % practices.length]} (${subgoal + 1}.${practice + 1})`);
        
        // Click Continue (or Finish on the last one)
        const isLast = subgoal === 7 && practice === 7;
        const buttonText = isLast ? 'Finish' : 'Continue';
        
        await page.evaluate((text) => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const button = buttons.find(btn => btn.textContent.includes(text));
          if (button) {
            button.click();
          } else {
            // Try submit button as fallback
            const submitBtn = document.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.click();
          }
        }, buttonText);
        await wait(500);
      }
    }
    
    console.log('Waiting for chart to be created...');
    await wait(2000);
    
    // Should now be on the chart view
    const url = page.url();
    console.log(`Chart created! URL: ${url}`);
    
    return url;
  } catch (error) {
    console.error('Error creating chart:', error);
    await page.screenshot({ path: 'error_screenshot.png', fullPage: true });
    console.log('Error screenshot saved to error_screenshot.png');
    throw error;
  } finally {
    await browser.close();
  }
}

createTestChart()
  .then(url => {
    console.log('\n✓ Test chart created successfully!');
    console.log(`Chart URL: ${url}`);
  })
  .catch(err => {
    console.error('\n✗ Failed to create test chart');
    process.exit(1);
  });
