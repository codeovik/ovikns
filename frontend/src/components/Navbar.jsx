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
          <ul className="hidden lg:flex space-x-4">
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
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <button className="lg:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-box/95 backdrop-blur-md border-t border-box-secondary shadow-2xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out origin-top ${isOpen ? "h-[calc(100vh-72px)] opacity-100 translate-y-0" : "h-0 opacity-0 -translate-y-4 pointer-events-none"}`}>
          <div className="flex flex-col items-center py-8 gap-6">
            {/* User Info */}
            {isAuth && (
              <div className="text-center space-y-1 animate-in fade-in slide-in-from-top-4 duration-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
                <p className="text-xl font-semibold text-primary">{user?.name}</p>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex flex-col items-center gap-2 w-full">
              {navLinks.map((link) => (
                <NavLink
                  key={link}
                  to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium w-full text-center py-3 hover:bg-box-secondary transition-colors relative ${isActive ? "text-primary bg-primary/5" : "text-gray-700 dark:text-gray-200"}`
                  }
                >
                  {link}
                </NavLink>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4 mt-2 w-full px-8">
              <div className="flex items-center justify-between w-full max-w-xs bg-box-secondary/50 p-3 rounded-xl border border-box-secondary">
                <span className="text-sm font-medium ml-2">Appearance</span>
                <ThemeToggle />
              </div>

              {!isAuth && (
                <Link to="/signin" onClick={() => setIsOpen(false)} className="w-full max-w-xs">
                  <Button className="w-full" size="lg">
                    <RiAccountCircle2Line className="mr-2" /> Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}