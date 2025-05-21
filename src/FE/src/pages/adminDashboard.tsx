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
  const [books, setBooks] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const languages = [
    "Afrikaans",
    "Albanian",
    "Aleut",
    "Amharic",
    "Arabic",
    "Armenian",
    "Assamese",
    "Australian languages",
    "Basque",
    "Bengali",
    "Bokmål, Norwegian; Norwegian Bokmål",
    "Bosnian",
    "Bulgarian",
    "Catalan; Valencian",
    "Chinese",
    "Croatian",
    "Czech",
    "Danish",
    "Duala",
    "Dutch",
    "Dutch, Middle (ca.1050-1350)",
    "English",
    "English, Middle (1100-1500)",
    "Estonian",
    "Farsi",
    "Filipino; Pilipino",
    "Finnish",
    "French",
    "French, Middle (ca.1400-1600)",
    "Galician",
    "Georgian",
    "German",
    "Greek, Ancient (to 1453)",
    "Greek, Modern (1453-)",
    "Gujarati",
    "Hindi",
    "Hungarian",
    "Icelandic",
    "Indonesian",
    "Italian",
    "Japanese",
    "Kannada",
    "Korean",
    "Latvian",
    "Lithuanian",
    "Malay",
    "Malayalam",
    "Maltese",
    "Marathi",
    "Mayan languages",
    "Mongolian",
    "Multiple languages",
    "Nepali",
    "Norwegian",
    "Norwegian Nynorsk; Nynorsk, Norwegian",
    "Persian",
    "Polish",
    "Portuguese",
    "Romanian",
    "Russian",
    "Serbian",
    "Slovak",
    "Slovenian",
    "Spanish",
    "Swedish",
    "Tagalog",
    "Tamil",
    "Telugu",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Vietnamese",
  ];

  const genres = [
    "10th Century",
    "11th Century",
    "12th Century",
    "13th Century",
    "14th Century",
    "15th Century",
    "16th Century",
    "17th Century",
    "18th Century",
    "19th Century",
    "1st Grade",
    "20th Century",
    "21st Century",
    "2nd Grade",
    "40k",
    "Abuse",
    "Academia",
    "Academic",
    "Academics",
    "Action",
    "Activism",
    "Adolescence",
    "Adoption",
    "Adult",
    "Adult Fiction",
    "Adventure",
    "Aeroplanes",
    "Africa",
    "African American",
    "African American Literature",
    "African American Romance",
    "African Literature",
    "Agriculture",
    "Airships",
    "Albanian Literature",
    "Alchemy",
    "Alcohol",
    "Alexandria",
    "Algebra",
    "Algeria",
    "Algorithms",
    "Aliens",
    "Alternate History",
    "Alternate Universe",
    "Alternative Medicine",
    "Amateur Sleuth",
    "Amazon",
    "American",
    "American Civil War",
    "American Classics",
    "American Fiction",
    "American History",
    "American Revolution",
    "American Revolutionary War",
    "Americana",
    "Amish",
    "Amish Fiction",
    "Anarchism",
    "Ancient",
    "Ancient History",
    "Angels",
    "Anglo Saxon",
    "Angola",
    "Animal Fiction",
    "Animals",
    "Anime",
    "Anthologies",
    "Anthropology",
    "Anthropomorphic",
    "Anti Intellectualism",
    "Anti Racist",
    "Apocalyptic",
    "Apple",
    "Archaeology",
    "Architecture",
    "Art",
    "Art Design",
    "Art History",
    "Art and Photography",
    "Arthurian",
    "Artificial Intelligence",
    "Asexual",
    "Asia",
    "Asian Literature",
    "Aspergers",
    "Astrology",
    "Astronomy",
    "Atheism",
    "Atlases",
    "Audiobook",
    "Australia",
    "Autobiography",
    "Aviation",
    "BDSM",
    "Babylon 5",
    "Back To School",
    "Baha I",
    "Bande Dessinée",
    "Bangladesh",
    "Banking",
    "Banks",
    "Banned Books",
    "Baseball",
    "Basketball",
    "Batman",
    "Battle Of Britain",
    "Battle Of Gettysburg",
    "Beauty and The Beast",
    "Beer",
    "Belgian",
    "Belgium",
    "Belief",
    "Benin",
    "Biblical",
    "Biblical Fiction",
    "Bicycles",
    "Biography",
    "Biography Memoir",
    "Biology",
    "Birds",
    "Bisexual",
    "Bizarro Fiction",
    "Boarding School",
    "Bolivia",
    "Book Club",
    "Books About Books",
    "Booze",
    "Botswana",
    "Boys Love",
    "Brain",
    "Brazil",
    "Brewing",
    "British Literature",
    "Buddhism",
    "Buffy The Vampire Slayer",
    "Buisness",
    "Bulgaria",
    "Bulgarian Literature",
    "Burundi",
    "Buses",
    "Business",
    "Butch Femme",
    "Cameroon",
    "Canada",
    "Canadian Literature",
    "Canon",
    "Cars",
    "Cartography",
    "Cartoon",
    "Category Romance",
    "Catholic",
    "Cats",
    "Central Africa",
    "Chapter Books",
    "Chemistry",
    "Chess",
    "Chick Lit",
    "Childrens",
    "Childrens Classics",
    "China",
    "Chinese Literature",
    "Choose Your Own Adventure",
    "Christian",
    "Christian Contemporary Fiction",
    "Christian Fantasy",
    "Christian Fiction",
    "Christian Historical Fiction",
    "Christian Living",
    "Christian Non Fiction",
    "Christian Romance",
    "Christianity",
    "Christmas",
    "Church",
    "Church History",
    "Cinderella",
    "Cities",
    "Civil War",
    "Civil War Eastern Theater",
    "Civil War History",
    "Class",
    "Classic Literature",
    "Classical Music",
    "Classical Studies",
    "Classics",
    "Clean Romance",
    "Climate Change",
    "Climate Change Fiction",
    "Climbing",
    "Cocktails",
    "Coding",
    "Collections",
    "College",
    "Colouring Books",
    "Comedian",
    "Comedy",
    "Comic Book",
    "Comic Fantasy",
    "Comic Strips",
    "Comics",
    "Comics Bd",
    "Comics Manga",
    "Coming Of Age",
    "Comix",
    "Communication",
    "Computer Science",
    "Computers",
    "Conservation",
    "Conspiracy Theories",
    "Contemporary",
    "Contemporary Romance",
    "Cookbooks",
    "Cooking",
    "Counselling",
    "Counter Culture",
    "Counting",
    "Cozy Mystery",
    "Crafts",
    "Creation Science",
    "Crime",
    "Criticism",
    "Cross Dressing",
    "Cryptids",
    "Cryptozoology",
    "Cthulhu Mythos",
    "Cuisine",
    "Culinary",
    "Cult Classics",
    "Cults",
    "Cultural",
    "Cultural Heritage",
    "Cultural Studies",
    "Cyberpunk",
    "Cycling",
    "Czech Literature",
    "Danish",
    "Dark",
    "Dark Fantasy",
    "Dc Comics",
    "Death",
    "Deception",
    "Demons",
    "Denmark",
    "Design",
    "Detective",
    "Diary",
    "Dictionaries",
    "Did Not Finish",
    "Diets",
    "Dinosaurs",
    "Disability",
    "Disability Studies",
    "Discipleship",
    "Disease",
    "Divination",
    "Divorce",
    "Doctor Who",
    "Doctors",
    "Dogs",
    "Dragonlance",
    "Dragons",
    "Drama",
    "Drawing",
    "Drinking",
    "Dungeons and Dragons",
    "Dutch Literature",
    "Dying Earth",
    "Dystopia",
    "Earth Sciences",
    "Eastern Africa",
    "Eastern Philosophy",
    "Ecclesiology",
    "Ecology",
    "Economics",
    "Education",
    "Edwardian",
    "Egypt",
    "Egyptian Literature",
    "Egyptology",
    "Electrical Engineering",
    "Elizabethan Period",
    "Elves",
    "Emergency Services",
    "Emotion",
    "Engineering",
    "English Civil War",
    "English Literature",
    "Entrepreneurship",
    "Environment",
    "Epic",
    "Epic Fantasy",
    "Epic Poetry",
    "Eritrea",
    "Erotic Historical Romance",
    "Erotic Horror",
    "Erotic Paranormal Romance",
    "Erotic Romance",
    "Erotica",
    "Esoterica",
    "Esp",
    "Espionage",
    "Essays",
    "Ethiopia",
    "Ethnography",
    "European History",
    "European Literature",
    "Evangelism",
    "Evolution",
    "Fables",
    "Fae",
    "Fairies",
    "Fairy Tale Retellings",
    "Fairy Tales",
    "Faith",
    "Family",
    "Fan Fiction",
    "Fandom",
    "Fantasy",
    "Fantasy Of Manners",
    "Fantasy Romance",
    "Far Right",
    "Fashion",
    "Fat",
    "Fat Acceptance",
    "Fat Studies",
    "Favorites",
    "Female Authors",
    "Feminism",
    "Feminist Theory",
    "Fiction",
    "Field Guides",
    "Fighters",
    "Figure Skating",
    "Film",
    "Finance",
    "Finnish Literature",
    "Fire Services",
    "Firefighters",
    "Fitness",
    "Folk Tales",
    "Folklore",
    "Food",
    "Food History",
    "Food Writing",
    "Food and Drink",
    "Foodie",
    "Football",
    "Forgotten Realms",
    "Foster Children",
    "Foster Parents",
    "Fostering",
    "Fractured Fairy Tales",
    "France",
    "French Literature",
    "French Revolution",
    "Frugal",
    "Fundamentalism",
    "Futurism",
    "Futuristic",
    "Futuristic Romance",
    "Game Design",
    "Gamebooks",
    "Games",
    "Gaming",
    "Gardening",
    "Gastronomy",
    "Gay",
    "Gay Erotica",
    "Gay Fiction",
    "Gay For You",
    "Geek",
    "Gender",
    "Gender Studies",
    "Gender and Sexuality",
    "Genderqueer",
    "Genetics",
    "Geography",
    "Geology",
    "Geometry",
    "Georgian",
    "Georgian Romance",
    "German Literature",
    "Germany",
    "Ghana",
    "Ghost Stories",
    "Ghosts",
    "Global Warming",
    "Go",
    "God",
    "Goddess",
    "Gods",
    "Golden Age Mystery",
    "Google",
    "Goth",
    "Gothic",
    "Gothic Horror",
    "Gothic Romance",
    "Government",
    "Grad School",
    "Graffiti",
    "Graphic Novels",
    "Graphic Novels Comics",
    "Graphic Novels Comics Manga",
    "Graphic Novels Manga",
    "Greece",
    "Greek Mythology",
    "Green",
    "Growth Mindset",
    "Guidebook",
    "Guides",
    "Guinea",
    "Hackers",
    "Halloween",
    "Hard Boiled",
    "Hard Science Fiction",
    "Harem",
    "Harlequin",
    "Harlequin Blaze",
    "Harlequin Desire",
    "Harlequin Heartwarming",
    "Harlequin Historical",
    "Harlequin Nocturne",
    "Harlequin Presents",
    "Harlequin Romance",
    "Harlequin Teen",
    "Health",
    "Health Care",
    "Helicopters",
    "Herbs",
    "Heroic Fantasy",
    "High Fantasy",
    "High School",
    "Hinduism",
    "Hip Hop",
    "Historical",
    "Historical Fantasy",
    "Historical Fiction",
    "Historical Mystery",
    "Historical Romance",
    "History",
    "History Of Medicine",
    "History Of Science",
    "History and Politics",
    "Hockey",
    "Holiday",
    "Holland",
    "Holocaust",
    "Homeschool",
    "Horror",
    "Horse Racing",
    "Horses",
    "Horticulture",
    "How To",
    "Hqn",
    "Hugo Awards",
    "Human Development",
    "Human Resources",
    "Humanities",
    "Humor",
    "Hungarian Literature",
    "Hungary",
    "Illness",
    "India",
    "Indian Literature",
    "Indonesian Literature",
    "Information Science",
    "Inspirational",
    "Intelligent Design",
    "International",
    "International Development",
    "International Relations",
    "Internet",
    "Interracial Romance",
    "Intersex",
    "Iran",
    "Ireland",
    "Irish Literature",
    "Islam",
    "Islamism",
    "Israel",
    "Italian Literature",
    "Italy",
    "Ivory Coast",
    "Japan",
    "Japanese History",
    "Japanese Literature",
    "Jazz",
    "Jewellery",
    "Jewish",
    "Jokes",
    "Josei",
    "Journal",
    "Journaling",
    "Journalism",
    "Judaica",
    "Judaism",
    "Juvenile",
    "Kazakhstan",
    "Kenya",
    "Kids",
    "Knitting",
    "Komik",
    "LGBT",
    "Labor",
    "Language",
    "Latin American",
    "Latin American History",
    "Latin American Literature",
    "Law",
    "Lds",
    "Lds Fiction",
    "Lds Non Fiction",
    "Leadership",
    "Lebanon",
    "Led Zeppelin",
    "Legal Thriller",
    "Lenin",
    "Lesbian",
    "Lesbian Fiction",
    "Lesbian Romance",
    "Liberia",
    "Librarianship",
    "Library Science",
    "Libya",
    "Lie",
    "Light Novel",
    "Linguistics",
    "Literary Criticism",
    "Literary Fiction",
    "Literature",
    "Logic",
    "London Underground",
    "Love",
    "Love Inspired",
    "Love Inspired Historical",
    "Love Inspired Suspense",
    "Love Story",
    "Lovecraftian",
    "Loveswept",
    "Low Fantasy",
    "M F M",
    "M F Romance",
    "M M Contemporary",
    "M M F",
    "M M Fantasy",
    "M M Historical Romance",
    "M M M",
    "M M Mystery",
    "M M Paranormal",
    "M M Romance",
    "M M Science Fiction",
    "M M Sports Romance",
    "M M Young Adult",
    "Magic",
    "Magical Realism",
    "Magick",
    "Mail Order Brides",
    "Malawi",
    "Mali",
    "Management",
    "Manga",
    "Manga Romance",
    "Manhwa",
    "Maps",
    "Marathi",
    "Maritime",
    "Marriage",
    "Martial Arts",
    "Marvel",
    "Mary Shelley",
    "Mathematics",
    "Media Tie In",
    "Medical",
    "Medicine",
    "Medieval",
    "Medieval History",
    "Medieval Romance",
    "Memoir",
    "Menage",
    "Mental Health",
    "Mental Illness",
    "Mermaids",
    "Metaphysics",
    "Microhistory",
    "Middle Grade",
    "Military Fiction",
    "Military History",
    "Military Romance",
    "Military Science Fiction",
    "Mills and Boon",
    "Mine",
    "Mira",
    "Mixed Martial Arts",
    "Mmorpg",
    "Modern",
    "Modern Classics",
    "Money",
    "Monsters",
    "Mormonism",
    "Moroccan",
    "Morocco",
    "Motorcycle",
    "Motorcycling",
    "Mountaineering",
    "Mozambique",
    "Multicultural Literature",
    "Murder Mystery",
    "Museology",
    "Museums",
    "Music",
    "Music Biography",
    "Musicals",
    "Musicians",
    "Muslimah",
    "Muslims",
    "Mystery",
    "Mystery Thriller",
    "Mysticism",
    "Mythology",
    "NSFW",
    "Namibia",
    "Native American History",
    "Native Americans",
    "Natural History",
    "Nature",
    "Naturopathy",
    "Naval Historical Fiction",
    "Naval History",
    "Nazi Party",
    "Near Future",
    "Nerd",
    "Neuroscience",
    "New Adult",
    "New Adult Romance",
    "New Age",
    "New Testament",
    "New Weird",
    "New York",
    "Nigeria",
    "Nobel Prize",
    "Noir",
    "Nonfiction",
    "Nordic Noir",
    "Norman",
    "Northern Africa",
    "Novella",
    "Novels",
    "Number",
    "Numerology",
    "Nursery Rhymes",
    "Nursing",
    "Nutrition",
    "Occult",
    "Old Testament",
    "Omegaverse",
    "Oral History",
    "Ornithology",
    "Outdoors",
    "Own",
    "Paganism",
    "Pakistan",
    "Palaeontology",
    "Paramedics",
    "Paranormal",
    "Paranormal Mystery",
    "Paranormal Romance",
    "Paranormal Urban Fantasy",
    "Parenting",
    "Peak Oil",
    "Personal Development",
    "Personal Finance",
    "Philosophy",
    "Photography",
    "Physics",
    "Picture Books",
    "Pilots",
    "Pirates",
    "Planetary Romance",
    "Planets",
    "Plantagenet",
    "Plants",
    "Plays",
    "Plus Size",
    "Poetry",
    "Poetry Plays",
    "Poland",
    "Police",
    "Polish Literature",
    "Political Science",
    "Politics",
    "Polyamory",
    "Polygamy",
    "Pop Culture",
    "Popular Science",
    "Pornography",
    "Portugal",
    "Portuguese Literature",
    "Post Apocalyptic",
    "Post Colonial",
    "Poverty",
    "Prayer",
    "Pre K",
    "Pre Raphaelite",
    "Prehistoric",
    "Prehistory",
    "Presidents",
    "Princesses",
    "Productivity",
    "Professors",
    "Programming",
    "Prostitution",
    "Pseudoscience",
    "Psychiatry",
    "Psychoanalysis",
    "Psychological Thriller",
    "Psychology",
    "Pulp",
    "Punk",
    "Puzzles",
    "Quantum Mechanics",
    "Queer",
    "Queer Lit",
    "Queer Studies",
    "Quilting",
    "Rabbits",
    "Race",
    "Racing",
    "Railways",
    "Read For College",
    "Read For School",
    "Realistic Fiction",
    "Recreation",
    "Reference",
    "Regency",
    "Regency Romance",
    "Relationships",
    "Religion",
    "Reportage",
    "Republic Of The Congo",
    "Research",
    "Retellings",
    "Reverse Harem",
    "Road Trip",
    "Robots",
    "Rock N Roll",
    "Role Playing Games",
    "Roman",
    "Roman Britain",
    "Romance",
    "Romania",
    "Romanian Literature",
    "Romanovs",
    "Romantic",
    "Romantic Suspense",
    "Romanticism",
    "Royal Air Force",
    "Rus",
    "Russia",
    "Russian History",
    "Russian Literature",
    "Russian Revolution",
    "Rwanda",
    "Satanism",
    "Scandinavian Literature",
    "School",
    "School Stories",
    "Sci Fi Fantasy",
    "Science",
    "Science Fiction",
    "Science Fiction Fantasy",
    "Science Fiction Romance",
    "Science Nature",
    "Scotland",
    "Scripture",
    "Seinen",
    "Self Help",
    "Semiotics",
    "Senegal",
    "Sequential Art",
    "Serbian Literature",
    "Sewing",
    "Sex Work",
    "Sexuality",
    "Shapeshifters",
    "Shojo",
    "Shonen",
    "Short Stories",
    "Short Story Collection",
    "Shounen Ai",
    "Sierra Leone",
    "Silhouette",
    "Singularity",
    "Skepticism",
    "Slash Fiction",
    "Slice Of Life",
    "Soccer",
    "Social",
    "Social Change",
    "Social Issues",
    "Social Justice",
    "Social Media",
    "Social Movements",
    "Social Science",
    "Social Work",
    "Society",
    "Sociology",
    "Software",
    "Soldiers",
    "Somalia",
    "South Africa",
    "Southern",
    "Southern Gothic",
    "Soviet History",
    "Soviet Union",
    "Space",
    "Space Opera",
    "Spain",
    "Spanish Civil War",
    "Spanish Literature",
    "Speculative Fiction",
    "Spider Man",
    "Spiritualism",
    "Spirituality",
    "Splatterpunk",
    "Sports",
    "Sports Romance",
    "Spy Thriller",
    "Stand Up",
    "Star Trek",
    "Star Trek Deep Space Nine",
    "Star Trek Original Series",
    "Star Trek The Next Generation",
    "Star Trek Voyager",
    "Star Wars",
    "Steampunk",
    "Stories",
    "Storytime",
    "Street Art",
    "Strippers",
    "Stuart",
    "Students",
    "Sudan",
    "Superheroes",
    "Superman",
    "Supernatural",
    "Supernatural Romance",
    "Surreal",
    "Survival",
    "Suspense",
    "Sustainability",
    "Swashbuckling",
    "Sweden",
    "Swedish Literature",
    "Sword and Planet",
    "Sword and Sorcery",
    "Tanzania",
    "Taoism",
    "Tarot",
    "Tasmania",
    "Taxation",
    "Tea",
    "Teachers",
    "Teaching",
    "Technical",
    "Technology",
    "Teen",
    "Terrorism",
    "Textbooks",
    "The Americas",
    "The United States Of America",
    "The World",
    "Theatre",
    "Thelema",
    "Theology",
    "Theory",
    "Theosophy",
    "Thriller",
    "Time Travel",
    "Time Travel Romance",
    "Togo",
    "Traditional Chinese Medicine",
    "Traditional Regency",
    "Tragedy",
    "Trains",
    "Transgender",
    "Transport",
    "Travel",
    "Travelogue",
    "Trivia",
    "True Crime",
    "True Story",
    "Tudor Period",
    "Turkish",
    "Turkish Literature",
    "Tv",
    "Uganda",
    "Ukraine",
    "Ukrainian Literature",
    "Unfinished",
    "Unicorns",
    "United States",
    "Urban",
    "Urban Fantasy",
    "Urban Planning",
    "Urban Studies",
    "Urbanism",
    "Us Presidents",
    "Usability",
    "Utopia",
    "Vaccines",
    "Vampires",
    "Vegan",
    "Vegetarian",
    "Vegetarianism",
    "Victor Frankenstein",
    "Victorian",
    "Victorian Romance",
    "Video Games",
    "Viking Romance",
    "Virtual Reality",
    "Visual Art",
    "Walking",
    "War",
    "Warcraft",
    "Warriors",
    "Webcomic",
    "Website Design",
    "Weird Fiction",
    "Weird West",
    "Werewolves",
    "Western Africa",
    "Western Historical Romance",
    "Western Romance",
    "Westerns",
    "Whodunit",
    "Wicca",
    "Wilderness",
    "Wildlife",
    "Wine",
    "Witchcraft",
    "Witches",
    "Wizards",
    "Wolves",
    "Womens",
    "Womens Fiction",
    "Womens Studies",
    "Wonder Woman",
    "Woodwork",
    "Words",
    "World History",
    "World Of Darkness",
    "World Of Warcraft",
    "World War I",
    "World War II",
    "Writing",
    "X Men",
    "Yaoi",
    "Yeti",
    "Young Adult",
    "Young Adult Contemporary",
    "Young Adult Fantasy",
    "Young Adult Historical Fiction",
    "Young Adult Paranormal",
    "Young Adult Romance",
    "Young Adult Science Fiction",
    "Young Readers",
    "Yuri",
    "Zambia",
    "Zen",
    "Zimbabwe",
    "Zombies",
    "漫画",
  ];
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
      fetchBooks();

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
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/books/", {
        params: { search: searchQuery },
      });
      setBooks(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
    setLoading(false);
  };

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearchBook = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);

    if (!searchQuery) {
      fetchBooks(); // If searchQuery is empty, fetch all books
      setLoading(false);
      return;
    }

    try {
      // Call the "/books/search/" API endpoint with the searchQuery as a parameter
      const response = await api.get("/books/search/", {
        params: { title: searchQuery },
      });
      setBooks(response.data.results); // Update the books state with the search results
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to search books:", error);
    }
    setLoading(false);
  };

  const handleNextPage = () => {
    if (nextPage) fetchBooks(nextPage);
  };

  const handlePrevPage = () => {
    if (prevPage) fetchBooks(prevPage);
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
      fetchBooks();

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
      fetchBooks(); // Refresh the book list
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
                    <TableCell sx={{ color: "white" }}>Book ID</TableCell>
                    <TableCell sx={{ color: "white" }}>Title</TableCell>

                    <TableCell sx={{ color: "white" }}>Author</TableCell>

                    <TableCell sx={{ color: "white" }}>Cover Image</TableCell>
                    <TableCell sx={{ color: "white" }}>Price</TableCell>
                    <TableCell sx={{ color: "white" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.bookId}>
                      {/* 'bookId', 'title', 'author', 'price', 'coverImg' */}
                      <TableCell>{book.bookId}</TableCell>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>

                      <TableCell>
                        <img
                          src={book.coverImg}
                          alt={book.title}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </TableCell>
                      <TableCell>{book.price}$</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleMenuClick(event, book)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
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
