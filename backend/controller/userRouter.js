const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
require('dotenv').config();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });


// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Received signup request:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ❌ Do NOT hash the password here. Let Mongoose handle it.
    const newUser = new User({
      name,
      email,
      password  // ✅ Directly assign the password, Mongoose will hash it
    });

    await newUser.save();
    console.log("✅ User saved successfully:", newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // ✅ Select password explicitly since it's set to "select: false"
    const user = await User.findOne({ email }).select("+password");

    console.log("Found user in DB:", user);  // ✅ This should now include password
    console.log("Stored password in DB:", user?.password);  // ✅ Check if password is present

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Use comparePassword method to verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY || "fallback_secret"
    );

    console.log("Generated Token:", token);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { userId: user._id, name: user.name }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/send-user-data', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const message = `
      Name: ${user.name}
      Email: ${user.email}
      Addresses: ${user.addresses.join(', ')}
    `;

    await sendEmail({
      email: user.email,
      subject: 'Your User Data',
      message,
    });

    res.status(200).json({ message: 'User data sent successfully' });
  } catch (error) {
    console.error('Error sending user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Add this route to the existing userRouter
router.put('/update-profile', async (req, res) => {
  const { name, email, phone, avatar, addresses } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, phone, avatar, addresses },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint for uploading avatar
router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});


module.exports = router;