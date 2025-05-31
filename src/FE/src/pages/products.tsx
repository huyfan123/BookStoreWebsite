import React, { useEffect, useState } from "react";
import api from "../apis/api";
import {
  Typography,
  Container,
  Button,
  Box,
  Tooltip,
  InputBase,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Search } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";
import BookFilters from "../components/filter";
import Footer from "../components/footer";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { toast } from "react-toastify";

interface Book {
  bookId: string;
  title: string;
  author: string;
  price: string;
  coverImg: string;
  quantity: number; // Add quantity to Book interface
}

function BookCard({ book, onAddToCart }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/details/?book-id=${book.bookId}`, { state: { book } });
  };

  const handleAddToCart = () => {
    if (document.cookie.indexOf("username") === -1) {
      toast.error("Please log in your account to add items to your cart.");
      return;
    }

    api
      .post("cart/add/", {
        username: document.cookie
          .split(";")
          .find((cookie) => cookie.trim().startsWith("username="))
          .split("=")[1],
        bookId: book.bookId,
        quantity: 1,
      })
      .then((response) => {
        toast.success("Book added to cart successfully.");
      })
      .catch((error) => {
        toast.error("Error adding book to cart.");
      });
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
        src={book.coverImg}
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
        <Typography variant="h6">${book.price} </Typography>
        {/* Show stock quantity */}
        <Typography variant="body2" color="text.secondary">
          In stock: {book.quantity}
        </Typography>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          size="small"
          onClick={(event) => {
            event.stopPropagation(); // Prevents the click from propagating to the parent Box
            handleAddToCart();
            onAddToCart(book); // Call the parent function to update the cart
          }}
          disabled={book.quantity === 0}
        >
          <AddShoppingCartOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
          {book.quantity === 0 ? "Out of stock" : "Add to cart"}
        </Button>
      </Box>
    </Box>
  );
}

export default function BookStore() {
  const [books, setBooks] = useState<Book[]>([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [nextPage, setNextPage] = useState<string | null>(null);
  // const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation

  const fetchBooks = async (url: string) => {
    try {
      setLoading(true);
      const response = await api.get(url); // Make an API call
      const { results, next, previous } = response.data;

      // Append the new books to the existing list of books
      setBooks((prevBooks) => [...prevBooks, ...results]);
      setNextPage(next); // Update "Next" page URL
      // setPreviousPage(previous); // Update "Previous" page URL
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchBooks("books/"); // Initial API endpoint (relative path)
  }, []);

  const handleAddToCart = (book) => {
    setCartItems([...cartItems, book]);
  };

  const handleSearch = () => {
    // Update the URL with the new search query
    navigate(`?search=${encodeURIComponent(searchQuery)}`);

    // Reset books and fetch based on the search query
    setBooks([]);
    fetchBooks(`books/search/?title=${encodeURIComponent(searchQuery)}`);
  };

  const handleFiltersChange = (filters) => {
    console.log("Applied filters:", filters);

    // Build query parameters based on filters
    const { priceRange, language, genre } = filters;
    let queryParams = "";

    if (priceRange && priceRange.length === 2) {
      queryParams += `min_price=${priceRange[0]}&max_price=${priceRange[1]}&`;
    }

    if (language && language !== "All") {
      queryParams += `language=${encodeURIComponent(language)}&`;
    }

    if (genre && genre !== "All") {
      queryParams += `genre=${encodeURIComponent(genre)}&`;
    }

    // Remove trailing '&' or '?' if present
    queryParams = queryParams.replace(/&$/, "");

    // Reset the books list and fetch books with new filters
    setBooks([]); // Clear current books to show only filtered results
    fetchBooks(`books/filter/?${queryParams}`);
  };

  return (
    <Box>
      <Header checkPoint={cartItems.length} />
      <Box sx={{ display: "flex" }}>
        {/* Filter Sidebar */}
        <BookFilters onApplyFilters={handleFiltersChange} />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "24px",
                backgroundColor: "#f0f0f0",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "4px 8px",
                maxWidth: "500px",
                width: "100%",
              }}
            >
              <InputBase
                placeholder="Search book..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flexGrow: 1,
                  marginLeft: "8px",
                  fontSize: "16px",
                }}
              />
              <IconButton
                onClick={handleSearch}
                sx={{
                  backgroundColor: "#6c63ff",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  "&:hover": {
                    backgroundColor: "#5a54d6",
                  },
                }}
              >
                <Search />
              </IconButton>
            </Box>
          </Box>

          <Container maxWidth="xl" sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {books.map((book) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={book.bookId}>
                  <BookCard book={book} onAddToCart={handleAddToCart} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() =>
                  nextPage &&
                  fetchBooks(nextPage.replace("http://127.0.0.1:8000/api/", ""))
                }
                sx={{
                  my: 1,
                  width: "auto", // Prevent full-width
                  flexShrink: 0, // Prevent shrinking in flex containers
                  px: 2, // Horizontal padding
                  minWidth: "unset", // Override default min-width
                  whiteSpace: "nowrap", // Prevent text wrapping
                }}
                disabled={!nextPage}
              >
                Load more
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
