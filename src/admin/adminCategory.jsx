import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL =
  "https://e-comm-4-39jg.onrender.com/api/category";

function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // GET ALL CATEGORIES
  // =========================
  const getCategories = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/all`
      );

      console.log(
        "Categories Response:",
        response.data
      );

      const data = response.data;

      if (data?.success) {
        setCategories(
          Array.isArray(data.category)
            ? data.category
            : Array.isArray(data.categories)
            ? data.categories
            : []
        );
      } else {
        setCategories([]);

        toast.error(
          data?.message ||
            "Failed to get categories"
        );
      }
    } catch (error) {
      console.error(
        "Get Category Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================
  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Category ID is missing");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login as admin first");
      return;
    }

    try {
      setDeletingId(id);

      const response = await axios.delete(
        `${API_URL}/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Delete Category Response:",
        response.data
      );

      const data = response.data;

      if (data?.success) {
        toast.success(
          data.message ||
            "Category deleted successfully"
        );

        // Remove category from UI
        setCategories((previous) =>
          previous.filter(
            (category) =>
              category._id !== id
          )
        );
      } else {
        toast.error(
          data?.message ||
            "Delete failed"
        );
      }
    } catch (error) {
      console.error(
        "Delete Category Error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Backend Response:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        toast.error(
          "Unauthorized. Please login again."
        );

        return;
      }

      if (error.response?.status === 403) {
        toast.error(
          "Only admin can delete categories."
        );

        return;
      }

      if (error.response?.status === 404) {
        toast.error(
          "Category not found."
        );

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to delete category"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // LOAD CATEGORIES
  // =========================
  useEffect(() => {
    getCategories();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

          <p className="text-lg font-semibold text-gray-700">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Categories
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage all product categories
            </p>
          </div>

          <Link
            to="/admin/categories/add"
            className="rounded-lg bg-black px-5 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
          >
            + Add Category
          </Link>

        </div>

        {/* =========================
            TOTAL
        ========================= */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Categories
          </p>

          <h2 className="mt-1 text-3xl font-bold text-gray-800">
            {categories.length}
          </h2>

        </div>

        {/* =========================
            NO DATA
        ========================= */}
        {categories.length === 0 ? (

          <div className="rounded-xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📁
            </div>

            <h2 className="text-xl font-semibold text-gray-700">
              No Categories Found
            </h2>

            <p className="mt-2 text-gray-500">
              Add your first category.
            </p>

            <Link
              to="/admin/categories/add"
              className="mt-5 inline-block rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
            >
              Add Category
            </Link>

          </div>

        ) : (

          /* =========================
             TABLE
          ========================= */
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                {/* TABLE HEADER */}
                <thead className="bg-gray-900 text-white">

                  <tr>

                    <th className="px-5 py-4 text-left">
                      #
                    </th>

                    <th className="px-5 py-4 text-left">
                      Image
                    </th>

                    <th className="px-5 py-4 text-left">
                      Name
                    </th>

                    <th className="px-5 py-4 text-left">
                      Slug
                    </th>

                    <th className="px-5 py-4 text-left">
                      Description
                    </th>

                    <th className="px-5 py-4 text-center">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}
                <tbody>

                  {categories.map(
                    (category, index) => (

                      <tr
                        key={
                          category._id ||
                          index
                        }
                        className="border-b transition hover:bg-gray-50"
                      >

                        {/* NUMBER */}
                        <td className="px-5 py-4 font-medium">
                          {index + 1}
                        </td>

                        {/* IMAGE */}
                        <td className="px-5 py-4">

                          <img
                            src={
                              category.image ||
                              "https://placehold.co/100x100?text=No+Image"
                            }
                            alt={
                              category.name ||
                              "Category"
                            }
                            className="h-16 w-16 rounded-lg border object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/100x100?text=No+Image";
                            }}
                          />

                        </td>

                        {/* NAME */}
                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {category.name ||
                            "N/A"}
                        </td>

                        {/* SLUG */}
                        <td className="px-5 py-4 text-gray-600">
                          {category.slug ||
                            "N/A"}
                        </td>

                        {/* DESCRIPTION */}
                        <td className="max-w-xs px-5 py-4 text-gray-600">

                          <p className="line-clamp-2">
                            {category.description ||
                              "No description"}
                          </p>

                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4">

                          <div className="flex justify-center gap-2">

                            {/* EDIT */}
                            <Link
                              to={`/admin/categories/edit/${category._id}`}
                              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                              Edit
                            </Link>

                            {/* DELETE */}
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  category._id
                                )
                              }
                              disabled={
                                deletingId ===
                                category._id
                              }
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                              {deletingId ===
                              category._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
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

export default AdminCategory;