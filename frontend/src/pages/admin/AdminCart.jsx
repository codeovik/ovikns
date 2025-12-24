import React, { useEffect } from 'react';
import { useAppContext } from "@/context/AppContext";
import { FaShoppingCart } from "react-icons/fa";

export default function AdminCart() {
    const { fetchAllCarts, allCarts } = useAppContext();

    useEffect(() => {
        fetchAllCarts();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">User Carts</h1>
            <div className="grid gap-6">
                {allCarts?.map((cart) => (
                    <div key={cart._id} className="bg-box border border-box-secondary rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                            <div>
                                <h3 className="font-semibold text-lg">{cart.user?.name || "Unknown User"}</h3>
                                <p className="text-sm text-gray-500">{cart.user?.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Cart ID: {cart._id}</p>
                                <p className="font-bold text-primary">Items: {cart.items?.length || 0}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {cart.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <img 
                                        src={item.product?.images?.[0] || "https://placehold.co/50"} 
                                        alt={item.product?.title} 
                                        className="w-12 h-12 object-cover rounded bg-gray-100"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium line-clamp-1">{item.product?.title || "Product Unavailable"}</p>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity} | Color: {item.color || "N/A"} | Price: ${item.product?.finalPrice || item.product?.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(!cart.items || cart.items.length === 0) && (
                                <p className="text-gray-500 italic">Cart is empty</p>
                            )}
                        </div>
                    </div>
                ))}
                {(!allCarts || allCarts.length === 0) && (
                    <div className="text-center py-12 text-gray-500">
                        <FaShoppingCart className="mx-auto text-4xl mb-4 opacity-50" />
                        <p>No active carts found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
