import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
    const [cart, setCart] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Retrieve cart and selected address from location state
        if (location.state) {
            const { cartItems, address } = location.state;
            setCart(cartItems || []);
            setSelectedAddress(address || "");
            calculateTotal(cartItems || []);
        }
    }, [location.state]);

    const calculateTotal = (cartItems) => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const handlePlaceOrder = () => {
        alert("Order placed successfully!");
        navigate("/"); // Redirect to homepage or order success page
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <h2 className="text-3xl font-bold text-center my-6">Order Confirmation</h2>
            <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Products:</h3>
                {cart.length === 0 ? (
                    <p className="text-gray-400">No products in the cart.</p>
                ) : (
                    <ul className="space-y-4">
                        {cart.map((item) => (
                            <li key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-4">
                                <div>
                                    <p className="text-lg font-medium">{item.name}</p>
                                    <p className="text-gray-400">Quantity: {item.quantity}</p>
                                </div>
                                <p className="text-green-400 font-medium">₹{item.price * item.quantity}</p>
                            </li>
                        ))}
                    </ul>
                )}

                <h3 className="text-xl font-semibold mt-6 mb-4">Delivery Address:</h3>
                <p className="text-gray-400">{selectedAddress || "No address selected."}</p>

                <h3 className="text-xl font-semibold mt-6 mb-4">Total Price:</h3>
                <p className="text-green-400 font-medium text-lg">₹{totalPrice}</p>

                <div className="text-center mt-6">
                    <button
                        onClick={handlePlaceOrder}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;