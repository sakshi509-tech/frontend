import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
} from "react-icons/fa";
import Navbar from "../component/navbar";

const API_URL = "https://e-comm-4-39jg.onrender.com/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(false);

  const token = localStorage.getItem("token");

  const getProduct = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/product/single/${id}`
      );

      if (data.success) {
        setProduct(data.product);

        if (data.product.category?._id) {
          getRelatedProducts(data.product.category._id);
        }
      } else {
        toast.error(data.message || "Product Not Found");
        setProduct(null);
      }
    } catch (error) {
      console.error("Product Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable To Load Product"
      );
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const getWishlistStatus = async () => {
    if (!token) {
      return;
    }

    try {
      const { data } = await axios.get(
        `${API_URL}/wishlist/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        const products =
          data.wishlist?.products || [];

        const exists = products.some(
          (item) =>
            item._id?.toString() === id?.toString()
        );

        setWishlist(exists);
      }
    } catch (error) {
      console.error(
        "Wishlist Status Error:",
        error
      );
    }
  };

  const getRelatedProducts = async (categoryId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/product/all`
      );

      if (data.success) {
        const products = data.products || [];

        const related = products.filter((item) => {
          const itemCategoryId =
            item.category?._id ||
            item.category;

          return (
            itemCategoryId?.toString() ===
              categoryId?.toString() &&
            item._id?.toString() !== id?.toString()
          );
        });

        setRelatedProducts(
          related.slice(0, 4)
        );
      }
    } catch (error) {
      console.error(
        "Related Products Error:",
        error
      );
    }
  };

  const addToCart = async () => {
    if (!token) {
      toast.error("Please Login First");
      navigate("/login");
      return false;
    }

    if (!product) {
      toast.error("Product Not Found");
      return false;
    }

    if (product.stock <= 0) {
      toast.error("Product Out Of Stock");
      return false;
    }

    try {
      const { data } = await axios.post(
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

      if (data.success) {
        toast.success(
          data.message || "Added To Cart"
        );
        return true;
      }

      toast.error(
        data.message || "Unable To Add To Cart"
      );
      return false;
    } catch (error) {
      console.error("Add Cart Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return false;
      }

      toast.error(
        error.response?.data?.message ||
          "Something Went Wrong"
      );

      return false;
    }
  };

  const toggleWishlist = async () => {
    if (!token) {
      toast.error("Please Login First");
      navigate("/login");
      return;
    }

    if (!product) {
      return;
    }

    try {
      if (wishlist) {
        const { data } = await axios.delete(
          `${API_URL}/wishlist/delete/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setWishlist(false);
          toast.success("Removed From Wishlist");
        } else {
          toast.error(
            data.message ||
              "Unable To Remove Wishlist"
          );
        }
      } else {
        const { data } = await axios.post(
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

        if (data.success) {
          setWishlist(true);
          toast.success("Added To Wishlist");
        } else {
          toast.error(
            data.message ||
              "Unable To Add Wishlist"
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
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Wishlist Error"
      );
    }
  };

  const buyNow = async () => {
    const added = await addToCart();

    if (added) {
      navigate("/cart");
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  useEffect(() => {
    if (token && id) {
      getWishlistStatus();
    } else {
      setWishlist(false);
    }
  }, [id, token]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
          <h1 className="text-3xl font-bold text-green-600">
            Loading Product...
          </h1>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-500">
              Product Not Found
            </h1>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Back To Products
            </button>
          </div>
        </div>
      </>
    );
  }

  const productImage =
    Array.isArray(product.image)
      ? product.image[0]
      : product.image;

  const categoryName =
    product.category?.name ||
    product.category ||
    "Category";

  const brandName =
    product.brand?.name ||
    product.brand ||
    "N/A";

  const finalPrice =
    product.discountPrice &&
    Number(product.discountPrice) > 0
      ? Number(product.discountPrice)
      : Number(product.price || 0);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-5">
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-gray-800">
            <div className="grid gap-10 p-8 lg:grid-cols-2">
              <div>
                <div className="relative">
                  <div className="flex h-[550px] items-center justify-center overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-700">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-7xl">
                        🛍️
                      </div>
                    )}
                  </div>

                  <button
                    onClick={toggleWishlist}
                    className="absolute right-5 top-5 rounded-full bg-white p-3 shadow-lg transition hover:scale-110"
                  >
                    {wishlist ? (
                      <FaHeart className="text-2xl text-red-500" />
                    ) : (
                      <FaRegHeart className="text-2xl text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <span className="w-fit rounded-full bg-green-100 px-4 py-1 font-semibold text-green-700">
                  {categoryName}
                </span>

                <h1 className="mt-5 text-4xl font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h1>

                <div className="mt-4 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <FaStar
                        key={star}
                        className="text-yellow-500"
                      />
                    )
                  )}

                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    5.0 Rating
                  </span>
                </div>

                <p className="mt-6 leading-8 text-gray-600 dark:text-gray-300">
                  {product.description}
                </p>

                <div className="mt-8">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold text-green-600">
                      ₹{finalPrice}
                    </span>

                    {product.discountPrice &&
                      Number(product.discountPrice) <
                        Number(product.price) && (
                        <span className="text-2xl text-gray-400 line-through">
                          ₹{product.price}
                        </span>
                      )}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-5">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      Brand
                    </p>

                    <p className="text-gray-500 dark:text-gray-400">
                      {brandName}
                    </p>
                  </div>

                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      Stock
                    </p>

                    <p
                      className={
                        product.stock > 0
                          ? "font-semibold text-green-600"
                          : "font-semibold text-red-500"
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} Available`
                        : "Out Of Stock"}
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-5 sm:flex-row">
                  <button
                    onClick={addToCart}
                    disabled={product.stock <= 0}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-4 font-bold ${
                      product.stock <= 0
                        ? "cursor-not-allowed bg-gray-400 text-white"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    <FaShoppingCart />

                    {product.stock <= 0
                      ? "Out Of Stock"
                      : "Add To Cart"}
                  </button>

                  <button
                    onClick={buyNow}
                    disabled={product.stock <= 0}
                    className={`flex-1 rounded-xl py-4 font-bold ${
                      product.stock <= 0
                        ? "cursor-not-allowed bg-gray-300 text-gray-500"
                        : "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="mb-10 text-center text-4xl font-bold text-green-600">
              Related Products
            </h2>

            {relatedProducts.length === 0 ? (
              <div className="py-10 text-center text-xl text-gray-500">
                No Related Products Found
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((item) => {
                  const image = Array.isArray(
                    item.image
                  )
                    ? item.image[0]
                    : item.image;

                  const itemPrice =
                    item.discountPrice &&
                    Number(item.discountPrice) > 0
                      ? Number(item.discountPrice)
                      : Number(item.price || 0);

                  return (
                    <div
                      key={item._id}
                      className="overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-800"
                    >
                      <div className="h-56 bg-gray-100 dark:bg-gray-700">
                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-6xl">
                            🛍️
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="line-clamp-1 text-lg font-bold text-gray-900 dark:text-white">
                          {item.name}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>

                        <div className="mt-4">
                          <span className="text-xl font-bold text-green-600">
                            ₹{itemPrice}
                          </span>

                          {item.discountPrice &&
                            Number(item.discountPrice) <
                              Number(item.price) && (
                              <span className="ml-3 text-gray-400 line-through">
                                ₹{item.price}
                              </span>
                            )}
                        </div>

                        <button
                          onClick={() =>
                            navigate(
                              `/product/${item._id}`
                            )
                          }
                          className="mt-5 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;