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
const page = await browser.newPage();
await page.goto(BASE_URL);

export const ILCSChapterIndex = await page.$$eval('td ul > *', (uList, SERIES_NAMES, SERIES_NUMBERS) => {

    // it proves to be exceptionally difficult to return complex objects from eval()
    // maybe we should create some temp variables to aid in constructing one big ass string ourselves
    let returnString  = '';

    const regex = /\d{1,3}/;
    let chapterNumber = '';
    let chapterTopic = '';
    let seriesTopic = '';
    let url = '';
 
    for(item of uList) {
        if (item.innerText.includes('CHAPTER')) {
            chapterNumber = item.innerText.match(regex);
            if (chapterNumber) {
                chapterTopic = item.innerText.split(chapterNumber)[1].trim();
                url = item.querySelector('a').href;
                returnString += chapterNumber + ' ' + chapterTopic + '\n';
                returnString += 'href: ' + url + '\n';
            }
        }
    }

    return returnString;
}, SERIES_NAMES, SERIES_NUMBERS);
        
console.log(ILCSChapterIndex);

browser.close();


// console.log(quickTest);

// try {
//     const chapterList = await page.$$('td ul'); 
// } catch(err) {
// }

// if (!chapterList) {
//     console.log('no chapter list');
// }
// else {
//         let ilcs = {};
//         let seriesNumber = '';
        
    
//             let chapterNumber = '';
//             let chapterName = '';
//             let chapterURL = '';
//             if (line.includes('CHAPTER')) {
//                 for ( let i = 0; i < SERIES_NAMES.length; i++) {
//                     if (line.includes(SERIES_NAMES[i])) {
//                         seriesNumber = SERIES_NUMBERS[i];
//                         ilcs[seriesNumber] = {
//                             majorTopic: TOPICS[i],
//                             chapters: {}
//                         };
//                     }
//                 }
//             }
//             else {
//                // regex pattern to match any string of up to 3 digits
//                chapterNumber = line.match(/\d{1,3}/)[0];
//                chapterName = line.split(chapterNumber)[1].trim();
//                chapterURL = el.querySelector('a').href;
//                ilcs[seriesNumber].chapters[chapterNumber] = {
//                    name: chapterName,
//                    url: chapterURL
//                };
//             }
//         }
//         return JSON.stringify(ilcs);
//     },
//     SERIES_NAMES,
//     SERIES_NUMBERS);
//     console.log(newList);
// }

// browser.close();