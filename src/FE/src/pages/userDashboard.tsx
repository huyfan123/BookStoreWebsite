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
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Header from "../components/header";
import api from "../apis/api";
import { toast } from "react-toastify";

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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // Fetch orders from the API when the My Orders tab is active
    if (tabValue === 1) {
      fetchOrders();
    }
  }, [tabValue]);

  const fetchOrders = async () => {
    try {
      const username = document.cookie
        .split(";")
        .find((item) => item.includes("username"))
        ?.split("=")[1];
      const response = await api.get(`/orders?username=${username}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    filter === "All" ? true : order.status === filter
  );

  const handleCancelOrder = async (orderId: number) => {
    try {
      window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      );

      await api.put(
        "/orders/status/",
        {},
        {
          params: {
            order_id: orderId,
            username: username,
          },
        }
      );

      toast.success("Order cancelled successfully!");
      // Update the status in the local orders state
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order.");
    }
  };

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
        toast.success("User information updated successfully");
      })
      .catch((error) => {
        console.error("Error updating user information:", error);
        toast.error("Failed to update user information");
      });
  };

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Call the API to save the user information
    api
      .patch("/accounts/edit/?username=" + username, {
        password,
      })
      .then((response) => {
        console.log("Change password successfully:", response.data);
        toast.success("Change password successfully");
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        toast.error("Failed to change password");
      });
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
        // Redirect to login page or home page
        window.location.href = "/";
        toast.success("User account deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting user account:", error);
        toast.error("Failed to delete user account");
      });
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ px: 30, py: 10 }}>
        <Typography variant="h4" gutterBottom>
          Account Management
        </Typography>
        <CardStyled>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Personal Info" />
            <Tab label="Order history" />
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

          {/* Order History Tab */}
          <TabPanel value={tabValue} index={1}>
            {/* <Typography variant="h6" gutterBottom>
              Order history
            </Typography> */}
            {/* Order Filters */}
            <Box sx={{ display: "flex", gap: 2, my: 2 }}>
              {["All", "Shipping", "Delivered", "Processing", "Cancelled"].map(
                (status) => (
                  <Button
                    key={status}
                    variant={filter === status ? "contained" : "outlined"}
                    onClick={() => setFilter(status)}
                  >
                    {status}
                  </Button>
                )
              )}
            </Box>
            {/* Order List */}
            {filteredOrders.map((order) => (
              <CardStyled key={order.orderId} sx={{ mb: 2 }}>
                <Typography variant="h6">Order #{order.orderId}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Order Date: {new Date(order.orderDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Status:{" "}
                  <Chip
                    label={order.status}
                    color={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Shipping" ||
                          order.status === "Processing"
                        ? "primary"
                        : order.status === "Cancelled"
                        ? "error"
                        : "default"
                    }
                  />
                </Typography>
                <Typography variant="body1">
                  Receiver: {order.receiverName} | Phone: {order.receiverPhone}
                </Typography>
                <Box>
                  {order.items.map((item) => (
                    <Box
                      key={item.orderItemId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        my: 2,
                      }}
                    >
                      <img
                        src={item.coverImg}
                        alt={item.bookId}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                      <Box>
                        <Typography variant="body1">{item.bookId}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.price}$ × {item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="subtitle1">
                    Total: {order.totalAmount}$
                  </Typography>

                  {/* Conditional Buttons based on Order Status */}
                  {order.status === "Processing" && (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          // Add cancel order functionality here
                          handleCancelOrder(order.orderId);
                        }}
                      >
                        Cancel Order
                      </Button>
                    </Box>
                  )}

                  {(order.status === "Delivered" ||
                    order.status === "Cancelled") && (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          // Add buy again functionality here
                          console.log(
                            `Buy again for order: ${order.orderNumber}`
                          );
                        }}
                      >
                        Buy Again
                      </Button>
                    </Box>
                  )}

                  {order.status === "Shipping" && (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button variant="contained" color="error" disabled>
                        Cancel Order
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardStyled>
            ))}
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={2}>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleChangePassword();
                  }}
                >
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
