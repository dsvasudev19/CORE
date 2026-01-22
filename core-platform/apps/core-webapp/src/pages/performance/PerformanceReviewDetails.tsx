import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Star,
    Target,
    TrendingUp,
    MessageSquare,
    CheckCircle,
    Circle,
    Edit3,
    Save
} from 'lucide-react';

const PerformanceReviewDetails = () => {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);

    const review = {
        id: id || '1',
        employee: {
            name: 'Sarah Mitchell',
            role: 'Senior Developer',
            department: 'Engineering',
            empId: 'EMP001'
        },
        reviewer: {
            name: 'John Smith',
            role: 'Engineering Manager'
        },
        period: 'Q4 2024',
        dueDate: new Date('2024-12-15'),
        completedDate: new Date('2024-11-30'),
        status: 'Completed',
        overallRating: 4.5,
        goals: [
            {
                id: '1',
                title: 'Complete React migration project',
                description: 'Lead the migration of legacy codebase to React',
                status: 'completed',
                rating: 5,
                comments: 'Exceeded expectations. Completed 2 weeks ahead of schedule.'
            },
            {
                id: '2',
                title: 'Mentor 2 junior developers',
                description: 'Provide guidance and code reviews',
                status: 'completed',
                rating: 4,
                comments: 'Good mentorship. Junior devs showed significant improvement.'
            },
            {
                id: '3',
                title: 'Improve code review turnaround time',
                description: 'Reduce average review time to under 24 hours',
                status: 'in-progress',
                rating: 4,
                comments: 'Made good progress. Average time reduced to 36 hours.'
            }
        ],
        competencies: [
            { name: 'Technical Skills', rating: 5, weight: 30 },
            { name: 'Communication', rating: 4, weight: 20 },
            { name: 'Leadership', rating: 4, weight: 20 },
            { name: 'Problem Solving', rating: 5, weight: 15 },
            { name: 'Teamwork', rating: 4, weight: 15 }
        ],
        strengths: [
            'Excellent technical skills and problem-solving abilities',
            'Strong leadership in project execution',
            'Proactive in identifying and resolving issues'
        ],
        areasForImprovement: [
            'Could improve documentation practices',
            'Opportunity to develop public speaking skills'
        ],
        feedback: 'Sarah has been an outstanding contributor this quarter. Her technical expertise and leadership on the React migration project were instrumental to its success.',
        nextSteps: [
            'Lead architecture design for new microservices',
            'Present at company tech talk',
            'Complete AWS certification'
        ]
    };

    const getStatusIcon = (status: string) => {
        return status === 'completed' ? (
            <CheckCircle size={16} className="text-green-600" />
        ) : (
            <Circle size={16} className="text-blue-600" />
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link to="/e/performance" className="flex items-center gap-2 text-steel-600 hover:text-steel-900">
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Reviews</span>
                </Link>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded-lg hover:bg-burgundy-700 flex items-center gap-2">
                                <Save size={16} />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded-lg hover:bg-burgundy-700 flex items-center gap-2"
                        >
                            <Edit3 size={16} />
                            Edit Review
                        </button>
                    )}
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-lg border border-steel-200 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-burgundy-100 rounded-full flex items-center justify-center">
                            <span className="text-xl font-semibold text-burgundy-600">
                                {review.employee.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-steel-900">{review.employee.name}</h1>
                            <p className="text-steel-600">{review.employee.role} • {review.employee.department}</p>
                            <p className="text-sm text-steel-500 mt-1">Review Period: {review.period}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-2">
                            <Star size={24} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-3xl font-bold text-steel-900">{review.overallRating}</span>
                        </div>
                        <span className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                            {review.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-steel-200">
                    <div>
                        <p className="text-sm text-steel-600 mb-1">Reviewer</p>
                        <p className="font-medium text-steel-900">{review.reviewer.name}</p>
                        <p className="text-sm text-steel-600">{review.reviewer.role}</p>
                    </div>
                    <div>
                        <p className="text-sm text-steel-600 mb-1">Completed Date</p>
                        <p className="font-medium text-steel-900">{review.completedDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-steel-600 mb-1">Goals Completed</p>
                        <p className="font-medium text-steel-900">
                            {review.goals.filter(g => g.status === 'completed').length} / {review.goals.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Goals Section */}
            <div className="bg-white rounded-lg border border-steel-200 p-6">
                <h2 className="text-xl font-bold text-steel-900 mb-4 flex items-center gap-2">
                    <Target size={20} />
                    Goals & Objectives
                </h2>
                <div className="space-y-4">
                    {review.goals.map((goal) => (
                        <div key={goal.id} className="p-4 bg-steel-50 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-3 flex-1">
                                    {getStatusIcon(goal.status)}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-steel-900">{goal.title}</h3>
                                        <p className="text-sm text-steel-600 mt-1">{goal.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                    <span className="font-semibold text-steel-900">{goal.rating}</span>
                                </div>
                            </div>
                            <div className="mt-3 pl-7">
                                <p className="text-sm text-steel-700 italic">{goal.comments}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Competencies */}
            <div className="bg-white rounded-lg border border-steel-200 p-6">
                <h2 className="text-xl font-bold text-steel-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Competencies
                </h2>
                <div className="space-y-4">
                    {review.competencies.map((comp, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-steel-900">{comp.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-steel-600">{comp.rating}/5</span>
                                    <span className="text-xs text-steel-500">({comp.weight}%)</span>
                                </div>
                            </div>
                            <div className="bg-steel-100 rounded-full h-2">
                                <div
                                    className="bg-burgundy-600 h-2 rounded-full"
                                    style={{ width: `${(comp.rating / 5) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feedback */}
            <div className="bg-white rounded-lg border border-steel-200 p-6">
                <h2 className="text-xl font-bold text-steel-900 mb-4 flex items-center gap-2">
                    <MessageSquare size={20} />
                    Overall Feedback
                </h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-steel-900 mb-2">Strengths</h3>
                        <ul className="list-disc list-inside space-y-1 text-steel-700">
                            {review.strengths.map((strength, index) => (
                                <li key={index}>{strength}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-steel-900 mb-2">Areas for Improvement</h3>
                        <ul className="list-disc list-inside space-y-1 text-steel-700">
                            {review.areasForImprovement.map((area, index) => (
                                <li key={index}>{area}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-steel-900 mb-2">Manager Comments</h3>
                        <p className="text-steel-700">{review.feedback}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-steel-900 mb-2">Next Quarter Goals</h3>
                        <ul className="list-disc list-inside space-y-1 text-steel-700">
                            {review.nextSteps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceReviewDetails;
