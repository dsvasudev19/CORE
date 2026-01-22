import { useState } from 'react';
import {
    BookOpen,
    Clock,
    Users,
    TrendingUp,
    Calendar,
    Filter,
    Search,
    Plus,
    Play,
    CheckCircle,
    MoreVertical,
    Download
} from 'lucide-react';

const TrainingDevelopment = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'completed'>('all');

    const stats = [
        { label: 'Total Courses', value: '48', change: '+6', icon: BookOpen, color: 'bg-blue-500' },
        { label: 'Active Learners', value: '186', change: '+24', icon: Users, color: 'bg-green-500' },
        { label: 'Completed', value: '342', change: '+45', icon: CheckCircle, color: 'bg-purple-500' },
        { label: 'Avg Progress', value: '68%', change: '+12%', icon: TrendingUp, color: 'bg-orange-500' }
    ];

    const courses = [
        {
            id: 1,
            title: 'Advanced React Development',
            category: 'Technical',
            instructor: 'Sarah Mitchell',
            duration: '8 weeks',
            enrolled: 24,
            completed: 18,
            progress: 75,
            status: 'Ongoing',
            startDate: '2024-10-01',
            endDate: '2024-11-26',
            level: 'Advanced'
        },
        {
            id: 2,
            title: 'Leadership & Management',
            category: 'Soft Skills',
            instructor: 'John Smith',
            duration: '6 weeks',
            enrolled: 32,
            completed: 28,
            progress: 88,
            status: 'Ongoing',
            startDate: '2024-10-15',
            endDate: '2024-11-30',
            level: 'Intermediate'
        },
        {
            id: 3,
            title: 'Cloud Architecture (AWS)',
            category: 'Technical',
            instructor: 'Michael Brown',
            duration: '10 weeks',
            enrolled: 18,
            completed: 18,
            progress: 100,
            status: 'Completed',
            startDate: '2024-08-01',
            endDate: '2024-10-10',
            level: 'Advanced'
        },
        {
            id: 4,
            title: 'Effective Communication',
            category: 'Soft Skills',
            instructor: 'Emily Chen',
            duration: '4 weeks',
            enrolled: 45,
            completed: 12,
            progress: 27,
            status: 'Ongoing',
            startDate: '2024-11-01',
            endDate: '2024-11-29',
            level: 'Beginner'
        },
        {
            id: 5,
            title: 'Data Science Fundamentals',
            category: 'Technical',
            instructor: 'Lisa Wang',
            duration: '12 weeks',
            enrolled: 28,
            completed: 0,
            progress: 0,
            status: 'Upcoming',
            startDate: '2024-12-01',
            endDate: '2025-02-23',
            level: 'Intermediate'
        }
    ];

    const employeeProgress = [
        {
            id: 1,
            empId: 'EMP001',
            name: 'Sarah Mitchell',
            department: 'Engineering',
            coursesEnrolled: 3,
            coursesCompleted: 2,
            hoursSpent: 45,
            certificates: 2,
            lastActivity: '2 hours ago'
        },
        {
            id: 2,
            empId: 'EMP002',
            name: 'James Rodriguez',
            department: 'Engineering',
            coursesEnrolled: 4,
            coursesCompleted: 3,
            hoursSpent: 62,
            certificates: 3,
            lastActivity: '1 day ago'
        },
        {
            id: 3,
            empId: 'EMP003',
            name: 'Emily Chen',
            department: 'Design',
            coursesEnrolled: 2,
            coursesCompleted: 1,
            hoursSpent: 28,
            certificates: 1,
            lastActivity: '3 hours ago'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Ongoing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Upcoming': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner': return 'bg-green-50 text-green-700';
            case 'Intermediate': return 'bg-blue-50 text-blue-700';
            case 'Advanced': return 'bg-purple-50 text-purple-700';
            default: return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Training & Development</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage employee learning and skill development</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Download size={14} />
                            Export Report
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5">
                            <Plus size={14} />
                            Add Course
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
                                    <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                                        <TrendingUp size={12} />
                                        {stat.change} this month
                                    </p>
                                </div>
                                <div className={`${stat.color} p-2 rounded`}>
                                    <stat.icon size={18} className="text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs & Filters */}
                <div className="bg-white rounded border border-gray-200">
                    <div className="flex border-b border-gray-200">
                        {[
                            { key: 'all', label: 'All Courses', count: 48 },
                            { key: 'ongoing', label: 'Ongoing', count: 28 },
                            { key: 'completed', label: 'Completed', count: 20 }
                        ].map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === key
                                    ? 'text-burgundy-600 border-b-2 border-burgundy-600 bg-burgundy-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {label}
                                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="p-3 flex gap-2 items-center">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            />
                        </div>
                        <select className="text-sm border border-gray-300 rounded px-3 py-1.5">
                            <option>All Categories</option>
                            <option>Technical</option>
                            <option>Soft Skills</option>
                            <option>Leadership</option>
                        </select>
                        <select className="text-sm border border-gray-300 rounded px-3 py-1.5">
                            <option>All Levels</option>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Filter size={14} />
                            More
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                {/* Courses List */}
                <div className="col-span-8">
                    <div className="bg-white rounded border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900">Training Courses</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {courses.map((course) => (
                                <div key={course.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold text-gray-900">{course.title}</h4>
                                                <span className={`px-2 py-0.5 rounded text-xs ${getLevelColor(course.level)}`}>
                                                    {course.level}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <BookOpen size={12} />
                                                    {course.category}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={12} />
                                                    {course.enrolled} enrolled
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {course.duration}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {course.startDate} - {course.endDate}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                                                {course.status}
                                            </span>
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <MoreVertical size={14} className="text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-medium text-gray-900">{course.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-burgundy-600 h-1.5 rounded-full transition-all"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <button className="ml-4 px-3 py-1.5 text-xs font-medium text-burgundy-600 hover:bg-burgundy-50 rounded flex items-center gap-1">
                                            <Play size={12} />
                                            View Course
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Employee Progress */}
                <div className="col-span-4">
                    <div className="bg-white rounded border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Top Learners</h3>
                            <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium">
                                View All
                            </button>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {employeeProgress.map((emp) => (
                                <div key={emp.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">
                                            {emp.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">{emp.name}</h4>
                                            <p className="text-xs text-gray-500">{emp.department}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-blue-50 rounded p-2">
                                            <p className="text-blue-600 font-semibold">{emp.coursesCompleted}/{emp.coursesEnrolled}</p>
                                            <p className="text-blue-700">Completed</p>
                                        </div>
                                        <div className="bg-green-50 rounded p-2">
                                            <p className="text-green-600 font-semibold">{emp.certificates}</p>
                                            <p className="text-green-700">Certificates</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock size={10} />
                                            {emp.hoursSpent}h spent
                                        </span>
                                        <span>{emp.lastActivity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingDevelopment;
