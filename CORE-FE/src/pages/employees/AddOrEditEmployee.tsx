
import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  Shield,
  Award,
  Upload,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// Define interfaces for type safety
interface Employee {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  employeeId?: string;
  joiningDate?: string;
  designation?: string;
  department?: string;
  reportingTo?: string;
  employmentType?: string;
  location?: string;
  workSchedule?: string;
  role?: string;
  teams?: string[];
  skills?: string[];
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  employeeId: string;
  joiningDate: string;
  designation: string;
  department: string;
  reportingTo: string;
  employmentType: string;
  location: string;
  workSchedule: string;
  role: string;
  teams: string[];
  skills: string[];
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  employeeId?: string;
  joiningDate?: string;
  designation?: string;
  department?: string;
  role?: string;
}

interface AddEditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'add' | 'edit';
  employee?: Employee | null;
}

const AddEditEmployeeModal: React.FC<AddEditEmployeeModalProps> = ({
  isOpen,
  onClose,
  mode = 'add',
  employee = null,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    dob: employee?.dob || '',
    gender: employee?.gender || '',
    employeeId: employee?.employeeId || '',
    joiningDate: employee?.joiningDate || '',
    designation: employee?.designation || '',
    department: employee?.department || '',
    reportingTo: employee?.reportingTo || '',
    employmentType: employee?.employmentType || 'Full-time',
    location: employee?.location || '',
    workSchedule: employee?.workSchedule || '',
    role: employee?.role || '',
    teams: employee?.teams || [],
    skills: employee?.skills || [],
  });

  const [errors, setErrors] = useState<Errors>({});
  const [selectedSkills, setSelectedSkills] = useState<string[]>(formData.skills);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(formData.teams);

  const steps = [
    { number: 1, title: 'Basic Info', icon: User },
    { number: 2, title: 'Employment', icon: Briefcase },
    { number: 3, title: 'Access & Role', icon: Shield },
    { number: 4, title: 'Teams & Skills', icon: Award },
  ];

  const availableSkills = [
    'React',
    'Node.js',
    'Python',
    'Java',
    'AWS',
    'Docker',
    'Kubernetes',
    'TypeScript',
    'PostgreSQL',
    'MongoDB',
    'GraphQL',
    'Redis',
  ];
  const availableTeams = [
    'Core Platform',
    'Mobile Apps',
    'Infrastructure',
    'API Team',
    'Product Design',
    'QA Automation',
  ];
  const departments = ['Engineering', 'Design', 'Product', 'Quality', 'Data', 'DevOps', 'HR'];
  const designations = [
    'Junior Developer',
    'Mid-level Developer',
    'Senior Developer',
    'Team Lead',
    'Manager',
    'Director',
  ];
  const roles = ['Employee', 'Team Lead', 'Manager', 'Admin', 'HR Manager'];
  const managers = ['James Rodriguez', 'Sarah Chen', 'Michael Brown', 'Lisa Wang'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleTeam = (team: string) => {
    setSelectedTeams(prev =>
      prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
    );
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
    }

    if (step === 2) {
      if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
      if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
      if (!formData.designation) newErrors.designation = 'Designation is required';
      if (!formData.department) newErrors.department = 'Department is required';
    }

    if (step === 3) {
      if (!formData.role) newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      const finalData: FormData = {
        ...formData,
        skills: selectedSkills,
        teams: selectedTeams,
      };
      console.log('Submitting:', finalData);
      onClose();
    }
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="flex items-center gap-4 pb-4 border-b border-steel-200">
              <div className="w-20 h-20 rounded-lg bg-steel-100 flex items-center justify-center border-2 border-dashed border-steel-300">
                <Upload size={24} className="text-steel-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-steel-900">Profile Picture</p>
                <p className="text-xs text-steel-500 mt-0.5">JPG, PNG or GIF (Max 2MB)</p>
                <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium mt-1">
                  Upload Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  First Name <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 ${errors.firstName ? 'border-danger-500' : 'border-steel-300'
                    }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-xs text-danger-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Last Name <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 ${errors.lastName ? 'border-danger-500' : 'border-steel-300'
                    }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-xs text-danger-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Email <span className="text-danger-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 ${errors.email ? 'border-danger-500' : 'border-steel-300'
                    }`}
                  placeholder="john.doe@company.com"
                />
                {errors.email && (
                  <p className="text-xs text-danger-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Phone <span className="text-danger-600">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 ${errors.phone ? 'border-danger-500' : 'border-steel-300'
                    }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-xs text-danger-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Date of Birth <span className="text-danger-600">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 ${errors.dob ? 'border-danger-500' : 'border-steel-300'
                    }`}
                />
                {errors.dob && (
                  <p className="text-xs text-danger-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.dob}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Employee ID <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 ${errors.employeeId ? 'border-danger-500' : 'border-steel-300'
                    }`}
                  placeholder="EMP001"
                />
                {errors.employeeId && (
                  <p className="text-xs text-danger-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.employeeId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Joining Date <span className="text-danger-600">*</span>
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 ${errors.joiningDate ? 'border-danger-500' : 'border-steel-300'
                    }`}
                />
                {errors.joiningDate && (
                  <p className="text-xs text-danger-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.joiningDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Designation <span className="text-danger-600">*</span>
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 ${errors.designation ? 'border-danger-500' : 'border-steel-300'
                    }`}
                >
                  <option value="">Select Designation</option>
                  {designations.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.designation && (
                  <p className="text-xs text-danger-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.designation}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Department <span className="text-danger-600">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 ${errors.department ? 'border-danger-500' : 'border-steel-300'
                    }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-xs text-danger-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.department}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Reporting To
                </label>
                <select
                  name="reportingTo"
                  value={formData.reportingTo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                >
                  <option value="">Select Manager</option>
                  {managers.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Work Schedule
                </label>
                <input
                  type="text"
                  name="workSchedule"
                  value={formData.workSchedule}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="Mon-Fri, 9:00 AM - 6:00 PM"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="p-3 bg-navy-50 border border-navy-200 rounded flex items-start gap-2">
              <AlertCircle size={16} className="text-navy-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-navy-900">Access Control</p>
                <p className="text-xs text-navy-700 mt-0.5">
                  Role assignment determines what actions this employee can perform and what data they can access.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-steel-700 mb-1">
                System Role <span className="text-danger-600">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 ${errors.role ? 'border-danger-500' : 'border-steel-300'
                  }`}
              >
                <option value="">Select Role</option>
                {roles.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-xs text-danger-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.role}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 border border-steel-200 rounded">
                <h4 className="text-xs font-semibold text-steel-900 mb-2">Role Permissions Preview</h4>
                <ul className="space-y-1.5 text-xs text-steel-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-success-600" />
                    View assigned projects
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-success-600" />
                    Create & update tasks
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-success-600" />
                    Submit time logs
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-success-600" />
                    Upload documents
                  </li>
                </ul>
              </div>

              <div className="p-3 border border-steel-200 rounded">
                <h4 className="text-xs font-semibold text-steel-900 mb-2">Data Access Scope</h4>
                <ul className="space-y-1.5 text-xs text-steel-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-success-600" />
                    Own organization data only
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-success-600" />
                    Assigned team projects
                  </li>
                  <li className="flex items-center gap-1.5">
                    <X size={12} className="text-steel-400" />
                    Other teams' data
                  </li>
                  <li className="flex items-center gap-1.5">
                    <X size={12} className="text-steel-400" />
                    HR & admin functions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {/* Teams Selection */}
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-2">
                Assign to Teams
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableTeams.map(team => (
                  <button
                    key={team}
                    type="button"
                    onClick={() => toggleTeam(team)}
                    className={`px-3 py-2 text-xs font-medium rounded border transition-colors ${selectedTeams.includes(team)
                        ? 'bg-burgundy-50 text-burgundy-700 border-burgundy-300'
                        : 'bg-white text-steel-700 border-steel-300 hover:border-burgundy-300'
                      }`}
                  >
                    {team}
                  </button>
                ))}
              </div>
              <p className="text-xs text-steel-500 mt-2">
                {selectedTeams.length} team(s) selected
              </p>
            </div>

            {/* Skills Selection */}
            <div>
              <label className="block text-xs font-medium text-steel-700 mb-2">
                Skills & Technologies
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded border transition-colors ${selectedSkills.includes(skill)
                        ? 'bg-navy-50 text-navy-700 border-navy-300'
                        : 'bg-white text-steel-700 border-steel-300 hover:border-navy-300'
                      }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <p className="text-xs text-steel-500 mt-2">
                {selectedSkills.length} skill(s) selected
              </p>
            </div>

            {/* Summary */}
            <div className="p-3 bg-success-50 border border-success-200 rounded">
              <h4 className="text-xs font-semibold text-success-900 mb-2 flex items-center gap-1.5">
                <CheckCircle size={14} />
                Ready to {mode === 'add' ? 'Create' : 'Update'} Employee
              </h4>
              <p className="text-xs text-success-800">
                Review the information and click "{mode === 'add' ? 'Create' : 'Update'} Employee" to{' '}
                {mode === 'add' ? 'add this employee to your organization' : 'update the employee profile'}.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-steel-200">
          <div>
            <h2 className="text-lg font-bold text-steel-900">
              {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
            </h2>
            <p className="text-xs text-steel-500 mt-0.5">
              Fill in the details to {mode === 'add' ? 'create' : 'update'} employee profile
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-steel-600" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-steel-200 bg-steel-50">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === step.number;
              const isCompleted = activeStep > step.number;

              return (
                <React.Fragment key={step.number}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${isCompleted
                          ? 'bg-success-500 text-white'
                          : isActive
                            ? 'bg-burgundy-600 text-white'
                            : 'bg-steel-200 text-steel-500'
                        }`}
                    >
                      {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${isActive ? 'text-burgundy-700' : 'text-steel-600'}`}>
                        Step {step.number}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-burgundy-900 font-semibold' : 'text-steel-500'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 ${isCompleted ? 'bg-success-500' : 'bg-steel-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-steel-200 bg-steel-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-steel-700 hover:bg-steel-100 rounded transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded hover:bg-steel-50 transition-colors"
              >
                Back
              </button>
            )}
            {activeStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-success-600 rounded hover:bg-success-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle size={16} />
                {mode === 'add' ? 'Create Employee' : 'Update Employee'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper to show the modal
const EmployeeModalDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold text-steel-900 mb-6">Employee Modal Demo</h1>

        <div className="bg-white rounded-lg border border-steel-200 p-6">
          <h2 className="text-lg font-semibold text-steel-900 mb-4">Test Modal</h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setMode('add');
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 transition-colors"
            >
              Add New Employee
            </button>
            <button
              onClick={() => {
                setMode('edit');
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-sm font-medium text-burgundy-700 bg-burgundy-50 border border-burgundy-200 rounded hover:bg-burgundy-100 transition-colors"
            >
              Edit Employee
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-navy-50 border border-navy-200 rounded">
          <h3 className="text-sm font-semibold text-navy-900 mb-2">Features Included:</h3>
          <ul className="text-xs text-navy-800 space-y-1">
            <li>✓ 4-step wizard with progress indicator</li>
            <li>✓ Form validation with error messages</li>
            <li>✓ Multi-select for teams and skills</li>
            <li>✓ Role-based access preview</li>
            <li>✓ Responsive design with executive styling</li>
            <li>✓ Add/Edit mode support</li>
          </ul>
        </div>
      </div>

      <AddEditEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={mode}
        employee={
          mode === 'edit'
            ? {
              firstName: 'Sarah',
              lastName: 'Mitchell',
              email: 's.mitchell@company.com',
              phone: '+1 (555) 123-4567',
              dob: '1992-05-12',
              gender: 'Female',
              employeeId: 'EMP001',
              joiningDate: '2022-03-15',
              designation: 'Senior Developer',
              department: 'Engineering',
              reportingTo: 'James Rodriguez',
              employmentType: 'Full-time',
              location: 'San Francisco, CA',
              workSchedule: 'Mon-Fri, 9:00 AM - 6:00 PM',
              role: 'Employee',
              teams: ['Core Platform', 'Mobile Apps'],
              skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
            }
            : null
        }
      />
    </div>
  );
};

// Inject custom styles
const style = document.createElement('style');
style.textContent = `
  .bg-burgundy-50 { background-color: #FDF2F5; }
  .bg-burgundy-600 { background-color: #8B1538; }
  .bg-burgundy-700 { background-color: #6B0E2A; }
  .text-burgundy-600 { color: #8B1538; }
  .text-burgundy-700 { color: #6B0E2A; }
  .text-burgundy-900 { color: #330714; }
  .border-burgundy-200 { border-color: #F9C9D5; }
  .border-burgundy-300 { border-color: #F5A3B8; }
  .hover\\:bg-burgundy-100:hover { background-color: #FCE4EA; }
  .hover\\:bg-burgundy-700:hover { background-color: #6B0E2A; }
  .hover\\:border-burgundy-300:hover { border-color: #F5A3B8; }
  
  .bg-navy-50 { background-color: #EFF3F8; }
  .text-navy-600 { color: #1E3A5F; }
  .text-navy-700 { color: #172D4A; }
  .text-navy-800 { color: #102138; }
  .text-navy-900 { color: #0A1628; }
  .border-navy-200 { border-color: #C1CFE3; }
  .border-navy-300 { border-color: #9DB0D0; }
  .hover\\:border-navy-300:hover { border-color: #9DB0D0; }
  
  .bg-steel-50 { background-color: #F8FAFC; }
  .bg-steel-100 { background-color: #F1F5F9; }
  .bg-steel-200 { background-color: #E2E8F0; }
  .text-steel-400 { color: #94A3B8; }
  .text-steel-500 { color: #64748B; }
  .text-steel-600 { color: #475569; }
  .text-steel-700 { color: #334155; }
  .text-steel-900 { color: #0F172A; }
  .border-steel-200 { border-color: #E2E8F0; }
  .border-steel-300 { border-color: #CBD5E1; }
  .hover\\:bg-steel-50:hover { background-color: #F8FAFC; }
  .hover\\:bg-steel-100:hover { background-color: #F1F5F9; }
  
  .bg-success-50 { background-color: #ECFDF5; }
  .bg-success-500 { background-color: #10B981; }
  .bg-success-600 { background-color: #059669; }
  .bg-success-700 { background-color: #047857; }
  .text-success-600 { color: #059669; }
  .text-success-800 { color: #065F46; }
  .text-success-900 { color: #064E3B; }
  .border-success-200 { border-color: #A7F3D0; }
  .hover\\:bg-success-700:hover { background-color: #047857; }
  
  .bg-danger-50 { background-color: #FEF2F2; }
  .text-danger-600 { color: #DC2626; }
  .border-danger-500 { border-color: #EF4444; }
  
  .bg-info-50 { background-color: #EFF6FF; }
`;
document.head.appendChild(style);

export default EmployeeModalDemo;