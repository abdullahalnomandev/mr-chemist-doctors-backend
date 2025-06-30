import { Types } from "mongoose";

export interface IReview extends Document {
  product?:Types.ObjectId;
  title: string;
  content: string;
  reviewerName: string;
  rating: number; // 1 to 5
  platform: "trustpilot" | "google" | "site" | string;
  userId?: string;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
