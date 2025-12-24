import Cart from "../models/cart.model.js"
import Product from "../models/product.model.js"

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity, color } = req.body

  try {
    const userId = req.user._id
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    let cart = await Cart.findOne({ user: userId })

    if (cart) {
      // cart exists for user
      const itemIndex = cart.items.findIndex((p) => p.product.toString() === productId && p.color === color)

      if (itemIndex > -1) {
        // product exists in the cart, update the quantity
        let productItem = cart.items[itemIndex]
        productItem.quantity += Number(quantity)
        cart.items[itemIndex] = productItem
      } else {
        // product does not exist in cart, add new item
        cart.items.push({ product: productId, quantity: Number(quantity), color })
      }
      cart = await cart.save()
      await cart.populate("items.product")
      return res.status(200).json({ success: true, cart })
    } else {
      // no cart for user, create new cart
      const newCart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity, color }],
      })
      await newCart.populate("items.product")
      return res.status(201).json({ success: true, cart: newCart })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// Get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id
    let cart = await Cart.findOne({ user: userId }).populate("items.product")
    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } })
    }
    res.status(200).json({ success: true, cart })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  const { productId, quantity, color } = req.body

  try {
    const userId = req.user._id
    let cart = await Cart.findOne({ user: userId })
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" })

    const itemIndex = cart.items.findIndex((p) => p.product.toString() === productId && p.color === color)

    if (itemIndex > -1) {
      if (quantity > 0) {
        cart.items[itemIndex].quantity = Number(quantity)
      } else {
        // if quantity is 0 or less, remove the item
        cart.items.splice(itemIndex, 1)
      }
      cart = await cart.save()
      await cart.populate("items.product")
      return res.status(200).json({ success: true, cart })
    } else {
      return res.status(404).json({ success: false, message: "Item not found in cart" })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// Remove item from cart
export const removeCartItem = async (req, res) => {
  const { itemId } = req.params

  try {
    const userId = req.user._id
    let cart = await Cart.findOne({ user: userId })
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" })

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId)

    cart = await cart.save()
    await cart.populate("items.product")
    res.status(200).json({ success: true, cart })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id
    const cart = await Cart.findOne({ user: userId })
    if (cart) {
      cart.items = []
      await cart.save()
    }
    res.status(200).json({ success: true, message: "Cart cleared" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// get all cart for admin
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("user").populate("items.product")
    res.status(200).json({ success: true, carts })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// cart summary (item count and total price)
export const getCartSummary = async (req, res) => {
  try {
    const userId = req.user._id
    const cart = await Cart.findOne({ user: userId }).populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ success: true, summary: { totalItems: 0, totalPrice: 0 } })
    }

    let totalItems = 0
    let totalPrice = 0

    cart.items.forEach((item) => {
      if (item.product) {
        totalItems += item.quantity
        totalPrice += item.product.finalPrice * item.quantity
      }
    })

    res.status(200).json({ success: true, summary: { totalItems, totalPrice } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message })
  }
}