import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import { FaArrowRight } from "react-icons/fa6";

export default function Home() {
  const { allProduct } = useAppContext();

  return (
    <>
      <Hero />

      {/* best selling */}
      <div className="flex justify-between w-full mt-18 items-center mb-6">
        <p className="text-4xl font-medium">Best Selling</p>
        <Link to="/products">
          <Button variant="outline" size="lg">
            View all <FaArrowRight />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {allProduct && [...allProduct].sort((a, b) => b.sold - a.sold).slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* newest arrivals */}
      <div className="flex justify-between w-full mt-18 items-center mb-6">
        <p className="text-4xl font-medium">Newest Arrivals</p>
        <Link to="/products">
          <Button variant="outline" size="lg">
            View all <FaArrowRight />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {allProduct && [...allProduct].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="flex sm:text-8xl font-semibold max-w-330 mx-auto text-5xl flex-wrap justify-center items-center gap-3 md:gap-6 mb-2">
        <span>Make</span>
        <img src="https://sleek-theme-demo.myshopify.com/cdn/shop/files/text-with-image-2-min.jpg" alt="" className="aspect-auto h-14 md:h-25 rounded-full" />
        <span>your</span>
        <span>look</span>
        <img src="https://sleek-theme-demo.myshopify.com/cdn/shop/files/text-with-image-1-min.jpg" alt="" className="aspect-auto h-14 md:h-25 rounded-full" />
        <span>and</span>
        <span>feel</span>
        <img src="https://sleek-theme-demo.myshopify.com/cdn/shop/files/text-with-image-3-min.jpg" alt="" className="aspect-auto h-14 md:h-25 rounded-full" />
        <span>glowly</span>
      </div>
    </>
  )
}