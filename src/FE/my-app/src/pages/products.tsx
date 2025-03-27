import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Badge,
  Box,
  CardMedia,
} from "@mui/material";
import { ShoppingCart, Folder, Book } from "@mui/icons-material";

const books = [
  {
    title: "Work for Money, Design for Love",
    category: "Business & Money",
    price: 22.0,
    section: "For You",
    image: "https://via.placeholder.com/200x300/FF0000/FFFFFF?text=Book1",
  },
  {
    title: "The Psychology of Graphic Design Pricing",
    category: "Graphic Design",
    price: 20.59,
    section: "For You",
    image: "https://via.placeholder.com/200x300/00FF00/FFFFFF?text=Book2",
  },
  {
    title: "Logo Design Love: A Guide to Creating...",
    category: "Graphic Design",
    price: 24.91,
    section: "For You",
    image: "https://via.placeholder.com/200x300/0000FF/FFFFFF?text=Book3",
  },
  {
    title: "Very Nice: A Novel Marcy Dermansky",
    category: "Literature & Fiction",
    price: 18.9,
    section: "Amazon Best Seller",
    image: "https://via.placeholder.com/200x300/FFFF00/000000?text=Book4",
  },
  {
    title: "Juliet the Maniac: A Novel",
    category: "Literature & Fiction",
    price: 9.99,
    section: "Amazon Best Seller",
    image: "https://via.placeholder.com/200x300/FF00FF/FFFFFF?text=Book5",
  },
  {
    title: "Thinking with Type, 2nd revised and expanded...",
    category: "Graphic Design",
    price: 12.04,
    section: "Amazon Best Seller",
    image: "https://via.placeholder.com/200x300/00FFFF/000000?text=Book6",
  },
];

function BookCard({ book, onAddToCart }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={book.image}
        alt={book.title}
        sx={{ objectFit: "contain", p: 1 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {book.category}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          pt: 0,
        }}
      >
        <Typography variant="h6">${book.price}</Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => onAddToCart(book)}
        >
          Add to cart
        </Button>
      </Box>
    </Card>
  );
}

export default function BookStore() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (book) => {
    setCartItems([...cartItems, book]);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          minHeight: "100vh",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          p: 2,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Hypebooks
        </Typography>

        <List>
          {["Wishlist", "My Collection"].map((text) => (
            <ListItem button key={text}>
              <Book sx={{ mr: 1 }} />
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Popular Subjects
        </Typography>
        <List>
          {[
            "Biographies & memoirs",
            "Business & Money",
            "Children's books",
            "Computers & technology",
            "Parenting & families",
          ].map((text) => (
            <ListItem button key={text}>
              <Folder sx={{ mr: 1 }} />
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>

        {/* Add other categories similarly */}
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Book Store
            </Typography>
            <IconButton>
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ p: 3 }}>
          {/* For You Section */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            For You
          </Typography>
          <Grid container spacing={3}>
            {books
              .filter((book) => book.section === "For You")
              .map((book, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <BookCard book={book} onAddToCart={handleAddToCart} />
                </Grid>
              ))}
          </Grid>

          {/* Amazon Best Seller Section */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
            Amazon Best Seller
          </Typography>
          <Grid container spacing={3}>
            {books
              .filter((book) => book.section === "Amazon Best Seller")
              .map((book, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <BookCard book={book} onAddToCart={handleAddToCart} />
                </Grid>
              ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
