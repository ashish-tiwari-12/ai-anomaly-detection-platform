import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Activity, FileText, Ban, Trash2, CheckCircle } from 'lucide-react';

const AdminPanel = () => {
  const { backendUrl, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // users or logs

  const fetchData = async () => {
    try {
      const [usersRes, logsRes, statsRes] = await Promise.all([
        axios.get(`${backendUrl}/admin/users`),
        axios.get(`${backendUrl}/admin/logs`),
        axios.get(`${backendUrl}/admin/stats`)
      ]);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBlockToggle = async (id, isBlocked) => {
    if (window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user?`)) {
      try {
        await axios.put(`${backendUrl}/admin/users/${id}/block`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error updating user status');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you certain? This action cannot be undone.')) {
      try {
        await axios.delete(`${backendUrl}/admin/users/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Console</h1>
          <p className="text-gray-400 mt-1">Platform management and audit logs</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass p-5 rounded-2xl border-t-4 border-t-primary">
            <h3 className="text-gray-400 text-sm font-medium">Platform Users</h3>
            <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
          </div>
          <div className="glass p-5 rounded-2xl border-t-4 border-t-accent">
            <h3 className="text-gray-400 text-sm font-medium">System Logs</h3>
            <p className="text-3xl font-bold text-white mt-1">{stats.totalLogs}</p>
          </div>
          <div className="glass p-5 rounded-2xl border-t-4 border-t-purple-500">
            <h3 className="text-gray-400 text-sm font-medium">Anomalies Detected</h3>
            <p className="text-3xl font-bold text-white mt-1">{stats.anomalyStats?.totalAnomaliesDetected || 0}</p>
          </div>
          <div className="glass p-5 rounded-2xl border-t-4 border-t-orange-500">
            <h3 className="text-gray-400 text-sm font-medium">Points Analyzed</h3>
            <p className="text-3xl font-bold text-white mt-1">{stats.anomalyStats?.totalPointsAnalysed || 0}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
            }`}
          >
            <Users className="w-5 h-5" />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'logs' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
            }`}
          >
            <FileText className="w-5 h-5" />
            System Logs
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="glass rounded-2xl overflow-hidden min-h-[400px]">
        {activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-surface/50 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-surface/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4 capitalize">
                      <span className={`px-2 py-1 rounded-md text-xs border ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-gray-800 text-gray-300 border-gray-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.isBlocked ? (
                        <span className="text-danger flex items-center gap-1"><Ban className="w-3 h-3"/> Blocked</span>
                      ) : (
                        <span className="text-accent flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleBlockToggle(u._id, u.isBlocked)}
                            className={`p-2 rounded-lg transition-colors ${u.isBlocked ? 'bg-surface hover:bg-gray-700 text-white' : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400'}`}
                            title={u.isBlocked ? "Unblock User" : "Block User"}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-surface/50 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-surface/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">{log.userId?.name || log.adminId?.name || 'System'}</td>
                    <td className="px-6 py-4 font-medium text-white">
                      <span className="bg-surface border border-gray-700 px-2 py-1 rounded text-xs">{log.action}</span>
                    </td>
                    <td className="px-6 py-4">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
