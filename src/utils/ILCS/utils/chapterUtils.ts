import { normalizeNbsp } from './stringUtils.js';

import {
   NL,
   TITLE,
   TOPIC,
   HREF,
   SERIES_NAMES,
   SERIES_NUMBERS
} from '../constants/strings.js';
import { CHAPTER_REGEX } from '../constants/regex.js';

export function parseChapterTitle(titleString, chapterNum) {
   titleString = normalizeNbsp(titleString);
   titleString = titleString.split(chapterNum)[1].trim();
   return titleString;
}

export function getTopic(topicString) {
   for (let i = 0; i < SERIES_NAMES.length; i++) {
      if (topicString.includes(SERIES_NAMES[i])) {
         topic.series = SERIES_NUMBERS[i];
         topic.name = SERIES_NAMES[i];
         return topic;
      }
   }
}

export function getChapter(chptString) {
   const chapterArray = chptString.split(NL);
   let chapter = {};
   for (const line of chapterArray) {
      if (line.includes(TITLE)) {
         chapter.number = parseChapterNumber(line);
         chapter.title = parseChapterTitle(line, chapter.number);
      } else if (line.includes(TOPIC)) {
         chapter.topic = getTopic(line);
      } else if (line.includes(HREF)) {
         chapter.url = line.split('url:')[1];
      }
   }
   return chapter;
}

export function getChaptersArray(chapterIndexString) {
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
