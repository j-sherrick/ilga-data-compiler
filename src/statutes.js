import puppeteer, { ElementHandle, Page } from 'puppeteer';


const BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

const TOPICS = [
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
const page = await browser.newPage();
await page.goto(BASE_URL);

const chapterList = await page.$$eval('td ul > *', list => {
    let chapters = {};
    let series = '';
    for (const el of list) {
        const line = el.innerText;
        if (!line) continue;

        let number = '';
        let name = '';
        let url = '';
        if (line.includes('CHAPTER')) {
            // regex pattern to match any string of up to 3 digits
            number = line.match(/\d{1,3}/)[0];
            name = line.split(number)[1].trim();
            url = el.querySelector('a').href;
        }
        else {
            // check if el is a div without using querySelector
            if (el.tagName === 'DIV' && el.className === 'black10bold') {
                for ( let i = 0; i < TOPICS.length; i++) {
                    if (line.includes(TOPICS[i])) {
                        chapters[SERIES_NUMBERS[i]] = {
                            name: TOPICS[i],
                            chapters: {}
                        };
                    }
                }
            }

        }
    }
},
TOPICS,
SERIES_NUMBERS);

console.log(chapterList);

browser.close();