import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Badge,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search, ShoppingCart, MenuBook } from "@mui/icons-material";
import Header from "../components/header";

const books = [
  {
    id: 1,
    title: "Work for Money, Design for Love",
    author: "John Designer",
    category: "Business & Money",
    price: 22.0,
    image:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546910265l/2.jpg",
  },
  {
    id: 2,
    title: "The Psychology of Graphic Design Pricing",
    author: "Sarah Psych",
    category: "Graphic Design",
    price: 20.59,
    image:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383690l/2657.jpg",
  },
  // Add more books as needed...
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
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {book.author}
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleAddToCart = (book) => {
    setCartItems([...cartItems, book]);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <Header numberOfItems={cartItems.length} />
      <Box sx={{ display: "flex" }}>
        {/* Filter Sidebar */}
        <Box
          sx={{
            width: 240,
            minHeight: "100vh",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            p: 2,
            display: { xs: "none", md: "block" },
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Filters
          </Typography>

          <List>
            {[
              "All",
              "Business & Money",
              "Graphic Design",
              "Literature & Fiction",
            ].map((category) => (
              <ListItem
                button
                key={category}
                selected={category === selectedCategory}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: 1,
                  bgcolor:
                    category === selectedCategory
                      ? "action.selected"
                      : "inherit",
                }}
              >
                <MenuBook sx={{ mr: 1 }} />
                <ListItemText primary={category} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search books..."
                sx={{
                  flexGrow: 1,
                  maxWidth: 500,
                  mr: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* lúc thêm navbar thì xóa cái icon giỏ hàng này
              <IconButton>
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCart /> 
                </Badge>
              </IconButton> */}
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {filteredBooks.map((book) => (
                <Grid
                  item
                  key={book.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ display: "flex", height: "100%" }}
                >
                  <BookCard book={book} onAddToCart={handleAddToCart} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
