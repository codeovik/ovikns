import { createContext, use, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // user auth variables
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // admin auth variables
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  // products variables
  const [allUser, setAllUser] = useState(null);
  const [allProduct, setAllProduct] = useState(null);

  // cart variables
  const [cart, setCart] = useState(null);
  const [cartSummary, setCartSummary] = useState({ totalItems: 0, totalPrice: 0 });
  const [myOrders, setMyOrders] = useState([]);
  const [allCarts, setAllCarts] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);

  // config variables
  const [config, setConfig] = useState({freeShippingThreshold: 0, shippingFee: 0});

  // common varriables
  const navigate = useNavigate();


  // axoios instance for API call
  const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_DOMAIN,
    withCredentials: true,
  })


  /*-------------------------------------------------------------------------
  --------------- user auth ------------------------------------------------
  -------------------------------------------------------------------------*/
  // signup
  const signup = async (userData) => {
    try {
      await API.post("/api/v1/auth/signup", userData);
      setIsAuth(true);
      toast.success(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // signin
  const signin = async (userData) => {
    try {
      const res = await API.post("/api/v1/auth/signin", userData);
      setIsAuth(true);
      toast.success(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // signout
  const signout = async () => {
    try {
      const res = await API.post("/api/v1/auth/signout");
      setIsAuth(false);
      toast.success(res.data.message)
      navigate("/signin");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  // delete account
  const deleteAccount = async () => {
    try {
      await API.delete("/api/v1/auth/delete");
      setIsAuth(false);
      setUser(null);
      navigate("/signup");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  // check auth when page loads
  useEffect(() => {
    const checkAuths = async () => {
      try {
        const [userRes, adminRes] = await Promise.allSettled([
          API.get("/api/v1/auth/profile"),
          API.get("/api/v1/admin/profile")
        ]);

        if (userRes.status === "fulfilled") {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }

        if (adminRes.status === "fulfilled") {
          setIsAdminAuth(true);
        } else {
          setIsAdminAuth(false);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuths();
  }, []);
  // get user data when `isAuth` changes
  useEffect(() => {
    const fetchUser = async () => {
      if (isAuth) {
        try {
          const res = await API.get("/api/v1/auth/profile");
          setUser(res.data.user);
        } catch (error) {
          toast.error(error.response.data.message);
          setUser(null);
        }
      }
    };
    fetchUser();
  }, [isAuth]);
  // get all users for admin
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await API.get("/api/v1/auth/users");
        setAllUser(res.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchAllUsers();
  }, []);

  /*-------------------------------------------------------------------------
  --------------- admin auth ------------------------------------------------
  -------------------------------------------------------------------------*/
  // admin signin
  const adminSignin = async ({ password }) => {
    try {
      const res = await API.post("/api/v1/admin/signin", { password });
      setIsAdminAuth(true);
      toast.success(res.data.message);
      navigate("/admin");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  /*-------------------------------------------------------------------------
  --------------- products ------------------------------------------------
  -------------------------------------------------------------------------*/
  // create product
  const createProduct = async (formData) => {
    try {
      const res = await API.post("/api/v1/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      setAllProduct((prev) => (prev ? [...prev, res.data.product] : [res.data.product]));
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to create product";
      toast.error(errorMsg);
      return { success: false };
    }
  };
  // get all products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await API.get("/api/v1/products");
        setAllProduct(res.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchAllProducts();
  }, []);
  // delete product
  const deleteProduct = async (id) => {
    try {
      const res = await API.delete(`/api/v1/products/${id}`);
      toast.success(res.data.message);
      setAllProduct((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to delete product";
      toast.error(errorMsg);
    }
  };
  // Update product
  const updateProduct = async (id, formData) => {
    try {
      const res = await API.put(`/api/v1/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      setAllProduct((prev) => prev.map((product) => (product._id === id ? res.data.product : product)));
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update product";
      toast.error(errorMsg);
      return { success: false };
    }
  };

  /*-------------------------------------------------------------------------
  --------------- cart ------------------------------------------------
  -------------------------------------------------------------------------*/
  // get cart summary
  const fetchCartSummary = async () => {
    if (isAuth) {
      try {
        const res = await API.get("/api/v1/cart/summary");
        setCartSummary(res.data.summary);
      } catch (error) {
        console.error(error);
      }
    }
  };
  // get cart
  const fetchCart = async () => {
    if (isAuth) {
      try {
        const res = await API.get("/api/v1/cart");
        setCart(res.data.cart);
        await fetchCartSummary();
      } catch (error) {
        console.error(error);
      }
    }
  };
  // add to cart
  const addToCart = async (productId, quantity, color) => {
    try {
      const res = await API.post("/api/v1/cart", { productId, quantity, color });
      setCart(res.data.cart);
      await fetchCartSummary();
      toast.success("Added to cart", {
        action: {
          label: "View Cart",
          onClick: () => navigate("/cart"),
        },
      });
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
      return { success: false };
    }
  };
  // update cart item
  const updateCartItem = async (productId, quantity, color) => {
    try {
      const res = await API.put("/api/v1/cart", { productId, quantity, color });
      setCart(res.data.cart);
      await fetchCartSummary();
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart");
      return { success: false };
    }
  };
  // remove cart item
  const removeCartItem = async (itemId) => {
    try {
      const res = await API.delete(`/api/v1/cart/${itemId}`);
      setCart(res.data.cart);
      await fetchCartSummary();
      toast.success("Item removed");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
      return { success: false };
    }
  };
  // clear cart
  const clearCart = async () => {
    try {
      await API.delete("/api/v1/cart/clear");
      setCart({ items: [] });
      setCartSummary({ totalItems: 0, totalPrice: 0 });
      toast.success("Cart cleared");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    }
  };
  // fetch cart when isAuth changes
  useEffect(() => {
    if (isAuth) fetchCart();
    else {
      setCart(null);
      setCartSummary({ totalItems: 0, totalPrice: 0 });
    }
  }, [isAuth]);

  /*-------------------------------------------------------------------------
  --------------- config --------------------------------------------------
  -------------------------------------------------------------------------*/
  // fetch config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await API.get("/api/v1/config");
        if (res.data.config) setConfig(res.data.config);
      } catch (error) {
        // console.log("Using default config or backend not ready");
      }
    };
    fetchConfig();
  }, []);

  // update config
  const updateConfig = async (newConfig) => {
    try {
      const res = await API.put("/api/v1/config", newConfig);
      setConfig(res.data.config);
      toast.success("Configuration updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update config");
    }
  };

  /*-------------------------------------------------------------------------
  --------------- orders & payment ----------------------------------------
  -------------------------------------------------------------------------*/
  // place order
  const placeOrder = async (orderData) => {
    try {
      const res = await API.post("/api/v1/orders", orderData);
      return { success: true, orderId: res.data.order._id };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
      return { success: false };
    }
  };

  // stripe payment
  const stripePayment = async (orderId) => {
    try {
      const res = await API.post("/api/v1/payment/stripe", { orderId });
      if (res.data.success) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  // fetch user orders
  const fetchMyOrders = async () => {
    if (isAuth) {
      try {
        const res = await API.get("/api/v1/orders");
        setMyOrders(res.data.orders);
      } catch (error) {
        console.error(error);
        // toast.error("Failed to fetch orders");
      }
    }
  };

  // fetch all carts (admin)
  const fetchAllCarts = async () => {
    try {
      const res = await API.get("/api/v1/cart/all");
      setAllCarts(res.data.carts);
    } catch (error) {
      // toast.error(error.response?.data?.message || "Failed to fetch carts");
      console.error(error);
    }
  };

  // fetch all orders (admin)
  const fetchAllOrders = async () => {
    try {
      const res = await API.get("/api/v1/orders/all");
      setAdminOrders(res.data.orders);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  // update order status (admin)
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await API.put(`/api/v1/orders/${orderId}/status`, { status });
      toast.success(res.data.message);
      setAdminOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, orderStatus: status } : order))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuth, user, loading, signup, signin, signout, deleteAccount, adminSignin, isAdminAuth, createProduct, allUser, allProduct, deleteProduct, updateProduct, cart, cartSummary, addToCart, updateCartItem, removeCartItem, clearCart, config, updateConfig, placeOrder, stripePayment, myOrders, fetchMyOrders, allCarts, fetchAllCarts, adminOrders, fetchAllOrders, updateOrderStatus, navigate, toast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);