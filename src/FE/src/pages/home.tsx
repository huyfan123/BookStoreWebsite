import Header from "../components/header";
import Footer from "../components/footer";
import CardMedia from "@mui/material/CardMedia";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import {
  AccountCircleOutlined,
  EmailOutlined,
  PhoneOutlined,
  SendOutlined,
} from "@mui/icons-material";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";

import headerImg from "../assets/Images/header5.jpeg";
import bookShelve from "../assets/Images/bookShelves.jpeg";
import contactImg from "../assets/Svgs/contact.svg";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Tooltip } from "@mui/material";

export default function Home() {
  const location = useLocation();
  const loginStatus = location.state;
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    setIsLogin(loginStatus);
  }, [loginStatus]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");
    console.log(scrollTo);
    if (scrollTo === "about") {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (scrollTo === "contact") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [searchParams]); // Runs when searchParams changes

  const books = [
    {
      id: 1,
      title: "Work for Money, Design for Love",
      author: "John Designer",
      image:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546910265l/2.jpg",
    },
    {
      id: 2,
      title: "The Psychology of Graphic Design Pricing",
      author: "Sarah Psych",
      image:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383690l/2657.jpg",
    },

    {
      id: 3,
      title: "Harry Potter and the Order of the Phoenix",
      author: "J.K. Rowling, Mary GrandPrÃ© (Illustrator)",
      image:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546910265l/2.jpg",
    },
  ];

  function BookCard({ book }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
      navigate(`/details/?book-id=${book.bookId}`, { state: { book } });
    };
    return (
      <Box
        onClick={handleCardClick}
        sx={{
          height: "460px",
          width: "300px",
          cursor: "pointer",
        }}
      >
        <img
          src={book.image}
          alt={book.title}
          style={{
            borderRadius: "8px",
            width: "100%",
            height: "300px",
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
          <Button
            sx={{ width: "100%" }}
            variant="contained"
            size="small"
            onClick={() => {}}
          >
            View details
            <TrendingFlatOutlinedIcon sx={{ marginLeft: "2px" }} />
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <Header numberOfItems={0} loginStatus={isLogin} />

      <Box
        sx={{
          width: "100%",
        }}
      >
        {/* introduce section */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: {
              xs: "700px",
              md: "500px",
            },
            overflow: "hidden",
            marginBottom: "80px",
          }}
        >
          <CardMedia
            component="img"
            alt="header image"
            image={headerImg}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 1,
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: {
                xs: "20%",
                md: "50%",
              },
              left: "5%",
              color: "white",
              textAlign: "left",
            }}
          >
            <Typography variant="h2" sx={{ fontWeight: "bold" }} gutterBottom>
              Discover the best books
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Explore a vast selection of books
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Explore books
            </Button>
          </Box>
        </Box>

        {/* Store introduction section */}
        <Box
          id="about"
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "center",
            alignItems: "center",
            paddingX: {
              xs: "20px",
              md: "100px",
            },
            gap: "20px",
          }}
        >
          <Card
            sx={{
              width: {
                xs: "100%",
                md: "50%",
              },
              height: "auto",
              border: "none",
              backgroundColor: "none",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "green" }} gutterBottom>
                Welcome to our bookstore
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
                Discover your next favorite read
              </Typography>
              <Typography variant="h6" gutterBottom>
                Book Haven offers an extensive selection of books across various
                genres, catering to every reader's taste. Whether you're
                searching for the latest bestseller or a hidden gem, our curated
                collection guarantees something for everyone. Based in Ho Chi
                Minh City, we deliver the joy of reading right to your doorstep,
                making it easier than ever to immerse yourself in captivating
                stories and insightful knowledge. Join us at Book Haven and
                explore the world of literature like never before!
              </Typography>
              <Link href="/" sx={{ color: "gray" }}>
                Get in touch
              </Link>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: {
                xs: "100%",
                md: "50%",
              },
              height: "100%",
            }}
          >
            <CardMedia
              component="img"
              alt="book shelve"
              image={bookShelve}
              sx={{
                width: "100%",
                height: {
                  xs: "500px",
                  md: "700px",
                },
                objectFit: "cover",
              }}
            />
          </Card>
        </Box>

        {/* Books recommendation section */}
        <Box
          sx={{
            paddingX: {
              xs: "20px",
              md: "100px",
            },
            marginTop: "100px",
          }}
        >
          <Typography variant="h6" sx={{ color: "green" }} gutterBottom>
            Explore your next read
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
            Discover bestsellers and hidden gems
          </Typography>

          <Container
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "50px",
            }}
          >
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </Container>
        </Box>

        {/* Contact section */}
        <Box
          id="contact"
          sx={{
            paddingX: {
              xs: "20px",
              md: "100px",
            },
            marginTop: "100px",
            display: "flex",
            flexDirection: {
              xs: "column", // Stack vertically on mobile
              md: "row", // Side by side on desktop
            },
            gap: {
              xs: "30px", // Smaller gap on mobile
              md: "50px", // Larger gap on desktop
            },
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={contactImg}
            alt="contact image"
            sx={{
              width: {
                xs: "100%",
                md: "50%",
              },
              height: "auto",
            }}
          />

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "50%",
              },
            }}
          >
            <Typography
              sx={{
                color: "green",
                fontSize: "15px",
              }}
            >
              Get in touch
            </Typography>
            <Typography
              sx={{
                fontSize: "20px",
              }}
            >
              We're here to assist you with any inquiries.
            </Typography>
            <Box
              sx={{
                "& > :not(style)": { m: 1 },
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <TextField
                id="nameField"
                label="Name"
                type="text"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleOutlined />
                      </InputAdornment>
                    ),
                  },
                }}
                placeholder="Your name"
                variant="standard"
                required
              />
              <TextField
                id="emailField"
                label="Email"
                type="email"
                placeholder="Your email"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="standard"
              />
              <TextField
                id="phoneField"
                label="Phone number"
                type="number"
                placeholder="Your phone number"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlined />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="standard"
              />
              <TextField
                id="messageField"
                label="Message"
                multiline
                rows={4}
                placeholder="Leave your message here"
                required
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<SendOutlined />}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
