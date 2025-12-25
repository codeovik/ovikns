import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      color: String,
      price: { type: Number, required: true } // Store price at time of purchase
    }
  ],
  totalAmount: { type: Number, required: true },
  shippingFee: { type: Number, required: true, default: 0 },
  shippingAddress: {
    street: { type: String, required: true, maxLength: 200 },
    city: { type: String, required: true, maxLength: 100 },
    state: { type: String, required: true, maxLength: 100 },
    zip: { type: String, required: true, maxLength: 20 },
    country: { type: String, required: true, maxLength: 100 },
    phone: { type: String, required: true, maxLength: 20 },
    deliveryInstructions: { type: String, maxLength: 1000 },
    appartment: { type: String, required: true, maxLength: 50 },
  },
  paymentMethod: {
    type: String,
    enum: ["online", "COD", "none"],
    default: "none"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },
  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing"
  }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("Order", orderSchema);
