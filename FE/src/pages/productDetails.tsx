import React, { useEffect, useState, useRef } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useLocation } from "react-router-dom";
import api from "../apis/api";
import { toast } from "react-toastify";
import { Loader2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { BookCard } from "./home";

interface BookDetailsData {
  title: string;
  author: string;
  description: string;
  price: string;
  coverImg: string;
  publisher: string;
  publishDate: string;
  isbn: string;
  genres: string[];
  bookFormat: string;
  series: string;
  quantity: number;
  rating: number;
  numRatings: number;
}

const BookDetails: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get("book-id");
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [bookDetails, setBookDetails] = useState<BookDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!bookId) return;
    const fetchRecommended = async () => {
      try {
        const username = document.cookie
          .split(";")
          .find((cookie) => cookie.trim().startsWith("username="))
          ?.split("=")[1];

        let endpoint = `/books/recommend?bookId=${bookId}`;
        if (username) {
          endpoint += `&userId=${username}`;
        }
        
        const response = await api.get(endpoint);
        setRecommendedBooks(response.data);
      } catch (error) {
        console.error("Error fetching recommended books:", error);
      }
    };
    fetchRecommended();
  }, [bookId]);

  useEffect(() => {
    if (!bookId) return;
    const logViewInteraction = async () => {
      try {
        const username = document.cookie
          .split(";")
          .find((cookie) => cookie.trim().startsWith("username="))
          ?.split("=")[1];

        if (username) {
          await api.post("books/interaction/", {
            username: username,
            bookId: bookId,
            interaction_type: "view",
          });
        }
      } catch (error) {
        console.error("Error logging view interaction:", error);
      }
    };
    logViewInteraction();
  }, [bookId]);

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
        bookId: bookId,
        quantity: 1,
      })
      .then((response) => {
        toast.success("Book added to cart successfully.");
        if (bookId) {
          setCartItems([...cartItems, bookId]);
        }
      })
      .catch((error) => {
        toast.error("Error adding book to cart.");
      });
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center">
        <h2 className="text-xl text-red-500 font-medium">{error}</h2>
      </div>
    );
  }

  if (!bookDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center">
        <h2 className="text-xl font-medium">Book not found for ID: {bookId}</h2>
      </div>
    );
  }

  const {
    title,
    author,
    description,
    price,
    coverImg,
    series,
    publishDate,
    genres,
    bookFormat,
    quantity,
    rating,
    numRatings,
  } = bookDetails;

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col">
      <Header checkPoint={cartItems.length} />
      
      <main className="flex-grow pb-24">
        {/* Product Info Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 mb-16">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-blue-50/50 p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left Section: Book Image */}
              <div className="flex justify-center items-center bg-slate-50/50 rounded-3xl p-8 aspect-[3/4] md:aspect-auto">
                <img
                  src={coverImg}
                  alt={title}
                  className="rounded-xl max-h-[500px] object-contain shadow-lg hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Right Section: Book Details */}
              <div className="flex flex-col justify-center">
                <div className="inline-block bg-[#e8f0fe] text-[#1e58c8] text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider self-start">
                  In Stock: {quantity}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">{title}</h1>
                <p className="text-xl text-slate-500 mb-4 font-medium">By {author}</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(Number(rating) || 5)
                            ? "fill-current"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-500 font-medium ml-2">
                    {rating ? Number(rating).toFixed(2) : "5.00"} ({numRatings || 0} reviews)
                  </span>
                </div>
                
                <h2 className="text-4xl text-[#1e58c8] font-extrabold mb-8 tracking-tight">${price}</h2>
                
                <div className="flex flex-col gap-4 text-slate-600 mb-10 bg-[#f4f7fb] rounded-2xl p-6 border border-blue-50">
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                    <span className="font-medium text-slate-500">Series</span>
                    <span className="font-semibold text-slate-900">{series || "None"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                    <span className="font-medium text-slate-500">Published Date</span>
                    <span className="font-semibold text-slate-900">{publishDate}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                    <span className="font-medium text-slate-500">Format</span>
                    <span className="font-semibold text-slate-900">{bookFormat || "Paperback"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">Genres</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[60%] text-right">{genres?.join(", ") || "Fiction"}</span>
                  </div>
                </div>

                <Button
                  className="rounded-full h-14 text-base md:text-lg font-bold tracking-wide shadow-md hover:shadow-lg bg-[#1e58c8] hover:bg-blue-700 text-white w-full md:w-auto px-12 transition-all hover:-translate-y-0.5"
                  onClick={handleAddToCart}
                  disabled={quantity === 0}
                >
                  {quantity === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
          <div className="bg-white rounded-[2rem] shadow-sm border border-blue-50/50 p-8 md:p-10">
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-100 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {["Description", "Book Format", "Reviews"].map((tabLabel, index) => (
                <button
                  key={index}
                  className={`py-3 px-8 rounded-full whitespace-nowrap text-sm font-bold tracking-wide transition-all ${
                    tabValue === index
                      ? "bg-[#e8f0fe] text-[#1e58c8]"
                      : "bg-transparent text-slate-500 hover:bg-slate-50"
                  }`}
                  onClick={() => setTabValue(index)}
                >
                  {tabLabel}
                </button>
              ))}
            </div>

            <div className="p-4 md:p-6 min-h-[200px]">
              {tabValue === 0 && (
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg leading-loose text-slate-600 font-light whitespace-pre-wrap">
                    {description}
                  </p>
                </div>
              )}
              {tabValue === 1 && (
                <p className="text-lg leading-loose text-slate-600 font-light">{bookFormat || "Information not available."}</p>
              )}
              {tabValue === 2 && (
                <p className="text-lg leading-loose text-slate-600 font-light italic">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Carousel: Readers Who Bought This Also Liked */}
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Readers who bought this also liked</h2>
            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => scrollCarousel('left')}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#e8f0fe] hover:text-[#1e58c8] hover:border-blue-200 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#e8f0fe] hover:text-[#1e58c8] hover:border-blue-200 transition-colors shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scroll-smooth hide-scrollbar [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recommendedBooks.map((book: any, idx: number) => (
              <div key={idx} className="snap-start shrink-0 w-[280px] md:w-[300px]">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookDetails;
