const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../model/userModel");

// ✅ Add product to the cart
router.post("/add-cart", async (req, res) => {
    try {
        const { userId, productId, quantity, price, name, image } = req.body;

        if (!userId || !productId || !quantity || !price || !name) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const objectIdProductId = new mongoose.Types.ObjectId(productId);

        const existingProductIndex = user.cart.findIndex(
            (item) => item.productId.toString() === objectIdProductId.toString()
        );

        if (existingProductIndex !== -1) {
            user.cart[existingProductIndex].quantity += quantity;
        } else {
            user.cart.push({
                productId: objectIdProductId,
                quantity,
                price,
                name,
                image,
            });
        }

        // ✅ Explicitly update only the cart field
        await User.updateOne(
            { _id: userId },
            { $set: { cart: user.cart } }
        );

        res.status(200).json({ message: "Item added to cart successfully", cart: user.cart });
    } catch (error) {
        console.error("🚨 Server Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
// ✅ Get Cart Items
router.get("/", async (req, res) => {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ cart: user.cart || [] }); // ✅ Ensure cart is always an array
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Update quantity
router.put("/update-quantity", async (req, res) => {
    const { userId, productId, action } = req.body;

    if (!userId || !productId || !action) return res.status(400).json({ message: "Missing required fields" });

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const productIndex = user.cart.findIndex(item => item.productId.toString() === productId.toString());

        if (productIndex === -1) return res.status(404).json({ message: "Product not found in cart" });

        if (action === "increase") {
            user.cart[productIndex].quantity += 1;
        } else if (action === "decrease" && user.cart[productIndex].quantity > 1) {
            user.cart[productIndex].quantity -= 1;
        } else {
            return res.status(400).json({ message: "Quantity cannot be less than 1" });
        }

        await user.save();
        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Remove from cart
router.delete("/remove-cart", async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) return res.status(400).json({ message: "Missing required fields" });

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.cart = user.cart.filter(item => item.productId.toString() !== productId.toString());

        await user.save();
        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;