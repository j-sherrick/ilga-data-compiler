const TITLE = 'title';
const HREF = 'url';
const TOPIC = 'topic';
const ILCS = 'ILCS';

const SP = ' ';
const NL = '\n';
const NBSP = '\u00A0';
const NBSP_REGEX = /\u00A0+/g;
const NL_REGEX = /\n+/g;
const CHAPTER_REGEX = /\d{1,3}/;
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

function normalizeNbsp(line) {
    return line.replace(NBSP_REGEX, SP);
}

function normalizeNewlines(section) {
    return section.replace(NL_REGEX, NL);
}

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

function parseActPrefix(act) {
    let prefix = normalizeNbsp(act.split('/')[0]);
    return prefix.split(' ')[2];
}

function parseActTitle(act) {
    return normalizeNbsp(act.split('/')[1].trim());
}

function parseActSubtopic(subtopic) {
    return subtopic.split(':')[1];
}

function parseSubtopicSeries(subtopic) {
    let series = subtopic.charAt(0);
    if (series === '0') return '00';
    return series + '00';
}

function parseAct(act) {
    act = normalizeNewlines(act);
    const actArray = act.split(NL);
    let parsedAct = {};
    let currentSubtopic = '';
    for (const line of actArray) {
        if (line.includes(TITLE)) {
            parsedAct.prefix = parseActPrefix(line);
            parsedAct.title = parseActTitle(line);
            if(currentSubtopic) {
                let series = parseSubtopicSeries(parsedAct.prefix);
                parsedAct.subtopic = {
                    series: series,
                    name: currentSubtopic
                };
            }
        }
        else if (line.includes(HREF)) {
            parsedAct.url = line.split('url:')[1];
        }
        else if (line.includes(TOPIC)) {
            currentSubtopic = parseActSubtopic(line);
        }
    }
    return parsedAct;
}

export function parseActIndex(actIndexString) {
    const actIndexArray = actIndexString.split(NL + NL);
    let acts = [];
    for (const act of actIndexArray) {
        console.log('\n' + act);
    }
    return acts;
}