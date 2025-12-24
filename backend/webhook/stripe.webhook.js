import Stripe from "stripe"
import Order from "../models/order.model.js"
import sendEmail from "../utils/sendEmail.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Handle Stripe Webhook
export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"]
    let event

    // Verify the webhook signature
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // payment success
    if (event.type === "checkout.session.completed") {
        const session = event.data.object
        const orderId = session.metadata.orderId

        try {
            // update payment status in order
            const order = await Order.findById(orderId).populate("user", "name")
            if (order) {
                order.paymentStatus = "Paid"
                await order.save()
            }

            // send mail
            if (session.customer_details?.email) {
                const amount = session.amount_total / 100
                const currency = session.currency.toUpperCase()
                const customerName = order?.user?.name || session.customer_details.name || "Customer"

                await sendEmail({
                    email: session.customer_details.email,
                    subject: `Payment Successful - Order #${orderId}`,
                    message: `Hello ${customerName}, Your payment of ${amount} ${currency} for order #${orderId} has been successfully processed.`,
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                            <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/logo-light-2.png" alt="Ovikns Logo" style="max-width: 150px; height: auto;">
                        </div>
                        <div style="padding: 30px 20px;">
                            <h2 style="color: #2c3e50; text-align: center; margin-top: 0;">Payment Successful!</h2>
                            <p style="color: #555; text-align: center; font-size: 16px; line-height: 1.6;">
                                Hi <strong>${customerName}</strong>,<br>
                                Thank you for your purchase. We have received your payment of <strong>${amount} ${currency}</strong>.
                            </p>
                            
                            <div style="margin-top: 30px; background-color: #f9f9f9; padding: 20px; border-radius: 6px;">
                                <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Order Summary</h3>
                                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #666;">Order ID:</td>
                                        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">#${orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666;">Total Paid:</td>
                                        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #27ae60; font-size: 18px;">${amount.toFixed(2)} ${currency}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e0e0e0;">
                            <p>&copy; ${new Date().getFullYear()} Ovikns. All rights reserved.</p>
                        </div>
                    </div>`
                })
            }

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send()
}