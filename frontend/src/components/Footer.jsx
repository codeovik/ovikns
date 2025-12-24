import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { FaYoutube } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { TbBrandGithub } from "react-icons/tb";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-box w-full rounded-xl mb-6 mt-12 p-4 sm:p-6 md:p-12">
            <div className="grid lg:grid-cols-[2fr_1fr_1fr] sm:grid-cols-2 gap-12">
                <div className="sm:col-span-2 lg:col-span-1">
                    <h4 className="text-3xl text-center md:text-left font-medium mb-3">About</h4>
                    <p className="font-thin md:text-xl/7 mb-4 text-center md:text-left">ovikn is a next-gen dropshipping platform built with custom MERN technology, not a generic CMS. We connect you to global trends with secure payments and reliable shipping, engineered for performance.{"  "}
                        <Link to="/about" className="font-thin opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition after:origin-bottom-left after:scale-x-100">Learn more</Link>
                    </p>
                    <div className="flex gap-2 mt-6 w-full justify-center md:justify-start">
                        <a href="#">
                            <FaYoutube className="text-[44px] cursor-pointer hover:bg-box-tertiary transition-all bg-box-secondary p-3 rounded-full" />
                        </a>
                        <a href="#">
                            <FaTiktok className="text-[44px] cursor-pointer hover:bg-box-tertiary transition-all bg-box-secondary p-3 rounded-full" />
                        </a>
                        <a href="#">
                            <TbBrandGithub className="text-[44px] cursor-pointer hover:bg-box-tertiary transition-all bg-box-secondary p-3 rounded-full" />
                        </a>
                        <a href="#">
                            <FaInstagram className="text-[44px] cursor-pointer hover:bg-box-tertiary transition-all bg-box-secondary p-3 rounded-full" />
                        </a>
                    </div>
                </div>
                <div className="">
                    <h4 className="text-3xl text-center md:text-left font-medium mb-3">Customer care</h4>
                    <ul className="flex flex-col gap-2.5 text-xl items-center md:items-start">
                        <li className="">
                            <Link to="/contact" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">Contact</Link>
                        </li>
                        <li className="">
                            <Link to="/contact" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">Support</Link>
                        </li>
                        <li className="">
                            <Link to="/profile" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">My Accounts</Link>
                        </li>
                        <li className="">
                            <Link to="/carts" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">My Carts</Link>
                        </li>
                        <li className="">
                            <Link to="/orders" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">My Orders</Link>
                        </li>
                    </ul>
                </div>
                <div className="">
                    <h4 className="text-3xl text-center md:text-left font-medium mb-3">Explore</h4>
                    <ul className="flex flex-col gap-2.5 text-xl items-center md:items-start">
                        <li className="">
                            <Link to="/" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">Shop</Link>
                        </li>
                        <li className="">
                            <Link to="/categories" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">All Categories</Link>
                        </li>
                        <li className="">
                            <Link to="/products" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">Products</Link>
                        </li>
                        <li className="">
                            <Link to="/" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">Blogs</Link>
                        </li>
                    </ul>
                </div>
            </div>
            {/* devider */}
            <div className="block bg-box-tertiary rounded-full h-0.5 my-9"></div>
            <div className="flex justify-between items-center flex-col md:flex-row gap-6">
                <div className="space-y-1">
                    <p className="text-lg">© {new Date().getFullYear()} <span className="opacity-70 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition after:origin-bottom-left after:scale-x-100 cursor-pointer">ovikn</span>. All rights reserved.</p>
                    <p className="">💔 Made by <a href="https://codeovik.web.app" target="_blank" className="opacity-70 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition after:origin-bottom-left after:scale-x-100">CodeOVIK</a></p>
                    <p className="">🌟 Star this project on <a href="https://github.com/codeovik/ovikn" target="_blank" className="opacity-70 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition after:origin-bottom-left after:scale-x-100">GitHub</a></p>
                </div>
                {/* navigate cordinate (0, 0) */}
                <Button variant="outline" onClick={() => window.scrollTo(0, 0)} >
                    Go top <FaArrowRight className="-rotate-90" />
                </Button>
            </div>
        </footer>
    );
}