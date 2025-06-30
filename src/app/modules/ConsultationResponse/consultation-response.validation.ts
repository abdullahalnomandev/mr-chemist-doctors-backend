import { z } from 'zod';

const answerValidationSchema = z.object({
  questionCode: z.string(),
  value: z.any(),
});

const createConsultationResponseValidationSchema = z.object({
  body: z.object({
    treatment: z.string(),
    consultation: z.string(),
    product: z.string().optional(),
    answers: z.array(answerValidationSchema),
    rawFormData: z.record(z.any()).optional(),
    notes: z.string().optional(),
  }),
});

const updateConsultationResponseValidationSchema = z.object({
  body: z.object({
    status: z.enum(['in-progress', 'completed', 'approved', 'rejected']).optional(),
    notes: z.string().optional(),
  }),
});

export const ConsultationResponseValidation = {
  createConsultationResponseValidationSchema,
  updateConsultationResponseValidationSchema,
};
