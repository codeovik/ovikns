import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";

// order make
export const makeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    let totalPrice = 0;

    const orderItems = cart.items.map((item) => {
      const price =
        item.product.finalPrice ?? item.product.price ?? 0;

      totalPrice += price * item.quantity;

      return {
        product: item.product._id,
        title: item.product.title,
        price,
        quantity: item.quantity,
        color: item.color,
      };
    });

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
    });

    // 🔥 Clear cart after checkout
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Checkout failed." });
  }
};

// Order history
export const getOrders = async (req, res) => {
  try {
    // শুধু logged-in user এর orders
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "No orders found.", orders: [] });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};