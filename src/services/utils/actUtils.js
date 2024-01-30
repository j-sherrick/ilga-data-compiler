import { normalizeNewlines, normalizeNbsp } from './stringUtils.js';
import { NL, TITLE, TOPIC, HREF, SP } from '../constants/strings.js';

function parseActPrefix(line) {
    let prefix = normalizeNbsp(line.split('/')[0]);
    return prefix.split(SP)[2];
}

function parseActTitle(act) {
    return normalizeNbsp(act.split('/')[1].trim());
}

function parseActSubtopic(subtopic) {
    return normalizeNbsp(subtopic.split(TOPIC)[1].trim());
}

export function getAct(act) {
    act = normalizeNewlines(act);
    act = act.split(NL);
    let parsedAct = {};
    for (const line of act) {
        if (line.includes(TITLE)) {
            parsedAct.prefix = parseActPrefix(line);
            parsedAct.title = parseActTitle(line);
        }
        else if (line.includes(HREF)) {
            parsedAct.url = line.split(HREF)[1];
        }
        else if (line.includes(TOPIC)) {
            let subtopic = parseActSubtopic(line);
            if (subtopic) {
                parsedAct.subtopic = {
                    name: subtopic
               };
            }
        }
    }
    return parsedAct;
}

export function getActsArray(actIndexString) {
    const actIndexArray = actIndexString.split(NL + NL);
    let acts = [];
    for (let act of actIndexArray) {
        if(act){
            acts.push(getAct(act));
        }
    }
    return acts;
}
