import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    createdDate: string;
    wordsCollection: any[];
    phrasesCollection: any[];
    lastActivity: string;
    language: string;
}

export const UserSchema = new mongoose.Schema({
    _id: String,
    createdDate: String,
    wordsCollection: Array,
    phrasesCollection: Array,
    lastActivity: String,
    language: String
});

const User = mongoose.model<IUser>('User', UserSchema, 'Users');
export default User;