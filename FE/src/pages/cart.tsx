import React, { useEffect, useState } from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import api from "../apis/api";
import { toast } from "react-toastify";
import Header from "../components/header";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import emptyCartImg from "../assets/Images/emptyCart.png";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0); // Example discount amount
  const [shippingFee, setShippingFee] = useState(5); // Example shipping fee

  const handleRemoveItem = (cartId: number) => {
    setCartItems(cartItems.filter((item) => item.cartId !== cartId));
    api
      .delete(`cart/delete/?cartId=${cartId}`)
      .then(() => {
        toast.success("Removed book successfully");
      })
      .catch(() => {
        toast.error("Error removing book");
      });
  };

  const handleQuantityChange = (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
    api
      .put(`cart/edit/?cartId=${cartId}`, { quantity: newQuantity })
      .then(() => {
        // console.log("Quantity updated successfully");
      })
      .catch(() => {
        console.error("Error updating quantity");
      });
  };

  const calculateSubtotal = () =>
    cartItems.reduce(
      (total, item) => total + parseFloat(item.book.price) * item.quantity,
      0
    );

  const calculateTotal = () => {
    const total = calculateSubtotal() + shippingFee - discountAmount;
    return total > 0 ? total : 0;
  };

  const handleCleanCart = () => {
    // loop through books in cart and delete them
    cartItems.forEach((item) => {
      api
        .delete(`cart/delete/?cartId=${item.cartId}`)
        .then(() => {})
        .catch(() => {
          console.error("Error removing book");
        });
    });
    setCartItems([]);
  };

  const handleApplyCoupon = () => {
    if (couponCode === "DISCOUNT10") {
      setApplyDiscount(true);
      setDiscountAmount(2); // Example discount amount
      toast.success("Coupon applied successfully!");
    } else {
      setApplyDiscount(false);
      setDiscountAmount(0);
      toast.error("Invalid coupon code.");
    }
  };

  const handlePurchase = () => {
    if (!receiverName || !receiverPhone || !address) {
      toast.error(
        "Please fill in all required fields (Receiver Name, Phone, Address)."
      );
      return;
    }

    const orderData = {
      username: document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("username="))
        ?.split("=")[1],
      receiverName,
      receiverPhone,
      shippingAddress: address,
      paymentMethod: paymentMethod,
      items: cartItems.map((item) => ({
        book_id: item.book.bookId, // Assuming `book.id` exists
        quantity: item.quantity,
        price: parseFloat(item.book.price),
      })),
    };

    api
      .post("orders/create/", orderData)
      .then((response) => {
        toast.success("Order placed successfully!");
        handleCleanCart();
        setReceiverName("");
        setReceiverPhone("");
        setAddress("");
        setCartItems([]);
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        toast.error(error.response?.data?.error || "Error placing order");
      });
  };

  useEffect(() => {
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
        setCartItems(response.data);
        setReceiverName(
          document.cookie
            .split(";")
            .find((cookie) => cookie.trim().startsWith("fullname="))
            ?.split("=")[1] || ""
        );
        setReceiverPhone(
          document.cookie
            .split(";")
            .find((cookie) => cookie.trim().startsWith("phonenumber="))
            ?.split("=")[1] || ""
        );
        setAddress(
          document.cookie
            .split(";")
            .find((cookie) => cookie.trim().startsWith("address="))
            ?.split("=")[1] || ""
        );
      })
      .catch(() => {
        if (!document.cookie.includes("username")) {
          navigate("/login");
          toast.error("Please log in to view your cart");
          return;
        }
        toast.error("Error fetching cart items");
      });
  }, [navigate]);

  return (
    <div>
      <Header checkPoint={cartItems.length} />
      <div className="min-h-screen bg-neutral-100 px-4 py-4 md:px-16 md:py-8">
        {/* Header Section */}
        <h1 className="text-3xl font-semibold mb-2">Your Shopping Cart</h1>
        <p className="text-gray-600 mb-8">{cartItems.length} items in your cart</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {cartItems.length === 0 ? (
            // Empty Cart Section
            <div className="md:col-span-8 bg-white rounded-lg p-6 mt-10 shadow text-center flex flex-col items-center">
              <img
                className="h-[400px] w-[300px] mb-4 object-cover mx-auto"
                src={emptyCartImg}
                alt="Your cart is empty"
              />
              <h2 className="text-xl font-medium">Your cart is empty</h2>
              <Button
                className="mt-4"
                onClick={() => navigate("/products")}
              >
                Go Shopping
              </Button>
            </div>
          ) : (
            // Book List Section
            <div className="md:col-span-8 bg-white rounded-lg shadow p-6">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="flex flex-col sm:flex-row sm:items-center mb-4 border-b border-gray-200 pb-4"
                >
                  <img
                    src={item.book.coverImg}
                    alt={item.book.title}
                    className="w-full sm:w-20 h-[180px] sm:h-[120px] rounded object-cover mb-4 sm:mb-0 sm:mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{item.book.title}</h3>
                    <p className="text-sm text-gray-500">by {item.book.author}</p>
                    <p className="mt-2 text-base">${parseFloat(item.book.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto mt-4 sm:mt-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      value={item.quantity}
                      type="number"
                      min={1}
                      className="w-16 mx-2 text-center"
                      onChange={(e) =>
                        handleQuantityChange(item.cartId, parseInt(e.target.value) || 1)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="sm:ml-4 mt-4 sm:mt-0 text-base font-medium whitespace-nowrap">
                    ${(parseFloat(item.book.price) * item.quantity).toFixed(2)}{" "}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-4 sm:mt-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveItem(item.cartId)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Order Summary Section */}
          <div className="md:col-span-4 bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Receiver's name</label>
                  <Input
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Receiver's phone number</label>
                  <Input
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="border-t my-4" />

            <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-4"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>

            <div className="border-t my-4" />

            <label className="block text-sm font-medium mb-1">Coupon Code</label>
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter your coupon code"
              className="mb-4"
            />
            <Button
              className="w-full mb-4"
              onClick={handleApplyCoupon}
              disabled={cartItems.length === 0}
            >
              Apply
            </Button>

            <div className="border-t my-4" />

            <h3 className="text-xl font-semibold mb-4">Cart Total</h3>
            <div className="flex justify-between mb-2">
              <p>Cart Subtotal:</p>
              <p>${calculateSubtotal().toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Shipping:</p>
              <p>5.00 $</p>
            </div>
            {applyDiscount && (
              <div className="flex justify-between mb-2">
                <p>Discount:</p>
                <p>-${discountAmount.toFixed(2)}</p>
              </div>
            )}
            <div className="border-t my-4" />
            <div className="flex justify-between font-semibold text-lg">
              <p>Cart Total:</p>
              <p>${calculateTotal().toFixed(2)}</p>
            </div>
            <Button
              className="w-full mt-4 bg-yellow-400 text-black hover:bg-yellow-500"
              onClick={handlePurchase}
              disabled={cartItems.length === 0}
            >
              Purchase
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;

