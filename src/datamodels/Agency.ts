import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { AgencyDocument } from '../model/Agency';

const agencySchema = new Schema({
    name: { type: String, required: true },
    address_1: { type: String, required: true, trim: true },
    address_2: { type: String, required: false, trim: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: Number, required: true },

}, {
    collection: 'agency',
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    versionKey: false,
    toObject: { getters: true, virtuals: true }
});
const Agency = mongoose.model<AgencyDocument>('Agency', agencySchema);
export default Agency;