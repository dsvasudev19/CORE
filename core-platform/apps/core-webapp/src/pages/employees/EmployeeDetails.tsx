import { useState } from 'react';
import {
  ArrowLeft, Edit2, Mail, Phone, MapPin, Calendar, Briefcase,
  Users, Clock, FileText, Award, TrendingUp, Download, Share2,
  CheckCircle, AlertCircle, MoreVertical, Eye, Trash2,
  Target, Activity, BarChart3
} from 'lucide-react';

const EmployeeDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock employee data
  const employee = {
    id: 'EMP001',
    name: 'Sarah Mitchell',
    email: 's.mitchell@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Senior Developer',
    department: 'Engineering',
    manager: 'James Rodriguez',
    joining: '2022-03-15',
    status: 'Active',
    location: 'San Francisco, CA',
    avatar: 'SM',
    teams: [
      { name: 'Core Platform', role: 'Member', since: '2022-03-15' },
      { name: 'Mobile Apps', role: 'Tech Lead', since: '2023-06-01' }
    ],
    skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'PostgreSQL', 'Docker', 'Kubernetes', 'GraphQL'],
    projects: [
      { name: 'Customer Portal v3', client: 'Acme Corp', role: 'Lead Developer', status: 'Active', progress: 75, deadline: '2024-12-15' },
      { name: 'Mobile App Redesign', client: 'TechStart Inc', role: 'Frontend Lead', status: 'Active', progress: 45, deadline: '2025-02-28' },
      { name: 'API Gateway Migration', client: 'Internal', role: 'Developer', status: 'Completed', progress: 100, deadline: '2024-09-30' }
    ],
    workLogs: [
      { date: '2024-10-25', project: 'Customer Portal v3', hours: 7.5, task: 'API Integration' },
      { date: '2024-10-24', project: 'Mobile App Redesign', hours: 8.0, task: 'UI Component Development' },
      { date: '2024-10-23', project: 'Customer Portal v3', hours: 6.5, task: 'Code Review & Testing' },
      { date: '2024-10-22', project: 'Mobile App Redesign', hours: 7.0, task: 'State Management Setup' },
      { date: '2024-10-21', project: 'Customer Portal v3', hours: 8.0, task: 'Database Optimization' }
    ],
    documents: [
      { name: 'Employment Contract.pdf', category: 'Contract', uploadedOn: '2022-03-15', size: '245 KB' },
      { name: 'NDA Agreement.pdf', category: 'Legal', uploadedOn: '2022-03-15', size: '180 KB' },
      { name: 'Tax Forms 2024.pdf', category: 'Tax', uploadedOn: '2024-01-10', size: '320 KB' },
      { name: 'AWS Certification.pdf', category: 'Certificate', uploadedOn: '2023-08-20', size: '1.2 MB' }
    ],
    performance: {
      tasksCompleted: 142,
      avgCompletionTime: '2.3 days',
      onTimeDelivery: 94,
      codeQuality: 4.7,
      teamCollaboration: 4.9,
      clientSatisfaction: 4.8
    },
    employment: {
      type: 'Full-time',
      designation: 'Senior Developer',
      salary: '$120,000',
      reportingTo: 'James Rodriguez',
      probation: 'Completed',
      noticePeriod: '30 days',
      workSchedule: 'Mon-Fri, 9:00 AM - 6:00 PM'
    },
    personal: {
      dob: '1992-05-12',
      gender: 'Female',
      bloodGroup: 'O+',
      address: '1234 Market Street, San Francisco, CA 94103',
      emergencyContact: 'John Mitchell (Father) - +1 (555) 987-6543',
      nationality: 'American'
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'employment', label: 'Employment Info', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Target },
    { id: 'time', label: 'Time Tracking', icon: Clock },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'performance', label: 'Performance', icon: TrendingUp }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Completed': return 'badge-info';
      case 'On Hold': return 'badge-warning';
      default: return 'badge';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-3 gap-4">
            {/* Personal Information */}
            <div className="col-span-2 space-y-4">
              <div className="card-compact">
                <h3 className="text-sm font-semibold text-steel-900 mb-3 flex items-center gap-2">
                  <Users size={16} className="text-burgundy-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  <div>
                    <p className="text-xs text-steel-500">Date of Birth</p>
                    <p className="text-sm font-medium text-steel-900">{employee.personal.dob}</p>
                  </div>
                  <div>
                    <p className="text-xs text-steel-500">Gender</p>
                    <p className="text-sm font-medium text-steel-900">{employee.personal.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-steel-500">Blood Group</p>
                    <p className="text-sm font-medium text-steel-900">{employee.personal.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-steel-500">Nationality</p>
                    <p className="text-sm font-medium text-steel-900">{employee.personal.nationality}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-steel-500">Address</p>
                    <p className="text-sm font-medium text-steel-900">{employee.personal.address}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-steel-500">Emergency Contact</p>
                    <p className="text-sm font-medium text-steel-900">{employee.personal.emergencyContact}</p>
                  </div>
                </div>
              </div>

              {/* Skills & Expertise */}
              <div className="card-compact">
                <h3 className="text-sm font-semibold text-steel-900 mb-3 flex items-center gap-2">
                  <Award size={16} className="text-burgundy-600" />
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-navy-50 text-navy-700 rounded text-xs font-medium border border-navy-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Teams */}
              <div className="card-compact">
                <h3 className="text-sm font-semibold text-steel-900 mb-3 flex items-center gap-2">
                  <Users size={16} className="text-burgundy-600" />
                  Team Assignments
                </h3>
                <div className="space-y-2">
                  {employee.teams.map((team, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-steel-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-steel-900">{team.name}</p>
                        <p className="text-xs text-steel-500">Member since {team.since}</p>
                      </div>
                      <span className="badge badge-burgundy">{team.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="space-y-4">
              <div className="card-compact">
                <h3 className="text-sm font-semibold text-steel-900 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-steel-600">Tasks Completed</span>
                    <span className="text-sm font-bold text-steel-900">{employee.performance.tasksCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-steel-600">On-Time Delivery</span>
                    <span className="text-sm font-bold text-success-600">{employee.performance.onTimeDelivery}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-steel-600">Avg Completion</span>
                    <span className="text-sm font-bold text-steel-900">{employee.performance.avgCompletionTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-steel-600">Active Projects</span>
                    <span className="text-sm font-bold text-burgundy-600">2</span>
                  </div>
                </div>
              </div>

              <div className="card-compact">
                <h3 className="text-sm font-semibold text-steel-900 mb-3">Ratings</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Code Quality', value: employee.performance.codeQuality },
                    { label: 'Collaboration', value: employee.performance.teamCollaboration },
                    { label: 'Client Satisfaction', value: employee.performance.clientSatisfaction }
                  ].map((rating, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-steel-600">{rating.label}</span>
                        <span className="text-xs font-semibold text-steel-900">{rating.value}/5.0</span>
                      </div>
                      <div className="w-full bg-steel-100 rounded-full h-1.5">
                        <div
                          className="bg-burgundy-600 h-1.5 rounded-full"
                          style={{ width: `${(rating.value / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'employment':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="card-compact">
              <h3 className="text-sm font-semibold text-steel-900 mb-3 flex items-center gap-2">
                <Briefcase size={16} className="text-burgundy-600" />
                Employment Details
              </h3>
              <div className="space-y-2.5">
                {Object.entries(employee.employment).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-steel-100 last:border-0">
                    <span className="text-xs text-steel-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-sm font-medium text-steel-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-compact">
              <h3 className="text-sm font-semibold text-steel-900 mb-3 flex items-center gap-2">
                <Activity size={16} className="text-burgundy-600" />
                Employment History
              </h3>
              <div className="space-y-3">
                <div className="border-l-2 border-burgundy-600 pl-3 pb-3">
                  <p className="text-xs text-steel-500">March 2023 - Present</p>
                  <p className="text-sm font-semibold text-steel-900">Senior Developer</p>
                  <p className="text-xs text-steel-600 mt-0.5">Promoted from Mid-level Developer</p>
                </div>
                <div className="border-l-2 border-steel-300 pl-3 pb-3">
                  <p className="text-xs text-steel-500">March 2022 - February 2023</p>
                  <p className="text-sm font-semibold text-steel-900">Mid-level Developer</p>
                  <p className="text-xs text-steel-600 mt-0.5">Initial joining position</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-3">
            {employee.projects.map((project, idx) => (
              <div key={idx} className="card-compact">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-steel-900">{project.name}</h4>
                    <p className="text-xs text-steel-500 mt-0.5">Client: {project.client} • Role: {project.role}</p>
                  </div>
                  <span className={`badge ${getStatusColor(project.status)}`}>{project.status}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-steel-600">Progress</span>
                    <span className="font-semibold text-steel-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-steel-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${project.status === 'Completed' ? 'bg-success-500' : 'bg-burgundy-600'}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-steel-500 flex items-center gap-1">
                      <Calendar size={12} />
                      Deadline: {project.deadline}
                    </span>
                    <button className="text-burgundy-600 hover:text-burgundy-700 font-medium">View Details →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'time':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'This Week', value: '37.5h', change: '+2.5h', color: 'burgundy' },
                { label: 'This Month', value: '158h', change: '+12h', color: 'navy' },
                { label: 'Avg/Day', value: '7.5h', change: 'On target', color: 'success' },
                { label: 'Utilization', value: '94%', change: '+3%', color: 'coral' }
              ].map((stat, idx) => (
                <div key={idx} className="card-compact text-center">
                  <p className="text-xs text-steel-500 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-steel-900">{stat.value}</p>
                  <p className={`text-xs text-${stat.color}-600 mt-0.5`}>{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="card-compact">
              <h3 className="text-sm font-semibold text-steel-900 mb-3">Recent Work Logs</h3>
              <table className="table-executive">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Task</th>
                    <th className="text-right">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.workLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td className="text-steel-900">{log.date}</td>
                      <td className="text-steel-900">{log.project}</td>
                      <td className="text-steel-600">{log.task}</td>
                      <td className="text-right font-semibold text-burgundy-600">{log.hours}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="card-compact">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-steel-900">Documents</h3>
              <button className="btn-ghost text-xs py-1 px-2">
                <Download size={12} className="mr-1" />
                Download All
              </button>
            </div>
            <table className="table-executive">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Category</th>
                  <th>Uploaded On</th>
                  <th>Size</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employee.documents.map((doc, idx) => (
                  <tr key={idx}>
                    <td className="text-steel-900 font-medium flex items-center gap-2">
                      <FileText size={14} className="text-steel-400" />
                      {doc.name}
                    </td>
                    <td><span className="badge badge-navy">{doc.category}</span></td>
                    <td className="text-steel-600">{doc.uploadedOn}</td>
                    <td className="text-steel-600">{doc.size}</td>
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1 hover:bg-steel-100 rounded" title="View">
                          <Eye size={14} className="text-steel-600" />
                        </button>
                        <button className="p-1 hover:bg-steel-100 rounded" title="Download">
                          <Download size={14} className="text-steel-600" />
                        </button>
                        <button className="p-1 hover:bg-steel-100 rounded" title="Delete">
                          <Trash2 size={14} className="text-danger-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'performance':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="card-compact">
              <h3 className="text-sm font-semibold text-steel-900 mb-3 flex items-center gap-2">
                <BarChart3 size={16} className="text-burgundy-600" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Code Quality', value: employee.performance.codeQuality, max: 5 },
                  { label: 'Team Collaboration', value: employee.performance.teamCollaboration, max: 5 },
                  { label: 'Client Satisfaction', value: employee.performance.clientSatisfaction, max: 5 },
                  { label: 'On-Time Delivery', value: employee.performance.onTimeDelivery, max: 100, unit: '%' }
                ].map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-steel-600">{metric.label}</span>
                      <span className="text-sm font-bold text-steel-900">
                        {metric.value}{metric.unit || `/${metric.max}`}
                      </span>
                    </div>
                    <div className="w-full bg-steel-100 rounded-full h-2">
                      <div
                        className="bg-burgundy-600 h-2 rounded-full"
                        style={{ width: `${(metric.value / metric.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-compact">
              <h3 className="text-sm font-semibold text-steel-900 mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-burgundy-600" />
                Performance Summary
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-success-50 border border-success-200 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={14} className="text-success-600" />
                    <span className="text-xs font-semibold text-success-900">Strengths</span>
                  </div>
                  <ul className="text-xs text-success-800 space-y-0.5 ml-5">
                    <li>Consistently delivers high-quality code</li>
                    <li>Excellent team collaboration skills</li>
                    <li>Strong technical expertise</li>
                  </ul>
                </div>
                <div className="p-3 bg-warning-50 border border-warning-200 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle size={14} className="text-warning-600" />
                    <span className="text-xs font-semibold text-warning-900">Areas for Improvement</span>
                  </div>
                  <ul className="text-xs text-warning-800 space-y-0.5 ml-5">
                    <li>Could improve documentation practices</li>
                    <li>More proactive in knowledge sharing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Back Button */}
      <button className="flex items-center gap-2 text-sm text-steel-600 hover:text-steel-900 mb-4">
        <ArrowLeft size={16} />
        Back to Employee List
      </button>

      {/* Header Card */}
      <div className="card mb-4 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-lg bg-burgundy-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-burgundy-700">{employee.avatar}</span>
            </div>

            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-steel-900">{employee.name}</h1>
                <span className="badge badge-success">{employee.status}</span>
              </div>
              <p className="text-sm text-steel-600 mb-2">{employee.role} • {employee.department}</p>

              <div className="flex items-center gap-4 text-xs text-steel-500">
                <span className="flex items-center gap-1">
                  <Mail size={12} />
                  {employee.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {employee.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {employee.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Joined {employee.joining}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-steel-500">Reports to:</span>
                <span className="text-xs font-medium text-steel-900">{employee.manager}</span>
                <span className="text-steel-300">•</span>
                <span className="text-xs text-steel-500">Employee ID:</span>
                <span className="text-xs font-medium text-steel-900">{employee.id}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="btn-ghost text-xs py-1.5 px-3">
              <Share2 size={14} className="mr-1" />
              Share
            </button>
            <button className="btn-secondary text-xs py-1.5 px-3">
              <Edit2 size={14} className="mr-1" />
              Edit Profile
            </button>
            <button className="p-2 hover:bg-steel-100 rounded">
              <MoreVertical size={16} className="text-steel-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-steel-200 mb-4 rounded-t">
        <div className="flex items-center gap-1 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-burgundy-600 text-burgundy-700 bg-burgundy-50'
                  : 'border-transparent text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                  }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
};

// Inject custom styles for theme colors
const style = document.createElement('style');
style.textContent = `
  .bg-burgundy-50 { background-color: #FDF2F5; }
  .bg-burgundy-100 { background-color: #FCE4EA; }
  .bg-burgundy-600 { background-color: #8B1538; }
  .bg-burgundy-700 { background-color: #6B0E2A; }
  .text-burgundy-600 { color: #8B1538; }
  .text-burgundy-700 { color: #6B0E2A; }
  .border-burgundy-600 { border-color: #8B1538; }
  
  .bg-coral-500 { background-color: #FF6B6B; }
  .text-coral-600 { color: #FF6B6B; }
  
  .bg-navy-50 { background-color: #EFF3F8; }
  .bg-navy-100 { background-color: #E0E7F1; }
  .text-navy-700 { color: #1E3A5F; }
  .border-navy-100 { border-color: #E0E7F1; }
  
  .bg-steel-50 { background-color: #F8FAFC; }
  .bg-steel-100 { background-color: #F1F5F9; }
  .text-steel-400 { color: #94A3B8; }
  .text-steel-500 { color: #64748B; }
  .text-steel-600 { color: #475569; }
  .text-steel-800 { color: #1E293B; }
  .text-steel-900 { color: #0F172A; }
  .border-steel-100 { border-color: #F1F5F9; }
  .border-steel-200 { border-color: #E2E8F0; }
  .border-steel-300 { border-color: #CBD5E1; }
  
  .bg-success-50 { background-color: #ECFDF5; }
  .bg-success-500 { background-color: #10B981; }
  .text-success-600 { color: #059669; }
  .text-success-800 { color: #065F46; }
  .text-success-900 { color: #064E3B; }
  .border-success-200 { border-color: #A7F3D0; }
  
  .bg-warning-50 { background-color: #FFFBEB; }
  .text-warning-600 { color: #D97706; }
  .text-warning-800 { color: #92400E; }
  .text-warning-900 { color: #78350F; }
  .border-warning-200 { border-color: #FDE68A; }
  
  .bg-danger-600 { color: #DC2626; }
  .text-danger-600 { color: #DC2626; }
  
  .bg-info-50 { background-color: #EFF6FF; }
  .text-info-700 { color: #1D4ED8; }
  .border-info-200 { border-color: #BFDBFE; }
  
  /* Component Styles */
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
  
  .btn-ghost {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
  }
  
  .btn-ghost:hover {
    background-color: #F1F5F9;
  }
  
  .btn-secondary {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6B0E2A;
    background-color: #FDF2F5;
    border: 1px solid #F9C9D5;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
  }
  
  .btn-secondary:hover {
    background-color: #FCE4EA;
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
  
  .badge-warning {
    background-color: #FFFBEB;
    color: #92400E;
    border-color: #FDE68A;
  }
  
  .badge-danger {
    background-color: #FEF2F2;
    color: #991B1B;
    border-color: #FECACA;
  }
  
  .badge-info {
    background-color: #EFF6FF;
    color: #1E40AF;
    border-color: #BFDBFE;
  }
  
  .badge-burgundy {
    background-color: #FDF2F5;
    color: #6B0E2A;
    border-color: #F9C9D5;
  }
  
  .badge-navy {
    background-color: #EFF3F8;
    color: #172D4A;
    border-color: #C1CFE3;
  }
  
  .table-executive {
    width: 100%;
    font-size: 0.6875rem;
  }
  
  .table-executive thead {
    background-color: #F8FAFC;
    border-bottom: 1px solid #E2E8F0;
  }
  
  .table-executive th {
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-weight: 600;
    color: #334155;
  }
  
  .table-executive td {
    padding: 0.5rem 0.75rem;
    color: #0F172A;
  }
  
  .table-executive tbody tr {
    border-bottom: 1px solid #F1F5F9;
    transition: background-color 0.15s;
  }
  
  .table-executive tbody tr:hover {
    background-color: #F8FAFC;
  }
`;

export default EmployeeDetails;