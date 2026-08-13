import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = "https://e-comm-4-39jg.onrender.com/api/user";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // NAME CHANGE
  // ==============================
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // ==============================
  // PHONE CHANGE
  // ==============================
  const handlePhoneChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setPhone(value);
  };

  // ==============================
  // REGISTER
  // ==============================
  const handleRegister = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      toast.error("Please enter your name");
      return;
    }

    if (cleanName.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Please enter valid 10 digit phone number");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        name: cleanName,
        phone: phone,
        type: "register",
      };

      console.log("Register Request:", requestData);

      const response = await axios.post(
        `${API_URL}/send`,
        requestData
      );

      console.log("Register Response:", response.data);

      const data = response.data;

      if (!data.success) {
        toast.error(
          data.message || "Unable to send OTP"
        );
        return;
      }

      // ==============================
      // SAVE DATA
      // ==============================

      localStorage.setItem("phone", phone);
      localStorage.setItem("name", cleanName);

      if (data.user?._id) {
        localStorage.setItem(
          "userId",
          data.user._id
        );
      }

      if (data.userId) {
        localStorage.setItem(
          "userId",
          data.userId
        );
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // Static OTP
      if (data.otp) {
        localStorage.setItem(
          "otp",
          data.otp
        );

        console.log("OTP:", data.otp);
      }

      toast.success(
        data.message || "OTP sent successfully"
      );

      // OTP page
      navigate("/login");

    } catch (error) {
      console.error(
        "Register Error:",
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
          "Unable to register"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">

        {/* ============================== */}
        {/* TITLE */}
        {/* ============================== */}

        <h1 className="text-center text-3xl font-bold text-green-600">
          Create Account
        </h1>

        <p className="mt-2 text-center text-gray-500 dark:text-gray-300">
          Register with your name and phone number
        </p>

        {/* ============================== */}
        {/* FORM */}
        {/* ============================== */}

        <form
          onSubmit={handleRegister}
          className="mt-8 space-y-5"
        >

          {/* NAME */}

          <div>
            <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-200">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={loading}
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
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10 digit number"
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel"
                disabled={loading}
                className="w-full rounded-r-xl border border-gray-300 bg-white px-4 py-4 text-lg text-gray-900 outline-none focus:border-green-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />

            </div>

            {phone && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                +91 {phone}
              </p>
            )}
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={
              loading ||
              !name.trim() ||
              phone.length !== 10
            }
            className="w-full rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Sending OTP..."
              : "Create Account"}
          </button>

        </form>

        {/* LOGIN */}

        <div className="mt-6 text-center">

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            disabled={loading}
            className="mt-2 font-semibold text-green-600 hover:text-green-700"
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;