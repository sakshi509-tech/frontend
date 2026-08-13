import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";
import Navbar from "../component/navbar";

const API_URL = "https://e-comm-4-39jg.onrender.com/api";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const token = localStorage.getItem("token");

  // ==========================================
  // GET CART
  // ==========================================
  const getCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/cart/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Cart Response:", data);

      if (data.success) {
        const cartProducts =
          data.cart?.products ||
          data.products ||
          data.data ||
          [];

        setCart(
          Array.isArray(cartProducts)
            ? cartProducts
            : []
        );
      } else {
        setCart([]);

        toast.error(
          data.message || "Unable to load cart"
        );
      }
    } catch (error) {
      console.error("Get Cart Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Please login again");

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================
  const updateQuantity = async (
    productId,
    newQuantity
  ) => {
    if (!productId) {
      toast.error("Product ID missing");
      return;
    }

    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdating(productId);

      const { data } = await axios.put(
        `${API_URL}/cart/update/${productId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update Cart Response:", data);

      if (data.success) {
        // Directly update frontend
        const updatedProducts =
          data.cart?.products;

        if (Array.isArray(updatedProducts)) {
          setCart(updatedProducts);
        } else {
          await getCart();
        }
      } else {
        toast.error(
          data.message ||
            "Unable to update quantity"
        );
      }
    } catch (error) {
      console.error(
        "Update Cart Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Please login again");

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to update quantity"
      );
    } finally {
      setUpdating(null);
    }
  };

  // ==========================================
  // REMOVE PRODUCT
  // ==========================================
  const removeProduct = async (productId) => {
    if (!productId) {
      toast.error("Product ID missing");
      return;
    }

    try {
      setUpdating(productId);

      /*
        IMPORTANT:
        Backend route is:

        DELETE /cart/remove/:productId

        NOT:

        /cart/delete/:productId
      */

      const { data } = await axios.delete(
        `${API_URL}/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Remove Cart Response:",
        data
      );

      if (data.success) {
        const updatedProducts =
          data.cart?.products;

        if (Array.isArray(updatedProducts)) {
          setCart(updatedProducts);
        } else {
          setCart((prev) =>
            prev.filter((item) => {
              const product =
                item.product || item;

              return (
                product?._id?.toString() !==
                productId.toString()
              );
            })
          );
        }

        toast.success(
          data.message ||
            "Product removed from cart"
        );
      } else {
        toast.error(
          data.message ||
            "Unable to remove product"
        );
      }
    } catch (error) {
      console.error(
        "Remove Cart Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Please login again");

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to remove product"
      );
    } finally {
      setUpdating(null);
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================
  const clearCart = async () => {
    try {
      setUpdating("clear");

      const { data } = await axios.delete(
        `${API_URL}/cart/clear`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Clear Cart Response:",
        data
      );

      if (data.success) {
        setCart([]);

        toast.success(
          data.message ||
            "Cart cleared successfully"
        );
      } else {
        toast.error(
          data.message ||
            "Unable to clear cart"
        );
      }
    } catch (error) {
      console.error(
        "Clear Cart Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Please login again");

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to clear cart"
      );
    } finally {
      setUpdating(null);
    }
  };

  // ==========================================
  // LOAD CART
  // ==========================================
  useEffect(() => {
    getCart();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
              Loading Cart...
            </p>
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // LOGIN
  // ==========================================
  if (!token) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-5">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 text-center">
            <FaShoppingCart className="mx-auto text-6xl text-green-600" />

            <h1 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
              Please Login
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Login to view your cart
            </p>

            <button
              onClick={() =>
                navigate("/login")
              }
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl font-semibold"
            >
              Login
            </button>
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================
  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-5">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center">
            <FaShoppingCart className="mx-auto text-7xl text-gray-300" />

            <h1 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
              Your Cart Is Empty
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Add some products to your cart.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl font-semibold"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // TOTAL
  // ==========================================
  const total = cart.reduce(
    (sum, item) => {
      const product =
        item.product || item;

      const quantity =
        Number(item.quantity) || 1;

      const price =
        Number(product?.price) || 0;

      return (
        sum + price * quantity
      );
    },
    0
  );

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-5">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              <FaShoppingCart className="inline mr-3 text-green-600" />

              My Cart
            </h1>

            <button
              onClick={clearCart}
              disabled={updating === "clear"}
              className="flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-5 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              <FaTrash />

              {updating === "clear"
                ? "Clearing..."
                : "Clear Cart"}
            </button>

          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* =================================
                CART PRODUCTS
            ================================= */}
            <div className="lg:col-span-2 space-y-5">

              {cart.map((item) => {

                const product =
                  item.product || item;

                const productId =
                  product?._id;

                const quantity =
                  Number(item.quantity) || 1;

                const image =
                  Array.isArray(
                    product?.image
                  )
                    ? product.image[0]
                    : product?.image;

                const itemTotal =
                  Number(product?.price || 0) *
                  quantity;

                return (
                  <div
                    key={productId}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5"
                  >

                    <div className="flex flex-col sm:flex-row gap-5">

                      {/* IMAGE */}
                      <Link
                        to={`/product/${productId}`}
                        className="shrink-0"
                      >
                        <img
                          src={
                            image ||
                            "/placeholder.jpg"
                          }
                          alt={
                            product?.name ||
                            "Product"
                          }
                          className="w-full sm:w-40 h-40 object-contain rounded-xl bg-gray-100 dark:bg-gray-700"
                        />
                      </Link>

                      {/* DETAILS */}
                      <div className="flex-1">

                        <Link
                          to={`/product/${productId}`}
                        >
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white hover:text-green-600">
                            {product?.name ||
                              "Product"}
                          </h2>
                        </Link>

                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                          {product?.brand ||
                            "Brand"}
                        </p>

                        <p className="text-2xl font-bold text-green-600 mt-3">
                          ₹
                          {Number(
                            product?.price ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        {/* QUANTITY */}
                        <div className="mt-5">

                          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            Quantity
                          </p>

                          <div className="flex items-center gap-3">

                            {/* MINUS */}
                            <button
                              onClick={() =>
                                updateQuantity(
                                  productId,
                                  quantity - 1
                                )
                              }
                              disabled={
                                quantity <= 1 ||
                                updating ===
                                  productId
                              }
                              className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 disabled:opacity-40"
                            >
                              <FaMinus />
                            </button>

                            {/* NUMBER */}
                            <span className="w-12 h-10 flex items-center justify-center text-lg font-bold text-gray-900 dark:text-white border rounded-lg">
                              {quantity}
                            </span>

                            {/* PLUS */}
                            <button
                              onClick={() =>
                                updateQuantity(
                                  productId,
                                  quantity + 1
                                )
                              }
                              disabled={
                                updating ===
                                productId ||
                                quantity >=
                                  Number(
                                    product?.stock ||
                                      0
                                  )
                              }
                              className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 disabled:opacity-40"
                            >
                              <FaPlus />
                            </button>

                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            Available stock:{" "}
                            {product?.stock ?? 0}
                          </p>

                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={() =>
                            removeProduct(
                              productId
                            )
                          }
                          disabled={
                            updating ===
                            productId
                          }
                          className="mt-5 flex items-center gap-2 text-red-500 font-semibold hover:text-red-700 disabled:opacity-50"
                        >
                          <FaTrash />

                          {updating ===
                          productId
                            ? "Removing..."
                            : "Remove"}
                        </button>

                      </div>

                      {/* ITEM TOTAL */}
                      <div className="sm:text-right">

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Item Total
                        </p>

                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>

            {/* =================================
                ORDER SUMMARY
            ================================= */}
            <div className="lg:col-span-1">

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-5">

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                <div className="flex justify-between py-3 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">
                    Products
                  </span>

                  <span className="font-semibold text-gray-900 dark:text-white">
                    {cart.length}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">
                    Total
                  </span>

                  <span className="font-bold text-2xl text-green-600">
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                 <a
                href="https://wa.me/917230910907?text=Hello%20I%20want%20to%20inquire%20about%20your%20products"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border-2 border-green-700 bg-white px-7 py-3.5 font-semibold text-green-700 shadow-md transition hover:bg-green-700 hover:text-white dark:bg-gray-800 dark:text-green-400"
              >
                💬 WhatsApp Inquiry
              </a>

                <button
                  onClick={() =>
                    navigate("/products")
                  }
                  className="mt-3 w-full border-2 border-gray-300 dark:border-gray-600 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:border-green-600 hover:text-green-600"
                >
                  Continue Shopping
                </button>

              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;