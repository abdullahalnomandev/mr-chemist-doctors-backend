import { z } from 'zod';
import { BloodGroup, Gender } from './customer.constant';

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  middleName: z.string().max(20).optional(),
  lastName: z.string().max(20),
});

const addressValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
  address: z.string().min(1),
  apartment: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  phone: z.string().min(1),
});

export const createCustomerValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    customer: z.object({
      designation: z.string().optional(),
      name: createUserNameValidationSchema,
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      shippingAddress: addressValidationSchema.optional(),
      billingAddress: addressValidationSchema.optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(3).max(20).optional(),
  middleName: z.string().min(3).max(20).optional(),
  lastName: z.string().min(3).max(20).optional(),
});

export const updateCustomerValidationSchema = z.object({
  body: z.object({
    customer: z.object({
      name: updateUserNameValidationSchema,
      designation: z.string().max(30).optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      shippingAddress: addressValidationSchema.optional(),
      billingAddress: addressValidationSchema.optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const CustomerValidations = {
  createCustomerValidationSchema,
  updateCustomerValidationSchema,
};
