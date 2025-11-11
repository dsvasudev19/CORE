import React, { useState } from 'react';
import {
  ArrowLeft, Check, Clock, Upload, FileText, User,
  Shield, Users, Package, BookOpen, CheckCircle, AlertCircle,
  Calendar, Mail, Briefcase,
  ChevronRight, Eye, Download, Send
} from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  documents: {
    idProof: File | null;
    addressProof: File | null;
    educationCert: File | null;
    experienceLetter: File | null;
    passport: File | null;
    photograph: File | null;
  };
  workEmail: string;
  systemAccess: string[];
  department: string;
  team: string;
  manager: string;
  designation: string;
  laptop: boolean;
  mouse: boolean;
  keyboard: boolean;
  monitor: boolean;
  headphones: boolean;
  accessCard: boolean;
  policyAcknowledgment: boolean;
  ndaSigned: boolean;
  securityTraining: boolean;
  toolsTraining: boolean;
}

const EmployeeOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',

    // Documents
    documents: {
      idProof: null,
      addressProof: null,
      educationCert: null,
      experienceLetter: null,
      passport: null,
      photograph: null
    },

    // Access Setup
    workEmail: '',
    systemAccess: [],

    // Team Assignment
    department: '',
    team: '',
    manager: '',
    designation: '',

    // Assets
    laptop: false,
    mouse: false,
    keyboard: false,
    monitor: false,
    headphones: false,
    accessCard: false,

    // Orientation
    policyAcknowledgment: false,
    ndaSigned: false,
    securityTraining: false,
    toolsTraining: false
  });

  const [documentStatus, setDocumentStatus] = useState([
    { id: 'idProof', label: 'ID Proof (Aadhar/Passport/DL)', required: true, status: 'pending' },
    { id: 'addressProof', label: 'Address Proof', required: true, status: 'pending' },
    { id: 'educationCert', label: 'Educational Certificates', required: true, status: 'pending' },
    { id: 'experienceLetter', label: 'Experience Letters', required: false, status: 'pending' },
    { id: 'passport', label: 'Passport Copy', required: false, status: 'pending' },
    { id: 'photograph', label: 'Recent Photograph', required: true, status: 'pending' }
  ]);

  const steps = [
    { id: 1, title: 'Personal Details', icon: User, description: 'Basic information', status: 'completed' },
    { id: 2, title: 'Documentation', icon: FileText, description: 'Upload required documents', status: 'current' },
    { id: 3, title: 'Access Setup', icon: Shield, description: 'System credentials', status: 'pending' },
    { id: 4, title: 'Team Assignment', icon: Users, description: 'Department & team', status: 'pending' },
    { id: 5, title: 'Assets & Resources', icon: Package, description: 'Equipment allocation', status: 'pending' },
    { id: 6, title: 'Orientation', icon: BookOpen, description: 'Training & policies', status: 'pending' },
    { id: 7, title: 'Review & Activate', icon: CheckCircle, description: 'Final confirmation', status: 'pending' }
  ];

  const systemAccessOptions = [
    { id: 'jira', name: 'Jira', icon: '🎯' },
    { id: 'slack', name: 'Slack', icon: '💬' },
    { id: 'github', name: 'GitHub', icon: '🐙' },
    { id: 'aws', name: 'AWS Console', icon: '☁️' },
    { id: 'figma', name: 'Figma', icon: '🎨' },
    { id: 'confluence', name: 'Confluence', icon: '📚' }
  ];

  const assets = [
    { id: 'laptop', label: 'Laptop', model: 'MacBook Pro 16" M3' },
    { id: 'mouse', label: 'Mouse', model: 'Logitech MX Master 3' },
    { id: 'keyboard', label: 'Keyboard', model: 'Keychron K8' },
    { id: 'monitor', label: 'Monitor', model: 'Dell 27" 4K' },
    { id: 'headphones', label: 'Headphones', model: 'Sony WH-1000XM5' },
    { id: 'accessCard', label: 'Access Card', model: 'Office Entry Card' }
  ];

  const orientationTasks = [
    { id: 'policyAcknowledgment', label: 'Company Policies Review', duration: '30 min', status: 'pending' },
    { id: 'ndaSigned', label: 'NDA Signing', duration: '15 min', status: 'pending' },
    { id: 'securityTraining', label: 'Security Training', duration: '45 min', status: 'pending' },
    { id: 'toolsTraining', label: 'Tools & Systems Training', duration: '1 hour', status: 'pending' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0];
    if (file && ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) && file.size <= 5 * 1024 * 1024) {
      setFormData((prev: FormData) => ({
        ...prev,
        documents: { ...prev.documents, [docId as keyof FormData['documents']]: file }
      }));
      setDocumentStatus(prev =>
        prev.map(doc =>
          doc.id === docId ? { ...doc, status: 'uploaded' } : doc
        )
      );
    } else {
      alert('Please upload a valid PDF, JPG, or PNG file (max 5MB).');
    }
  };

  const toggleSystemAccess = (accessId: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      systemAccess: Array.isArray(prev.systemAccess)
        ? (prev.systemAccess.includes(accessId)
          ? prev.systemAccess.filter((id: string) => id !== accessId)
          : [...prev.systemAccess, accessId])
        : [accessId]
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.dob
        );
      case 2:
        return documentStatus
          .filter(doc => doc.required)
          .every(doc => doc.status === 'uploaded');
      case 3:
        return formData.workEmail && formData.systemAccess.length > 0;
      case 4:
        return (
          formData.department &&
          formData.team &&
          formData.designation &&
          formData.manager
        );
      case 5:
        return Object.values(formData).some(
          (value, index) =>
            ['laptop', 'mouse', 'keyboard', 'monitor', 'headphones', 'accessCard'].includes(
              Object.keys(formData)[index]
            ) && value
        );
      case 6:
        return (
          formData.policyAcknowledgment &&
          formData.ndaSigned &&
          formData.securityTraining &&
          formData.toolsTraining
        );
      case 7:
        return true;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(7, prev + 1));
    } else {
      alert('Please complete all required fields before proceeding.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
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
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="John"
                />
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
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="Doe"
                />
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
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="john.doe@email.com"
                />
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
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="+1 (555) 123-4567"
                />
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
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="Full residential address"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <div className="p-3 bg-navy-50 border border-navy-200 rounded flex items-start gap-2">
              <AlertCircle size={16} className="text-navy-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-navy-900">Document Upload Guidelines</p>
                <p className="text-xs text-navy-700 mt-0.5">
                  Please upload clear, legible copies. Accepted formats: PDF, JPG, PNG (Max 5MB each)
                </p>
              </div>
            </div>

            {documentStatus.map((doc) => (
              <div key={doc.id} className="card-compact">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-steel-100 flex items-center justify-center">
                      <FileText size={18} className="text-steel-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-steel-900 flex items-center gap-2">
                        {doc.label}
                        {doc.required && <span className="text-xs text-danger-600">*Required</span>}
                      </p>
                      <p className="text-xs text-steel-500 mt-0.5">
                        {doc.status === 'pending' ? 'Not uploaded' : 'Uploaded successfully'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.status === 'uploaded' ? (
                      <>
                        <span className="badge badge-success flex items-center gap-1">
                          <Check size={12} />
                          Uploaded
                        </span>
                        <button className="p-1.5 hover:bg-steel-100 rounded">
                          <Eye size={14} className="text-steel-600" />
                        </button>
                      </>
                    ) : (
                      <label className="px-3 py-1.5 text-xs font-medium text-burgundy-700 bg-burgundy-50 border border-burgundy-200 rounded hover:bg-burgundy-100 flex items-center gap-1.5 cursor-pointer">
                        <Upload size={12} />
                        Upload
                        <input
                          type="file"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => handleFileUpload(e, doc.id)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="card-compact">
              <h3 className="text-sm font-semibold text-steel-900 mb-3">Work Email Assignment</h3>
              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Company Email <span className="text-danger-600">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="workEmail"
                    value={formData.workEmail}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    placeholder="john.doe"
                  />
                  <span className="flex items-center px-3 py-2 text-sm bg-steel-100 border border-steel-300 rounded text-steel-600">
                    @company.com
                  </span>
                </div>
                <p className="text-xs text-steel-500 mt-1">
                  Temporary password will be sent to personal email
                </p>
              </div>
            </div>

            <div className="card-compact">
              <h3 className="text-sm font-semibold text-steel-900 mb-3">System Access</h3>
              <p className="text-xs text-steel-600 mb-3">Select the systems this employee needs access to</p>
              <div className="grid grid-cols-3 gap-2">
                {systemAccessOptions.map((system) => (
                  <button
                    key={system.id}
                    type="button"
                    onClick={() => toggleSystemAccess(system.id)}
                    className={`p-3 text-left rounded border transition-colors ${formData.systemAccess.includes(system.id)
                      ? 'bg-burgundy-50 border-burgundy-300'
                      : 'bg-white border-steel-300 hover:border-burgundy-200'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{system.icon}</span>
                      <span className="text-sm font-medium text-steel-900">{system.name}</span>
                    </div>
                    {formData.systemAccess.includes(system.id) && (
                      <span className="badge badge-success text-xs">
                        <Check size={10} className="mr-1" />
                        Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Department <span className="text-danger-600">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                >
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
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                >
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
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                >
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
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                >
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

      case 5:
        return (
          <div className="space-y-3">
            <div className="p-3 bg-warning-50 border border-warning-200 rounded flex items-start gap-2">
              <AlertCircle size={16} className="text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-warning-900">Asset Allocation</p>
                <p className="text-xs text-warning-800 mt-0.5">
                  Select equipment to be allocated. IT team will be notified for setup.
                </p>
              </div>
            </div>

            {assets.map((asset) => (
              <div key={asset.id} className="card-compact">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name={asset.id}
                      checked={formData[asset.id as keyof FormData] as boolean}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-burgundy-600 border-steel-300 rounded focus:ring-burgundy-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-steel-900">{asset.label}</p>
                      <p className="text-xs text-steel-500">{asset.model}</p>
                    </div>
                  </div>
                  {formData[asset.id as keyof FormData] && (
                    <span className="badge badge-success">
                      <Check size={12} className="mr-1" />
                      Allocated
                    </span>
                  )}
                </div>
              </div>
            ))}

            <div className="card-compact bg-success-50 border-success-200">
              <h4 className="text-sm font-semibold text-success-900 mb-2 flex items-center gap-1.5">
                <Package size={14} />
                Assets Summary
              </h4>
              <p className="text-xs text-success-800">
                {Object.keys(formData).filter(key =>
                  ['laptop', 'mouse', 'keyboard', 'monitor', 'headphones', 'accessCard'].includes(key) &&
                  formData[key as keyof FormData]
                ).length} items selected for allocation
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-3">
            <div className="p-3 bg-burgundy-50 border border-burgundy-200 rounded flex items-start gap-2">
              <BookOpen size={16} className="text-burgundy-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-burgundy-900">Orientation Checklist</p>
                <p className="text-xs text-burgundy-800 mt-0.5">
                  Complete all mandatory training and policy reviews before activation
                </p>
              </div>
            </div>

            {orientationTasks.map((task) => (
              <div key={task.id} className="card-compact">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name={task.id}
                      checked={formData[task.id as keyof FormData] as boolean}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-burgundy-600 border-steel-300 rounded focus:ring-burgundy-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-steel-900">{task.label}</p>
                      <p className="text-xs text-steel-500 flex items-center gap-1.5 mt-0.5">
                        <Clock size={12} />
                        Duration: {task.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData[task.id as keyof FormData] ? (
                      <span className="badge badge-success">
                        <Check size={12} className="mr-1" />
                        Completed
                      </span>
                    ) : (
                      <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium">
                        Start →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="card-compact text-center">
                <User size={24} className="mx-auto mb-2 text-burgundy-600" />
                <p className="text-xs text-steel-500">Employee</p>
                <p className="text-sm font-bold text-steel-900">{formData.firstName} {formData.lastName}</p>
              </div>
              <div className="card-compact text-center">
                <Mail size={24} className="mx-auto mb-2 text-burgundy-600" />
                <p className="text-xs text-steel-500">Work Email</p>
                <p className="text-sm font-bold text-steel-900">{formData.workEmail}@company.com</p>
              </div>
              <div className="card-compact text-center">
                <Calendar size={24} className="mx-auto mb-2 text-burgundy-600" />
                <p className="text-xs text-steel-500">Joining Date</p>
                <p className="text-sm font-bold text-steel-900">Nov 1, 2025</p>
              </div>
            </div>

            <div className="card-compact">
              <h3 className="text-sm font-semibold text-steel-900 mb-3">Onboarding Summary</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-steel-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success-600" />
                    <span className="text-xs text-steel-700">Personal Information</span>
                  </div>
                  <span className="text-xs font-medium text-success-600">Complete</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-steel-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success-600" />
                    <span className="text-xs text-steel-700">Documents Uploaded</span>
                  </div>
                  <span className="text-xs font-medium text-success-600">
                    {documentStatus.filter(doc => doc.status === 'uploaded').length}/{documentStatus.length}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-steel-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success-600" />
                    <span className="text-xs text-steel-700">System Access Configured</span>
                  </div>
                  <span className="text-xs font-medium text-success-600">{formData.systemAccess.length} systems</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-steel-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success-600" />
                    <span className="text-xs text-steel-700">Team Assignment</span>
                  </div>
                  <span className="text-xs font-medium text-success-600">{formData.team}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-steel-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success-600" />
                    <span className="text-xs text-steel-700">Assets Allocated</span>
                  </div>
                  <span className="text-xs font-medium text-success-600">
                    {Object.keys(formData).filter(key =>
                      ['laptop', 'mouse', 'keyboard', 'monitor', 'headphones', 'accessCard'].includes(key) &&
                      formData[key as keyof FormData]
                    ).length} items
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success-600" />
                    <span className="text-xs text-steel-700">Orientation Completed</span>
                  </div>
                  <span className="text-xs font-medium text-success-600">
                    {Object.keys(formData).filter(key =>
                      ['policyAcknowledgment', 'ndaSigned', 'securityTraining', 'toolsTraining'].includes(key) &&
                      formData[key as keyof FormData]
                    ).length}/4 tasks
                  </span>
                </div>
              </div>
            </div>

            <div className="card-compact bg-burgundy-50 border-burgundy-200">
              <h3 className="text-sm font-semibold text-burgundy-900 mb-3">HR Approval Required</h3>
              <p className="text-xs text-burgundy-800 mb-3">
                All information has been verified and is ready for final approval. Click "Activate Employee" to complete onboarding.
              </p>
              <div className="flex items-center gap-2">
                <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-success-600 rounded hover:bg-success-700 transition-colors flex items-center justify-center gap-2">
                  <Send size={16} />
                  Activate Employee
                </button>
                <button className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded hover:bg-steel-50 transition-colors">
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepStatus = (step: { id: number }) => {
    if (step.id < currentStep) return 'completed';
    if (step.id === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-4">
        <button className="flex items-center gap-2 text-sm text-steel-600 hover:text-steel-900 mb-3">
          <ArrowLeft size={16} />
          Back to Employees
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-steel-900">Employee Onboarding</h1>
            <p className="text-xs text-steel-500 mt-0.5">Complete all steps to activate new employee</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-steel-700 bg-white border border-steel-300 rounded hover:bg-steel-50">
              <Download size={14} className="inline mr-1" />
              Export PDF
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-burgundy-700 bg-burgundy-50 border border-burgundy-200 rounded hover:bg-burgundy-100">
              Save Draft
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <div className="card p-4 sticky top-4">
            <h3 className="text-sm font-semibold text-steel-900 mb-3">Onboarding Steps</h3>
            <div className="space-y-2">
              {steps.map((step) => {
                const Icon = step.icon;
                const status = getStepStatus(step);

                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full flex items-start gap-3 p-2.5 rounded text-left transition-colors ${status === 'current'
                      ? 'bg-burgundy-50 border border-burgundy-200'
                      : status === 'completed'
                        ? 'bg-success-50 border border-success-200 hover:bg-success-100'
                        : 'hover:bg-steel-50'
                      }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${status === 'completed'
                        ? 'bg-success-500 text-white'
                        : status === 'current'
                          ? 'bg-burgundy-600 text-white'
                          : 'bg-steel-200 text-steel-500'
                        }`}
                    >
                      {status === 'completed' ? (
                        <Check size={14} />
                      ) : (
                        <Icon size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${status === 'current' ? 'text-burgundy-900' : 'text-steel-900'
                        }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-steel-500 mt-0.5">{step.description}</p>
                    </div>
                    {status === 'current' && (
                      <ChevronRight size={14} className="text-burgundy-600 flex-shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-steel-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-steel-600">Overall Progress</span>
                <span className="font-semibold text-steel-900">{Math.round((currentStep / 7) * 100)}%</span>
              </div>
              <div className="w-full bg-steel-100 rounded-full h-2">
                <div
                  className="bg-burgundy-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-9">
          <div className="card p-5">
            <div className="mb-4 pb-4 border-b border-steel-200">
              <div className="flex items-center gap-3 mb-2">
                {React.createElement(steps[currentStep - 1].icon, {
                  size: 24,
                  className: 'text-burgundy-600'
                })}
                <div>
                  <h2 className="text-lg font-bold text-steel-900">
                    {steps[currentStep - 1].title}
                  </h2>
                  <p className="text-xs text-steel-500">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              {renderStepContent()}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-steel-200">
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded hover:bg-steel-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentStep < 7 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 transition-colors flex items-center gap-2"
                  >
                    Next Step
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button className="px-4 py-2 text-sm font-medium text-white bg-success-600 rounded hover:bg-success-700 transition-colors flex items-center gap-2">
                    <Send size={16} />
                    Complete Onboarding
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inject styles
const style = document.createElement('style');
style.textContent = `
  .bg-burgundy-50 { background-color: #FDF2F5; }
  .bg-burgundy-600 { background-color: #8B1538; }
  .bg-burgundy-700 { background-color: #6B0E2A; }
  .text-burgundy-600 { color: #8B1538; }
  .text-burgundy-700 { color: #6B0E2A; }
  .text-burgundy-800 { color: #4D0A1F; }
  .text-burgundy-900 { color: #330714; }
  .border-burgundy-200 { border-color: #F9C9D5; }
  .hover\\:bg-burgundy-100:hover { background-color: #FCE4EA; }
  .hover\\:bg-burgundy-700:hover { background-color: #6B0E2A; }
  
  .bg-navy-50 { background-color: #EFF3F8; }
  .text-navy-600 { color: #1E3A5F; }
  .text-navy-700 { color: #172D4A; }
  .text-navy-800 { color: #102138; }
  .text-navy-900 { color: #0A1628; }
  .border-navy-200 { border-color: #C1CFE3; }
  
  .bg-steel-50 { background-color: #F8FAFC; }
  .bg-steel-100 { background-color: #F1F5F9; }
  .bg-steel-200 { background-color: #E2E8F0; }
  .text-steel-500 { color: #64748B; }
  .text-steel-600 { color: #475569; }
  .text-steel-700 { color: #334155; }
  .text-steel-900 { color: #0F172A; }
  .border-steel-100 { border-color: #F1F5F9; }
  .border-steel-200 { border-color: #E2E8F0; }
  .border-steel-300 { border-color: #CBD5E1; }
  .hover\\:bg-steel-50:hover { background-color: #F8FAFC; }
  .hover\\:text-steel-900:hover { color: #0F172A; }
  
  .bg-success-50 { background-color: #ECFDF5; }
  .bg-success-500 { background-color: #10B981; }
  .bg-success-600 { background-color: #059669; }
  .bg-success-700 { background-color: #047857; }
  .text-success-600 { color: #059669; }
  .text-success-800 { color: #065F46; }
  .text-success-900 { color: #064E3B; }
  .border-success-200 { border-color: #A7F3D0; }
  .hover\\:bg-success-100:hover { background-color: #D1FAE5; }
  .hover\\:bg-success-700:hover { background-color: #047857; }
  
  .bg-warning-50 { background-color: #FFFBEB; }
  .text-warning-600 { color: #D97706; }
  .text-warning-800 { color: #92400E; }
  .text-warning-900 { color: #78350F; }
  .border-warning-200 { border-color: #FDE68A; }
  
  .bg-danger-50 { background-color: #FEF2F2; }
  .text-danger-600 { color: #DC2626; }
  
  .card {
    background-color: white;
    border-radius: 0.5rem;
    border: 1px solid #E2E8F0;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  .card-compact {
    background-color: white;
    border-radius: 0.375rem;
    border: 1px solid #E2E8F0;
    padding: 0.75rem;
  }
  
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 500;
    border: 1px solid;
  }
  
  .badge-success {
    background-color: #ECFDF5;
    color: #065F46;
    border-color: #A7F3D0;
  }
`;
document.head.appendChild(style);

export default EmployeeOnboarding;