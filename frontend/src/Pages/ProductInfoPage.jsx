import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

function ProductInfoPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
  }, [id]);

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id, quantity, name: product.name, price: product.price });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBuyNow = () => {
    console.log(`Buy now: ${quantity} of product ${id}`);
    alert('Buy now functionality not fully implemented.');
  };

  if (!product) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto mt-16 p-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 relative">
            {product.images && product.images.length > 0 && (
              <img
                src={`http://localhost:8000/uploads/${product.images[0]}`}
                alt={product.name}
                className="w-full rounded-lg shadow-md object-cover aspect-square"
              />
            )}
            <button
              onClick={handleLike}
              className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 p-2 rounded-full hover:bg-opacity-90 transition-opacity"
            >
              {liked ? (
                <AiFillHeart className="text-red-500 text-xl" />
              ) : (
                <AiOutlineHeart className="text-white text-xl" />
              )}
            </button>
          </div>
          <div className="md:w-1/2">
            <h1 className="text-4xl font-semibold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-green-400 mb-4">Price: ₹{product.price}</p>
            <p className="text-lg text-gray-300 mb-6">{product.description}</p>

            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="mr-4 text-lg">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="border rounded p-3 w-24 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInfoPage;