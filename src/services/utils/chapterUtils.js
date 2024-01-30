import { normalizeNbsp } from './stringUtils.js';

function parseChapterNumber(titleString) {
    return titleString.match(CHAPTER_REGEX)[0];
}

function parseChapterTitle(titleString, chapterNum) {
    titleString = normalizeNbsp(titleString);
    titleString = titleString.split(chapterNum)[1].trim();
    return titleString;
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

export function parseChapter(chptString) {
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

export function parseChaptersArray(chapterIndexString) {
    const chapterIndexArray = chapterIndexString.split(NL + NL);
    let chapters = [];
    for (let chapter of chapterIndexArray) {
        chapter = parseChapter(chapter);
        if (chapter.title) {
            chapters.push(chapter);
        }
    }
    return chapters;
}