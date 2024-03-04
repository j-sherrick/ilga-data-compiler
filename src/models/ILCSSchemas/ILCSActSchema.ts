import mongoose, { Schema, Types } from 'mongoose';

interface IAct {
    prefix: string,

    title: string,

    repealed: boolean;
    
    chapter: Types.ObjectId;
    
    url?: string,

    sections?: Types.ObjectId[];

    subtopic?: Types.ObjectId;
}

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
        required: true
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

export { Act, IAct };