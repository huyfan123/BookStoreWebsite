import React, { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import Header from "../components/header";
import api from "../apis/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (tabValue === 1) {
      fetchOrders();
    }
  }, [tabValue]);

  useEffect(() => {
    if (!document.cookie.includes("username")) {
      navigate("/login");
      toast.error("Please log in to access your dashboard.");
      return;
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const username = document.cookie
        .split(";")
        .find((item) => item.includes("username"))
        ?.split("=")[1];
      const response = await api.get(`/orders?username=${username}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    filter === "All" ? true : order.status === filter
  );

  const handleCancelOrder = async (orderId: number) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      );
      if (!isConfirmed) return;

      await api.put(
        "/orders/status/",
        {},
        {
          params: {
            order_id: orderId,
            username: username,
          },
        }
      );

      toast.success("Order cancelled successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order.");
    }
  };

  useEffect(() => {
    setUsername(
      document.cookie
        .split(";")
        .find((item) => item.includes("username"))
        ?.split("=")[1] || ""
    );
    setFullname(
      document.cookie
        .split(";")
        .find((item) => item.includes("fullname"))
        ?.split("=")[1] || ""
    );
    setEmail(
      document.cookie
        .split(";")
        .find((item) => item.includes("email"))
        ?.split("=")[1] || ""
    );
    setPhone(
      document.cookie
        .split(";")
        .find((item) => item.includes("phone"))
        ?.split("=")[1] || ""
    );
    setAddress(
      document.cookie
        .split(";")
        .find((item) => item.includes("address"))
        ?.split("=")[1] || ""
    );
  }, []);

  const handleSave = () => {
    document.cookie = `fullname=${fullname}; path=/`;
    document.cookie = `phonenumber=${phone}; path=/`;
    document.cookie = `address=${address}; path=/`;
    
    api
      .patch("/accounts/edit/?username=" + username, {
        fullname,
        phonenumber: phone,
        address,
      })
      .then((response) => {
        console.log("User information updated successfully:", response.data);
        toast.success("User information updated successfully");
      })
      .catch((error) => {
        console.error("Error updating user information:", error);
        toast.error("Failed to update user information");
      });
  };

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    api
      .patch("/accounts/edit/?username=" + username, {
        password,
      })
      .then((response) => {
        toast.success("Change password successfully");
        setPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        toast.error("Failed to change password");
      });
  };

  const handleDelete = () => {
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "fullname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "phonenumber=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    api
      .delete("/accounts/delete/?username=" + username)
      .then((response) => {
        console.log("User account deleted successfully:", response.data);
        window.location.href = "/";
        toast.success("User account deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting user account:", error);
        toast.error("Failed to delete user account");
      });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipping":
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header checkPoint={0} />

      <div className="px-4 md:px-10 lg:px-30 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Account Management</h1>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex border-b mb-6 overflow-x-auto">
            {["Personal Info", "Order history", "Settings"].map((tab, index) => (
              <button
                key={index}
                className={`py-3 px-6 whitespace-nowrap font-medium transition-colors border-b-2 ${
                  tabValue === index
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setTabValue(index)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Personal Info Tab */}
          {tabValue === 0 && (
            <div>
              <h2 className="text-xl font-medium mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Account Name</label>
                  <Input
                    value={username}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    value={email}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Order History Tab */}
          {tabValue === 1 && (
            <div>
              <div className="flex flex-wrap gap-2 my-4">
                {["All", "Shipping", "Delivered", "Processing", "Cancelled"].map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? "default" : "outline"}
                    onClick={() => setFilter(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.orderId} className="border rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="text-lg font-medium">Order #{order.orderId}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      Order Date: {new Date(order.orderDate).toLocaleDateString("en-GB")}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm mb-4">
                      Receiver: {order.receiverName} | Phone: {order.receiverPhone}
                    </p>

                    <div className="space-y-4 mb-4 border-t pt-4">
                      {order.items.map((item: any) => (
                        <div key={item.orderItemId} className="flex items-center gap-4">
                          <img
                            src={item.coverImg}
                            alt={item.bookId}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.bookId}</p>
                            <p className="text-sm text-gray-500">
                              ${item.price} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-4 mt-2 gap-4">
                      <p className="font-semibold text-lg">Total: ${order.totalAmount}</p>

                      {order.status === "Processing" && (
                        <Button variant="destructive" onClick={() => handleCancelOrder(order.orderId)}>
                          Cancel Order
                        </Button>
                      )}

                      {order.status === "Shipping" && (
                        <Button variant="destructive" disabled>
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredOrders.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    No orders found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {tabValue === 2 && (
            <div>
              <h2 className="text-xl font-medium mb-6">Settings</h2>
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button onClick={handleChangePassword}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
