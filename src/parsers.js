const
    TITLE = 'title',

    URL = 'url',

    CATEGORY = 'category',

    SOURCE = 'Source:',

    ILCS = 'ILCS',

    SP = ' ',

    NL = '\n',
    NBSP_REGEX = /&nbsp;+/g,

    NL_REGEX = /\n+/g,

    SERIES_NUMBERS = [
        '00',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800'
    ],

    SERIES_NAMES = [
        'GOVERNMENT',
        'EDUCATION',
        'REGULATION',
        'HUMAN NEEDS',
        'HEALTH AND SAFETY',
        'AGRICULTURE AND CONSERVATION',
        'TRANSPORTATION',
        'RIGHTS AND REMEDIES',
        'BUSINESS AND EMPLOYMENT'
    ]
;

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
    return normalizeNbps(title.split('\n')[0]);
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
    let number = '', text = '', source = '', title = '';
    for (const section of actSections) {
        number = parseSectionNumber(section);
        title = parseSectionTitle(section, number);
        source = parseSectionSource(section);
        text = parseSectionText(section);
    }
    return { number, title, text, source };
}

function parseActTitle (line) {
   let { prefix, title } = line.split('/');
   prefix = prefix.split(' ')[2];
   title = title.trim();
   return { prefix, title };
}

function parseActCategory (line) {
    return normalizeNbsp(line.split(':')[1].trim());
}


export function parseActIndex(actIndexString) {
    let actIndex = {};
    let hasSubCategories = false;
    let subcategories = [];
    let subcategory = '', series = '', title = '', prefix, url = '';

    let actIndexArray = actIndexString.split('\n');
    for (const indexElement in actIndexArray) {
        if(hasSubCategories) {
            if (indexElement.includes('category')) {
                subcategory = parseActCategory(indexElement);
                subcategories.push(subcategory);
                series = SERIES_NUMBERS[categories.length];
                actIndex[series] = {  };
            }
            else if (indexElement.includes('title')) {
                ({ prefix, title } = parseActTitle(indexElement));
                actIndex[series][prefix] = { title, url: '' };
            }
            else if (indexElement.includes('url')) {
                url = indexElement.split(':')[1].trim();
                actIndex[series][prefix].url = url;
            }
        }
        else {
            if (indexElement.includes('category')) {
                series = SERIES_NUMBERS[subcategories.length];
                subcategory = parseActCategory(indexElement);
                subcategories.push(subcategory);
            }
            else if (indexElement.includes('title')) {
                ({ prefix, title } = parseActTitle(indexElement));
                actIndex[prefix] = { title, url: '' };
            }
            else if (indexElement.includes('url')) {
                url = indexElement.split(':')[1].trim();
                actIndex[prefix].url = url;
            }
        }
    }
    return actIndex;
}

export function parseChapterIndex(chapterIndexString) {
    return '';
}
browser.close();