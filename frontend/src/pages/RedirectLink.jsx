import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { IoHomeOutline } from "react-icons/io5";
import { FaCircleNotch } from "react-icons/fa6";

export default function RedirectLink() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { allProduct } = useAppContext();
    const [status, setStatus] = useState("loading"); // 'loading' | 'found' | 'not-found'

    useEffect(() => {
        // Wait for products to load from context
        if (!allProduct) return;

        const numericId = Number(id);
        
        // If id is not a number, it's invalid
        if (isNaN(numericId)) {
            setStatus("not-found");
            return;
        }

        // Find product by the short 'id' field (not the mongo _id)
        const product = allProduct.find(p => p.id === numericId);

        if (product) {
            setStatus("found");
            // Redirect to the real product details page
            navigate(`/product/${product._id}`, { replace: true });
        } else {
            setStatus("not-found");
        }
    }, [id, allProduct, navigate]);

    if (status === "not-found") {
        return (
            <div className="min-h-[calc(100vh-72px)] flex flex-col gap-6 items-center justify-center text-center p-6">
                <div className="space-y-2">
                    <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-800">404</h1>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Quick Link Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        We couldn't find a product associated with the quick link <span className="font-mono font-bold text-primary">#{id}</span>.
                    </p>
                </div>
                <Button onClick={() => navigate('/')} size="lg" className="gap-2">
                    <IoHomeOutline /> Go to Homepage
                </Button>
            </div>
        );
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