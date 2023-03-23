import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { UserDocument } from '../model/User';

const userSchema = new Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: [{
    _id: false,
    addressType: { type: String },
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    pincode: { type: Number, required: false },
  }],
  roleName: {
    type: String,
    enum: ['SuperAdmin', 'Admin', 'User'],
    default: 'User',
  },
  status: {
    type: String,
    enum: ['Enable', 'Disabled'],
    default: 'Enable',
  },
  isDeleted: { type: Boolean, default: false },
}, {
  collection: 'users',
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  versionKey: false,
  toObject: { getters: true, virtuals: true }
});
const User = mongoose.model<UserDocument>('User', userSchema);
export default User;