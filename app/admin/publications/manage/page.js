// app/admin/publications/manage/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../components/Modal';
import PublicationForm from '../../components/PublicationForm';

export default function ManagePublications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch publications');
      const data = await response.json();
      setPublications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const response = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete publication');
      setPublications(publications.filter((pub) => pub.id !== id));
    } catch (err) {
      alert('Error deleting publication: ' + err.message);
    }
  };

  const handleEdit = async (publication) => {
    try {
      const response = await fetch(`/api/posts/${publication.id}`);
      if (!response.ok) throw new Error('Failed to fetch publication details');
      const fullPublicationData = await response.json();

      setSelectedPublication(fullPublicationData);
      setIsModalOpen(true);
    } catch (err) {
      alert('Error fetching publication details: ' + err.message);
    }
  };

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log('Updating with data:', {
        id: selectedPublication.id,
        ...formData,
      });

      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedPublication.id,
          userId: selectedPublication.userId, // Make sure to include the userId
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update publication');
      }

      const updatedPublication = await response.json();
      console.log('Update successful:', updatedPublication);

      // Refresh publications list
      await fetchPublications();

      // Close modal and reset state
      setIsModalOpen(false);
      setSelectedPublication(null);

      // Show success message
      alert('Publication updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating publication: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Publications</h1>
        <button
          onClick={() => router.push('/admin/publications/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Publication
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City/Hood
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Social Media
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {publications.map((publication) => (
              <tr key={publication.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {publication.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {publication.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {publication.categoryName}
                  </div>
                  {publication.subcategories?.map((sub) => (
                    <span
                      key={sub.id}
                      className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1 mr-1"
                    >
                      {sub.name}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {publication.city}
                  </div>
                  <div className="text-sm text-gray-500">
                    {publication.hood}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {publication.phone}
                  </div>
                  {publication.delivery && (
                    <span className="text-xs text-green-800 bg-green-100 rounded-full px-2 py-1">
                      Delivery
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {publication.instagram && (
                      <div className="text-sm text-blue-600">
                        @{publication.instagram}
                      </div>
                    )}
                    {publication.facebook && (
                      <div className="text-sm text-blue-800">
                        {publication.facebook}
                      </div>
                    )}
                    {publication.tikTok && (
                      <div className="text-sm text-pink-600">
                        {publication.tikTok}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      publication.promotion === 'GOLD'
                        ? 'bg-yellow-100 text-yellow-800'
                        : publication.promotion === 'SILVER'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {publication.promotion || 'Regular'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {publication.price ? (
                    <div className="text-sm text-gray-900">
                      ${publication.price.toFixed(2)}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(publication)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(publication.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPublication(null);
        }}
        title="Edit Publication"
      >
        {selectedPublication && (
          <PublicationForm
            initialData={selectedPublication}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            submitButtonText="Update Publication"
          />
        )}
      </Modal>
    </div>
  );
}
