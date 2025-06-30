import { IBlogPost } from './blog.interface';
import { BlogPost } from './blog.model';
import QueryBuilder from '../../builder/QueryBuilder'; // Assuming you have a QueryBuilder utility
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// Placeholder for searchable fields if you use QueryBuilder
const BlogSearchableFields = ['title', 'slug', 'excerpt', 'tags'];

const createBlogIntoDB = async (payload: IBlogPost) => {
  // Mongoose middleware will handle slug generation if not provided
  const result = await BlogPost.create(payload);
  return result;
};

const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(BlogPost.find().populate('author').populate('treatment'), query).search(BlogSearchableFields).filter().sort().paginate().fields();
  // .populate('author') // Populate author details
  // .populate('treatment'); // Populate treatment details

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleBlogFromDB = async (id: string) => {
  const result = await BlogPost.findById(id).populate('author').populate('treatment');
  return result;
};

const getBlogBySlug = async (slug: string) => {
  const result = await BlogPost.findOne({ slug }).populate('treatment');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
  }
  return result;
};

const updateBlogIntoDB = async (id: string, payload: Partial<IBlogPost>) => {
  console.log("payload", payload)
  const result = await BlogPost.findByIdAndUpdate(id, payload, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators on update
  })
    .populate('author')
    .populate('treatment');

  if (!result) {
    // Check if the blog was found and updated
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  return result;
};

const deleteBlogFromDB = async (id: string) => {
  // Assuming soft delete is not implemented in the schema, using hard delete
  const result = await BlogPost.findByIdAndDelete(id);

  if (!result) {
    // Check if the blog was found and deleted
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  return result;
};

export const BlogServices = {
  createBlogIntoDB,
  getAllBlogsFromDB,
  getBlogBySlug,
  getSingleBlogFromDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
};
