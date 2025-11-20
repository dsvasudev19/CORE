import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { Search, Filter, Download, Plus, Users, TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface Department {
  id: number;
  name: string;
}
interface Designation {
  id: number;
  title: string;
}
interface TeamMembership {
  teamId: number;
  teamName: string;
}
interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  designation?: Designation;
  department?: Department;
  teamMemberships?: TeamMembership[];
  systemAccess?: string[];
  joiningDate?: string;
  status: string;
}

interface EmployeePage {
  content: Employee[];
  totalElements: number;
  totalPages: number;
  number: number; // current page (0-based)
  size: number;
}

const EmployeeList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: string }>({ key: null, direction: 'asc' });
  const [page, setPage] = useState(0); // 0-based
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Stats will be calculated from employees data
  const [stats, setStats] = useState([
    { label: 'Total', value: '0', change: '+0', icon: Users, color: 'bg-navy-500' },
    { label: 'Active', value: '0', change: '+0', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'On Leave', value: '0', change: '-0', icon: Calendar, color: 'bg-yellow-500' },
    { label: 'New (30d)', value: '0', change: '+0', icon: Plus, color: 'bg-coral-500' }
  ]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace organizationId with actual value as needed
        const orgId = 1;
        const res = await axiosInstance.get('/employees', {
          params: {
            organizationId: orgId,
            page,
            size,
            sort: sortConfig.key ? `${sortConfig.key},${sortConfig.direction}` : undefined
          }
        });
        // Spring returns a Page object in res.data.data
        const pageData: EmployeePage = res.data?.data;
        setEmployees(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
        // Calculate stats
        const total = pageData.totalElements;
        const active = pageData.content.filter((e) => e.status === 'ACTIVE').length;
        const onLeave = pageData.content.filter((e) => e.status === 'ON_LEAVE').length;
        // New (30d) logic can be improved if backend provides joiningDate
        const new30d = pageData.content.filter((e) => {
          if (!e.joiningDate) return false;
          const joinDate = new Date(e.joiningDate);
          const now = new Date();
          const diff = (now.getTime() - joinDate.getTime()) / (1000 * 3600 * 24);
          return diff <= 30;
        }).length;
        setStats([
          { label: 'Total', value: String(total), change: '+0', icon: Users, color: 'bg-navy-500' },
          { label: 'Active', value: String(active), change: '+0', icon: TrendingUp, color: 'bg-green-500' },
          { label: 'On Leave', value: String(onLeave), change: '-0', icon: Calendar, color: 'bg-yellow-500' },
          { label: 'New (30d)', value: String(new30d), change: `+${new30d}`, icon: Plus, color: 'bg-coral-500' }
        ]);
      } catch {
        setError('Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [page, size, sortConfig]);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setPage(0); // Reset to first page on sort
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
      case 'ON_LEAVE': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-700 border-gray-200';
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
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading employees...</div>
          ) : error ? (
            <div className="p-6 text-center text-danger-600">{error}</div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('employeeCode')}>
                    EMP ID
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('firstName')}>
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
                  <th className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('joiningDate')}>
                    Joining Date
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                   
                    <td className="px-3 py-2 font-medium text-gray-900">{emp.employeeCode}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </div>
                        <span className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{emp.email}</td>
                    <td className="px-3 py-2 text-gray-900">{emp.designation?.title || '-'}</td>
                    <td className="px-3 py-2 text-gray-600">{emp.department?.name || '-'}</td>
                    <td className="px-3 py-2 text-gray-600">{emp.teamMemberships && emp.teamMemberships.length > 0 ? emp.teamMemberships.map((tm) => tm.teamName).join(', ') : '-'}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {emp.systemAccess && emp.systemAccess.length > 0 ? emp.systemAccess.slice(0, 2).map((skill, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-navy-50 text-navy-700 rounded text-xs">
                            {skill}
                          </span>
                        )) : <span className="text-gray-400">-</span>}
                        {emp.systemAccess && emp.systemAccess.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            +{emp.systemAccess.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{emp.joiningDate}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-xs text-gray-600">
            Showing <span className="font-medium">{page * size + 1}</span>-
            <span className="font-medium">{Math.min((page + 1) * size, totalElements)}</span> of <span className="font-medium">{totalElements}</span> employees
          </div>
          <div className="flex gap-1">
            <button
              className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-50"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`px-2 py-1 text-xs rounded ${page === idx ? 'bg-burgundy-600 text-white' : 'border border-gray-300 hover:bg-white'}`}
                onClick={() => setPage(idx)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-50"
              disabled={page === totalPages - 1 || totalPages === 0}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default EmployeeList;