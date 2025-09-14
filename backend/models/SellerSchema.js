import mongoose from 'mongoose';
const { Schema } = mongoose;

const SellerSchema = new Schema({
  // This field will store the unique ID from a Google account
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    },
  },
  refreshToken: {
    type: String,
  },
  profilePhotoUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  instagramLink: {
    type: String,
    default: ''
  },
  insightId: {
    type: Schema.Types.ObjectId,
    ref: 'ArtisanInsight'
  },
  trendsVideos: [{
    type: Schema.Types.ObjectId,
    ref: 'Trend',
  }],
}, { timestamps: true });

export default mongoose.model('Seller', SellerSchema);
