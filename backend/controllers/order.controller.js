import Order from "../models/order.model.js"
import Cart from "../models/cart.model.js"
import Config from "../models/config.model.js"

// make order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id
    const { shippingAddress } = req.body

    // get the user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product")
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cannot place order, your cart is empty." })
    }

    // calculate total amount and prepare order items
    let totalAmount = 0
    const orderItems = cart.items.filter((item) => item.product).map((item) => {
      const product = item.product
      const price = product.finalPrice
      totalAmount += price * item.quantity
      return {
        product: product._id,
        quantity: item.quantity,
        color: item.color,
        price: price,
      }
    })

    // Get shipping configuration
    const config = await Config.findOne()
    const shippingFeeConfig = config?.shippingFee || 50
    const freeShippingThreshold = config?.freeShippingThreshold || 400

    const shippingFee = totalAmount > freeShippingThreshold ? 0 : shippingFeeConfig
    totalAmount += shippingFee

    // send to database with payment status and payment methood's default value
    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingFee,
      shippingAddress,
    })

    // clear the Cart
    cart.items = []
    await cart.save()

    res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// get all orders for users with latest created first
export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("items.product")
    res.status(200).json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// get all orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user").populate("items.product")
    res.status(200).json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    order.orderStatus = status
    await order.save()

    res.status(200).json({ success: true, message: "Order status updated successfully", order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}