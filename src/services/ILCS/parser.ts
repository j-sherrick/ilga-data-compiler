import { IChapter } from '@interfaces/IChapter.js';
import { IAct } from '@interfaces/IAct.js';
import { ISection } from '@interfaces/ISection.js';
import { ITopic } from '@interfaces/ITopic.js';

export class Parser {
   private static CHAPTER_REGEX: RegExp = /\d{1,3}/;
   private static NBSP_REGEX: RegExp = /\u00A0+/g;
   private static SERIES_NUMBERS = [
      '00',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800'
   ];

   private static SERIES_NAMES = [
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

   public static strToChapterArray(rawStr: string): IChapter[] {
      let chapters = JSON.parse(rawStr) as IChapter[];
      for (let chapter of chapters) {
         chapter.number = this.parseChapterNumber(chapter.title);
         chapter.title = this.parseChapterTitle(chapter.title, chapter.number);
         let topic: ITopic | null = this.parseChapterTopic(chapter.topic as string);
         chapter.topic = topic ? topic : chapter.topic;
      }
      return chapters;
   }
   public static strToActArray(rawStr: string): IAct[] {
      return JSON.parse(rawStr) as IAct[];
   }

   private static parseChapterNumber(titleString: string): string {
      let chpt: RegExpMatchArray | null = titleString.match(this.CHAPTER_REGEX);
      if (!chpt) return '';
      return chpt[0];
   }

   private static parseChapterTitle(titleString: string, chapterNum: string) {
      titleString = this.normalizeNbsp(titleString);
      titleString = titleString.split(chapterNum)[1].trim();
      return titleString;
   }

   private static parseChapterTopic(topicString: string): ITopic | null {
      for (let i = 0; i < this.SERIES_NAMES.length; i++) {
         if (topicString.includes(this.SERIES_NAMES[i])) {
            return {
               name: this.SERIES_NAMES[i],
               series: this.SERIES_NUMBERS[i]
            } as ITopic;
         }
      }
      return null;
   }

   private static normalizeNbsp(line: string): string {
      return line.replace(this.NBSP_REGEX, ' ');
   }
}
