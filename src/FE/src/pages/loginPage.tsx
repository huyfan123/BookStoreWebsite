import React, { useState } from "react";
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
import loginImg from "../assets/Images/loginImage.jpeg";
import registerImg from "../assets/Images/registerImage.jpeg";

const LoginRegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChangeForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault(); // Prevents default form submission
    navigate("/", { state: isLogin });
  };

  // Password strength checker function
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

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value)); // Update password strength dynamically
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setConfirmPassword(value);

    // Check if password and confirm password match
    if (password && value !== password) {
      setError("Passwords do not match");
    } else {
      setError(null);
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
        return "inherit"; // Default text color
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
            src={isLogin ? loginImg : registerImg} // Replace with the actual path to your image
            alt="Bookstore Illustration"
            sx={{
              maxHeight: "300px",
              maxWidth: "100%",
              objectFit: "contain",
              marginBottom: 2,
            }}
          />
          <Typography variant="h5" align="center">
            {isLogin ? "Welcome Back!" : "Welcome to Our Bookstore!"}
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
          <form style={{ width: "100%" }} onSubmit={(e) => handleSubmitForm(e)}>
            {isLogin ? (
              <>
                <TextField
                  fullWidth
                  label="Username or Email"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                />
              </>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Name"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="tel"
                    label="Phone Number"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    onChange={handlePasswordChange}
                    required
                  />
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    onChange={handleConfirmPasswordChange}
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
              <Button variant="contained" color="primary" type="submit">
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </Box>
          </form>
          <Button
            onClick={() => handleChangeForm()}
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
