import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Input from "components/ui/Input";

const Login = () => {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    email:"",
    password:""
  });

  const [error,setError] = useState("");

  const handleChange = (e)=>{
    const {name,value} = e.target;
    setFormData(prev => ({...prev,[name]:value}));
  };

  const handleSubmit = (e)=>{
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === formData.email);

    if(!user){
      setError("User not found. Please register first.");
      return;
    }

    localStorage.setItem("user",JSON.stringify(user));

    navigate("/dashboard");
  };

  return (

    <div className="min-h-screen" style={{background:"var(--color-background)"}}>

      <Header
        isAuthenticated={false}
        user={null}
        onLogout={()=>{}}
      />

      <div className="main-content-offset"/>

      <main className="max-w-md mx-auto px-4 py-16">

        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{
            background:"var(--color-card)",
            border:"1px solid var(--color-border)"
          }}
        >

          <div className="text-center mb-6">

            <div
              className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3"
              style={{background:"var(--color-primary)"}}
            >
              <Icon name="LogIn" size={26} color="#fff"/>
            </div>

            <h2
              className="text-2xl font-bold"
              style={{fontFamily:"Poppins, sans-serif"}}
            >
              Login to YojanaSathi
            </h2>

            <p className="text-sm mt-2 text-gray-500">
              Access your personalized scheme dashboard
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              iconName="LogIn"
              iconPosition="left"
            >
              Login
            </Button>

          </form>

        </div>

      </main>

    </div>
  );
};

export default Login;