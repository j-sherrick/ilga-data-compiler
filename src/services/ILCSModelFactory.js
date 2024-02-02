/**
 * @module ILCSModelFactory
 * 
 * @description This module exports functions that create new instances of the Mongoose models for the Illinois Compiled Statutes (ILCS) database.
 * These models represent different levels of the heirarchial structure of the ILCS, including Chapters, Acts, and Sections of text.
 * Each function takes in a plain javascript object and an optional parent ID, and returns a new instance of the appropriate model.
 * 
 * The exported functions include:
 * - `getNewSection(section, actId)`: Creates a new Section model from raw section data and an Act ID.
 * - `getNewSectionsArray(sections, actId)`: Creates an array of new Section models from raw sections data and an Act ID.
 * 
 * @example
 * import { getNewSection, getNewSectionsArray } from './ILCSModelFactory.js';
 * 
 * let sectionData = { header: { number: '1', reference: 'Section 1' }, text: 'This is the text of Section 1.', source: 'Source' };
 * let actId = '1234567890abcdef';
 * 
 * let section = getNewSection(sectionData, actId);
 * let sections = getNewSectionsArray([sectionData], actId);
 */
import { Section, Act, Subtopic } from '../models/ILCSActSchemas.js';
import { Chapter, Topic } from '../models/ILCSChapterSchemas.js';

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

function getNewSubtopicsArray(actObjs, actMods) {
    let subtopics = [];
    let currentSubtopic = {};
    for (let i = 0; i < actObjs.length; i++) {
        if (currentSubtopic.name !== actObjs[i].subtopic.name) {
            currentSubtopic = getNewSubtopic(actObjs[i].subtopic);
            currentSubtopic.acts.push(actMods[i]._id);
            subtopics.push(currentSubtopic);
        }
        currentSubtopic.acts.push(actMods[i]._id);
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