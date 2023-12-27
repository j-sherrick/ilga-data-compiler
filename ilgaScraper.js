import puppeteer from 'puppeteer';


async function getIndex() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.ilga.gov/legislation/ilcs/ilcs.asp');

    const index = await page.evaluate(() => {
        const index = document.querySelector('td ul');      
    } );

    console.log(index);

    await browser.close();
}

run();