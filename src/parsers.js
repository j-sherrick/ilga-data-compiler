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
const NBSP_REGEX = /&nbsp;+/g;
const NL_REGEX = /\n+/g;
const ILCS = 'ILCS';
const SOURCE = 'Source:';
const SP = ' ';

function normalizeNbsp(section) {
    return section.replace(NBSP_REGEX, SP);
}

function normalizeNewlines(section) {
    return section.replace(NL_REGEX, '\n');
}

function parseSectionNumber(section) {
    if (!section.includes(ILCS)) return '';
    const sectionNumber = section.split('\n')[0];
    return sectionNumber.split('/')[1].slice(0, -1);
}

function parseSectionSource(section) {
    if (!section.includes(SOURCE)) return '';
    return section.split(SOURCE)[1].trim().slice(0, -1); 
}

function parseSectionText(section) {
    if (!section.includes(SOURCE)) return section;
    return section.split(SOURCE)[0].trim();
}

function parseSectionTitle(section, sectionNumber) {
    if (!section.includes(sectionNumber)) return '';

    let title = section.split(sectionNumber + '.')[1].trim();
    return title.slice(0, title.indexOf('.'));
}

export function parseActText(actString) {
    const actSections = actString.split('\n\n').map(normalizeNewlines);
    let act = {};
    let sectionNumber = '', sectionText = '', sectionSource = '', sectionTitle = '';
    for (const section of actSections) {
        sectionNumber = parseSectionNumber(section);
        sectionTitle = parseSectionTitle(section, sectionNumber);
        sectionSource = parseSectionSource(section);
        sectionText = parseSectionText(section);
        act[sectionNumber] = {
            title: sectionTitle,
            text: sectionText,
            source: sectionSource
        };
    }
    return act;
}

export function parseActIndex(actIndexString) {
    return ''; 
}

export function parseChapterIndexd(chapterIndexString) {
    return '';
}
browser.close();