import { useState, useEffect } from 'react';
import { X, Calendar, Upload, FileText, Trash2, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { leaveRequestService } from '../services/leaveRequest.service';
import { leaveTypeService } from '../services/leaveType.service';
import type { LeaveTypeDTO, LeaveRequestDTO } from '../types/leave.types';
import toast from 'react-hot-toast';

interface RequestLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const RequestLeaveModal = ({ isOpen, onClose, onSubmit }: RequestLeaveModalProps) => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: '',
        attachments: [] as File[],
        isHalfDay: false,
        halfDayPeriod: 'morning',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
            email: ''
        },
        workHandover: '',
        priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent'
    });

    const [, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch leave types on mount
    useEffect(() => {
        if (isOpen && user?.organizationId) {
            fetchLeaveTypes();
        }
    }, [isOpen, user]);

    const fetchLeaveTypes = async () => {
        try {
            setLoading(true);
            const types = await leaveTypeService.getAll(user!.organizationId || 1);
            setLeaveTypes(types);
            if (types.length > 0) {
                setFormData(prev => ({ ...prev, leaveTypeId: types[0].id?.toString() || '' }));
            }
        } catch (error) {
            console.error('Error fetching leave types:', error);
            toast.error('Failed to load leave types');
        } finally {
            setLoading(false);
        }
    };

    const calculateDays = () => {
        if (!formData.startDate || !formData.endDate) return 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // If it's a half day, return 0.5
        if (formData.isHalfDay && diffDays === 1) {
            return 0.5;
        }

        return diffDays;
    };

    const getCurrentLeaveType = () => {
        return leaveTypes.find(type => type.id?.toString() === formData.leaveTypeId);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const days = calculateDays();

        if (!formData.leaveTypeId) {
            newErrors.leaveTypeId = 'Please select a leave type';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        if (!formData.reason.trim()) {
            newErrors.reason = 'Reason is required';
        }

        // Check work handover for leaves > 3 days
        if (days > 3 && !formData.workHandover.trim()) {
            newErrors.workHandover = 'Work handover details are required for leaves longer than 3 days';
        }

        // Check emergency contact for long leaves
        if (days > 7 && (!formData.emergencyContact.name || !formData.emergencyContact.phone)) {
            newErrors.emergencyContact = 'Emergency contact is required for leaves longer than 7 days';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, attachments: `File ${file.name} is too large. Maximum size is 5MB.` }));
                return false;
            }
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, attachments: `File ${file.name} has unsupported format. Please use PDF, DOC, DOCX, or image files.` }));
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setFormData(prev => ({
                ...prev,
                attachments: [...prev.attachments, ...validFiles]
            }));
            setErrors(prev => ({ ...prev, attachments: '' }));

            // Simulate upload progress
            validFiles.forEach(file => {
                const fileId = `${file.name}-${Date.now()}`;
                setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

                const interval = setInterval(() => {
                    setUploadProgress(prev => {
                        const currentProgress = prev[fileId] || 0;
                        if (currentProgress >= 100) {
                            clearInterval(interval);
                            return prev;
                        }
                        return { ...prev, [fileId]: currentProgress + 10 };
                    });
                }, 100);
            });
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            // Don't send employeeId - backend will get it from authenticated user
            const requestData: LeaveRequestDTO = {
                leaveTypeId: parseInt(formData.leaveTypeId),
                startDate: formData.startDate,
                endDate: formData.isHalfDay ? formData.startDate : formData.endDate,
                totalDays: calculateDays(),
                reason: formData.reason,
                status: 'PENDING'
            };

            await leaveRequestService.create(requestData);

            toast.success('Leave request submitted successfully');

            // Reset form
            setFormData({
                leaveTypeId: leaveTypes[0]?.id?.toString() || '',
                startDate: '',
                endDate: '',
                reason: '',
                attachments: [],
                isHalfDay: false,
                halfDayPeriod: 'morning',
                emergencyContact: {
                    name: '',
                    relationship: '',
                    phone: '',
                    email: ''
                },
                workHandover: '',
                priority: 'normal'
            });
            setErrors({});
            setUploadProgress({});

            onSubmit();
            onClose();
        } catch (error) {
            console.error('Error submitting leave request:', error);
            toast.error('Failed to submit leave request');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-steel-200">
                    <h2 className="text-xl font-bold text-steel-900">Request Leave</h2>
                    <button onClick={onClose} className="p-2 hover:bg-steel-100 rounded-lg">
                        <X size={20} className="text-steel-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Leave Type */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                            Leave Type *
                        </label>
                        {loading ? (
                            <div className="text-sm text-steel-600">Loading leave types...</div>
                        ) : (
                            <select
                                value={formData.leaveTypeId}
                                onChange={(e) => setFormData(prev => ({ ...prev, leaveTypeId: e.target.value }))}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                required
                            >
                                {leaveTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {getCurrentLeaveType() && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium">{getCurrentLeaveType()?.name}</p>
                                        <ul className="mt-1 space-y-1 text-xs">
                                            {getCurrentLeaveType()?.annualLimit && (
                                                <li>• Annual limit: {getCurrentLeaveType()?.annualLimit} days</li>
                                            )}
                                            {getCurrentLeaveType()?.monthlyLimit && (
                                                <li>• Monthly limit: {getCurrentLeaveType()?.monthlyLimit} days</li>
                                            )}
                                            {getCurrentLeaveType()?.carryForward && (
                                                <li>• Carry forward allowed (max: {getCurrentLeaveType()?.maxCarryForward} days)</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                            Priority
                        </label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                        >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    {/* Half Day Option */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="halfDay"
                            checked={formData.isHalfDay}
                            onChange={(e) => setFormData(prev => ({ ...prev, isHalfDay: e.target.checked }))}
                            className="rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                        />
                        <label htmlFor="halfDay" className="text-sm font-medium text-steel-700">
                            Half Day Leave
                        </label>
                        {formData.isHalfDay && (
                            <select
                                value={formData.halfDayPeriod}
                                onChange={(e) => setFormData(prev => ({ ...prev, halfDayPeriod: e.target.value }))}
                                className="ml-4 px-3 py-1 border border-steel-200 rounded text-sm focus:outline-none focus:border-burgundy-300"
                            >
                                <option value="morning">Morning</option>
                                <option value="afternoon">Afternoon</option>
                            </select>
                        )}
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 ${errors.startDate ? 'border-red-300 bg-red-50' : 'border-steel-200'
                                    }`}
                                required
                            />
                            {errors.startDate && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {errors.startDate}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                {formData.isHalfDay ? 'Date *' : 'End Date *'}
                            </label>
                            <input
                                type="date"
                                value={formData.isHalfDay ? formData.startDate : formData.endDate}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    endDate: formData.isHalfDay ? prev.startDate : e.target.value
                                }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 ${errors.endDate ? 'border-red-300 bg-red-50' : 'border-steel-200'
                                    }`}
                                disabled={formData.isHalfDay}
                                required
                            />
                            {errors.endDate && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {errors.endDate}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Days Calculation */}
                    {formData.startDate && formData.endDate && (
                        <div className="bg-burgundy-50 border border-burgundy-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-burgundy-600" />
                                <span className="text-sm font-medium text-burgundy-900">
                                    Total Days: {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                            Reason *
                        </label>
                        <textarea
                            value={formData.reason}
                            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                            className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                            rows={4}
                            placeholder="Please provide a detailed reason for your leave request..."
                            required
                        />
                    </div>

                    {/* Work Handover */}
                    {calculateDays() > 3 && (
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                Work Handover Details *
                            </label>
                            <textarea
                                value={formData.workHandover}
                                onChange={(e) => setFormData(prev => ({ ...prev, workHandover: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none ${errors.workHandover ? 'border-red-300 bg-red-50' : 'border-steel-200'
                                    }`}
                                rows={3}
                                placeholder="Describe how your work will be handled during your absence, including key contacts and pending tasks..."
                                required
                            />
                            {errors.workHandover && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {errors.workHandover}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Emergency Contact */}
                    {calculateDays() > 7 && (
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-3">
                                Emergency Contact *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-steel-200 rounded-lg">
                                <div>
                                    <label className="block text-xs font-medium text-steel-600 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.emergencyContact.name}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                                        }))}
                                        className="w-full px-3 py-2 border border-steel-200 rounded text-sm focus:outline-none focus:border-burgundy-300"
                                        placeholder="Contact person name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-steel-600 mb-1">
                                        Relationship
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.emergencyContact.relationship}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                                        }))}
                                        className="w-full px-3 py-2 border border-steel-200 rounded text-sm focus:outline-none focus:border-burgundy-300"
                                        placeholder="e.g., Spouse, Parent, Friend"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-steel-600 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.emergencyContact.phone}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                                        }))}
                                        className="w-full px-3 py-2 border border-steel-200 rounded text-sm focus:outline-none focus:border-burgundy-300"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-steel-600 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.emergencyContact.email}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            emergencyContact: { ...prev.emergencyContact, email: e.target.value }
                                        }))}
                                        className="w-full px-3 py-2 border border-steel-200 rounded text-sm focus:outline-none focus:border-burgundy-300"
                                        placeholder="contact@email.com"
                                    />
                                </div>
                            </div>
                            {errors.emergencyContact && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {errors.emergencyContact}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Document Upload */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                            Supporting Documents
                            {getCurrentLeaveType()?.requiresDocuments && <span className="text-red-500"> *</span>}
                        </label>

                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-steel-300 rounded-lg p-6 text-center hover:border-burgundy-400 transition-colors">
                            <Upload size={32} className="text-steel-400 mx-auto mb-2" />
                            <div className="space-y-1">
                                <label htmlFor="file-upload" className="cursor-pointer text-burgundy-600 hover:text-burgundy-700 font-medium">
                                    Click to upload files
                                </label>
                                <p className="text-sm text-steel-500">
                                    or drag and drop
                                </p>
                                <p className="text-xs text-steel-400">
                                    PDF, DOC, DOCX, JPG, PNG up to 5MB each
                                </p>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                        </div>

                        {/* Uploaded Files */}
                        {formData.attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h4 className="text-sm font-medium text-steel-700">Uploaded Files:</h4>
                                {formData.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-steel-50 rounded-lg border border-steel-200">
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-steel-500" />
                                            <div>
                                                <p className="text-sm font-medium text-steel-900">{file.name}</p>
                                                <p className="text-xs text-steel-500">{formatFileSize(file.size)}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="p-1 hover:bg-steel-200 rounded transition-colors"
                                        >
                                            <Trash2 size={14} className="text-red-600" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.attachments && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle size={14} />
                                {errors.attachments}
                            </p>
                        )}

                        {getCurrentLeaveType()?.documentNote && (
                            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> {getCurrentLeaveType()?.documentNote}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-steel-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-steel-700 hover:bg-steel-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestLeaveModal;