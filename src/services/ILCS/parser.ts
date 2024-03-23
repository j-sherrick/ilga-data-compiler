import { IChapter } from '@interfaces/IChapter.js';
import { IAct } from '@interfaces/IAct.js';
import { ISection } from '@interfaces/ISection.js';

export class Parser {
   public static strToChapterArray(rawStr: string): IChapter[] {
      return JSON.parse(rawStr) as IChapter[];
   }
   public static strToActArray(rawStr: string): IAct[] {
      return JSON.parse(rawStr) as IAct[];
   }
}
