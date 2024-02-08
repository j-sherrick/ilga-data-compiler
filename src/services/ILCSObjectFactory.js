/**
 * @module ILCSObjectFactory
 * 
 * @description This module exports functions that transform strings returned by the {@link ILCSExtractor}, into plain JavaScript objects.
 * These objects represent the Illinois Compiled Statutes' (ILCS) numbering scheme broken down into components such as Chapters, Acts, and Topics, and can be used for building their corresponding Mongoose models.
 * Each function takes in a raw string and returns a new object with parsed data.
 * 
 */

import { parseActPrefix, parseActSubtopic, parseActTitle } from './utils/actUtils.js';
import { parseChapterNumber, parseChapterTitle } from './utils/chapterUtils.js';
import { parseSectionHeader, parseSectionSource, parseSectionText } from './utils/sectionUtils.js';
import { normalizeNewlines, normalizeNbsp } from './utils/stringUtils.js';
import { NL, SP, TITLE, TOPIC, HREF, TOKEN, SERIES_NAMES, SERIES_NUMBERS } from './constants/strings.js';



/**
 * @typedef { Object } Topic
 * @property { String } series - The topic's series number.
 * @property { String } name - The topic's name.
 * 
 * 
 * @typedef { Object } Chapter
 * @property { String } number - String representation of the chapter's number.
 * @property { String } title - The chapter's title.
 * @property { Topic } topic - The chapter's topic.
 * @property { String } url - The chapter's url.
 * 
 * @typedef { Object } Act
 * @property { String } prefix - The act's prefix.
 * @property { String } title - The act's title.
 * @property { String } url - The act's url.
 * @property { Subtopic } subtopic - The act's subtopic.
 * @property { String } subtopic.name - The subtopic's name.
 */

/**
 * 
 * @param {*} topicString 
 * @returns 
 */
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




/**
 * Parses the raw string returned by {@link ILCSExtractor} into a new {@link Chapter} object.
 * 
 * @param { String } chptString - The raw string to parse.
 * @returns { Chapter } chapter - The parsed chapter object.
 */
function getNewChapter(chptString) {
    const chapterArray = chptString.split(NL);
    let chapter = {};
    for (const line of chapterArray) {
        if (line.includes(TITLE)) {
            chapter.number = parseChapterNumber(line);
            chapter.title = parseChapterTitle(line, chapter.number);
        }
        else if (line.includes(HREF)) {
            chapter.url = line.split(HREF)[1];
        }
        else if (line.includes(TOPIC)) {
            chapter.topic = getNewTopic(line);
        }
    }
    return chapter;
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
    let source = '';
    if(section.length > 2) {
        let sourceLine = section[section.length - 1];
        if (sourceLine.includes('Source')) {
            source = parseSectionSource(sourceLine);
        }
    }
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
    getNewChaptersArray,
    getNewTopic,
    getNewAct,
    getNewActsArray,
    getNewSection,
    getNewSectionsArray,
}