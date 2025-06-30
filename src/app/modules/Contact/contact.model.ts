import { Schema, model } from 'mongoose';
import { TContact, ContactModel } from './contact.interface';

const contactSchema = new Schema<TContact, ContactModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    attachment: { type: String }, // Store the URL or path to the attachment
  },
  { timestamps: true },
);

export const Contact = model<TContact, ContactModel>('Contact', contactSchema);