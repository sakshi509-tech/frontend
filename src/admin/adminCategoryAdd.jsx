import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL =
  "https://e-comm-4-39jg.onrender.com/api/category";

function AddCategory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // NAME + AUTO SLUG
  // =========================
  const handleNameChange = (e) => {
    const name = e.target.value;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    setFormData((prev) => ({
      ...prev,
      name,
      slug,
    }));
  };

  // =========================
  // OTHER INPUTS
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CREATE CATEGORY
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const slug = formData.slug.trim();
    const image = formData.image.trim();
    const description = formData.description.trim();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    if (!slug) {
      toast.error("Slug is required");
      return;
    }

    if (!image) {
      toast.error("Image URL is required");
      return;
    }

    if (!description) {
      toast.error("Description is required");
      return;
    }

    // =========================
    // TOKEN
    // =========================
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      console.log("Category API:", `${API_URL}/create`);
      console.log("Token exists:", Boolean(token));

      const response = await axios.post(
        `${API_URL}/create`,
        {
          name,
          slug,
          image,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Create Category Response:",
        response.data
      );

      if (response.data?.success) {
        toast.success(
          response.data?.message ||
            "Category created successfully"
        );

        setFormData({
          name: "",
          slug: "",
          image: "",
          description: "",
        });

        navigate("/admin/categories");
      } else {
        toast.error(
          response.data?.message ||
            "Category creation failed"
        );
      }
    } catch (error) {
      console.error(
        "Create Category Error:",
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

      // =========================
      // 401
      // =========================
      if (error.response?.status === 401) {
        toast.error(
          error.response?.data?.message ||
            "Session expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      // =========================
      // 403
      // =========================
      if (error.response?.status === 403) {
        toast.error(
          error.response?.data?.message ||
            "Only admin can create categories."
        );

        return;
      }

      // =========================
      // OTHER ERROR
      // =========================
      toast.error(
        error.response?.data?.message ||
          "Unable to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-5 sm:py-6 md:px-8">
      <div className="mx-auto w-full max-w-3xl">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-5 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">

          <div>
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Add Category
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Create a new product category
            </p>
          </div>

          <Link
            to="/admin/categories"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:w-auto"
          >
            Back
          </Link>
        </div>

        {/* =========================
            FORM
        ========================= */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-4 shadow-sm sm:p-6 md:p-8"
        >

          {/* NAME */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter category name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 sm:text-base"
            />
          </div>

          {/* SLUG */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="category-slug"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 sm:text-base"
            />

            <p className="mt-1 text-xs text-gray-400">
              Example: mobile-phones
            </p>
          </div>

          {/* IMAGE */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 sm:text-base"
            />
          </div>

          {/* IMAGE PREVIEW */}
          {formData.image && (
            <div className="mb-5">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Preview
              </p>

              <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border bg-gray-50 sm:h-48 sm:w-48">
                <img
                  src={formData.image}
                  alt="Category preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter category description"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200 sm:text-base"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
          >
            {loading
              ? "Creating Category..."
              : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;