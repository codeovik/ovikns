import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Link, NavLink } from "react-router-dom";
import { FaRegUser, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle";
import { RiAccountCircle2Line } from "react-icons/ri";

export default function Navbar() {

  const { isAuth, user } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Home", "Products", "Categories", "About", "Contact"];

  return (
    <nav className="bg-box w-full sticky top-0 z-50">
      <div className="px-8 py-4 max-w-400 w-full flex justify-between items-center mx-auto">
        {/* logo  */}
        <Link to="/" className="">
          <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/logo-light.png" alt="logo for light mode" className="dark:hidden h-10 w-auto" />
          <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/logo-dark.png" alt="logo for dark mode" className="hidden dark:block h-10 w-auto" />
        </Link>
        {/* nav links */}
        <ul className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <li key={link} >
              <NavLink
                to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className={({ isActive }) =>
                  `transition-all relative after:absolute after:w-full after:h-px after:bg-primary w-max after:left-0 after:bottom-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100 ${isActive ? "text-primary after:scale-x-100 after:origin-bottom-left" : "after:origin-bottom-right after:scale-x-0"}`
                }>{link}</NavLink>
            </li>
          ))}
        </ul>
        {/* buttons */}
        <div className="flex items-center gap-4">
          {isAuth ? (
            <>
              <p className="hidden lg:block text-lg text-black/75 font-medium dark:text-white/75">Hi, <span className="text-black dark:text-white">{user?.name}</span></p>
              <FaRegUser className="text-2xl cursor-pointer" />
              <MdOutlineShoppingBag className="text-2xl cursor-pointer" />
            </>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="outline">
                  <RiAccountCircle2Line /> Sign In
                </Button>
              </Link>
            </>
          )}
          <ThemeToggle />
          <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-box border-t shadow-lg flex flex-col items-center py-4 gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link}
              to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `hover:text-primary transition-all ${isActive ? "text-primary font-medium" : ""}`
              }
            >
              {link}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}