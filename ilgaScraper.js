import puppeteer from 'puppeteer';

async function getIndex(page) {
    let index = await page.$eval('td ul', el => el.innerText);
    return index.split('\n').filter((el) => el !== '');
}

function getMajorTopics(index) {
    return index.filter((el) => !el.includes('CHAPTER'));
}

function getChapterNumbers(index) {
    return index
            .filter((el) => el.includes('CHAPTER'))
            .map((el) => el.match(/\d+/)[0]);
}

// this function gets topic of each individual chapter
// For example in the string: 'CHAPTER 305  PUBLIC AID'
// the topic is 'PUBLIC AID'
function getChapterTopics(index) {
    let chapters = index.filter((el) => el.includes('CHAPTER'));

    // this feels like a shitshow and I should definitely come tidy this up later
    chapters = chapters.map((el) => el.replace('CHAPTER', '').trim().substring(4).trim() );

    // here's some other ways I tried that didn't work
    // chapters = chapters.map((el) => el.slice(2));
    // chapters = chapters.map((el) => el.join(' '));

    return chapters;
}

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://www.ilga.gov/legislation/ilcs/ilcs.asp');

let index = await getIndex(page);

let topics = getMajorTopics(index);
let chapters = getChapterTopics(index);
let chapterNumbers = getChapterNumbers(index);


// console.log(topics, chapters, chapterNumbers);

await browser.close();