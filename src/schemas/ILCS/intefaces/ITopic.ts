import { Types } from 'mongoose';

export interface ITopic {
    series: string,

    name: string,

    chapters?: Types.ObjectId[];
}