
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const PRODUCT_API =
  "https://e-comm-4-39jg.onrender.com/api/product";

const CATEGORY_API =
  "https://e-comm-4-39jg.onrender.com/api/category";

function EditProduct() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load categories");
    }
  };

  // =========================
  // GET SINGLE PRODUCT
  // =========================
  const getProduct = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${PRODUCT_API}/single/${id}`
      );

      if (!response.data.success) {
        toast.error(
          response.data.message ||
            "Product not found"
        );

        navigate("/admin/products");
        return;
      }

      const product = response.data.product;

      // Category can be ObjectId OR populated object
      let categoryId = "";

      if (typeof product.category === "object") {
        categoryId = product.category?._id || "";
      } else {
        categoryId = product.category || "";
      }

      setFormData({
        name: product.name || "",
        description: product.description || "",
        brand: product.brand || "",
        category: categoryId,
        price: product.price ?? "",
        stock: product.stock ?? "",
        image: product.image || "",
      });
    } catch (error) {
      console.error(
        "Get single product error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to get product"
      );

      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getCategories();
      getProduct();
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
  // UPDATE PRODUCT
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
      price === "" ||
      stock === "" ||
      !image
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setUpdating(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login as admin");
        return;
      }

      const response = await axios.put(
        `${PRODUCT_API}/update/${id}`,
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
            "Product updated successfully"
        );

        navigate("/admin/products");
      } else {
        toast.error(
          response.data.message ||
            "Product update failed"
        );
      }
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update product"
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
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update product information
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
            >
              <option value="">
                Select Category
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
                alt={formData.name}
                className="h-40 w-40 rounded-lg border object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* UPDATE BUTTON */}
          <button
            type="submit"
            disabled={updating}
            className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating
              ? "Updating Product..."
              : "Update Product"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditProduct;
