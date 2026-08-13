import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  FaUsers,
  FaBox,
  FaTags,
  FaShoppingCart,
  FaRupeeSign,
  FaSyncAlt,
  FaUserShield,
  FaTimes,
} from "react-icons/fa";

const API_URL = "https://e-comm-4-39jg.onrender.com/api/admin/dashboard";
const CREATE_ADMIN_URL = "https://e-comm-4-39jg.onrender.com/api/admin/create-admin";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // CREATE ADMIN MODAL
  // ==========================================
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);

  const [adminData, setAdminData] = useState({
    name: "",
    phone: "",
  });

  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // ==========================================
  // GET DASHBOARD
  // ==========================================
  const getDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Dashboard Response:", response.data);

      const data = response.data;

      if (data.success) {
        const dashboardData = data.dashboard || {};

        setDashboard({
          totalUsers: dashboardData.totalUsers || 0,
          totalProducts: dashboardData.totalProducts || 0,
          totalCategories:
            dashboardData.totalCategories || 0,
          totalOrders:
            dashboardData.totalOrders || 0,
          totalRevenue:
            dashboardData.totalRevenue || 0,
        });
      } else {
        toast.error(
          data.message || "Unable to load dashboard"
        );
      }
    } catch (error) {
      console.error("Dashboard Error:", error);

      console.error(
        "Backend Response:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        return;
      }

      if (error.response?.status === 403) {
        toast.error(
          "Only admin can access dashboard"
        );
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // CREATE ADMIN INPUT
  // ==========================================
  const handleAdminChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const phoneValue = value
        .replace(/\D/g, "")
        .slice(0, 10);

      setAdminData({
        ...adminData,
        phone: phoneValue,
      });

      return;
    }

    setAdminData({
      ...adminData,
      [name]: value,
    });
  };

  // ==========================================
  // CREATE ADMIN
  // ==========================================
  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!adminData.name.trim()) {
      toast.error("Please enter admin name");
      return;
    }

    if (adminData.phone.length !== 10) {
      toast.error(
        "Please enter valid 10 digit phone number"
      );
      return;
    }

    try {
      setCreatingAdmin(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        CREATE_ADMIN_URL,
        {
          name: adminData.name.trim(),
          phone: adminData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Create Admin Response:",
        response.data
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Admin created successfully"
        );

        setAdminData({
          name: "",
          phone: "",
        });

        setShowCreateAdmin(false);

        // Dashboard count refresh
        getDashboard(true);
      } else {
        toast.error(
          response.data.message ||
            "Unable to create admin"
        );
      }
    } catch (error) {
      console.error(
        "Create Admin Error:",
        error
      );

      console.error(
        "Backend Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to create admin"
      );
    } finally {
      setCreatingAdmin(false);
    }
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================
  const closeCreateAdmin = () => {
    if (creatingAdmin) return;

    setShowCreateAdmin(false);

    setAdminData({
      name: "",
      phone: "",
    });
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================
  useEffect(() => {
    getDashboard();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />

          <h2 className="text-xl font-bold text-gray-800">
            Loading Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Overview of your store
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          {/* CREATE ADMIN */}
          <button
            onClick={() =>
              setShowCreateAdmin(true)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            <FaUserShield />

            Create Admin
          </button>

          {/* REFRESH */}
          <button
            onClick={() => getDashboard(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <FaSyncAlt
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>
      </div>

      {/* =====================================
          CARDS
      ====================================== */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">

        {/* USERS */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">

            <div>
              <p className="font-medium text-gray-500">
                Total Users
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {dashboard.totalUsers}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-2xl text-green-600">
              <FaUsers />
            </div>

          </div>
        </div>

        {/* PRODUCTS */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">

            <div>
              <p className="font-medium text-gray-500">
                Total Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {dashboard.totalProducts}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-600">
              <FaBox />
            </div>

          </div>
        </div>

        {/* CATEGORIES */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">

            <div>
              <p className="font-medium text-gray-500">
                Total Categories
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {dashboard.totalCategories}
              </h2>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100 text-2xl text-yellow-600">
              <FaTags />
            </div>

          </div>
        </div>



      </div>

      {/* =====================================
          CREATE ADMIN MODAL
      ====================================== */}
      {showCreateAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* MODAL HEADER */}
            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Create Admin
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new administrator
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateAdmin}
                disabled={creatingAdmin}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-red-100 hover:text-red-600"
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleCreateAdmin}
              className="space-y-5"
            >

              {/* NAME */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Admin Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={adminData.name}
                  onChange={handleAdminChange}
                  placeholder="Enter admin name"
                  disabled={creatingAdmin}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Phone Number
                </label>

                <div className="flex">

                  <span className="flex items-center rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 px-4 font-semibold text-gray-700">
                    +91
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    value={adminData.phone}
                    onChange={handleAdminChange}
                    placeholder="10 digit phone"
                    maxLength={10}
                    inputMode="numeric"
                    disabled={creatingAdmin}
                    className="w-full rounded-r-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600"
                  />

                </div>
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Role
                </label>

                <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 font-semibold text-purple-700">
                  Admin
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeCreateAdmin}
                  disabled={creatingAdmin}
                  className="w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingAdmin}
                  className="w-full rounded-xl bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingAdmin
                    ? "Creating..."
                    : "Create Admin"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;