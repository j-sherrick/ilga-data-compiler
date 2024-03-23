import { Types } from 'mongoose';

export interface ISection {
   text: string;

   title?: string;

   source?: string;

   act?: Types.ObjectId;
}
