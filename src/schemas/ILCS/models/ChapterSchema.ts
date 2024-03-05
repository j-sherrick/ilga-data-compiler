import mongoose, { Schema } from 'mongoose';
import { IChapter } from '../intefaces/IChapter';

const ChapterSchema = new Schema<IChapter>({
    number: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },
    
    acts: [{
        type: Schema.Types.ObjectId,
        ref: 'Act'
    }]
});

const Chapter = mongoose.model('Chapter', ChapterSchema);

export { Chapter };