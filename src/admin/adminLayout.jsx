import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaBox,
  FaTags,
  FaBars,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-green-600 text-white shadow"
        : "text-gray-700 hover:bg-green-100 hover:text-green-600"
    }`;

  const links = (
    <nav className="space-y-2">

      <NavLink
        to="/admin/dashboard"
        className={navClass}
        onClick={() => setMenuOpen(false)}
      >
        <FaHome />
        Dashboard
      </NavLink>

      <NavLink
        to="/admin/users"
        className={navClass}
        onClick={() => setMenuOpen(false)}
      >
        <FaUsers />
        Users
      </NavLink>

      <NavLink
        to="/admin/categories"
        className={navClass}
        onClick={() => setMenuOpen(false)}
      >
        <FaTags />
        Categories
      </NavLink>

      <NavLink
        to="/admin/products"
        className={navClass}
        onClick={() => setMenuOpen(false)}
      >
        <FaBox />
        Products
      </NavLink>

    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white shadow flex items-center justify-between px-4 h-14">

        <h1 className="text-xl font-bold flex items-center gap-2">
          <FaUserShield className="text-green-600" />

          <span className="text-green-600">
            Admin
          </span>

          Panel
        </h1>

        <button
          onClick={() => setMenuOpen(true)}
          className="text-2xl"
        >
          <FaBars />
        </button>

      </header>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute left-0 top-0 h-full w-72 bg-white p-5 shadow-2xl">

            <div className="flex justify-between items-center mb-8">

              <h1 className="text-2xl font-bold">
                <span className="text-green-600">
                  Admin
                </span>{" "}
                Panel
              </h1>

              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl"
              >
                <FaTimes />
              </button>

            </div>

            {links}

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="mt-8 block text-center bg-gray-100 py-3 rounded-lg font-semibold"
            >
              ← Back To Store
            </Link>

          </div>
        </div>
      )}

      {/* Desktop */}
      <div className="flex">

        <aside className="hidden md:block w-64 bg-white shadow-lg p-5 min-h-screen sticky top-0">

          <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">

            <FaUserShield className="text-green-600" />

            <span className="text-green-600">
              Admin
            </span>

            Panel

          </h1>

          {links}

          <Link
            to="/"
            className="mt-10 block text-center bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-semibold"
          >
            ← Back To Store
          </Link>

        </aside>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;