import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const UploadProduct = () => {
  const { createProduct } = useAppContext();

  // product upload form variables
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    price: '',
    discount: '',
    category: '',
    color: '',
    description: '',
    externalImages: '',
  });

  // states
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // onchange form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDescription = (value) => {
    setFormData({ ...formData, description: value.replace(/&nbsp;/g, ' ') });
  };

  // image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    const newImages = [...images, ...files];
    setImages(newImages);

    const filePreviews = newImages.map(file => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();

    // Basic Fields
    data.append("id", Number(formData.id)); // backend model অনুযায়ী 'id'
    data.append("title", formData.title);
    data.append("price", Number(formData.price));
    data.append("discount", Number(formData.discount) || 0);
    data.append("category", formData.category);
    data.append("description", formData.description);

    // Color Handling
    const colors = formData.color.split(',').map(c => c.trim()).filter(c => c !== "");
    colors.forEach(colorValue => data.append("color", colorValue));

    // External Image URLs Handling
    // কমা দিয়ে আলাদা করা লিংকগুলোকে অ্যারে বানিয়ে লুপে অ্যাপেন্ড করা হচ্ছে
    const urls = formData.externalImages.split(',').map(u => u.trim()).filter(u => u !== "");
    urls.forEach(url => data.append("externalImages", url));

    // Files (Cloudinary)
    images.forEach(img => data.append("images", img));

    const result = await createProduct(data);

    if (result.success) {
      setFormData({ id: '', title: '', price: '', discount: '', category: '', color: '', description: '', externalImages: '' });
      setImages([]);
      setPreviews([]);
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

  return (
    <div className="rounded-xl bg-box p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Create New Product</h2>

      {/* form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* title */}
          <div className="md:col-span-2">
            <label className="block text-sm">Product Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="Enter title" />
          </div>
          {/* id */}
          <div>
            <label className="block text-sm">Product ID #</label>
            <input type="number" name="id" value={formData.id} onChange={handleChange} required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="101" />
          </div>
          {/* price */}
          <div>
            <label className="block text-sm">Price ($)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="0.00" />
          </div>
          {/* discount */}
          <div>
            <label className="block text-sm">Discount (%)</label>
            <input type="number" name="discount" value={formData.discount} onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="0" />
          </div>
          {/* category */}
          <div>
            <label className="block text-sm">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="Phone, Laptop etc." />
          </div>
          {/* color */}
          <div className="md:col-span-3">
            <label className="block text-sm">Color (comma separated)</label>
            <input type="text" name="color" value={formData.color} onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="Red, Black, Blue" />
          </div>
          {/* img url */}
          <div className="md:col-span-3">
            <label className="block text-sm font-bold">External Image URLs (comma separated)</label>
            <textarea name="externalImages" value={formData.externalImages} onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://link1.com/img.jpg, https://link2.com/img.png" rows="2" />
          </div>
        </div>
        {/* quill js */}
        <div>
          <label className="block text-sm mb-2">Detailed Description</label>
          <ReactQuill theme="snow" value={formData.description} onChange={handleDescription} modules={modules} formats={formats} className="h-40 mb-12" />
        </div>
        {/* img upload */}
        <div className="pt-4">
          <label className="block text-sm mb-2">Upload Images to Cloudinary (Max 5)</label>
          <div className="relative border-2 border-dashed border-box-tertiary bg-box-secondary p-10 rounded-2xl text-center hover:border-primary transition-all cursor-pointer">
            <input type="file" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p className="text-gray-600">Click or Drag & Drop Images Here</p>
            </div>
          </div>
          {/* img upload preview */}
          <div className="flex flex-wrap gap-4 mt-6">
            {previews.map((url, index) => (
              <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">×</button>
              </div>
            ))}
          </div>
        </div>
        {/* submit form */}
        <button type="submit" disabled={isSubmitting}
          className="w-full cursor-pointer bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 disabled:bg-gray-400 transition-all">
          {isSubmitting ? "PUBLISHING..." : "PUBLISH PRODUCT"}
        </button>
      </form>
    </div>
  );
};

export default UploadProduct;