import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../component/navbar";

const API_URL = "https://e-comm-4-39jg.onrender.com/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // GET USER ID
  // ==========================================

  const getUserId = () => {
    // First priority: direct userId
    const userId = localStorage.getItem("userId");

    if (userId) {
      return userId;
    }

    // Second priority: user object
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      return (
        parsedUser?._id ||
        parsedUser?.id ||
        parsedUser?.user?._id ||
        parsedUser?.user?.id ||
        null
      );
    } catch (error) {
      console.error("User Parse Error:", error);
      return null;
    }
  };

  // ==========================================
  // GET PROFILE
  // ==========================================

  const getProfile = async () => {
    const token = getToken();

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const userId = getUserId();

    console.log("USER ID:", userId);

    if (!userId) {
      toast.error("User ID not found. Please login again");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");

      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/user/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PROFILE RESPONSE:", response.data);

      if (!response.data.success) {
        toast.error(
          response.data.message ||
            "Unable to load profile"
        );
        return;
      }

      // ==========================================
      // GET ACTUAL USER FROM DATABASE
      // ==========================================

      const profile = response.data.user;

      console.log("DATABASE USER:", profile);
      console.log("DATABASE NAME:", profile?.name);

      if (!profile) {
        toast.error("Profile data not found");
        return;
      }

      // ==========================================
      // SET USER
      // ==========================================

      setUser(profile);

      // ==========================================
      // SET FORM
      // ==========================================

      setFormData({
        name: profile.name || "",
        phone: profile.phone
          ? profile.phone.toString()
          : "",
      });

      // ==========================================
      // UPDATE LOCAL STORAGE
      // ==========================================

      localStorage.setItem(
        "user",
        JSON.stringify(profile)
      );

      if (profile._id) {
        localStorage.setItem(
          "userId",
          profile._id
        );
      }

    } catch (error) {
      console.error("PROFILE ERROR:", error);

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      // ==========================================
      // UNAUTHORIZED
      // ==========================================

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        toast.error(
          "Session expired. Please login again"
        );

        navigate("/login");
        return;
      }

      // ==========================================
      // FORBIDDEN
      // ==========================================

      if (error.response?.status === 403) {
        toast.error("Access denied");
        return;
      }

      // ==========================================
      // NOT FOUND
      // ==========================================

      if (error.response?.status === 404) {
        toast.error("User profile not found");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // PHONE
    if (name === "phone") {
      const onlyNumbers = value
        .replace(/\D/g, "")
        .slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        phone: onlyNumbers,
      }));

      return;
    }

    // NAME
    if (name === "name") {
      const onlyLetters = value
        .replace(/[^a-zA-Z\s]/g, "")
        .slice(0, 50);

      setFormData((prev) => ({
        ...prev,
        name: onlyLetters,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const userId = getUserId();

    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    const name = formData.name.trim();
    const phone = formData.phone.trim();

    // NAME VALIDATION
    if (!name) {
      toast.error("Name is required");
      return;
    }

    if (name.length < 2) {
      toast.error(
        "Name must be at least 2 characters"
      );
      return;
    }

    // PHONE VALIDATION
    if (phone.length !== 10) {
      toast.error(
        "Phone number must be 10 digits"
      );
      return;
    }

    try {
      setSaving(true);

      const requestData = {
        name,
        phone,
      };

      console.log(
        "UPDATE REQUEST:",
        requestData
      );

      const response = await axios.put(
        `${API_URL}/user/update/${userId}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "UPDATE RESPONSE:",
        response.data
      );

      if (!response.data.success) {
        toast.error(
          response.data.message ||
            "Unable to update profile"
        );
        return;
      }

      // ==========================================
      // UPDATED USER
      // ==========================================

      const updatedUser =
        response.data.user || {
          ...user,
          name,
          phone,
        };

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        phone: updatedUser.phone
          ? updatedUser.phone.toString()
          : "",
      });

      // ==========================================
      // UPDATE LOCAL STORAGE
      // ==========================================

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      if (updatedUser._id) {
        localStorage.setItem(
          "userId",
          updatedUser._id
        );
      }

      toast.success(
        response.data.message ||
          "Profile updated successfully"
      );

    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error
      );

      console.error(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      // 401
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        toast.error(
          "Session expired. Please login again"
        );

        navigate("/login");
        return;
      }

      // 403
      if (error.response?.status === 403) {
        toast.error(
          "You are not authorized"
        );
        return;
      }

      // 404
      if (error.response?.status === 404) {
        toast.error("User not found");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Profile update failed"
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("phone");
    localStorage.removeItem("name");
    localStorage.removeItem("otp");

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
  };

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    getProfile();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">

            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />

            <h2 className="mt-5 text-xl font-bold text-gray-700 dark:text-white">
              Loading Profile...
            </h2>

          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // PROFILE NOT FOUND
  // ==========================================

  if (!user) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">

          <div className="text-center">

            <div className="mb-5 text-6xl">
              👤
            </div>

            <h1 className="text-3xl font-bold text-red-500">
              Profile Not Found
            </h1>

            <p className="mt-2 text-gray-500">
              Please login again
            </p>

            <button
              onClick={() =>
                navigate("/login")
              }
              className="mt-6 rounded-xl bg-green-600 px-7 py-3 font-semibold text-white hover:bg-green-700"
            >
              Login
            </button>

          </div>

        </div>
      </>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-4 py-10 dark:bg-gray-900">

        <div className="mx-auto max-w-4xl">

          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-800">

            {/* ==================================
                HEADER
            =================================== */}

            <div className="bg-green-600 px-6 py-12 text-center">

              {/* PROFILE INITIAL */}

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white text-5xl font-bold text-green-600 shadow-xl">

                {user.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}

              </div>

              {/* NAME */}

              <h1 className="mt-5 text-3xl font-bold text-white">

                {user.name || "User"}

              </h1>

              {/* ROLE */}

              <p className="mt-2 capitalize text-green-100">

                {user.role || "user"}

              </p>

              {/* PHONE */}

              <p className="mt-1 text-sm text-green-100">

                +91{" "}
                {user.phone || ""}

              </p>

            </div>

            {/* ==================================
                BODY
            =================================== */}

            <div className="p-6 md:p-10">

              <div className="mb-8">

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Personal Information
                </h2>

                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Update your account information
                </p>

              </div>

              {/* ==================================
                  FORM
              =================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* NAME */}

                <div>

                  <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-200">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="Enter your name"
                    maxLength={50}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-200">
                    Phone Number
                  </label>

                  <div className="flex">

                    <span className="flex items-center rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 px-4 font-semibold text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                      +91
                    </span>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={saving}
                      maxLength={10}
                      inputMode="numeric"
                      placeholder="Enter phone number"
                      className="w-full rounded-r-xl border border-gray-300 bg-white px-4 py-4 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />

                  </div>

                </div>

                {/* ROLE */}

                <div>

                  <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-200">
                    Role
                  </label>

                  <input
                    type="text"
                    value={user.role || "user"}
                    disabled
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-4 capitalize text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  />

                </div>

                {/* UPDATE BUTTON */}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Updating..."
                    : "Update Profile"}
                </button>

              </form>

              {/* ==================================
                  ACCOUNT ACTIONS
              =================================== */}

              <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-700">

                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  Account Actions
                </h3>

                <button
                  onClick={logout}
                  className="w-full rounded-xl border-2 border-red-500 py-3 font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default Profile;