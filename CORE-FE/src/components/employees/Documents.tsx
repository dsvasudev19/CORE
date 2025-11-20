// components/onboarding/steps/Step2Documentation.tsx
import React, { useState } from 'react';
import { AlertCircle, FileText, Upload, Check } from 'lucide-react';

const initialDocumentStatus = [
  { id: 'idProof', label: 'ID Proof (Aadhar/Passport/DL)', required: true, status: 'pending' },
  { id: 'addressProof', label: 'Address Proof', required: true, status: 'pending' },
  { id: 'educationCert', label: 'Educational Certificates', required: true, status: 'pending' },
  { id: 'experienceLetter', label: 'Experience Letters', required: false, status: 'pending' },
  { id: 'passport', label: 'Passport Copy', required: false, status: 'pending' },
  { id: 'photograph', label: 'Recent Photograph', required: true, status: 'pending' }
];

interface DocumentsProps {
  savedEmployee: any;
}

const Documents: React.FC<DocumentsProps> = ({ savedEmployee }) => {
  const [documentStatus, setDocumentStatus] = useState(initialDocumentStatus);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    // Only update status locally, do not integrate API
    setDocumentStatus(prev =>
      prev.map(doc => doc.id === docId ? { ...doc, status: 'uploaded' } : doc)
    );
  };

  return (
    <div className="space-y-3">
      <div className="p-3 bg-navy-50 border border-navy-200 rounded flex items-start gap-2">
        <AlertCircle size={16} className="text-navy-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-navy-900">Document Upload Guidelines</p>
          <p className="text-xs text-navy-700 mt-0.5">
            Please upload clear, legible copies. Accepted formats: PDF, JPG, PNG (Max 5MB each)
          </p>
        </div>
      </div>

      {documentStatus.map((doc) => (
        <div key={doc.id} className="card-compact">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-steel-100 flex items-center justify-center">
                <FileText size={18} className="text-steel-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-steel-900 flex items-center gap-2">
                  {doc.label}
                  {doc.required && <span className="text-xs text-danger-600">*Required</span>}
                </p>
                <p className="text-xs text-steel-500 mt-0.5">
                  {doc.status === 'pending' ? 'Not uploaded' : 'Uploaded successfully'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => handleFileUpload(e, doc.id)}
                className="hidden"
                id={`upload-${doc.id}`}
              />
              <label htmlFor={`upload-${doc.id}`} className="btn btn-xs btn-outline-primary cursor-pointer">
                <Upload size={14} className="mr-1" /> Upload
              </label>
              {doc.status === 'uploaded' && <Check size={16} className="text-success-600 ml-2" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Documents;