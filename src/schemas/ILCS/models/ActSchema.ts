import mongoose, { Schema, Types } from 'mongoose';
import { IAct } from '../interfaces/IAct';

const ActSchema = new Schema<IAct>({
    title: {
        type: String,
        required: true
    },
    
    url: {
        type: String
    },
    
    prefix: {
        type: String,
    },
    
    repealed: {
        type: Boolean
    },

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