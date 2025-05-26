import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleAboutClick = () => {
    navigate("/?scrollTo=about");
  };
  const handleContactClick = () => {
    navigate("/?scrollTo=contact");
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        py: 6,
        width: "100%",
      }}
    >
      <Container>
        <Grid container spacing={4} columns={12}>
          {/* Bookstore Description */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              BOOKSTORE
            </Typography>
            <Typography variant="body2">
              Discover your next favorite read with our vast collection of
              books. We bring the magic of literature right to your doorstep.
            </Typography>
          </Grid>

          {/* Navigation Links */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Navigation
            </Typography>
            <Link href="/" color="inherit" underline="hover" display="block">
              Home
            </Link>
            <Link
              href="/products"
              color="inherit"
              underline="hover"
              display="block"
            >
              Books
            </Link>
            <Link
              component="button"
              color="inherit"
              underline="hover"
              display="block"
              onClick={() => {
                handleAboutClick();
              }}
            >
              About Us
            </Link>
            <Link
              component="button"
              color="inherit"
              underline="hover"
              display="block"
              onClick={() => {
                handleContactClick();
              }}
            >
              Contact
            </Link>
          </Grid>

          {/* Contact Information */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">Email: bookstore@gmail.com</Typography>
            <Typography variant="body2">Phone: 123-456-7890</Typography>
            <Typography variant="body2">
              Address: Ho Chi Minh City, SG
            </Typography>
          </Grid>

          {/* Hours */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hours
            </Typography>
            <Typography variant="body2">Monday: 7:00 – 22:00</Typography>
            <Typography variant="body2">Tuesday: 7:00 – 22:00</Typography>
            <Typography variant="body2">Wednesday: 7:00 – 22:00</Typography>
            <Typography variant="body2">Thursday: 7:00 – 22:00</Typography>
            <Typography variant="body2">Friday: 7:00 – 22:00</Typography>
            <Typography variant="body2">Saturday: 7:00 – 22:00</Typography>
            <Typography variant="body2">Sunday: 8:00 – 20:00</Typography>
          </Grid>
        </Grid>

        {/* Social Media Icons & Copyright */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Link href="https://facebook.com" color="inherit" sx={{ mx: 1 }}>
            <FacebookIcon />
          </Link>
          <Link href="https://twitter.com" color="inherit" sx={{ mx: 1 }}>
            <TwitterIcon />
          </Link>
          <Link href="https://instagram.com" color="inherit" sx={{ mx: 1 }}>
            <InstagramIcon />
          </Link>
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            © {new Date().getFullYear()} Bookstore. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
