import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Box,
  TextField,
  Divider,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import { Delete, Remove, Add } from "@mui/icons-material";
import api from "../apis/api";
import { toast } from "react-toastify";
import Header from "../components/header";
import Footer from "../components/footer";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState([]);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const handleRemoveItem = (cartId: number) => {
    setCartItems(cartItems.filter((item) => item.cartId !== cartId));
    api
      .delete(`cart/delete/?cartId=${cartId}`)
      .then(() => {
        toast.success("Removed book successfully");
      })
      .catch(() => {
        toast.error("Error removing book");
      });
  };

  const handleQuantityChange = (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
    api
      .put(`cart/edit/?cartId=${cartId}`, { quantity: newQuantity })
      .then(() => {
        console.log("Quantity updated successfully");
      })
      .catch(() => {
        console.error("Error updating quantity");
      });
  };

  const calculateSubtotal = () =>
    cartItems.reduce(
      (total, item) => total + parseFloat(item.book.price) * item.quantity,
      0
    );

  const calculateTotal = () => calculateSubtotal() + 5 - 4; // Example (Shipping $5 - Discount $4)

  const handleCleanCart = () => {
    // loop through books in cart and delete them
    cartItems.forEach((item) => {
      api
        .delete(`cart/delete/?cartId=${item.cartId}`)
        .then(() => {})
        .catch(() => {
          console.error("Error removing book");
        });
    });
    setCartItems([]);
  };

  const handlePurchase = () => {
    if (!receiverName || !receiverPhone || !address) {
      toast.error(
        "Please fill in all required fields (Receiver Name, Phone, Address)."
      );
      return;
    }

    const orderData = {
      username: document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("username="))
        ?.split("=")[1],
      receiverName,
      receiverPhone,
      shippingAddress: address,
      paymentMethod: paymentMethod,
      items: cartItems.map((item) => ({
        book_id: item.book.bookId, // Assuming `book.id` exists
        quantity: item.quantity,
        price: parseFloat(item.book.price),
      })),
    };

    api
      .post("orders/create/", orderData)
      .then((response) => {
        toast.success("Order placed successfully!");
        handleCleanCart();
        setReceiverName("");
        setReceiverPhone("");
        setAddress("");
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        toast.error("Failed to place order. Please try again.");
      });
  };

  useEffect(() => {
    api
      .get("cart/load", {
        params: {
          username: document.cookie
            .split(";")
            .find((cookie) => cookie.trim().startsWith("username="))
            ?.split("=")[1],
        },
      })
      .then((response) => {
        setCartItems(response.data);
        setReceiverName(
          document.cookie
            .split(";")
            .find((cookie) => cookie.trim().startsWith("fullname="))
            ?.split("=")[1] || ""
        );
        setReceiverPhone(
          document.cookie
            .split(";")
            .find((cookie) => cookie.trim().startsWith("phonenumber="))
            ?.split("=")[1] || ""
        );
        setAddress(
          document.cookie
            .split(";")
            .find((cookie) => cookie.trim().startsWith("address="))
            ?.split("=")[1] || ""
        );
      })
      .catch(() => {
        toast.error("Error fetching cart items");
      });
  }, []);

  return (
    <Box>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F5F5F5",
          paddingX: { xs: "1rem", md: "2rem" },
          paddingY: { xs: "1rem", md: "2rem" },
        }}
      >
        {/* Header Section */}
        <Typography variant="h4" gutterBottom>
          Your Shopping Cart
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "2rem" }}>
          {cartItems.length} items in your cart
        </Typography>

        <Grid container spacing={4}>
          {/* Book List Section */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                flex: 2,
                backgroundColor: "#FFF",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
              }}
            >
              {cartItems.map((item) => (
                <Box
                  key={item.cartId}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    marginBottom: "1rem",
                    borderBottom: "1px solid #E0E0E0",
                    paddingBottom: "1rem",
                  }}
                >
                  <CardMedia
                    image={item.book.coverImg}
                    title={item.book.title}
                    sx={{
                      width: { xs: "100%", sm: 80 },
                      height: { xs: 180, sm: 120 },
                      borderRadius: "4px",
                      marginBottom: { xs: "1rem", sm: "0" },
                      marginRight: { sm: "1rem" },
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{item.book.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      by {item.book.author}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
                      {parseFloat(item.book.price).toFixed(2)} $
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { xs: "space-between", sm: "center" },
                      width: { xs: "100%", sm: "auto" },
                      marginTop: { xs: "1rem", sm: "0" },
                    }}
                  >
                    <IconButton
                      onClick={() =>
                        handleQuantityChange(item.cartId, item.quantity - 1)
                      }
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      type="number"
                      inputProps={{ min: 1 }}
                      sx={{
                        width: "50px",
                        textAlign: "center",
                        margin: "0 0.5rem",
                      }}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.cartId,
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                    <IconButton
                      onClick={() =>
                        handleQuantityChange(item.cartId, item.quantity + 1)
                      }
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      marginLeft: { sm: "1rem" },
                      marginTop: { xs: "1rem", sm: "0" },
                    }}
                  >
                    {(parseFloat(item.book.price) * item.quantity).toFixed(2)} $
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveItem(item.cartId)}
                    color="secondary"
                    sx={{ marginTop: { xs: "1rem", sm: "0" } }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Order Summary Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#FFF",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                // height: { xs: "auto", md: "710px" }, // Fixed height on larger screens
                // overflowY: "auto", // Enable scrolling if content exceeds height
              }}
            >
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Box
                display="flex"
                flexDirection={"column"}
                gap={2}
                sx={{ marginBottom: "1rem" }}
              >
                <Box
                  display="flex"
                  gap={2}
                  sx={{
                    marginBottom: "1rem",
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <TextField
                    label="Receiver's name"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Receiver's phone number"
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    fullWidth
                  />
                </Box>

                <Box display="flex" gap={2} sx={{ marginBottom: "1rem" }}>
                  <TextField
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fullWidth
                  />
                </Box>
              </Box>

              <Divider sx={{ marginY: "1rem" }} />

              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <Select
                fullWidth
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ marginBottom: "1rem" }}
              >
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
                <MenuItem value="Cash on Delivery">Cash on Delivery</MenuItem>
              </Select>

              <Divider sx={{ marginY: "1rem" }} />

              <Typography variant="h6" gutterBottom>
                Coupon Code
              </Typography>
              <TextField
                label="Coupon Code"
                fullWidth
                sx={{ marginBottom: "1rem" }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginBottom: "1rem" }}
              >
                Apply
              </Button>

              <Divider sx={{ marginY: "1rem" }} />

              <Typography variant="h6" gutterBottom>
                Cart Total
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">Cart Subtotal:</Typography>
                <Typography variant="body1">
                  {calculateSubtotal().toFixed(2)} $
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">5.00 $</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">Discount:</Typography>
                <Typography variant="body1">-4.00 $</Typography>
              </Box>
              <Divider sx={{ marginY: "1rem" }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Cart Total:</Typography>
                <Typography variant="h6">
                  {calculateTotal().toFixed(2)} $
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  marginTop: "1rem",
                  backgroundColor: "#FFD700",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "#FFC107",
                  },
                }}
                onClick={handlePurchase}
              >
                Purchase
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default CartPage;
