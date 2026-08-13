import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaEye,
} from "react-icons/fa";
import Navbar from "../component/navbar";

const API_URL = "https://e-comm-4-39jg.onrender.com/api";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(null);
  const [cartLoading, setCartLoading] = useState(null);

  // ==========================================
  // GET ALL PRODUCTS
  // ==========================================
  const getProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/product/all`
      );

      console.log("Product Response:", response.data);

      if (response.data.success) {
        const productData =
          response.data.products ||
          response.data.data ||
          [];

        setProducts(
          Array.isArray(productData)
            ? productData
            : []
        );
      } else {
        toast.error(
          response.data.message ||
            "Unable to load products"
        );
      }
    } catch (error) {
      console.error("Get Products Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET WISHLIST
  // ==========================================
  const getWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/wishlist/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Wishlist Response:",
        response.data
      );

      if (response.data.success) {
        let wishlistData =
          response.data.wishlist ||
          response.data.data ||
          response.data.products ||
          [];

        // Backend:
        // wishlist: { products: [...] }
        if (
          wishlistData &&
          !Array.isArray(wishlistData) &&
          Array.isArray(wishlistData.products)
        ) {
          wishlistData = wishlistData.products;
        }

        setWishlist(
          Array.isArray(wishlistData)
            ? wishlistData
            : []
        );
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error(
        "Get Wishlist Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setWishlist([]);

        toast.error(
          "Session expired. Please login again"
        );

        navigate("/login");
      }
    }
  };

  // ==========================================
  // CHECK PRODUCT IN WISHLIST
  // ==========================================
  const isInWishlist = (productId) => {
    return wishlist.some((item) => {
      const id =
        item?.product?._id ||
        item?.product ||
        item?._id;

      return (
        id?.toString() ===
        productId?.toString()
      );
    });
  };

  // ==========================================
  // ADD / REMOVE WISHLIST
  // ==========================================
  const toggleWishlist = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!product?._id) {
      toast.error("Product ID missing");
      return;
    }

    try {
      setWishlistLoading(product._id);

      const alreadyAdded = isInWishlist(
        product._id
      );

      // ========================================
      // REMOVE WISHLIST
      // ========================================
      if (alreadyAdded) {
        const response = await axios.delete(
          `${API_URL}/wishlist/delete/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Remove Wishlist Response:",
          response.data
        );

        if (response.data.success) {
          setWishlist((prev) =>
            prev.filter((item) => {
              const id =
                item?.product?._id ||
                item?.product ||
                item?._id;

              return (
                id?.toString() !==
                product._id.toString()
              );
            })
          );

          toast.success(
            response.data.message ||
              "Removed from wishlist"
          );
        } else {
          toast.error(
            response.data.message ||
              "Unable to remove from wishlist"
          );
        }
      }

      // ========================================
      // ADD WISHLIST
      // ========================================
      else {
        const response = await axios.post(
          `${API_URL}/wishlist/create`,
          {
            productId: product._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Add Wishlist Response:",
          response.data
        );

        if (response.data.success) {
          await getWishlist();

          toast.success(
            response.data.message ||
              "Added to wishlist"
          );
        } else {
          toast.error(
            response.data.message ||
              "Unable to add to wishlist"
          );
        }
      }
    } catch (error) {
      console.error(
        "Wishlist Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error(
          "Session expired. Please login again"
        );

        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Wishlist operation failed"
      );
    } finally {
      setWishlistLoading(null);
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================
  const addToCart = async (product) => {
    const token = localStorage.getItem("token");

    // Login check
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    // Product ID check
    if (!product?._id) {
      toast.error("Product ID missing");
      return;
    }

    // Stock check
    if (Number(product.stock) <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      setCartLoading(product._id);

      const response = await axios.post(
        `${API_URL}/cart/create`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Cart Response:",
        response.data
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Product added to cart"
        );

        // ====================================
        // IMPORTANT
        // Add to cart ke baad Cart page
        // ====================================
        navigate("/cart");
      } else {
        toast.error(
          response.data.message ||
            "Unable to add to cart"
        );
      }
    } catch (error) {
      console.error(
        "Add Cart Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error(
          "Please login again"
        );

        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to add product to cart"
      );
    } finally {
      setCartLoading(null);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================
  useEffect(() => {
    const loadData = async () => {
      await getProducts();
      await getWishlist();
    };

    loadData();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">

          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>

          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
            Loading Products...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 dark:bg-gray-900">
      <Navbar />

      <div className="mx-auto max-w-7xl">

        {/* ======================================
            HEADER
        ====================================== */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              All Products
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Discover our latest products
            </p>
          </div>

          {/* WISHLIST BUTTON */}
          <button
            onClick={() =>
              navigate("/wishlist")
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            <FaHeart />

            Wishlist

            <span className="rounded-full bg-white px-2 py-0.5 text-sm text-red-500">
              {wishlist.length}
            </span>
          </button>

        </div>

        {/* ======================================
            NO PRODUCTS
        ====================================== */}
        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow dark:bg-gray-800">

            <div className="mb-5 text-6xl">
              🛍️
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              No Products Found
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Products will appear here once
              they are added.
            </p>

          </div>
        ) : (

          /* ====================================
             PRODUCT GRID
          ==================================== */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map((product) => {

              const liked = isInWishlist(
                product._id
              );

              const image =
                Array.isArray(product.image)
                  ? product.image[0]
                  : product.image;

              return (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
                >

                  {/* =================================
                      IMAGE
                  ================================= */}
                  <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">

                    <img
                      src={
                        image ||
                        "/placeholder.jpg"
                      }
                      alt={
                        product.name ||
                        "Product"
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/placeholder.jpg";
                      }}
                    />

                    {/* WISHLIST ICON */}
                    <button
                      onClick={() =>
                        toggleWishlist(product)
                      }
                      disabled={
                        wishlistLoading ===
                        product._id
                      }
                      className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                      title={
                        liked
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >

                      {wishlistLoading ===
                      product._id ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                      ) : liked ? (
                        <FaHeart className="text-xl text-red-500" />
                      ) : (
                        <FaRegHeart className="text-xl text-gray-600" />
                      )}

                    </button>

                    {/* OUT OF STOCK */}
                    {Number(product.stock) <=
                      0 && (
                      <div className="absolute left-4 top-4 rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white">
                        Out of Stock
                      </div>
                    )}

                  </div>

                  {/* =================================
                      CONTENT
                  ================================= */}
                  <div className="p-5">

                    {/* BRAND */}
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                      {product.brand ||
                        "Brand"}
                    </p>

                    {/* NAME */}
                    <h2 className="line-clamp-2 min-h-[56px] text-lg font-bold text-gray-900 dark:text-white">
                      {product.name ||
                        "Product Name"}
                    </h2>

                    {/* DESCRIPTION */}
                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                        {product.description}
                      </p>
                    )}

                    {/* PRICE + STOCK */}
                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-2xl font-bold text-green-600">
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Stock:{" "}
                        {product.stock ?? 0}
                      </span>

                    </div>

                    {/* =================================
                        VIEW + CART
                    ================================= */}
                    <div className="mt-5 grid grid-cols-2 gap-3">

                      {/* VIEW */}
                      <button
                        onClick={() =>
                          navigate(
                            `/product/${product._id}`
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-600 dark:border-gray-600 dark:text-gray-200"
                      >
                        <FaEye />
                        View
                      </button>

                      {/* ADD CART */}
                      <button
                        onClick={() =>
                          addToCart(product)
                        }
                        disabled={
                          Number(product.stock) <=
                            0 ||
                          cartLoading ===
                            product._id
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                      >

                        {cartLoading ===
                        product._id ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <FaShoppingCart />
                            Cart
                          </>
                        )}

                      </button>

                    </div>

                    {/* =================================
                        WISHLIST BUTTON
                    ================================= */}
                    <button
                      onClick={() =>
                        toggleWishlist(product)
                      }
                      disabled={
                        wishlistLoading ===
                        product._id
                      }
                      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-3 font-semibold transition ${
                        liked
                          ? "border-red-500 text-red-500 hover:bg-red-50"
                          : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 dark:border-gray-600 dark:text-gray-300"
                      }`}
                    >

                      {liked ? (
                        <>
                          <FaHeart />
                          Remove Wishlist
                        </>
                      ) : (
                        <>
                          <FaRegHeart />
                          Add Wishlist
                        </>
                      )}

                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Products;