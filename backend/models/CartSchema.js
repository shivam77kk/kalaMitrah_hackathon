import mongoose from 'mongoose';

const { Schema } = mongoose;

const CartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});

const CartSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true,
        unique: true,
    },
    items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);
