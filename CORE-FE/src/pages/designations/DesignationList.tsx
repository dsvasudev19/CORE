import React, { useState, useEffect } from 'react';
import { Plus, Building2, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import axiosInstance from '../../axiosInstance';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import ConfirmDialog from '../../components/ConfirmDialog';

interface Designation {
  id: number;
  title: string;
  description?: string;
  code: string;
}

const DesignationList: React.FC = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDesig, setEditDesig] = useState<Designation | null>(null);
  const [form, setForm] = useState<{ title: string; description: string; code: string }>({ title: '', description: '', code: '' });
  const [submitting, setSubmitting] = useState(false);
  // TODO: Replace with actual orgId from context/auth
  const organizationId = 1;

  const {
    isOpen: confirmOpen,
    options: confirmOptions,
    confirm,
    handleConfirm,
    handleCancel
  } = useConfirmDialog();

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/designation`, { params: { organizationId } });
      setDesignations(res.data || []);
    } catch (err) {
      console.error('Failed to fetch designations', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDesignations = designations.filter(d =>
    d.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    d.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    (d.description || '').toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Delete Designation',
      message: 'Are you sure you want to delete this designation?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!confirmed) return;
    setSubmitting(true);
    try {
      await axiosInstance.delete(`/designation/${id}`);
      fetchDesignations();
    } catch (error) {
      // Optionally show a toast/snackbar here
    } finally {
      setSubmitting(false);
    }
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    if (editDesig) {
      axiosInstance
        .put(`/designation/${editDesig.id}`, { ...form })
        .then(() => {
          fetchDesignations();
          setShowModal(false);
        })
        .catch(err => {
          alert('Failed to update designation');
          console.error(err);
        })
        .finally(() => setSubmitting(false));
    } else {
      axiosInstance
        .post(`/designation`, { ...form, organizationId })
        .then(() => {
          fetchDesignations();
          setShowModal(false);
        })
        .catch(err => {
          alert('Failed to add designation');
          console.error(err);
        })
        .finally(() => setSubmitting(false));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Building2 size={22} /> Designations
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search designations..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setShowModal(true);
                  setEditDesig(null);
                  setForm({ title: '', description: '', code: '' });
                }}
                className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus size={18} />
                New Designation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto py-6">
        {loading ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Loader2 className="mx-auto animate-spin text-red-900" size={32} />
          </div>
        ) : filteredDesignations.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            No designations found.
          </div>
        ) : (
          <table className="w-full text-sm bg-white rounded-lg border border-slate-200 shadow-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Description</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDesignations.map(desig => (
                <tr key={desig.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{desig.title}</td>
                  <td className="px-4 py-3 text-slate-700">{desig.code}</td>
                  <td className="px-4 py-3 text-slate-600">{desig.description || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setEditDesig(desig);
                        setShowModal(true);
                        setForm({ title: desig.title, description: desig.description || '', code: desig.code });
                      }}
                      className="p-1.5 hover:bg-slate-100 rounded-md"
                      title="Edit"
                    >
                      <Edit size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(desig.id)}
                      className="p-1.5 hover:bg-red-50 rounded-md ml-2"
                      title="Delete"
                      disabled={submitting}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal (Add/Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-slate-200 p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">{editDesig ? 'Edit Designation' : 'Add Designation'}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-red-900 text-white rounded-md font-medium hover:bg-red-800" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin inline-block mr-2" size={16} /> : null}
                  {editDesig ? 'Update' : 'Add'}
                </button>
                <button type="button" className="px-4 py-2 border border-slate-300 rounded-md font-medium hover:bg-slate-50" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={confirmOptions.title}
        message={confirmOptions.message}
        confirmText={confirmOptions.confirmText}
        cancelText={confirmOptions.cancelText}
        variant={confirmOptions.variant}
      />
    </div>
  );
};

export default DesignationList;
