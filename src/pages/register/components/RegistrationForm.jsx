import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import { registerUser } from "utils/auth";

const occupationOptions = [
  { value: "", label: "Select Occupation" },
  { value: "farmer", label: "Farmer / Agricultural Worker" },
  { value: "student", label: "Student" },
  { value: "salaried", label: "Salaried Employee" },
  { value: "self_employed", label: "Self Employed / Business" },
  { value: "daily_wage", label: "Daily Wage Worker" },
  { value: "homemaker", label: "Homemaker" },
  { value: "retired", label: "Retired" },
  { value: "unemployed", label: "Unemployed" },
  { value: "other", label: "Other" },
];

const categoryOptions = [
  { value: "", label: "Select Category" },
  { value: "general", label: "General" },
  { value: "obc", label: "OBC (Other Backward Class)" },
  { value: "sc", label: "SC (Scheduled Caste)" },
  { value: "st", label: "ST (Scheduled Tribe)" },
  { value: "ews", label: "EWS (Economically Weaker Section)" },
];

const stateOptions = [
  { value: "", label: "Select State" },
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "delhi", label: "Delhi" },
  { value: "gujarat", label: "Gujarat" },
  { value: "haryana", label: "Haryana" },
  { value: "himachal_pradesh", label: "Himachal Pradesh" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "madhya_pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "odisha", label: "Odisha" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "west_bengal", label: "West Bengal" },
];

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password?.length >= 8) score++;
  if (/[A-Z]/?.test(password)) score++;
  if (/[0-9]/?.test(password)) score++;
  if (/[^A-Za-z0-9]/?.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score === 3) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-green-500" };
};

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    occupation: "",
    category: "",
    state: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const passwordStrength = getPasswordStrength(formData?.password);

  const validate = () => {
    const newErrors = {};
    if (!formData?.fullName?.trim()) newErrors.fullName = "Full name is required";
    else if (formData?.fullName?.trim()?.length < 3) newErrors.fullName = "Name must be at least 3 characters";

    if (!formData?.email?.trim() && !formData?.phone?.trim()) {
      newErrors.email = "Email or phone number is required";
    } else if (formData?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = "Enter a valid email address";
    } else if (formData?.phone && !/^[6-9]\d{9}$/?.test(formData?.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }

    if (!formData?.age) newErrors.age = "Age is required";
    else if (Number(formData?.age) < 1 || Number(formData?.age) > 120) newErrors.age = "Enter a valid age between 1 and 120";

    if (!formData?.gender) newErrors.gender = "Please select your gender";
    if (!formData?.occupation) newErrors.occupation = "Please select your occupation";
    if (!formData?.category) newErrors.category = "Please select your category";
    if (!formData?.state) newErrors.state = "Please select your state";

    if (!formData?.password) newErrors.password = "Password is required";
    else if (formData?.password?.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (passwordStrength?.score < 2) newErrors.password = "Password is too weak. Add uppercase, numbers, or symbols";

    if (!formData?.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData?.password !== formData?.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (!formData?.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors?.[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors?.[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    const userData = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      age: formData.age,
      occupation: formData.occupation,
      category: formData.category,
      state: formData.state,
    };

    const result = await registerUser(userData);
    setIsLoading(false);
    if (!result.ok) {
      setErrors((prev) => ({ ...prev, email: result.message || "Unable to register user." }));
      return;
    }

    setRegistrationSuccess(true);
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  if (registrationSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-success)" }}>
          <Icon name="CheckCircle" size={36} color="#fff" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-foreground)" }}>
          Registration Successful!
        </h2>
        <p className="text-sm md:text-base" style={{ color: "var(--color-text-secondary)" }}>
          Redirecting you to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Full Name */}
      <Input
        label="Full Name"
        type="text"
        name="fullName"
        id="fullName"
        placeholder="Enter your full name"
        value={formData?.fullName}
        onChange={handleChange}
        error={errors?.fullName}
        required
      />
      {/* Email & Phone row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          id="email"
          placeholder="yourname@email.com"
          value={formData?.email}
          onChange={handleChange}
          error={errors?.email}
          description="Used for login and notifications"
        />
        <Input
          label="Mobile Number"
          type="tel"
          name="phone"
          id="phone"
          placeholder="10-digit mobile number"
          value={formData?.phone}
          onChange={handleChange}
          error={errors?.phone}
          description="10-digit Indian mobile number"
          maxLength={10}
        />
      </div>
      {/* Age & Gender row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Age"
          type="number"
          name="age"
          id="age"
          placeholder="Your age in years"
          value={formData?.age}
          onChange={handleChange}
          error={errors?.age}
          required
          min={1}
          max={120}
        />
        {/* Gender */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ fontFamily: "Nunito Sans, sans-serif", color: "var(--color-foreground)" }}>
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3 flex-wrap mt-1">
            {["Male", "Female", "Other"]?.map((g) => (
              <label
                key={g}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm font-medium select-none ${formData?.gender === g?.toLowerCase()
                  ? "border-blue-700 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-700 hover:border-blue-400"
                  }`}
                style={{ minHeight: "44px" }}
              >
                <input
                  type="radio"
                  name="gender"
                  value={g?.toLowerCase()}
                  checked={formData?.gender === g?.toLowerCase()}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData?.gender === g?.toLowerCase() ? "border-blue-700" : "border-gray-400"
                    }`}
                >
                  {formData?.gender === g?.toLowerCase() && (
                    <span className="w-2 h-2 rounded-full bg-blue-700 block" />
                  )}
                </span>
                {g}
              </label>
            ))}
          </div>
          {errors?.gender && (
            <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{errors?.gender}</p>
          )}
        </div>
      </div>
      {/* Occupation */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ fontFamily: "Nunito Sans, sans-serif", color: "var(--color-foreground)" }}>
          Occupation <span className="text-red-500">*</span>
        </label>
        <select
          name="occupation"
          id="occupation"
          value={formData?.occupation}
          onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all"
          style={{
            borderColor: errors?.occupation ? "var(--color-error)" : "var(--color-border)",
            background: "var(--color-background)",
            color: "var(--color-foreground)",
            minHeight: "44px",
          }}
        >
          {occupationOptions?.map((o) => (
            <option key={o?.value} value={o?.value}>{o?.label}</option>
          ))}
        </select>
        {errors?.occupation && (
          <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{errors?.occupation}</p>
        )}
      </div>
      {/* Category & State row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ fontFamily: "Nunito Sans, sans-serif", color: "var(--color-foreground)" }}>
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            id="category"
            value={formData?.category}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all"
            style={{
              borderColor: errors?.category ? "var(--color-error)" : "var(--color-border)",
              background: "var(--color-background)",
              color: "var(--color-foreground)",
              minHeight: "44px",
            }}
          >
            {categoryOptions?.map((c) => (
              <option key={c?.value} value={c?.value}>{c?.label}</option>
            ))}
          </select>
          {errors?.category && (
            <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{errors?.category}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ fontFamily: "Nunito Sans, sans-serif", color: "var(--color-foreground)" }}>
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            id="state"
            value={formData?.state}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all"
            style={{
              borderColor: errors?.state ? "var(--color-error)" : "var(--color-border)",
              background: "var(--color-background)",
              color: "var(--color-foreground)",
              minHeight: "44px",
            }}
          >
            {stateOptions?.map((s) => (
              <option key={s?.value} value={s?.value}>{s?.label}</option>
            ))}
          </select>
          {errors?.state && (
            <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{errors?.state}</p>
          )}
        </div>
      </div>
      {/* Password */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ fontFamily: "Nunito Sans, sans-serif", color: "var(--color-foreground)" }}>
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={handleChange}
            className="w-full px-3 py-2.5 pr-11 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all"
            style={{
              borderColor: errors?.password ? "var(--color-error)" : "var(--color-border)",
              background: "var(--color-background)",
              color: "var(--color-foreground)",
              minHeight: "44px",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
          </button>
        </div>
        {/* Strength bar */}
        {formData?.password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4]?.map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all ${i <= passwordStrength?.score ? passwordStrength?.color : "bg-gray-200"
                    }`}
                />
              ))}
            </div>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Strength: <span className="font-semibold">{passwordStrength?.label}</span>
              {" · "}Use uppercase, numbers &amp; symbols for a stronger password
            </p>
          </div>
        )}
        {errors?.password && (
          <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{errors?.password}</p>
        )}
      </div>
      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ fontFamily: "Nunito Sans, sans-serif", color: "var(--color-foreground)" }}>
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Re-enter your password"
            value={formData?.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2.5 pr-11 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all"
            style={{
              borderColor: errors?.confirmPassword ? "var(--color-error)" : "var(--color-border)",
              background: "var(--color-background)",
              color: "var(--color-foreground)",
              minHeight: "44px",
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={18} />
          </button>
        </div>
        {formData?.confirmPassword && formData?.password === formData?.confirmPassword && (
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--color-success)" }}>
            <Icon name="CheckCircle" size={13} color="var(--color-success)" /> Passwords match
          </p>
        )}
        {errors?.confirmPassword && (
          <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{errors?.confirmPassword}</p>
        )}
      </div>
      {/* Terms */}
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              name="termsAccepted"
              id="termsAccepted"
              checked={formData?.termsAccepted}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData?.termsAccepted
                ? "bg-blue-800 border-blue-800" : "bg-white border-gray-400 group-hover:border-blue-600"
                }`}
            >
              {formData?.termsAccepted && <Icon name="Check" size={12} color="#fff" strokeWidth={3} />}
            </div>
          </div>
          <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            I agree to the{" "}
            <a href="#" className="underline font-medium" style={{ color: "var(--color-primary)" }}>
              Terms &amp; Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="underline font-medium" style={{ color: "var(--color-primary)" }}>
              Privacy Policy
            </a>{" "}
            of the Government Scheme Discovery Platform. I consent to the secure processing of my demographic data for scheme eligibility matching.
          </span>
        </label>
        {errors?.termsAccepted && (
          <p className="text-xs mt-1 ml-8" style={{ color: "var(--color-error)" }}>{errors?.termsAccepted}</p>
        )}
      </div>
      {/* Submit */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create My Account"}
      </Button>
    </form>
  );
};

export default RegistrationForm;
