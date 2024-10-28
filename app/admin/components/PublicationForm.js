// app/admin/components/PublicationForm.js
import { useState } from 'react';
import Image from 'next/image';

const categories = [
  { display: 'Entrenadores', value: 'Entrenadores' },
  { display: 'Hoteles / Guarderías', value: 'Hoteles' },
  { display: 'Paseadores', value: 'Paseadores' },
  { display: 'Peluquería', value: 'Peluqueria' },
  { display: 'Experiencias Pet-friendly', value: 'Petfriendly' },
  { display: 'Productos', value: 'Productos' },
  { display: 'Servicios', value: 'Servicios' },
  { display: 'Bienestar', value: 'Bienestar' },
  { display: 'Veterinarios', value: 'Veterinarios' },
];

export default function PublicationForm({
  initialData = null,
  onSubmit,
  isSubmitting,
  submitButtonText = 'Create Publication',
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    categoryName: initialData?.categoryName || '',
    city: initialData?.city || '',
    hood: initialData?.hood || '',
    phone: initialData?.phone || '',
    instagram: initialData?.instagram || '',
    facebook: initialData?.facebook || '',
    tikTok: initialData?.tikTok || '',
    delivery: initialData?.delivery || false,
    price: initialData?.price || '',
    promotion: initialData?.promotion || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    imageUrls: initialData?.imageUrl?.map((img) => img.url) || [''],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData((prev) => ({
      ...prev,
      imageUrls: newImageUrls,
    }));
  };

  const addImageUrl = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ''],
    }));
  };

  const removeImageUrl = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.display}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hood
            </label>
            <input
              type="text"
              name="hood"
              value={formData.hood}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Facebook
            </label>
            <input
              type="text"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              TikTok
            </label>
            <input
              type="text"
              name="tikTok"
              value={formData.tikTok}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Promotion
            </label>
            <select
              name="promotion"
              value={formData.promotion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">No Promotion</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="delivery"
            checked={formData.delivery}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">
            Offers Delivery
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="any"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="any"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <button
              type="button"
              onClick={addImageUrl}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Add Image
            </button>
          </div>
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="Image URL"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              {url && (
                <div className="mt-2">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Saving...' : submitButtonText}
      </button>
    </form>
  );
}
