import React, { useState } from "react";
import api from "../apis/api";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginImg from "../assets/Images/loginImage.jpeg";
import registerImg from "../assets/Images/registerImage.jpeg";

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
      const response = await api.post("accounts/login/", {
        username: formData.username,
        password: formData.password,
      });

      // Assuming the API response contains user information in `response.data.user`
      const userInfo = response.data;

      // Optional: Store non-sensitive user info in a regular cookie
      document.cookie = `username=${userInfo.username}; path=/; max-age=604800`; // 1 week expiry
      document.cookie = `email=${userInfo.email}; path=/; max-age=604800`; // 1 week expiry
      document.cookie = `fullname=${userInfo.fullname}; path=/; max-age=604800`; // 1 week expiry
      document.cookie = `phonenumber=${userInfo.phonenumber}; path=/; max-age=604800`; // 1 week expiry
      document.cookie = `address=${userInfo.address}; path=/; max-age=604800`; // 1 week expiry

      if (userInfo.role === "admin")
        navigate("/admin"); // Redirect to admin page
      else navigate("/"); // Redirect to home page

      toast.success("Login successful!");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err.response.data.error);

      setError(
        err.response?.data?.message || "Failed to log in. Please try again."
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
    } catch (err) {
      console.error("Sign Up failed:", err);
      toast.error("Failed to register. Please try again.");
      setError(
        err.response?.data?.message || "Failed to register. Please try again."
      );
    }
  };

  const getPasswordStrengthColor = (strength: string): string => {
    switch (strength) {
      case "Weak":
        return "red";
      case "Medium":
        return "orange";
      case "Strong":
        return "green";
      default:
        return "inherit";
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Grid
        container
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          maxWidth: "900px",
        }}
      >
        {/* Left Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: isLogin ? "#FFF7E4" : "#FAECE3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 4,
          }}
        >
          <Box
            component="img"
            src={isLogin ? loginImg : registerImg}
            alt="Bookstore Illustration"
            sx={{
              maxHeight: "300px",
              maxWidth: "100%",
              objectFit: "contain",
              marginBottom: 2,
            }}
          />
          <Typography variant="h5" align="center">
            {isLogin ? "Welcome Back!" : "Welcome to our bookstore!"}
          </Typography>
        </Grid>

        {/* Right Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            {isLogin ? "Hello Again!" : "Create an Account"}
          </Typography>
          <form style={{ width: "100%" }}>
            {isLogin ? (
              <>
                <TextField
                  fullWidth
                  label="Username or Email"
                  name="username"
                  variant="outlined"
                  margin="normal"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullname"
                    variant="outlined"
                    margin="normal"
                    required
                    value={formData.fullname}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Name"
                    name="username"
                    variant="outlined"
                    margin="normal"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="tel"
                    label="Phone Number"
                    name="phonenumber"
                    variant="outlined"
                    margin="normal"
                    required
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    variant="outlined"
                    margin="normal"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    name="email"
                    variant="outlined"
                    margin="normal"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    onChange={handleInputChange}
                    onFocus={() => setPasswordStrengthVisible(true)}
                    onBlur={() => setPasswordStrengthVisible(false)}
                    required
                  />
                  {passwordStrengthVisible && (
                    <Typography variant="body2">
                      <span>Strength: </span>
                      <span
                        style={{
                          color: getPasswordStrengthColor(passwordStrength),
                          fontWeight: "bold",
                        }}
                      >
                        {passwordStrength}
                      </span>
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    onChange={handleInputChange}
                    required
                  />
                  {error && (
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 2,
              }}
            >
              <Link href="#" variant="body2">
                {isLogin ? "Forgot Password?" : ""}
              </Link>
              {isLogin && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
                  type="button"
                >
                  Sign In
                </Button>
              )}
              {!isLogin && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSignUp}
                  type="button"
                >
                  Sign Up
                </Button>
              )}
            </Box>
          </form>
          <Button
            onClick={handleChangeForm}
            sx={{ marginTop: 2 }}
            color="secondary"
            variant="text"
          >
            {isLogin
              ? "Not a member? Register now"
              : "Already have an account? Sign in"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginRegisterForm;
