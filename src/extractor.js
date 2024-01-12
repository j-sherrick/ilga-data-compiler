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
// await basePage.goto(BASE_URL);

// export const ILCSIndex = await basePage.$$eval('td ul > *', (listChildren, SERIES_NAMES, SERIES_NUMBERS) => {

//     let chapterIndexString  = '';

//     const regex = /\d{1,3}/;
//     let chapterNumber = '';
//     let chapterTopic = '';
//     let url = '';
 
//     for(const listChild of listChildren) {
//         if (listChild.innerText.includes('CHAPTER')) {
//             chapterNumber = listChild.innerText.match(regex);
//             url = listChild.querySelector('a').href;
//             if (chapterNumber && url) {
//                 chapterTopic = listChild.innerText.split(chapterNumber)[1].trim();
//                 chapterIndexString += chapterNumber + ' ' + chapterTopic + '\n';
//                 chapterIndexString += url + '\n';
//             }
//         }
//         else if (listChild.innerText) {
//             for (let i = 0; i < SERIES_NAMES.length; i++) {
//                 if (listChild.innerText.includes(SERIES_NAMES[i])) {
//                     chapterIndexString += SERIES_NUMBERS[i] + ' ' + SERIES_NAMES[i] + '\n';
//                 }
//             }
//         }
//     }

//     return chapterIndexString;
// }, SERIES_NAMES, SERIES_NUMBERS);

const ACT_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=5';
const actPage = await browser.newPage();
await actPage.goto(ACT_URL);

export const ILCSActIndex = await actPage.$$eval('td ul > *', (listChildren) => {
    let prefix = '', title = '', url = '', category = '';
    let actIndexString = '';
    for (const listChild of listChildren) {
        if (listChild.tagName === 'P') {
            category = listChild.innerText;
            actIndexString += '\n' + category + '\n';
        }
        else if (listChild.tagName === 'LI' && listChild.innerText.includes('ILCS')) {
            let temp = listChild.innerText.split('/');
            title = temp[1].trim();
            prefix = temp[0].split(' ')[2];
            url = listChild.querySelector('a').href;
            actIndexString += prefix + ' ' + title + '\n';
            actIndexString += url + '\n';
        }
    }
    return actIndexString;
});

console.log(ILCSActIndex);

browser.close();