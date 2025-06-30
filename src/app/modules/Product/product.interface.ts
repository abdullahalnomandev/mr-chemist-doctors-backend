import { Types } from 'mongoose';

type VariantType = 'weight' | 'volume' | 'unit' | 'pack';

export interface IVariant {
  _id?: Types.ObjectId;
  type: VariantType;
  value: string;
  unit: string;
  price: number;
  stock: number;
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  variants: IVariant[];
  imageUrls?: string[];
  treatment?: Types.ObjectId;
  needConsultation: boolean;
  consultationId?: string;
  isActive: boolean;
  keyPoints: string[];
  metaTitle: string,
  metaDescription: string,
  openGraphImageUrl?: string,
  seoKeywords: string[],
}

export type TProductFilters = {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  needConsultation?: boolean;
  variantType?: VariantType;
};
