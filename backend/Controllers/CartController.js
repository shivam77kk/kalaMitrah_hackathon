import Cart from '../models/CartSchema.js';
import Product from '../models/ProductSchema.js';
import Buyer from '../models/BuyerSchema.js';

export const getCart = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const cart = await Cart.findOne({ buyer: buyerId }).populate('items.product').lean();
        if (!cart) {
            const newCart = await Cart.create({ buyer: buyerId, items: [] });
            return res.status(200).json({ success: true, message: "New cart created for buyer", data: newCart });
        }
        res.status(200).json({ success: true, message: "Cart fetched successfully", data: cart });
    } catch (error) {
        console.error("Error fetching cart:", error.message);
        res.status(500).json({ success: false, message: "Server error fetching cart." });
    }
};

export const addItemToCart = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: "Product ID and a valid quantity are required." });
        }

        const product = await Product.findById(productId).lean();
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        let cart = await Cart.findOne({ buyer: buyerId });
        if (!cart) {
            cart = new Cart({ buyer: buyerId, items: [] });
            await cart.save();
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            const cartItem = {
                product: product._id,
                seller: product.seller,
                name: product.name,
                price: product.price,
                quantity,
            };
            cart.items.push(cartItem);
        }

        await cart.save();
        res.status(200).json({ success: true, message: "Item added to cart successfully", data: cart });
    } catch (error) {
        console.error("Error adding item to cart:", error.message);
        res.status(500).json({ success: false, message: "Server error adding item to cart." });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: "Product ID and a valid quantity are required." });
        }

        const cart = await Cart.findOne({ buyer: buyerId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json({ success: true, message: "Cart updated successfully", data: cart });
        } else {
            return res.status(404).json({ success: false, message: "Item not found in cart." });
        }
    } catch (error) {
        console.error("Error updating cart item:", error.message);
        res.status(500).json({ success: false, message: "Server error updating cart." });
    }
};

export const removeItemFromCart = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ buyer: buyerId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();
            res.status(200).json({ success: true, message: "Item removed from cart successfully", data: cart });
        } else {
            return res.status(404).json({ success: false, message: "Item not found in cart." });
        }
    } catch (error) {
        console.error("Error removing item from cart:", error.message);
        res.status(500).json({ success: false, message: "Server error removing item from cart." });
    }
};
