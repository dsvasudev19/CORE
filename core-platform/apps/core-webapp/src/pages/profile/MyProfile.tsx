import { useState } from 'react';
import {
    User,
    Edit3,
    Camera,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    GraduationCap,
    Award,
    Star,
    Clock,
    Target,
    TrendingUp,
    Users,
    FileText,
    Settings,
    Shield,
    Save,
    X,
    Plus,
    Trash2,
    ExternalLink,
    Github,
    Linkedin,
    Twitter,
    Globe,
    Download
} from 'lucide-react';

interface Skill {
    name: string;
    level: number;
    category: string;
}

interface Experience {
    id: string;
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    current: boolean;
}

interface Education {
    id: string;
    degree: string;
    institution: string;
    startDate: Date;
    endDate: Date;
    gpa?: string;
    description?: string;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    date: Date;
    type: 'certification' | 'award' | 'milestone';
    issuer?: string;
}

const MyProfile = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'skills' | 'achievements' | 'settings'>('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: 'Sarah',
        lastName: 'Chen',
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        email: 'sarah.chen@company.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: 'Passionate frontend developer with 5+ years of experience building scalable web applications. Specialized in React, TypeScript, and modern web technologies. Love mentoring junior developers and contributing to open source projects.',
        joinDate: new Date('2019-03-15'),
        birthday: new Date('1992-08-22'),
        manager: 'John Smith',
        employeeId: 'EMP-2019-0342',
        avatar: null as string | null,
        socialLinks: {
            github: 'https://github.com/sarahchen',
            linkedin: 'https://linkedin.com/in/sarahchen',
            twitter: 'https://twitter.com/sarahchen',
            website: 'https://sarahchen.dev'
        }
    });

    const [skills] = useState<Skill[]>([
        { name: 'React', level: 95, category: 'Frontend' },
        { name: 'TypeScript', level: 90, category: 'Programming' },
        { name: 'JavaScript', level: 95, category: 'Programming' },
        { name: 'Node.js', level: 80, category: 'Backend' },
        { name: 'CSS/SCSS', level: 90, category: 'Frontend' },
        { name: 'Python', level: 75, category: 'Programming' },
        { name: 'GraphQL', level: 85, category: 'API' },
        { name: 'AWS', level: 70, category: 'Cloud' },
        { name: 'Docker', level: 75, category: 'DevOps' },
        { name: 'Git', level: 90, category: 'Tools' },
        { name: 'Figma', level: 80, category: 'Design' },
        { name: 'Project Management', level: 85, category: 'Soft Skills' }
    ]);

    const [experiences] = useState<Experience[]>([
        {
            id: '1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp Inc.',
            startDate: new Date('2021-06-01'),
            current: true,
            description: 'Lead frontend development for multiple high-traffic web applications. Mentor junior developers and establish best practices for the team.'
        },
        {
            id: '2',
            title: 'Frontend Developer',
            company: 'StartupXYZ',
            startDate: new Date('2019-03-15'),
            endDate: new Date('2021-05-31'),
            current: false,
            description: 'Developed responsive web applications using React and modern JavaScript. Collaborated with design and backend teams to deliver user-friendly interfaces.'
        },
        {
            id: '3',
            title: 'Junior Web Developer',
            company: 'WebSolutions Ltd.',
            startDate: new Date('2018-01-10'),
            endDate: new Date('2019-03-10'),
            current: false,
            description: 'Built and maintained client websites using HTML, CSS, and JavaScript. Gained experience in responsive design and cross-browser compatibility.'
        }
    ]);

    const [education] = useState<Education[]>([
        {
            id: '1',
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of California, Berkeley',
            startDate: new Date('2014-09-01'),
            endDate: new Date('2018-05-15'),
            gpa: '3.8',
            description: 'Focused on software engineering and web development. Graduated Magna Cum Laude.'
        }
    ]);

    const [achievements] = useState<Achievement[]>([
        {
            id: '1',
            title: 'AWS Certified Developer',
            description: 'Associate level certification for AWS cloud development',
            date: new Date('2023-08-15'),
            type: 'certification',
            issuer: 'Amazon Web Services'
        },
        {
            id: '2',
            title: 'Employee of the Month',
            description: 'Recognized for outstanding performance in Q2 2023',
            date: new Date('2023-06-30'),
            type: 'award',
            issuer: 'TechCorp Inc.'
        },
        {
            id: '3',
            title: '1000+ GitHub Contributions',
            description: 'Reached milestone of 1000+ contributions to open source projects',
            date: new Date('2023-12-01'),
            type: 'milestone'
        }
    ]);

    const stats = {
        projectsCompleted: 24,
        tasksCompleted: 342,
        hoursWorked: 1840,
        teamMembers: 8,
        yearsExperience: 5.5,
        certifications: achievements.filter(a => a.type === 'certification').length
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    const formatFullDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getSkillColor = (level: number) => {
        if (level >= 90) return 'bg-green-500';
        if (level >= 80) return 'bg-blue-500';
        if (level >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getAchievementIcon = (type: string) => {
        switch (type) {
            case 'certification':
                return <Award size={20} className="text-blue-600" />;
            case 'award':
                return <Star size={20} className="text-yellow-600" />;
            case 'milestone':
                return <Target size={20} className="text-green-600" />;
            default:
                return <Award size={20} className="text-steel-600" />;
        }
    };

    const skillCategories = [...new Set(skills.map(skill => skill.category))];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                {/* Cover Photo */}
                <div className="h-32 bg-gradient-to-r from-burgundy-600 to-burgundy-800 relative">
                    <button className="absolute top-4 right-4 p-2 bg-black bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors">
                        <Camera size={16} />
                    </button>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 relative">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 bg-steel-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                    {profileData.avatar ? (
                                        <img
                                            src={profileData.avatar}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User size={48} className="text-steel-400" />
                                    )}
                                </div>
                                <button className="absolute bottom-2 right-2 p-2 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 transition-colors shadow-lg">
                                    <Camera size={14} />
                                </button>
                            </div>

                            {/* Basic Info */}
                            <div className="pb-4">
                                <h1 className="text-2xl font-bold text-steel-900">
                                    {profileData.firstName} {profileData.lastName}
                                </h1>
                                <p className="text-lg text-steel-600 mb-2">{profileData.title}</p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-steel-500">
                                    <span className="flex items-center gap-1">
                                        <Briefcase size={14} />
                                        {profileData.department}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {profileData.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        Joined {formatDate(profileData.joinDate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                            <button className="btn-secondary">
                                <Download size={16} />
                                Export Resume
                            </button>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="btn-primary"
                            >
                                <Edit3 size={16} />
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-lg border border-steel-200 p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Target size={24} className="text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-steel-900">{stats.projectsCompleted}</p>
                    <p className="text-sm text-steel-600">Projects</p>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <FileText size={24} className="text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-steel-900">{stats.tasksCompleted}</p>
                    <p className="text-sm text-steel-600">Tasks</p>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Clock size={24} className="text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-steel-900">{stats.hoursWorked}</p>
                    <p className="text-sm text-steel-600">Hours</p>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Users size={24} className="text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-steel-900">{stats.teamMembers}</p>
                    <p className="text-sm text-steel-600">Team Size</p>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <TrendingUp size={24} className="text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-steel-900">{stats.yearsExperience}</p>
                    <p className="text-sm text-steel-600">Years Exp</p>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4 text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Award size={24} className="text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-steel-900">{stats.certifications}</p>
                    <p className="text-sm text-steel-600">Certificates</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-steel-200">
                <nav className="flex space-x-8">
                    {[
                        { key: 'overview', label: 'Overview', icon: User },
                        { key: 'experience', label: 'Experience', icon: Briefcase },
                        { key: 'skills', label: 'Skills', icon: Target },
                        { key: 'achievements', label: 'Achievements', icon: Award },
                        { key: 'settings', label: 'Settings', icon: Settings }
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as any)}
                            className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === key
                                ? 'border-burgundy-600 text-burgundy-600'
                                : 'border-transparent text-steel-500 hover:text-steel-700 hover:border-steel-300'
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {activeTab === 'overview' && (
                    <>
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About */}
                            <div className="bg-white rounded-lg border border-steel-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-steel-900">About</h3>
                                    {isEditing && (
                                        <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                            <Edit3 size={16} className="text-steel-600" />
                                        </button>
                                    )}
                                </div>
                                {isEditing ? (
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-steel-700 leading-relaxed">{profileData.bio}</p>
                                )}
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-lg border border-steel-200 p-6">
                                <h3 className="text-lg font-semibold text-steel-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <Target size={16} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-steel-900">Completed "API Integration" task</p>
                                            <p className="text-xs text-steel-500">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FileText size={16} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-steel-900">Updated project documentation</p>
                                            <p className="text-xs text-steel-500">1 day ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Award size={16} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-steel-900">Earned AWS Developer certification</p>
                                            <p className="text-xs text-steel-500">3 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Contact Info */}
                            <div className="bg-white rounded-lg border border-steel-200 p-6">
                                <h3 className="text-lg font-semibold text-steel-900 mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail size={16} className="text-steel-500" />
                                        <span className="text-sm text-steel-700">{profileData.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={16} className="text-steel-500" />
                                        <span className="text-sm text-steel-700">{profileData.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin size={16} className="text-steel-500" />
                                        <span className="text-sm text-steel-700">{profileData.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <User size={16} className="text-steel-500" />
                                        <span className="text-sm text-steel-700">Reports to {profileData.manager}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-white rounded-lg border border-steel-200 p-6">
                                <h3 className="text-lg font-semibold text-steel-900 mb-4">Social Links</h3>
                                <div className="space-y-3">
                                    <a
                                        href={profileData.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-sm text-steel-700 hover:text-burgundy-600 transition-colors"
                                    >
                                        <Github size={16} />
                                        GitHub
                                        <ExternalLink size={12} className="ml-auto" />
                                    </a>
                                    <a
                                        href={profileData.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-sm text-steel-700 hover:text-burgundy-600 transition-colors"
                                    >
                                        <Linkedin size={16} />
                                        LinkedIn
                                        <ExternalLink size={12} className="ml-auto" />
                                    </a>
                                    <a
                                        href={profileData.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-sm text-steel-700 hover:text-burgundy-600 transition-colors"
                                    >
                                        <Twitter size={16} />
                                        Twitter
                                        <ExternalLink size={12} className="ml-auto" />
                                    </a>
                                    <a
                                        href={profileData.socialLinks.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-sm text-steel-700 hover:text-burgundy-600 transition-colors"
                                    >
                                        <Globe size={16} />
                                        Website
                                        <ExternalLink size={12} className="ml-auto" />
                                    </a>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-lg border border-steel-200 p-6">
                                <h3 className="text-lg font-semibold text-steel-900 mb-4">Quick Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-steel-600">Employee ID</span>
                                        <span className="text-sm font-medium text-steel-900">{profileData.employeeId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-steel-600">Birthday</span>
                                        <span className="text-sm font-medium text-steel-900">{formatFullDate(profileData.birthday)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-steel-600">Years at Company</span>
                                        <span className="text-sm font-medium text-steel-900">
                                            {Math.floor((new Date().getTime() - profileData.joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'experience' && (
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg border border-steel-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-steel-900">Work Experience</h3>
                                {isEditing && (
                                    <button className="btn-secondary">
                                        <Plus size={16} />
                                        Add Experience
                                    </button>
                                )}
                            </div>
                            <div className="space-y-6">
                                {experiences.map((exp, index) => (
                                    <div key={exp.id} className="relative">
                                        {index < experiences.length - 1 && (
                                            <div className="absolute left-6 top-12 w-0.5 h-full bg-steel-200"></div>
                                        )}
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Briefcase size={20} className="text-burgundy-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-steel-900">{exp.title}</h4>
                                                        <p className="text-burgundy-600 font-medium">{exp.company}</p>
                                                        <p className="text-sm text-steel-500">
                                                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                                                            {exp.current && (
                                                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                                                    Current
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    {isEditing && (
                                                        <div className="flex items-center gap-2">
                                                            <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                                <Edit3 size={14} className="text-steel-600" />
                                                            </button>
                                                            <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                                <Trash2 size={14} className="text-red-600" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-steel-700 mt-2 leading-relaxed">{exp.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="bg-white rounded-lg border border-steel-200 p-6 mt-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-steel-900">Education</h3>
                                {isEditing && (
                                    <button className="btn-secondary">
                                        <Plus size={16} />
                                        Add Education
                                    </button>
                                )}
                            </div>
                            <div className="space-y-6">
                                {education.map((edu) => (
                                    <div key={edu.id} className="flex gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <GraduationCap size={20} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-steel-900">{edu.degree}</h4>
                                                    <p className="text-burgundy-600 font-medium">{edu.institution}</p>
                                                    <p className="text-sm text-steel-500">
                                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                                        {edu.gpa && (
                                                            <span className="ml-2">• GPA: {edu.gpa}</span>
                                                        )}
                                                    </p>
                                                </div>
                                                {isEditing && (
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                            <Edit3 size={14} className="text-steel-600" />
                                                        </button>
                                                        <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                            <Trash2 size={14} className="text-red-600" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {edu.description && (
                                                <p className="text-steel-700 mt-2 leading-relaxed">{edu.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg border border-steel-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-steel-900">Skills & Expertise</h3>
                                {isEditing && (
                                    <button className="btn-secondary">
                                        <Plus size={16} />
                                        Add Skill
                                    </button>
                                )}
                            </div>

                            {skillCategories.map(category => (
                                <div key={category} className="mb-8">
                                    <h4 className="font-medium text-steel-900 mb-4">{category}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {skills
                                            .filter(skill => skill.category === category)
                                            .map(skill => (
                                                <div key={skill.name} className="flex items-center justify-between p-3 border border-steel-200 rounded-lg">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium text-steel-900">{skill.name}</span>
                                                            <span className="text-sm font-medium text-steel-600">{skill.level}%</span>
                                                        </div>
                                                        <div className="w-full bg-steel-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full transition-all duration-300 ${getSkillColor(skill.level)}`}
                                                                style={{ width: `${skill.level}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    {isEditing && (
                                                        <div className="flex items-center gap-2 ml-4">
                                                            <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                                <Edit3 size={14} className="text-steel-600" />
                                                            </button>
                                                            <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                                <Trash2 size={14} className="text-red-600" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg border border-steel-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-steel-900">Achievements & Certifications</h3>
                                {isEditing && (
                                    <button className="btn-secondary">
                                        <Plus size={16} />
                                        Add Achievement
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {achievements.map(achievement => (
                                    <div key={achievement.id} className="border border-steel-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                {getAchievementIcon(achievement.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-steel-900">{achievement.title}</h4>
                                                        {achievement.issuer && (
                                                            <p className="text-sm text-burgundy-600 font-medium">{achievement.issuer}</p>
                                                        )}
                                                        <p className="text-sm text-steel-500">{formatFullDate(achievement.date)}</p>
                                                    </div>
                                                    {isEditing && (
                                                        <div className="flex items-center gap-2">
                                                            <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                                <Edit3 size={14} className="text-steel-600" />
                                                            </button>
                                                            <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                                <Trash2 size={14} className="text-red-600" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-steel-700 mt-2 text-sm">{achievement.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {/* Privacy Settings */}
                            <div className="bg-white rounded-lg border border-steel-200 p-6">
                                <h3 className="text-lg font-semibold text-steel-900 mb-4">Privacy Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-steel-900">Profile Visibility</p>
                                            <p className="text-sm text-steel-600">Control who can see your profile information</p>
                                        </div>
                                        <select className="px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300">
                                            <option>Everyone</option>
                                            <option>Team Members Only</option>
                                            <option>Private</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-steel-900">Show Contact Information</p>
                                            <p className="text-sm text-steel-600">Display email and phone number</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-burgundy-600 transition-colors">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-steel-900">Activity Status</p>
                                            <p className="text-sm text-steel-600">Show when you're online</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-burgundy-600 transition-colors">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Notification Settings */}
                            <div className="bg-white rounded-lg border border-steel-200 p-6">
                                <h3 className="text-lg font-semibold text-steel-900 mb-4">Notification Preferences</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-steel-900">Email Notifications</p>
                                            <p className="text-sm text-steel-600">Receive updates via email</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-burgundy-600 transition-colors">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-steel-900">Push Notifications</p>
                                            <p className="text-sm text-steel-600">Browser and mobile notifications</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-steel-300 transition-colors">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-steel-900">Weekly Summary</p>
                                            <p className="text-sm text-steel-600">Weekly activity digest</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-burgundy-600 transition-colors">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Account Actions */}
                            <div className="bg-white rounded-lg border border-steel-200 p-6">
                                <h3 className="text-lg font-semibold text-steel-900 mb-4">Account Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Download size={16} className="text-steel-600" />
                                            <div>
                                                <p className="font-medium text-steel-900">Export Data</p>
                                                <p className="text-sm text-steel-600">Download your profile data</p>
                                            </div>
                                        </div>
                                    </button>
                                    <button className="w-full text-left p-3 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Shield size={16} className="text-steel-600" />
                                            <div>
                                                <p className="font-medium text-steel-900">Change Password</p>
                                                <p className="text-sm text-steel-600">Update your account password</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Changes Button */}
            {isEditing && (
                <div className="fixed bottom-6 right-6 flex items-center gap-3">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-steel-600 text-white rounded-lg hover:bg-steel-700 transition-colors"
                    >
                        <X size={16} className="inline mr-2" />
                        Cancel
                    </button>
                    <button className="px-6 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors shadow-lg">
                        <Save size={16} className="inline mr-2" />
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyProfile;