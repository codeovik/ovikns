import { Routes, Route, Navigate } from "react-router-dom";
import Signin from "@/pages/Signin";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner"
import Home from "@/pages/Home";
import AllProduct from "@/pages/AllProduct";
import AllCategories from "@/pages/AllCategories";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ProductDetails from "@/pages/ProductDetails";
import NotFound from "@/pages/NotFound";
import AdminSignin from "@/pages/admin/AdminSignin";
import AdminPanel from "@/pages/admin/AdminPanel";
import UploadProduct from "@/pages/admin/UploadProduct";
import ManageProducts from "@/pages/admin/ManageProducts";
import ManageOrders from "@/pages/admin/ManageOrders";
import ManageUsers from "@/pages/admin/ManageUsers";
import EditProduct from "@/pages/admin/EditProduct";
import Footer from "@/components/Footer";
import RedirectLink from "@/pages/RedirectLink";
import Loading from "@/components/Loading";

function App() {

  const { isAuth, loading, isAdminAuth } = useAppContext();

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-400 mx-auto px-8 mt-8">
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProduct />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/:id" element={<RedirectLink />} />

          {/* auth protected routes */}
          <Route path="/signin" element={!isAuth ? <Signin /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!isAuth ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/settings" element={isAuth ? <Settings /> : <Navigate to="/signin" />} />

          {/* admin protected routes */}
          <Route path="/admin/signin" element={isAdminAuth ? <Navigate to="/admin" /> : <AdminSignin />} />
          <Route path="/admin" element={isAdminAuth ? <AdminPanel /> : <Navigate to="/admin/signin" />} />
          <Route path="/admin/upload" element={isAdminAuth ? <UploadProduct /> : <Navigate to="/admin/signin" />} />
          <Route path="/admin/products" element={isAdminAuth ? <ManageProducts /> : <Navigate to="/admin/signin" />} />
          <Route path="/admin/product/edit/:id" element={isAdminAuth ? <EditProduct /> : <Navigate to="/admin/signin" />} />
          <Route path="/admin/orders" element={isAdminAuth ? <ManageOrders /> : <Navigate to="/admin/signin" />} />
          <Route path="/admin/users" element={isAdminAuth ? <ManageUsers /> : <Navigate to="/admin/signin" />} />
        </Routes>
      <Footer />
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;