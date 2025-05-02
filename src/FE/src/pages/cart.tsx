import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Box,
  TextField,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { makeStyles } from "@mui/styles";
import { Delete, Remove, Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";

import emptyCartImg from "../assets/Images/emptyCart.png";

interface CartItem {
  id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 4,
  },
  media: {
    width: 120,
    height: 180,
  },
  itemCard: {
    marginBottom: 2,
  },
  summaryCard: {
    padding: 2,
  },
}));

const CartPage: React.FC = () => {
  const classes = useStyles();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Sample data
    {
      id: "1",
      title: "The Great Novel",
      author: "Jane Doe",
      price: 24.99,
      quantity: 1,
      image: "https://via.placeholder.com/120x180",
    },
    {
      id: "2",
      title: "Programming Basics",
      author: "John Smith",
      price: 39.99,
      quantity: 2,
      image: "https://via.placeholder.com/120x180",
    },
  ]);

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* <Button component={Link} to="/products" variant="outlined">
          <ArrowBack />
        </Button> */}
        <IconButton component={Link} to="/products">
          <ArrowBack />
        </IconButton>

        <Typography variant="h4" gutterBottom>
          Your cart
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            flexDirection: "column",
            textAlign: "center",
            padding: 2,
            border: "1px dashed #ccc",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            marginTop: 4,
          }}
        >
          <CardMedia
            sx={{ height: 400, width: 400, marginBottom: 2 }}
            image={emptyCartImg}
            title="Your cart is empty"
          />
          <Typography variant="h6">Your cart is empty</Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="primary"
            style={{ marginTop: "1rem" }}
            onClick={() => window.scrollTo(0, 0)}
          >
            Go Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            {cartItems.map((item) => (
              <Card key={item.id} className={classes.itemCard}>
                <Box display="flex">
                  <CardMedia
                    className={classes.media}
                    image={item.image}
                    title={item.title}
                  />
                  <CardContent style={{ flex: 1 }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      by {item.author}
                    </Typography>
                    <Typography variant="h6" style={{ marginTop: "1rem" }}>
                      ${item.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        type="number"
                        inputProps={{ min: 1 }}
                        style={{ width: "60px" }}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                      <IconButton
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    <IconButton
                      onClick={() => handleRemoveItem(item.id)}
                      color="secondary"
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Box>
              </Card>
            ))}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card className={classes.summaryCard}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">$5.00</Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">
                  ${(calculateTotal() + 5).toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                style={{ marginTop: "1rem" }}
              >
                Checkout
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;
