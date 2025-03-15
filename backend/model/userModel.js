const mongoose = require("mongoose");

// Define the cart item schema
const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String }  // Optional: For storing product image URL
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: { type: [cartItemSchema], default: [] }  // Embed the cart items array
});

// Safely define the User model, ensuring it isn't overwritten
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;