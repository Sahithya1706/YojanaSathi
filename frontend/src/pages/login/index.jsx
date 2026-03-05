import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import AppFooter from "components/ui/AppFooter";
import { useLanguage } from "context/LanguageContext";
import { login } from "utils/auth";

const Login = () => {

  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData,setFormData] = useState({
    email:"",
    password:""
  });

  const [error,setError] = useState("");

  const handleChange = (e)=>{
    const {name,value} = e.target;
    setFormData(prev => ({...prev,[name]:value}));
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError("");
    const result = await login(formData);
    if (!result.ok) {
      setError(result.message || t("login.invalidCredentials"));
      return;
    }
    navigate(result.redirectTo);
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
              {t("login.title")}
            </h2>

            <p className="text-sm mt-2 text-gray-500">
              {t("login.subtitle")}
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              label={t("login.email")}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("login.emailPlaceholder")}
              required
            />

            <Input
              label={t("login.password")}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("login.passwordPlaceholder")}
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
              {t("login.submit")}
            </Button>

          </form>

          <p className="text-sm text-center mt-4" style={{ color: "var(--color-text-secondary)" }}>
            {t("login.noAccount")}{" "}
            <Link to="/register" className="font-semibold underline" style={{ color: "var(--color-primary)" }}>
              {t("login.registerLink")}
            </Link>
          </p>

        </div>

      </main>

      <AppFooter minimal />

    </div>
  );
};

export default Login;
