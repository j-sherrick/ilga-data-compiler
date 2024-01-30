// Desc: Factory for parsing Strings to POJOs, and creating ILCS related database models
import {
    Section,
    Act,
    Chapter,
    Topic,
    Subtopic
} from '../models/StatuteSchemas.js';

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
const SOURCE_REGEX = /\((.*?)\)/;

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

// MODEL PARSING
function getNewSection(section, actId) {
    const newSection = new Section({
        header: {
            number: section.header.number,
            reference: section.header.reference
        },
        text: section.text,
        source: section.source,
        act: actId
    });
    return newSection;
}

function getNewSectionsArray(sections, actId) {
    let sectionsArray = [];
    for (const section of sections) {
        sectionsArray.push(getNewSection(section, actId));
    }
    return sectionsArray;
}

function getNewAct(act, chapterId) {
    const newAct = new Act({
        prefix: act.prefix,
        title: act.title,
        url: act.url,
        chapter: chapterId,
        sections: [],
    });
}

function getNewActsArray(acts, chapterId) {
    let actsArray = [];
    let currentAct = {};

    for (const act of acts) {
        currentAct = getNewAct(act, chapterId);
        actsArray.push(currentAct);
    }
    return actsArray;
}

function getNewChapter(chapter) {
    const newChapter = new Chapter({
        number: chapter.number,
        url: chapter.url,
        title: chapter.title,
        topic: {},
        acts: []
    });
    return newChapter;
}

function getNewChaptersArray(chapters) {
    let chaptersArray = [];
    let currentChapter = {};
    for (const chapter of chapters) {
        currentChapter = getNewChapter(chapter);
        chaptersArray.push(currentChapter);
    }
    return chaptersArray;
}

function getNewTopic(topic) {
    const newTopic = new Topic({
        series: topic.series,
        name: topic.name,
        chapters: []
    });
    return newTopic;
}

function getNewTopicsArray(chapters) {
    let topics = [];
    let currentTopic = {};
    for (const chapter of chapters) {
        if (currentTopic.name !== chapter.topic.name) {
            currentTopic = getNewTopic(chapter.topic);
            currentTopic.chapters.push(chapter._id);
            topics.push(currentTopic);
        }
        currentTopic.chapters.push(chapter._id);
        chapter.topic = currentTopic._id;
    }
    return topics;
}

function getNewSubtopic(subtopic) {
    const newSubtopic = new Subtopic({
        name: subtopic.name,
        acts: []
    });
    return newSubtopic;
}

function getNewSubtopicsArray(acts) {
    let subtopics = [];
    let currentSubtopic = {};
    for (const act of acts) {
        if (currentSubtopic.name !== act.subtopic.name) {
            currentSubtopic = getNewSubtopic(act.subtopic);
            currentSubtopic.acts.push(act._id);
            subtopics.push(currentSubtopic);
        }
        currentSubtopic.acts.push(act._id);
    }
    return subtopics;
}

function initILCS(chapters, topics) {
    let chapterModels = getNewChaptersArray(chapters);
    topics = getNewTopicsArray(chapterModels);
}

export default {

    objectFactory() {
        return {
            parseChapter,
            parseChaptersArray,

            parseAct,
            parseActsArray,

            parseSection,
            parseSectionsArray,
        }
    },
    
    modelFactory() {
        return {
            getChapter: getNewChapter,
            getChaptersArray: getNewChaptersArray,

            getTopic: getNewTopic,
            getTopicsArray: getNewTopicsArray,

            getAct: getNewAct,
            getActsArray: getNewActsArray,

            getSubtopic: getNewSubtopic,
            getSubtopicsArray: getNewSubtopicsArray,

            getSection: getNewSection,
            getSectionsArray: getNewSectionsArray
        }
    }
};