import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // BACKEND URL
  // =========================
  const API_URL = "https://e-comm-4-39jg.onrender.com/api";

  // =========================
  // GET ALL USERS
  // =========================
  const getUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      console.log("Token:", token);

      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

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
          response.data?.message || "Unable to get users"
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
        toast.error("Unauthorized. Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return;
      }

      if (error.response?.status === 403) {
        toast.error("Only admin can view users");
        return;
      }

      if (error.response?.status === 404) {
        toast.error("Users API not found");
        return;
      }

      if (!error.response) {
        toast.error(
          "Backend server is not running on port 2000"
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

  // =========================
  // LOAD USERS
  // =========================
  useEffect(() => {
    getUsers();
  }, []);

  // =========================
  // DELETE USER
  // =========================
  const deleteUser = async (id) => {
    if (!id) {
      toast.error("User ID is missing");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
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
          "Backend server is not running"
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

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-800">
            Loading Users...
          </h2>

          <p className="text-gray-500 mt-1">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Users
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all registered users
            </p>
          </div>

          <div className="bg-green-50 border border-green-100 px-5 py-3 rounded-xl">
            <p className="text-sm text-green-600">
              Total Users
            </p>

            <p className="text-2xl font-bold text-green-700">
              {users.length}
            </p>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            {/* TABLE HEADER */}
            <thead className="bg-gray-100">
              <tr>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  #
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
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
                    className="text-center py-16 text-gray-500"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">
                          👤
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-700">
                        No Users Found
                      </h3>

                      <p className="text-sm text-gray-400 mt-1">
                        There are no registered users yet.
                      </p>

                    </div>

                  </td>

                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >

                    {/* NUMBER */}
                    <td className="px-5 py-4 text-gray-600">
                      {index + 1}
                    </td>

                    {/* NAME */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {user.name
                            ? user.name
                                .charAt(0)
                                .toUpperCase()
                            : "U"}
                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {user.name || "N/A"}
                          </p>

                          <p className="text-xs text-gray-400">
                            User
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* PHONE */}
                    <td className="px-5 py-4 text-gray-700">
                      {user.phone || "N/A"}
                    </td>

                    {/* ROLE */}
                    <td className="px-5 py-4">

                      {user.role === "admin" ? (
                        <span className="inline-flex bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
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
                          deletingId === user._id
                        }
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        {deletingId === user._id
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

    </div>
  );
}

export default AdminUsers;