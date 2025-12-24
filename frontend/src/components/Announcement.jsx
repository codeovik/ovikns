import { Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

export default function Announcement() {
  const { config } = useAppContext();

  return (
    <div className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 px-4 text-center text-sm font-medium relative z-50 transition-colors">
      <p className="flex items-center justify-center gap-2 flex-wrap">
        <span>Free shipping on over ${config.freeShippingThreshold} order.</span>
        <Link to="/products" className="underline hover:opacity-80 transition-opacity font-bold whitespace-nowrap">
          Shop Now
        </Link>
      </p>
    </div>
  );
}
