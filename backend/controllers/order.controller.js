import Order from "../models/order.model.js"
import Cart from "../models/cart.model.js"
import Product from "../models/product.model.js"

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id
    const { shippingAddress, paymentMethod } = req.body

    // 1. Get the user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product")
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // 2. Calculate total amount and prepare order items
    let totalAmount = 0
    const orderItems = []

    for (const item of cart.items) {
      const product = item.product
      if (!product) continue // Skip if product no longer exists

      // Use finalPrice from product model for security
      const price = product.finalPrice || product.price
      totalAmount += price * item.quantity

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        color: item.color,
        price: price,
      })
    }

    // 3. Create the Order
    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "online" ? "Paid" : "Pending",
    })

    // 4. Clear the Cart
    cart.items = []
    await cart.save()

    res.status(201).json({ message: "Order placed successfully", order: newOrder })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("items.product")
    res.status(200).json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.paymentStatus = "Paid"
      const updatedOrder = await order.save()
      res.json(updatedOrder)
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
