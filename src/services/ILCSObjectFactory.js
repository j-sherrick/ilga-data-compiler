import { parseActPrefix, parseActSubtopic, parseActTitle } from './utils/actUtils.js';
import { parseChapterNumber, parseChapterTitle } from './utils/chapterUtils.js';
import { parseSectionHeader, parseSectionSource, parseSectionText } from './utils/sectionUtils.js';
import { NL, SP, TITLE, TOPIC, HREF, TOKEN, SERIES_NAMES, SERIES_NUMBERS } from './constants/strings.js';

function getNewChapter(chptString) {
    const chapterArray = chptString.split(NL);
    let chapter = {};
    for (const line of chapterArray) {
        if (line.includes(TITLE)) {
            chapter.number = parseChapterNumber(line);
            chapter.title = parseChapterTitle(line, chapter.number);
        }
        else if (line.includes(TOPIC)) {
            chapter.topic = getNewTopic(line);
        }
        else if (line.includes(HREF)) {
            chapter.url = line.split(HREF)[1];
        }
    }
    return chapter;
}

function getNewTopic(topicString) {
    let topic = {};
    for (let i = 0; i < SERIES_NAMES.length; i++) {
        if (topicString.includes(SERIES_NAMES[i])) {
            topic.series = SERIES_NUMBERS[i];
            topic.name = SERIES_NAMES[i];
            return topic;
        }
    }
}

function getNewChaptersArray(chapterIndexString) {
    const chapterIndexArray = chapterIndexString.split(NL + NL);
    let chapters = [];
    for (let chapter of chapterIndexArray) {
        chapter = getNewChapter(chapter);
        if (chapter.title) {
            chapters.push(chapter);
        }
    }
    return chapters;
}

function getNewAct(act) {
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

function getNewActsArray(actIndexString) {
    const actIndexArray = actIndexString.split(NL + NL);
    let acts = [];
    for (let act of actIndexArray) {
        if(act){
            acts.push(getNewAct(act));
        }
    }
    return acts;
}

function getNewSection(section) {
    section = section.split(NL).map(el => normalizeNbsp(el).trim()).filter(el => el !== '');
    const header = parseSectionHeader(section[0]);
    const source = parseSectionSource(section[section.length - 1]);
    const text = parseSectionText(section);
    return { header, text, source };
}

function getNewSectionsArray(act) {
    const sections = act.split(TOKEN).filter( section => {
        return  section &&
                section !== SP &&
                section !== NL &&
                section !== NL + NL;
    }).map(section => section.trim());
    let parsedSections = [];
    for (const section of sections) {
        let parsedSection = getNewSection(section);
        parsedSections.push(parsedSection);
    }
    return parsedSections
}


export default {
    getNewChapter,
    getNewTopic,
    getNewChaptersArray,
    getNewAct,
    getNewActsArray,
    getNewSection,
    getNewSectionsArray,
}