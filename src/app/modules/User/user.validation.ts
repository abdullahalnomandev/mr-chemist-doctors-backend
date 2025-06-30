import { z } from 'zod';
import { UserStatus } from './user.constant';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'Password can not be more than 20 characters' })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});
const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    password: z.string().min(6),
    role: z.enum(['admin', 'editor','customer'] as [string, ...string[]]).optional(),
    email: z.string().email(),
  }),
  // Add other user fields as needed
});
const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['admin', 'editor'] as [string, ...string[]]).optional(),
    email: z.string().email().optional(),
  }),
});

// Add to exports
export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
  createUserValidationSchema,
  updateUserValidationSchema,
};
