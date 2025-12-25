import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FaChevronDown, FaCheck, FaMagnifyingGlass } from "react-icons/fa6";
import { useSearchParams, Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

export default function AllProduct() {
    const { allProduct } = useAppContext();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const itemsPerPage = 30;

    // Filter States - Initialize from URL
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
    const [availability, setAvailability] = useState(searchParams.get("stock") ? searchParams.get("stock").split(",") : []);
    const [priceRange, setPriceRange] = useState([searchParams.get("price") ? Number(searchParams.get("price")) : 1000]);
    const [selectedColor, setSelectedColor] = useState(searchParams.get("color") ? searchParams.get("color").split(",") : []);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ? searchParams.get("category").split(",") : []);
    const [sortOption, setSortOption] = useState(searchParams.get("sort") || "");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (allProduct) {
            setProducts(allProduct);
            setFilteredProducts(allProduct);
        }
    }, [allProduct]);

    // Sync State to URL
    useEffect(() => {
        const params = {};
        if (searchQuery) params.query = searchQuery;
        if (availability.length > 0) params.stock = availability.join(",");
        if (priceRange[0] < 1000) params.price = priceRange[0];
        if (selectedColor.length > 0) params.color = selectedColor.join(",");
        if (selectedCategory.length > 0) params.category = selectedCategory.join(",");
        if (sortOption) params.sort = sortOption;

        setSearchParams(params, { replace: true });
    }, [searchQuery, availability, priceRange, selectedColor, selectedCategory, sortOption, setSearchParams]);

    useEffect(() => {
        if (!products) return;
        let result = [...products];

        // Apply Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.title.toLowerCase().includes(query) || 
                (p.category && p.category.toLowerCase().includes(query))
            );
        }

        // Apply Filters
        if (availability.length > 0) {
            const showInStock = availability.includes('instock');
            const showOutStock = availability.includes('outstock');
            if (showInStock && !showOutStock) result = result.filter(p => p.inStock);
            if (!showInStock && showOutStock) result = result.filter(p => !p.inStock);
        }
        result = result.filter(p => (p.finalPrice || p.price) <= priceRange[0]);
        if (selectedColor.length > 0) {
            result = result.filter(p => p.color && p.color.some(c => selectedColor.includes(c)));
        }
        if (selectedCategory.length > 0) {
            result = result.filter(p => selectedCategory.includes(p.category));
        }

        // Apply Sorting
        if (sortOption === "alpha_asc") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOption === "alpha_desc") {
            result.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortOption === "sold_desc") {
            result.sort((a, b) => b.sold - a.sold);
        } else if (sortOption === "sold_asc") {
            result.sort((a, b) => a.sold - b.sold);
        } else if (sortOption === "price_desc") {
            result.sort((a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price));
        } else if (sortOption === "price_asc") {
            result.sort((a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price));
        } else if (sortOption === "date_desc") {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortOption === "date_asc") {
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [products, searchQuery, availability, priceRange, selectedColor, selectedCategory, sortOption]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleCheckboxChange = (value, state, setState) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    // Get unique colors and categories from products for dynamic filters
    const uniqueColors = [...new Set(products.flatMap(p => p.color || []))];
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

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
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight">Curated Collection</h1>
                    <p className="text-sm sm:text-lg md:text-xl max-w-2xl mx-auto font-light">Discover the latest trends and timeless essentials designed for you.</p>
                    
                    <nav className="flex items-center justify-center gap-2 text-sm md:text-base font-medium pt-2">
                        <Link to="/" className="font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">Home</Link>
                        <IoIosArrowForward />
                        <span className="">Products</span>
                    </nav>
                </div>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[250px_1fr] gap-6 mt-8">
                {/* Mobile Filter Toggle */}
                <div className="md:hidden">
                    <Button variant="outline" className="w-full flex justify-between items-center" onClick={() => setShowFilters(!showFilters)}>
                        Filters <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </Button>
                </div>

                {/* Sidebar Filters */}
                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden'} md:block`}>
                    <div>
                        <h3 className="font-semibold mb-2">Availability</h3>
                        <div className="flex flex-col gap-2">
                            {['instock', 'outstock'].map(opt => (
                                <div key={opt} className="flex items-center gap-2 capitalize cursor-pointer">
                                    <Checkbox id={opt} checked={availability.includes(opt)} onCheckedChange={() => handleCheckboxChange(opt, availability, setAvailability)} />
                                    <label htmlFor={opt} className="cursor-pointer">{opt === 'instock' ? 'In Stock' : 'Out of Stock'}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Price Range: 0 - ${priceRange[0]}</h3>
                        <Slider defaultValue={[1000]} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Color</h3>
                        <div className="flex flex-col gap-2">
                            {uniqueColors.map(col => (
                                <div key={col} className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox id={col} checked={selectedColor.includes(col)} onCheckedChange={() => handleCheckboxChange(col, selectedColor, setSelectedColor)} />
                                    <label htmlFor={col} className="cursor-pointer">{col}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Category</h3>
                        <div className="flex flex-col gap-2">
                            {uniqueCategories.map(cat => (
                                <div key={cat} className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox id={cat} checked={selectedCategory.includes(cat)} onCheckedChange={() => handleCheckboxChange(cat, selectedCategory, setSelectedCategory)} />
                                    <label htmlFor={cat} className="cursor-pointer">{cat}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Grid & Pagination */}
                <div className="min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        {/* Search */}
                        <div className="relative w-full sm:max-w-xs">
                            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-box-secondary rounded-md focus:outline-none focus:border-primary bg-box border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    Sort By <FaChevronDown className="text-xs" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={() => setSortOption("alpha_asc")}>
                                    Alphabetical: A-Z {sortOption === "alpha_asc" && <FaCheck className="ml-auto" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption("alpha_desc")}>
                                    Alphabetical: Z-A {sortOption === "alpha_desc" && <FaCheck className="ml-auto" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption("sold_desc")}>
                                    Sold: High to Low {sortOption === "sold_desc" && <FaCheck className="ml-auto" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption("sold_asc")}>
                                    Sold: Low to High {sortOption === "sold_asc" && <FaCheck className="ml-auto" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption("price_desc")}>
                                    Price: High to Low {sortOption === "price_desc" && <FaCheck className="ml-auto" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption("price_asc")}>
                                    Price: Low to High {sortOption === "price_asc" && <FaCheck className="ml-auto" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption("date_desc")}>
                                    Uploaded: Newest {sortOption === "date_desc" && <FaCheck className="ml-auto" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOption("date_asc")}>
                                    Uploaded: Oldest {sortOption === "date_asc" && <FaCheck className="ml-auto" />}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {/* all products */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentItems.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex gap-2 mt-8 justify-center">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-sm flex items-center justify-center transition-all cursor-pointer border-2 ${currentPage === num ? 'bg-box border-primary' : 'hover:border-primary/50 border-box-tertiary bg-box text-white'}`}>{num}</button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}