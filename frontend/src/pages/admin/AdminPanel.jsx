import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoConstructOutline } from "react-icons/io5";
import { GoListUnordered } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export default function AdminPanel() {
    const { config, updateConfig } = useAppContext();
    const [shippingThreshold, setShippingThreshold] = useState(config?.freeShippingThreshold || 400);
    const [shippingFee, setShippingFee] = useState(config?.shippingFee || 50);

    useEffect(() => {
        if (config) {
            setShippingThreshold(config.freeShippingThreshold || 400);
            setShippingFee(config.shippingFee || 50);
        }
    }, [config]);

    const handleSaveConfig = () => {
        updateConfig({ ...config, freeShippingThreshold: Number(shippingThreshold), shippingFee: Number(shippingFee) });
    };

    return (
        <>
            <h1 className="text-4xl mb-6">Welcome to Admin Panel</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Link to="/admin/upload" className="bg-box rounded-xl flex items-center justify-center py-12 gap-1 hover:bg-box-secondary active:scale-98 transition-all flex-col">
                    <FaCloudUploadAlt className="text-4xl" />
                    <p className="text-2xl">Upload Product</p>
                </Link>
                <Link to="/admin/products" className="bg-box rounded-xl flex items-center justify-center py-12 gap-1 hover:bg-box-secondary active:scale-98 transition-all flex-col">
                    <IoConstructOutline className="text-4xl" />
                    <p className="text-2xl">Manage Products</p>
                </Link>
                <Link to="/admin/orders" className="bg-box rounded-xl flex items-center justify-center py-12 gap-1 hover:bg-box-secondary active:scale-98 transition-all flex-col">
                    <GoListUnordered className="text-4xl" />
                    <p className="text-2xl">Manage Orders</p>
                </Link>
                <Link to="/admin/users" className="bg-box rounded-xl flex items-center justify-center py-12 gap-1 hover:bg-box-secondary active:scale-98 transition-all flex-col">
                    <FaRegUser className="text-4xl" />
                    <p className="text-2xl">Manage Users</p>
                </Link>
                <Link to="/admin/cart" className="bg-box rounded-xl flex items-center justify-center py-12 gap-1 hover:bg-box-secondary active:scale-98 transition-all flex-col">
                    <FaShoppingCart className="text-4xl" />
                    <p className="text-2xl">User Carts</p>
                </Link>
            </div>

            {/* Configuration Section */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Store Configuration</h2>
                <div className="bg-box rounded-xl p-6 shadow-sm border border-box-secondary max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="shippingThreshold" className="block text-sm font-medium mb-2">Free Shipping Threshold ($)</label>
                            <input 
                                type="number" 
                                id="shippingThreshold"
                                value={shippingThreshold} 
                                onChange={(e) => setShippingThreshold(e.target.value)} 
                                className="block w-full rounded-md border-2 focus:outline-0 focus:border-primary border-box-sec px-3 py-2 text-base bg-transparent" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping.</p>
                        </div>
                        <div>
                            <label htmlFor="shippingFee" className="block text-sm font-medium mb-2">Standard Shipping Fee ($)</label>
                            <input 
                                type="number" 
                                id="shippingFee"
                                value={shippingFee} 
                                onChange={(e) => setShippingFee(e.target.value)} 
                                className="block w-full rounded-md border-2 focus:outline-0 focus:border-primary border-box-sec px-3 py-2 text-base bg-transparent" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Cost for orders below threshold.</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button onClick={handleSaveConfig}>Save Configuration</Button>
                    </div>
                </div>
            </div>
        </>
    )
}