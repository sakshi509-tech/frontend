import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = "https://e-comm-4-39jg.onrender.com/api/user";

function OTP() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState(
    localStorage.getItem("phone") || ""
  );

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================
  // PHONE CHANGE
  // =====================================
  const handlePhoneChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setPhone(value);
  };

  // =====================================
  // OTP CHANGE
  // =====================================
  const handleOtpChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);
  };

  // =====================================
  // VERIFY OTP
  // =====================================
  const handleVerify = async (e) => {
    e.preventDefault();

    if (phone.length !== 10) {
      toast.error(
        "Please enter valid 10 digit phone number"
      );
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        phone: phone,
        otp: otp,
      };

      console.log(
        "Verify Request:",
        requestData
      );

      const response = await axios.post(
        `${API_URL}/verify`,
        requestData
      );

      const data = response.data;

      console.log(
        "Verify Response:",
        data
      );

      if (!data.success) {
        toast.error(
          data.message || "Invalid OTP"
        );
        return;
      }

      // =====================================
      // SAVE TOKEN
      // =====================================
      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      // =====================================
      // SAVE USER
      // =====================================
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        if (data.user._id) {
          localStorage.setItem(
            "userId",
            data.user._id
          );
        }
      }

      // Save phone
      localStorage.setItem(
        "phone",
        phone
      );

      // =====================================
      // ROLE
      // =====================================
      const role =
        data.user?.role;

      console.log(
        "Logged In User:",
        data.user
      );

      console.log(
        "User Role:",
        role
      );

      toast.success(
        data.message ||
          "Login successful"
      );

      // =====================================
      // ADMIN
      // =====================================
      if (role === "admin") {
        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      // =====================================
      // USER
      // =====================================
      if (role === "user") {
        navigate("/", {
          replace: true,
        });

        return;
      }

      // =====================================
      // ROLE NOT FOUND
      // =====================================
      toast.error(
        "User role not found"
      );

    } catch (error) {
      console.error(
        "OTP Error:",
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
          "OTP verification failed"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CHANGE PHONE
  // =====================================
  const handleChangePhone = () => {
    setPhone("");
    setOtp("");

    localStorage.removeItem(
      "phone"
    );

    localStorage.removeItem(
      "userId"
    );

    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">

        {/* TITLE */}
        <h2 className="text-center text-3xl font-bold text-green-600">
          Login
        </h2>

        <p className="mt-3 text-center text-gray-500 dark:text-gray-300">
          Enter your phone number and OTP
        </p>

        <form
          onSubmit={handleVerify}
          className="mt-8 space-y-5"
        >

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

          </div>

          {/* OTP */}
          <div>

            <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-200">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6 digit OTP"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-center text-2xl font-bold tracking-[10px] text-gray-900 outline-none focus:border-green-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />

            <p className="mt-2 text-center text-sm text-gray-500">
              Demo OTP: 123456
            </p>

          </div>

          {/* VERIFY */}
          <button
            type="submit"
            disabled={
              loading ||
              phone.length !== 10 ||
              otp.length !== 6
            }
            className="w-full rounded-xl bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Verifying..."
              : "Login"}
          </button>

        </form>

        {/* CHANGE PHONE */}
        <button
          type="button"
          onClick={handleChangePhone}
          disabled={loading}
          className="mt-6 w-full text-sm text-gray-500 transition hover:text-green-600 dark:text-gray-300"
        >
          ← Change Phone Number
        </button>

      </div>

    </div>
  );
}

export default OTP;