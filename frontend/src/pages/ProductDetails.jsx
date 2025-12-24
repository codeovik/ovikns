import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus, FaCartShopping, FaCheck, FaCircleNotch } from "react-icons/fa6";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import { Link } from 'react-router-dom';
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";

export default function ProductDetails() {
    const { id } = useParams();
    const { allProduct, addToCart, isAuth, config } = useAppContext();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (allProduct) {
            const foundProduct = allProduct.find(p => p._id === id);
            if (foundProduct) {
                setProduct(foundProduct);
                setMainImage(foundProduct.images[0]);
                if (foundProduct.color?.length > 0) {
                    setSelectedColor(foundProduct.color[0]);
                }
            }
        }
    }, [id, allProduct]);

    if (!product) {
        return <div className="min-h-[60vh] flex items-center justify-center text-lg">Loading product details...</div>;
    }

    // Calculate discount percentage if not explicitly provided
    const discountPercent = product.discount ||
        (product.price && product.finalPrice ? Math.round(((product.price - product.finalPrice) / product.price) * 100) : 0);

    const handleAddToCart = async () => {
        if (!product.inStock || isAdding) return;

        if (!isAuth) {
            toast.error("Please sign in to add items to your cart.");
            return;
        }

        if (product.color && product.color.length > 0 && !selectedColor) {
            toast.error("Please select a color.");
            return;
        }

        setIsAdding(true);
        await addToCart(product._id, quantity, selectedColor);
        setIsAdding(false);
    };

    // Filter related products by category, excluding current product
    const relatedProducts = allProduct
        .filter(p => p.category === product.category && p._id !== product._id)
        .slice(0, 4);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                {/* left side */}
                <div className="flex flex-col gap-4">
                    {/* breadcamp */}
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li className="inline-flex items-center">
                                <Link to="/" className="inline-flex items-center font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <IoIosArrowForward />
                                    <Link to="/category" className="ms-1 md:ms-2 font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">
                                        Category
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <IoIosArrowForward />
                                    <Link to={`/products?category=${product.category}`} className="ms-1 md:ms-2 font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">
                                        {product.category}
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <IoIosArrowForward />
                                    <span className="ms-1 md:ms-2">
                                        {product.title}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* product image */}
                    <div className="aspect-square w-full bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden group border border-gray-200 dark:border-gray-800">
                        <img
                            src={mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    {/* product image thumbnails */}
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMainImage(img)}
                                className={`relative shrink-0 w-20 cursor-pointer h-20 rounded-lg transition-all border-2 ${mainImage === img
                                    ? 'border-black dark:border-white p-1'
                                    : 'hover:opacity-80'
                                    }`}
                            >
                                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover rounded-md" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* righ side */}
                <div className="flex flex-col lg:sticky lg:top-24 h-fit min-w-0">
                    <div>
                        {/* title */}
                        <h1 className="text-3xl md:text-[42px] font-medium text-gray-900 dark:text-white leading-tight">
                            {product.title}
                        </h1>
                        {/* price */}
                        <div className="flex items-center gap-4 mt-1">
                            <p className="text-[42px] font-medium">
                                ${(product.finalPrice).toFixed(2)}
                            </p>
                            <p className="text-2xl text-gray-400 line-through">
                                ${product.price.toFixed(2)}
                            </p>
                            {discountPercent > 0 && (
                                <span className="text-base bg-red-500 text-white px-3 py-0.5 rounded-full">
                                    {discountPercent}% OFF
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description (Quill HTML) */}
                    <div className="pb-6 mb-6 border-b">
                        <h3 className="text-2xl font-medium">Description:</h3>
                        <div className='opacity-80' dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }} />
                    </div>

                    {/* Options Selection */}
                    <div className="space-y-6 mb-8">
                        {/* Colors */}
                        {product.color && product.color.length > 0 && (
                            <div>
                                <label className="text-2xl font-medium">
                                    <span className="opacity-80">Color: </span><span className="capitalize">{selectedColor}</span>
                                </label>
                                <div className="flex flex-wrap gap-3 mt-1">
                                    {product.color.map((col) => (
                                        <div
                                            key={col} onClick={() => setSelectedColor(col)}
                                            className={`relative shrink-0 aspect-square cursor-pointer h-12 rounded-lg transition-all border-2 ${selectedColor === col
                                                ? 'border-black dark:border-white p-1'
                                                : 'hover:opacity-80'
                                                }`}
                                        >
                                            <button
                                                className='w-full h-full rounded-sm flex cursor-pointer justify-center items-center'
                                                style={{ backgroundColor: col }}
                                                title={col}
                                            ></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center border border-box-secondary rounded-sm w-max">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-4 h-full hover:bg-box-secondary rounded-sm transition-all active:scale-90 duration-10 cursor-pointer"
                                    disabled={!product.inStock}
                                >
                                    <FaMinus className="text-xs" />
                                </button>
                                <span className="w-12 text-center font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-4 h-full hover:bg-box-secondary rounded-sm transition-all active:scale-90 duration-10 cursor-pointer"
                                    disabled={!product.inStock}
                                >
                                    <FaPlus className="text-xs" />
                                </button>
                            </div>

                            <Button
                                size="lg"
                                className="flex-1 h-auto py-3 text-lg gap-2 shadow-lg shadow-primary/20"
                                onClick={handleAddToCart}
                                disabled={!product.inStock || isAdding}
                            >
                                {isAdding ? (
                                    <>
                                        <FaCircleNotch className="animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaCartShopping />
                                        <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                                    </>
                                )}
                            </Button>
                            {/* share product */}
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-auto py-3 text-lg gap-2"
                                onClick={() => toast.info("Feature coming soon!")}
                            >
                                <IoShareSocialOutline />
                            </Button>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-1">
                        <p><span className="opacity-80">Sold:</span> <span className="">{product.sold}</span></p>
                        <p><span className="opacity-80">Product ID:</span> <span className="">{product._id.toUpperCase()}</span></p>
                        <p><span className="opacity-80">In stock:</span> { product.inStock ? <span className="text-green-400">Abailable</span> : <span className="text-red-400">Unabailable</span> }</p>
                    </div>

                    {/* payment gateway, delivery and more information */}
                    <div className="bg-box rounded-sm border-2 mt-6 p-6 border-box-secondary">
                        <h4 className="text-2xl font-medium mb-2">Secure Checkout With:</h4>
                        <div className="flex gap-4 mt-2">
                            <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/visa.png" alt="Visa" className="h-12 bg-white py-2 px-4 rounded-sm" />
                            <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/mastercard.png" alt="Mastercard" className="h-12 bg-white py-2 px-4 rounded-sm" />
                            <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/paypal.png" alt="Paypal" className="h-12 bg-white py-2 px-4 rounded-sm" />
                            <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/payoneer.png" alt="payoneer" className="h-12 bg-white py-2 px-4 rounded-sm" />
                        </div>
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center gap-2">
                                <FaCheck className="text-green-500 text-sm" />
                                <p>Free shipping on orders over ${config?.freeShippingThreshold || 400}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheck className="text-green-500 text-sm" />
                                <p>90 days return policy</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheck className="text-green-500 text-sm" />
                                <p>2-year warranty</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-10">
                    <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}