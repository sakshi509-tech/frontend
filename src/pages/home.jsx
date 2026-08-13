import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

const API_URL = "https://e-comm-4-39jg.onrender.com/api";

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const getCategories = async () => {
    try {
      setLoadingCategories(true);

      const { data } = await axios.get(
        `${API_URL}/category/all`
      );

      console.log("Category Response:", data);

      if (data.success) {
        const categoryData =
          data.categories ||
          data.data ||
          data.category ||
          [];

        setCategories(
          Array.isArray(categoryData) ? categoryData : []
        );
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Category Error:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const getProducts = async () => {
    try {
      setLoadingProducts(true);

      const { data } = await axios.get(
        `${API_URL}/product/all`
      );

      console.log("Product Response:", data);

      if (data.success) {
        const productData =
          data.products ||
          data.data ||
          data.product ||
          [];

        setProducts(
          Array.isArray(productData) ? productData : []
        );
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Product Error:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <Navbar />

      <section className="relative overflow-hidden bg-green-50 dark:bg-gray-900">
        <div className="mx-auto grid min-h-[600px] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
          <div className="relative z-10">
            <Link
              to="/products"
              className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-green-700 shadow-md dark:bg-gray-800 dark:text-green-400"
            >
              🛍️ Best Quality, Best Prices
            </Link>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              Welcome to
              <span className="block text-green-700 dark:text-green-400">
                Our Store
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
              Find the best products at the best prices.
              Shop your favorite products with us and enjoy
              fast delivery and secure payment.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-lg bg-green-700 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-green-800"
              >
                🛒 Shop Now
              </Link>

              <a
                href="https://wa.me/917230910907?text=Hello%20I%20want%20to%20inquire%20about%20your%20products"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border-2 border-green-700 bg-white px-7 py-3.5 font-semibold text-green-700 shadow-md transition hover:bg-green-700 hover:text-white dark:bg-gray-800 dark:text-green-400"
              >
                💬 WhatsApp Inquiry
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow dark:bg-gray-800">
                  🚚
                </div>
                <div>
                  <h3 className="font-bold">Free Delivery</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fast delivery
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow dark:bg-gray-800">
                  🛡️
                </div>
                <div>
                  <h3 className="font-bold">Secure Payment</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    100% Protected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow dark:bg-gray-800">
                  🎧
                </div>
                <div>
                  <h3 className="font-bold">24/7 Support</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We're here for you
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-[300px] w-[300px] rounded-full bg-green-200/70 blur-2xl dark:bg-green-900/40 sm:h-[450px] sm:w-[450px]" />

            <img
              src="/b1.webp"
              alt="E-commerce shopping"
              className="relative z-10 w-full max-w-[600px] object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              Categories
            </h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Shop by category
            </p>
          </div>

          <Link
            to="/category"
            className="font-semibold text-green-600 hover:text-green-700"
          >
            View All →
          </Link>
        </div>

        {loadingCategories ? (
          <div className="py-10 text-center text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center dark:bg-gray-800">
            No categories found
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                to={`/category/${category._id}`}
                className="group overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
              >
                <div className="h-32 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name || "Category"}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      🛍️
                    </div>
                  )}
                </div>

                <div className="p-3 text-center">
                  <h3 className="font-semibold">
                    {category.name || "Category"}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              Latest Products
            </h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Check out our latest products
            </p>
          </div>

          <Link
            to="/products"
            className="font-semibold text-green-600 hover:text-green-700"
          >
            View All →
          </Link>
        </div>

        {loadingProducts ? (
          <div className="py-10 text-center text-gray-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center dark:bg-gray-800">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
              >
                <div className="h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {product.image ? (
                    <img
                      src={
                        Array.isArray(product.image)
                          ? product.image[0]
                          : product.image
                      }
                      alt={product.name || "Product"}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                      🛍️
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold">
                    {product.name || "Product"}
                  </h3>

                  {product.brand && (
                    <p className="mt-1 text-sm text-gray-500">
                      {product.brand}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600">
                      ₹{product.price || 0}
                    </span>

                    <span className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white">
                      View
                    </span>
                    
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

export default Home;