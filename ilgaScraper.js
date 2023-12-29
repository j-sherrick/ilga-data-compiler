import puppeteer from 'puppeteer';

async function getIndex(page) {
    return await page.$eval('td ul', el => el.innerText);
}

function getMajorTopic(index) {
}

function getChapterNumber(index) {
}

function getChapterTopic(index) {
}

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://www.ilga.gov/legislation/ilcs/ilcs.asp');

let index = await getIndex(page);

let topic = getMajorTopic(index);

console.log(topic);

await browser.close();