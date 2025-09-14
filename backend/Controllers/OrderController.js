import Order from '../models/OrderSchema.js';
import Buyer from '../models/BuyerSchema.js';
import Seller from '../models/SellerSchema.js';
import Product from '../models/ProductSchema.js';


export const placeOrder = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const { products, shippingAddress } = req.body;

        if (!products || products.length === 0 || !shippingAddress) {
            return res.status(400).json({ success: false, message: "Products and shipping address are required." });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${item.productId} not found.` });
            }
            if (item.quantity <= 0) {
                return res.status(400).json({ success: false, message: "Quantity must be greater than 0." });
            }

            totalAmount += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                seller: product.seller,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        const newOrder = new Order({
            buyer: buyerId,
            products: orderItems,
            totalAmount,
            shippingAddress
        });

        await newOrder.save();

        const buyer = await Buyer.findById(buyerId);
        if (buyer) {
            buyer.myOrders.push(newOrder._id);
            await buyer.save();
        }

        res.status(201).json({ success: true, message: "Order placed successfully", data: newOrder });

    } catch (error) {
        console.error("Error placing order:", error.message);
        res.status(500).json({ success: false, message: "Server error placing order." });
    }
};

export const getBuyerOrders = async (req, res) => {
    try {
        const buyerId = req.user.id;

        const orders = await Order.find({ buyer: buyerId })
            .populate('products.product')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, message: "Buyer orders fetched successfully", data: orders });
    } catch (error) {
        console.error("Error fetching buyer orders:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching buyer orders." });
    }
};

export const getSellerSales = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const sales = await Order.find({ 'products.seller': sellerId })
            .populate({ path: 'products.product', model: 'Product' })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, message: "Seller sales fetched successfully", data: sales });
    } catch (error) {
        console.error("Error fetching seller sales:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching seller sales." });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { newStatus } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        const isSellerAuthorized = order.products.every(item => item.seller.toString() === req.user.id);
        if (!isSellerAuthorized) {
            return res.status(403).json({ success: false, message: "Access denied. Not the seller of these products." });
        }

        if (!['shipped', 'delivered', 'canceled', 'returned'].includes(newStatus)) {
            return res.status(400).json({ success: false, message: "Invalid status provided." });
        }

        order.orderStatus = newStatus;
        await order.save();

        res.status(200).json({ success: true, message: "Order status updated successfully", data: order });
    } catch (error) {
        console.error("Error updating order status:", error.message);
        res.status(500).json({ success: false, message: "Server error updating order status." });
    }
};
