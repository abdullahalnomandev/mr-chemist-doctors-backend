import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const variantSchema = new Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['weight', 'volume', 'unit', 'pack'] // Add more types as needed
  },
  value: { 
    type: String, 
    required: true  // e.g., "100mg", "50ml", "30 tablets"
  },
  unit: {
    type: String,
    required: true  // e.g., "mg", "ml", "tablets"
  },
  price: { 
    type: Number, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true, 
    default: 0 
  }
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    basePrice: { type: Number, required: true },
    variants: { type: [variantSchema], default: [] }, // Made optional with default empty array
    imageUrls: { type: [String], default: [] },
    treatment: { type: Schema.Types.ObjectId, ref: 'Treatment' },
    needConsultation: { type: Boolean, default: false },
    consultationId: { type: String, required: false },
    keyPoints: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String, required: false },
    metaDescription: { type: String, required: false },
    openGraphImageUrl: { type: String, required: false},
    seoKeywords: { type: [String], required: false, default: [] },
  },
  { timestamps: true },
);

export const Product = model<IProduct>('Product', productSchema);
