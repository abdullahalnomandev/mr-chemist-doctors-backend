import { Schema, model } from 'mongoose';

const treatmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    questionsId: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    logoUrl: { type: String, required: false, nullable: true },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  },
);

// Add virtual for consultations
// treatmentSchema.virtual('consultations', {
//   ref: 'Consultation',
//   localField: '_id',
//   foreignField: 'treatment',
// });

export const Treatment = model('Treatment', treatmentSchema);
