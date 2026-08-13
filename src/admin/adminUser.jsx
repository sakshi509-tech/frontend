import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // BACKEND URL
  // ==========================================

  const API_URL = "https://e-comm-4-39jg.onrender.com/api";

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // GET ALL USERS
  // ==========================================

  const getUsers = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        toast.error("Please login first");
        return;
      }

      console.log("Getting users...");

      const response = await axios.get(
        `${API_URL}/user/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Users Response:", response.data);

      if (response.data?.success) {
        setUsers(response.data.users || []);
      } else {
        toast.error(
          response.data?.message ||
            "Unable to get users"
        );
      }
    } catch (error) {
      console.error("Get Users Error:", error);

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Backend Response:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        toast.error(
          "Session expired. Please login again"
        );

        return;
      }

      if (error.response?.status === 403) {
        toast.error(
          "Only admin can view users"
        );

        return;
      }

      if (error.response?.status === 404) {
        toast.error(
          "Users API not found"
        );

        return;
      }

      if (!error.response) {
        toast.error(
          "Backend server is not reachable"
        );

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const deleteUser = async (id) => {
    if (!id) {
      toast.error("User ID is missing");
      return;
    }

    const token = getToken();

    if (!token) {
      toast.error("Please login first");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await axios.delete(
        `${API_URL}/user/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Delete User Response:",
        response.data
      );

      if (response.data?.success) {
        toast.success(
          response.data.message ||
            "User deleted successfully"
        );

        setUsers((prevUsers) =>
          prevUsers.filter(
            (user) => user._id !== id
          )
        );
      } else {
        toast.error(
          response.data?.message ||
            "Delete failed"
        );
      }
    } catch (error) {
      console.error(
        "Delete User Error:",
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

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        toast.error(
          "Session expired. Please login again"
        );

        return;
      }

      if (error.response?.status === 403) {
        toast.error(
          "Only admin can delete users"
        );

        return;
      }

      if (error.response?.status === 404) {
        toast.error("User not found");
        return;
      }

      if (!error.response) {
        toast.error(
          "Backend server is not reachable"
        );

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    getUsers();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">

          <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />

          <h2 className="text-xl font-bold text-gray-800">
            Loading Users...
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Please wait
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-5 sm:px-5 md:px-8 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* ======================================
            HEADER
        ======================================= */}

        <div className="mb-6 sm:mb-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* TITLE */}

            <div>
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Manage Users
              </h1>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Manage all registered users
              </p>
            </div>

            {/* TOTAL USERS */}

            <div className="w-full rounded-xl border border-green-100 bg-green-50 px-5 py-3 sm:w-auto">

              <div className="flex items-center justify-between gap-8 sm:block">

                <p className="text-sm font-medium text-green-600">
                  Total Users
                </p>

                <p className="text-2xl font-bold text-green-700">
                  {users.length}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            DESKTOP / TABLET TABLE
        ======================================= */}

        <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg md:block">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px]">

              {/* TABLE HEADER */}

              <thead className="bg-gray-100">

                <tr>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    #
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}

              <tbody>

                {users.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="py-20 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                          👤
                        </div>

                        <h3 className="text-lg font-semibold text-gray-700">
                          No Users Found
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          There are no registered users yet.
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  users.map((user, index) => (

                    <tr
                      key={user._id || index}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      {/* NUMBER */}

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">

                            {user.name
                              ? user.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "U"}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-gray-800">
                              {user.name || "N/A"}
                            </p>

                            <p className="text-xs text-gray-400">
                              Registered User
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PHONE */}

                      <td className="px-5 py-4 text-sm text-gray-700">
                        +91 {user.phone || "N/A"}
                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">

                        {user.role === "admin" ? (

                          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                            Admin
                          </span>

                        ) : (

                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            User
                          </span>

                        )}

                      </td>

                      {/* DELETE */}

                      <td className="px-5 py-4">

                        <button
                          onClick={() =>
                            deleteUser(user._id)
                          }
                          disabled={
                            deletingId ===
                            user._id
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >

                          {deletingId ===
                          user._id
                            ? "Deleting..."
                            : "Delete"}

                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ======================================
            MOBILE USER CARDS
        ======================================= */}

        <div className="space-y-4 md:hidden">

          {users.length === 0 ? (

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center shadow">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                👤
              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                No Users Found
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                There are no registered users yet.
              </p>

            </div>

          ) : (

            users.map((user, index) => (

              <div
                key={user._id || index}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md"
              >

                {/* CARD TOP */}

                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

                    {/* AVATAR */}

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">

                      {user.name
                        ? user.name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}

                    </div>

                    {/* NAME */}

                    <div className="min-w-0">

                      <h3 className="truncate font-bold text-gray-800">

                        {user.name || "N/A"}

                      </h3>

                      <p className="text-xs text-gray-400">
                        User #{index + 1}
                      </p>

                    </div>

                  </div>

                  {/* ROLE */}

                  {user.role === "admin" ? (

                    <span className="shrink-0 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                      Admin
                    </span>

                  ) : (

                    <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      User
                    </span>

                  )}

                </div>

                {/* CARD DETAILS */}

                <div className="mt-4 space-y-3 rounded-xl bg-gray-50 p-3">

                  {/* PHONE */}

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-sm text-gray-500">
                      Phone
                    </span>

                    <span className="break-all text-right text-sm font-semibold text-gray-700">
                      +91 {user.phone || "N/A"}
                    </span>

                  </div>

                  {/* ID */}

                  <div className="flex items-start justify-between gap-3">

                    <span className="shrink-0 text-sm text-gray-500">
                      User ID
                    </span>

                    <span className="break-all text-right text-xs text-gray-400">
                      {user._id || "N/A"}
                    </span>

                  </div>

                </div>

                {/* DELETE BUTTON */}

                <button
                  onClick={() =>
                    deleteUser(user._id)
                  }
                  disabled={
                    deletingId === user._id
                  }
                  className="mt-4 w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >

                  {deletingId === user._id
                    ? "Deleting..."
                    : "Delete User"}

                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminUsers;