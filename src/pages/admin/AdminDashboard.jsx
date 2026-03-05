import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

  const navigate = useNavigate()

  const logout = () =>{
    localStorage.removeItem("admin")
    navigate("/admin/login")
  }

  return (

    <div className="min-h-screen bg-blue-50 p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-3xl font-bold text-blue-900">
          YojanaSathi Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

      <div className="grid grid-cols-3 gap-6">

        <div
          onClick={()=>navigate("/admin/schemes")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Schemes</h2>
          <p>Add or remove government schemes</p>
        </div>

        <div
          onClick={()=>navigate("/admin/users")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-2">View Users</h2>
          <p>See registered platform users</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p>Coming Soon</p>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;