
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

      console.log("Products Response:", response.data);

      if (response.data.success) {
        setProducts(
          response.data.products ||
            response.data.product ||
            []
        );
      } else {
        toast.error(
          response.data.message ||
            "Products fetch failed"
        );
      }
    } catch (error) {
      console.error(
        "Get Products Error:",
        error
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error(
          "Please login as admin first"
        );
        return;
      }

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

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Product deleted successfully"
        );

        // Remove product from UI
        setProducts((previousProducts) =>
          previousProducts.filter(
            (product) =>
              product._id !== id
          )
        );
      } else {
        toast.error(
          response.data.message ||
            "Product delete failed"
        );
      }
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // GET PRODUCTS ON PAGE LOAD
  // =====================================
  useEffect(() => {
    getProducts();
  }, []);

  // =====================================
  // LOADING SCREEN
  // =====================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>

          <p className="font-medium text-gray-600">
            Loading products...
          </p>

        </div>
      </div>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="mx-auto max-w-7xl">

        {/* =================================
            HEADER
        ================================= */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage all products from here
            </p>
          </div>

          <Link
            to="/admin/products/add"
            className="rounded-lg bg-black px-5 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
          >
            + Add Product
          </Link>

        </div>

        {/* =================================
            PRODUCT COUNT
        ================================= */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Products
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800">
              {products.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
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

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
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

        </div>

        {/* =================================
            NO PRODUCTS
        ================================= */}
        {products.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📦
            </div>

            <h2 className="text-xl font-semibold text-gray-700">
              No Products Found
            </h2>

            <p className="mt-2 text-gray-500">
              You have not added any products yet.
            </p>

            <Link
              to="/admin/products/add"
              className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
            >
              + Add Product
            </Link>

          </div>
        ) : (
          /* =================================
             PRODUCT TABLE
          ================================= */
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                {/* TABLE HEADER */}
                <thead className="bg-gray-900 text-white">

                  <tr>

                    <th className="px-5 py-4 text-left text-sm">
                      #
                    </th>

                    <th className="px-5 py-4 text-left text-sm">
                      Image
                    </th>

                    <th className="px-5 py-4 text-left text-sm">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-sm">
                      Brand
                    </th>

                    <th className="px-5 py-4 text-left text-sm">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-sm">
                      Price
                    </th>

                    <th className="px-5 py-4 text-left text-sm">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-center text-sm">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}
                <tbody>

                  {products.map(
                    (product, index) => {

                      // =====================
                      // CATEGORY NAME
                      // =====================
                      let categoryName =
                        "No Category";

                      if (
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

                      // =====================
                      // STOCK
                      // =====================
                      const stock =
                        Number(
                          product.stock
                        ) || 0;

                      return (
                        <tr
                          key={product._id}
                          className="border-b transition hover:bg-gray-50"
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
                              className="h-16 w-16 rounded-lg border object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://placehold.co/100x100?text=No+Image";
                              }}
                            />

                          </td>

                          {/* PRODUCT NAME */}
                          <td className="px-5 py-4">

                            <p className="max-w-[220px] truncate font-semibold text-gray-800">
                              {product.name}
                            </p>

                            <p className="mt-1 max-w-[220px] truncate text-xs text-gray-500">
                              {product.description}
                            </p>

                          </td>

                          {/* BRAND */}
                          <td className="px-5 py-4 text-sm text-gray-600">
                            {product.brand ||
                              "N/A"}
                          </td>

                          {/* CATEGORY */}
                          <td className="px-5 py-4">

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              {categoryName}
                            </span>

                          </td>

                          {/* PRICE */}
                          <td className="px-5 py-4 font-semibold text-gray-800">
                            ₹
                            {Number(
                              product.price
                            ).toLocaleString("en-IN")}
                          </td>

                          {/* STOCK */}
                          <td className="px-5 py-4">

                            {stock > 0 ? (
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                {stock} Available
                              </span>
                            ) : (
                              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                Out of Stock
                              </span>
                            )}

                          </td>

                          {/* ACTION */}
                          <td className="px-5 py-4">

                            <div className="flex items-center justify-center gap-2">

                              {/* EDIT */}
                              <Link
                                to={`/admin/products/edit/${product._id}`}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                              >
                                Edit
                              </Link>

                              {/* DELETE */}
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
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
        )}

      </div>

    </div>
  );
}

export default AdminProducts;
