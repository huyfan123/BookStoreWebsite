import React, { useState } from "react";
import api from "../apis/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginImg from "../assets/Images/loginImage.jpeg";
import registerImg from "../assets/Images/registerImage.jpeg";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const LoginRegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullname: "",
    phonenumber: "",
    address: "",
    email: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passwordStrengthVisible, setPasswordStrengthVisible] = useState(false);

  const handleChangeForm = () => {
    setIsLogin(!isLogin);
    setError(null); // Clear any previous errors
    setFormData({
      username: "",
      password: "",
      fullname: "",
      phonenumber: "",
      address: "",
      email: "",
      confirmPassword: "",
    }); // Reset form data
    setPasswordStrength(""); // Reset password strength
    setPasswordStrengthVisible(false); // Hide password strength indicator
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Dynamically check password strength for password field
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Check if passwords match
    if (name === "confirmPassword" && value !== formData.password) {
      setError("Passwords do not match");
    } else {
      setError(null);
    }
  };

  const checkPasswordStrength = (password: string): string => {
    if (password.length < 8) {
      return "Weak";
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar) {
      return "Strong";
    }
    return "Medium";
  };

  const handleLogin = async () => {
    try {
      const response = await api.post("token/", {
        username: formData.username,
        password: formData.password,
      });

      // The API response contains the JWT tokens and user information
      const { access, refresh, user: userInfo } = response.data;
      
      // Store JWT tokens in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Store non-sensitive user info in a regular cookie (for backward compatibility)
      document.cookie = `username=${userInfo.username}; path=/; max-age=604800`; // 1 week expiry
      document.cookie = `email=${userInfo.email}; path=/; max-age=604800`; // 1 week expiry
      document.cookie = `fullname=${userInfo.fullname}; path=/; max-age=604800`; // 1 week expiry
      document.cookie = `phonenumber=${userInfo.phonenumber}; path=/; max-age=604800`; // 1 week expiry
      document.cookie = `address=${userInfo.address}; path=/; max-age=604800`; // 1 week expiry

      if (userInfo.role === "admin")
        navigate("/admin"); // Redirect to admin page
      else navigate("/"); // Redirect to home page

      toast.success("Login successful!");
    } catch (err: any) {
      console.error("Login failed:", err);
      toast.error(err.response?.data?.detail || err.response?.data?.error || "Login failed");

      setError(
        err.response?.data?.detail || err.response?.data?.error || "Failed to log in. Please try again."
      );
    }
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("accounts/create/", {
        fullname: formData.fullname,
        username: formData.username,
        phonenumber: formData.phonenumber,
        address: formData.address,
        email: formData.email,
        password: formData.password,
      });

      setIsLogin(true); // Switch to login form
      toast.success("Registration successful! Please log in.");
    } catch (err: any) {
      console.error("Sign Up failed:", err);
      toast.error(
        err.response?.data?.error || "Failed to register. Please try again."
      );
    }
  };

  const getPasswordStrengthColor = (strength: string): string => {
    switch (strength) {
      case "Weak":
        return "text-red-500";
      case "Medium":
        return "text-orange-500";
      case "Strong":
        return "text-green-500";
      default:
        return "text-inherit";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden max-w-4xl w-full bg-white">
        {/* Left Section */}
        <div
          className={`w-full md:w-1/2 flex flex-col items-center justify-center p-8 transition-colors duration-300 ${
            isLogin ? "bg-[#FFF7E4]" : "bg-[#FAECE3]"
          }`}
        >
          <img
            src={isLogin ? loginImg : registerImg}
            alt="Bookstore Illustration"
            className="max-h-[300px] max-w-full object-contain mb-4"
          />
          <h2 className="text-2xl font-medium text-center">
            {isLogin ? "Welcome Back!" : "Welcome to our bookstore!"}
          </h2>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-semibold mb-6">
            {isLogin ? "Hello Again!" : "Create an Account"}
          </h1>
          <form className="w-full" onSubmit={(e) => e.preventDefault()}>
            {isLogin ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username or Email</label>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <Input
                    name="fullname"
                    required
                    value={formData.fullname}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Account Name *</label>
                  <Input
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <Input
                    type="tel"
                    name="phonenumber"
                    required
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <Input
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <Input
                    name="password"
                    type="password"
                    onChange={handleInputChange}
                    onFocus={() => setPasswordStrengthVisible(true)}
                    onBlur={() => setPasswordStrengthVisible(false)}
                    required
                  />
                  {passwordStrengthVisible && (
                    <p className="text-sm mt-1">
                      <span>Strength: </span>
                      <span className={`font-bold ${getPasswordStrengthColor(passwordStrength)}`}>
                        {passwordStrength}
                      </span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    onChange={handleInputChange}
                    required
                  />
                  {error && (
                    <p className="text-sm text-red-500 mt-1">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center justify-end mt-6">
              {isLogin ? (
                <Button onClick={handleLogin} type="button">
                  Sign In
                </Button>
              ) : (
                <Button onClick={handleSignUp} type="button">
                  Sign Up
                </Button>
              )}
            </div>
          </form>
          <Button
            onClick={handleChangeForm}
            variant="ghost"
            className="mt-6 text-gray-500 hover:text-gray-800"
          >
            {isLogin
              ? "Not a member? Register now"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterForm;
