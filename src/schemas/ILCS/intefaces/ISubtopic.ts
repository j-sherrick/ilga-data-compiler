import { Types } from 'mongoose';

export interface ISubtopic {
    name: string;

    acts?: Types.ObjectId[];
}