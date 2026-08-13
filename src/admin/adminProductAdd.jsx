
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const PRODUCT_API =
  "https://e-comm-4-39jg.onrender.com/api/product";

const CATEGORY_API =
  "https://e-comm-4-39jg.onrender.com/api/category";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // =========================
  // GET CATEGORIES
  // =========================
  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${CATEGORY_API}/all`
      );

      if (response.data.success) {
        setCategories(response.data.category || []);
      } else {
        toast.error(
          response.data.message ||
            "Failed to load categories"
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load categories"
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

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
  // CREATE PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      description,
      brand,
      category,
      price,
      stock,
      image,
    } = formData;

    if (
      !name ||
      !description ||
      !brand ||
      !category ||
      !price ||
      !stock ||
      !image
    ) {
      toast.error("All fields are required");
      return;
    }

    if (Number(price) < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    if (Number(stock) < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login as admin");
        return;
      }

      const response = await axios.post(
        `${PRODUCT_API}/create`,
        {
          name,
          description,
          brand,
          category,
          price: Number(price),
          stock: Number(stock),
          image,
        },
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
            "Product created successfully"
        );

        navigate("/admin/products");
      } else {
        toast.error(
          response.data.message ||
            "Product creation failed"
        );
      }
    } catch (error) {
      console.error("Create product error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Add Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create a new product
            </p>
          </div>

          <Link
            to="/admin/products"
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
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter product description"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* BRAND */}
          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={categoryLoading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
            >
              <option value="">
                {categoryLoading
                  ? "Loading categories..."
                  : "Select Category"}
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE + STOCK */}
          <div className="mb-5 grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                placeholder="Enter price"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="Enter stock"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

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
              placeholder="https://example.com/product.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* IMAGE PREVIEW */}
          {formData.image && (
            <div className="mb-6">
              <p className="mb-2 font-medium text-gray-700">
                Image Preview
              </p>

              <img
                src={formData.image}
                alt="Product Preview"
                className="h-40 w-40 rounded-lg border object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating Product..."
              : "Create Product"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddProduct;
