import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Search,
    Mail,
    MessageSquare,
    Video,
    Calendar,
    MoreVertical,
    Star,
    MapPin,
    Briefcase,
    Clock,
    Target,
    User,
    Grid,
    List,
    UserPlus,
    Settings,
    Crown,
    Shield,
    Activity,
    Coffee
} from 'lucide-react';

interface TeamMember {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    department: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: 'manager' | 'lead' | 'senior' | 'junior' | 'intern';
    status: 'online' | 'away' | 'busy' | 'offline';
    location: string;
    joinDate: Date;
    skills: string[];
    currentProjects: number;
    completedTasks: number;
    hoursThisWeek: number;
    isStarred: boolean;
    lastActive: Date;
    timezone: string;
    workingHours: string;
}

const MyTeam = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        {
            id: '1',
            firstName: 'John',
            lastName: 'Smith',
            title: 'Engineering Manager',
            department: 'Engineering',
            email: 'john.smith@company.com',
            phone: '+1 (555) 123-4567',
            role: 'manager',
            status: 'online',
            location: 'San Francisco, CA',
            joinDate: new Date('2020-01-15'),
            skills: ['Leadership', 'React', 'Node.js', 'Team Management'],
            currentProjects: 3,
            completedTasks: 156,
            hoursThisWeek: 42,
            isStarred: true,
            lastActive: new Date(),
            timezone: 'PST',
            workingHours: '9:00 AM - 6:00 PM'
        },
        {
            id: '2',
            firstName: 'Sarah',
            lastName: 'Chen',
            title: 'Senior Frontend Developer',
            department: 'Engineering',
            email: 'sarah.chen@company.com',
            phone: '+1 (555) 234-5678',
            role: 'senior',
            status: 'online',
            location: 'San Francisco, CA',
            joinDate: new Date('2019-03-15'),
            skills: ['React', 'TypeScript', 'CSS', 'UI/UX'],
            currentProjects: 2,
            completedTasks: 234,
            hoursThisWeek: 38,
            isStarred: false,
            lastActive: new Date(Date.now() - 5 * 60 * 1000),
            timezone: 'PST',
            workingHours: '9:00 AM - 6:00 PM'
        },
        {
            id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            title: 'Backend Developer',
            department: 'Engineering',
            email: 'mike.johnson@company.com',
            role: 'senior',
            status: 'busy',
            location: 'Austin, TX',
            joinDate: new Date('2021-06-01'),
            skills: ['Node.js', 'Python', 'AWS', 'Docker'],
            currentProjects: 2,
            completedTasks: 189,
            hoursThisWeek: 40,
            isStarred: true,
            lastActive: new Date(Date.now() - 30 * 60 * 1000),
            timezone: 'CST',
            workingHours: '8:00 AM - 5:00 PM'
        },
        {
            id: '4',
            firstName: 'Lisa',
            lastName: 'Wang',
            title: 'UI/UX Designer',
            department: 'Design',
            email: 'lisa.wang@company.com',
            role: 'senior',
            status: 'away',
            location: 'New York, NY',
            joinDate: new Date('2020-09-10'),
            skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
            currentProjects: 3,
            completedTasks: 167,
            hoursThisWeek: 35,
            isStarred: false,
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
            timezone: 'EST',
            workingHours: '10:00 AM - 7:00 PM'
        },
        {
            id: '5',
            firstName: 'Alex',
            lastName: 'Rodriguez',
            title: 'Junior Developer',
            department: 'Engineering',
            email: 'alex.rodriguez@company.com',
            role: 'junior',
            status: 'online',
            location: 'Remote',
            joinDate: new Date('2023-01-15'),
            skills: ['JavaScript', 'React', 'Git', 'HTML/CSS'],
            currentProjects: 1,
            completedTasks: 45,
            hoursThisWeek: 40,
            isStarred: false,
            lastActive: new Date(Date.now() - 10 * 60 * 1000),
            timezone: 'MST',
            workingHours: '9:00 AM - 6:00 PM'
        },
        {
            id: '6',
            firstName: 'Emma',
            lastName: 'Thompson',
            title: 'Product Manager',
            department: 'Product',
            email: 'emma.thompson@company.com',
            role: 'lead',
            status: 'offline',
            location: 'Seattle, WA',
            joinDate: new Date('2018-11-20'),
            skills: ['Product Strategy', 'Analytics', 'Agile', 'Stakeholder Management'],
            currentProjects: 4,
            completedTasks: 298,
            hoursThisWeek: 0,
            isStarred: true,
            lastActive: new Date(Date.now() - 18 * 60 * 60 * 1000),
            timezone: 'PST',
            workingHours: '8:30 AM - 5:30 PM'
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const departments = ['all', 'Engineering', 'Design', 'Product', 'Marketing', 'Sales'];
    const statuses = ['all', 'online', 'away', 'busy', 'offline'];
    const roles = ['all', 'manager', 'lead', 'senior', 'junior', 'intern'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'away':
                return 'bg-yellow-500';
            case 'busy':
                return 'bg-red-500';
            case 'offline':
                return 'bg-steel-400';
            default:
                return 'bg-steel-400';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'manager':
                return <Crown size={14} className="text-yellow-600" />;
            case 'lead':
                return <Shield size={14} className="text-blue-600" />;
            case 'senior':
                return <Star size={14} className="text-purple-600" />;
            case 'junior':
                return <User size={14} className="text-green-600" />;
            case 'intern':
                return <Coffee size={14} className="text-orange-600" />;
            default:
                return <User size={14} className="text-steel-600" />;
        }
    };

    const getRoleBadge = (role: string) => {
        const colors = {
            manager: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            lead: 'bg-blue-100 text-blue-700 border-blue-200',
            senior: 'bg-purple-100 text-purple-700 border-purple-200',
            junior: 'bg-green-100 text-green-700 border-green-200',
            intern: 'bg-orange-100 text-orange-700 border-orange-200'
        };

        return (
            <span className={`px-2 py-1 text-xs rounded-full font-medium border ${colors[role as keyof typeof colors] || 'bg-steel-100 text-steel-700 border-steel-200'}`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
        );
    };

    const formatLastActive = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const filteredMembers = teamMembers.filter(member => {
        const matchesSearch =
            member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
        const matchesRole = roleFilter === 'all' || member.role === roleFilter;

        return matchesSearch && matchesDepartment && matchesStatus && matchesRole;
    });

    const toggleStarred = (memberId: string) => {
        setTeamMembers(prev => prev.map(member =>
            member.id === memberId ? { ...member, isStarred: !member.isStarred } : member
        ));
    };

    const teamStats = {
        totalMembers: teamMembers.length,
        onlineMembers: teamMembers.filter(m => m.status === 'online').length,
        activeProjects: teamMembers.reduce((sum, m) => sum + m.currentProjects, 0),
        totalHours: teamMembers.reduce((sum, m) => sum + m.hoursThisWeek, 0)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-steel-900 flex items-center gap-3">
                        <Users size={28} className="text-burgundy-600" />
                        My Team
                    </h1>
                    <p className="text-steel-600 mt-1">
                        Collaborate and connect with your team members
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Settings size={16} />
                        Team Settings
                    </button>
                    <button className="btn-primary">
                        <UserPlus size={16} />
                        Invite Member
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Total Members</p>
                            <p className="text-2xl font-bold text-steel-900">{teamStats.totalMembers}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users size={24} className="text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Online Now</p>
                            <p className="text-2xl font-bold text-steel-900">{teamStats.onlineMembers}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Activity size={24} className="text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Active Projects</p>
                            <p className="text-2xl font-bold text-steel-900">{teamStats.activeProjects}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Target size={24} className="text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Hours This Week</p>
                            <p className="text-2xl font-bold text-steel-900">{teamStats.totalHours}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock size={24} className="text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-steel-200 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search team members, skills..."
                                className="w-full pl-10 pr-4 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>
                                    {dept === 'all' ? 'All Departments' : dept}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>
                                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* View Mode Toggle */}
                        <div className="flex items-center border border-steel-200 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 ${viewMode === 'grid' ? 'bg-burgundy-50 text-burgundy-600' : 'text-steel-600 hover:bg-steel-50'} transition-colors`}
                            >
                                <Grid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 ${viewMode === 'list' ? 'bg-burgundy-50 text-burgundy-600' : 'text-steel-600 hover:bg-steel-50'} transition-colors`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Members Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                        <div key={member.id} className="bg-white rounded-lg border border-steel-200 hover:shadow-lg transition-shadow duration-200">
                            {/* Member Header */}
                            <div className="p-6 pb-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-steel-100 rounded-full flex items-center justify-center">
                                                {member.avatar ? (
                                                    <img
                                                        src={member.avatar}
                                                        alt={`${member.firstName} ${member.lastName}`}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={24} className="text-steel-400" />
                                                )}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-steel-900">
                                                {member.firstName} {member.lastName}
                                            </h3>
                                            <p className="text-sm text-steel-600">{member.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getRoleIcon(member.role)}
                                                {getRoleBadge(member.role)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleStarred(member.id)}
                                            className="p-1 hover:bg-steel-100 rounded transition-colors"
                                        >
                                            <Star size={16} className={member.isStarred ? 'text-yellow-500 fill-current' : 'text-steel-400'} />
                                        </button>
                                        <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                            <MoreVertical size={16} className="text-steel-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-steel-600">
                                        <Mail size={14} />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-steel-600">
                                        <MapPin size={14} />
                                        <span>{member.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-steel-600">
                                        <Briefcase size={14} />
                                        <span>{member.department}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-steel-900">{member.currentProjects}</p>
                                        <p className="text-xs text-steel-600">Projects</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-steel-900">{member.completedTasks}</p>
                                        <p className="text-xs text-steel-600">Tasks</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-steel-900">{member.hoursThisWeek}h</p>
                                        <p className="text-xs text-steel-600">This Week</p>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-steel-700 mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-1">
                                        {member.skills.slice(0, 3).map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-steel-100 text-steel-600 text-xs rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {member.skills.length > 3 && (
                                            <span className="px-2 py-1 bg-steel-100 text-steel-600 text-xs rounded-full">
                                                +{member.skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Last Active */}
                                <div className="text-xs text-steel-500 mb-4">
                                    Last active: {formatLastActive(member.lastActive)}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 py-4 border-t border-steel-100 bg-steel-25">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors">
                                            <MessageSquare size={14} />
                                        </button>
                                        <button className="p-2 border border-steel-200 text-steel-600 rounded-lg hover:bg-steel-50 transition-colors">
                                            <Mail size={14} />
                                        </button>
                                        <button className="p-2 border border-steel-200 text-steel-600 rounded-lg hover:bg-steel-50 transition-colors">
                                            <Video size={14} />
                                        </button>
                                        <button className="p-2 border border-steel-200 text-steel-600 rounded-lg hover:bg-steel-50 transition-colors">
                                            <Calendar size={14} />
                                        </button>
                                    </div>
                                    <Link
                                        to={`/e/team/${member.id}`}
                                        className="text-xs px-3 py-1.5 bg-steel-100 text-steel-700 rounded hover:bg-steel-200 transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-steel-50 border-b border-steel-200">
                                <tr>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Member</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Role</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Department</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Status</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Projects</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Hours</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-steel-100">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-steel-25 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-steel-100 rounded-full flex items-center justify-center">
                                                        {member.avatar ? (
                                                            <img
                                                                src={member.avatar}
                                                                alt={`${member.firstName} ${member.lastName}`}
                                                                className="w-full h-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <User size={16} className="text-steel-400" />
                                                        )}
                                                    </div>
                                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                                                </div>
                                                <div>
                                                    <Link
                                                        to={`/e/team/${member.id}`}
                                                        className="font-medium text-steel-900 hover:text-burgundy-600 transition-colors"
                                                    >
                                                        {member.firstName} {member.lastName}
                                                    </Link>
                                                    <p className="text-sm text-steel-600">{member.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {member.isStarred && (
                                                            <Star size={12} className="text-yellow-500 fill-current" />
                                                        )}
                                                        <span className="text-xs text-steel-500">{member.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(member.role)}
                                                {getRoleBadge(member.role)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-steel-700">{member.department}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 ${getStatusColor(member.status)} rounded-full`}></div>
                                                <span className="text-sm text-steel-700 capitalize">{member.status}</span>
                                            </div>
                                            <div className="text-xs text-steel-500">
                                                {formatLastActive(member.lastActive)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-steel-700">{member.currentProjects}</div>
                                            <div className="text-xs text-steel-500">{member.completedTasks} completed</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-steel-700">{member.hoursThisWeek}h</div>
                                            <div className="text-xs text-steel-500">this week</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                    <MessageSquare size={16} className="text-steel-600" />
                                                </button>
                                                <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                    <Mail size={16} className="text-steel-600" />
                                                </button>
                                                <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                    <Video size={16} className="text-steel-600" />
                                                </button>
                                                <button
                                                    onClick={() => toggleStarred(member.id)}
                                                    className="p-1 hover:bg-steel-100 rounded transition-colors"
                                                >
                                                    <Star size={16} className={member.isStarred ? 'text-yellow-500 fill-current' : 'text-steel-400'} />
                                                </button>
                                                <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                    <MoreVertical size={16} className="text-steel-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                    <Users size={48} className="text-steel-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-steel-900 mb-2">No team members found</h3>
                    <p className="text-steel-600 mb-6">
                        {searchQuery || departmentFilter !== 'all' || statusFilter !== 'all' || roleFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Invite team members to get started'
                        }
                    </p>
                    <button className="btn-primary">
                        <UserPlus size={16} />
                        Invite Team Member
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyTeam;