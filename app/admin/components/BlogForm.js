// app/admin/components/BlogForm.js
'use client';

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

export default function BlogForm({
  initialData = null,
  onSubmit,
  isSubmitting,
  submitButtonText = 'Create Blog Post',
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ''
  );
  const [introduction, setIntroduction] = useState(
    initialData?.introduction || ''
  );
  const [category, setCategory] = useState(initialData?.categoryName || '');
  const [sections, setSections] = useState(
    initialData?.contentSections?.map((s) => ({
      title: s.title,
      content: s.content,
    })) || [{ title: '', content: '' }]
  );
  const [faqs, setFaqs] = useState(
    initialData?.faqs?.map((f) => ({
      question: f.question,
      answer: f.answer,
    })) || [{ question: '', answer: '' }]
  );
  const [conclusion, setConclusion] = useState(initialData?.conclusion || '');
  const [images, setImages] = useState(
    initialData?.images?.map((i) => ({
      url: i.url,
      alt: i.alt,
    })) || [{ url: '', alt: '' }]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      title,
      metaTitle,
      metaDescription,
      introduction,
      categoryName: category,
      sections,
      faqs,
      conclusion,
      images,
    });
  };

  const addSection = () => {
    setSections([...sections, { title: '', content: '' }]);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const addImage = () => {
    setImages([...images, { url: '', alt: '' }]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Blog Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="metaTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Meta Title
          </label>
          <input
            id="metaTitle"
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

        <div>
          <label
            htmlFor="introduction"
            className="block text-sm font-medium text-gray-700"
          >
            Introduction
          </label>
          <textarea
            id="introduction"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={4}
          />
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Sections</h3>
            <button
              type="button"
              onClick={addSection}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Add Section
            </button>
          </div>
          {sections.map((section, index) => (
            <div key={index} className="space-y-2 p-4 border rounded">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[index].title = e.target.value;
                    setSections(newSections);
                  }}
                  placeholder="Section Title"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="ml-2 text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>
              <textarea
                value={section.content}
                onChange={(e) => {
                  const newSections = [...sections];
                  newSections[index].content = e.target.value;
                  setSections(newSections);
                }}
                placeholder="Section Content"
                className="block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={4}
              />
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">FAQs</h3>
            <button
              type="button"
              onClick={addFaq}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Add FAQ
            </button>
          </div>
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2 p-4 border rounded">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    newFaqs[index].question = e.target.value;
                    setFaqs(newFaqs);
                  }}
                  placeholder="Question"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="ml-2 text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>
              <textarea
                value={faq.answer}
                onChange={(e) => {
                  const newFaqs = [...faqs];
                  newFaqs[index].answer = e.target.value;
                  setFaqs(newFaqs);
                }}
                placeholder="Answer"
                className="block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
              />
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Images</h3>
            <button
              type="button"
              onClick={addImage}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Add Image
            </button>
          </div>
          {images.map((image, index) => (
            <div key={index} className="space-y-2 p-4 border rounded">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={image.url}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index].url = e.target.value;
                    setImages(newImages);
                  }}
                  placeholder="Image URL"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="ml-2 text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={image.alt}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[index].alt = e.target.value;
                  setImages(newImages);
                }}
                placeholder="Alt Text"
                className="block w-full rounded-md border border-gray-300 px-3 py-2"
              />
              {image.url && (
                <div className="mt-2">
                  <Image
                    src={image.url}
                    alt={image.alt || 'Preview'}
                    width={200}
                    height={200}
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <label
            htmlFor="conclusion"
            className="block text-sm font-medium text-gray-700"
          >
            Conclusion
          </label>
          <textarea
            id="conclusion"
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={4}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Saving...' : submitButtonText}
      </button>
    </form>
  );
}
