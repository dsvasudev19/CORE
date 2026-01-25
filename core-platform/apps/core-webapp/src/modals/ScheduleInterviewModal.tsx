import { useState, useEffect } from 'react';
import {
    X,
    Calendar,
    Clock,
    User,
    MapPin,
    Video,
    Phone,
    FileText,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { interviewService } from '../services/interview.service';
import { employeeService } from '../services/employee.service';
import { InterviewType, InterviewMode, InterviewStatus } from '../types/interview.types';
import type { Candidate } from '../types/candidate.types';
import type { Employee } from '../types/employee.types';
import toast from 'react-hot-toast';

interface ScheduleInterviewModalProps {
    candidate: Candidate;
    onClose: () => void;
    onSuccess: () => void;
}

const ScheduleInterviewModal = ({ candidate, onClose, onSuccess }: ScheduleInterviewModalProps) => {
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [formData, setFormData] = useState({
        scheduledDateTime: '',
        durationMinutes: 60,
        type: InterviewType.PHONE_SCREENING,
        mode: InterviewMode.VIDEO_CALL,
        interviewerId: '',
        location: '',
        meetingLink: '',
        notes: ''
    });

    useEffect(() => {
        if (user?.organizationId) {
            fetchEmployees();
        }
    }, [user]);

    const fetchEmployees = async () => {
        try {
            const data = await employeeService.getAllEmployees(user!.organizationId, 0, 1000);
            // getAllEmployees returns a paginated response with 'content' array
            setEmployees(Array.isArray(data) ? data : (data.content || []));
        } catch (error) {
            console.error('Error fetching employees:', error);
            setEmployees([]); // Set empty array on error
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.scheduledDateTime) {
            toast.error('Please select date and time');
            return;
        }

        if (formData.mode === InterviewMode.IN_PERSON && !formData.location.trim()) {
            toast.error('Location is required for in-person interviews');
            return;
        }

        if (formData.mode === InterviewMode.VIDEO_CALL && !formData.meetingLink.trim()) {
            toast.error('Meeting link is required for video call interviews');
            return;
        }

        try {
            setSubmitting(true);
            await interviewService.createInterview({
                candidateId: candidate.id,
                interviewerId: formData.interviewerId ? Number(formData.interviewerId) : undefined,
                scheduledDateTime: formData.scheduledDateTime,
                durationMinutes: formData.durationMinutes,
                type: formData.type,
                mode: formData.mode,
                location: formData.location || undefined,
                meetingLink: formData.meetingLink || undefined,
                notes: formData.notes || undefined,
                status: InterviewStatus.SCHEDULED,
                organizationId: user!.organizationId
            });
            setSubmitted(true);
            toast.success('Interview scheduled successfully!');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error scheduling interview:', error);
            toast.error('Failed to schedule interview');
        } finally {
            setSubmitting(false);
        }
    };

    const getInterviewTypeLabel = (type: InterviewType) => {
        switch (type) {
            case InterviewType.PHONE_SCREENING: return 'Phone Screening';
            case InterviewType.TECHNICAL_ROUND: return 'Technical Round';
            case InterviewType.HR_ROUND: return 'HR Round';
            case InterviewType.MANAGERIAL_ROUND: return 'Managerial Round';
            case InterviewType.FINAL_ROUND: return 'Final Round';
            case InterviewType.CULTURAL_FIT: return 'Cultural Fit';
            default: return type;
        }
    };

    const getInterviewModeLabel = (mode: InterviewMode) => {
        switch (mode) {
            case InterviewMode.IN_PERSON: return 'In Person';
            case InterviewMode.VIDEO_CALL: return 'Video Call';
            case InterviewMode.PHONE_CALL: return 'Phone Call';
            default: return mode;
        }
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-steel-900 mb-2">
                        Interview Scheduled!
                    </h3>
                    <p className="text-steel-600">
                        The interview has been scheduled successfully. The candidate will be notified.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl w-full my-8">
                {/* Header */}
                <div className="border-b border-steel-200 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-steel-900">Schedule Interview</h2>
                        <p className="text-sm text-steel-600 mt-1">
                            For: <span className="font-medium text-steel-900">
                                {candidate.firstName} {candidate.lastName}
                            </span> - {candidate.jobPostingTitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-steel-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Interview Type & Mode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Interview Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as InterviewType })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                required
                            >
                                {Object.values(InterviewType).map((type) => (
                                    <option key={type} value={type}>
                                        {getInterviewTypeLabel(type)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Interview Mode <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.mode}
                                onChange={(e) => setFormData({ ...formData, mode: e.target.value as InterviewMode })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                required
                            >
                                {Object.values(InterviewMode).map((mode) => (
                                    <option key={mode} value={mode}>
                                        {getInterviewModeLabel(mode)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Date & Time <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type="datetime-local"
                                    value={formData.scheduledDateTime}
                                    onChange={(e) => setFormData({ ...formData, scheduledDateTime: e.target.value })}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Duration (minutes) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <select
                                    value={formData.durationMinutes}
                                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                                    className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    required
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={90}>1.5 hours</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Interviewer */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-1">
                            Interviewer (Optional)
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                            <select
                                value={formData.interviewerId}
                                onChange={(e) => setFormData({ ...formData, interviewerId: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            >
                                <option value="">Select Interviewer</option>
                                {Array.isArray(employees) && employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName} - {emp.designationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Location (for in-person) */}
                    {formData.mode === InterviewMode.IN_PERSON && (
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="Office address or meeting room"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Meeting Link (for video call) */}
                    {formData.mode === InterviewMode.VIDEO_CALL && (
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Meeting Link <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Video size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type="url"
                                    value={formData.meetingLink}
                                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="https://meet.google.com/..."
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-1">
                            Notes (Optional)
                        </label>
                        <div className="relative">
                            <FileText size={16} className="absolute left-3 top-3 text-steel-400" />
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                                className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                                placeholder="Any additional notes or instructions..."
                            />
                        </div>
                    </div>

                    {/* Info Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-700">
                                <p className="font-medium mb-1">Interview Scheduling</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-600">
                                    <li>The candidate will be notified via email</li>
                                    <li>You can reschedule or cancel the interview later</li>
                                    <li>Make sure to provide all necessary details</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 border border-steel-200 text-steel-700 rounded-lg hover:bg-steel-50 transition-colors font-medium disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <Calendar size={18} />
                                    Schedule Interview
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleInterviewModal;
