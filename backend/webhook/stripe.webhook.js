import Stripe from "stripe"
import Order from "../models/order.model.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

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
        const orderId = session.metadata.orderId

        try {
            // Find the order and update status
            const order = await Order.findById(orderId)
            if (order) {
                order.paymentStatus = "Paid"
                await order.save()
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send()
}