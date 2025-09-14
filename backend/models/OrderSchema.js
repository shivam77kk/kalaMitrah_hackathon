import mongoose from 'mongoose';
const { Schema } = mongoose;

// Sub-schema for products within an order. This preserves the product details at the
// time of purchase in case the original product is updated or deleted later.
const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const OrderSchema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  products: [OrderItemSchema], // An array of the OrderItem sub-documents
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'canceled', 'returned'],
    default: 'pending'
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
