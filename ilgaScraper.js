import puppeteer from 'puppeteer';


async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.ilga.gov/legislation/ilcs/ilcs.asp');
    // await page.screenshot({path: 'example.png', fullPage: true});

    // const html = await page.content();

    const index = await page.evaluate(() => Array.from(document.querySelectorAll('td ul li')).map(li => {
        return {
            title: li.textContent,
            url: li.querySelector('a').href
        }
    }));

    console.log(chapters);

    await browser.close();
}

run();