import { z } from 'zod';

const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().max(120).nonempty({ message: 'Title is required' }),
    slug: z.string().trim().optional(), // Slug is auto-generated but can be provided
    excerpt: z.string().max(200).nonempty({ message: 'Excerpt is required' }),
    content: z.string().nonempty({ message: 'Content is required' }),
    imageUrls: z.array(z.string()).optional(),
    author: z.string().nonempty({ message: 'Author ID is required' }), // Assuming author ID is sent as string
    treatment: z.string().optional(), // Assuming treatment ID is sent as string
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
    publishedAt: z.string().datetime().optional(), // Validate as datetime string
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    openGraphImageUrl: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
  }),
});

const updateBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().max(120).optional(),
    slug: z.string().trim().optional(),
    excerpt: z.string().max(200).optional(),
    content: z.string().nonempty({ message: 'Content is required' }),
    imageUrls: z.array(z.string()).optional(),
    author: z.string().optional(),
    treatment: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
    publishedAt: z.string().datetime().optional(), // Validate as datetime string
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    openGraphImageUrl: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
  }),
});

export const BlogValidation = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};