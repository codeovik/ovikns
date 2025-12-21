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

  // products
  const [allUser, setAllUser] = useState(null);
  const [allProduct, setAllProduct] = useState(null);

  // common varriables
  const navigate = useNavigate();


  // axoios instance
  const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_DOMAIN,
    withCredentials: true,
  });


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
    const checkAuth = async () => {
      try {
        await API.get("/api/v1/auth/profile");
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
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
  // check admin auth when page loads
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        await API.get("/api/v1/admin/profile");
        setIsAdminAuth(true);
      } catch (error) {
        setIsAdminAuth(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdminAuth();
  }, []);

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

  return (
    <AppContext.Provider
      value={{
        isAuth, user, loading, signup, signin, signout, deleteAccount, adminSignin, isAdminAuth, createProduct, allUser, allProduct, deleteProduct, updateProduct
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);