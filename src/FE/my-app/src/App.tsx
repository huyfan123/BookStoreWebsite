import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Product from "./pages/products";
// import Payment from "./pages/payment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        {/* <Route path="/payment" element={<Payment />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
