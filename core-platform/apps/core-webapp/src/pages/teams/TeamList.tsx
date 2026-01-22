import React, { useState, useEffect } from 'react';
import { Plus, Users, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import ConfirmDialog from '../../components/ConfirmDialog';
import toast from 'react-hot-toast';
import { teamService } from '../../services/team.service';
import { departmentService } from '../../services/department.service';
import { employeeService } from '../../services/employee.service';
import { useAuth } from '../../contexts/AuthContext';

interface Department {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

interface Team {
  id: number;
  name: string;
  description?: string;
  department?: Department;
  manager?: Employee;
}

interface Department {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

const TeamList: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [form, setForm] = useState<{ name: string; description: string; department: Department | null; manager: Employee | null }>({ name: '', description: '', department: null, manager: null });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    isOpen: confirmOpen,
    options: confirmOptions,
    confirm,
    handleConfirm,
    handleCancel
  } = useConfirmDialog();

  useEffect(() => {
    if (user?.organizationId) {
      fetchTeams();
      fetchDepartments();
      fetchEmployees();
    }
  }, [user?.organizationId]);

  const fetchDepartments = async () => {
    if (!user?.organizationId) return;
    try {
      const data = await departmentService.getAllDepartments(user.organizationId);
      setDepartments(data || []);
    } catch {
      toast.error('Failed to load departments');
    }
  };

  const fetchEmployees = async () => {
    if (!user?.organizationId) return;
    try {
      const data = await employeeService.getActiveEmployees(user.organizationId);
      setEmployees(data || []);
    } catch {
      toast.error('Failed to load employees');
    }
  };

  const fetchTeams = async () => {
    if (!user?.organizationId) return;
    setLoading(true);
    try {
      const data = await teamService.getAllTeams(user.organizationId);
      setTeams(data || []);
    } catch {
      console.error('Failed to fetch teams');
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.organizationId) {
      toast.error('Organization ID not found');
      return;
    }
    setSubmitting(true);
    const payload = {
      name: form.name,
      description: form.description,
      departmentId: form.department?.id || undefined,
      managerId: form.manager?.id || undefined,
      organizationId: user.organizationId
    };
    if (editTeam) {
      try {
        await teamService.updateTeam(editTeam.id, payload);
        toast.success('Team updated successfully');
        fetchTeams();
        setShowModal(false);
      } catch {
        toast.error('Failed to update team');
      } finally {
        setSubmitting(false);
      }
    } else {
      try {
        await teamService.createTeam(payload);
        toast.success('Team added successfully');
        fetchTeams();
        setShowModal(false);
      } catch {
        toast.error('Failed to add team');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Delete Team',
      message: 'Are you sure you want to delete this team?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!confirmed) return;
    setSubmitting(true);
    try {
      await teamService.deleteTeam(id);
      toast.success('Team Deleted Successfully');
      fetchTeams();
    } catch {
      // Optionally show a toast/snackbar here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Users size={22} /> Teams
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setShowModal(true);
                  setEditTeam(null);
                  setForm({ name: '', description: '', department: null, manager: null });
                }}
                className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus size={18} />
                New Team
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
        ) : filteredTeams.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            No teams found.
          </div>
        ) : (
          <table className="w-full text-sm bg-white rounded-lg border border-slate-200 shadow-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Description</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Department</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Manager</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeams.map(team => (
                <tr key={team.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{team.name}</td>
                  <td className="px-4 py-3 text-slate-600">{team.description || '-'}</td>
                  <td className="px-4 py-3 text-slate-700">{team.department?.name || '-'}</td>
                  <td className="px-4 py-3 text-slate-700">{team.manager ? `${team.manager.firstName} ${team.manager.lastName}` : '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setEditTeam(team);
                        setShowModal(true);
                        setForm({
                          name: team.name,
                          description: team.description || '',
                          department: team.department || null,
                          manager: team.manager || null,
                        });
                      }}
                      className="p-1.5 hover:bg-slate-100 rounded-md"
                      title="Edit"
                    >
                      <Edit size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
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
            <h2 className="text-lg font-bold text-slate-900 mb-4">{editTeam ? 'Edit Team' : 'Add Team'}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department <span className="text-red-600">*</span></label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={form.department?.id || ''}
                  onChange={e => {
                    const dept = departments.find(d => d.id === Number(e.target.value));
                    setForm(f => ({ ...f, department: dept || null }));
                  }}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manager <span className="text-red-600">*</span></label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={form.manager?.id || ''}
                  onChange={e => {
                    const emp = employees.find(emp => emp.id === Number(e.target.value));
                    setForm(f => ({ ...f, manager: emp || null }));
                  }}
                  required
                >
                  <option value="">Select Manager</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
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
                  {editTeam ? 'Update' : 'Add'}
                </button>
                <button type="button" className="px-4 py-2 border border-slate-300 rounded-md font-medium hover:bg-slate-50" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog {...confirmOptions} isOpen={confirmOpen} onConfirm={handleConfirm} onClose={handleCancel} />
    </div>
  );
};

export default TeamList;
