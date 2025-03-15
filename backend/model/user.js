const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
    unique: true, // Ensure email uniqueness
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address!",
    ], // Email validation regex
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false, // Don't select password by default in queries
  },
  phoneNumber: {
    type: Number,
    required: false, // Optional field
  },
  addresses: [
    {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      address1: {
        type: String,
        required: true,
      },
      address2: {
        type: String,
        required: false, // Optional field
      },
      zipCode: {
        type: Number,
        required: true,
      },
      addressType: {
        type: String,
        enum: ["Home", "Work", "Other"], // Limiting address types
        required: true,
      },
    },
  ],
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "moderator"], // Specify valid roles
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordTime: {
    type: Date,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to get JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if model exists before creating it
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;