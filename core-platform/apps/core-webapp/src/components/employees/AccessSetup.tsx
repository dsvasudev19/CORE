// components/onboarding/steps/AccessSetup.tsx
import React, { useState } from 'react';
import { Check } from 'lucide-react';

const systemAccessOptions = [
  { id: 'jira', name: 'Jira', icon: '🎯' },
  { id: 'slack', name: 'Slack', icon: '💬' },
  { id: 'github', name: 'GitHub', icon: '🐙' },
  { id: 'aws', name: 'AWS Console', icon: '☁️' },
  { id: 'figma', name: 'Figma', icon: '🎨' },
  { id: 'confluence', name: 'Confluence', icon: '📚' }
];

interface AccessSetupProps {
  savedEmployee: any;
}

const AccessSetup: React.FC<AccessSetupProps> = () => {
  const [workEmail, setWorkEmail] = useState('');
  const [systemAccess, setSystemAccess] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkEmail(e.target.value);
  };

  const handleToggleAccess = (accessId: string) => {
    setSystemAccess(prev =>
      prev.includes(accessId)
        ? prev.filter(id => id !== accessId)
        : [...prev, accessId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="card-compact">
        <h3 className="text-sm font-semibold text-steel-900 mb-3">Work Email Assignment</h3>
        <div>
          <label className="block text-xs font-medium text-steel-700 mb-1">
            Company Email <span className="text-danger-600">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="workEmail"
              value={workEmail}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              placeholder="john.doe"
            />
            <span className="flex items-center px-3 py-2 text-sm bg-steel-100 border border-steel-300 rounded text-steel-600">
              @company.com
            </span>
          </div>
          <p className="text-xs text-steel-500 mt-1">
            Temporary password will be sent to personal email
          </p>
        </div>
      </div>

      <div className="card-compact">
        <h3 className="text-sm font-semibold text-steel-900 mb-3">System Access</h3>
        <p className="text-xs text-steel-600 mb-3">Select the systems this employee needs access to</p>
        <div className="grid grid-cols-3 gap-2">
          {systemAccessOptions.map((system) => (
            <button
              key={system.id}
              type="button"
              onClick={() => handleToggleAccess(system.id)}
              className={`p-3 text-left rounded border transition-colors ${
                systemAccess.includes(system.id)
                  ? 'bg-burgundy-50 border-burgundy-300'
                  : 'bg-white border-steel-300 hover:border-burgundy-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{system.icon}</span>
                <span className="text-sm font-medium text-steel-900">{system.name}</span>
              </div>
              {systemAccess.includes(system.id) && (
                <span className="badge badge-success text-xs">
                  <Check size={10} className="mr-1" />
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessSetup;