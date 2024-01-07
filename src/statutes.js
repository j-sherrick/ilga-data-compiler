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
    chapters: page.$eval('td ul', (uList, SERIES_NAMES, SERIES_NUMBERS) => {
        
        let index = {};
        let series = '';
        let chapter = '';
        for( const item of ul) {
            if (item.innerText.includes('CHAPTER')) {
                const digitRegEx = /\d{1,3}/;
                const series = line.innerText.match(digitRegEx);
                if (series) {
                    const name = line.innerText.split(series)[1].trim();
                    index[series] = {
                        name,
                    }
                }
            }
            else {
                for (const name in SERIES_NAMES)
                    if (item.innerText.includes(name)) {

                    }
                
            }
        }
    })
}

// const quickTest = await page.$eval('td ul', el => el.innerText );

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