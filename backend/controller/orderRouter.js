const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const Order = require("../model/orderModel");

// Place Order Endpoint
router.post("/place-order", async (req, res) => {
    try {
        const { email, products, address } = req.body;

        // Validate request body
        if (!email || !products || !address) {
            return res.status(400).json({ message: "Email, products, and address are required." });
        }

        // Retrieve the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const userId = user._id;

        // Create orders for each product
        const orders = await Promise.all(
            products.map(async (product) => {
                const newOrder = new Order({
                    userId,
                    products: [
                        {
                            productId: product.productId,
                            quantity: product.quantity,
                        },
                    ],
                    totalAmount: product.price * product.quantity,
                    deliveryAddress: address,
                });

                return await newOrder.save();
            })
        );

        res.status(201).json({
            message: "Order placed successfully.",
            orders,
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

module.exports = router;