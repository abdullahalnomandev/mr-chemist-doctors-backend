import { Schema, model } from 'mongoose';

// Option Schema
const optionSchema = new Schema({
  id: { type: Number, required: true },
  value: { type: String, required: true },
  label: { type: String, required: true },
  position: { type: Number, required: true },
});

// Question Schema
const questionSchema = new Schema({
  id: { type: Number, required: true },
  questionCode: { type: String, required: true },
  type: {
    type: String,
    enum: ['yesNo', 'text', 'textarea', 'checkbox', 'radio', 'select', 'date', 'number', 'checkboxGroup'],
    required: true,
  },
  question: { type: String },
  required: { type: Boolean, default: false },
  description: String,
  position: { type: Number, required: true },
  treatmentTypes: [{ type: String }],
  // Fields for specific question types
  placeholder: String,
  prefix: String,
  suffix: String,
  label: String,
  options: [optionSchema],
  allowMultiple: Boolean,
  noneOption: String,
  conditionalQuestions: {
    yes: [{ type: Schema.Types.Mixed }],
    no: [{ type: Schema.Types.Mixed }],
  },
});

// Step Schema
const stepSchema = new Schema({
  id: { type: Number, required: true },
  stepCode: { type: String, required: true },
  title: { type: String, required: true },
  position: { type: Number, required: true },
  questions: [questionSchema],
  treatmentTypes: [{ type: String }],
});

// Main Consultation Schema
const consultationSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    estimatedTime: { type: Number },
    steps: [stepSchema],
    treatment: { type: Schema.Types.ObjectId, ref: 'Treatment', required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Add this before creating the model
consultationSchema.pre(['find', 'findOne'], function (next) {
  this.populate({ path: 'Treatment', select: 'name code' });
  next();
});

export const Consultation = model('Consultation', consultationSchema);
