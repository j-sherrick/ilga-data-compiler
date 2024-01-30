import { normalizeNewlines, normalizeNbsp } from './stringUtils.js';
import { NL, TITLE, TOPIC, HREF, SP } from '../constants/strings.js';

export function parseActPrefix(line) {
    let prefix = normalizeNbsp(line.split('/')[0]);
    return prefix.split(SP)[2];
}

export function parseActTitle(act) {
    return normalizeNbsp(act.split('/')[1].trim());
}

export function parseActSubtopic(subtopic) {
    return normalizeNbsp(subtopic.split(TOPIC)[1].trim());
}