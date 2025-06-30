import mongoose, { Model } from 'mongoose';

export type TContact = {
  user?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  attachment?: string; // Assuming attachment is a URL or path to a file
};

export interface ContactModel extends Model<TContact> {
  // You can add static methods here if needed
}