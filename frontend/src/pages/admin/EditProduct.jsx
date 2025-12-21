import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from "sonner";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProduct, updateProduct } = useAppContext();

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    price: '',
    discount: '',
    category: '',
    color: '',
    description: '',
    externalImages: '',
    inStock: true,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load product data
  useEffect(() => {
    if (allProduct) {
      const product = allProduct.find((p) => p._id === id);
      if (product) {
        setFormData({
          id: product.id,
          title: product.title,
          price: product.price,
          discount: product.discount,
          category: product.category,
          color: product.color ? product.color.join(', ') : '',
          description: product.description || '',
          externalImages: '',
          inStock: product.inStock,
        });
        setExistingImages(product.images || []);
      } else {
        toast.error("Product not found");
        navigate("/admin/products");
      }
      setLoading(false);
    }
  }, [allProduct, id, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleDescription = (value) => {
    setFormData({ ...formData, description: value.replace(/&nbsp;/g, ' ') });
  };

  // Handle new image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;
    
    if (totalImages > 5) {
      alert("Maximum 5 images allowed in total");
      return;
    }
    
    const updatedNewImages = [...newImages, ...files];
    setNewImages(updatedNewImages);

    const filePreviews = updatedNewImages.map(file => URL.createObjectURL(file));
    setNewPreviews(filePreviews);
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Remove new image
  const removeNewImage = (index) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    const updatedPreviews = newPreviews.filter((_, i) => i !== index);
    setNewImages(updatedImages);
    setNewPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();

    // Basic Fields
    data.append("id", Number(formData.id));
    data.append("title", formData.title);
    data.append("price", Number(formData.price));
    data.append("discount", Number(formData.discount) || 0);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("inStock", formData.inStock);

    // Color Handling
    const colors = formData.color.split(',').map(c => c.trim()).filter(c => c !== "");
    if (colors.length === 0) {
      data.append("color", ""); // Send empty string to clear colors
    } else {
      colors.forEach(colorValue => data.append("color", colorValue));
    }

    // Existing Images (send back the ones we kept)
    if (existingImages.length === 0) {
      data.append("existingImages", ""); // Send empty string to clear existing images
    } else {
      existingImages.forEach(url => data.append("existingImages", url));
    }

    // External Image URLs (new ones)
    const urls = formData.externalImages.split(',').map(u => u.trim()).filter(u => u !== "");
    urls.forEach(url => data.append("externalImages", url));

    // New Files (Cloudinary)
    newImages.forEach(img => data.append("images", img));

    const result = await updateProduct(id, data);

    if (result.success) {
      navigate("/admin/products");
    }
    setIsSubmitting(false);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet'
  ];

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="rounded-xl bg-box p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* title */}
          <div className="md:col-span-2">
            <label className="block text-sm">Product Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
          </div>
          {/* id */}
          <div>
            <label className="block text-sm">Product ID #</label>
            <input type="number" name="id" value={formData.id} onChange={handleChange} required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
          </div>
          {/* price */}
          <div>
            <label className="block text-sm">Price ($)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
          </div>
          {/* discount */}
          <div>
            <label className="block text-sm">Discount (%)</label>
            <input type="number" name="discount" value={formData.discount} onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
          </div>
          {/* category */}
          <div>
            <label className="block text-sm">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
          </div>
          {/* color */}
          <div className="md:col-span-2">
            <label className="block text-sm">Color (comma separated)</label>
            <input type="text" name="color" value={formData.color} onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
          </div>
          {/* Stock Status */}
          <div className="flex items-center pt-6">
            <input type="checkbox" name="inStock" id="inStock" checked={formData.inStock} onChange={handleChange} className="w-5 h-5 text-primary" />
            <label htmlFor="inStock" className="ml-2 text-sm font-medium">Available in Stock</label>
          </div>
          {/* img url */}
          <div className="md:col-span-3">
            <label className="block text-sm font-bold">Add More External Image URLs (comma separated)</label>
            <textarea name="externalImages" value={formData.externalImages} onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://link1.com/img.jpg" rows="2" />
          </div>
        </div>

        {/* quill js */}
        <div>
          <label className="block text-sm mb-2">Detailed Description</label>
          <ReactQuill theme="snow" value={formData.description} onChange={handleDescription} modules={modules} formats={formats} className="h-40 mb-12" />
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <label className="block text-sm mb-2">Existing Images</label>
            <div className="flex flex-wrap gap-4">
              {existingImages.map((url, index) => (
                <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                  <img src={url} alt="existing" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Upload */}
        <div className="pt-4">
          <label className="block text-sm mb-2">Upload New Images (Cloudinary)</label>
          <div className="relative border-2 border-dashed border-box-tertiary bg-box-secondary p-10 rounded-2xl text-center hover:border-primary transition-all cursor-pointer">
            <input type="file" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p className="text-gray-600">Click or Drag & Drop Images Here</p>
            </div>
          </div>
          {/* New Image Previews */}
          {newPreviews.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-6">
              {newPreviews.map((url, index) => (
                <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* submit form */}
        <button type="submit" disabled={isSubmitting}
          className="w-full cursor-pointer bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 disabled:bg-gray-400 transition-all">
          {isSubmitting ? "UPDATING..." : "UPDATE PRODUCT"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
