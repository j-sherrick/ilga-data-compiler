import { parseActPrefix, parseActSubtopic, parseActTitle } from './utils/actUtils.js';
import { parseChapterNumber, parseChapterTitle } from './utils/chapterUtils.js';
import { parseSectionHeader, parseSectionSource, parseSectionText } from './utils/sectionUtils.js';
import { NL, SP, TITLE, TOPIC, HREF, TOKEN, SERIES_NAMES, SERIES_NUMBERS } from './constants/strings.js';

function getChapter(chptString) {
    const chapterArray = chptString.split(NL);
    let chapter = {};
    for (const line of chapterArray) {
        if (line.includes(TITLE)) {
            chapter.number = parseChapterNumber(line);
            chapter.title = parseChapterTitle(line, chapter.number);
        }
        else if (line.includes(TOPIC)) {
            chapter.topic = getTopic(line);
        }
        else if (line.includes(HREF)) {
            chapter.url = line.split(HREF)[1];
        }
    }
    return chapter;
}

function getTopic(topicString) {
    let topic = {};
    for (let i = 0; i < SERIES_NAMES.length; i++) {
        if (topicString.includes(SERIES_NAMES[i])) {
            topic.series = SERIES_NUMBERS[i];
            topic.name = SERIES_NAMES[i];
            return topic;
        }
    }
}

function getChaptersArray(chapterIndexString) {
    const chapterIndexArray = chapterIndexString.split(NL + NL);
    let chapters = [];
    for (let chapter of chapterIndexArray) {
        chapter = getChapter(chapter);
        if (chapter.title) {
            chapters.push(chapter);
        }
    }
    return chapters;
}

function getAct(act) {
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

function getActsArray(actIndexString) {
    const actIndexArray = actIndexString.split(NL + NL);
    let acts = [];
    for (let act of actIndexArray) {
        if(act){
            acts.push(getAct(act));
        }
    }
    return acts;
}

function getSection(section) {
    section = section.split(NL).map(el => normalizeNbsp(el).trim()).filter(el => el !== '');
    const header = parseSectionHeader(section[0]);
    const source = parseSectionSource(section[section.length - 1]);
    const text = parseSectionText(section);
    return { header, text, source };
}

function getSectionsArray(act) {
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


export default {
    getChapter,
    getTopic,
    getChaptersArray,
    getAct,
    getActsArray,
    getSection,
    getSectionsArray,
}