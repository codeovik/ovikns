import React, { useEffect, useState } from 'react';
import { useAppContext } from "@/context/AppContext";
import { FaBoxOpen, FaEye, FaCopy } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ManageOrders() {
  const { fetchAllOrders, adminOrders, updateOrderStatus } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const orders = Array.isArray(adminOrders) ? adminOrders : [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      <div className="overflow-x-auto bg-box border border-box-secondary rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Payment</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 font-mono text-sm">#{order._id.toUpperCase()}</td>
                <td className="p-4">
                  <p className="font-medium">{order.user?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="p-4 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()} ({new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </td>
                <td className="p-4 font-medium">${order.totalAmount?.toFixed(2) || "0.00"}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium capitalize
                    ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <Select
                    value={order.orderStatus}
                    onValueChange={(value) => updateOrderStatus(order._id, value)}
                  >
                    <SelectTrigger className="w-35">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <FaEye /> View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Order Details #{order._id?.slice(-6).toUpperCase()}</DialogTitle>
                        <DialogDescription>
                          Placed on {new Date(order.createdAt).toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm text-gray-500 mb-2">Shipping Address</h4>
                          <div className="text-lg space-y-1">
                            {[
                              { label: "Street", value: order.shippingAddress?.street },
                              { label: "Apt/Suite", value: order.shippingAddress?.appartment },
                              { label: "City", value: order.shippingAddress?.city },
                              { label: "State", value: order.shippingAddress?.state },
                              { label: "Zip", value: order.shippingAddress?.zip },
                              { label: "Country", value: order.shippingAddress?.country },
                              { label: "Phone", value: order.shippingAddress?.phone },
                            ].map((field, i) => (
                              <div key={i} className="flex items-center gap-2 group">
                                <p><span className="font-medium text-gray-500">{field.label}:</span> {field.value}</p>
                                <FaCopy className="cursor-pointer text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={12} onClick={() => { navigator.clipboard.writeText(field.value || ""); toast.success(`Copied ${field.label}`); }} />
                              </div>
                            ))}
                          </div>
                          <Button variant="outline" size="sm" className="mt-3 h-8 text-xs gap-2" onClick={() => {
                            const addr = order.shippingAddress;
                            const text = `Street: ${addr?.street}\nApt: ${addr?.appartment}\nCity: ${addr?.city}\nState: ${addr?.state}\nZip: ${addr?.zip}\nCountry: ${addr?.country}\nPhone: ${addr?.phone}`;
                            navigator.clipboard.writeText(text);
                            toast.success("Address copied to clipboard");
                          }}>
                            <FaCopy /> Copy Full Address
                          </Button>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm text-gray-500">Customer Info</h4>
                          <p className="font-medium">{order.user?.name}</p>
                          <p className="text-sm">{order.user?.email}</p>
                          
                          <h4 className="font-semibold text-sm text-gray-500 mt-4">Payment</h4>
                          <p className="capitalize">{order.paymentMethod} - <span className={order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}>{order.paymentStatus}</span></p>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                        <h4 className="font-semibold text-sm text-gray-500 mb-3">Order Items</h4>
                        <div className="space-y-3 max-h-50 overflow-y-auto pr-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                              <img src={item.product?.images?.[0]} alt={item.product?.title} className="w-10 h-10 rounded object-cover bg-gray-100" />
                              <div className="flex-1">
                                <p className="font-medium line-clamp-1">{item.product?.title}</p>
                                <p className="text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                              </div>
                              <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 font-bold">
                          <span>Total Amount</span>
                          <span className="text-lg text-primary">${order.totalAmount?.toFixed(2)}</span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!adminOrders || !Array.isArray(adminOrders) || adminOrders.length === 0) && (
          <div className="p-12 text-center text-gray-500">
            <FaBoxOpen className="mx-auto text-4xl mb-4 opacity-50" />
            <p>No orders found.</p>
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex gap-2 mt-8 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-sm flex items-center justify-center transition-all cursor-pointer border-2 ${currentPage === num ? 'bg-box border-primary' : 'hover:border-primary/50 border-box-tertiary bg-box text-white'}`}>{num}</button>
          ))}
      </div>
    </>
  );
}