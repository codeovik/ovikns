import { Link } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoConstructOutline } from "react-icons/io5";
import { GoListUnordered } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";

export default function AdminPanel() {
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
            </div>
        </>
    )
}