import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  // Reference to a parent category for creating nested categories
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  // An array of references to child categories to create a hierarchy
  subcategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
});

export default mongoose.model('Category', CategorySchema);
