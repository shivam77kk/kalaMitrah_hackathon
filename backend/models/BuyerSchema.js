import mongoose from 'mongoose';
const { Schema } = mongoose;

const BuyerSchema = new Schema({
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
      // Password is only required if the buyer did not sign up with Google
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
  likedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  likedTrends: [{
    type: String 
  }],
  myOrders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order' 
  }],
}, { timestamps: true });

export default mongoose.model('Buyer', BuyerSchema);
