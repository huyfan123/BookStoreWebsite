import Header from "../components/header";
import Footer from "../components/footer";
import { User, Mail, Phone, Send, ArrowRight, Star } from "lucide-react";

import headerImg from "../assets/Images/header5.jpeg";
import bookShelve from "../assets/Images/bookShelves.jpeg";
import contactImg from "../assets/Svgs/contact.svg";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import api from "../apis/api";
import { toast } from "react-toastify";
import axios from "axios";

export function BookCard({ book, onClick }: { book: any; onClick?: () => void }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/details/?book-id=${book.bookId || book.id}`, { state: { book } });
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 w-full">
        <img
          src={book.coverImg}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-left w-full">
              <h3 className="font-semibold text-lg text-slate-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap">
                {book.title}
              </h3>
            </TooltipTrigger>
            <TooltipContent>
              <p>{book.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <p className="text-sm text-slate-500 mb-4 line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">{book.author}</p>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-slate-900">${book.price || "5.20"}</span>
            <div className="flex items-center gap-1 text-amber-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(book.rating) || 5)
                      ? "fill-current"
                      : "text-slate-300"
                  }`}
                />
              ))}
              <span className="text-xs text-slate-500 ml-1">({book.numRatings || 0})</span>
            </div>
          </div>
          <Button
            className="w-full rounded-full bg-[#1e58c8] hover:bg-blue-700 text-sm h-10 font-semibold tracking-wide"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            VIEW DETAILS
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const loginStatus = location.state;
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<{
    has_interactions?: boolean;
    personalized: any[];
    explore_new: any[];
    trending: any[];
  }>({
    has_interactions: false,
    personalized: [],
    explore_new: [],
    trending: [],
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    setIsLogin(loginStatus);
  }, [loginStatus]);

  const [searchParams] = useSearchParams();

  // this useEffect is used for load recommend books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const user_id = document.cookie
          .split(";")
          .find((cookie) => cookie.trim().startsWith("username="))
          ?.split("=")[1];

        if (user_id) setUsername(user_id);

        const endpoint = user_id ? `/books/homepage-recommendations/?userId=${user_id}` : "/books/homepage-recommendations/";
        const response = await api.get(endpoint);
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching recommended books:", error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");

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
    //clear the search params after scrolling
    const urlWithoutParams = window.location.pathname;
    window.history.replaceState({}, document.title, urlWithoutParams);
  }, [searchParams]); // Runs when searchParams changes

  const handleContactClick = () => {
    navigate("/?scrollTo=contact");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://script.google.com/macros/s/AKfycbycpFnM2WQzKUFk6kt_H_fbzDwp2ys2Jh4254feKUCAVro0eL0H2aDVhOR2BPcb4DGMRQ/exec",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      toast.error("Error sending message");
      console.error("Submission error:", error);
    }
  };

  const aiPicks = recommendations.personalized.length >= 4 ? recommendations.personalized.slice(0, 4) : recommendations.personalized;

  const mustRead = aiPicks.length > 0 ? aiPicks[0] : null;
  const otherPicks = aiPicks.length > 1 ? aiPicks.slice(1, 4) : [];

  const exploreBooks = recommendations.explore_new.slice(0, 10);
  const trendingBooks = recommendations.trending.slice(0, 10);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white">
      <Header checkPoint={0} />

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden mb-12">
          <div className="absolute inset-0 z-0">
            <img
              src={headerImg}
              alt="Bookshelf background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Discover the best books
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light">
              Explore a vast selection of literature, from timeless classics to modern masterpieces. Find your next great read today.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/products")}
              className="rounded-full px-8 h-14 text-base font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              EXPLORE BOOKS
            </Button>
          </div>
        </section>

