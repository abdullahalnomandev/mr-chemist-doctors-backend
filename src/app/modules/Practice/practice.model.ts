import { Schema, model } from 'mongoose';
import { IPractice, PracticeModel } from './practice.interface';

const practiceSchema = new Schema<IPractice, PracticeModel>(
  {
    nhsId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, required: true },
    line3: { type: String },
    line4: { type: String },
    postcode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Practice = model<IPractice, PracticeModel>('Practice', practiceSchema);