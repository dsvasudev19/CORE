'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Plus, Mail, Phone, Crown, 
  AlertCircle, Building2, CheckCircle2, Loader2,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

interface CreatedRepresentative {
  id: number;
  contactId: number;
  role: string;
  primaryContact: boolean;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

const ClientAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const organizationId = 1; // TODO: from auth context

  // Client basic info
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    domain: '',
    address: '',
    country: '',
    industry: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'PENDING',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Representatives
  const [representatives, setRepresentatives] = useState<CreatedRepresentative[]>([]);
  const [showRepForm, setShowRepForm] = useState(false);
  const [repForm, setRepForm] = useState({
    role: '',
    primaryContact: false,
    contact: {
      name: '',
      email: '',
      phone: '',
      designation: '',
      department: ''
    }
  });

  const industries = ['Technology', 'Manufacturing', 'Financial Services', 'Healthcare', 'Energy', 'Retail', 'Construction', 'Logistics', 'Education', 'Agriculture', 'Fashion', 'Telecommunications', 'Real Estate', 'Hospitality', 'Media & Entertainment'];
  const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'Singapore', 'United Arab Emirates', 'India', 'Brazil', 'China', 'Japan', 'South Korea', 'Mexico', 'Italy', 'Spain'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Client name is required';
    if (!formData.code.trim()) newErrors.code = 'Client code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRepresentative = async () => {
    const c = repForm.contact;
    if (!c.name.trim()) return alert('Name is required');
    if (!c.email.trim()) return alert('Valid email is required');
    if (!repForm.role.trim()) return alert('Role is required');

    try {
      const contactRes = await axiosInstance.post('/contacts', {
        name: c.name,
        email: c.email,
        phone: c.phone || null,
        designation: c.designation || null,
        department: c.department || null,
        type: 'CLIENT',
        organizationId
      });

      const newRep: CreatedRepresentative = {
        id: Date.now(),
        contactId: contactRes.data.id,
        role: repForm.role,
        primaryContact: repForm.primaryContact,
        contact: { name: c.name, email: c.email, phone: c.phone }
      };

      if (repForm.primaryContact) {
        setRepresentatives(prev => prev.map(r => ({ ...r, primaryContact: false })));
      }

      setRepresentatives(prev => [...prev, newRep]);

      // Reset form
      setRepForm({
        role: '',
        primaryContact: false,
        contact: { name: '', email: '', phone: '', designation: '', department: '' }
      });
      setShowRepForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create contact');
    }
  };

  const removeRepresentative = (id: number) => {
    setRepresentatives(prev => prev.filter(r => r.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');

    try {
      const payload = {
        ...formData,
        organizationId,
        representatives: representatives.map(r => ({
          contactId: r.contactId,
          role: r.role,
          primaryContact: r.primaryContact
        }))
        // No documents here — will add on details page
      };

  const res = await axiosInstance.post('/client', payload);

      setSuccess(true);
      setTimeout(() => {
        navigate(`/a/clients/${res.data.id}`);
      }, 1500);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-md transition-colors">
                <ArrowLeft size={20} className="text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Create New Client</h1>
                <p className="text-sm text-slate-600 mt-0.5">You can add documents and more representatives later on the client details page</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Creating...</> : <><Save size={18} /> Create Client</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-[1400px] mx-auto px-6 mt-4">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center gap-2">
            <CheckCircle2 size={18} /> Client created successfully! Redirecting to details...
          </div>
        )}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertCircle size={18} /> {serverError}
          </div>
        )}
      </div>

      {/* Form */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Building2 size={20} /> Basic Information
              </h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Client Name <span className="text-red-600">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'}`} placeholder="Enter client name" />
                {errors.name && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Client Code <span className="text-red-600">*</span></label>
                <input type="text" name="code" value={formData.code} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 font-mono ${errors.code ? 'border-red-300 bg-red-50' : 'border-slate-300'}`} placeholder="e.g., ACM001" />
                {errors.code && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.code}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry <span className="text-red-600">*</span></label>
                <select name="industry" value={formData.industry} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 ${errors.industry ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}>
                  <option value="">Select industry</option>
                  {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Country <span className="text-red-600">*</span></label>
                <select name="country" value={formData.country} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 ${errors.country ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}>
                  <option value="">Select country</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Domain</label><input type="text" name="domain" value={formData.domain} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900" placeholder="example.com" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="PENDING">Pending</option></select></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label><input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900" placeholder="Enter complete address" /></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900" placeholder="Brief description of the client" /></div>
            </div>
          </div>

          {/* Representatives Section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Representatives (Optional)</h2>
              <button type="button" onClick={() => setShowRepForm(true)} className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                <Plus size={16} /> Add Representative
              </button>
            </div>
            <div className="p-5">
              {showRepForm && (
                <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label><input type="text" value={repForm.contact.name} onChange={e => setRepForm({...repForm, contact: {...repForm.contact, name: e.target.value}})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="John Doe" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label><input type="email" value={repForm.contact.email} onChange={e => setRepForm({...repForm, contact: {...repForm.contact, email: e.target.value}})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label><input type="tel" value={repForm.contact.phone} onChange={e => setRepForm({...repForm, contact: {...repForm.contact, phone: e.target.value}})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Role *</label><input type="text" value={repForm.role} onChange={e => setRepForm({...repForm, role: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="CEO, Account Manager" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label><input type="text" value={repForm.contact.designation} onChange={e => setRepForm({...repForm, contact: {...repForm.contact, designation: e.target.value}})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label><input type="text" value={repForm.contact.department} onChange={e => setRepForm({...repForm, contact: {...repForm.contact, department: e.target.value}})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" /></div>
                    <div className="col-span-2 flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={repForm.primaryContact} onChange={e => setRepForm({...repForm, primaryContact: e.target.checked})} className="w-4 h-4 text-red-900 border-slate-300 rounded" />
                        <span className="text-sm text-slate-700 flex items-center gap-1"><Crown size={14} className="text-amber-500" /> Set as Primary Contact</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleAddRepresentative} className="px-4 py-2 bg-blue-900 text-white rounded-md text-sm hover:bg-blue-800">
                      Add
                    </button>
                    <button type="button" onClick={() => setShowRepForm(false)} className="px-4 py-2 border border-slate-300 rounded-md text-sm hover:bg-slate-50">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {representatives.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No representatives added yet</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {representatives.map(rep => (
                    <div key={rep.id} className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center text-white font-semibold text-sm">
                            {rep.contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-slate-900 flex items-center gap-1">
                              {rep.contact.name}
                              {rep.primaryContact && <Crown size={12} className="text-amber-500" />}
                            </div>
                            <div className="text-xs text-slate-600">{rep.role}</div>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeRepresentative(rep.id)} className="p-1 hover:bg-red-50 rounded-md">
                          <Trash2 size={14} className="text-red-600" />
                        </button>
                      </div>
                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5"><Mail size={12} /> {rep.contact.email}</div>
                        {rep.contact.phone && <div className="flex items-center gap-1.5"><Phone size={12} /> {rep.contact.phone}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ClientAddPage;