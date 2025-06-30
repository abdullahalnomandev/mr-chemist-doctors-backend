import { Types } from 'mongoose';

interface IFeaturedImage {
  url?: string;
  altText?: string;
  caption?: string;
}

export interface IBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: IFeaturedImage;
  author: Types.ObjectId; // Refers to User model
  treatment?: Types.ObjectId; // Refers to Treatment model
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  openGraphImageUrl?: string,
  seoKeywords?: string[];
}