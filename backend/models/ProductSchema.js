import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [{
    type: String,
    required: true,
  }],
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  // Reference to the Category model to link the product to a specific category
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Tracks how many times a product has been sold
  salesCount: {
    type: Number,
    default: 0,
  },
  // A flag to determine if the product is a "trending product"
  isTrending: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
