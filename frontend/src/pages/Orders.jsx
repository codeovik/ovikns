import React, { useEffect } from 'react';
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaCreditCard } from "react-icons/fa6";

export default function Orders() {
    const { myOrders, fetchMyOrders, stripePayment, isAuth } = useAppContext();

    useEffect(() => {
        if (isAuth) {
            fetchMyOrders();
        }
    }, [isAuth]);

    if (!isAuth) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Please sign in to view your orders</h2>
                <Link to="/signin"><Button>Sign In</Button></Link>
            </div>
        )
    }

    if (!myOrders || !Array.isArray(myOrders) || myOrders.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-500">
                <FaBoxOpen size={64} />
                <h2 className="text-2xl font-bold">No orders found</h2>
                <p>Looks like you haven't placed any orders yet.</p>
                <Link to="/products"><Button>Start Shopping</Button></Link>
            </div>
        )
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            <div className="space-y-6">
                {myOrders.map(order => (
                    <div key={order._id} className="bg-box border border-box-secondary rounded-xl p-6 shadow-sm">
                        {/* Header */}
                        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-mono font-medium text-sm">{order._id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()} ({new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-bold text-primary">${order.totalAmount?.toFixed(2) || "0.00"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment methood</p>
                                <p className="font-bold">{order.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${order.orderStatus === "Processing" ? 'bg-orange-100 text-orange-700' :
                                    order.orderStatus === "Shipped" ? 'bg-green-100 text-green-700' :
                                        order.orderStatus === "Delivered" ? 'bg-blue-100 text-blue-700' :
                                            order.orderStatus === "Cancelled" ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                    }`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-4">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <img
                                        src={item.product?.images?.[0] || "https://placehold.co/50"}
                                        alt={item.product?.title || "Product"}
                                        className="w-16 h-16 object-cover rounded-md bg-gray-100"
                                    />
                                    <div className="flex-1">
                                        <Link to={`/products/${item.product?._id}`} className="hover:text-primary transition-colors">
                                            <h4 className="font-medium line-clamp-1">{item.product?.title || "Product Unavailable"}</h4>
                                        </Link>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                                        {item.color && <p className="text-xs text-gray-400">Color: {item.color}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-4">
                            {order.paymentStatus === 'pending' && order.orderStatus !== 'Cancelled' && (
                                <Button onClick={() => stripePayment(order._id)} className="gap-2">
                                    <FaCreditCard /> Pay Now
                                </Button>
                            )}
                            {/* Add View Details button if needed, but simple list is fine for now */}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
