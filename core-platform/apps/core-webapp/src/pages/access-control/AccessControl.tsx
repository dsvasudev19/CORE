import { useState, useEffect } from 'react';
import { Shield, Users } from 'lucide-react';
import ResourceManagement from './ResourceManagement';
import ActionManagement from './ActionManagement';
import RoleManagement from './RoleManagement';
import PermissionManagement from './PermissionManagement';
import PolicyManagement from './PolicyManagement';
import UserManagement from './UserManagement';

type TabType = 'resources' | 'actions' | 'roles' | 'permissions' | 'policies' | 'users';

const ACCESS_CONTROL_TAB_KEY = 'accessControlActiveTab';

const AccessControl = () => {
    // Initialize state from sessionStorage or default to 'resources'
    const [activeTab, setActiveTab] = useState<TabType>(() => {
        const savedTab = sessionStorage.getItem(ACCESS_CONTROL_TAB_KEY);
        return (savedTab as TabType) || 'users';
    });

    // Save to sessionStorage whenever tab changes
    useEffect(() => {
        sessionStorage.setItem(ACCESS_CONTROL_TAB_KEY, activeTab);
    }, [activeTab]);

    const tabs = [
        { id: 'users' as TabType, label: 'Users', icon: Users },
        { id: 'roles' as TabType, label: 'Roles', icon: Shield },
        { id: 'resources' as TabType, label: 'Resources', icon: Shield },
        { id: 'actions' as TabType, label: 'Actions', icon: Shield },
        { id: 'permissions' as TabType, label: 'Permissions', icon: Shield },
        { id: 'policies' as TabType, label: 'Policies', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <Shield size={24} className="text-burgundy-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-steel-900">Access Control</h1>
                        <p className="text-xs text-steel-500 mt-0.5">Manage resources, actions, roles, permissions, and policies</p>
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
                {activeTab === 'users' && <UserManagement key="users" />}
                {activeTab === 'roles' && <RoleManagement key="roles" />}
                {activeTab === 'resources' && <ResourceManagement key="resources" />}
                {activeTab === 'actions' && <ActionManagement key="actions" />}
                {activeTab === 'permissions' && <PermissionManagement key="permissions" />}
                {activeTab === 'policies' && <PolicyManagement key="policies" />}
            </div>
        </div>
    );
};

export default AccessControl;
