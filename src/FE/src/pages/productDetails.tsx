import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Tab,
  Tabs,
  Box,
} from "@mui/material";
import { mockBookDetails } from "../components/mockData";
import Header from "../components/header";
import { useState } from "react";
import Footer from "../components/footer";
import { useLocation, useParams } from "react-router-dom";

const BookDetails: React.FC = () => {
  const { state } = useLocation();
  const { book } = state || {};
  const { id } = useParams();

  // if (!book) {
  //   return <Typography variant="h5">Book not found for ID: {id}</Typography>;
  // }

  const {
    title,
    author,
    description,
    price,
    coverImage,
    publisher,
    publishedDate,
    isbn,
    genres,
    bookFormat,
    series,
  } = mockBookDetails;

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Header numberOfItems={0} loginStatus={false} />
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
              src={coverImage}
              alt={title}
              style={{
                borderRadius: "8px",
                height: "100%",
              }}
            />
          </Grid>

          {/* Right Section: Book Details */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              By {author}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {price}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Series: {series}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Published Date: {publishedDate}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Genres: {genres.join(", ")}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "20px", marginRight: "10px" }}
            >
              Add to Cart
            </Button>
            <Button variant="outlined" style={{ marginTop: "20px" }}>
              Buy Now
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

            {tabValue === 2 && (
              <Typography variant="body1">Reviews go here.</Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default BookDetails;
