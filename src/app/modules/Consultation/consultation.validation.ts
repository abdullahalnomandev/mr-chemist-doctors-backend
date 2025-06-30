import { z } from 'zod';

const optionValidationSchema = z.object({
  id: z.number(),
  value: z.string(),
  label: z.string(),
  position: z.number(),
});

const questionValidationSchema: z.ZodObject<any> = z.object({
  id: z.number(),
  questionCode: z.string(),
  type: z.enum(['yesNo', 'text', 'textarea', 'checkbox', 'radio', 'select', 'date', 'number', 'checkboxGroup']),
  question: z.string().optional(),
  required: z.boolean().optional(),
  description: z.string().optional(),
  position: z.number(),
  treatmentTypes: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string().optional(),
  options: z.array(optionValidationSchema).optional(),
  allowMultiple: z.boolean().optional(),
  noneOption: z.string().optional(),
  conditionalQuestions: z
    .object({
      yes: z.array(z.lazy(() => questionValidationSchema)).optional(),
      no: z.array(z.lazy(() => questionValidationSchema)).optional(),
    })
    .optional(),
});

const stepValidationSchema = z.object({
  id: z.number(),
  stepCode: z.string(),
  title: z.string(),
  position: z.number(),
  questions: z.array(questionValidationSchema),
  treatmentTypes: z.array(z.string()).optional(),
});

const createConsultationValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    subtitle: z.string(),
    estimatedTime: z.number().optional(),
    steps: z.array(stepValidationSchema),
    treatment: z.string(),
  }),
});

const updateConsultationValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    estimatedTime: z.number().optional(),
    steps: z.array(stepValidationSchema).optional(),
    treatment: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ConsultationValidation = {
  createConsultationValidationSchema,
  updateConsultationValidationSchema,
};
