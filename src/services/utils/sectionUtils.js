import { normalizeNbsp } from './stringUtils.js';
import { NL, SP, TOKEN } from '../constants/strings.js';
import { SOURCE_REGEX } from '../constants/regex.js';

export function parseSectionHeader(header) {
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

export function parseSectionSource(source) {
    return normalizeNbsp(source.match(SOURCE_REGEX)[1]).trim();
}

export function parseSectionText(section) {
    let text = section.slice(1, -1).join(SP);
    return text;
}