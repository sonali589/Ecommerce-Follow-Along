const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Import the User model
const User = require("../model/user");

// Add product to the cart
router.post("/add-cart", async (req, res) => {
  const { userId, productId, quantity, price, name, image } = req.body;

  // Ensure all necessary fields are provided
  if (!userId || !productId || !quantity || !price || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate MongoDB ObjectIds
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  try {
    // Find the user using a valid ObjectId
    const user = await User.findById(userId);
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingProductIndex !== -1) {
      // If the product already exists, increase the quantity
      user.cart[existingProductIndex].quantity += quantity;

      // Ensure quantity is updated properly (optional check for positive numbers)
      if (user.cart[existingProductIndex].quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than zero" });
      }
    } else {
      // If the product doesn't exist, add a new product to the cart
      user.cart.push({
        productId: mongoose.Types.ObjectId(productId),
        quantity,
        price,
        name,
        image, // Optional field
      });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch products in the user's cart
router.get("/cart", async (req, res) => {
  const { email } = req.query; // Get email from query params

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's cart
    res.status(200).json({
      message: "Cart fetched successfully",
      cart: user.cart, // Send the cart products
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update quantity of an item in the cart
router.put("/update-cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Ensure required fields are provided
  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate MongoDB ObjectIds
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  try {
    // Find the user using a valid ObjectId
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product in the user's cart
    const productIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the quantity of the product in the cart
    user.cart[productIndex].quantity = quantity;

    // Ensure quantity is updated properly (optional check for positive numbers)
    if (user.cart[productIndex].quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than zero" });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove product from the cart
router.delete("/remove-cart", async (req, res) => {
  const { userId, productId } = req.body;

  // Ensure required fields are provided
  if (!userId || !productId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate MongoDB ObjectIds
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  try {
    // Find the user using a valid ObjectId
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product in the user's cart
    const productIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    user.cart.splice(productIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;