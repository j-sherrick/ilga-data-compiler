// Description: This file contains functions for parsing the chapter and act

// keywords returned by the extractors
const TITLE = 'title';
const HREF = 'url';
const TOPIC = 'topic';

// constants used for parsing
const SP = ' ';
const NL = '\n';
const NBSP_REGEX = /\u00A0+/g;
const NL_REGEX = /\n+/g;
const CHAPTER_REGEX = /\d{1,3}/;

// static statute data
const SERIES_NUMBERS = [
        '00',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800'];

const SERIES_NAMES = [
        'GOVERNMENT',
        'EDUCATION',
        'REGULATION',
        'HUMAN NEEDS',
        'HEALTH AND SAFETY',
        'AGRICULTURE AND CONSERVATION',
        'TRANSPORTATION',
        'RIGHTS AND REMEDIES',
        'BUSINESS AND EMPLOYMENT'
    ];

// UTILITIES
function normalizeNbsp(line) {
    return line.replace(NBSP_REGEX, SP);
}

function normalizeNewlines(section) {
    return section.replace(NL_REGEX, NL);
}

// CHAPTER PARSING
function parseChapterNumber(chapter) {
    return chapter.match(CHAPTER_REGEX)[0];
}

function parseChapterTitle(chapter, chptNumber) {
    chapter = normalizeNbsp(chapter);
    chapter = chapter.split(chptNumber)[1].trim();
    return chapter;
}

function parseChapterTopic(topicString) {
    let topic = {};
    for (let i = 0; i < SERIES_NAMES.length; i++) {
        if (topicString.includes(SERIES_NAMES[i])) {
            topic.series = SERIES_NUMBERS[i];
            topic.name = SERIES_NAMES[i];
            return topic;
        }
    }
}

function parseChapter(chptString) {
    const chapterArray = chptString.split(NL);
    let chapter = {};
    for (const line of chapterArray) {
        if (line.includes(TITLE)) {
            chapter.number = parseChapterNumber(line);
            chapter.title = parseChapterTitle(line, chapter.number);
        }
        else if (line.includes(TOPIC)) {
            chapter.topic = parseChapterTopic(line);
        }
        else if (line.includes(HREF)) {
            chapter.url = line.split('url:')[1];
        }
    }
    return chapter;
}

export function parseChapterIndex(chapterIndexString) {
    const chapterIndexArray = chapterIndexString.split(NL + NL);
    let chapters = [];
    for (const chapter of chapterIndexArray) {
        chapters.push(parseChapter(chapter));
    }
    return chapters;
}

// ACT PARSING
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

function parseAct(act) {
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

export function parseActIndex(actIndexString) {
    const actIndexArray = actIndexString.split(NL + NL);
    let acts = [];
    for (let act of actIndexArray) {
        acts.push(parseAct(act));
    }
    return acts;
}