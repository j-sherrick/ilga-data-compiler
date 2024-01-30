import { normalizeNewlines, normalizeNbsp } from './stringUtils.js';

function parseActPrefix(line) {
    let prefix = normalizeNbsp(line.split('/')[0]);
    return prefix.split(' ')[2];
}

function parseActTitle(act) {
    return normalizeNbsp(act.split('/')[1].trim());
}

function parseActSubtopic(subtopic) {
    return normalizeNbsp(subtopic.split('topic:')[1].trim());
}

export function parseAct(act) {
    act = normalizeNewlines(act);
    act = act.split(NL);
    let parsedAct = {};
    for (const line of act) {
        if (line.includes(TITLE)) {
            parsedAct.prefix = parseActPrefix(line);
            parsedAct.title = parseActTitle(line);
        }
        else if (line.includes(HREF)) {
            parsedAct.url = line.split('url:')[1];
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

export function parseActsArray(actIndexString) {
    const actIndexArray = actIndexString.split(NL + NL);
    let acts = [];
    for (let act of actIndexArray) {
        if(act){
            acts.push(parseAct(act));
        }
    }
    return acts;
}
