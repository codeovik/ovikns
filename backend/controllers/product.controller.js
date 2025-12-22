import Product from "../models/product.model.js"
import cloudinary from "../config/cloudinary.js"

export const createProduct = async (req, res) => {
  // get product information
  const { id, title, price, discount, category, color, description, externalImages } = req.body
  const files = req.files

  // initialize image array
  let imageUrls = []

  // handling external images
  if (externalImages) {
    const urls = Array.isArray(externalImages) ? externalImages : [externalImages]
    imageUrls = [...urls]
  }

  // handliing upload image to cloudinary
  if (files && files.length > 0) {
    try {
      const uploadPromises = files.map(file =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "dropship", // clouldinary media folder
              // image size optimizing
              transformation: [
                { width: 1000, crop: "scale" },
                { quality: "auto", fetch_format: "auto" }
              ]
            },
            (error, result) => {
              if (error) return reject(error)
              resolve(result.secure_url)
            },
          )
          uploadStream.end(file.buffer)
        }),
      )
      const uploadedCloudinaryUrls = await Promise.all(uploadPromises)
      imageUrls = [...imageUrls, ...uploadedCloudinaryUrls]
    } catch (error) {
      return res.status(500).json({ message: "Cloudinary upload failed." })
    }
  }

  // image length cann't 0
  if (imageUrls.length === 0) {
    return res.status(400).json({ message: "At least one image is required." })
  }

  // making 'finalPrice' for database
  const parsedPrice = parseFloat(price)
  const parsedDiscount = parseFloat(discount) || 0
  const calculatedFinalPrice = parsedPrice - (parsedPrice * parsedDiscount / 100)

  // send to database
  const newProduct = new Product({
    id: Number(id),
    title,
    price: parsedPrice,
    discount: parsedDiscount,
    finalPrice: calculatedFinalPrice,
    category,
    color: Array.isArray(color) ? color : [color], // color type is array
    images: imageUrls,
    description,
  })

  try {
    await newProduct.save()
    res.status(201).json({ message: "Product created successfully", product: newProduct })
  } catch (error) {
    console.error("Database Error:", error)
    if (error.code === 11000) {
      return res.status(409).json({ message: "Product with this ID already exists." })
    }
    res.status(400).json({ message: error.message })
  }
}

// get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Error fetching products." })
  }
}

// get individual product
export const getIndividualProduct = async (req, res) => {
  const { id } = req.params

  try {
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: "Product not found." })
    }
    res.status(200).json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ message: "Error fetching product." })
  }
}

// update product
export const updateProduct = async (req, res) => {
  const { id } = req.params
  const { id: numericId, title, price, discount, category, color, description, inStock, existingImages, externalImages } = req.body
  const files = req.files

  try {
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: "Product not found." })
    }

    // Update Numeric ID if provided and different
    if (numericId && Number(numericId) !== product.id) {
      // Check for collision
      const existingProduct = await Product.findOne({ id: Number(numericId) })
      if (existingProduct) {
        return res.status(400).json({ message: "Product ID already exists." })
      }
      product.id = Number(numericId)
    }

    let imageUrls = product.images

    // Handle existing images (keep only what is sent back from frontend)
    if (existingImages !== undefined) {
      const existing = Array.isArray(existingImages) ? existingImages : [existingImages]
      imageUrls = existing.filter((url) => url && typeof url === "string" && url.trim() !== "")
    }

    // Add external images
    if (externalImages) {
      const urls = Array.isArray(externalImages) ? externalImages : [externalImages]
      const validUrls = urls.filter((url) => url && typeof url === "string" && url.trim() !== "")
      imageUrls = [...imageUrls, ...validUrls]
    }

    // Upload new files to Cloudinary
    if (files && files.length > 0) {
      try {
        const uploadPromises = files.map((file) =>
          new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "dropship",
                transformation: [
                  { width: 1000, crop: "scale" },
                  { quality: "auto", fetch_format: "auto" },
                ],
              },
              (error, result) => {
                if (error) return reject(error)
                resolve(result.secure_url)
              }
            )
            uploadStream.end(file.buffer)
          })
        )
        const uploadedCloudinaryUrls = await Promise.all(uploadPromises)
        imageUrls = [...imageUrls, ...uploadedCloudinaryUrls]
      } catch (error) {
        return res.status(500).json({ message: "Cloudinary upload failed." })
      }
    }

    // Update fields
    if (title) product.title = title
    if (category) product.category = category
    if (description !== undefined) product.description = description
    
    if (color !== undefined) {
      const colorArray = Array.isArray(color) ? color : [color]
      product.color = colorArray.filter(c => c && c.trim() !== "")
    }
    
    if (inStock !== undefined) product.inStock = inStock === "true" || inStock === true

    // Price and Discount Logic
    if (price !== undefined) product.price = parseFloat(price)
    if (discount !== undefined) product.discount = parseFloat(discount)

    product.finalPrice = product.price - (product.price * product.discount) / 100
    product.images = imageUrls

    await product.save()
    res.status(200).json({ message: "Product updated successfully.", product })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ message: error.message || "Error updating product." })
  }
}

// delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params

  try {
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
      return res.status(404).json({ message: "Product not found." })
    }
    // Optionally, delete images from Cloudinary here if needed
    res.status(200).json({ message: "Product deleted successfully." })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ message: "Error deleting product." })
  }
}