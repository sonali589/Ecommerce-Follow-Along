import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';

const ProductForm = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: "",
        price: "",
        images: [],
        imagePreviews: [],
    });

    const handleInputChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imagePreviews = files.map((file) => URL.createObjectURL(file));

        setProductData({
            ...productData,
            images: files,
            imagePreviews,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("price", productData.price);
        productData.images.forEach((image) => formData.append("images", image));

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("❌ No token found in localStorage!");
                alert("You must be logged in to add a product.");
                return;
            }

            console.log("🔹 Sending token:", token);

            await axios.post("http://localhost:8000/products/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });

            alert("✅ Product added successfully!");
            navigate("/");
        } catch (error) {
            console.error("❌ Error adding product:", error.response ? error.response.data : error.message);
            alert("Failed to add product. Make sure you're logged in!");
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Navbar />
            <div className="flex items-center justify-center mt-16 p-4">
                <div className="p-6 max-w-lg w-full bg-gray-800 rounded-lg shadow-xl">
                    <h2 className="text-3xl font-semibold mb-6 text-center">Add New Product</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Product Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={productData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Price (₹):</label>
                            <input
                                type="number"
                                name="price"
                                value={productData.price}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {productData.imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {productData.imagePreviews.map((src, index) => (
                                    <img key={index} src={src} alt={`preview-${index}`} className="w-full h-24 object-cover rounded-lg border border-gray-600" />
                                ))}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Upload Images:</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg shadow-md font-semibold text-lg transition duration-300 hover:from-blue-700 hover:to-purple-700"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
