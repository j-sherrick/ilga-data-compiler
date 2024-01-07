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

export const ILCSChapterIndex = {
    rawString: await page.$eval('td ul', (uList, SERIES_NAMES, SERIES_NUMBERS) => {
        
        let seriesNumber = '';
        let index = {};
        let chapter = {};
        let temp= '';

        for (const item in uList) {
            temp += uList[item].innerText;
            // if (uList[item].innerText.includes('CHAPTER')) {
            //     const temp = uList[item];
            //     const digitRegEx = /\d{1,3}/;
            //     const chapterNumber = temp.innerText.match(digitRegEx);
            //     if (chapterNumber) {
            //         index[seriesNumber] = {
            //             [chapters[chapterNumber]]: {
            //                 title: temp.innerText.split(chapterNumber)[1].trim(),
            //                 url: temp.querySelector('a').url,
            //             }
            //         }
            //     }
            // }
            // else {
            //     for (let i = 0; i < SERIES_NAMES.length; i++)
            //         if (uList[item].innerText.includes(SERIES_NAMES[i])) {
            //             seriesNumber = SERIES_NUMBERS[i];
            //             index[seriesNumber] = {
            //                 topic: SERIES_NAMES[i],
            //                 chapters: {},
            //             }
            //         }
            // }
            return temp;
        }
        return JSON.stringify(index);
    }, SERIES_NAMES, SERIES_NUMBERS)
}

const ilcs = await ILCSChapterIndex;
if(ilcs.rawString) {
    console.log(ilcs.rawString);
}

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