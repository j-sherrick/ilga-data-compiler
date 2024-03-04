import mongoose, { Schema, Types } from 'mongoose';

interface ITopic {
    series: string,

    name: string,

    chapters: Types.ObjectId[];
}

const TopicSchema = new Schema<ITopic>({
    series: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    chapters: [{
        type: Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true
    }]
});

const Topic = mongoose.model('Topic', TopicSchema);