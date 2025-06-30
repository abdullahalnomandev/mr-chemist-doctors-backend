import { Schema, model } from 'mongoose';

// Answer Schema - simplified to handle your flat structure better
const answerSchema = new Schema({
  questionCode: { type: String, required: true },
  value: {
    type: Schema.Types.Mixed, // Can store any type (boolean, string, array, etc.)
    required: true,
  },
});

// Main Consultation Response Schema
const consultationResponseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    treatment: { type: Schema.Types.ObjectId, ref: 'Treatment', required: true },
    consultation: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    // Store answers as key-value pairs
    answers: [answerSchema],
    // Also store the raw form data for convenience
    rawFormData: { type: Schema.Types.Mixed },
    status: { type: String, enum: ['in-progress', 'completed', 'approved', 'rejected'], default: 'in-progress' },
    completedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true },
);

// Ensure a user can only have one consultation response per treatment
consultationResponseSchema.index({ user: 1, treatment: 1 }, { unique: true });

export const ConsultationResponse = model('ConsultationResponse', consultationResponseSchema);
