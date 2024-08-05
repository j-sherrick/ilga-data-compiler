import { Types } from 'mongoose';

export interface ITopic {
   name: string;

   series: string;

   chapters?: Types.ObjectId[];
}
