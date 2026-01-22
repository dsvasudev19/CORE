// components/onboarding/steps/Step4TeamAssignment.tsx
import React from 'react';
import { Users, User, Briefcase } from 'lucide-react';
import { type FormData } from '../../types/employee.types';

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TeamAssignment: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-steel-700 mb-1">
            Department <span className="text-danger-600">*</span>
          </label>
          <select name="department" value={formData.department} onChange={onChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500">
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
            <option value="Quality">Quality</option>
            <option value="HR">HR</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-steel-700 mb-1">
            Team <span className="text-danger-600">*</span>
          </label>
          <select name="team" value={formData.team} onChange={onChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500">
            <option value="">Select Team</option>
            <option value="Core Platform">Core Platform</option>
            <option value="Mobile Apps">Mobile Apps</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="API Team">API Team</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-steel-700 mb-1">
            Designation <span className="text-danger-600">*</span>
          </label>
          <select name="designation" value={formData.designation} onChange={onChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500">
            <option value="">Select Designation</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Mid-level Developer">Mid-level Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Team Lead">Team Lead</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-steel-700 mb-1">
            Reporting Manager <span className="text-danger-600">*</span>
          </label>
          <select name="manager" value={formData.manager} onChange={onChange} className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500">
            <option value="">Select Manager</option>
            <option value="James Rodriguez">James Rodriguez</option>
            <option value="Sarah Chen">Sarah Chen</option>
            <option value="Michael Brown">Michael Brown</option>
            <option value="Lisa Wang">Lisa Wang</option>
          </select>
        </div>
      </div>

      <div className="card-compact bg-navy-50 border-navy-200">
        <h4 className="text-sm font-semibold text-navy-900 mb-2">Team Structure Preview</h4>
        <div className="space-y-2 text-xs text-navy-800">
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>Team: Core Platform (8 members)</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>Reports to: James Rodriguez (Team Lead)</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={14} />
            <span>Department: Engineering</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAssignment;