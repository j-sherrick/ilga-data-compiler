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

function normalizeNbsp(string) {
    return string.replace(NBSP_REGEX, SP);
}

function normalizeNewlines(section) {
    return string.replace(NL_REGEX, '\n');
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

export function parseActText(actString) {
    const actSections = actString.split('\n\n').map(normalizeNewlines);
    let act = {};
    let number = '', text = '', source = '';
    for (let section of actSections) {
        section = section.split("\n");
        number = getSectionNumberFromLine(section[0]);
        source = section[-1].split('Source:')[1].trim();
    }
}
browser.close();