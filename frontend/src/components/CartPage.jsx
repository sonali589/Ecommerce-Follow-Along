import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser?.userId) {
                setUserId(parsedUser.userId);
            } else {
                console.warn("User object exists but userId is missing.");
            }
        } else {
            console.warn("User ID not found in localStorage.");
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchCart();
        }
    }, [userId]);

    const fetchCart = async () => {
        try {
            console.log(`Fetching cart for userId: ${userId}`);
            const response = await axios.get(`http://localhost:8000/cart`, {
                params: { userId },
            });

            console.log("Cart response:", response.data);
            setCart(response.data.cart || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const updateQuantity = async (productId, action) => {
        try {
            const response = await axios.put("http://localhost:8000/cart/update-quantity", {
                userId,
                productId,
                action,
            });
            setCart(response.data.cart);
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleCheckout = () => {
        alert("Proceeding to checkout!");
    };

    const handlePlaceOrder = () => {
        navigate("/select-address"); // Navigate to the Select Address page
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <h2 className="text-3xl font-bold text-center my-6 text-gray-100">Shopping Cart</h2>
            {cart.length === 0 ? (
                <p className="text-center text-gray-400">Your cart is empty.</p>
            ) : (
                <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b border-gray-700 py-4">
                            <div className="flex items-center space-x-4">
                                <div className="text-lg font-semibold text-gray-100">{item.name}</div>
                                <p className="text-green-400 font-medium">₹{item.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => updateQuantity(item.id, "decrease")}
                                    className="bg-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                                >
                                    -
                                </button>
                                <span className="text-white font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, "increase")}
                                    className="bg-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="text-center mt-6">
                        <button
                            onClick={handleCheckout}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Checkout
                        </button>
                        <button
                            onClick={handlePlaceOrder} // Add the Place Order button
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 ml-4"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;