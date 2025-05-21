import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import api from "../apis/api";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E3B55",
    },
    secondary: {
      main: "#B71C1C",
    },
  },
});

const navItems = ["Home", "Store", "About", "Contact"];

interface BookstoreNavbarProps {
  checkPoint: number;
}

export default function BookstoreNavbar({ checkPoint }: BookstoreNavbarProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [numberOfItems, setNumberOfItems] = React.useState();

  // const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("username"));
    const handleGetNumOfCartItems = async () => {
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
          setNumberOfItems(response.data.length);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    };

    if (document.cookie.includes("username")) {
      handleGetNumOfCartItems();
    }
  }, [checkPoint]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleAboutClick = () => {
    navigate("/?scrollTo=about");
  };
  const handleContactClick = () => {
    navigate("/?scrollTo=contact");
  };
  const handleOpenDashboard = () => {
    navigate("/dashboard");
    handleCloseMenu();
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "fullname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "phonenumber=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    toast.success("Logout successful");
    navigate("/");
    handleCloseMenu();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        BOOKSTORE
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar component="nav" position="sticky">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }}
          >
            BOOKSTORE
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
            <Button component={Link} to="/" sx={{ color: "#fff" }}>
              Home
            </Button>
            <Button component={Link} to="/products" sx={{ color: "#fff" }}>
              Store
            </Button>
            <Button
              onClick={() => {
                handleAboutClick();
              }}
              sx={{ color: "#fff" }}
            >
              About
            </Button>
            <Button
              onClick={() => {
                handleContactClick();
              }}
              sx={{ color: "#fff" }}
            >
              Contact
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            {isLoggedIn ? (
              <>
                <IconButton component={Link} to="/cart" color="inherit">
                  <Badge badgeContent={numberOfItems} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <IconButton onClick={handleOpenMenu} color="inherit">
                  <AccountCircleIcon />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  PaperProps={{ sx: { mt: 1.5 } }}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleOpenDashboard}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => {
                  // setIsLoggedIn(true);
                  navigate("/login");
                }}
                sx={{ border: "1px solid white" }}
              >
                Login / Sign Up
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}

