// Desc: Factory for parsing Strings to POJOs, and creating ILCS related database models
import {
    Section,
    Act,
    Chapter,
    Topic,
    Subtopic
} from '../models/StatuteSchemas.js';

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

function getNewTopicsArray(chapterObjs, chapterMods) {
    let topics = [];
    let currentTopic = {};
    for (let i = 0; i < chapterObjs.length; i++) {
        if (currentTopic.name !== chapterObjs[i].topic.name) {
            currentTopic = getNewTopic(chapterObjs[i].topic);
            currentTopic.chapters.push(chapterMods[i]._id);
            topics.push(currentTopic);
        }
        else {
            currentTopic.chapters.push(chapterMods[i]._id);
        }
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


export default {
    getNewChapter,
    getNewChaptersArray,
    getNewTopic,
    getNewTopicsArray,
    getNewAct,
    getNewActsArray,
    getNewSubtopic,
    getNewSubtopicsArray,
    getNewSection,
    getNewSectionsArray
}