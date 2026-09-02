import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";

const API_URL = "https://backend-13-7nod.onrender.com";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const inputRef = useRef(null);

  // ==========================================
  // PHONE
  // ==========================================

  const phone = location.state?.phone || "";

  // ==========================================
  // STATE
  // ==========================================

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // CHECK PHONE
  // ==========================================

  useEffect(() => {
    if (!phone) {
      toast.error("Mobile number not found");

      navigate("/send-otp", {
        replace: true,
      });

      return;
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [phone, navigate]);

  // ==========================================
  // OTP CHANGE
  // ==========================================

  const handleOtpChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    // Prevent duplicate request
    if (loading) {
      return;
    }

    // ========================================
    // VALIDATION
    // ========================================

    if (!phone) {
      toast.error("Mobile number is missing");

      navigate("/send-otp", {
        replace: true,
      });

      return;
    }

    if (!otp) {
      toast.error("Please enter OTP");
      inputRef.current?.focus();
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      inputRef.current?.focus();
      return;
    }

    try {
      setLoading(true);

      // ======================================
      // API
      // ======================================

      const response = await axios.post(
        `${API_URL}/api/user/verify-otp`,
        {
          phone,
          otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "VERIFY OTP RESPONSE:",
        response.data
      );

      const data = response.data;

      // ======================================
      // SUCCESS CHECK
      // ======================================

      if (!data?.success) {
        toast.error(
          data?.message ||
            "OTP verification failed"
        );

        return;
      }

      // ======================================
      // SAVE TOKEN
      // ======================================

      if (data?.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      // ======================================
      // SAVE USER
      // ======================================

      if (data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // ======================================
      // GET ROLE
      // ======================================

      const role =
        data?.user?.role ||
        data?.role ||
        "user";

      console.log(
        "VERIFIED USER:",
        data?.user
      );

      console.log(
        "USER ROLE:",
        role
      );

      // ======================================
      // SAVE ROLE
      // ======================================

      localStorage.setItem(
        "role",
        role
      );

      // ======================================
      // SUCCESS MESSAGE
      // ======================================

      toast.success(
        data?.message ||
          "Login successful"
      );

      // ======================================
      // ADMIN
      // ======================================

      if (role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });

        return;
      }

      // ======================================
      // USER
      // ======================================

      if (role === "user") {
        navigate("/", {
          replace: true,
        });

        return;
      }

      // ======================================
      // UNKNOWN ROLE
      // ======================================

      console.warn(
        "Unknown user role:",
        role
      );

      toast.error(
        "Invalid user role"
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

    } catch (error) {
      console.error(
        "VERIFY OTP ERROR:",
        error
      );

      // ======================================
      // SERVER ERROR
      // ======================================

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "OTP verification failed";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHANGE NUMBER
  // ==========================================

  const handleChangeNumber = () => {
    if (loading) {
      return;
    }

    navigate("/send-otp", {
      replace: true,
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">

          {/* ================================= */}
          {/* ICON */}
          {/* ================================= */}

          <div className="flex justify-center mb-5">

            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">

              <ShieldCheck
                size={32}
                className="text-green-600"
              />

            </div>

          </div>

          {/* ================================= */}
          {/* HEADING */}
          {/* ================================= */}

          <div className="text-center mb-8">

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Verify OTP
            </h1>

            <p className="text-gray-500 mt-2 text-sm">
              Enter the 6-digit OTP sent to
            </p>

            <p className="font-semibold text-gray-800 mt-1">
              +91 {phone}
            </p>

          </div>

          {/* ================================= */}
          {/* FORM */}
          {/* ================================= */}

          <form onSubmit={handleVerifyOtp}>

            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter OTP
            </label>

            <input
              ref={inputRef}
              id="otp"
              name="otp"
              type="tel"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6 digit OTP"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={loading}
              className="w-full border border-gray-300 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.6em] font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            {/* ================================= */}
            {/* COUNTER */}
            {/* ================================= */}

            <div className="flex justify-end mt-2">

              <span className="text-xs text-gray-400">
                {otp.length}/6
              </span>

            </div>

            {/* ================================= */}
            {/* VERIFY BUTTON */}
            {/* ================================= */}

            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2"
            >

              {loading ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP

                  <ArrowRight
                    size={20}
                  />
                </>
              )}

            </button>

          </form>

          {/* ================================= */}
          {/* CHANGE NUMBER */}
          {/* ================================= */}

          <button
            type="button"
            onClick={handleChangeNumber}
            disabled={loading}
            className="w-full mt-5 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 disabled:text-gray-400 text-sm font-medium transition"
          >

            <ArrowLeft size={17} />

            Change Mobile Number

          </button>

        </div>

      </div>

    </div>
  );
};

export default VerifyOtp;