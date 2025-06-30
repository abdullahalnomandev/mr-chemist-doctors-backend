import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: { type: String, required: true },
    imageUrls: { type: [String], default: [] },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    metaTitle: String,
    metaDescription: String,
    openGraphImageUrl: { type: String, required: false },
    seoKeywords: [String],
  },
  {
    timestamps: true,
  },
);

// Slug generation middleware
blogPostSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
