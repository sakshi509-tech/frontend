import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Navbar from "../component/navbar";

const API_URL = "https://e-comm-4-39jg.onrender.com/api";

function Wishlist() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [cartLoadingId, setCartLoadingId] = useState(null);

  // ================================
  // TOKEN
  // ================================
  const token = localStorage.getItem("token");

  // ================================
  // GET WISHLIST
  // ================================
  const getWishlist = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

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

      const data = response.data;

      if (data.success) {
        /*
          Backend response different formats
          ko handle kar rahe hain.
        */

        let wishlistProducts = [];

        if (Array.isArray(data.products)) {
          wishlistProducts = data.products;
        } else if (
          Array.isArray(data.wishlist)
        ) {
          wishlistProducts = data.wishlist;
        } else if (
          Array.isArray(data.data)
        ) {
          wishlistProducts = data.data;
        } else if (
          data.wishlist?.products &&
          Array.isArray(data.wishlist.products)
        ) {
          wishlistProducts =
            data.wishlist.products;
        } else if (
          data.data?.products &&
          Array.isArray(data.data.products)
        ) {
          wishlistProducts =
            data.data.products;
        }

        setProducts(wishlistProducts);
      } else {
        setProducts([]);

        toast.error(
          data.message ||
            "Unable To Load Wishlist"
        );
      }
    } catch (error) {
      console.error(
        "Wishlist Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Please Login Again");

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable To Load Wishlist"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // REMOVE WISHLIST
  // ================================
  const removeWishlist = async (
    productId
  ) => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!productId) {
      toast.error("Product ID Not Found");
      return;
    }

    try {
      setRemovingId(productId);

      const response = await axios.delete(
        `${API_URL}/wishlist/delete/${productId}`,
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

      const data = response.data;

      if (data.success) {
        setProducts((prev) =>
          prev.filter(
            (product) =>
              product?._id?.toString() !==
              productId?.toString()
          )
        );

        toast.success(
          data.message ||
            "Removed From Wishlist"
        );
      } else {
        toast.error(
          data.message ||
            "Unable To Remove"
        );
      }
    } catch (error) {
      console.error(
        "Remove Wishlist Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable To Remove"
      );
    } finally {
      setRemovingId(null);
    }
  };

  // ================================
  // ADD TO CART
  // ================================
  const addToCart = async (product) => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!product?._id) {
      toast.error("Product ID Not Found");
      return;
    }

    if (
      product.stock !== undefined &&
      Number(product.stock) <= 0
    ) {
      toast.error("Product Out Of Stock");
      return;
    }

    try {
      setCartLoadingId(product._id);

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
        "Add Cart Response:",
        response.data
      );

      const data = response.data;

      if (data.success) {
        toast.success(
          data.message ||
            "Added To Cart"
        );
      } else {
        toast.error(
          data.message ||
            "Unable To Add To Cart"
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

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable To Add To Cart"
      );
    } finally {
      setCartLoadingId(null);
    }
  };

  // ================================
  // LOAD WISHLIST
  // ================================
  useEffect(() => {
    getWishlist();
  }, []);

  // ================================
  // LOADING
  // ================================
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">

            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-gray-300 border-t-green-600"></div>

            <h1 className="mt-5 text-2xl font-bold text-green-600">
              Loading Wishlist...
            </h1>

          </div>
        </div>
      </>
    );
  }

  // ================================
  // LOGIN REQUIRED
  // ================================
  if (!token) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-5 dark:bg-gray-900">

          <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl dark:bg-gray-800">

            <FaHeart className="mx-auto text-7xl text-red-500" />

            <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Please Login
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Login to view your wishlist.
            </p>

            <button
              onClick={() =>
                navigate("/login")
              }
              className="mt-7 rounded-xl bg-green-600 px-8 py-3 font-bold text-white transition hover:bg-green-700"
            >
              Login
            </button>

          </div>

        </div>
      </>
    );
  }

  // ================================
  // MAIN UI
  // ================================
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-5 py-10 dark:bg-gray-900">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
          <div className="mb-10 flex flex-col items-center justify-between gap-5 sm:flex-row">

            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                <FaHeart className="text-red-500" />
                My Wishlist
              </h1>

              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {products.length}{" "}
                {products.length === 1
                  ? "product"
                  : "products"}{" "}
                in your wishlist
              </p>
            </div>

            <Link
              to="/products"
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>

          </div>

          {/* EMPTY WISHLIST */}
          {products.length === 0 ? (
            <div className="rounded-3xl bg-white px-5 py-16 text-center shadow-lg dark:bg-gray-800">

              <FaHeart className="mx-auto text-8xl text-gray-300 dark:text-gray-600" />

              <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                Wishlist Is Empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-gray-500 dark:text-gray-400">
                You haven't added any products to
                your wishlist yet.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-block rounded-xl bg-green-600 px-8 py-3 font-bold text-white transition hover:bg-green-700"
              >
                Browse Products
              </Link>

            </div>
          ) : (

            /* PRODUCTS */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

              {products.map((product) => {

                const productId =
                  product?._id;

                // ================================
                // IMAGE
                // ================================
                let image = "";

                if (
                  Array.isArray(
                    product?.image
                  )
                ) {
                  image =
                    product.image[0] || "";
                } else {
                  image =
                    product?.image || "";
                }

                // ================================
                // PRICE
                // ================================
                const originalPrice =
                  Number(
                    product?.price || 0
                  );

                const discountPrice =
                  Number(
                    product?.discountPrice || 0
                  );

                const finalPrice =
                  discountPrice > 0
                    ? discountPrice
                    : originalPrice;

                // ================================
                // STOCK
                // ================================
                const outOfStock =
                  product?.stock !==
                    undefined &&
                  Number(product.stock) <=
                    0;

                return (
                  <div
                    key={productId}
                    className="group overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-800"
                  >

                    {/* IMAGE */}
                    <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">

                      <Link
                        to={`/product/${productId}`}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={
                              product?.name ||
                              "Product"
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-7xl">
                            🛍️
                          </div>
                        )}
                      </Link>

                      {/* REMOVE ICON */}
                      <button
                        type="button"
                        onClick={() =>
                          removeWishlist(
                            productId
                          )
                        }
                        disabled={
                          removingId ===
                          productId
                        }
                        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-500 shadow-lg transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        {removingId ===
                        productId ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                        ) : (
                          <FaTrash />
                        )}
                      </button>

                      {/* STOCK BADGE */}
                      {outOfStock && (
                        <div className="absolute bottom-3 left-3 rounded-lg bg-red-500 px-3 py-1 text-sm font-bold text-white">
                          Out Of Stock
                        </div>
                      )}

                      {/* DISCOUNT */}
                      {discountPrice > 0 &&
                        discountPrice <
                          originalPrice && (
                          <div className="absolute left-3 top-3 rounded-lg bg-green-600 px-3 py-1 text-sm font-bold text-white">
                            {Math.round(
                              ((originalPrice -
                                discountPrice) /
                                originalPrice) *
                                100
                            )}
                            % OFF
                          </div>
                        )}

                    </div>

                    {/* CONTENT */}
                    <div className="p-5">

                      {/* NAME */}
                      <Link
                        to={`/product/${productId}`}
                      >
                        <h2 className="line-clamp-1 text-xl font-bold text-gray-900 transition hover:text-green-600 dark:text-white">
                          {product?.name ||
                            "Product Name"}
                        </h2>
                      </Link>

                      {/* DESCRIPTION */}
                      <p className="mt-2 line-clamp-2 min-h-[40px] text-sm text-gray-500 dark:text-gray-400">
                        {product?.description ||
                          "No description available"}
                      </p>

                      {/* PRICE */}
                      <div className="mt-4 flex items-center gap-3">

                        <span className="text-2xl font-bold text-green-600">
                          ₹
                          {finalPrice.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        {discountPrice >
                          0 &&
                          discountPrice <
                            originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹
                              {originalPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}

                      </div>

                      {/* STOCK */}
                      {!outOfStock &&
                        product?.stock !==
                          undefined && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {product.stock}{" "}
                            items available
                          </p>
                        )}

                      {/* REMOVE */}
                      <button
                        type="button"
                        onClick={() =>
                          removeWishlist(
                            productId
                          )
                        }
                        disabled={
                          removingId ===
                          productId
                        }
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-500 py-3 font-bold text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaTrash />

                        {removingId ===
                        productId
                          ? "Removing..."
                          : "Remove From Wishlist"}
                      </button>

                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Wishlist;