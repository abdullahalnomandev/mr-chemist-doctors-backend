import { Schema, model } from "mongoose";
import { IReview } from "./review.interface";


const reviewSchema = new Schema<IReview>(
  {
    product:{
      type:Schema.Types.ObjectId,
      ref:'Product',
      required:false,
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    userId: { type: String, required: false, trim: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    platform: {
      type: String,
      enum: ["trustpilot", "google", "site"],
      default: "Site",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Review = model<IReview>("Review", reviewSchema);
