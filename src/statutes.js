import puppeteer, { Page } from 'puppeteer';


const BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

const MAJOR_TOPIC_NAMES = [
    'GOVERNMENT',
    'EDUCATION',
    'REGULATION',
    'HUMAN NEEDS',
    'HEALTH AND SAFETY',
    'AGRICULTURE AND CONSERVATION',
    'TRANSPORTATION',
    'RIGHTS AND REMEDIES',
    'BUSINESS AND EMPLOYMENT'
];

const MAJOR_TOPIC_NUMBERS = [
    '00',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800'
];

const SERIES = 0;
const NUMBER = 0;
const NAME = 1;
const URL = 2;

/**
* @param { Element } el child element of the <ul> of chapters located at BASE_URL
* 
* @returns { Boolean } true if the element contains any of the major topics, false otherwise
*/
function hasTopic(el) {
    for (const topic in ILGADataExtractor.MAJOR_TOPIC_NAMES) {
        if (el.innerText.includes(topic)) {
            return true; 
        }
    }
    return false;
}
/**
 * 
 * @param { Element } el child element of the <ul> of chapters located at BASE_URL
 *  
 * @returns { Array } with the format [ '00', 'GOVERNMENT' ] 
 */
function getTopic(el) {
    for (let i = 0; i < ILGADataExtractor.MAJOR_TOPIC_NAMES.length; i++) {
        if (el.innerText.includes(ILGADataExtractor.MAJOR_TOPIC_NAMES[i])) {
            return [ILGADataExtractor.MAJOR_TOPIC_NUMBERS[i], ILGADataExtractor.MAJOR_TOPIC_NAMES[i]];
        }
    }
    return null;
}
/**
 * @param { Element } el child of the <ul> of chapters located at BASE_URL
 * 
 * @returns { Boolean } true if the word 'CHAPTER' is in the innerText of `el`, false otherwise
*/
function hasChapter(el) {
    return el.innerText.includes('CHAPTER');
}
/**
 * 
 * @param { Element } el child of the <ul> of chapters located at BASE_URL
 * 
 * @returns { Array } with the format:
 * 
 *             [
 *                '105',
 *                'SCHOOLS',
 *                'https://www.ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=17'
 *              ] 
 */
function getChapter(el) {
    const chapterNumberRegEx = /d{1,3}/; // we should be safe assuming any sequence of 1-3 digits is a chapter number
    const chapterNumber = el.innerText.match(chapterNumberRegEx)[0];
    if (!chapterNumber) {
        return null;
    }
    const chapterName = el.innerText.split(chapterNumber)[1].trim();
    const chapterURL = el.querySelector('a').href;
    return [chapterNumber, chapterName, chapterURL];
}

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(BASE_URL);

const chapterList = await page.$$('td ul > *');
for (const chapter of chapterList) {
    const chapterArray = chapter.evaluate(getChapter);
    if(chapterArray) {
        console.log(chapterArray);
    }
}

browser.close();