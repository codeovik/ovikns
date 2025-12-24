import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from "@/context/AppContext";
import { FaCircleNotch } from "react-icons/fa6";
import NotFound from "@/pages/NotFound";

export default function RedirectLink() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { allProduct } = useAppContext();
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
        // Wait for products to load from context
        if (!allProduct) return;

        const numericId = Number(id);
        
        // If id is not a number, it's invalid
        if (isNaN(numericId)) {
            setIsNotFound(true);
            return;
        }

        // Find product by the short 'id' field (not the mongo _id)
        const product = allProduct.find(p => p.id === numericId);

        if (product) {
            // Redirect to the real product details page
            navigate(`/products/${product._id}`, { replace: true });
        } else {
            setIsNotFound(true);
        }
    }, [id, allProduct, navigate]);

    if (isNotFound) {
        return <NotFound />;
    }

    return (
        <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center gap-8">
            <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full border-4 border-primary/20"></div>
                <FaCircleNotch className="w-20 h-20 text-primary animate-spin" />
                <span className="absolute font-bold text-lg text-primary animate-pulse pt-1">#{id}</span>
            </div>
            <div className="text-center space-y-2 animate-pulse">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Redirecting...</h2>
                <p className="text-gray-500 dark:text-gray-400">Taking you to the product page</p>
            </div>
        </div>
    );
}