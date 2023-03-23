import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { ClientDocument } from '../model/Client';

const clientSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    agencyId: { type: mongoose.Types.ObjectId, ref: 'agency' },
    totalBill: { type: Number, required: true, default: 0 },
    phoneNumber: { type: Number, required: true },
}, {
    collection: 'clients',
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    versionKey: false,
    toObject: { getters: true, virtuals: true }
});
const Client = mongoose.model<ClientDocument>('Client', clientSchema);
export default Client;