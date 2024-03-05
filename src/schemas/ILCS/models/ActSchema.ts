import mongoose, { Schema, Types } from 'mongoose';
import { IAct } from '../intefaces/IAct';

const ActSchema = new Schema<IAct>({
    prefix: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    url: String,

    chapter: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter',
    },

    sections: [{
        type: Schema.Types.ObjectId,
        ref: 'Section'
    }],

    subtopic: {
        type: Schema.Types.ObjectId,
        ref: 'Subtopic'
    }
});

const Act = mongoose.model('Act', ActSchema);

export { Act };