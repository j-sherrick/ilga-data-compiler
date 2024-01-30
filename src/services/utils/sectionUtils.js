import { normalizeNbsp } from './stringUtils.js';
import { NL, SP, TOKEN } from '../constants/strings.js';
import { SOURCE_REGEX } from '../constants/regex.js';

function parseSectionHeader(header) {
    header = normalizeNbsp(header);
    let [number, reference] = header.split(') (');
    let parsedHeader = {};
    if(reference) {
        parsedHeader.reference = reference.slice(0, -1);
        parsedHeader.number = number.split('/')[1];
    }
    else {
        parsedHeader.number = number.split('/')[1].slice(0, -1);
    }
    return parsedHeader;
}

function parseSectionSource(source) {
    return normalizeNbsp(source.match(SOURCE_REGEX)[1]).trim();
}

function parseSectionText(section) {
    let text = section.slice(1, -1).join(SP);
    return text;
}

export function getSection(section) {
    section = section.split(NL).map(el => normalizeNbsp(el).trim()).filter(el => el !== '');
    const header = parseSectionHeader(section[0]);
    const source = parseSectionSource(section[section.length - 1]);
    const text = parseSectionText(section);
    return { header, text, source };
}

export function getSectionsArray(act) {
    const sections = act.split(TOKEN).filter( section => {
        return  section &&
                section !== SP &&
                section !== NL &&
                section !== NL + NL;
    }).map(section => section.trim());
    let parsedSections = [];
    for (const section of sections) {
        let parsedSection = getSection(section);
        parsedSections.push(parsedSection);
    }
    return parsedSections
}

