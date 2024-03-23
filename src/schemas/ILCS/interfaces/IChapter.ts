import { Types } from 'mongoose';
import { ITopic } from './ITopic.js';

export interface IChapter {
   title: string;

   topic: Types.ObjectId | ITopic | string;

   url: string;

   number?: string;

   acts?: Types.ObjectId[];
}