{/* Welcome to our bookstore */}
        <section id="about" className="py-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 rounded-3xl"></div>
              <img
                alt="book shelve"
                src={bookShelve}
                className="w-full aspect-[4/3] lg:aspect-[4/5] object-cover"
              />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col items-start">
              <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold tracking-wide mb-6">
                ABOUT US
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Welcome to our bookstore
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Book Haven offers an extensive selection of books across various
                genres, catering to every reader's taste. Whether you're
                searching for the latest bestseller or a hidden gem, our curated
                collection guarantees something for everyone.
              </p>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Based in Ho Chi Minh City, we deliver the joy of reading right to your doorstep,
                making it easier than ever to immerse yourself in captivating
                stories and insightful knowledge.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={handleContactClick}
                className="rounded-full px-8 h-14 border-2 hover:bg-slate-50 text-base"
              >
                Get in touch
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                {username
                  ? recommendations.has_interactions
                    ? "Recommended for You"
                    : "Getting Started"
                  : "Top Rated Masterpieces"}
              </h2>
              <p className="text-slate-500 text-lg">
                {username
                  ? recommendations.has_interactions
                    ? "Curated especially for your reading taste"
                    : "Start exploring our vast collection"
                  : "The highest-rated books across the platform"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* MUST-READ large card */}
              {mustRead && (
              <div className="lg:col-span-5 flex">
                <div
                  onClick={() => navigate(`/details/?book-id=${mustRead.bookId || mustRead.id}`, { state: { book: mustRead } })}
                  className="group flex flex-row w-full bg-[#eff4fa] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 border border-blue-200 p-4 gap-4 h-full"
                >
                  <div className="relative w-[50%] rounded-xl overflow-hidden shrink-0">
                    <img
                      src={mustRead.coverImg}
                      alt={mustRead.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div>
                      <div className="inline-block bg-[#ffea9e] text-yellow-900 text-[11px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                        MUST-READ
                      </div>
                      <h3 className="font-bold text-xl text-slate-900 mb-1 group-hover:text-primary transition-colors line-clamp-3 leading-tight">
                        {mustRead.title}
                      </h3>
                      <p className="text-sm text-slate-500 mb-3">{mustRead.author}</p>
                      
                      <div className="flex flex-col gap-1 mb-4">
                        <span className="font-extrabold text-xl text-slate-900">${mustRead.price || "5.20"}</span>
                        <div className="flex items-center gap-1 text-amber-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(Number(mustRead.rating) || 5)
                                  ? "fill-current"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-slate-500 ml-1">({mustRead.numRatings || 0})</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full rounded-full bg-[#1e58c8] hover:bg-blue-700 text-sm h-10 font-semibold tracking-wide"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/details/?book-id=${mustRead.bookId || mustRead.id}`, { state: { book: mustRead } });
                      }}
                    >
                      VIEW DETAILS
                    </Button>
                  </div>
                </div>
              </div>
              )}

              {/* 3 standard cards */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherPicks.map((book: any, idx: number) => (
                  <BookCard key={idx} book={book} />
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Explore your next read */}
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                  {username ? "Explore your next read" : "Discover New Genres"}
                </h2>
                <p className="text-slate-500 text-lg">
                  {username ? "Try out these new genres selected for you" : "Hand-picked gems from outside the mainstream"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {exploreBooks.map((book: any, idx: number) => (
                <BookCard key={idx} book={book} />
              ))}
            </div>
          </div>
        </section>

        {/* Trending right now */}
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">Trending right now</h2>
                <p className="text-slate-500 text-lg">See what other readers are loving</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {trendingBooks.map((book: any, idx: number) => (
                <BookCard key={idx} book={book} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
            <div className="w-full lg:w-5/12 bg-primary/5 p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-green-500/10 blur-3xl"></div>

              <div className="relative z-10">
                <span className="text-primary font-bold tracking-wider uppercase mb-2 block text-sm">Contact Us</span>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Let's get in touch</h3>
                <p className="text-slate-600 mb-10 leading-relaxed">
                  We're here to assist you with any inquiries about our collection, orders, or services. Send us a message and we'll respond promptly.
                </p>
                <img
                  src={contactImg}
                  alt="Contact illustration"
                  className="w-full max-w-[280px] mx-auto opacity-90"
                />
              </div>
            </div>

            <div className="w-full lg:w-7/12 p-10 md:p-16">
              <form
                method="post"
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="nameField" className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="nameField"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="phoneField" className="text-sm font-medium text-slate-700 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="phoneField"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        required
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="emailField" className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="emailField"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Your email"
                      required
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="messageField" className="text-sm font-medium text-slate-700 ml-1">Your Message</label>
                  <Textarea
                    id="messageField"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Leave your message here"
                    required
                    className="p-4 rounded-2xl bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-4 rounded-full h-14 w-full md:w-auto md:px-10 self-end font-semibold text-base shadow-md hover:shadow-lg transition-all bg-green-600 hover:bg-green-700 text-white"
                >
                  SUBMIT
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
