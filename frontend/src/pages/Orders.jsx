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
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">My Orders</h1>
            <div className="space-y-6">
                {myOrders.map(order => (
                    <div key={order._id} className="bg-box border border-box-secondary rounded-xl p-4 md:p-6 shadow-sm">
                        {/* Header */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:justify-between lg:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-mono font-medium text-sm break-all">#{order._id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium text-sm md:text-base">{new Date(order.createdAt).toLocaleDateString()} <span className="text-gray-400 text-xs md:text-sm">({new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span></p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-bold text-primary">${(order.totalAmount + order.shippingFee).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment Method</p>
                                <p className="font-bold text-sm md:text-base">{order.paymentMethod}</p>
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
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="flex gap-x-12 gap-y-6 flex-wrap">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-start sm:items-center gap-4">
                                    <img
                                        src={item.product?.images?.[0] || "https://placehold.co/50"}
                                        alt={item.product?.title || "Product"}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md bg-gray-100 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/products/${item.product?._id}`} className="hover:text-primary transition-colors block">
                                            <h4 className="font-medium text-sm sm:text-base truncate">{item.product?.title || "Product Unavailable"}</h4>
                                        </Link>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                                            {item.color && <p className="text-sm text-gray-400">Color: <span className="capitalize">{item.color}</span></p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-4">
                            {/* {order.paymentStatus === 'Pending' && (
                                <Button onClick={() => stripePayment(order._id)} className="gap-2">
                                    <FaCreditCard /> Pay Now
                                </Button>
                            )} */}
                            <Link to={`/orders/${order._id}`}>
                                <Button variant="outline">View Details</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
