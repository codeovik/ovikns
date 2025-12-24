import React, { useMemo } from 'react';
import { useAppContext } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

export default function AllCategories() {
    const { allProduct } = useAppContext();

    const categories = useMemo(() => {
        if (!allProduct) return [];

        const categoryGroups = {};

        // Group products by category
        allProduct.forEach(product => {
            if (!product.category) return;
            if (!categoryGroups[product.category]) {
                categoryGroups[product.category] = [];
            }
            categoryGroups[product.category].push(product);
        });

        // Create category objects with popular product image
        return Object.keys(categoryGroups).map(catName => {
            const products = categoryGroups[catName];
            // Sort by sold count (descending) to find most popular
            const popularProduct = products.sort((a, b) => (b.sold || 0) - (a.sold || 0))[0];

            return {
                name: catName,
                image: popularProduct?.images?.[0] || "",
                count: products.length
            };
        });
    }, [allProduct]);

    if (!allProduct) {
        return (
            <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
                <div className="animate-pulse text-xl font-medium">Loading Categories...</div>
            </div>
        );
    }

    return (
        <>
            {/* Banner Section */}
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10 flex flex-col items-center justify-center text-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://metro-theme-demo.myshopify.com/cdn/shop/files/pro_18a_f2c14737-21ab-47ba-9a48-284432464396.jpg')" }}
                />
                <div className="absolute inset-0 dark:bg-black/80 bg-white/70" />

                <div className="relative z-10 space-y-3 px-4 animate-in fade-in zoom-in duration-700">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight">Browse Beyond Boundaries</h1>
                    <p className="text-sm sm:text-lg md:text-xl max-w-2xl mx-auto font-light">Dive into a universe of handpicked categories, where quality meets innovation in every click.</p>

                    <nav className="flex items-center justify-center gap-2 text-sm md:text-base font-medium pt-2">
                        <Link to="/" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">Home</Link>
                        <IoIosArrowForward />
                        <span className="">Categories</span>
                    </nav>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Categories</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Explore our wide range of collections</p>
                </div>
                <div className="bg-box border border-box-secondary px-4 py-2 rounded-full text-sm font-medium">
                    Total: {categories.length} Categories
                </div>
            </div>

            {categories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <Link
                            to={`/products?category=${cat.name}`}
                            key={cat.name}
                            className="group relative block aspect-4/5 sm:aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                            <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-bold capitalize mb-1">{cat.name}</h3>
                                <p className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                    {cat.count} Products
                                    <span className="inline-block h-px w-4 bg-white/50 group-hover:w-8 transition-all duration-300"></span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="text-6xl mb-4">📂</div>
                    <h3 className="text-xl font-semibold">No Categories Found</h3>
                    <p className="text-gray-500 mt-2">Check back later for new collections.</p>
                </div>
            )}
        </>
    );
}