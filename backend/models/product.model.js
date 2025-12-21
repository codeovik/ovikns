import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  color: [
    { type: String }
  ],
  images: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
},
  {
    timestamps: true,
  }
)

export default mongoose.model("Product", productSchema)