import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { FaCircleNotch } from "react-icons/fa6";

export default function PaymentSuccess() {
    const { clearCart } = useAppContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Get parameters from URL or use defaults
    const next = searchParams.get("next") || "/orders";
    const time = parseInt(searchParams.get("time")) || 10;
    
    const [timeLeft, setTimeLeft] = useState(time);
    const hasClearedCart = useRef(false);

    useEffect(() => {
        // Clear cart immediately upon successful payment return
        if (!hasClearedCart.current) {
            clearCart();
            hasClearedCart.current = true;
        }
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(next);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, next]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <FaCircleNotch className="text-6xl text-primary animate-spin" />
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-gray-500">Redirecting to orders in {timeLeft} seconds...</p>
        </div>
    );
}
