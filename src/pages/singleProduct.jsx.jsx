import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

import Navbar from "../component/navbar";

const API_URL = "https://e-comm-4-39jg.onrender.com/api";

function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const [liked, setLiked] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const token = localStorage.getItem("token");

  // =========================
  // GET PRODUCT
  // =========================
  const getProduct = async () => {
    if (!id) {
      toast.error("Product ID missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/product/single/${id}`
      );

      console.log("Product Response:", data);

      if (data.success) {
        setProduct(data.product || data.data);
      } else {
        toast.error(data.message || "Product not found");
      }
    } catch (error) {
      console.error("Product Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET WISHLIST
  // =========================
  const getWishlist = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(
        `${API_URL}/wishlist/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Wishlist Response:", data);

      if (data.success) {
        const wishlistProducts =
          data.wishlist?.products ||
          data.products ||
          data.data ||
          [];

        const exists = Array.isArray(wishlistProducts)
          ? wishlistProducts.some((item) => {
              const productId =
                item?._id ||
                item?.product?._id ||
                item?.product;

              return (
                productId?.toString() ===
                id?.toString()
              );
            })
          : false;

        setLiked(exists);
      }
    } catch (error) {
      console.error("Wishlist Error:", error);
    }
  };

  // =========================
  // WISHLIST
  // =========================
  const toggleWishlist = async () => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);

      if (liked) {
        const { data } = await axios.delete(
          `${API_URL}/wishlist/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setLiked(false);
          toast.success("Removed from wishlist");
        } else {
          toast.error(
            data.message || "Unable to remove"
          );
        }
      } else {
        const { data } = await axios.post(
          `${API_URL}/wishlist/create`,
          {
            productId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Wishlist Add Response:", data);

        if (data.success) {
          setLiked(true);
          toast.success("Added to wishlist");
        } else {
          toast.error(
            data.message || "Unable to add wishlist"
          );
        }
      }
    } catch (error) {
      console.error("Wishlist Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Please login again");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Wishlist operation failed"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = async () => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!product?._id) {
      toast.error("Product ID missing");
      return;
    }

    if (product.stock <= 0) {
      toast.error("Product out of stock");
      return;
    }

    if (quantity > product.stock) {
      toast.error(
        `Only ${product.stock} items available`
      );
      return;
    }

    try {
      setAdding(true);

      // IMPORTANT:
      // Your backend route is /cart/create
      const { data } = await axios.post(
        `${API_URL}/cart/create`,
        {
          productId: product._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Cart Response:", data);

      if (data.success) {
        toast.success(
          data.message || "Product added to cart"
        );

        // Cart page
        navigate("/cart");
      } else {
        toast.error(
          data.message || "Unable to add to cart"
        );
      }
    } catch (error) {
      console.error("Add Cart Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Please login again");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to add to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  // =========================
  // INCREASE
  // =========================
  const increaseQuantity = () => {
    if (!product) return;

    if (quantity >= product.stock) {
      toast.error(
        `Only ${product.stock} items available`
      );
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  // =========================
  // DECREASE
  // =========================
  const decreaseQuantity = () => {
    if (quantity <= 1) return;

    setQuantity((prev) => prev - 1);
  };

  // =========================
  // USE EFFECT
  // =========================
  useEffect(() => {
    getProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      getWishlist();
    }
  }, [product]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading Product...
            </p>
          </div>
        </div>
      </>
    );
  }

  // =========================
  // NOT FOUND
  // =========================
  if (!product) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500">
              Product Not Found
            </h1>

            <button
              onClick={() => navigate("/products")}
              className="mt-5 bg-green-600 text-white px-6 py-3 rounded-xl"
            >
              Back To Products
            </button>
          </div>
        </div>
      </>
    );
  }

  const image = Array.isArray(product.image)
    ? product.image[0]
    : product.image;

  const totalPrice =
    Number(product.price || 0) * quantity;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-5">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">

          <div className="grid md:grid-cols-2 gap-10">

            {/* ================= IMAGE ================= */}
            <div className="relative flex items-center justify-center">

              <img
                src={image || "/placeholder.jpg"}
                alt={product.name}
                className="w-full max-w-lg h-[450px] object-contain rounded-2xl"
              />

              {/* Wishlist */}
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className="absolute top-4 right-4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition"
              >
                {liked ? (
                  <FaHeart className="text-red-500 text-2xl" />
                ) : (
                  <FaRegHeart className="text-gray-600 text-2xl" />
                )}
              </button>
            </div>

            {/* ================= DETAILS ================= */}
            <div>

              <p className="text-sm text-green-600 font-semibold uppercase">
                {product.brand || "Brand"}
              </p>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                {product.name}
              </h1>

              <p className="text-gray-600 dark:text-gray-300 mt-6 leading-7">
                {product.description}
              </p>

              {/* PRICE */}
              <div className="mt-6">
                <span className="text-3xl font-bold text-green-600">
                  ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </span>
              </div>

              {/* STOCK */}
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Stock:{" "}
                <span className="font-semibold">
                  {product.stock}
                </span>
              </p>

              {/* ================= QUANTITY ================= */}
              <div className="mt-7">

                <p className="font-semibold text-gray-800 dark:text-white mb-3">
                  Select Quantity
                </p>

                <div className="flex items-center w-fit border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40"
                  >
                    <FaMinus />
                  </button>

                  <div className="w-20 h-14 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      quantity >= product.stock
                    }
                    className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40"
                  >
                    <FaPlus />
                  </button>

                </div>

              </div>

              {/* TOTAL */}
              <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-xl p-4">

                <div className="flex justify-between items-center">

                  <span className="font-semibold text-gray-800 dark:text-white">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-green-600">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>

                </div>

              </div>

              {/* ADD TO CART */}
              <button
                onClick={addToCart}
                disabled={
                  adding ||
                  product.stock <= 0
                }
                className="mt-8 w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg"
              >
                <FaShoppingCart />

                {adding
                  ? "Adding..."
                  : product.stock <= 0
                  ? "Out Of Stock"
                  : `Add ${quantity} To Cart`}
              </button>

              {/* WISHLIST */}
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className="mt-4 w-full flex items-center justify-center gap-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-4 rounded-xl font-bold"
              >
                {liked ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}

                {liked
                  ? "Remove From Wishlist"
                  : "Add To Wishlist"}
              </button>

              {/* CONTINUE */}
              <button
                onClick={() => navigate("/products")}
                className="mt-4 w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold"
              >
                ← Continue Shopping
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;