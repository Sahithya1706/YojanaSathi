import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import AppFooter from "components/ui/AppFooter";
import { deleteUserById, getUsers, toggleUserBan } from "utils/auth";

const ManageUsers = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setUsers([]);
      setError(err?.response?.data?.message || err?.message || "Unable to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserById(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user?._id !== userId));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to delete user.");
    }
  };

  const handleToggleBan = async (user) => {
    try {
      const updatedUser = await toggleUserBan(user?._id, !Boolean(user?.banned));
      setUsers((prevUsers) =>
        prevUsers.map((item) => (item?._id === updatedUser?._id ? updatedUser : item))
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to update ban status.");
    }
  };

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return users;

    return users.filter((user) => {
      const fields = [user?.name, user?.email, user?.state, user?.occupation]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());
      return fields.some((field) => field.includes(keyword));
    });
  }, [users, searchTerm]);

  return (
    <div className="p-10 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("admin.registeredUsers")}</h1>
        <div className="flex gap-3">
          <Link to="/admin/dashboard" className="bg-white border px-4 py-2 rounded hover:bg-gray-50">
            Dashboard
          </Link>
          <button
            onClick={() => navigate("/admin/schemes")}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Schemes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name, email, state or occupation"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {loading && <div className="bg-white p-8 rounded shadow text-center">Loading users...</div>}
      {!loading && error && <div className="bg-white p-8 rounded shadow text-center text-red-600">{error}</div>}

      {!loading && !error && filteredUsers.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          {users.length === 0 ? t("admin.noUsers") : "No users found for this search."}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow rounded overflow-hidden">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-4 text-left">#</th>
                  <th className="text-left">Name</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Occupation</th>
                  <th className="text-left">State</th>
                  <th className="text-left">Created Date</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">{t("admin.action")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user?._id || index} className="border-t">
                    <td className="p-4">{index + 1}</td>
                    <td>{user?.name || "-"}</td>
                    <td>{user?.email || "-"}</td>
                    <td>{user?.occupation || "-"}</td>
                    <td>{user?.state || "-"}</td>
                    <td>{user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          user?.banned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user?.banned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleBan(user)}
                          className={`px-3 py-1 text-xs text-white rounded ${
                            user?.banned ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"
                          }`}
                        >
                          {user?.banned ? "Unban User" : "Ban User"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user?._id)}
                          className="px-3 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded"
                        >
                          Delete User
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <AppFooter minimal />
    </div>
  );
};

export default ManageUsers;
