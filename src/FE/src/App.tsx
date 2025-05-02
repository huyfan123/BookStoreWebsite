import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Product from "./pages/products";
import Cart from "./pages/cart";
import BookDetails from "./pages/productDetails";
import LoginRegisterForm from "./pages/loginPage";
import UserDashboard from "./pages/userDashboard";
import UserManagement from "./pages/adminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/details" element={<BookDetails />} />
        <Route path="/login" element={<LoginRegisterForm />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

