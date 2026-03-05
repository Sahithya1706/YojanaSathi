import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = () => {

    if(email === "admin@yojanasathi.com" && password === "admin123"){
      localStorage.setItem("admin","true");
      navigate("/admin/dashboard");
    }
    else{
      alert("Invalid admin credentials");
    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-blue-50">

      <div className="bg-white p-10 rounded-xl shadow-xl w-[400px]">

        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Admin Panel Login
        </h2>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full border p-3 rounded mb-4"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-6"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded"
        >
          Login
        </button>

      </div>

    </div>
  );
};

export default AdminLogin;