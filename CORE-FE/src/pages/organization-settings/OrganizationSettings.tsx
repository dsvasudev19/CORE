import React, { useState, useEffect } from 'react';
import { Building2, Users } from 'lucide-react';
import DepartmentList from '../departments/DepartmentList';
import DesignationList from '../designations/DesignationList';

import TeamList from '../teams/TeamList';

type TabType = 'departments' | 'designations' | 'teams';

const ORG_SETTINGS_TAB_KEY = 'orgSettingsActiveTab';

const OrganizationSettings = () => {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const savedTab = sessionStorage.getItem(ORG_SETTINGS_TAB_KEY);
    return (savedTab as TabType) || 'departments';
  });

  useEffect(() => {
    sessionStorage.setItem(ORG_SETTINGS_TAB_KEY, activeTab);
  }, [activeTab]);

  const tabs = [
    { id: 'departments' as TabType, label: 'Departments', icon: Building2 },
    { id: 'designations' as TabType, label: 'Designations', icon: Users },
    { id: 'teams' as TabType, label: 'Teams', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={24} className="text-burgundy-600" />
          <div>
            <h1 className="text-2xl font-bold text-steel-900">Organization Settings</h1>
            <p className="text-xs text-steel-500 mt-0.5">Manage departments, designations, and teams for your organization</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded border border-steel-200 p-1 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${activeTab === tab.id
                ? 'bg-burgundy-50 text-burgundy-700 border border-burgundy-200'
                : 'text-steel-600 hover:bg-steel-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'departments' && <DepartmentList key="departments" />}
        {activeTab === 'designations' && <DesignationList key="designations" />}
        {activeTab === 'teams' && <TeamList key="teams" />}
      </div>
    </div>
  );
};

export default OrganizationSettings;
