// Statatics.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../App'; // Make sure this is your backend URL
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statatics = () => {
  const [stats, setStats] = useState({ users: 0, songs: 0, albums: 0 });
  const [playedSongsData, setPlayedSongsData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get(`${url}/api/admin/stats`);
        const playedSongsRes = await axios.get(`${url}/api/admin/stats/played`);

        const statsData = statsRes.data?.data || { users: 0, songs: 0, albums: 0 };
        const labels = playedSongsRes.data?.data?.labels || [4];
        const values = playedSongsRes.data?.data?.data || [4];

        setStats(statsData);
        setPlayedSongsData({ labels, data: values });
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let length = Number(stats.songs.toString())
  // Chart Configuration
const chartConfig = {
    labels: Array.from({length }, (_, i) => `Song ${i + 1}`),
    datasets: [
        {
            label: 'Total Plays',
            data: Array.from({ length }, () => Math.floor(Math.random() * 100) + 1),
            backgroundColor: '#4cc43e',
            // borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 1,
            // barPercentage: 0.5,
            // categoryPercentage: 0.5,
            // borderRadius: 5,
            // hoverBackgroundColor: '#ff4f5e',
            // hoverBorderColor: 'rgba(76, 175, 80, 1)',

        },
    ],
};

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Top Played Songs',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Users" count={stats.users ?? 0} color="bg-blue-500" />
        <StatCard title="Songs" count={stats.songs ?? 0} color="bg-green-500" />
        <StatCard title="Albums" count={stats.albums ?? 0} color="bg-purple-500" />
      </div>

      {/* Top Played Songs Chart */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <Bar data={chartConfig} options={options} />
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, count, color }) => (
  <div className={`rounded-lg shadow-md p-6 text-white ${color}`}>
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-3xl font-bold mt-2">{count}</p>
  </div>
);

export default Statatics;
