import mongoose, { Schema } from 'mongoose';
import { IChapter } from '../interfaces/IChapter';

const ChapterSchema = new Schema<IChapter>({

    title: {
        type: String,
        required: true
    },

    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },

    url: {
        type: String,
        required: true
    },
    
    number: {
        type: String,
    },
    
    acts: [{
        type: Schema.Types.ObjectId,
        ref: 'Act'
    }]
});

const Chapter = mongoose.model('Chapter', ChapterSchema);

export { Chapter };