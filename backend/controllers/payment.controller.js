import Stripe from "stripe"
import Cart from "../models/cart.model.js"
import Order from "../models/order.model.js"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user._id
    const cart = await Cart.findOne({ user: userId }).populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cannot process payment, your cart is empty." })
    }

    // 1. Prepare line items for Stripe Checkout
    const line_items = []
    for (const item of cart.items) {
      if (item.product) { // Ensure product exists
        const price = item.product.finalPrice || item.product.price
        line_items.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product.title,
              images: item.product.images, // Optional: Show product image on checkout
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: item.quantity,
        })
      }
    }

    // 2. Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONT_END_DOMAIN}/success`, // Redirect here after payment
      cancel_url: `${process.env.FRONT_END_DOMAIN}/cart`,     // Redirect here if canceled
      customer_email: req.user.email, // Optional: Pre-fill user email
      metadata: { userId: userId.toString() }, // Pass User ID to identify who paid
      shipping_address_collection: { allowed_countries: ["BD", "US", "CA", "GB"] }, // Collect shipping address
    })

    // 3. Send the session URL back to the frontend
    res.json({ url: session.url })
  } catch (error) {
    console.error("Stripe Error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Handle Stripe Webhook
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]
  let event

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const userId = session.metadata.userId

    try {
      // 1. Find the user's cart
      const cart = await Cart.findOne({ user: userId }).populate("items.product")
      if (cart) {
        // 2. Prepare order items
        const orderItems = cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          color: item.color,
          price: item.product.finalPrice || item.product.price,
        }))

        // 3. Create the Order
        await Order.create({
          user: userId,
          items: orderItems,
          totalAmount: session.amount_total / 100, // Convert cents to dollars
          shippingAddress: session.shipping_details.address, // Use address from Stripe
          paymentMethod: "online",
          paymentStatus: "Paid", // Set status to Paid
        })

        // 4. Clear the Cart
        cart.items = []
        await cart.save()
        console.log(`Order created for user ${userId}`)
      }
    } catch (error) {
      console.error("Error creating order from webhook:", error)
      // Note: We don't return 500 here to Stripe to avoid retries if it's a logic error,
      // but you might want to log this securely.
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send()
}
