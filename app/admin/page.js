// app/admin/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalPublications: 0,
    totalUsers: 0,
    recentBlogs: [],
    recentPosts: [],
    systemStatus: {
      database: {
        status: 'checking',
        latency: 'checking',
      },
      api: {
        status: 'checking',
        latency: 'checking',
      },
      contentDelivery: {
        status: 'checking',
        latency: 'checking',
      },
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      // Ensure systemStatus exists in the response
      setStats({
        ...data,
        systemStatus: data.systemStatus || {
          database: { status: 'unknown', latency: 'unknown' },
          api: { status: 'unknown', latency: 'unknown' },
          contentDelivery: { status: 'unknown', latency: 'unknown' },
        },
      });
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational':
        return 'bg-green-500';
      case 'issues':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLatencyColor = (latency) => {
    switch (latency?.toLowerCase()) {
      case 'good':
        return 'text-green-600';
      case 'poor':
        return 'text-yellow-600';
      case 'bad':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) return <div className="p-4">Loading dashboard data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats Card */}
        <div className="list-card bg-white shadow-lg rounded border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Content Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Blogs</p>
              <p className="text-2xl font-bold">{stats.totalBlogs || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Publications</p>
              <p className="text-2xl font-bold">
                {stats.totalPublications || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="list-card bg-white shadow-lg rounded border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Recent Blogs</p>
              <ul className="space-y-2">
                {stats.recentBlogs?.map((blog) => (
                  <li
                    key={blog.id}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    <a
                      href={`/admin/blogs/${blog.id}`}
                      className="flex items-center"
                    >
                      <span className="mr-2">•</span>
                      <span className="flex-1">{blog.title}</span>
                      <span className="text-xs text-gray-500">
                        {blog.category?.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Recent Publications</p>
              <ul className="space-y-2">
                {stats.recentPosts?.map((post) => (
                  <li
                    key={post.id}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    <a
                      href={`/admin/publications/${post.id}`}
                      className="flex items-center"
                    >
                      <span className="mr-2">•</span>
                      <span className="flex-1">{post.name}</span>
                      <span className="text-xs text-gray-500">
                        {post.categoryName}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* System Status Card */}
        <div className="list-card bg-white shadow-lg rounded border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <div className="space-y-3">
            {Object.entries(stats.systemStatus || {}).map(
              ([service, status]) => (
                <div
                  key={service}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        status?.status
                      )}`}
                    ></div>
                    <span className="text-sm capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm ${getLatencyColor(status?.latency)}`}
                    >
                      {status?.latency || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {status?.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="list-card bg-white shadow-lg rounded border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/blogs/manage')}
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm transition duration-150"
            >
              Manage Blogs
            </button>
            <button
              onClick={() => router.push('/admin/publications/manage')}
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm transition duration-150"
            >
              Manage Publications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
