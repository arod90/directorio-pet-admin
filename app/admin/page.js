'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './admin.module.css';

const categories = [
  { display: 'Entrenadores', value: 'Entrenadores' },
  { display: 'Hoteles / Guarderías', value: 'Hoteles' },
  { display: 'Paseadores', value: 'Paseadores' },
  { display: 'Peluquería', value: 'Peluqueria' },
  { display: 'Experiencias Pet-friendly', value: 'Petfriendly' },
  { display: 'Productos', value: 'Productos' },
  { display: 'Servicios y Salud', value: 'Servicios' },
  { display: 'Veterinarios', value: 'Veterinarios' },
];

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [category, setCategory] = useState('');
  const [sections, setSections] = useState([{ title: '', content: '' }]);
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [conclusion, setConclusion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [images, setImages] = useState([{ url: '', alt: '' }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitStatus('');

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          metaTitle,
          metaDescription,
          introduction,
          categoryName: category,
          sections,
          faqs,
          conclusion,
          images,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitMessage('Blog post created successfully!');
        setSubmitStatus('success');
        // Reset form fields
        setTitle('');
        setMetaTitle('');
        setMetaDescription('');
        setIntroduction('');
        setCategory('');
        setSections([{ title: '', content: '' }]);
        setFaqs([{ question: '', answer: '' }]);
        setConclusion('');
        setImages([{ url: '', alt: '' }]);
      } else {
        throw new Error('Failed to create blog post');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      setSubmitMessage('Error creating blog post. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
    <main className={styles.main}>
      <h1 className={styles.siteTitle}>
        Directorio<span className={styles.period}>.</span>pet
      </h1>
      <h2 className={styles.pageTitle}>Create New Blog Post</h2>
      {submitMessage && (
        <div className={`${styles.submitMessage} ${styles[submitStatus]}`}>
          {submitMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Blog Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="metaTitle" className={styles.label}>
            Meta Title
          </label>
          <input
            id="metaTitle"
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="metaDescription" className={styles.label}>
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            required
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="introduction" className={styles.label}>
            Introduction
          </label>
          <textarea
            id="introduction"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            required
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={styles.select}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.display}
              </option>
            ))}
          </select>
        </div>

        <h3 className={styles.sectionTitle}>Sections</h3>
        {sections.map((section, index) => (
          <div key={index} className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <input
                type="text"
                value={section.title}
                onChange={(e) => {
                  const newSections = [...sections];
                  newSections[index].title = e.target.value;
                  setSections(newSections);
                }}
                placeholder={`Section ${index + 1} Title`}
                required
                className={styles.sectionInput}
              />
              <button
                type="button"
                onClick={() => removeSection(index)}
                className={styles.removeButton}
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
              placeholder={`Section ${index + 1} Content`}
              required
              className={styles.textarea}
            />
          </div>
        ))}
        <button type="button" onClick={addSection} className={styles.addButton}>
          Add Section
        </button>

        <h3 className={styles.sectionTitle}>FAQs</h3>
        {faqs.map((faq, index) => (
          <div key={index} className={styles.faqContainer}>
            <div className={styles.faqHeader}>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => {
                  const newFaqs = [...faqs];
                  newFaqs[index].question = e.target.value;
                  setFaqs(newFaqs);
                }}
                placeholder={`FAQ ${index + 1} Question`}
                required
                className={styles.faqInput}
              />
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className={styles.removeButton}
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
              placeholder={`FAQ ${index + 1} Answer`}
              required
              className={styles.textarea}
            />
          </div>
        ))}
        <button type="button" onClick={addFaq} className={styles.addButton}>
          Add FAQ
        </button>

        <h3 className={styles.sectionTitle}>Blog Images</h3>
        {images.map((image, index) => (
          <div key={index} className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <input
                type="text"
                value={image.url}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[index].url = e.target.value;
                  setImages(newImages);
                }}
                placeholder={`Image ${index + 1} URL`}
                className={styles.sectionInput}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className={styles.removeButton}
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
              placeholder={`Image ${index + 1} Alt Text`}
              className={styles.input}
            />
            {image.url && (
              <div className={styles.imagePreview}>
                <Image
                  src={image.url}
                  alt={image.alt || 'Preview'}
                  width={200}
                  height={200}
                  objectFit="cover"
                />
              </div>
            )}
          </div>
        ))}
        <button type="button" onClick={addImage} className={styles.addButton}>
          Add Image
        </button>

        <div className={styles.formGroup}>
          <label htmlFor="conclusion" className={styles.label}>
            Conclusion
          </label>
          <textarea
            id="conclusion"
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            required
            className={styles.textarea}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Blog Post'}
        </button>
      </form>
    </main>
  );
}
