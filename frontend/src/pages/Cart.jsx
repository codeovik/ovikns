import React from 'react';
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaArrowRight } from "react-icons/fa6";
import { IoBagHandleOutline } from "react-icons/io5";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { IoBagCheckOutline } from "react-icons/io5";

export default function Cart() {
  const { cart, cartSummary, updateCartItem, removeCartItem, clearCart, config, isAuth } = useAppContext();
  const navigate = useNavigate();

  const subtotal = cartSummary?.totalPrice || 0;

  const shipping = subtotal > (config?.freeShippingThreshold || 400) ? 0 : config.shippingFee;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!isAuth) {
      navigate("/signin");
      return;
    }
    navigate("/shipping");
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
          <IoBagHandleOutline size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Cart is Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/products">
          <Button size="lg" className="gap-2">
            Start Shopping <FaArrowRight />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row gap-6 p-4 bg-box rounded-xl shadow-sm border-2 border-box-secondary">
              {/* Image */}
              <div className="shrink-0">
                <img
                  src={item.product?.images?.[0] || "https://placehold.co/100"}
                  alt={item.product?.title}
                  className="w-full sm:w-32 h-32 object-cover rounded-xl bg-gray-100"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link to={`/products/${item.product?._id}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-1">
                      {item.product?.title}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Color: <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{item.color || "N/A"}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Price: <span className="font-medium text-gray-700 dark:text-gray-300">${(item.product?.finalPrice || item.product?.price || 0).toFixed(2)}</span>
                    </p>
                  </div>
                  <Button onClick={() => removeCartItem(item._id)} variant='outline'>
                    <FaTrash />
                  </Button>
                </div>

                <div className="flex justify-between items-end mt-4">
                  {/* Quantity Control */}
                  <div className="flex items-center border-2 py-1 border-box-tertiary rounded-xl">
                    <button onClick={() => updateCartItem(item.product._id, item.quantity - 1, item.color)} className="px-3 py-1 cursor-pointer rounded-l-lg transition-colors disabled:opacity-50" disabled={item.quantity <= 1}>
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <button onClick={() => updateCartItem(item.product._id, item.quantity + 1, item.color)} className="px-3 py-1 cursor-pointer rounded-r-lg transition-colors">
                      <FaPlus className="text-xs" />
                    </button>
                  </div>

                  <p className="font-bold text-lg text-primary">
                    <span className="opacity-75">{item.product.finalPrice} x {item.quantity} =</span> ${(item.product.finalPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* clear cart */}
          <div className="flex justify-between">
            <Button to="/products" variant="outline">
              <FaPlus className="text-xs" /> More Products
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <FaTrash /> Clear Cart
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to clear your cart?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Make sure that this action cannot be undone. This will permanently remove all items from your cart.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearCart}>Clear Cart</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-box rounded-2xl shadow-sm border border-box-secondary p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
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
                <span>Estimated Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <Button 
              onClick={handleCheckout}
              className="w-full py-6 text-lg"
            >
              <IoBagCheckOutline /> 
              Proceed to Checkout
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