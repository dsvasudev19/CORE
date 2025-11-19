import { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical, Edit2, Eye, Users, TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const EmployeeList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [,] = useState([]);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: string }>({ key: null, direction: 'asc' });

  // Mock data
  const stats = [
    { label: 'Total', value: '248', change: '+12', icon: Users, color: 'bg-navy-500' },
    { label: 'Active', value: '232', change: '+8', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'On Leave', value: '12', change: '-3', icon: Calendar, color: 'bg-yellow-500' },
    { label: 'New (30d)', value: '16', change: '+16', icon: Plus, color: 'bg-coral-500' }
  ];

  const employees = [
    { id: 1, name: 'Sarah Mitchell', email: 's.mitchell@company.com', empId: 'EMP001', role: 'Senior Developer', department: 'Engineering', team: 'Core Platform', joining: '2022-03-15', status: 'Active', skills: ['React', 'Node.js', 'AWS'] },
    { id: 2, name: 'James Rodriguez', email: 'j.rodriguez@company.com', empId: 'EMP002', role: 'Team Lead', department: 'Engineering', team: 'Mobile Apps', joining: '2021-08-20', status: 'Active', skills: ['Flutter', 'iOS', 'Android'] },
    { id: 3, name: 'Emily Chen', email: 'e.chen@company.com', empId: 'EMP003', role: 'UX Designer', department: 'Design', team: 'Product Design', joining: '2023-01-10', status: 'Active', skills: ['Figma', 'UI/UX', 'Prototyping'] },
    { id: 4, name: 'Michael Brown', email: 'm.brown@company.com', empId: 'EMP004', role: 'DevOps Engineer', department: 'Engineering', team: 'Infrastructure', joining: '2020-11-05', status: 'On Leave', skills: ['Docker', 'K8s', 'AWS'] },
    { id: 5, name: 'Lisa Wang', email: 'l.wang@company.com', empId: 'EMP005', role: 'Product Manager', department: 'Product', team: 'Core Product', joining: '2021-06-12', status: 'Active', skills: ['Agile', 'JIRA', 'Analytics'] },
    { id: 6, name: 'David Kim', email: 'd.kim@company.com', empId: 'EMP006', role: 'QA Engineer', department: 'Quality', team: 'Test Automation', joining: '2022-09-18', status: 'Active', skills: ['Selenium', 'Jest', 'Cypress'] },
    { id: 7, name: 'Anna Kowalski', email: 'a.kowalski@company.com', empId: 'EMP007', role: 'Data Scientist', department: 'Data', team: 'ML Engineering', joining: '2023-02-28', status: 'Active', skills: ['Python', 'TensorFlow', 'SQL'] },
    { id: 8, name: 'Robert Taylor', email: 'r.taylor@company.com', empId: 'EMP008', role: 'Backend Developer', department: 'Engineering', team: 'API Team', joining: '2022-05-03', status: 'Active', skills: ['Java', 'Spring Boot', 'MySQL'] }
  ];

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'On Leave': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage your organization's workforce</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
              <Download size={14} />
              Export
            </button>
            <button onClick={()=>{window.location.href="/a/employees/onboarding"}} className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5">
              <Plus size={14} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-0.5">{stat.change} this month</p>
                </div>
                <div className={`${stat.color} p-2 rounded`}>
                  <stat.icon size={18} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded border border-gray-200 p-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, employee ID..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Filter size={14} />
              Filters
              {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-5 gap-2">
              <select className="text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Design</option>
                <option>Product</option>
                <option>Quality</option>
              </select>
              <select className="text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                <option>All Teams</option>
                <option>Core Platform</option>
                <option>Mobile Apps</option>
                <option>Infrastructure</option>
              </select>
              <select className="text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                <option>All Roles</option>
                <option>Developer</option>
                <option>Team Lead</option>
                <option>Designer</option>
              </select>
              <select className="text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                <option>All Status</option>
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
              <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium">
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-8 px-3 py-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('empId')}>
                  EMP ID
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                  Name
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Department
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Team
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Skills
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('joining')}>
                  Joining Date
                </th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900">{emp.empId}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{emp.email}</td>
                  <td className="px-3 py-2 text-gray-900">{emp.role}</td>
                  <td className="px-3 py-2 text-gray-600">{emp.department}</td>
                  <td className="px-3 py-2 text-gray-600">{emp.team}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {emp.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-navy-50 text-navy-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {emp.skills.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{emp.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{emp.joining}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded" title="View">
                        <Eye size={14} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                        <Edit2 size={14} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="More">
                        <MoreVertical size={14} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-xs text-gray-600">
            Showing <span className="font-medium">1-8</span> of <span className="font-medium">248</span> employees
          </div>
          <div className="flex gap-1">
            <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-50">
              Previous
            </button>
            <button className="px-2 py-1 text-xs bg-burgundy-600 text-white rounded">1</button>
            <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">2</button>
            <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">3</button>
            <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom colors for Tailwind (add to tailwind.config.js)
const style = document.createElement('style');
style.textContent = `
  .bg-burgundy-600 { background-color: #8B1538; }
  .bg-burgundy-700 { background-color: #6B0E2A; }
  .bg-burgundy-100 { background-color: #F5E6EA; }
  .text-burgundy-600 { color: #8B1538; }
  .text-burgundy-700 { color: #6B0E2A; }
  .ring-burgundy-500 { --tw-ring-color: #8B1538; }
  
  .bg-coral-500 { background-color: #FF6B6B; }
  .bg-navy-500 { background-color: #1E3A5F; }
  .bg-navy-50 { background-color: #EFF3F8; }
  .text-navy-700 { color: #1E3A5F; }
  .bg-green-500 { background-color: #10B981; }
  .bg-yellow-500 { background-color: #F59E0B; }
`;
document.head.appendChild(style);

export default EmployeeList;