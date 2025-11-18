'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Building2, Globe, MapPin, Briefcase, Flag, FileText, 
  Users, Edit, Archive, CheckCircle, Phone, Mail, User, Crown,
  Calendar, Download, Eye, Trash2, Plus, Loader2, AlertCircle, X
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Document upload
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docForm, setDocForm] = useState({
    title: '',
    category: 'General',
    description: '',
    file: null as File | null
  });

  // Representative form
  const [showAddRep, setShowAddRep] = useState(false);
  const [repForm, setRepForm] = useState({
    role: '',
    primaryContact: false,
    contact: { name: '', email: '', phone: '', designation: '', department: '' }
  });

  const organizationId = 1; // TODO: from auth context

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get(`/client/${id}/detailed`);
      setClient(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load client');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const endpoint = client.status === 'ACTIVE' ? 'deactivate' : 'activate';
      await axiosInstance.patch(`/client/${id}/${endpoint}`);
      setClient({ ...client, status: client.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleUploadDocument = async () => {
    if (!docForm.file) return alert('Please select a file');
    if (!docForm.title.trim()) return alert('Title is required');

    setUploading(true);
    const formData = new FormData();
    formData.append('file', docForm.file);
    formData.append('title', docForm.title);
    formData.append('category', docForm.category);
    if (docForm.description) formData.append('description', docForm.description);

    try {
      const res = await axiosInstance.post(`/client/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setClient({
        ...client,
        documents: [...client.documents, res.data]
      });

      setDocForm({ title: '', category: 'General', description: '', file: null });
      setShowAddDocument(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm('Delete this document?')) return;

    try {
      await axiosInstance.delete(`/client/${id}/documents/${docId}`);
      setClient({
        ...client,
        documents: client.documents.filter((d: any) => d.id !== docId)
      });
    } catch (err: any) {
      alert('Failed to delete document');
    }
  };

  const handleAddRepresentative = async () => {
    const c = repForm.contact;
    if (!c.name.trim()) return alert('Name required');
    if (!c.email.trim()) return alert('Email required');
    if (!repForm.role.trim()) return alert('Role required');

    try {
      // Create contact first
      const contactRes = await axiosInstance.post('/contacts', {
        name: c.name,
        email: c.email,
        phone: c.phone || null,
        designation: c.designation || null,
        department: c.department || null,
        type: 'CLIENT',
        organizationId
      });

      // Link as representative
      const repRes = await axiosInstance.post(`/client-representatives`, {
        clientId:id,
        contactId: contactRes.data.id,
        role: repForm.role,
        primaryContact: repForm.primaryContact
      });

      setClient({
        ...client,
        representatives: [...client.representatives, repRes.data]
      });

      setRepForm({
        role: '',
        primaryContact: false,
        contact: { name: '', email: '', phone: '', designation: '', department: '' }
      });
      setShowAddRep(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add representative');
    }
  };

  const handleRemoveRepresentative = async (repId: number) => {
    if (!confirm('Remove this representative?')) return;

    try {
      await axiosInstance.delete(`/clients/${id}/representatives/${repId}`);
      setClient({
        ...client,
        representatives: client.representatives.filter((r: any) => r.id !== repId)
      });
    } catch (err: any) {
      alert('Failed to remove representative');
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'ACTIVE') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'INACTIVE') return 'bg-slate-50 text-slate-600 border-slate-200';
    if (status === 'PENDING') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getCategoryColor = (category: string) => {
    const map: any = {
      'Contract': 'bg-blue-50 text-blue-700 border-blue-200',
      'Legal': 'bg-purple-50 text-purple-700 border-purple-200',
      'Statement of Work': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'General': 'bg-slate-50 text-slate-700 border-slate-200'
    };
    return map[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-red-900" size={48} />
          <p className="text-slate-600 mt-4">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Client not found</h2>
          <p className="text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-md">
                <ArrowLeft size={20} className="text-slate-600" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">{client.name}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                      {client.code}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                      {client.status === 'ACTIVE' && <CheckCircle size={12} />}
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/clients/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 text-sm font-medium"
              >
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={handleStatusToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                  client.status === 'ACTIVE'
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {client.status === 'ACTIVE' ? <Archive size={16} /> : <CheckCircle size={16} />}
                {client.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex gap-1">
            {['overview', 'documents', 'representatives'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-red-900 text-red-900'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'documents' ? client.documents.length : client.representatives.length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                <h2 className="text-lg font-semibold text-slate-900 mb-5">Client Information</h2>
                <div className="grid grid-cols-2 gap-5">
                  <div><label className="text-xs font-semibold text-slate-600 uppercase">Industry</label><div className="mt-1 flex items-center gap-2"><Briefcase size={16} className="text-slate-400" />{client.industry}</div></div>
                  <div><label className="text-xs font-semibold text-slate-600 uppercase">Country</label><div className="mt-1 flex items-center gap-2"><Flag size={16} className="text-slate-400" />{client.country}</div></div>
                  <div><label className="text-xs font-semibold text-slate-600 uppercase">Domain</label><div className="mt-1 flex items-center gap-2"><Globe size={16} className="text-slate-400" />{client.domain ? <a href={`https://${client.domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:underline">{client.domain}</a> : '—'}</div></div>
                  <div><label className="text-xs font-semibold text-slate-600 uppercase">Address</label><div className="mt-1 flex items-start gap-2"><MapPin size={16} className="text-slate-400 mt-0.5" /><span className="text-sm">{client.address || '—'}</span></div></div>
                  <div className="col-span-2"><label className="text-xs font-semibold text-slate-600 uppercase">Description</label><p className="mt-1 text-slate-700 text-sm leading-relaxed">{client.description || 'No description'}</p></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <FileText size={32} className="mx-auto text-blue-700 mb-2" />
                  <div className="text-2xl font-bold">{client.documents.length}</div>
                  <div className="text-xs text-slate-600">Documents</div>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <Users size={32} className="mx-auto text-purple-700 mb-2" />
                  <div className="text-2xl font-bold">{client.representatives.length}</div>
                  <div className="text-xs text-slate-600">Representatives</div>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <CheckCircle size={32} className="mx-auto text-emerald-700 mb-2" />
                  <div className="text-2xl font-bold">{client.status}</div>
                  <div className="text-xs text-slate-600">Status</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-4">Primary Contact</h2>
                {client.representatives.find((r: any) => r.primaryContact) ? (
                  (() => {
                    const primary = client.representatives.find((r: any) => r.primaryContact);
                    return (
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center text-white font-semibold">
                            {primary.contact.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold">{primary.contact.name}</div>
                            <div className="text-xs text-slate-600">{primary.contact.designation}</div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2"><Mail size={14} /><a href={`mailto:${primary.contact.email}`} className="hover:text-blue-900">{primary.contact.email}</a></div>
                          <div className="flex items-center gap-2"><Phone size={14} />{primary.contact.phone}</div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-sm text-slate-500">No primary contact</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Documents</h2>
              <button onClick={() => setShowAddDocument(true)} className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-md text-sm hover:bg-red-800">
                <Plus size={16} /> Add Document
              </button>
            </div>

            {showAddDocument && (
              <div className="mb-6 p-4 bg-slate-50 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Title *" value={docForm.title} onChange={e => setDocForm({...docForm, title: e.target.value})} className="px-3 py-2 border rounded-md" />
                  <select value={docForm.category} onChange={e => setDocForm({...docForm, category: e.target.value})} className="px-3 py-2 border rounded-md">
                    {['Contract', 'Legal', 'Statement of Work', 'General', 'Proposal', 'Invoice', 'Report', 'Presentation', 'Agreement'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <textarea placeholder="Description" value={docForm.description} onChange={e => setDocForm({...docForm, description: e.target.value})} rows={2} className="col-span-2 px-3 py-2 border rounded-md" />
                  <input type="file" onChange={e => setDocForm({...docForm, file: e.target.files?.[0] || null})} className="col-span-2" />
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleUploadDocument} disabled={uploading} className="px-4 py-2 bg-red-900 text-white rounded-md disabled:opacity-50">
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button onClick={() => setShowAddDocument(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {client.documents.map((doc: any) => (
                <div key={doc.id} className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <FileText size={40} className="text-blue-700" />
                    <div>
                      <h3 className="font-semibold">{doc.title}</h3>
                      <p className="text-sm text-slate-600">{doc.description || 'No description'}</p>
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className={`px-2 py-1 rounded-full border ${getCategoryColor(doc.category)}`}>{doc.category}</span>
                        <span className="text-slate-500"><Calendar size={12} className="inline mr-1" />{formatDate(doc.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`${import.meta.env.VITE_API_BASE}/uploads/clients/${id}/${doc.fileId}`} target="_blank" className="p-2 hover:bg-blue-50 rounded-md"><Download size={16} className="text-blue-700" /></a>
                    <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 hover:bg-red-50 rounded-md"><Trash2 size={16} className="text-red-600" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'representatives' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Representatives</h2>
              <button onClick={() => setShowAddRep(true)} className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-md text-sm hover:bg-red-800">
                <Plus size={16} /> Add Representative
              </button>
            </div>

            {showAddRep && (
              <div className="mb-6 p-4 bg-slate-50 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Full Name *" value={repForm.contact.name} onChange={e => setRepForm({...repForm, contact: {...repForm.contact, name: e.target.value}})} className="px-3 py-2 border rounded-md" />
                  <input placeholder="Email *" value={repForm.contact.email} onChange={e => setRepForm({...repForm, contact: {...repForm.contact, email: e.target.value}})} className="px-3 py-2 border rounded-md" />
                  <input placeholder="Phone" value={repForm.contact.phone} onChange={e => setRepForm({...repForm, contact: {...repForm.contact, phone: e.target.value}})} className="px-3 py-2 border rounded-md" />
                  <input placeholder="Role *" value={repForm.role} onChange={e => setRepForm({...repForm, role: e.target.value})} className="px-3 py-2 border rounded-md" />
                  <input placeholder="Title" value={repForm.contact.designation} onChange={e => setRepForm({...repForm, contact: {...repForm.contact, designation: e.target.value}})} className="px-3 py-2 border rounded-md" />
                  <input placeholder="Department" value={repForm.contact.department} onChange={e => setRepForm({...repForm, contact: {...repForm.contact, department: e.target.value}})} className="px-3 py-2 border rounded-md" />
                  <label className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" checked={repForm.primaryContact} onChange={e => setRepForm({...repForm, primaryContact: e.target.checked})} />
                    <span>Set as Primary Contact</span>
                  </label>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleAddRepresentative} className="px-4 py-2 bg-red-900 text-white rounded-md">Add</button>
                  <button onClick={() => setShowAddRep(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {client.representatives.map((rep: any) => (
                <div key={rep.id} className="bg-white border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center text-white font-semibold text-lg">
                        {rep.contact.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {rep.contact.name}
                          {rep.primaryContact && <Crown size={16} className="text-amber-500" />}
                        </div>
                        <div className="text-sm text-slate-600">{rep.role}</div>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveRepresentative(rep.id)} className="p-2 hover:bg-red-50 rounded-md">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><Mail size={14} /><a href={`mailto:${rep.contact.email}`} className="hover:text-blue-900">{rep.contact.email}</a></div>
                    <div className="flex items-center gap-2"><Phone size={14} />{rep.contact.phone}</div>
                    <div className="flex items-center gap-2"><User size={14} />{rep.contact.department}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetailsPage;