// components/onboarding/EmployeeOnboarding.tsx
import React, { useState } from 'react';
import { ArrowLeft, Check, FileText, User, Shield, Package, CheckCircle, ChevronRight, Send } from 'lucide-react';
// Removed unused imports
import PersonalDetails from '../../components/employees/PersonalDetails';
// Removed unused import
import Documents from '../../components/employees/Documents';
import AccessSetup from '../../components/employees/AccessSetup';
// import TeamAssignment from '../../components/employees/TeamAssignment';
import ResourceAllocation from '../../components/employees/ResourceAllocation';
// import Orientation from '../../components/employees/Orientation';
import ReviewActivate from '../../components/employees/ReviewActivate';

const steps = [
  { id: 1, title: 'Personal Details', icon: User, description: 'Basic information' },
  { id: 2, title: 'Documentation', icon: FileText, description: 'Upload required documents' },
  { id: 3, title: 'Access Setup', icon: Shield, description: 'System credentials' },
  { id: 4, title: 'Assets & Resources', icon: Package, description: 'Equipment allocation' },
  { id: 5, title: 'Review & Activate', icon: CheckCircle, description: 'Final confirmation' },
];

const EmployeeOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Each section/component will manage its own local state and API integration
  // Store saved employee data from PersonalDetails
  const [savedEmployee, setSavedEmployee] = useState<any>(null);

  // Removed savedEmployee, each step/component will handle its own API and state
  // Removed unused state variables

  // Remove shared handlers, each component will handle its own state and API

  // Each component should validate its own step and handle its own API
  const validateStep = () => true;

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(5, prev + 1));
    } else {
      alert('Please complete all required fields before proceeding.');
    }
  };

  // Removed handleSave logic, each step/component will handle its own API

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <PersonalDetails setSavedEmployee={setSavedEmployee} />;
      case 2: return <Documents savedEmployee={savedEmployee} />;
      case 3: return <AccessSetup savedEmployee={savedEmployee} />;
      case 4: return <ResourceAllocation savedEmployee={savedEmployee} />;
      case 5: return <ReviewActivate savedEmployee={savedEmployee} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button className="flex items-center  text-steel-600 hover:text-steel-900 p-2 rounded-full bg-white border border-steel-200 shadow-sm mr-3" style={{ minWidth: 32, minHeight: 32 }}>
          <ArrowLeft size={18} className="" />
        </button>
        <div className="flex items-center gap-6 flex-1 justify-between">
          <div>
            <h1 className="text-xl font-bold text-steel-900">Employee Onboarding</h1>
            <p className="text-xs text-steel-500">Complete all steps to activate new employee</p>
          </div>
         
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <div className="col-span-3">
          <div className="card p-4 sticky top-4">
            <h3 className="text-sm font-semibold text-steel-900 mb-3">Onboarding Steps</h3>
            <div className="space-y-2">
              {steps.map(step => {
                const Icon = step.icon;
                const status = getStepStatus(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full flex items-start gap-3 p-2.5 rounded text-left transition-colors ${
                      status === 'current' ? 'bg-burgundy-50 border border-burgundy-200' :
                      status === 'completed' ? 'bg-success-50 border border-success-200 hover:bg-success-100' :
                      'hover:bg-steel-50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      status === 'completed' ? 'bg-success-500 text-white' :
                      status === 'current' ? 'bg-burgundy-600 text-white' :
                      'bg-steel-200 text-steel-500'
                    }`}>
                      {status === 'completed' ? <Check size={14} /> : <Icon size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${status === 'current' ? 'text-burgundy-900' : 'text-steel-900'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-steel-500 mt-0.5">{step.description}</p>
                    </div>
                    {status === 'current' && <ChevronRight size={14} className="text-burgundy-600 flex-shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-steel-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-steel-600">Overall Progress</span>
                <span className="font-semibold text-steel-900">{Math.round((currentStep / 5) * 100)}%</span>
              </div>
              <div className="w-full bg-steel-100 rounded-full h-2">
                <div className="bg-burgundy-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 5) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <div className="card p-5">
            <div className="mb-4 pb-4 border-b border-steel-200">
              <div className="flex items-center gap-3 mb-2">
                {React.createElement(steps[currentStep - 1].icon, { size: 24, className: 'text-burgundy-600' })}
                <div>
                  <h2 className="text-lg font-bold text-steel-900">{steps[currentStep - 1].title}</h2>
                  <p className="text-xs text-steel-500">{steps[currentStep - 1].description}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">{renderStepContent()}</div>

            <div className="flex items-center justify-between pt-4 border-t border-steel-200">
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded hover:bg-steel-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentStep < 5 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 transition-colors flex items-center gap-2"
                >
                  Next Step <ChevronRight size={16} />
                </button>
              ) : (
                <button className="px-4 py-2 text-sm font-medium text-white bg-success-600 rounded hover:bg-success-700 transition-colors flex items-center gap-2">
                  <Send size={16} /> Complete Onboarding
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOnboarding;