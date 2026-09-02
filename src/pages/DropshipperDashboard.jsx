import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getApiBaseUrl } from "../utils/subdomainUtils";

const DropshipperDashboard = () => {
  const navigate = useNavigate();
  const apiUrl = getApiBaseUrl();

  const [dropshipper, setDropshipper] = useState(null);
  const [theme, setTheme] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [themeFormData, setThemeFormData] = useState({
    primaryColor: "#007bff",
    secondaryColor: "#6c757d",
    accentColor: "#28a745",
    companyName: "",
    tagline: "",
    logoUrl: "",
    customCSS: "",
  });

  const [profileFormData, setProfileFormData] = useState({
    businessName: "",
    businessDescription: "",
    whatsappNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Get token from localStorage
  const token = localStorage.getItem("dropshipperToken");

  useEffect(() => {
    if (!token) {
      navigate("/dropshipper-login");
      return;
    }

    fetchDropshipperData();
  }, [token, navigate, apiUrl]);

  const fetchDropshipperData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${apiUrl}/dropshipper/profile`, { headers });

      if (response.data.success) {
        setDropshipper(response.data.dropshipper);
        setTheme(response.data.dropshipper.theme);
        setProducts(response.data.dropshipper.products || []);

        // Populate forms
        setProfileFormData({
          businessName: response.data.dropshipper.businessName || "",
          businessDescription: response.data.dropshipper.businessDescription || "",
          whatsappNumber: response.data.dropshipper.whatsappNumber || "",
          address: response.data.dropshipper.address || "",
          city: response.data.dropshipper.city || "",
          state: response.data.dropshipper.state || "",
          zipCode: response.data.dropshipper.zipCode || "",
        });

        if (response.data.dropshipper.theme) {
          setThemeFormData({
            primaryColor: response.data.dropshipper.theme.primaryColor || "#007bff",
            secondaryColor: response.data.dropshipper.theme.secondaryColor || "#6c757d",
            accentColor: response.data.dropshipper.theme.accentColor || "#28a745",
            companyName: response.data.dropshipper.theme.companyName || "",
            tagline: response.data.dropshipper.theme.tagline || "",
            logoUrl: response.data.dropshipper.theme.logoUrl || "",
            customCSS: response.data.dropshipper.theme.customCSS || "",
          });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
      if (error.response?.status === 401) {
        localStorage.removeItem("dropshipperToken");
        navigate("/dropshipper-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.put(
        `${apiUrl}/dropshipper/profile/update`,
        profileFormData,
        { headers }
      );

      if (response.data.success) {
        setDropshipper(response.data.dropshipper);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.put(
        `${apiUrl}/dropshipper/theme/update`,
        themeFormData,
        { headers }
      );

      if (response.data.success) {
        setTheme(response.data.theme);
        toast.success("Theme updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Theme update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dropshipperToken");
    localStorage.removeItem("dropshipperData");
    toast.success("Logged out successfully");
    navigate("/dropshipper-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dropshipper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{dropshipper.businessName || dropshipper.name}</h1>
            <p className="text-gray-600">
              Store: {dropshipper.subdomain}.frontend-q.com
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          {["overview", "profile", "theme", "products"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 font-semibold ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Total Products</p>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold">{dropshipper.totalOrders || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Store Rating</p>
              <p className="text-3xl font-bold">{dropshipper.rating || "0"}/5</p>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white p-8 rounded-lg shadow max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Business Profile</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={profileFormData.businessName}
                  onChange={(e) =>
                    setProfileFormData({ ...profileFormData, businessName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                <textarea
                  value={profileFormData.businessDescription}
                  onChange={(e) =>
                    setProfileFormData({ ...profileFormData, businessDescription: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  value={profileFormData.whatsappNumber}
                  onChange={(e) =>
                    setProfileFormData({ ...profileFormData, whatsappNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={profileFormData.address}
                  onChange={(e) =>
                    setProfileFormData({ ...profileFormData, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={profileFormData.city}
                    onChange={(e) =>
                      setProfileFormData({ ...profileFormData, city: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={profileFormData.state}
                    onChange={(e) =>
                      setProfileFormData({ ...profileFormData, state: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={profileFormData.zipCode}
                    onChange={(e) =>
                      setProfileFormData({ ...profileFormData, zipCode: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === "theme" && (
          <div className="bg-white p-8 rounded-lg shadow max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Customize Theme</h2>
            <form onSubmit={handleThemeUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={themeFormData.companyName}
                  onChange={(e) =>
                    setThemeFormData({ ...themeFormData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                <input
                  type="text"
                  value={themeFormData.tagline}
                  onChange={(e) =>
                    setThemeFormData({ ...themeFormData, tagline: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex">
                    <input
                      type="color"
                      value={themeFormData.primaryColor}
                      onChange={(e) =>
                        setThemeFormData({ ...themeFormData, primaryColor: e.target.value })
                      }
                      className="w-16 h-10 border border-gray-300 rounded-l cursor-pointer"
                    />
                    <input
                      type="text"
                      value={themeFormData.primaryColor}
                      onChange={(e) =>
                        setThemeFormData({ ...themeFormData, primaryColor: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-l-0 border-gray-300 rounded-r"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <div className="flex">
                    <input
                      type="color"
                      value={themeFormData.secondaryColor}
                      onChange={(e) =>
                        setThemeFormData({ ...themeFormData, secondaryColor: e.target.value })
                      }
                      className="w-16 h-10 border border-gray-300 rounded-l cursor-pointer"
                    />
                    <input
                      type="text"
                      value={themeFormData.secondaryColor}
                      onChange={(e) =>
                        setThemeFormData({ ...themeFormData, secondaryColor: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-l-0 border-gray-300 rounded-r"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                  <div className="flex">
                    <input
                      type="color"
                      value={themeFormData.accentColor}
                      onChange={(e) =>
                        setThemeFormData({ ...themeFormData, accentColor: e.target.value })
                      }
                      className="w-16 h-10 border border-gray-300 rounded-l cursor-pointer"
                    />
                    <input
                      type="text"
                      value={themeFormData.accentColor}
                      onChange={(e) =>
                        setThemeFormData({ ...themeFormData, accentColor: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-l-0 border-gray-300 rounded-r"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={themeFormData.logoUrl}
                  onChange={(e) =>
                    setThemeFormData({ ...themeFormData, logoUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
                <textarea
                  value={themeFormData.customCSS}
                  onChange={(e) =>
                    setThemeFormData({ ...themeFormData, customCSS: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows="6"
                  placeholder="Add your custom CSS here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Theme"}
              </button>
            </form>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Products ({products.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product._id} className="bg-white p-4 rounded-lg shadow">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">₹{product.price}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-8">
                  No products yet. Add your first product!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropshipperDashboard;
