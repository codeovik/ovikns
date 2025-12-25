import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    return (
        <Link to={`/products/${product._id}`} className="group block h-full">
            <div className="bg-box rounded-xl overflow-hidden border-2 border-box-secondary h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-box group">
                    <img src={product.images[0]} alt={product.title} className="absolute top-0 left-0 w-full h-full transition-transform duration-300" />
                    <img src={product.images[1]} alt={product.title} className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 scale-110 group-hover:scale-100 transition-all duration-500" />
                    {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-base px-3 py-1 rounded-full">
                            {product.discount}% OFF
                        </div>
                    )}
                </div>
                <div className="p-4 flex flex-col grow">
                    <div className="flex justify-between">
                        {/* category */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.category}</p>
                        {/* in stock */}
                        {product.inStock ? <span className="text-green-500">Abailable</span> : <span className="text-red-500">Not Abailable</span>}
                    </div>
                    {/* title */}
                    <h3 className="font-semibold text-xl md:text-[22px] truncate mb-0.5 md:mb-2" title={product.title}>{product.title}</h3>
                    <div className="flex items-center justify-between w-full">
                        <p className="mt-auto flex items-center gap-2 md:text-xl">
                            {/* final price */}
                            <span className="font-bold text-primary">${product.finalPrice ? product.finalPrice.toFixed(2) : product.price}</span>
                            {/* base price */}
                            {product.discount > 0 && (
                                <span className="opacity-75 line-through">${product.price}</span>
                            )}
                        </p>
                        {/* sold */}
                        <p className="md:text-xl font-medium">{product.sold} <span className="font-normal">sold</span></p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;