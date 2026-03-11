import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Line, Bar } from 'react-chartjs-2';
import { Upload, AlertTriangle, CheckCircle, Activity, FileText } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { backendUrl, token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [liveResult, setLiveResult] = useState(null);

  // Theme configuration for charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#cbd5e1', borderColor: '#334155', borderWidth: 1 }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155', drawBorder: false } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155', drawBorder: false } }
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/anomaly/history`);
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('dataset', selectedFile);

    setUploading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLiveResult(data);
      setSelectedFile(null);
      fetchHistory(); // Refresh table
    } catch (error) {
      alert(error.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  // Prepare chart data from latest anomaly
  let chartData = null;
  if (history.length > 0) {
    const latest = history[0];
    chartData = {
      labels: ['Normal Points', 'Anomalous Points'],
      datasets: [
        {
          label: latest.datasetName,
          data: [latest.totalPoints - latest.anomaliesDetected, latest.anomaliesDetected],
          backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(239, 68, 68, 0.6)'],
          borderColor: ['#10b981', '#ef4444'],
          borderWidth: 1,
        },
      ],
    };
  }

  // Monthly aggregated (mock representation based on history count and totals)
  let trendData = {
    labels: history.slice(0, 5).map(h => new Date(h.createdAt).toLocaleDateString()).reverse(),
    datasets: [{
      label: 'Anomalies Detected',
      data: history.slice(0, 5).map(h => h.anomaliesDetected).reverse(),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time analysis and historical anomaly tracking</p>
        </div>

        {/* Upload Widget */}
        <form onSubmit={handleUpload} className="flex items-center gap-3 bg-surface p-2 rounded-xl border border-gray-700">
          <input 
            type="file" 
            accept=".csv,.json"
            onChange={handleFileChange}
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
          />
          <button 
            type="submit" 
            disabled={!selectedFile || uploading}
            className="flex items-center gap-2 bg-primary hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all shadow-lg"
          >
            {uploading ? <Activity className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{uploading ? 'Processing...' : 'Upload'}</span>
          </button>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-2xl border-l-4 border-l-primary hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Datasets Analyzed</p>
              <h3 className="text-3xl font-bold text-white mt-1">{history.length}</h3>
            </div>
            <div className="p-3 bg-primary/20 rounded-xl">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="glass p-5 rounded-2xl border-l-4 border-l-danger hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Anomalies Detected</p>
              <h3 className="text-3xl font-bold text-danger mt-1">
                {history.reduce((acc, curr) => acc + curr.anomaliesDetected, 0)}
              </h3>
            </div>
            <div className="p-3 bg-danger/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-danger" />
            </div>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border-l-4 border-l-accent hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">System Status</p>
              <h3 className="text-xl font-bold text-accent mt-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Operational
              </h3>
            </div>
            <div className="p-3 bg-accent/20 rounded-xl">
              <Activity className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Result Alert */}
      {liveResult && (
        <div className="bg-surface border border-primary/50 p-4 rounded-xl flex items-start gap-4">
          <div className="p-2 bg-primary/20 rounded-full text-primary mt-1">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-medium">{liveResult.message}</h4>
            <p className="text-sm text-gray-400 mt-1">
              Detected {liveResult.results.anomalies_detected} anomalies out of {liveResult.results.total_points} data points.
            </p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-5 rounded-2xl h-96">
          <h3 className="text-lg font-medium text-white mb-4">Latest Scan Results</h3>
          {chartData ? (
            <div className="h-72"><Bar data={chartData} options={chartOptions} /></div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
          )}
        </div>

        <div className="glass p-5 rounded-2xl h-96">
          <h3 className="text-lg font-medium text-white mb-4">Anomaly Trend</h3>
          {history.length > 0 ? (
            <div className="h-72"><Line data={trendData} options={chartOptions} /></div>
          ) : (
             <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-medium text-white">Recent Analysis History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-surface/50 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Dataset</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Algorithm</th>
                <th className="px-6 py-4 font-medium">Total Points</th>
                <th className="px-6 py-4 font-medium">Anomalies</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No history found. Upload a dataset to begin.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item._id} className="hover:bg-surface/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.datasetName}</td>
                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded-md text-xs">
                        {item.algorithmUsed}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.totalPoints}</td>
                    <td className="px-6 py-4">
                      {item.anomaliesDetected > 0 ? (
                        <span className="text-danger flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {item.anomaliesDetected}
                        </span>
                      ) : (
                        <span className="text-accent flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> 0
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.anomaliesDetected > 0 ? (
                         <span className="bg-danger/10 text-danger border border-danger/20 px-2 py-1 rounded-full text-xs">Anomalous</span>
                      ) : (
                         <span className="bg-accent/10 text-accent border border-accent/20 px-2 py-1 rounded-full text-xs">Normal</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
