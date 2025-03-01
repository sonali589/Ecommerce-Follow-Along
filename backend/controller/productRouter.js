const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const authenticate = require("../middleware/auth");
const upload = require("../multer");  // Ensure correct path to your multer.js file

// Route to add a new product
router.post("/add", authenticate, upload.array("images", 5), async (req, res) => {
    try {
        console.log("🔹 Checking req.user:", req.user); // 🛠 Debugging line

        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized! User not authenticated." });
        }

        const { name, price } = req.body;
        const userId = req.user._id; // Ensure userId is taken from authenticated user

        // Validate fields
        if (!name || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if files are uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload images." });
        }

        // Collect the file names from the uploaded files
        const imagePaths = req.files.map(file => file.filename);

        // Create a new product
        const product = new Product({
            name,
            price,
            images: imagePaths,
            userId,
        });

        // Save the product to the database
        await product.save();
        res.status(201).json({ message: "Product added successfully!", product });

    } catch (error) {
        console.error("❌ Error adding product:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Route to get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;