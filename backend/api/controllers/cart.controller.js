import Cart from "../models/cart.model.js"
import Product from "../models/product.model.js"

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    )

    if (!cart) {
      return res.status(200).json({ items: [], total: 0 })
    }

    res.status(200).json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    res.status(500).json({ message: "Error fetching cart." })
  }
}

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity, color } = req.body
  const userId = req.user.id

  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found." })
    }

    // Validate that the selected color is available for the product
    if (!product.color.includes(color)) {
      return res.status(400).json({ message: `Color '${color}' is not available for this product.` })
    }

    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
      cart = new Cart({ user: userId, items: [] })
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    )

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity += Number(quantity)
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({ product: productId, quantity, color })
    }

    await cart.save()
    await cart.populate("items.product")
    res.status(200).json({ message: "Item added to cart.", cart })
  } catch (error) {
    console.error("Error adding to cart:", error)
    res.status(500).json({ message: "Error adding item to cart." })
  }
}

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
  const { productId } = req.params
  const { quantity, color } = req.body // Expect color in the body
  const userId = req.user.id

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be positive." })
  }

  try {
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." })
    }

    // Find item by both product ID and color
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    )

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Number(quantity)
      await cart.save()
      await cart.populate("items.product")
      res.status(200).json({ message: "Cart updated.", cart })
    } else {
      res.status(404).json({ message: "Item not found in cart." })
    }
  } catch (error) {
    console.error("Error updating cart:", error)
    res.status(500).json({ message: "Error updating cart item." })
  }
}

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const { productId, color } = req.body
  const userId = req.user.id

  try {
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId, color } } },
      { new: true }
    ).populate("items.product")

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." })
    }

    res.status(200).json({
      message: "Item removed from cart.",
      cart,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error removing item from cart." })
  }
}

// Cart summary (items count + total price)
export const getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        totalItems: 0,
        totalPrice: 0,
      })
    }

    let totalItems = 0
    let totalPrice = 0

    cart.items.forEach((item) => {
      totalItems += item.quantity

      const price =
        item.product.finalPrice ?? item.product.price ?? 0

      totalPrice += price * item.quantity
    })

    res.status(200).json({
      totalItems,
      totalPrice,
    })
  } catch (error) {
    console.error("Cart summary error:", error)
    res.status(500).json({ message: "Failed to get cart summary." })
  }
}