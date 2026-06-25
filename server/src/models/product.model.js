import { Schema, model } from "mongoose";

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      trim: true
    },
    description: { 
      type: String, 
      required: true,
      trim: true
    },
    price: { 
      type: Number, 
      required: true, 
      min: 1
    },
    stock: { 
      type: Number, 
      required: true, 
      default: 0, 
      min: 0 
    },
    category: { 
      type: String, 
      default: 'alkaline-water' 
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [imageSchema],
      validate: {
        validator: arr => arr.length > 0,
        message: "At least one product image is required",
      },
    },
  },
  { timestamps: true }
);

export const Product = model('Product', productSchema);