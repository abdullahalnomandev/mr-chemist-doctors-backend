import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req, _, next) => {
    const data = await schema.parseAsync({ body: req.body, cookies: req.cookies });
    req.body = data.body;
    next();
  });
};

export default validateRequest;
