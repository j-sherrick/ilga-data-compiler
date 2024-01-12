import puppeteer, { ElementHandle, Page } from 'puppeteer';


const BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

const SERIES_NAMES = [
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

const SERIES_NUMBERS = [
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

const browser = await puppeteer.launch();
const basePage = await browser.newPage();
await basePage.goto(BASE_URL);

export const ILCSIndex = await basePage.$$eval('td ul > *', (listChildren, SERIES_NAMES, SERIES_NUMBERS) => {

    let returnString  = '';

    const regex = /\d{1,3}/;
    let chapterNumber = '';
    let chapterTopic = '';
    let url = '';
 
    for(let child of listChildren) {
        if (child.innerText.includes('CHAPTER')) {
            chapterNumber = child.innerText.match(regex);
            url = child.querySelector('a').href;
            if (chapterNumber && url) {
                chapterTopic = child.innerText.split(chapterNumber)[1].trim();
                returnString += chapterNumber + ' ' + chapterTopic + '\n';
                returnString += 'href: ' + url + '\n';
            }
        }
        else if (child.innerText) {
            for (let i = 0; i < SERIES_NAMES.length; i++) {
                if (child.innerText.includes(SERIES_NAMES[i])) {
                    returnString += SERIES_NUMBERS[i] + ' ' + SERIES_NAMES[i] + '\n';
                }
            }
        }
    }

    return returnString;
}, SERIES_NAMES, SERIES_NUMBERS);

const ACT_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=5';
const actPage = await browser.newPage();
await actPage.goto(ACT_URL);

export const ILCSActIndex =
console.log(ILCSIndex);

browser.close();