import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: Number, // Changed from ObjectId to Number
    ref: "Product", // The ref still works for population
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a 'User' model
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
