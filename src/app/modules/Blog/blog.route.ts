import express from 'express';
import { BlogControllers } from './blog.controller';
import validateRequest from '../../middlewares/validateRequest'; // Assuming you have a validateRequest middleware
import { BlogValidation } from './blog.validation';

const router = express.Router();

router.post('/create', validateRequest(BlogValidation.createBlogValidationSchema), BlogControllers.createBlog);

router.get('/', BlogControllers.getAllBlogs);

router.get('/id/:id', BlogControllers.getSingleBlog);

router.get('/:slug', BlogControllers.getBlogBySlug);

router.patch('/:id', validateRequest(BlogValidation.updateBlogValidationSchema), BlogControllers.updateBlog);

router.delete('/:id', BlogControllers.deleteBlog);

export const BlogRoutes = router;
