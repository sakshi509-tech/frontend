import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL =
  "https://e-comm-4-39jg.onrender.com/api";

function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ==========================================
  // GET TOKEN
  // ==========================================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // GET USER FROM LOCAL STORAGE
  // ==========================================
  const getSavedUser = () => {
    try {
      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);

    } catch (error) {
      console.error(
        "Local user error:",
        error
      );

      return null;
    }
  };

  // ==========================================
  // GET PROFILE
  // GET /api/user/profile/:id
  // ==========================================
  const getProfile = async () => {
    try {
      const token = getToken();

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const savedUser = getSavedUser();

      if (!savedUser) {
        toast.error(
          "User information not found"
        );

        navigate("/login");
        return;
      }

      const userId =
        savedUser._id || savedUser.id;

      if (!userId) {
        toast.error(
          "User ID not found"
        );

        navigate("/login");
        return;
      }

      console.log(
        "User ID:",
        userId
      );

      // ========================================
      // PROFILE API
      // ========================================
      const response = await axios.get(
        `${API_URL}/user/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Profile Response:",
        response.data
      );

      if (response.data.success) {

        const profileUser =
          response.data.user ||
          response.data.data;

        if (!profileUser) {
          toast.error(
            "User data not found"
          );
          return;
        }

        setUser(profileUser);

        setName(
          profileUser.name || ""
        );

        setPhone(
          profileUser.phone
            ? String(profileUser.phone)
            : ""
        );

        // Update localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(profileUser)
        );

      } else {

        toast.error(
          response.data.message ||
            "Profile not found"
        );
      }

    } catch (error) {

      console.error(
        "Get Profile Error:",
        error
      );

      console.error(
        "Server Response:",
        error.response?.data
      );

      // ========================================
      // TOKEN ERROR
      // ========================================
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        toast.error(
          "Session expired. Please login again"
        );

        navigate("/login");

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
  // PAGE LOAD
  // ==========================================
  useEffect(() => {
    getProfile();
  }, []);

  // ==========================================
  // UPDATE PROFILE
  // PUT /api/user/update/:id
  // ==========================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {

      const token = getToken();

      if (!token) {
        toast.error(
          "Please login first"
        );

        navigate("/login");
        return;
      }

      const savedUser =
        getSavedUser();

      if (!savedUser) {
        toast.error(
          "User information not found"
        );

        navigate("/login");
        return;
      }

      const userId =
        savedUser._id ||
        savedUser.id;

      if (!userId) {
        toast.error(
          "User ID not found"
        );

        return;
      }

      // ========================================
      // VALIDATION
      // ========================================
      if (!name.trim()) {
        toast.error(
          "Name is required"
        );

        return;
      }

      if (!phone.trim()) {
        toast.error(
          "Phone number is required"
        );

        return;
      }

      if (phone.trim().length !== 10) {
        toast.error(
          "Please enter valid 10 digit phone number"
        );

        return;
      }

      setUpdating(true);

      console.log(
        "Updating User:",
        userId
      );

      // ========================================
      // UPDATE API
      // ========================================
      const response = await axios.put(
        `${API_URL}/user/update/${userId}`,
        {
          name: name.trim(),
          phone: phone.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      console.log(
        "Update Response:",
        response.data
      );

      // ========================================
      // SUCCESS
      // ========================================
      if (response.data.success) {

        const updatedUser =
          response.data.user ||
          response.data.data;

        if (updatedUser) {

          setUser(updatedUser);

          setName(
            updatedUser.name || ""
          );

          setPhone(
            updatedUser.phone
              ? String(updatedUser.phone)
              : ""
          );

          localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
          );

        } else {

          // If backend doesn't return user
          const oldUser =
            getSavedUser() || {};

          const newUser = {
            ...oldUser,
            name: name.trim(),
            phone: phone.trim(),
          };

          localStorage.setItem(
            "user",
            JSON.stringify(newUser)
          );

          setUser(newUser);
        }

        toast.success(
          response.data.message ||
            "Profile updated successfully"
        );

        // Go back to profile
        navigate("/profile");

      } else {

        toast.error(
          response.data.message ||
            "Profile update failed"
        );
      }

    } catch (error) {

      console.error(
        "Update Profile Error:",
        error
      );

      console.error(
        "Server Response:",
        error.response?.data
      );

      // ========================================
      // TOKEN EXPIRED
      // ========================================
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        toast.error(
          "Session expired. Please login again"
        );

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to update profile"
      );

    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-green-600"></div>

          <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Loading Profile...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">

      <div className="mx-auto max-w-2xl">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate("/profile")
          }
          className="mb-6 font-semibold text-green-600 hover:text-green-700"
        >
          ← Back to Profile
        </button>

        {/* TITLE */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Update your name and phone number
          </p>

        </div>

        {/* CARD */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">

          {/* HEADER */}

          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-8">

            <div className="flex flex-col items-center gap-4">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-green-600 shadow-md">

                {name
                  ? name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}

              </div>

              <div className="text-center">

                <h2 className="text-2xl font-bold text-white">
                  {name || "User"}
                </h2>

                <p className="mt-1 text-green-100">
                  Edit your account information
                </p>

              </div>

            </div>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleUpdate}
            className="space-y-6 p-6 md:p-8"
          >

            {/* NAME */}

            <div>

              <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-200">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />

            </div>

            {/* PHONE */}

            <div>

              <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-200">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => {

                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setPhone(
                    value.slice(0, 10)
                  );

                }}
                maxLength={10}
                inputMode="numeric"
                placeholder="Enter 10 digit phone number"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />

            </div>

            {/* ROLE */}

            <div>

              <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-200">
                Account Role
              </label>

              <input
                type="text"
                value={
                  user?.role || "user"
                }
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
              />

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Role can only be changed by an administrator.
              </p>

            </div>

            {/* BUTTONS */}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">

              <button
                type="submit"
                disabled={updating}
                className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating
                  ? "Updating..."
                  : "Update Profile"}
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  navigate("/profile")
                }
                className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditProfile;