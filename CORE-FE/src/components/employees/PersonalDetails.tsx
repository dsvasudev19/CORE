import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';

interface Department {
  id: number;
  name: string;
}

interface Designation {
  id: number;
  title: string;
}

 // Removed Team interface

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
}

interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  department: Department | null;
  designation: Designation | null;
  // team: Team | null; // Removed team field
  manager: Manager | null;
}

interface PersonalDetailsProps {
  setSavedEmployee: (data: Employee) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ setSavedEmployee }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  // Removed teams state
  const [managers, setManagers] = useState<Manager[]>([]);
  const [formData, setFormData] = useState<Employee>({
    firstName: '', lastName: '', email: '', phone: '', dob: '', address: '',
    emergencyContact: '', emergencyPhone: '',
    department: null,
    designation: null,
    // team: null, // Removed team initialization
    manager: null,
  });
    useEffect(() => {
      fetchDepartments();
      fetchDesignations();
      fetchManagers();
    }, []);
    // Removed fetchTeams function

    const fetchManagers = async () => {
      try {
        const res = await axiosInstance.get('/employees', { params: { organizationId: 1, page: 0, size: 100 } });
        const pageData = res.data?.data;
        setManagers(pageData?.content || []);
      } catch {
        // Optionally handle error
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get('/department', { params: { organizationId: 1 } });
        setDepartments(res.data || []);
      } catch {
        // Optionally handle error
      }
    };

    const fetchDesignations = async () => {
      try {
        const res = await axiosInstance.get('/designation', { params: { organizationId: 1 } });
        setDesignations(res.data || []);
      } catch {
        // Optionally handle error
      }
    };
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'department') {
      const dept = departments.find(d => d.id === Number(value));
      setFormData(prev => ({ ...prev, department: dept || null }));
    } else if (name === 'designation') {
      const desig = designations.find(d => d.id === Number(value));
      setFormData(prev => ({ ...prev, designation: desig || null }));
    // Removed team select logic
    } else if (name === 'manager') {
      const manager = managers.find(m => m.id === Number(value));
      setFormData(prev => ({ ...prev, manager: manager || null }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const response = await axiosInstance.post('/employees', formData);
      setSavedEmployee(response.data);
      // Optionally show success message or move to next step
    } catch {
      setSaveError('Failed to save personal details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="space-y-8">
        {/* Personal Details Section */}
        <div className="card p-4 mb-4 bg-white border border-steel-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-burgundy-700 mb-4">Personal Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">First Name <span className="text-danger-600">*</span></label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500" placeholder="John" />
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">Last Name <span className="text-danger-600">*</span></label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500" placeholder="Doe" />
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">Email <span className="text-danger-600">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500" placeholder="john.doe@email.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">Phone <span className="text-danger-600">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500" placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">Date of Birth <span className="text-danger-600">*</span></label>
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">Emergency Contact Name</label>
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">Emergency Contact Phone</label>
              <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500" placeholder="+1 (555) 987-6543" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-steel-700 mb-1">Address</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500" placeholder="Full residential address" />
            </div>
          </div>
        </div>

        {/* Team Assignment Section */}
        <div className="card p-4 bg-white border border-steel-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-burgundy-700 mb-4">Team Assignment</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">Department <span className="text-danger-600">*</span></label>
              <select
                name="department"
                value={formData.department?.id || ""}
                onChange={(e) => {
                  const dept = departments.find(d => d.id === Number(e.target.value));
                  setFormData(prev => ({ ...prev, department: dept || null }));
                }}
                className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            {/* Team field removed */}
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">Designation <span className="text-danger-600">*</span></label>
              <select
                name="designation"
                value={formData.designation?.id || ""}
                onChange={(e) => {
                  const desig = designations.find(d => d.id === Number(e.target.value));
                  setFormData(prev => ({ ...prev, designation: desig || null }));
                }}
                className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="">Select Designation</option>
                {designations.map(desig => (
                  <option key={desig.id} value={desig.id}>{desig.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">Reporting Manager <span className="text-danger-600">(Optional)</span></label>
              <select
                name="manager"
                value={formData.manager?.id || ""}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="">Select Manager</option>
                {managers.map(manager => (
                  <option key={manager.id} value={manager.id}>{manager.firstName} {manager.lastName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Personal Details'}
        </button>
        {saveError && <span className="text-xs text-danger-600 ml-2">{saveError}</span>}
      </div>
    </div>
  );
};

export default PersonalDetails;