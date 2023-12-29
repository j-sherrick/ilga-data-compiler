import puppeteer, { Page } from 'puppeteer';


/**
 * 
 * @param { Page } page is from `ilga.gov/legislation/ilcs/ilcs.asp` or any subpages
 *  
 * @returns { Array } of strings representing an index of chapters or acts on the page
 */
async function getPageIndex(page) {
    let index = await page.$eval('td ul', el => el.innerText);
    return index.split('\n').filter((el) => el !== '');
}


/**
 * 
 * @param { Array } index in general is the index returned from getPageIndex(),
 * but can be any array of strings formatted the same way as on the ilga website
 * 
 * @returns { Array } filtered to just the major topics of legislation 
 */
function getMajorTopics(index) {
    return index.filter((el) => !el.includes('CHAPTER'));
}


/**
 * 
 * @param { Array } index in general is the index returned from getPageIndex(),
 * @returns { Array } filtered to just chapter numbers
 */
function getChapterNumbers(index) {
    return index
            .filter((el) => el.includes('CHAPTER'))
            .map((el) => el.match(/\d+/)[0]);
}


/**
 * 
 * @param { Array } index in general is the index returned from getPageIndex(),
 * @returns { Array } filtered to just the chapter topics
 */
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

let index = await getPageIndex(page);

let topics = getMajorTopics(index);
let chapters = getChapterTopics(index);
let chapterNumbers = getChapterNumbers(index);


console.log(topics, chapters, chapterNumbers);

await browser.close();