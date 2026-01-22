import React, { useState } from 'react';
import {
  Users, User, Code, Plus, Trash2, Check, X, BarChart2, Briefcase,
  Search, ChevronDown, ChevronUp
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
  status: string;
  completion: number;
}

interface Performance {
  tasksCompleted: number;
  totalTasks: number;
  completionRate: number;
}

interface Team {
  id: number;
  name: string;
  department: string;
  lead: string;
  techStack: string[];
  members: string[];
  projects: Project[];
  performance: Performance;
}

interface NewTeam {
  name: string;
  department: string;
  lead: string;
  techStack: string[];
  members: string[];
}

interface Filters {
  department: string;
  lead: string;
  techStack: string;
}

const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: 'Core Platform',
      department: 'Engineering',
      lead: 'James Rodriguez',
      techStack: ['React', 'Node.js', 'AWS'],
      members: ['Alice Smith', 'Bob Johnson', 'Carol Williams', 'David Brown'],
      projects: [
        { id: 1, name: 'Platform Upgrade', status: 'In Progress', completion: 75 },
        { id: 2, name: 'API Integration', status: 'Completed', completion: 100 }
      ],
      performance: { tasksCompleted: 120, totalTasks: 150, completionRate: 80 }
    },
    {
      id: 2,
      name: 'Mobile Apps',
      department: 'Engineering',
      lead: 'Sarah Chen',
      techStack: ['Flutter', 'Dart', 'Firebase'],
      members: ['Eve Davis', 'Frank Wilson', 'Grace Lee'],
      projects: [
        { id: 3, name: 'Mobile App V2', status: 'In Progress', completion: 60 }
      ],
      performance: { tasksCompleted: 90, totalTasks: 120, completionRate: 75 }
    }
  ]);

  const [filters, setFilters] = useState<Filters>({
    department: '',
    lead: '',
    techStack: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeam, setNewTeam] = useState<NewTeam>({
    name: '',
    department: '',
    lead: '',
    techStack: [],
    members: []
  });

  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const departments = ['Engineering', 'Design', 'Product', 'Quality', 'HR'];
  const leads = ['James Rodriguez', 'Sarah Chen', 'Michael Brown', 'Lisa Wang'];
  const techStacks = ['React', 'Node.js', 'AWS', 'Flutter', 'Dart', 'Firebase', 'Python', 'Django'];
  const availableMembers = ['Alice Smith', 'Bob Johnson', 'Carol Williams', 'David Brown', 'Eve Davis', 'Frank Wilson', 'Grace Lee', 'Henry Taylor'];

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleNewTeamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTeam((prev: NewTeam) => ({ ...prev, [name]: value }));
  };

  const toggleTechStack = (tech: string) => {
    setNewTeam((prev: NewTeam) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t: string) => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const toggleMember = (teamId: number, member: string) => {
    setTeams(prev =>
      prev.map(team =>
        team.id === teamId
          ? {
            ...team,
            members: team.members.includes(member)
              ? team.members.filter(m => m !== member)
              : [...team.members, member]
          }
          : team
      )
    );
  };

  const createTeam = () => {
    if (!newTeam.name || !newTeam.department || !newTeam.lead) {
      alert('Please fill all required fields.');
      return;
    }
    setTeams(prev => [
      ...prev,
      {
        id: prev.length + 1,
        ...newTeam,
        projects: [],
        performance: { tasksCompleted: 0, totalTasks: 0, completionRate: 0 }
      }
    ]);
    setNewTeam({ name: '', department: '', lead: '', techStack: [], members: [] });
    setIsModalOpen(false);
  };

  const filteredTeams = teams.filter(team =>
    (!filters.department || team.department === filters.department) &&
    (!filters.lead || team.lead === filters.lead) &&
    (!filters.techStack || team.techStack.includes(filters.techStack))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-steel-900">Team Management</h1>
        <p className="text-xs text-steel-500 mt-0.5">Create and manage teams within departments</p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Filters and Actions */}
        <div className="col-span-12 mb-4">
          <div className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-500" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  className="pl-10 pr-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="">All Departments</option>
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
              <select
                name="lead"
                value={filters.lead}
                onChange={handleFilterChange}
                className="px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="">All Leads</option>
                {leads.map(lead => (
                  <option key={lead} value={lead}>{lead}</option>
                ))}
              </select>
              <select
                name="techStack"
                value={filters.techStack}
                onChange={handleFilterChange}
                className="px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="">All Tech Stacks</option>
                {techStacks.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Create Team
            </button>
          </div>
        </div>

        {/* Team List */}
        <div className="col-span-12">
          {filteredTeams.map(team => (
            <div key={team.id} className="card p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-burgundy-600" />
                  <div>
                    <h3 className="text-lg font-bold text-steel-900">{team.name}</h3>
                    <p className="text-xs text-steel-500">{team.department} | Lead: {team.lead}</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                  className="text-burgundy-600 hover:text-burgundy-700"
                  type="button"
                >
                  {expandedTeam === team.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {expandedTeam === team.id && (
                <div className="mt-4 space-y-4">
                  {/* Team Composition */}
                  <div className="card-compact bg-navy-50 border-navy-200">
                    <h4 className="text-sm font-semibold text-navy-900 mb-2">Team Composition</h4>
                    <div className="space-y-2 text-xs text-navy-800">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>Lead: {team.lead}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>Members: {team.members.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code size={14} />
                        <span>Tech Stack: {team.techStack.join(', ')}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h5 className="text-xs font-medium text-navy-700 mb-2">Manage Members</h5>
                      <div className="flex items-center gap-2">
                        <select
                          onChange={(e) => toggleMember(team.id, e.target.value)}
                          className="px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                        >
                          <option value="">Add Member</option>
                          {availableMembers
                            .filter(member => !team.members.includes(member))
                            .map(member => (
                              <option key={member} value={member}>{member}</option>
                            ))}
                        </select>
                        {team.members.map(member => (
                          <span key={member} className="badge badge-success flex items-center gap-1">
                            {member}
                            <button
                              onClick={() => toggleMember(team.id, member)}
                              className="ml-1 hover:text-danger-600"
                            >
                              <Trash2 size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Team Performance Dashboard */}
                  <div className="card-compact bg-success-50 border-success-200">
                    <h4 className="text-sm font-semibold text-success-900 mb-2 flex items-center gap-1.5">
                      <BarChart2 size={14} />
                      Team Performance
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-xs text-success-800">
                      <div>
                        <p className="font-medium">Tasks Completed</p>
                        <p>{team.performance.tasksCompleted}/{team.performance.totalTasks}</p>
                      </div>
                      <div>
                        <p className="font-medium">Completion Rate</p>
                        <p>{team.performance.completionRate}%</p>
                      </div>
                      <div>
                        <p className="font-medium">Active Projects</p>
                        <p>{team.projects.filter(p => p.status === 'In Progress').length}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-steel-100 rounded-full h-2">
                        <div
                          className="bg-success-600 h-2 rounded-full"
                          style={{ width: `${team.performance.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Allocation View */}
                  <div className="card-compact">
                    <h4 className="text-sm font-semibold text-steel-900 mb-2 flex items-center gap-1.5">
                      <Briefcase size={14} />
                      Project Allocation
                    </h4>
                    {team.projects.length > 0 ? (
                      <div className="space-y-2">
                        {team.projects.map(project => (
                          <div key={project.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Briefcase size={14} className="text-burgundy-600" />
                              <span>{project.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`badge ${project.status === 'Completed' ? 'badge-success' : 'bg-warning-50 border-warning-200 text-warning-800'}`}>
                                {project.status}
                              </span>
                              <span>{project.completion}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-steel-500">No projects assigned</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-steel-900">Create New Team</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-steel-600 hover:text-steel-900">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Team Name <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newTeam.name}
                  onChange={handleNewTeamChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  placeholder="e.g., API Team"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Department <span className="text-danger-600">*</span>
                </label>
                <select
                  name="department"
                  value={newTeam.department}
                  onChange={handleNewTeamChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">
                  Team Lead <span className="text-danger-600">*</span>
                </label>
                <select
                  name="lead"
                  value={newTeam.lead}
                  onChange={handleNewTeamChange}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                >
                  <option value="">Select Lead</option>
                  {leads.map(lead => (
                    <option key={lead} value={lead}>{lead}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">Tech Stack</label>
                <div className="grid grid-cols-2 gap-2">
                  {techStacks.map(tech => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTechStack(tech)}
                      className={`p-2 text-left rounded border transition-colors ${newTeam.techStack.includes(tech)
                        ? 'bg-burgundy-50 border-burgundy-300'
                        : 'bg-white border-steel-300 hover:border-burgundy-200'
                        }`}
                    >
                      <span className="text-sm">{tech}</span>
                      {newTeam.techStack.includes(tech) && (
                        <span className="badge badge-success text-xs ml-2">
                          <Check size={10} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-steel-700 mb-1">Members</label>
                <select
                  multiple
                  name="members"
                  value={newTeam.members}
                  onChange={(e) => setNewTeam((prev: NewTeam) => ({
                    ...prev,
                    members: Array.from(e.target.selectedOptions, option => option.value)
                  }))}
                  className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                >
                  {availableMembers.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={createTeam}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-success-600 rounded hover:bg-success-700 flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Create Team
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded hover:bg-steel-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;