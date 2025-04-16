import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "./card";

const Product = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/products");
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleAddToCart = async (product) => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("Please login first.");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            const userId = parsedUser?.userId;

            if (!userId) {
                alert("Session expired. Please login again.");
                return;
            }

            const cartItem = {
                userId,
                productId: product._id,
                quantity: 1,
                price: product.price,
                name: product.name,
                image: product.images?.[0] || "",
            };

            console.log("🛒 Sending Add to Cart Request:", cartItem);

            const response = await axios.post("http://localhost:8000/cart/add-cart", cartItem);

            console.log("✅ Add to cart response:", response.data);
            alert(`${product.name} added to cart!`);
        } catch (error) {
            console.error("🚨 Error adding to cart:", error.response?.data || error.message);
            alert(`Failed to add product to cart. ${error.response?.data?.message || ""}`);
        }
    };

    const handleEditProduct = (productId) => {
        console.log(`Editing product with ID: ${productId}`);
        // Navigate to the edit product page
        navigate(`/edit-product/${productId}`);
    };

    const handleDeleteProduct = async (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            console.log(`Deleting product with ID: ${productId}`);
            const response = await axios.delete(`http://localhost:8000/products/${productId}`);
            console.log("✅ Delete response:", response.data);

            // Remove the deleted product from the state
            setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
            alert("Product deleted successfully!");
        } catch (error) {
            console.error("🚨 Error deleting product:", error.response?.data || error.message);
            alert(`Failed to delete product. ${error.response?.data?.message || ""}`);
        }
    };

    return (
        <div className="flex justify-center items-center w-full">
            <div className="min-h-screen w-full bg-[#13234f] flex flex-col items-center p-5">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-10">
                    Our Products
                </h1>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                    {products.map((product) => (
                        <Card
                            key={product._id}
                            id={product._id}
                            name={product.name}
                            price={product.price}
                            image={`http://localhost:8000/uploads/${product.images?.[0]}`}
                            onAddToCart={() => handleAddToCart(product)}
                            onEdit={() => handleEditProduct(product._id)}
                            onDelete={() => handleDeleteProduct(product._id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Product;