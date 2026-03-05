import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Bar, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from "recharts";
import { useLanguage } from "context/LanguageContext";
import AppFooter from "components/ui/AppFooter";
import { getUsers } from "utils/auth";

const Analytics = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchUsers();
  }, []);

  const usersByState = useMemo(() => {
    const counts = users.reduce((acc, user) => {
      const key = user?.state?.trim() || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, usersCount]) => ({ name, usersCount }));
  }, [users]);

  const usersByOccupation = useMemo(() => {
    const counts = users.reduce((acc, user) => {
      const key = user?.occupation?.trim() || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, usersCount]) => ({ name, usersCount }));
  }, [users]);

  return (
    <div className="min-h-screen bg-blue-50 p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("admin.platformAnalytics")}</h1>
        <div className="flex gap-3">
          <Link to="/admin/dashboard" className="bg-white border px-4 py-2 rounded hover:bg-gray-50">
            Dashboard
          </Link>
          <button
            onClick={() => navigate("/admin/users")}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Manage Users
          </button>
        </div>
      </div>

      {loading && <div className="bg-white p-8 rounded shadow text-center">Loading analytics...</div>}
      {!loading && error && <div className="bg-white p-8 rounded shadow text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Users by State</h2>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={usersByState}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="usersCount" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Users by Occupation</h2>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={usersByOccupation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="usersCount" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <AppFooter minimal />
    </div>
  );
};

export default Analytics;
