import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Header from "../components/header";
import api from "../apis/api";

const CardStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const TabPanel: React.FC<{ value: number; index: number }> = ({
  value,
  index,
  children,
}) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const UserDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    setUsername(
      document.cookie
        .split(";")
        .find((item) => item.includes("username"))
        ?.split("=")[1] || ""
    );
    setFullname(
      document.cookie
        .split(";")
        .find((item) => item.includes("fullname"))
        ?.split("=")[1] || ""
    );
    setEmail(
      document.cookie
        .split(";")
        .find((item) => item.includes("email"))
        ?.split("=")[1] || ""
    );
    setPhone(
      document.cookie
        .split(";")
        .find((item) => item.includes("phone"))
        ?.split("=")[1] || ""
    );
    setAddress(
      document.cookie
        .split(";")
        .find((item) => item.includes("address"))
        ?.split("=")[1] || ""
    );
  }, []);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    // Save the updated user information
    document.cookie = `fullname=${fullname}; path=/`;
    document.cookie = `phonenumber=${phone}; path=/`;
    document.cookie = `address=${address}; path=/`;
    // Call the API to save the user information
    api
      .patch("/accounts/edit/?username=" + username, {
        fullname,
        phonenumber: phone,
        address,
      })
      .then((response) => {
        console.log("User information updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating user information:", error);
      });

    alert("User information saved successfully!");
  };

  const handleDelete = () => {
    // Call the API to delete the user account
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "fullname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "phonenumber=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    api
      .delete("/accounts/delete/?username=" + username)
      .then((response) => {
        console.log("User account deleted successfully:", response.data);
        alert("User account deleted successfully!");
        // Redirect to login page or home page
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error deleting user account:", error);
      });
  };

  return (
    <Box>
      <Header />
      <Box sx={{ px: 30, py: 10 }}>
        <Typography variant="h4" gutterBottom>
          User Profile Management
        </Typography>
        <CardStyled>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Personal Info" />
            <Tab label="Settings" />
          </Tabs>

          {/* Personal Info Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Name"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={email}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  variant="outlined"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSave()}
                >
                  <SaveOutlinedIcon style={{ marginRight: "8px" }} />
                  Save
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Change Password
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button variant="contained" color="primary" onClick={() => {}}>
                  <SaveOutlinedIcon style={{ marginRight: "8px" }} />
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleDelete();
                  }}
                >
                  <DeleteOutlinedIcon style={{ marginRight: "8px" }} />
                  Delete Account
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
        </CardStyled>
      </Box>
    </Box>
  );
};

export default UserDashboard;
