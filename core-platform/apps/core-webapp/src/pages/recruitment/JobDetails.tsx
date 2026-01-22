import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    DollarSign,
    Briefcase,
    Clock,
    Bookmark
} from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'candidates'>('description');

    const job = {
        id: id || '1',
        title: 'Senior Full Stack Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        salary: '$120K - $150K',
        posted: new Date('2024-11-15'),
        applicants: 45,
        shortlisted: 8,
        interviewed: 3,
        status: 'Active',
        urgency: 'High',
        description: `We are seeking an experienced Senior Full Stack Developer to join our growing engineering team. You will be responsible for designing, developing, and maintaining scalable web applications.`,
        responsibilities: [
            'Design and develop full-stack web applications',
            'Collaborate with cross-functional teams',
            'Write clean, maintainable code',
            'Mentor junior developers',
            'Participate in code reviews'
        ],
        requirements: [
            '5+ years of full-stack development experience',
            'Strong proficiency in React and Node.js',
            'Experience with PostgreSQL or similar databases',
            'Excellent problem-solving skills',
            'Strong communication skills'
        ],
        benefits: [
            'Competitive salary and equity',
            'Health, dental, and vision insurance',
            'Flexible work hours',
            'Remote work options',
            'Professional development budget'
        ]
    };

    const candidates = [
        { id: '1', name: 'John Smith', status: 'Interviewed', score: 85, appliedDate: '2024-11-16' },
        { id: '2', name: 'Sarah Johnson', status: 'Shortlisted', score: 78, appliedDate: '2024-11-17' },
        { id: '3', name: 'Mike Wilson', status: 'New', score: 72, appliedDate: '2024-11-20' }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link to="/a/recruitment" className="flex items-center gap-2 text-steel-600 hover:text-steel-900">
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Recruitment</span>
                </Link>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50">
                        Edit Job
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded-lg hover:bg-burgundy-700">
                        Close Position
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-steel-200 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-steel-900 mb-2">{job.title}</h1>
                        <div className="flex items-center gap-4 text-steel-600">
                            <div className="flex items-center gap-1">
                                <Briefcase size={16} />
                                {job.department}
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign size={16} />
                                {job.salary}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                {job.type}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className="p-2 hover:bg-steel-100 rounded-lg"
                    >
                        <Bookmark size={20} className={isBookmarked ? 'fill-burgundy-600 text-burgundy-600' : 'text-steel-600'} />
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 mb-1">Applicants</p>
                        <p className="text-2xl font-bold text-blue-900">{job.applicants}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600 mb-1">Shortlisted</p>
                        <p className="text-2xl font-bold text-green-900">{job.shortlisted}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600 mb-1">Interviewed</p>
                        <p className="text-2xl font-bold text-purple-900">{job.interviewed}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-sm text-orange-600 mb-1">Days Open</p>
                        <p className="text-2xl font-bold text-orange-900">
                            {Math.floor((Date.now() - job.posted.getTime()) / (1000 * 60 * 60 * 24))}
                        </p>
                    </div>
                </div>

                <div className="border-b border-steel-200 mb-6">
                    <div className="flex gap-6">
                        {[
                            { key: 'description', label: 'Job Description' },
                            { key: 'candidates', label: `Candidates (${candidates.length})` }
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                                    ? 'border-burgundy-600 text-burgundy-600'
                                    : 'border-transparent text-steel-600 hover:text-steel-900'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'description' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-steel-900 mb-3">Description</h3>
                            <p className="text-steel-700">{job.description}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-steel-900 mb-3">Responsibilities</h3>
                            <ul className="list-disc list-inside space-y-2 text-steel-700">
                                {job.responsibilities.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-steel-900 mb-3">Requirements</h3>
                            <ul className="list-disc list-inside space-y-2 text-steel-700">
                                {job.requirements.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-steel-900 mb-3">Benefits</h3>
                            <ul className="list-disc list-inside space-y-2 text-steel-700">
                                {job.benefits.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'candidates' && (
                    <div className="space-y-3">
                        {candidates.map((candidate) => (
                            <div key={candidate.id} className="flex items-center justify-between p-4 bg-steel-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-burgundy-600">
                                            {candidate.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-steel-900">{candidate.name}</p>
                                        <p className="text-sm text-steel-600">Applied {candidate.appliedDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-steel-900">Score: {candidate.score}%</p>
                                        <span className={`text-xs px-2 py-1 rounded ${candidate.status === 'Interviewed' ? 'bg-green-100 text-green-700' :
                                            candidate.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                                                'bg-steel-100 text-steel-700'
                                            }`}>
                                            {candidate.status}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/a/recruitment/candidate/${candidate.id}`}
                                        className="px-3 py-1.5 text-sm font-medium text-burgundy-600 hover:bg-burgundy-50 rounded"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetails;
