'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Plus, Filter, Building2, Globe, MapPin, MoreVertical, Eye, Edit, Archive, 
  CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance'; // your axios with baseURL: '/api'

interface Client {
  id: number;
  name: string;
  code: string;
  domain: string | null;
  address: string | null;
  country: string;
  industry: string;
  status: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

const ClientListingPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const organizationId = 1; // TODO: Get from auth context

  // Fetch all clients on mount
  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get(`/client/organization/${organizationId}`);
      setClients(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load clients');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Apply filters (client-side for smooth UX)
  useEffect(() => {
    let filtered = [...clients];

    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(kw) ||
        c.code?.toLowerCase().includes(kw) ||
        c.industry?.toLowerCase().includes(kw) ||
        c.domain?.toLowerCase().includes(kw) ||
        c.country?.toLowerCase().includes(kw)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status?.toLowerCase() === filterStatus.toLowerCase());
    }

    setFilteredClients(filtered);
  }, [clients, searchKeyword, filterStatus]);

  // Activate / Deactivate
  const handleStatusChange = async (clientId: number, activate: boolean) => {
    try {
      const endpoint = activate ? `/clients/${clientId}/activate` : `/clients/${clientId}/deactivate`;
      await axiosInstance.patch(endpoint);
      
      setClients(prev => prev.map(c => 
        c.id === clientId ? { ...c, status: activate ? 'Active' : 'Inactive' } : c
      ));
      
      setActiveMenu(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'active') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'inactive') return 'bg-slate-50 text-slate-600 border-slate-200';
    if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900 whitespace-nowrap">Client Management</h1>
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                />
              </div>
              <button 
                onClick={() => navigate('/a/clients/add')}
                className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus size={18} />
                New Client
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mx-auto px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto py-4">
        {loading ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Loader2 className="mx-auto animate-spin text-red-900" size={32} />
            <p className="text-slate-600 mt-3">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Building2 size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No clients found</h3>
            <p className="text-slate-500 text-sm">
              {searchKeyword || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by creating your first client'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Client</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Code</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Industry</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Location</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Domain</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/a/clients/${client.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                          {client.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{client.name || 'N/A'}</div>
                          {client.description && (
                            <div className="text-xs text-slate-500 truncate max-w-xs">{client.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {client.code || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{client.industry || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-slate-700">
                        <MapPin size={14} className="text-slate-400" />
                        {client.country || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {client.domain ? (
                        <div className="flex items-center gap-1.5 text-sm text-blue-900">
                          <Globe size={14} />
                          <a 
                            href={`https://${client.domain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {client.domain}
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                        {client.status === 'Active' && <CheckCircle size={12} />}
                        {client.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <button
                          onClick={() => setActiveMenu(activeMenu === client.id ? null : client.id)}
                          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          <MoreVertical size={16} className="text-slate-600" />
                        </button>
                        
                        {activeMenu === client.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                            <div className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-md shadow-lg border border-slate-200 z-20">
                              <button
                                onClick={() => navigate(`/a/clients/${client.id}`)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                              >
                                <Eye size={14} /> View Details
                              </button>
                              <button
                                onClick={() => navigate(`/clients/${client.id}/edit`)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                              >
                                <Edit size={14} /> Edit
                              </button>
                              <div className="border-t border-slate-100"></div>
                              {client.status?.toLowerCase() === 'active' ? (
                                <button
                                  onClick={() => handleStatusChange(client.id, false)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors text-left"
                                >
                                  <Archive size={14} /> Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(client.id, true)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors text-left"
                                >
                                  <CheckCircle size={14} /> Activate
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
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

export default ClientListingPage;