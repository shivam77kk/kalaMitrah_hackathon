import mongoose from 'mongoose';
const { Schema } = mongoose;

const TrendSchema = new Schema({
  videoUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  // This will be incremented each time a buyer likes the video
  likesCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model('Trend', TrendSchema);

