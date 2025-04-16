import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user?.email;

        if (!userEmail) {
          setError("User email not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/order/get-orders`, {
          params: { email: userEmail },
        });

        setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTrackShipment = () => {
    alert("Tracking functionality is not available now.");
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCancelReturn = () => {
    alert("Cancel/Return functionality is available in the future.");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-400 text-center mb-6">My Orders</h1>

        {loading && <p className="text-center text-blue-400">Loading...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div>
            {orders.length === 0 ? (
              <p className="text-center text-gray-400 italic">No orders found.</p>
            ) : (
              <ul className="space-y-6">
                {orders.map((order) => (
                  <li
                    key={order._id}
                    className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 relative"
                  >
                    {/* Product Count Display */}
                    <div className="absolute top-2 right-2 bg-gray-700 text-sm text-white px-2 py-1 rounded-md">
                      {order.products.length} {order.products.length === 1 ? "Item" : "Items"}
                    </div>

                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                    <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                    <p><strong>Status:</strong> {order.status}</p>

                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={handleTrackShipment}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                      >
                        Track Shipment
                      </button>

                      <button
                        onClick={() => handleViewProduct(order.products[0]?.productId)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      >
                        View Product
                      </button>

                      <button
                        onClick={handleCancelReturn}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Cancel/Return
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;