import mongoose, { Schema, Types } from 'mongoose';
import { ISection } from '../intefaces/ISection';

const SectionSchema = new Schema<ISection>({
    header: {
        number: {
            type: String,
            required: true
        },

        reference: String
    },

    text: {
        type: String,
        required: true
    },

    source: String,

    act: {
        type: Schema.Types.ObjectId,
        ref: 'Act',
    }
});

const Section = mongoose.model('Section', SectionSchema);

export { Section };