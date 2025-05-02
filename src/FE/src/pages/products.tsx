import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Rating,
  Pagination,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Search, FavoriteBorder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import BookFilters from "../components/filter";
import Footer from "../components/footer";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";

const books = [
  {
    id: 1,
    title: "Work for Money, Design for Love",
    author: "John Designer",
    category: "Business & Money",
    price: 22.0,
    rating: 4.5,
    image:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546910265l/2.jpg",
  },
  {
    id: 2,
    title: "The Psychology of Graphic Design Pricing",
    author: "Sarah Psych",
    category: "Graphic Design",
    price: 20.59,
    rating: 4.0,
    image:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383690l/2657.jpg",
  },
  // Add more books as needed...
];

function BookCard({ book, onAddToCart }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/details/${book.id}`, { state: { book } });
  };
  return (
    <Box
      onClick={handleCardClick}
      sx={{
        height: "360px",
        width: "200px",
        cursor: "pointer",
        "&:hover": { transform: "scale(1.02)" },
        transition: "transform 0.2s",
      }}
    >
      <img
        src={book.image}
        alt={book.title}
        style={{
          borderRadius: "8px",
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />
      <Box sx={{ flexGrow: 1, paddingBottom: "8px" }}>
        <Tooltip title={book.title} arrow>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {book.title}
          </Typography>
        </Tooltip>
        <Typography variant="body2" color="text.secondary" noWrap>
          {book.author}
        </Typography>
      </Box>

      <Box sx={{ pb: 2, display: "block", justifyContent: "space-evenly" }}>
        <Typography variant="h6">${book.price}</Typography>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          size="small"
          onClick={(event) => {
            event.stopPropagation(); // Prevents the click from propagating to the parent Box
            onAddToCart(book);
          }}
        >
          <AddShoppingCartOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
          Add to cart
        </Button>
      </Box>
    </Box>
  );
}

export default function BookStore() {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

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

  const paginatedBooks = filteredBooks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleFiltersChange = (filters) => {
    console.log("Applied filters:", filters);
  };

  return (
    <Box>
      <Header numberOfItems={cartItems.length} />
      <Box sx={{ display: "flex" }}>
        {/* Filter Sidebar */}
        <BookFilters onApplyFilters={handleFiltersChange} />

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
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {paginatedBooks.map((book) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={book.id}>
                  <BookCard book={book} onAddToCart={handleAddToCart} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredBooks.length / itemsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
