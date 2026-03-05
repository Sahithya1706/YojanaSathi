import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "context/LanguageContext";
import AppFooter from "components/ui/AppFooter";
import { getUsers } from "utils/auth";

const getUserQuizAttempts = (user) => {
  if (Array.isArray(user?.quizHistory)) return user.quizHistory.length;
  if (Array.isArray(user?.quizAttempts)) return user.quizAttempts.length;
  return Number(user?.quizAttempts || 0);
};

const getUserSavedSchemes = (user) => {
  if (Array.isArray(user?.savedSchemes)) return user.savedSchemes.length;
  if (Array.isArray(user?.savedSchemeIds)) return user.savedSchemeIds.length;
  return Number(user?.savedSchemesCount || 0);
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(Array.isArray(data) ? data : []);
        setUsersError("");
      } catch (error) {
        setUsers([]);
        setUsersError(error?.response?.data?.message || error?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    refreshUsers();
    window.addEventListener("focus", refreshUsers);
    return () => window.removeEventListener("focus", refreshUsers);
  }, []);

  const totalUsers = users.length;
  const bannedUsers = useMemo(() => users.filter((user) => user?.banned).length, [users]);
  const quizAttempts = useMemo(
    () => users.reduce((total, user) => total + getUserQuizAttempts(user), 0),
    [users]
  );
  const savedSchemes = useMemo(
    () => users.reduce((total, user) => total + getUserSavedSchemes(user), 0),
    [users]
  );

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-blue-900">{t("admin.dashboardTitle")}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          {t("admin.logout")}
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <Link to="/admin/users" className="bg-white border px-4 py-2 rounded hover:bg-gray-50">
          Users
        </Link>
        <Link to="/admin/schemes" className="bg-white border px-4 py-2 rounded hover:bg-gray-50">
          Schemes
        </Link>
        <Link to="/admin/analytics" className="bg-white border px-4 py-2 rounded hover:bg-gray-50">
          Analytics
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-blue-700">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Banned Users</p>
          <p className="text-3xl font-bold text-red-600">{bannedUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Quiz Attempts</p>
          <p className="text-3xl font-bold text-emerald-600">{quizAttempts}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Saved Schemes</p>
          <p className="text-3xl font-bold text-amber-600">{savedSchemes}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-lg font-semibold mb-4">Recent Registered Users</h2>
        {loading && <p className="text-sm text-gray-600">Loading users...</p>}
        {!loading && usersError && <p className="text-sm text-red-600">{usersError}</p>}
        {!loading && !usersError && users.length === 0 && (
          <p className="text-sm text-gray-600">No users found.</p>
        )}
        {!loading && !usersError && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-3 text-left text-sm">Name</th>
                  <th className="p-3 text-left text-sm">Email</th>
                  <th className="p-3 text-left text-sm">State</th>
                  <th className="p-3 text-left text-sm">Registered On</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user?._id || user?.email} className="border-t">
                    <td className="p-3 text-sm">{user?.name || "-"}</td>
                    <td className="p-3 text-sm">{user?.email || "-"}</td>
                    <td className="p-3 text-sm">{user?.state || "-"}</td>
                    <td className="p-3 text-sm">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AppFooter minimal />
    </div>
  );
};

export default AdminDashboard;
