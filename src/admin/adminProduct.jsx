import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL =
  "https://e-comm-4-39jg.onrender.com/api/product";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // =====================================
  // GET ALL PRODUCTS
  // =====================================
  const getProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/all`
      );

      console.log(
        "Products Response:",
        response.data
      );

      if (response.data?.success) {
        setProducts(
          response.data.products ||
            response.data.product ||
            []
        );
      } else {
        toast.error(
          response.data?.message ||
            "Products fetch failed"
        );
      }
    } catch (error) {
      console.error(
        "Get Products Error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Backend:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DELETE PRODUCT
  // =====================================
  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Product ID is missing");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Please login as admin first"
      );
      return;
    }

    try {
      setDeletingId(id);

      const response = await axios.delete(
        `${API_URL}/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Delete Response:",
        response.data
      );

      if (response.data?.success) {
        toast.success(
          response.data.message ||
            "Product deleted successfully"
        );

        setProducts((previousProducts) =>
          previousProducts.filter(
            (product) =>
              product._id !== id
          )
        );
      } else {
        toast.error(
          response.data?.message ||
            "Product delete failed"
        );
      }
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Backend:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        toast.error(
          "Session expired. Please login again"
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return;
      }

      if (error.response?.status === 403) {
        toast.error(
          "Only admin can delete products"
        );

        return;
      }

      if (error.response?.status === 404) {
        toast.error(
          "Product not found"
        );

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // LOAD PRODUCTS
  // =====================================
  useEffect(() => {
    getProducts();
  }, []);

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-100 px-4">

        <div className="text-center">

          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

          <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
            Loading Products...
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Please wait
          </p>

        </div>

      </div>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================
  return (
    <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-5 sm:py-6 md:px-6">

      <div className="mx-auto max-w-7xl">

        {/* =================================
            HEADER
        ================================= */}
        <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm sm:p-5 md:mb-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Products
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage all products from here
              </p>
            </div>

            <Link
              to="/admin/products/add"
              className="inline-flex w-full items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
            >
              + Add Product
            </Link>

          </div>

        </div>

        {/* =================================
            PRODUCT STATS
        ================================= */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Products
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                  {products.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📦
              </div>

            </div>

          </div>

          {/* AVAILABLE */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Available Products
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {
                    products.filter(
                      (product) =>
                        Number(product.stock) > 0
                    ).length
                  }
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                ✅
              </div>

            </div>

          </div>

          {/* OUT OF STOCK */}
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Out of Stock
                </p>

                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  {
                    products.filter(
                      (product) =>
                        Number(product.stock) <= 0
                    ).length
                  }
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                ⚠️
              </div>

            </div>

          </div>

        </div>

        {/* =================================
            NO PRODUCTS
        ================================= */}
        {products.length === 0 ? (

          <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm sm:py-16">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
              📦
            </div>

            <h2 className="text-xl font-bold text-gray-700">
              No Products Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You have not added any products yet.
            </p>

            <Link
              to="/admin/products/add"
              className="mt-6 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              + Add Product
            </Link>

          </div>

        ) : (

          <>
            {/* =================================
                MOBILE / TABLET CARDS
                hidden on lg
            ================================= */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">

              {products.map(
                (product, index) => {

                  let categoryName =
                    "No Category";

                  if (
                    product.category &&
                    typeof product.category ===
                      "object"
                  ) {
                    categoryName =
                      product.category?.name ||
                      "No Category";
                  } else if (
                    product.category
                  ) {
                    categoryName =
                      product.category;
                  }

                  const stock =
                    Number(
                      product.stock
                    ) || 0;

                  return (
                    <div
                      key={product._id || index}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm"
                    >

                      {/* CARD TOP */}
                      <div className="flex gap-4 border-b border-gray-100 p-4">

                        {/* IMAGE */}
                        <img
                          src={
                            product.image ||
                            "https://placehold.co/150x150?text=No+Image"
                          }
                          alt={
                            product.name ||
                            "Product"
                          }
                          className="h-24 w-24 flex-shrink-0 rounded-xl border object-cover sm:h-28 sm:w-28"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/150x150?text=No+Image";
                          }}
                        />

                        {/* INFO */}
                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <h2 className="line-clamp-2 text-base font-bold text-gray-800 sm:text-lg">
                              {product.name ||
                                "Unnamed Product"}
                            </h2>

                            <span className="flex-shrink-0 text-xs text-gray-400">
                              #{index + 1}
                            </span>

                          </div>

                          <p className="mt-1 truncate text-sm text-gray-500">
                            {product.brand ||
                              "No Brand"}
                          </p>

                          <span className="mt-2 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                            {categoryName}
                          </span>

                        </div>

                      </div>

                      {/* CARD BODY */}
                      <div className="grid grid-cols-2 gap-3 p-4">

                        {/* PRICE */}
                        <div className="rounded-xl bg-gray-50 p-3">

                          <p className="text-xs text-gray-500">
                            Price
                          </p>

                          <p className="mt-1 text-lg font-bold text-gray-800">
                            ₹
                            {Number(
                              product.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                        {/* STOCK */}
                        <div className="rounded-xl bg-gray-50 p-3">

                          <p className="text-xs text-gray-500">
                            Stock
                          </p>

                          <div className="mt-2">

                            {stock > 0 ? (
                              <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                {stock} Available
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                                Out of Stock
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* DESCRIPTION */}
                      <div className="px-4 pb-4">

                        <p className="line-clamp-2 text-sm text-gray-500">
                          {product.description ||
                            "No description available"}
                        </p>

                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2 border-t border-gray-100 p-4">

                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            product._id
                          }
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                          className="flex flex-1 items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                          {deletingId ===
                          product._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            {/* =================================
                DESKTOP TABLE
                visible lg+
            ================================= */}
            <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm lg:block">

              <div className="overflow-x-auto">

                <table className="w-full">

                  {/* TABLE HEADER */}
                  <thead className="bg-gray-900 text-white">

                    <tr>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        #
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        Image
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        Product
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        Brand
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        Category
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        Price
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        Stock
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-center text-sm font-semibold">
                        Action
                      </th>

                    </tr>

                  </thead>

                  {/* TABLE BODY */}
                  <tbody>

                    {products.map(
                      (product, index) => {

                        let categoryName =
                          "No Category";

                        if (
                          product.category &&
                          typeof product.category ===
                            "object"
                        ) {
                          categoryName =
                            product.category?.name ||
                            "No Category";
                        } else if (
                          product.category
                        ) {
                          categoryName =
                            product.category;
                        }

                        const stock =
                          Number(
                            product.stock
                          ) || 0;

                        return (
                          <tr
                            key={
                              product._id ||
                              index
                            }
                            className="border-b transition last:border-b-0 hover:bg-gray-50"
                          >

                            {/* NUMBER */}
                            <td className="px-5 py-4 text-sm font-medium text-gray-700">
                              {index + 1}
                            </td>

                            {/* IMAGE */}
                            <td className="px-5 py-4">

                              <img
                                src={
                                  product.image ||
                                  "https://placehold.co/100x100?text=No+Image"
                                }
                                alt={
                                  product.name ||
                                  "Product"
                                }
                                className="h-16 w-16 rounded-xl border object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://placehold.co/100x100?text=No+Image";
                                }}
                              />

                            </td>

                            {/* PRODUCT */}
                            <td className="max-w-[260px] px-5 py-4">

                              <p className="truncate font-semibold text-gray-800">
                                {product.name ||
                                  "Unnamed Product"}
                              </p>

                              <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                {product.description ||
                                  "No description"}
                              </p>

                            </td>

                            {/* BRAND */}
                            <td className="px-5 py-4 text-sm text-gray-600">
                              {product.brand ||
                                "N/A"}
                            </td>

                            {/* CATEGORY */}
                            <td className="px-5 py-4">

                              <span className="inline-flex whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                {categoryName}
                              </span>

                            </td>

                            {/* PRICE */}
                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                              ₹
                              {Number(
                                product.price
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            {/* STOCK */}
                            <td className="px-5 py-4">

                              {stock > 0 ? (
                                <span className="inline-flex whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                  {stock} Available
                                </span>
                              ) : (
                                <span className="inline-flex whitespace-nowrap rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                  Out of Stock
                                </span>
                              )}

                            </td>

                            {/* ACTION */}
                            <td className="px-5 py-4">

                              <div className="flex items-center justify-center gap-2">

                                <Link
                                  to={`/admin/products/edit/${product._id}`}
                                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                  Edit
                                </Link>

                                <button
                                  type="button"
                                  disabled={
                                    deletingId ===
                                    product._id
                                  }
                                  onClick={() =>
                                    handleDelete(
                                      product._id
                                    )
                                  }
                                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                  {deletingId ===
                                  product._id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default AdminProducts;