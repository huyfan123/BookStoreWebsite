import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Header from "../components/header";
import Footer from "../components/footer";
import { useLocation } from "react-router-dom";
import api from "../apis/api";
import { toast } from "react-toastify";

interface BookDetailsData {
  title: string;
  author: string;
  description: string;
  price: string;
  coverImage: string;
  publisher: string;
  publishedDate: string;
  isbn: string;
  genres: string[];
  bookFormat: string;
  series: string;
}

const BookDetails: React.FC = () => {
  // Extract the query string
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get("book-id"); // Get the 'book-id' parameter
  const [cartItems, setCartItems] = useState([]);
  const [bookDetails, setBookDetails] = useState<BookDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!bookId) {
      setError("Book ID is missing in the URL.");
      setLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // API call to fetch book details using bookId
        const response = await api.get(`/books/book-info/?bookId=${bookId}`);
        const data = response.data;

        // Convert publishDate to dd-mm-yyyy format
        if (data.publishDate) {
          const dateParts = data.publishDate.split("-"); // Split yyyy-mm-dd
          data.publishDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Reformat to dd-mm-yyyy
        }

        // Handle genres field if it's a string representation of a list
        if (typeof data.genres === "string") {
          try {
            // Replace single quotes with double quotes and parse as JSON
            data.genres = JSON.parse(data.genres.replace(/'/g, '"'));
          } catch (err) {
            console.error("Failed to parse genres field:", err);
            data.genres = []; // Fallback to an empty array if parsing fails
          }
        }

        setBookDetails(data);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to fetch book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
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
        bookId: bookId,
        quantity: 1,
      })
      .then((response) => {
        toast.success("Book added to cart successfully.");
        setCartItems([...cartItems, bookId]);
      })
      .catch((error) => {
        toast.error("Error adding book to cart.");
      });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!bookDetails) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h5">Book not found for ID: {bookId}</Typography>
      </Box>
    );
  }

  const {
    title,
    author,
    description,
    price,
    coverImg,
    publisher,
    publishDate,
    isbn,
    genres,
    bookFormat,
    series,
  } = bookDetails;

  return (
    <>
      <Header checkPoint={cartItems.length} />
      <Box
        sx={{
          padding: "20px",
          maxWidth: "1200px",
          marginX: "auto",
          marginTop: "50px",
        }}
      >
        <Grid container spacing={4}>
          {/* Left Section: Book Image */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxHeight: {
                xs: "300px", // For small screens
                md: "500px", // For medium screens and above
              },
            }}
          >
            <img
              src={coverImg}
              alt={title}
              style={{
                borderRadius: "8px",
                height: "100%",
              }}
            />
          </Grid>

          {/* Right Section: Book Details */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h3" gutterBottom>
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              By {author}
            </Typography>
            <Typography
              variant="h4"
              color="primary"
              sx={{ fontWeight: "bold" }}
              gutterBottom
            >
              {price} $
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Series: {series || "None"}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Published Date: {publishDate}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Genres: {genres.join(", ")}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "20px", marginRight: "10px" }}
              onClick={() => {
                handleAddToCart();
              }}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Box sx={{ marginTop: "40px" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="book-details-tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Description" />
            <Tab label="Book Format" />
            <Tab label="Reviews" />
          </Tabs>

          <Box sx={{ padding: "20px" }}>
            {tabValue === 0 && (
              <Typography variant="body1" paragraph>
                {description}
              </Typography>
            )}
            {tabValue === 1 && (
              <Typography variant="body1">{bookFormat}</Typography>
            )}

            {tabValue === 2 && <Typography variant="body1"></Typography>}
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default BookDetails;
