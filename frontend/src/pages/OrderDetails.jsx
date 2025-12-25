import React, { useEffect, useState } from 'react';
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { FaBoxOpen, FaCreditCard, FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";

export default function OrderDetails() {
    const { id } = useParams();
    const { myOrders, fetchMyOrders, stripePayment, isAuth } = useAppContext();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuth) {
            // If orders are not loaded, fetch them
            if (!myOrders || myOrders.length === 0) {
                const fetch = async () => {
                    await fetchMyOrders();
                    setLoading(false);
                };
                fetch();
            } else {
                setLoading(false);
            }
        }
    }, [isAuth, fetchMyOrders, myOrders?.length]);

    useEffect(() => {
        if (myOrders && myOrders.length > 0) {
            const found = myOrders.find(o => o._id === id);
            if (found) setOrder(found);
        }
    }, [myOrders, id]);

    if (!isAuth) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Please sign in to view order details</h2>
                <Link to="/signin"><Button>Sign In</Button></Link>
            </div>
        )
    }

    if (loading && !order) {
        return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
    }

    if (!order) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-500">
                <FaBoxOpen size={64} />
                <h2 className="text-2xl font-bold">Order not found</h2>
                <Link to="/orders"><Button>Back to Orders</Button></Link>
            </div>
        )
    }

    return (
        <>
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm">
                    <li className="inline-flex items-center">
                        <Link to="/" className="inline-flex items-center font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <IoIosArrowForward />
                            <Link to="/orders" className="ms-1 md:ms-2 font-light opacity-80 hover:opacity-100 transition-all relative after:absolute after:w-full after:h-px after:bg-black dark:after:bg-white w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">
                                Orders
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <IoIosArrowForward />
                            <span className="ms-1 md:ms-2">
                                #{order._id}
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className="flex flex-col md:flex-row gap-6 mt-6 justify-between items-start mb-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Order Details</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr_2fr] gap-8">
                {/* Left Column - Items */}
                <div className="space-y-6">
                    <div className="bg-box border border-box-secondary rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <div className="space-y-6">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <img
                                        src={item.product?.images?.[0] || "https://placehold.co/50"}
                                        alt={item.product?.title}
                                        className="w-20 h-20 object-cover rounded-lg bg-gray-100 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/products/${item.product?._id}`} className="font-medium hover:text-primary transition-colors block mb-1">
                                            {item.product?.title || "Product Unavailable"}
                                        </Link>
                                        <div className="text-sm text-gray-500 space-y-1">
                                            <p>Price: ${item.price}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            {item.color && <p>Color: <span className="capitalize">{item.color}</span></p>}
                                        </div>
                                    </div>
                                    <div className="text-right font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Address Column */}
                <div className="space-y-6">
                    <div className="bg-box border-2 border-box-secondary rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        <div className="space-y-3 text-sm">
                            <p><span className="font-medium text-gray-500">Street:</span> {order.shippingAddress?.street}</p>
                            <p><span className="font-medium text-gray-500">Apartment:</span> {order.shippingAddress?.appartment}</p>
                            <p><span className="font-medium text-gray-500">City:</span> {order.shippingAddress?.city}</p>
                            <p><span className="font-medium text-gray-500">State:</span> {order.shippingAddress?.state}</p>
                            <p><span className="font-medium text-gray-500">Zip Code:</span> {order.shippingAddress?.zip}</p>
                            <p><span className="font-medium text-gray-500">Country:</span> {order.shippingAddress?.country}</p>
                            <p><span className="font-medium text-gray-500">Phone:</span> {order.shippingAddress?.phone}</p>

                            {order.shippingAddress?.deliveryInstructions && (
                                <div className="">
                                    <p className="font-medium text-gray-500 mb-2">Delivery Instructions:</p>
                                    <p className="p-3 bg-box-secondary rounded-xl leading-relaxed border-2 border-box-tertiary">
                                        {order.shippingAddress?.deliveryInstructions}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-6">
                    <div className="bg-box border border-box-secondary rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500">Date Placed</span>
                                <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500">Status</span>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${order.orderStatus === "Processing" ? 'bg-orange-100 text-orange-700' :
                                    order.orderStatus === "Shipped" ? 'bg-green-100 text-green-700' :
                                        order.orderStatus === "Delivered" ? 'bg-blue-100 text-blue-700' :
                                            order.orderStatus === "Cancelled" ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                    }`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500">Payment Status</span>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-gray-500">Payment Method</span>
                                <span className="font-medium capitalize">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between pt-4 text-base">
                                <span>Total product amount</span>
                                <span>${order.totalAmount?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-4 text-base">
                                <span>Shipping fee</span>
                                <span>${order.shippingFee?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-4 text-base font-bold">
                                <span>Total</span>
                                <span className="text-primary">${(order.totalAmount + order.shippingFee).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}