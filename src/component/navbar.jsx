import { useState, useEffect } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHeart,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaSearch,
  FaSun,
  FaMoon,
  FaLightbulb,
} from "react-icons/fa";

import { useTheme } from "../pages/themeContaxt";

function Navbar() {
  const navigate = useNavigate();

  // Dark / Light Mode
  const { darkMode, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("Detecting...");
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const token = localStorage.getItem("token");

 
  // LOGOUT
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);

    navigate("/");
  };

  // SEARCH

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(
        `/search?keyword=${encodeURIComponent(search.trim())}`
      );

      setSearch("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // SEARCH SUGGESTIONS


  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `https://e-comm-4-39jg.onrender.com/api/product/all?keyword=${encodeURIComponent(
            search
          )}`
        );

        if (data.success) {
          setSuggestions(
            Array.isArray(data.products)
              ? data.products.slice(0, 6)
              : []
          );

          setShowSuggestions(true);
        }
      } catch (error) {
        console.log("Search error:", error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // GO TO PRODUCT


  const goToProduct = (id) => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);

    navigate(`/product/${id}`);
  };


  // GET USER PROFILE


  useEffect(() => {
    const getUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const { data } = await axios.get(
          "https://e-commerce-1-rsjs.onrender.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.log("Profile error:", error);
      }
    };

    getUser();
  }, [token]);

  // ==========================================
  // LOCATION
  // ==========================================

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          setLocation(
            data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.state ||
              "Unknown"
          );
        } catch (error) {
          console.log("Location error:", error);
          setLocation("Unknown");
        }
      },
      () => {
        setLocation("Permission Denied");
      }
    );
  }, []);

  // ==========================================
  // NAV LINK CLASS
  // ==========================================

  const navClass = ({ isActive }) =>
    `
      px-3
      py-2
      rounded-lg
      flex
      items-center
      gap-2
      transition
      duration-200

      ${
        isActive
          ? "bg-green-600 text-white"
          : `
            text-gray-700
            dark:text-gray-200
            hover:bg-green-100
            dark:hover:bg-gray-800
            hover:text-green-700
            dark:hover:text-green-400
          `
      }
    `;

  // ==========================================
  // SEARCH SUGGESTIONS
  // ==========================================

  const SearchSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) {
      return null;
    }

    return (
      <div
        className="
          absolute
          top-12
          left-0
          right-0
          z-50
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          dark:border-gray-700
          bg-white
          dark:bg-gray-900
          shadow-2xl
        "
      >
        {suggestions.map((item) => {
          const image = Array.isArray(item.image)
            ? item.image[0]
            : item.image;

          return (
            <div
              key={item._id}
              onMouseDown={() => goToProduct(item._id)}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                cursor-pointer
                border-b
                border-gray-100
                dark:border-gray-700
                last:border-b-0
                hover:bg-green-50
                dark:hover:bg-gray-800
              "
            >
              <img
                src={image}
                alt={item.name}
                className="
                  w-10
                  h-10
                  rounded
                  object-cover
                  bg-gray-100
                  dark:bg-gray-800
                "
              />

              <div className="flex-1 min-w-0">
                <p
                  className="
                    font-semibold
                    text-gray-900
                    dark:text-white
                    truncate
                  "
                >
                  {item.name}
                </p>

                <p className="text-sm font-bold text-green-600">
                  ₹{item.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav
        className="
          sticky
          top-0
          z-50
          bg-white
          dark:bg-gray-900
          border-b
          border-gray-200
          dark:border-gray-800
          shadow-sm
          dark:shadow-black/30
          transition-colors
          duration-300
        "
      >
        <div className="max-w-7xl mx-auto px-4">

          {/* ==================================================
              MAIN NAVBAR
          ================================================== */}

          <div className="h-16 flex items-center justify-between gap-4">

            {/* ==================================================
                LOGO
            ================================================== */}

            <Link
              to="/"
              className="
                text-2xl
                font-bold
                whitespace-nowrap
                flex
              "
            >
           <FaLightbulb className="text-2xl text-green-900" /><span className="text-green-600">
                LIGHTS
              </span>
            </Link>

            {/* ==================================================
                DESKTOP SEARCH
            ================================================== */}

            <form
              onSubmit={handleSearch}
              className="
                hidden
                lg:flex
                flex-1
                mx-5
                relative
              "
            >
              <FaSearch
                className="
                  absolute
                  left-4
                  top-3
                  text-gray-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onFocus={() => {
                  if (search.trim() && suggestions.length) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowSuggestions(false);
                  }, 200);
                }}
                placeholder="Search Products..."
                className="
                  w-full
                  rounded-full
                  border
                  border-gray-300
                  dark:border-gray-700
                  bg-white
                  dark:bg-gray-800
                  text-gray-900
                  dark:text-white
                  placeholder-gray-400
                  py-2
                  pl-11
                  pr-5
                  outline-none
                  focus:border-green-600
                  dark:focus:border-green-500
                "
              />

              <SearchSuggestions />
            </form>

            {/* ==================================================
                DESKTOP RIGHT MENU
            ================================================== */}

            <div
              className="
                hidden
                md:flex
                items-center
                gap-2
              "
            >

              {/* LOCATION */}

              <div
                className="
                  hidden
                  xl:flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-full
                  bg-green-50
                  dark:bg-green-950
                  text-gray-700
                  dark:text-gray-200
                "
              >
                <FaMapMarkerAlt
                  className="text-green-600"
                />

                <span className="text-sm">
                  {location}
                </span>
              </div>

              {/* HOME */}

              <NavLink
                to="/"
                className={navClass}
              >
                Home
              </NavLink>

              {/* PRODUCTS */}

              <NavLink
                to="/products"
                className={navClass}
              >
                Products
              </NavLink>

              {/* ==================================================
                  DARK / LIGHT MODE
              ================================================== */}

              <button
                type="button"
                onClick={toggleTheme}
                title={
                  darkMode
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
                className="
                  w-10
                  h-10
                  rounded-full
                  hover:cursor-pointer
                  flex
                  items-center
                  justify-center
                  bg-gray-100
                  dark:bg-gray-800
                  text-gray-700
                  dark:text-yellow-400
                  hover:bg-gray-200
                  dark:hover:bg-gray-700
                "
              >
                {darkMode ? (
                  <FaSun />
                ) : (
                  <FaMoon />
                )}
              </button>

              {/* WISHLIST */}

              <NavLink
                to="/wishlist"
                className={navClass}
                title="Wishlist"
              >
                <FaHeart />
              </NavLink>

              {/* CART */}

              <NavLink
                to="/cart"
                className={navClass}
                title="Cart"
              >
                <FaShoppingCart />
              </NavLink>

              {/* ==================================================
                  LOGIN / PROFILE
              ================================================== */}

              {token ? (
                <>
                  <NavLink
                    to="/profile"
                    className={navClass}
                  >
                    <FaUserCircle />

                    <span className="hidden xl:block">
                      {user?.name || "Profile"}
                    </span>
                  </NavLink>

                  <button
                    type="button"
                    onClick={logout}
                    className="
                      px-4
                      py-2
                      rounded-lg
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      hover:cursor-pointer
                    "
                  >
                    Logout
                  </button>

                  <a
                href="https://wa.me/917230910907?text=Hello%20I%20want%20to%20inquire%20about%20your%20products"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border-2 border-green-700 bg-white px-7 py-3.5 font-semibold text-green-700 shadow-md transition hover:bg-green-700 hover:text-white dark:bg-gray-800 dark:text-green-400"
              >
                💬 WhatsApp Inquiry
              </a>
                  
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={navClass}
                  >
                    Login
                  </NavLink>

                  <Link
                    to="/signup"
                    className="
                      px-4
                      py-2
                      rounded-lg
                      bg-green-600
                      hover:bg-green-700
                      text-white
                    "
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* ==================================================
                MOBILE MENU BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="
                md:hidden
                text-2xl
                text-gray-700
                dark:text-white
              "
            >
              <FaBars />
            </button>
          </div>

          {/* ==================================================
              MOBILE SEARCH
          ================================================== */}

          <form
            onSubmit={handleSearch}
            className="
              lg:hidden
              relative
              pb-3
            "
          >
            <FaSearch
              className="
                absolute
                left-4
                top-3
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onFocus={() => {
                if (search.trim() && suggestions.length) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(false);
                }, 200);
              }}
              placeholder="Search Products..."
              className="
                w-full
                rounded-full
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder-gray-400
                py-2
                pl-11
                pr-4
                outline-none
                focus:border-green-600
              "
            />

            <SearchSuggestions />
          </form>
        </div>
      </nav>

      {/* ==================================================
          MOBILE SIDE MENU
      ================================================== */}

      {menuOpen && (
        <div className="fixed inset-0 z-[100]">

          {/* OVERLAY */}

          <div
            onClick={() => setMenuOpen(false)}
            className="
              absolute
              inset-0
              bg-black/50
            "
          />

          {/* SIDE MENU */}

          <div
            className="
              absolute
              right-0
              top-0
              h-full
              w-80
              max-w-[85%]
              bg-white
              dark:bg-gray-900
              text-gray-900
              dark:text-white
              shadow-2xl
              p-5
              overflow-y-auto
            "
          >

            {/* MENU HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <h2 className="text-2xl font-bold">
                Menu
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  text-xl
                  text-gray-700
                  dark:text-white
                "
              >
                <FaTimes />
              </button>
            </div>

            {/* MENU LINKS */}

            <div className="mt-8 space-y-2">


              {/* HOME */}

              <NavLink
                to="/"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  flex
                  items-center
                  px-4
                  py-3
                  rounded-lg
                  hover:bg-green-50
                  dark:hover:bg-gray-800
                "
              >
                Home
              </NavLink>

              {/* PRODUCTS */}

              <NavLink
                to="/products"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  flex
                  items-center
                  px-4
                  py-3
                  rounded-lg
                  hover:bg-green-50
                  dark:hover:bg-gray-800
                "
              >
                Products
              </NavLink>

              {/* WISHLIST */}

              <NavLink
                to="/wishlist"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-lg
                  hover:bg-green-50
                  dark:hover:bg-gray-800
                "
              >
                <FaHeart />
                Wishlist
              </NavLink>

              {/* CART */}

              <NavLink
                to="/cart"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-lg
                  hover:bg-green-50
                  dark:hover:bg-gray-800
                "
              >
                <FaShoppingCart />
                Cart
              </NavLink>

              {/* PROFILE */}

              {token && (
                <NavLink
                  to="/profile"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    hover:bg-green-50
                    dark:hover:bg-gray-800
                  "
                >
                  <FaUserCircle />
                  Profile
                </NavLink>
              )}

              {/* ==================================================
                  THEME BUTTON
              ================================================== */}

              <button
                type="button"
                onClick={toggleTheme}
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3
                  rounded-lg
                  bg-gray-100
                  dark:bg-gray-800
                  text-gray-900
                  dark:text-white
                "
              >
                <span>
                  {darkMode
                    ? "Light Mode"
                    : "Dark Mode"}
                </span>

                {darkMode ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon />
                )}
              </button>

            </div>

            {/* ==================================================
                MOBILE LOGIN / REGISTER
            ================================================== */}

            {!token && (
              <div className="mt-8 space-y-3">

                <Link
                  to="/login"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="
                    block
                    w-full
                    text-center
                    bg-gray-100
                    dark:bg-gray-800
                    py-3
                    rounded-lg
                  "
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="
                    block
                    w-full
                    text-center
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    py-3
                    rounded-lg
                  "
                >
                  Register
                </Link>

              </div>
            )}
            <br />
   <a
                href="https://wa.me/917230910907?text=Hello%20I%20want%20to%20inquire%20about%20your%20products"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border-2 border-green-700 bg-white px-7 py-3.5 font-semibold text-green-700 shadow-md transition hover:bg-green-700 hover:text-white dark:bg-gray-800 dark:text-green-400"
              >
                💬 WhatsApp Inquiry
              </a>
            {/* ==================================================
                MOBILE LOGOUT
            ================================================== */}

            {token && (
              <button
                type="button"
                onClick={logout}
                className="
                  mt-8
                  w-full
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  py-3
                  rounded-lg
                "
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;