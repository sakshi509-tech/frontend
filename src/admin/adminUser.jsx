import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  User,
  Phone,
  ShieldCheck,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import api from "../api/axios";
import toast from "react-hot-toast";

const AdminUser = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  // =====================================================
  // GET ALL USERS
  // =====================================================

  const getUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/user/all");

      console.log("GET USERS RESPONSE:", response.data);

      const data =
        response.data?.users ||
        response.data?.data ||
        response.data ||
        [];

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("GET USERS ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load users"
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async (user) => {
    if (!user?._id) {
      toast.error("Invalid user ID");
      return;
    }

    // Admin ko delete hone se roko
    if (user.role === "admin") {
      toast.error("Admin user cannot be deleted");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${
        user.name || user.phone || "this user"
      }?`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(user._id);

      const response = await api.delete(
        `/user/delete/${user._id}`
      );

      console.log(
        "DELETE USER RESPONSE:",
        response.data
      );

      setUsers((prevUsers) =>
        prevUsers.filter(
          (item) => item._id !== user._id
        )
      );

      toast.success(
        response.data?.message ||
          "User deleted successfully"
      );
    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete user"
      );
    } finally {
      setDeleting(null);
    }
  };

  // =====================================================
  // SEARCH USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    if (!value) {
      return users;
    }

    return users.filter((user) => {
      const name = String(
        user?.name || ""
      ).toLowerCase();

      const phone = String(
        user?.phone || ""
      ).toLowerCase();

      const role = String(
        user?.role || ""
      ).toLowerCase();

      return (
        name.includes(value) ||
        phone.includes(value) ||
        role.includes(value)
      );
    });
  }, [users, search]);

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    getUsers();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalUsers = users.length;

  const adminUsers = users.filter(
    (user) => user?.role === "admin"
  ).length;

  const normalUsers = users.filter(
    (user) => user?.role !== "admin"
  ).length;

  /*
    Agar tumhare User model me isVerified field hai
    to ye correct count dega.

    Agar isVerified field nahi hai to verifiedUsers = 0.
  */
  const verifiedUsers = users.filter(
    (user) => user?.isVerified === true
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <p className="text-sm font-semibold text-blue-600">
              ADMIN PANEL
            </p>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Users
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all registered users
            </p>
          </div>

          <button
            type="button"
            onClick={getUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          {/* TOTAL USERS */}

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <h2 className="text-3xl font-black text-gray-900 mt-1">
                  {totalUsers}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={24} />
              </div>

            </div>
          </div>

          {/* CUSTOMERS */}

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Customers
                </p>

                <h2 className="text-3xl font-black text-gray-900 mt-1">
                  {normalUsers}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <User size={24} />
              </div>

            </div>
          </div>

          {/* ADMINS */}

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Admins
                </p>

                <h2 className="text-3xl font-black text-gray-900 mt-1">
                  {adminUsers}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>

            </div>
          </div>

          {/* VERIFIED */}

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Verified
                </p>

                <h2 className="text-3xl font-black text-gray-900 mt-1">
                  {verifiedUsers}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle size={24} />
              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            USERS TABLE
        ================================================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* SEARCH */}

          <div className="p-4 sm:p-5 border-b border-gray-200">

            <div className="relative max-w-md">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by name, phone or role..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
              />

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="min-h-[350px] flex items-center justify-center">

              <div className="text-center">

                <Loader2
                  size={40}
                  className="animate-spin text-blue-600 mx-auto"
                />

                <p className="text-gray-500 mt-3">
                  Loading users...
                </p>

              </div>

            </div>

          ) : filteredUsers.length === 0 ? (

            /* =================================================
                EMPTY
            ================================================= */

            <div className="min-h-[350px] flex items-center justify-center px-4">

              <div className="text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                  <Users size={30} />
                </div>

                <h3 className="font-bold text-gray-900 mt-4">
                  {search
                    ? "No users found"
                    : "No users available"}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {search
                    ? "Try changing your search."
                    : "There are no registered users yet."}
                </p>

              </div>

            </div>

          ) : (

            /* =================================================
                TABLE
            ================================================= */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                {/* TABLE HEAD */}

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody className="divide-y divide-gray-100">

                  {filteredUsers.map((user) => {

                    const isAdmin =
                      user?.role === "admin";

                    const isDeleting =
                      deleting === user?._id;

                    const isVerified =
                      user?.isVerified === true;

                    const userName =
                      user?.name ||
                      "Unknown User";

                    const userPhone =
                      user?.phone ||
                      "No phone";

                    const userId =
                      String(
                        user?._id || ""
                      );

                    return (
                      <tr
                        key={userId}
                        className="hover:bg-gray-50 transition"
                      >

                        {/* USER */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black uppercase">
                              {String(userName)
                                .charAt(0)}
                            </div>

                            <div>

                              <p className="font-bold text-gray-900">
                                {userName}
                              </p>

                              <p className="text-xs text-gray-400">
                                ID:{" "}
                                {userId
                                  ? userId.slice(-8)
                                  : "N/A"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PHONE */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2 text-gray-600">

                            <Phone
                              size={16}
                              className="shrink-0"
                            />

                            <span>
                              {userPhone}
                            </span>

                          </div>

                        </td>

                        {/* ROLE */}

                        <td className="px-6 py-4">

                          {isAdmin ? (

                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">

                              <ShieldCheck size={14} />

                              Admin

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">

                              <User size={14} />

                              User

                            </span>

                          )}

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          {isVerified ? (

                            <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold">

                              <CheckCircle size={16} />

                              Verified

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1.5 text-red-500 text-sm font-semibold">

                              <XCircle size={16} />

                              Not Verified

                            </span>

                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4">

                          <div className="flex justify-end">

                            {isAdmin ? (

                              <span className="text-xs font-semibold text-gray-400 px-3">
                                Protected
                              </span>

                            ) : (

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(user)
                                }
                                disabled={isDeleting}
                                className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete user"
                              >

                                {isDeleting ? (

                                  <Loader2
                                    size={18}
                                    className="animate-spin"
                                  />

                                ) : (

                                  <Trash2
                                    size={18}
                                  />

                                )}

                              </button>

                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default AdminUser;