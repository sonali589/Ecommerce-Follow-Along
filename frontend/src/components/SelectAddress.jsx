import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const SelectAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [cart, setCart] = useState([]); // State to store cart details
    const navigate = useNavigate();

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    console.error("User is not logged in or user object is missing.");
                    return;
                }

                const user = JSON.parse(storedUser);
                console.log("User object:", user); // Check the entire user object
                console.log("User Email:", user.email); // Ensure email is available

                if (!user.email) {
                    console.error("Email is missing from the user object.");
                    return;
                }

                const response = await axios.get("http://localhost:8000/user/addresses", {
                    params: { email: user.email },
                });

                setAddresses(response.data.addresses || []);
            } catch (error) {
                console.error("Error fetching addresses:", error);
            }
        };

        fetchAddresses();
    }, []);

    // Fetch cart details
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    console.error("User is not logged in or user object is missing.");
                    return;
                }

                const user = JSON.parse(storedUser);
                console.log("Fetching cart for userId:", user.userId);

                if (!user.userId) {
                    console.error("User ID is missing from the user object.");
                    return;
                }

                const response = await axios.get("http://localhost:8000/cart", {
                    params: { userId: user.userId },
                });

                console.log("Cart response:", response.data);
                setCart(response.data.cart || []);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCart();
    }, []);

    // Log the addresses and cart state to ensure they're set correctly
    useEffect(() => {
        console.log("Addresses in state:", addresses);
    }, [addresses]);

    useEffect(() => {
        console.log("Cart in state:", cart);
    }, [cart]);

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
    };

    const handleConfirmOrder = () => {
        if (!selectedAddress) {
            alert("Please select an address.");
            return;
        }

        navigate("/order-confirmation", {
            state: {
                cartItems: cart, // Pass the cart items
                address: selectedAddress, // Pass the selected address
            },
        });
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Navbar />
            <div className="container mx-auto mt-16 p-6">
                <h2 className="text-3xl font-bold text-center mb-6">Select Delivery Address</h2>
                {addresses.length === 0 ? (
                    <p className="text-center text-gray-400">No addresses found. Please add one in your profile.</p>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address, index) => (
                            <div
                                key={index} // Replace with unique key if possible (e.g., address id)
                                className={`p-4 border rounded-lg cursor-pointer ${
                                    selectedAddress === address ? "border-green-500 bg-gray-800" : "border-gray-700"
                                }`}
                                onClick={() => handleSelectAddress(address)}
                            >
                                {address}
                            </div>
                        ))}
                    </div>
                )}
                <div className="text-center mt-6">
                    <button
                        onClick={handleConfirmOrder}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectAddress;