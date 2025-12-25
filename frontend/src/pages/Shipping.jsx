import React, { useState } from 'react';
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaCircleNotch } from "react-icons/fa6";
import { toast } from "sonner";
import { IoBagCheckOutline } from "react-icons/io5";

export default function Shipping() {
    const { placeOrder, stripePayment, cartSummary, config, cart } = useAppContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        phone: "",
        appartment: "",
        deliveryInstructions: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!formData.street || !formData.city || !formData.state || !formData.zip || !formData.country || !formData.phone || !formData.appartment) {
            toast.error("Please fill in all required fields");
            setLoading(false);
            return;
        }

        const orderData = {
            shippingAddress: formData
        };

        const { success, orderId } = await placeOrder(orderData);

        if (success) {
            await stripePayment(orderId);
        } else {
            setLoading(false);
        }
    };

    const subtotal = cartSummary?.totalPrice || 0;
    const shipping = subtotal > (config?.freeShippingThreshold || 400) ? 0 : config.shippingFee;
    const total = subtotal + shipping;

    return (
        <>
            <h1 className="text-3xl font-bold mb-8">Shipping Details</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping Form */}
                <div className="lg:col-span-2">
                    <form id="shipping-form" onSubmit={handleSubmit} className="bg-box border border-box-secondary rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Street Address</label>
                                <input name="street" value={formData.street} onChange={handleChange} className="w-full rounded-md border-2 border-box-tertiary bg-transparent px-3 py-3 text-sm focus:border-primary focus:outline-none" placeholder="123 Main St" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Apartment / Suite</label>
                                <input name="appartment" value={formData.appartment} onChange={handleChange} className="w-full rounded-md border-2 border-box-tertiary bg-transparent px-3 py-3 text-sm focus:border-primary focus:outline-none" placeholder="Apt 4B" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City</label>
                                <input name="city" value={formData.city} onChange={handleChange} className="w-full rounded-md border-2 border-box-tertiary bg-transparent px-3 py-3 text-sm focus:border-primary focus:outline-none" placeholder="New York" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">State / Province</label>
                                <input name="state" value={formData.state} onChange={handleChange} className="w-full rounded-md border-2 border-box-tertiary bg-transparent px-3 py-3 text-sm focus:border-primary focus:outline-none" placeholder="NY" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ZIP / Postal Code</label>
                                <input name="zip" value={formData.zip} onChange={handleChange} className="w-full rounded-md border-2 border-box-tertiary bg-transparent px-3 py-3 text-sm focus:border-primary focus:outline-none" placeholder="10001" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Country</label>
                                <input name="country" value={formData.country} onChange={handleChange} className="w-full rounded-md border-2 border-box-tertiary bg-transparent px-3 py-3 text-sm focus:border-primary focus:outline-none" placeholder="USA" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-md border-2 border-box-tertiary bg-transparent px-3 py-3 text-sm focus:border-primary focus:outline-none" placeholder="+1 (555) 000-0000" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Delivery Instructions (Optional)</label>
                            <textarea name="deliveryInstructions" value={formData.deliveryInstructions} onChange={handleChange} className="w-full rounded-md border-2 border-box-tertiary bg-transparent px-3 py-3 text-sm focus:border-primary focus:outline-none min-h-[100px]" placeholder="Gate code, leave at door, etc." />
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-box rounded-xl shadow-sm border border-box-secondary p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        
                        {/* Cart Items Preview */}
                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700 pb-4">
                            {cart?.items?.map((item) => (
                                <div key={item._id} className="flex gap-3">
                                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                                        <img src={item.product?.images?.[0]} alt={item.product?.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <p className="font-medium line-clamp-1">{item.product?.title}</p>
                                        <p className="text-gray-500">Qty: {item.quantity} × ${item.product?.finalPrice || item.product?.price}</p>
                                    </div>
                                    <div className="text-sm font-medium">
                                        ${((item.product?.finalPrice || item.product?.price) * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className='opacity-75'>Subtotal</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className='opacity-75'>Shipping</span>
                                <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            form="shipping-form"
                            disabled={loading}
                            className="w-full py-6 text-lg"
                        >
                            {loading ? (
                                <><FaCircleNotch className="animate-spin mr-2" /> Processing...</>
                            ) : (
                                <><IoBagCheckOutline className="mr-2" /> Place Order & Pay</>
                            )}
                        </Button>
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">Secure Checkout - SSL Encrypted</p>
                            <div className="flex justify-center gap-5 mt-2">
                                <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/visa.png" alt="Visa" className="h-6" />
                                <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/mastercard.png" alt="Mastercard" className="h-6" />
                                <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/paypal.png" alt="Paypal" className="h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}