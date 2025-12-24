import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Link, NavLink } from "react-router-dom";
import { FaRegUser, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle";
import { RiAccountCircle2Line } from "react-icons/ri";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IoSettingsOutline } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { IoReorderFour } from "react-icons/io5";

export default function Navbar() {

  const { isAuth, user, cartSummary, navigate, signout } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Home", "Products", "Categories", "About", "Contact"];

  return (
    <>
      <nav className="bg-box w-full sticky top-0 z-50">
        <div className="px-8 py-4 max-w-400 w-full flex justify-between items-center mx-auto">
          {/* logo  */}
          <Link to="/" className="">
            <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/logo-light-2.png" alt="logo for light mode" className="dark:hidden h-10 w-auto" />
            <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/logo-dark-2.png" alt="logo for dark mode" className="hidden dark:block h-10 w-auto" />
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
          {/* righ side content */}
          <div className="flex items-center gap-4">
            {isAuth ? (
              <>
                {/* hi, username */}
                <p className="hidden lg:block text-lg text-black/75 font-medium dark:text-white/75">Hi, <span className="text-black dark:text-white">{user?.name}</span></p>
                {/* user icon */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <FaRegUser className="text-2xl cursor-pointer" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/settings")}>
                        <IoSettingsOutline /> Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/orders")}>
                        <IoReorderFour /> My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={signout}>
                        <FaSignOutAlt />Sign out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* cart icon */}
                <Button variant="outline" onClick={() => navigate("/cart")} className="relative">
                  <MdOutlineShoppingBag className="text-2xl cursor-pointer" />
                  {cartSummary.totalItems > 0 && <p className="absolute -bottom-1 bg-red-400 rounded-full text-xs -right-1 px-1.5">{cartSummary.totalItems}</p>}
                </Button>
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
            <div className="hidden md:visible">
              <ThemeToggle />
            </div>
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
    </>
  );
}