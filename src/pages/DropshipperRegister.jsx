import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getApiBaseUrl } from "../utils/subdomainUtils";

const DropshipperRegister = () => {
  const navigate = useNavigate();
  const apiUrl = getApiBaseUrl();

  const [step, setStep] = useState(1); // Step 1: Registration, Step 2: OTP Verification
  const [loading, setLoading] = useState(false);
  const [dropshipperId, setDropshipperId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subdomain: "",
    businessName: "",
    businessDescription: "",
  });

  const [verificationData, setVerificationData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // Handle registration step
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.subdomain) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate phone (basic)
    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Validate subdomain
    if (formData.subdomain.length < 3) {
      toast.error("Subdomain must be at least 3 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/dropshipper/register`, formData);

      if (response.data.success) {
        setDropshipperId(response.data.dropshipperId);
        setStep(2);
        toast.success("Registration successful! Please verify your phone number.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification and password setup
  const handleVerifyAndSetPassword = async (e) => {
    e.preventDefault();

    if (!verificationData.otp || !verificationData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (verificationData.password !== verificationData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (verificationData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/dropshipper/verify-otp`, {
        dropshipperId,
        otp: verificationData.otp,
        password: verificationData.password,
      });

      if (response.data.success) {
        toast.success("Account verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/dropshipper-login");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVerificationChange = (e) => {
    const { name, value } = e.target;
    setVerificationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Dropshipper Registration</h1>
        <p className="text-center text-gray-600 mb-8">Join our dropshipping network</p>

        {step === 1 ? (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subdomain *
                <span className="text-sm text-gray-500">.frontend-q.com</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your-shop-name"
                />
                <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                  .frontend-q.com
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Your unique store URL</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your business name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about your business"
                rows="3"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Continue"}
            </button>

            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/dropshipper-login")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login here
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndSetPassword}>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                We've sent an OTP to <strong>{formData.phone}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">OTP *</label>
              <input
                type="text"
                name="otp"
                value={verificationData.otp}
                onChange={handleVerificationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                name="password"
                value={verificationData.password}
                onChange={handleVerificationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={verificationData.confirmPassword}
                onChange={handleVerificationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Complete Registration"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 mt-2"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DropshipperRegister;
