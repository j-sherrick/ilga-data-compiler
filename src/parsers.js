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
const SP = ' ';
const NL_REGEX = /\n+/g;
const NL = '\n';

const ILCS = 'ILCS';
const SOURCE = 'Source:';

function normalizeNbsp(section) {
    return section.replace(NBSP_REGEX, SP);
}

function normalizeNewlines(section) {
    return section.replace(NL_REGEX, NL);
}

function parseSectionNumber(section) {
    if (!section.includes(ILCS)) return '';
    const sectionNumber = section.split('\n')[0];
    return sectionNumber.split('/')[1].slice(0, -1);
}

function parseSectionTitle(section, sectionNumber) {
    if (!section.includes(sectionNumber)) return '';

    let title = section.split(sectionNumber + '.')[1].trim();
    return title.split('\n')[0];
}

function parseSectionText(section) {
    if (!section.includes(ILCS)) return section;
    section = section.split(NL).filter(line => !line.includes(ILCS) && !line.includes(SOURCE));
    section = section.filter(line => line !== '' || !line.includes('Sec.'));
    return section.join('\n').trim();
}

function parseSectionSource(section) {
    if (!section.includes(SOURCE)) return section;
    section = section.split(SOURCE)[1].trim().slice(0, -1); 
    return normalizeNbsp(section);
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

function parseActFromLine (line) {
   let { prefix, title } = line.split('/');
   prefix = prefix.split(' ')[2];
   title = title.trim();
}

export function parseActIndex(actIndexString) {
    const actIndex = actIndexString.split('\n\n');
    let title = '', prefix = '';
    if (actIndex.length === 1) {
        actIndex = actIndex[0].split('\n');
    }
    else if (actIndex.length > 1) {
        for (const category in actIndex) {
            category = category.split('\n');
            title = category[0];
        }
    }
}

export function parseChapterIndex(chapterIndexString) {
    return '';
}
browser.close();