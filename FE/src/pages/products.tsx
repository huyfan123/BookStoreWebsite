import React, { useEffect, useState } from "react";
import api from "../apis/api";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";
import BookFilters from "../components/filter";
import Footer from "../components/footer";
import { Search, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface Book {
  bookId: string;
  title: string;
  author: string;
  price: string;
  coverImg: string;
  quantity: number; // Add quantity to Book interface
}

function BookCard({ book, onAddToCart }: { book: Book, onAddToCart: (book: Book) => void }) {
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
          ?.split("=")[1],
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
    <div
      onClick={handleCardClick}
      className="h-[360px] w-full max-w-[200px] cursor-pointer hover:scale-105 transition-transform duration-200 mx-auto"
    >
      <img
        src={book.coverImg}
        alt={book.title}
        className="rounded-lg w-full h-[200px] object-cover"
      />
      <div className="flex-grow pb-2">
        <h3
          className="text-lg font-medium overflow-hidden text-ellipsis whitespace-nowrap mt-2"
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {book.author}
        </p>
      </div>

      <div className="pb-4 block justify-evenly">
        <h4 className="text-lg font-semibold">${book.price} </h4>
        {/* Show stock quantity */}
        <p className="text-sm text-gray-500 mb-2">
          In stock: {book.quantity}
        </p>
        <Button
          className="w-full"
          size="sm"
          onClick={(event) => {
            event.stopPropagation(); // Prevents the click from propagating to the parent div
            handleAddToCart();
            onAddToCart(book); // Call the parent function to update the cart
          }}
          disabled={book.quantity === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {book.quantity === 0 ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}

export default function BookStore() {
  const [books, setBooks] = useState<Book[]>([]);
  const [cartItems, setCartItems] = useState<Book[]>([]);
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

  const handleAddToCart = (book: Book) => {
    setCartItems([...cartItems, book]);
  };

  const handleSearch = () => {
    // Update the URL with the new search query
    navigate(`?search=${encodeURIComponent(searchQuery)}`);

    // Reset books and fetch based on the search query
    setBooks([]);
    fetchBooks(`books/search/?title=${encodeURIComponent(searchQuery)}`);
  };

  const handleFiltersChange = (filters: any) => {
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
    <div>
      <Header checkPoint={cartItems.length} />
      <div className="flex flex-col md:flex-row min-h-screen items-start">
        {/* Filter Sidebar */}
        <BookFilters onApplyFilters={handleFiltersChange} />

        {/* Main Content */}
        <div className="flex-grow w-full">
          <div className="flex justify-center items-center mt-4 mb-4 px-4">
            <div className="flex items-center rounded-3xl bg-gray-100 shadow-sm p-1 max-w-[500px] w-full">
              <Input
                placeholder="Search book..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow ml-2 text-base border-0 shadow-none bg-transparent focus-visible:ring-0"
              />
              <Button
                size="icon"
                onClick={handleSearch}
                className="rounded-full w-10 h-10 bg-primary text-white shrink-0 hover:bg-primary/90"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book.bookId} className="w-full">
                  <BookCard book={book} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={() =>
                  nextPage &&
                  fetchBooks(nextPage.replace("http://127.0.0.1:8000/api/", ""))
                }
                className="my-2 px-6"
                disabled={!nextPage}
              >
                Load more
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
