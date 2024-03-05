import { NL, SP } from '../constants/strings.js';
import { NL_REGEX, NBSP_REGEX } from '../constants/regex.js';

export function normalizeNbsp(line) {
    return line.replace(NBSP_REGEX, SP);
}

export function normalizeNewlines(section) {
    let temp = section.replace(NL_REGEX, NL);
    return temp;
}

export function removeNewlines(section) {
    return section.replace(NL_REGEX, SP);
}