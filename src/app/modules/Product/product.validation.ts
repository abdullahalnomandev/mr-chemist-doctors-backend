import { z } from 'zod';

const variantSchema = z.object({
  type: z.enum(['weight', 'volume', 'unit', 'pack'], {
    required_error: 'Variant type is required',
  }),
  value: z.string({ required_error: 'Value is required' }),
  unit: z.string({ required_error: 'Unit is required' }),
  price: z.number({ required_error: 'Price is required' }),
  stock: z.number({ required_error: 'Stock is required' }),
});

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    slug: z.string({ required_error: 'Product slug is required' }),
    description: z.string().optional(),
    basePrice: z.number({ required_error: 'Base price is required' }),
    variants: z.array(variantSchema).default([]),
    imageUrls: z.array(z.string()).optional(),
    treatment: z.string().optional(),
    needConsultation: z.boolean().optional(),
    consultationId: z.string().optional(),
    keyPoints: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    openGraphImageUrl: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    basePrice: z.number({ required_error: 'Base price is required' }),
    variants: z.array(variantSchema).default([]),
    imageUrls: z.array(z.string()).optional(),
    treatment: z.string().optional(),
    needConsultation: z.boolean().optional(),
    consultationId: z.string().optional(),
    keyPoints: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    openGraphImageUrl: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};

export type TCreateProductPayload = z.infer<typeof createProductValidationSchema>['body'];
