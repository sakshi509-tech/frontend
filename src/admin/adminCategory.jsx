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

  // =====================================
  // GET ALL CATEGORIES
  // =====================================
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

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Backend Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DELETE CATEGORY
  // =====================================
  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Category ID is missing");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
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
        "Delete Category Response:",
        response.data
      );

      const data = response.data;

      if (data?.success) {
        toast.success(
          data.message ||
            "Category deleted successfully"
        );

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

        localStorage.removeItem("token");
        localStorage.removeItem("user");

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

  // =====================================
  // LOAD CATEGORIES
  // =====================================
  useEffect(() => {
    getCategories();
  }, []);

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-100 px-4">

        <div className="text-center">

          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

          <h2 className="text-lg font-bold text-gray-700 sm:text-xl">
            Loading Categories...
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Please wait
          </p>

        </div>

      </div>
    );
  }

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
                Categories
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage all product categories
              </p>

            </div>

            <Link
              to="/admin/categories/add"
              className="inline-flex w-full items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
            >
              + Add Category
            </Link>

          </div>

        </div>

        {/* =================================
            STATS
        ================================= */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Total Categories
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                  {categories.length}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📁
              </div>

            </div>

          </div>

          {/* WITH IMAGE */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  With Image
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {
                    categories.filter(
                      (category) =>
                        Boolean(
                          category.image
                        )
                    ).length
                  }
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                🖼️
              </div>

            </div>

          </div>

          {/* WITHOUT IMAGE */}
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Without Image
                </p>

                <h2 className="mt-2 text-3xl font-bold text-orange-500">
                  {
                    categories.filter(
                      (category) =>
                        !category.image
                    ).length
                  }
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                ⚠️
              </div>

            </div>

          </div>

        </div>

        {/* =================================
            NO CATEGORIES
        ================================= */}
        {categories.length === 0 ? (

          <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm sm:py-16">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
              📁
            </div>

            <h2 className="text-xl font-bold text-gray-700">
              No Categories Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add your first category.
            </p>

            <Link
              to="/admin/categories/add"
              className="mt-6 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              + Add Category
            </Link>

          </div>

        ) : (

          <>
            {/* =================================
                MOBILE / TABLET CARDS
                lg se neeche visible
            ================================= */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">

              {categories.map(
                (category, index) => (

                  <div
                    key={
                      category._id ||
                      index
                    }
                    className="overflow-hidden rounded-2xl bg-white shadow-sm"
                  >

                    {/* CARD HEADER */}
                    <div className="flex gap-4 border-b border-gray-100 p-4">

                      {/* IMAGE */}
                      <img
                        src={
                          category.image ||
                          "https://placehold.co/150x150?text=No+Image"
                        }
                        alt={
                          category.name ||
                          "Category"
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

                          <h2 className="line-clamp-2 text-lg font-bold text-gray-800">
                            {category.name ||
                              "Unnamed Category"}
                          </h2>

                          <span className="flex-shrink-0 text-xs text-gray-400">
                            #{index + 1}
                          </span>

                        </div>

                        {/* SLUG */}
                        <p className="mt-2 truncate text-sm text-gray-500">
                          /{category.slug ||
                            "no-slug"}
                        </p>

                      </div>

                    </div>

                    {/* DESCRIPTION */}
                    <div className="p-4">

                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Description
                      </p>

                      <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                        {category.description ||
                          "No description available"}
                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 border-t border-gray-100 p-4">

                      {/* EDIT */}
                      <Link
                        to={`/admin/categories/edit/${category._id}`}
                        className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
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
                        className="flex flex-1 items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        {deletingId ===
                        category._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* =================================
                DESKTOP TABLE
                lg+
            ================================= */}
            <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm lg:block">

              <div className="overflow-x-auto">

                <table className="w-full">

                  {/* HEADER */}
                  <thead className="bg-gray-900 text-white">

                    <tr>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        #
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        Image
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        Name
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold">
                        Slug
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold">
                        Description
                      </th>

                      <th className="whitespace-nowrap px-5 py-4 text-center text-sm font-semibold">
                        Action
                      </th>

                    </tr>

                  </thead>

                  {/* BODY */}
                  <tbody>

                    {categories.map(
                      (
                        category,
                        index
                      ) => (

                        <tr
                          key={
                            category._id ||
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
                                category.image ||
                                "https://placehold.co/100x100?text=No+Image"
                              }
                              alt={
                                category.name ||
                                "Category"
                              }
                              className="h-16 w-16 rounded-xl border object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://placehold.co/100x100?text=No+Image";
                              }}
                            />

                          </td>

                          {/* NAME */}
                          <td className="px-5 py-4">

                            <p className="font-semibold text-gray-800">
                              {category.name ||
                                "N/A"}
                            </p>

                          </td>

                          {/* SLUG */}
                          <td className="px-5 py-4">

                            <span className="inline-flex max-w-[180px] truncate rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                              {category.slug ||
                                "N/A"}
                            </span>

                          </td>

                          {/* DESCRIPTION */}
                          <td className="max-w-sm px-5 py-4">

                            <p className="line-clamp-2 text-sm leading-5 text-gray-600">
                              {category.description ||
                                "No description"}
                            </p>

                          </td>

                          {/* ACTION */}
                          <td className="px-5 py-4">

                            <div className="flex items-center justify-center gap-2">

                              {/* EDIT */}
                              <Link
                                to={`/admin/categories/edit/${category._id}`}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
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
          </>

        )}

      </div>

    </div>
  );
}

export default AdminCategory;