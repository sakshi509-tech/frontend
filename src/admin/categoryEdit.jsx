
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = "https://e-comm-4-39jg.onrender.com/api/category";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // =========================
  // GET SINGLE CATEGORY
  // =========================
  const getCategory = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/single/${id}`
      );

      if (response.data.success) {
        const category = response.data.category;

        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          image: category.image || "",
          description: category.description || "",
        });
      } else {
        toast.error(
          response.data.message ||
            "Category not found"
        );

        navigate("/admin/categories");
      }
    } catch (error) {
      console.error("Get single category error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to get category"
      );

      navigate("/admin/categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getCategory();
    }
  }, [id]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE CATEGORY
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, slug, image, description } =
      formData;

    if (!name || !slug || !image || !description) {
      toast.error("All fields are required");
      return;
    }

    try {
      setUpdating(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login as admin first");
        return;
      }

      const response = await axios.put(
        `${API_URL}/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Category updated successfully"
        );

        navigate("/admin/categories");
      } else {
        toast.error(
          response.data.message ||
            "Category update failed"
        );
      }
    } catch (error) {
      console.error("Update category error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update category"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">
          Loading category...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Category
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update category information
            </p>
          </div>

          <Link
            to="/admin/categories"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back
          </Link>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-sm"
        >

          {/* NAME */}
          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          {/* SLUG */}
          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="category-slug"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          {/* IMAGE */}
          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Image URL
            </label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          {/* PREVIEW */}
          {formData.image && (
            <div className="mb-5">
              <p className="mb-2 font-medium text-gray-700">
                Preview
              </p>

              <img
                src={formData.image}
                alt={formData.name}
                className="h-40 w-40 rounded-lg border object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="mb-6">
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter category description"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          {/* UPDATE */}
          <button
            type="submit"
            disabled={updating}
            className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating
              ? "Updating Category..."
              : "Update Category"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditCategory;
