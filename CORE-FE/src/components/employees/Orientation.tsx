// components/onboarding/steps/Step6Orientation.tsx
import React from 'react';
import { BookOpen, Clock, Check } from 'lucide-react';
import { type FormData } from '../../types/employee.types';

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const orientationTasks = [
  { id: 'policyAcknowledgment', label: 'Company Policies Review', duration: '30 min' },
  { id: 'ndaSigned', label: 'NDA Signing', duration: '15 min' },
  { id: 'securityTraining', label: 'Security Training', duration: '45 min' },
  { id: 'toolsTraining', label: 'Tools & Systems Training', duration: '1 hour' }
];

const Orientation: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-burgundy-50 border border-burgundy-200 rounded flex items-start gap-2">
        <BookOpen size={16} className="text-burgundy-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-burgundy-900">Orientation Checklist</p>
          <p className="text-xs text-burgundy-800 mt-0.5">
            Complete all mandatory training and policy reviews before activation
          </p>
        </div>
      </div>

      {orientationTasks.map((task) => (
        <div key={task.id} className="card-compact">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name={task.id}
                checked={formData[task.id as keyof FormData] as boolean}
                onChange={onChange}
                className="w-4 h-4 text-burgundy-600 border-steel-300 rounded focus:ring-burgundy-500"
              />
              <div>
                <p className="text-sm font-medium text-steel-900">{task.label}</p>
                <p className="text-xs text-steel-500 flex items-center gap-1.5 mt-0.5">
                  <Clock size={12} />
                  Duration: {task.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {formData[task.id as keyof FormData] ? (
                <span className="badge badge-success">
                  <Check size={12} className="mr-1" />
                  Completed
                </span>
              ) : (
                <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium">
                  Start →
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orientation;