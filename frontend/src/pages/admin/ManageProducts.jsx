import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HiDotsHorizontal } from "react-icons/hi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ManageProducts() {

  const { allProduct, deleteProduct } = useAppContext();

  const products = allProduct || [];

  const navigate = useNavigate();

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="">
      <h2 className="text-center text-3xl mb-6 font-bold">Manage All Products</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-box">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-box-secondary">
            <tr>
              <th scope="col" className="px-6 py-3">Image</th>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Discount</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Colors</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3">Sold</th>
              <th scope="col" className="px-6 py-3">Created At</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-box-secondary hover:bg-box-secondary transition-colors">
                <td className="px-6 py-4">
                  {product.images?.length > 0 && (
                    <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-cover rounded" />
                  )}
                </td>
                <td className="px-6 py-4">#{product.id}</td>
                <td className="px-6 py-4 font-medium whitespace-nowrap">{product.title}</td>
                <td className="px-6 py-4">
                  <div className="font-bold">${product.finalPrice}</div>
                  {product.price > product.finalPrice && (
                    <div className="text-xs line-through opacity-60">${product.price}</div>
                  )}
                </td>
                <td className="px-6 py-4">{product.discount}%</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {product.color?.map((c, i) => (
                      <span key={i} className="text-xs bg-box-secondary px-1 rounded">{c}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {product.inStock ? <span className="text-green-500">Abailable</span> : <span className="text-red-500">Not Abailable</span>}
                </td>
                <td className="px-6 py-4">{product.sold}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>{new Date(product.createdAt).toLocaleDateString()}</div>
                  <div className="text-xs opacity-70">{timeAgo(product.createdAt)}</div>
                </td>
                {/* 3 dot menu */}
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <HiDotsHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => navigate(`/admin/product/edit/${product._id}`) } >
                          <FaRegEdit /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteProduct(product._id)}>
                          <MdOutlineDeleteForever /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
