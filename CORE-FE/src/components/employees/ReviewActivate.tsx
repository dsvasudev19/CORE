// components/onboarding/steps/Step7ReviewActivate.tsx
import React, { useState } from 'react';
import { User, Mail, Calendar, CheckCircle, Send } from 'lucide-react';

interface ReviewActivateProps {
  savedEmployee: any;
}

const ReviewActivate: React.FC<ReviewActivateProps> = () => {
  // Local dummy state for summary, not API integrated
  const [formData] = useState({
    firstName: 'John', lastName: 'Doe', workEmail: 'john.doe',
    team: 'Core Platform',
    systemAccess: ['jira', 'slack', 'github'],
    laptop: true, mouse: true, keyboard: false, monitor: true, headphones: false, accessCard: true,
    policyAcknowledgment: true, ndaSigned: true, securityTraining: true, toolsTraining: false
  });
  const [documentStatus] = useState([
    { id: 'idProof', label: 'ID Proof', required: true, status: 'uploaded' },
    { id: 'addressProof', label: 'Address Proof', required: true, status: 'uploaded' },
    { id: 'educationCert', label: 'Educational Certificates', required: true, status: 'pending' },
    { id: 'experienceLetter', label: 'Experience Letters', required: false, status: 'uploaded' },
    { id: 'passport', label: 'Passport Copy', required: false, status: 'pending' },
    { id: 'photograph', label: 'Recent Photograph', required: true, status: 'uploaded' }
  ]);

  const uploadedDocs = documentStatus.filter(doc => doc.status === 'uploaded').length;
  const selectedAssets = ['laptop', 'mouse', 'keyboard', 'monitor', 'headphones', 'accessCard']
    .filter(key => formData[key as keyof typeof formData]).length;
  const completedTasks = ['policyAcknowledgment', 'ndaSigned', 'securityTraining', 'toolsTraining']
    .filter(key => formData[key as keyof typeof formData]).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="card-compact text-center">
          <User size={24} className="mx-auto mb-2 text-burgundy-600" />
          <p className="text-xs text-steel-500">Employee</p>
          <p className="text-sm font-bold text-steel-900">{formData.firstName} {formData.lastName}</p>
        </div>
        <div className="card-compact text-center">
          <Mail size={24} className="mx-auto mb-2 text-burgundy-600" />
          <p className="text-xs text-steel-500">Work Email</p>
          <p className="text-sm font-bold text-steel-900">{formData.workEmail}@company.com</p>
        </div>
        <div className="card-compact text-center">
          <Calendar size={24} className="mx-auto mb-2 text-burgundy-600" />
          <p className="text-xs text-steel-500">Joining Date</p>
          <p className="text-sm font-bold text-steel-900">Nov 1, 2025</p>
        </div>
      </div>

      <div className="card-compact">
        <h3 className="text-sm font-semibold text-steel-900 mb-3">Onboarding Summary</h3>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-steel-100">
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-success-600" /><span className="text-xs text-steel-700">Personal Information</span></div>
            <span className="text-xs font-medium text-success-600">Complete</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-steel-100">
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-success-600" /><span className="text-xs text-steel-700">Documents Uploaded</span></div>
            <span className="text-xs font-medium text-success-600">{uploadedDocs}/{documentStatus.length}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-steel-100">
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-success-600" /><span className="text-xs text-steel-700">System Access Configured</span></div>
            <span className="text-xs font-medium text-success-600">{formData.systemAccess.length} systems</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-steel-100">
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-success-600" /><span className="text-xs text-steel-700">Team Assignment</span></div>
            <span className="text-xs font-medium text-success-600">{formData.team}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-steel-100">
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-success-600" /><span className="text-xs text-steel-700">Assets Allocated</span></div>
            <span className="text-xs font-medium text-success-600">{selectedAssets} items</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-success-600" /><span className="text-xs text-steel-700">Orientation Completed</span></div>
            <span className="text-xs font-medium text-success-600">{completedTasks}/4 tasks</span>
          </div>
        </div>
      </div>

      <div className="card-compact bg-burgundy-50 border-burgundy-200">
        <h3 className="text-sm font-semibold text-burgundy-900 mb-3">HR Approval Required</h3>
        <p className="text-xs text-burgundy-800 mb-3">
          All information has been verified and is ready for final approval. Click "Activate Employee" to complete onboarding.
        </p>
        <div className="flex items-center gap-2">
          <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-success-600 rounded hover:bg-success-700 transition-colors flex items-center justify-center gap-2">
            <Send size={16} />
            Activate Employee
          </button>
          <button className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded hover:bg-steel-50 transition-colors">
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewActivate;