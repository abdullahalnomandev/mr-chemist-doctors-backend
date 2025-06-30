import { z } from 'zod';

const createTreatmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    slug: z.string({
      required_error: 'Treatment slug is required',
    }),
    questionsId: z.string().optional(),
    description: z.string({
      required_error: 'Description is required',
    }),
    isActive: z.boolean().optional(),
    logoUrl: z.string().optional().nullable(),
  }),
});

const updateTreatmentValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    questionsId: z.string().optional(),
    isActive: z.boolean().optional(),
    logoUrl: z.string().optional().nullable(),
  }),
});

export const TreatmentValidation = {
  createTreatmentValidationSchema,
  updateTreatmentValidationSchema,
};
