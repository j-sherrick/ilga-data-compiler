import mongoose, { Schema } from 'mongoose';
import { ITopic } from '../intefaces/ITopic';

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
    }]
});

const Topic = mongoose.model('Topic', TopicSchema);

export { Topic };