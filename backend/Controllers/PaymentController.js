import Stripe from 'stripe';
import Order from '../models/OrderSchema.js';
import Buyer from '../models/BuyerSchema.js';
import Product from '../models/ProductSchema.js';
import Cart from '../models/CartSchema.js';
import 'dotenv/config';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export const createCheckoutSession = async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({ success: false, message: "Payment processing is not configured. Please contact administrator." });
        }
        
        const buyerId = req.user.id;
        
        const cart = await Cart.findOne({ buyer: buyerId }).populate('items.product').lean();
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty. Cannot proceed to checkout." });
        }
       
        const lineItems = cart.items.map(item => {
            return {
                price_data: {
                    currency: 'inr', 
                    product_data: {
                        name: item.product.name,
                        images: item.product.images.length > 0 ? [item.product.images[0]] : ['https://placehold.co/400x400.png'], 
                        metadata: {
                            productId: item.product._id.toString(),
                            sellerId: item.seller.toString(),
                        },
                    },
                    unit_amount: item.product.price * 100, 
                },
                quantity: item.quantity,
            };
        });
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/order-canceled`,
            metadata: {
                buyerId: buyerId.toString(),
            },
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error.message);
        res.status(500).json({ success: false, message: "Server error creating checkout session." });
    }
};

export const handleWebhook = async (req, res) => {
    if (!stripe) {
        return res.status(500).send("Payment processing is not configured.");
    }
    
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const buyerId = session.metadata.buyerId;

        const cart = await Cart.findOne({ buyer: buyerId }).populate('items.product').lean();
        if (!cart || cart.items.length === 0) {
            return res.status(400).send("Cart is empty for this user.");
        }

        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            totalAmount += item.product.price * item.quantity;
            return {
                product: item.product._id,
                seller: item.seller,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
            };
        });

        const newOrder = new Order({
            buyer: buyerId,
            products: orderItems,
            totalAmount,
            paymentStatus: 'paid',
            orderStatus: 'pending',
          
        });
        await newOrder.save();
        
        await Cart.deleteOne({ buyer: buyerId });

        console.log(`Order created and payment confirmed for buyer: ${buyerId}`);
    }

    res.status(200).json({ received: true });
};
