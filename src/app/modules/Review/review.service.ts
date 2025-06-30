import QueryBuilder from '../../builder/QueryBuilder';
import { Customer } from '../Customer/customer.model';
import { IReview } from './review.interface';
import { Review } from './review.model';

const createReview = async (userId: string, payload: IReview): Promise<IReview> => {
  const user = await Customer.findOne({ id: userId });
  
  if (!user) {
    throw new Error('User not found');
  }

  const result = await Review.create({
    // Skip setting reviewerName here since it will be provided in payload
    ...payload,
    userId: user.id // Adding userId reference
  });

  return result;
};

const getAllReviews = async (query: Record<string, unknown>) => {
    const reviewQuery = new QueryBuilder(Review.find(), query)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await reviewQuery.modelQuery;
  
    // Fetch user data for all reviews
    const reviewsWithUserData = await Promise.all(
      result.map(async (review) => {
        let reviewerName: string | undefined = undefined;
  
        if (review.userId) {
          // If userId is a custom ID like "C-0004", use findOne instead of findById
          const user = await Customer.findOne({ id: review.userId }).lean(); // use .lean() for performance
          reviewerName = user ? `${user.name.firstName} ${user.name.lastName} ` : undefined;
        }
  
        return {
          ...review.toObject(),
          reviewerName,
        };
      })
    );
  
    const meta = await reviewQuery.countTotal();
  
    return {
      meta,
      result: reviewsWithUserData,
    };
  };
  
const getReviewsByProduct = async (product:string,query: Record<string, unknown>) => {
    const reviewQuery = new QueryBuilder(Review.find({product}), query)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await reviewQuery.modelQuery;
  
    // Fetch user data for all reviews
    const reviewsWithUserData = await Promise.all(
      result.map(async (review) => {
        let reviewerName: string | undefined = undefined;
  
        if (review.userId) {
          // If userId is a custom ID like "C-0004", use findOne instead of findById
          const user = await Customer.findOne({ id: review.userId }).lean(); // use .lean() for performance
          reviewerName = user ? `${user.name.firstName} ${user.name.lastName} ` : undefined;
        }
  
        return {
          ...review.toObject(),
          reviewerName,
        };
      })
    );
  
    const meta = await reviewQuery.countTotal();
  
    return {
      meta,
      result: reviewsWithUserData,
    };
  };
  
const getSingleReview = async (userId:string,product:string) => {
    
  const review = await Review.findOne({userId,product})
  return review

};
const updateReview = async ({ userId, product, title, rating, content }: IReview) => {
  const result = await Review.findOneAndUpdate(
    { userId, product },
    { title, rating, content },
    { new: true, upsert: true }
  );
  return result;
};

// You can add more service functions here for update, delete, get single review, etc.

export const ReviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  getReviewsByProduct
};