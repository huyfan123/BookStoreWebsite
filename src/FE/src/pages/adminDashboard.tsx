import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import api from "../apis/api";
import {
  Search,
  MoreVert,
  Dashboard,
  ShoppingCart,
  People,
  Logout,
  Book,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setSelectedSection }) => {
  return (
    <Box
      width="250px"
      bgcolor="#fff"
      minHeight="100vh"
      boxShadow="2px 0 5px rgba(0,0,0,0.1)"
      display="flex"
      flexDirection="column"
    >
      {/* Logo */}
      <Box p={3}>
        <Typography variant="h5" fontWeight="bold">
          BOOKSTORE
        </Typography>
      </Box>

      {/* Navigation Links */}
      <List>
        {/* <ListItemButton>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton> */}
        <ListItemButton onClick={() => setSelectedSection("books")}>
          <ListItemIcon>
            <Book />
          </ListItemIcon>
          <ListItemText primary="Books" />
        </ListItemButton>
        <ListItemButton onClick={() => setSelectedSection("accounts")}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Accounts" />
        </ListItemButton>
        <ListItemButton onClick={() => setSelectedSection("orders")}>
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItemButton>
      </List>
    </Box>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("books");
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const getInitialItem = (section) => {
    if (section === "books") {
      return {
        bookId: "",
        title: "",
        series: "",
        author: "",
        description: "",
        language: "",
        isbn: "",
        genres: "",
        characters: "",
        bookFormat: "",
        edition: "",
        pages: "",
        publisher: "",
        publishDate: "",
        awards: "",
        setting: "",
        coverImg: "",
        price: "",
      };
    }
    if (section === "accounts") {
      return {
        username: "",
        password: "",
        fullname: "",
        email: "",
        phonenumber: "",
        address: "",
        role: "user",
      };
    }
    // orders
    return {
      orderId: "",
      customer: "",
      total: "",
      status: "Processing",
    };
  };
  const [newItem, setNewItem] = useState(getInitialItem(selectedSection));
  const accountRoles = ["user", "admin"]; // Add or modify based on your backend

  // For menu actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleMenuClick = (event, book) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(book);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    if (!selectedItem) return; // Ensure a book is selected

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this item ?`
    );
    if (!confirmDelete) return; // If the user cancels, stop here

    try {
      const endpointMap = {
        books: "/books/delete/",
        orders: "/orders/delete/",
        accounts: "/admin/accounts/delete/",
      };
      // Make an API DELETE request to the "/books/delete/" endpoint
      await api.delete(endpointMap[selectedSection], {
        params:
          selectedSection === "books"
            ? { book_id: selectedItem.bookId }
            : selectedSection === "accounts"
            ? { username: selectedItem.username }
            : { order_id: selectedItem.orderId },
      });

      // Handle success
      toast.success(`Delete item successfully!`);
      console.log(`Item deleted successfully`);

      // Refresh the book list
      fetchData();

      // Clear the selected item state and close the menu
      setSelectedItem(null);
      handleMenuClose();
    } catch (error) {
      // Handle errors
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item. Please try again.");
    }
  };

  // Fetch books from the API
  const fetchData = async (pageUrl = null) => {
    setLoading(true);
    try {
      let response;
      if (pageUrl) {
        response = await api.get(pageUrl);
      } else {
        const endpointMap = {
          books: "/books/",
          orders: "/orders/list/",
          accounts: "/admin/accounts/",
        };
        response = await api.get(endpointMap[selectedSection]);
      }

      setData(response.data.results);

      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!document.cookie.includes("username")) {
      navigate("/login");
    }
  }, []);

  // Fetch books on mount
  useEffect(() => {
    fetchData();
    setNewItem(getInitialItem(selectedSection));
  }, [selectedSection]);

  const handleSearchItem = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);

    if (!searchQuery) {
      fetchData(); // If searchQuery is empty, fetch all books
      setLoading(false);
      return;
    }

    try {
      const endpointMap = {
        books: "/books/search/",
        accounts: "/admin/accounts/search/",
        orders: "/orders/search/",
      };
      const response = await api.get(endpointMap[selectedSection], {
        params:
          selectedSection === "books"
            ? { title: searchQuery }
            : selectedSection === "accounts"
            ? { username: searchQuery }
            : { order_id: searchQuery },
      });
      setData(response.data.results); // Update the books state with the search results
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to search books:", error);
      const messages = error.response.data;
      if (messages) {
        // console.log(error.response.data.errors);
        for (const [field, message] of Object.entries(messages)) {
          // field is the "title", messages is an array of strings
          toast.error(
            `${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`
          );
        }
      }
    }
    setLoading(false);
  };

  const handleNextPage = () => {
    if (nextPage) fetchData(nextPage);
  };

  const handlePrevPage = () => {
    if (prevPage) fetchData(prevPage);
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => {
    setOpenDialog(false);
    handleCleanAddForm();
  };

  const handleAddItem = async () => {
    try {
      // Make an API POST request to the "/books/create/" endpoint with the `newItem` object
      const endpointMap = {
        books: "/books/create/",
        accounts: "/admin/accounts/create/",
      };
      const response = await api.post(endpointMap[selectedSection], newItem);

      // Handle success: log the response, refresh the book list, close the dialog, and reset the form
      console.log("Item added successfully:", response.data);
      toast.success("Item added successfully!");

      // Optionally refresh the list
      fetchData();

      // Close the dialog
      setOpenDialog(false);

      // Reset the form
      handleCleanAddForm();
    } catch (error) {
      // Handle errors: log the error and optionally show an error message

      if (selectedSection === "accounts") {
        const messages = error.response.data.errors;
        if (messages) {
          // console.log(error.response.data.errors);
          for (const [field, message] of Object.entries(messages)) {
            // field is the "title", messages is an array of strings
            toast.error(
              `${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`
            );
          }
        }
      } else {
        console.error("Failed to add item:", error);
        toast.error(
          "Failed to add item. Please check the format of required fields and try again."
        );
      }
    }
  };

  const handleCleanAddForm = () => {
    // Reset the `newItem` state to clear the form
    setNewItem(getInitialItem(selectedSection));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const [openEditDialog, setOpenEditDialog] = useState(false); // For Edit Dialog
  const [editItem, setEditItem] = useState(null); // Book data for editing

  // Fetch book information for editing
  const fetchItemInfo = async (itemId) => {
    console.log("Fetching item info for:", itemId);
    try {
      const response = await api.get(
        selectedSection === "books"
          ? `/books/book-info/`
          : selectedSection === "accounts"
          ? "admin/accounts/account-info/"
          : "orders/details/",
        {
          params:
            selectedSection === "books"
              ? { bookId: itemId }
              : selectedSection === "accounts"
              ? { username: itemId }
              : { order_id: itemId },
        }
      );
      setEditItem(response.data); // Populate the state with book data
      setOpenEditDialog(true); // Open the dialog
    } catch (error) {
      console.error("Failed to fetch item info:", error);
      toast.error("Failed to load item information.");
    }
  };

  const handleEdit = () => {
    if (selectedItem) {
      if (selectedSection === "books") fetchItemInfo(selectedItem.bookId);
      // Fetch book info using the selectedItem's bookId
      else if (selectedSection === "accounts")
        fetchItemInfo(selectedItem.username);
      // Fetch account info using the selectedItem's username
      else if (selectedSection === "orders")
        fetchItemInfo(selectedItem.orderId); // Fetch order info using the selectedItem's orderId
    }
    handleMenuClose();
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value }); // Update the editBook state
  };

  const handleSaveEdit = async () => {
    try {
      // Call API to save the updated book information
      const response = await api.patch(
        selectedSection === "books"
          ? `/books/book-info/`
          : selectedSection === "accounts"
          ? "admin/accounts/update/"
          : "orders/edit/",
        editItem,
        {
          params:
            selectedSection === "books"
              ? { bookId: editItem.bookId }
              : selectedSection === "accounts"
              ? { username: editItem.username }
              : { order_id: editItem.orderId },
        }
      ); // Assuming a PATCH endpoint
      toast.success("Update item successfully!");
      setOpenEditDialog(false); // Close the dialog
      fetchData(); // Refresh the book list
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error("Failed to update item. Please try again.");
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditItem(null); // Clear the editBook state
  };

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem("token");
    // Clean the cookies
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "fullname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "phonenumber=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirect to the login page
    navigate("/login");
    toast.success("Logout successful");
  };

  return (
    <Box display="flex">
      {/* Sidebar */}
      <Sidebar setSelectedSection={setSelectedSection} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          paddingBottom: "64px", // Adjust for AppBar height
        }}
      >
        {/* App Bar */}
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            {/* Search Bar */}
            <Box display="flex" alignItems="center" flexGrow={1}>
              <Paper
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={`Search for ${selectedSection}...`}
                  inputProps={{ "aria-label": `search for ${selectedSection}` }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton
                  type="button"
                  sx={{
                    p: "10px",
                    borderWidth: 2,
                    borderColor: "grey",
                    borderRadius: 50,
                    borderStyle: "solid",
                  }}
                  aria-label="search"
                  onClick={handleSearchItem}
                >
                  <Search />
                </IconButton>
              </Paper>
            </Box>
            {/* User Info */}
            <Box display="flex" alignItems="center">
              <Typography variant="body1" mr={1}>
                Hello, admin
              </Typography>
            </Box>
            <Box>
              <Button
                onClick={() => {
                  handleLogout();
                }}
                color="error"
              >
                <Logout />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Filters */}
        <Container>
          <Box display="flex" justifyContent="flex-end" mb={2} mt={2}>
            {/* <Box display="flex" gap={2}>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                displayEmpty
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">All</MenuItem>
                {languages.map((lang) => (
                  <MenuItem value={lang}>{lang}</MenuItem>
                ))}
              </Select>
              <Select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                displayEmpty
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">All</MenuItem>
                {genres.map((gen) => (
                  <MenuItem value={gen}>{gen}</MenuItem>
                ))}
              </Select>
            </Box> */}
            {(selectedSection === "books" ||
              selectedSection === "accounts") && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialogOpen}
              >
                Add {selectedSection === "books" ? "Book" : "Account"}
              </Button>
            )}
          </Box>
        </Container>

        {/* Add Item Dialog */}
        <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
          <DialogTitle>
            Add new{" "}
            {selectedSection === "books"
              ? "book"
              : selectedSection === "accounts"
              ? "account"
              : "order"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {Object.keys(newItem).map((key) => (
                <Grid item xs={12} sm={6} key={key}>
                  {key === "role" ? (
                    <Select
                      margin="dense"
                      label="Role"
                      name="role"
                      value={newItem.role}
                      onChange={handleInputChange}
                      fullWidth
                      displayEmpty
                    >
                      {accountRoles.map((role) => (
                        <MenuItem value={role} key={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <TextField
                      margin="dense"
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      fullWidth
                      value={newItem[key]}
                      onChange={handleInputChange}
                      placeholder={
                        key === "bookId"
                          ? "Enter unique book ID"
                          : key === "title"
                          ? "Enter the book title"
                          : key === "author"
                          ? "Enter the author's name"
                          : key === "price"
                          ? "Enter price (e.g., 10.99)"
                          : key === "publishDate"
                          ? "YYYY-MM-DD (e.g., 2025-01-01)"
                          : key === "coverImg"
                          ? "Enter image URL (e.g., https://example.com/image.jpg)"
                          : key === "genres"
                          ? "Enter genres separated by commas"
                          : ""
                      }
                      required={
                        (selectedSection === "books" &&
                          (key === "bookId" ||
                            key === "title" ||
                            key === "author" ||
                            key === "publishDate")) ||
                        (selectedSection === "accounts" &&
                          (key === "username" ||
                            key === "password" ||
                            key === "fullname" ||
                            key === "email"))
                      } // Make these fields required
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddItem} color="primary">
              Add
            </Button>
            <Button onClick={handleDialogClose} color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Book Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth>
          <DialogTitle>
            Edit{" "}
            {selectedSection === "books"
              ? "Book"
              : selectedSection === "orders"
              ? "Order"
              : "Account"}
          </DialogTitle>
          <DialogContent>
            {editItem ? (
              <Grid container spacing={2}>
                {Object.keys(editItem).map((key) => (
                  <Grid item xs={12} sm={6} key={key}>
                    {selectedSection === "accounts" && key === "role" ? (
                      <Select
                        margin="dense"
                        label="Role"
                        name="role"
                        value={editItem.role}
                        onChange={handleEditInputChange}
                        fullWidth
                        displayEmpty
                      >
                        {accountRoles.map((role) => (
                          <MenuItem value={role} key={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : selectedSection === "orders" && key === "status" ? (
                      <Select
                        label="Status"
                        name="status"
                        value={editItem.status}
                        onChange={handleEditInputChange}
                        fullWidth
                      >
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Shipping">Shipping</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    ) : (
                      <TextField
                        margin="dense"
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        name={key}
                        fullWidth
                        value={
                          key === "publishDate" ||
                          key === "orderDate" ||
                          key === "createdAt" ||
                          key === "updatedAt"
                            ? new Date(editItem[key]).toLocaleDateString(
                                "en-GB"
                              )
                            : editItem[key]
                        }
                        onChange={handleEditInputChange}
                        placeholder={
                          key === "publishDate"
                            ? "YYYY-MM-DD"
                            : key === "price"
                            ? "e.g., 10.99"
                            : ""
                        }
                        // Make bookId, orderId, and username read-only
                        disabled={
                          key === "bookId" ||
                          key === "orderId" ||
                          key === "username" ||
                          key === "totalAmount" ||
                          key === "paymentMethod" ||
                          key === "createdAt" ||
                          key === "updatedAt"
                        }
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>Loading book information...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
            <Button onClick={handleCloseEditDialog} color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Content */}
        <Container>
          {/* Dynamic Table Title */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}{" "}
            Management
          </Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "grey" }}>
                  <TableRow>
                    {selectedSection === "books" && (
                      <>
                        <TableCell sx={{ color: "white" }}>Book ID</TableCell>
                        <TableCell sx={{ color: "white" }}>Title</TableCell>

                        <TableCell sx={{ color: "white" }}>Author</TableCell>

                        <TableCell sx={{ color: "white" }}>
                          Cover Image
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>Price</TableCell>
                        <TableCell sx={{ color: "white" }}>Actions</TableCell>
                      </>
                    )}
                    {selectedSection === "orders" && (
                      <>
                        <TableCell sx={{ color: "white" }}>Order ID</TableCell>
                        <TableCell sx={{ color: "white" }}>Customer</TableCell>
                        <TableCell sx={{ color: "white" }}>Total</TableCell>
                        <TableCell sx={{ color: "white" }}>Status</TableCell>
                        <TableCell sx={{ color: "white" }}>Actions</TableCell>
                      </>
                    )}
                    {selectedSection === "accounts" && (
                      <>
                        <TableCell sx={{ color: "white" }}>User Name</TableCell>
                        <TableCell sx={{ color: "white" }}>Full Name</TableCell>
                        <TableCell sx={{ color: "white" }}>Email</TableCell>
                        <TableCell sx={{ color: "white" }}>Phone Num</TableCell>
                        <TableCell sx={{ color: "white" }}>Address</TableCell>
                        <TableCell sx={{ color: "white" }}>Role</TableCell>
                        <TableCell sx={{ color: "white" }}>Actions</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow
                      key={
                        selectedSection === "books"
                          ? item.bookId
                          : selectedSection === "orders"
                          ? item.orderId
                          : item.username
                      }
                    >
                      {selectedSection === "books" && (
                        <>
                          <TableCell>{item.bookId}</TableCell>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.author}</TableCell>

                          <TableCell>
                            <img
                              src={item.coverImg}
                              alt={item.title}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          </TableCell>
                          <TableCell>{item.price}$</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(event) => handleMenuClick(event, item)}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
                      {selectedSection === "orders" && (
                        <>
                          <TableCell>{item.orderId}</TableCell>
                          <TableCell>{item.username}</TableCell>
                          <TableCell>
                            {item.totalAmount ? `${item.totalAmount}$` : ""}
                          </TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(event) => handleMenuClick(event, item)}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
                      {selectedSection === "accounts" && (
                        <>
                          <TableCell>{item.username}</TableCell>
                          <TableCell>{item.fullname}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.phonenumber}</TableCell>
                          <TableCell>{item.address}</TableCell>
                          <TableCell>{item.role}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(event) => handleMenuClick(event, item)}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {/* Pagination */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Button
              onClick={handlePrevPage}
              disabled={!prevPage}
              variant="contained"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={!nextPage}
              variant="contained"
            >
              Next
            </Button>
          </Box>
        </Container>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
