import Stripe from "stripe"
import Order from "../models/order.model.js"
import Config from "../models/config.model.js"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// make stripe payment
export const stripePayment = async (req, res) => {
  try {
    const { orderId } = req.body
    const order = await Order.findById(orderId).populate("items.product")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Fetch configuration for shipping threshold
    let config = await Config.findOne()
    const freeShippingThreshold = config ? config.freeShippingThreshold : 400
    const standardShippingFee = config ? config.shippingFee : 50
    const shippingFee = order.totalAmount > freeShippingThreshold ? 0 : standardShippingFee

    // Update payment method to online
    order.paymentMethod = "online"
    await order.save()

    // 1. Prepare line items for Stripe Checkout
    const line_items = []
    for (const item of order.items) {
      // item.product is populated
      if (item.product) {
        line_items.push({
          price_data: {
            currency: "usd", // product currency
            product_data: {
              name: item.product.title, // see title on stripe payment page
              images: item.product.images, // send our product image to stripe cdn to see in stripe payment page
            },
            unit_amount: Math.round(item.price * 100), // main amount
          },
          quantity: item.quantity,
        })
      }
    }

    // Add Shipping Fee to line items if applicable
    if (shippingFee > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping Fee",
          },
          unit_amount: shippingFee * 100,
        },
        quantity: 1,
      })
    }

    // checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONT_END_DOMAIN}/payment-success?next=/orders&time=10`, // Redirect here after payment
      cancel_url: `${process.env.FRONT_END_DOMAIN}/orders`,   // Redirect to orders if canceled
      customer_email: req.user.email, // Optional: Pre-fill user email
      metadata: { orderId: order._id.toString() }, // Pass Order ID to identify which order to update
    })

    // 3. Send the session URL back to the frontend
    res.json({ success: true, url: session.url })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// make cod payment
export const codPayment = async (req, res) => {
  try {
    const { orderId } = req.body
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.paymentMethod = "COD"
    await order.save()

    res.status(200).json({ success: true, message: "Order confirmed with Cash on Delivery" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}