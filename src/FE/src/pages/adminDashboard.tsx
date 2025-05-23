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
        <ListItemButton>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => setSelectedSection("books")}>
          <ListItemIcon>
            <ShoppingCart />
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
  const [newBook, setNewBook] = useState({
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
  });

  // For menu actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleMenuClick = (event, book) => {
    setAnchorEl(event.currentTarget);
    setSelectedBook(book);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBook(null);
  };

  const handleDelete = async () => {
    if (!selectedBook) return; // Ensure a book is selected

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the book "${selectedBook.title}"?`
    );
    if (!confirmDelete) return; // If the user cancels, stop here

    try {
      // Make an API DELETE request to the "/books/delete/" endpoint
      await api.delete("/books/delete/", {
        params: { book_id: selectedBook.bookId }, // Pass book_id as a parameter
      });

      // Handle success
      toast.success(`Delete book "${selectedBook.title}" successfully!`);
      console.log(`Book "${selectedBook.title}" deleted successfully`);

      // Refresh the book list
      fetchData();

      // Clear the selectedBook state and close the menu
      setSelectedBook(null);
      handleMenuClose();
    } catch (error) {
      // Handle errors
      console.error("Failed to delete book:", error);
      toast.error("Failed to delete book. Please try again.");
    }
  };

  // Fetch books from the API
  const fetchData = async (pageUrl = null) => {
    setLoading(true);
    try {
      const endpointMap = {
        books: "/books/",
        orders: "/orders/",
        accounts: "/admin/accounts/",
      };

      const response = await api.get(
        pageUrl || selectedSection === "books"
          ? endpointMap.books
          : selectedSection === "orders"
          ? endpointMap.orders
          : endpointMap.accounts
        // {
        //   params: { search: searchQuery },
        // }
      );
      if (selectedSection === "books") setData(response.data.results);
      else setData(response.data);

      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  // Fetch books on mount
  useEffect(() => {
    fetchData();
  }, [selectedSection]);

  const handleSearchBook = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);

    if (!searchQuery) {
      fetchData(); // If searchQuery is empty, fetch all books
      setLoading(false);
      return;
    }

    try {
      // Call the "/books/search/" API endpoint with the searchQuery as a parameter
      const response = await api.get("/books/search/", {
        params: { title: searchQuery },
      });
      setData(response.data.results); // Update the books state with the search results
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to search books:", error);
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

  const handleAddBook = async () => {
    try {
      // Make an API POST request to the "/books/create/" endpoint with the `newBook` object
      const response = await api.post("/books/create/", {
        bookId: newBook.bookId,
        title: newBook.title,
        series: newBook.series,
        author: newBook.author,
        description: newBook.description,
        language: newBook.language,
        isbn: newBook.isbn,
        genres: newBook.genres,
        characters: newBook.characters,
        bookFormat: newBook.bookFormat,
        edition: newBook.edition,
        pages: parseInt(newBook.pages), // Ensure pages is an integer
        publisher: newBook.publisher,
        publishDate: newBook.publishDate,
        awards: newBook.awards,
        setting: newBook.setting,
        coverImg: newBook.coverImg,
        price: parseFloat(newBook.price), // Ensure price is a float
      });

      // Handle success: log the response, refresh the book list, close the dialog, and reset the form
      console.log("Book added successfully:", response.data);
      toast.success("Book added successfully!");

      // Optionally refresh the book list
      fetchData();

      // Close the dialog
      setOpenDialog(false);

      // Reset the form
      handleCleanAddForm();
    } catch (error) {
      // Handle errors: log the error and optionally show an error message
      console.error("Failed to add book:", error);
      toast.error(
        "Failed to add book. Please check the format of required fields and try again."
      );
    }
  };

  const handleCleanAddForm = () => {
    // Reset the `newBook` state to clear the form
    setNewBook({
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
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const [openEditDialog, setOpenEditDialog] = useState(false); // For Edit Dialog
  const [editBook, setEditBook] = useState(null); // Book data for editing

  // Fetch book information for editing
  const fetchBookInfo = async (bookId) => {
    try {
      const response = await api.get(`/books/book-info/`, {
        params: { bookId },
      });
      setEditBook(response.data); // Populate the state with book data
      setOpenEditDialog(true); // Open the dialog
    } catch (error) {
      console.error("Failed to fetch book info:", error);
      toast.error("Failed to load book information.");
    }
  };

  const handleEdit = () => {
    if (selectedBook) {
      fetchBookInfo(selectedBook.bookId); // Fetch book info using the selectedBook's bookId
    }
    handleMenuClose();
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditBook({ ...editBook, [name]: value }); // Update the editBook state
  };

  const handleSaveEdit = async () => {
    try {
      // Call API to save the updated book information
      const response = await api.patch(`/books/update/`, editBook, {
        params: {
          book_id: editBook.bookId,
        },
      }); // Assuming a PATCH endpoint
      console.log("Book updated successfully:", response.data);

      setOpenEditDialog(false); // Close the dialog
      fetchData(); // Refresh the book list
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditBook(null); // Clear the editBook state
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
      <Box flexGrow={1} bgcolor="#f5f5f5" minHeight="100vh">
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
                  onClick={handleSearchBook}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleDialogOpen}
            >
              Add Book
            </Button>
          </Box>
        </Container>

        {/* Add Book Dialog */}
        <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
          <DialogTitle>Add new book</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {Object.keys(newBook).map((key) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    margin="dense"
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    fullWidth
                    value={newBook[key]}
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
                      key === "bookId" ||
                      key === "title" ||
                      key === "author" ||
                      key === "publishDate"
                    } // Make these fields required
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddBook} color="primary">
              Add
            </Button>
            <Button onClick={handleDialogClose} color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Book Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogContent>
            {editBook ? (
              <Grid container spacing={2}>
                {Object.keys(editBook).map((key) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      margin="dense"
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      fullWidth
                      value={editBook[key]}
                      onChange={handleEditInputChange}
                      placeholder={
                        key === "publishDate"
                          ? "YYYY-MM-DD"
                          : key === "price"
                          ? "e.g., 10.99"
                          : ""
                      }
                    />
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
                          <TableCell>{item.customer}</TableCell>
                          <TableCell>
                            {item.total ? `${item.total}$` : ""}
                          </TableCell>
                          <TableCell>{item.status}</TableCell>
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
