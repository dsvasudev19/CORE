import { useState } from 'react';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Database,
    Users,
    Building2,
    CreditCard,
    Save,
    RefreshCw
} from 'lucide-react';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('general');

    const sections = [
        { id: 'general', label: 'General', icon: SettingsIcon },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },

    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-xs text-gray-500 mt-0.5">Manage your account and system preferences</p>
            </div>

            <div className="grid grid-cols-12 gap-4">
                {/* Sidebar */}
                <div className="col-span-3">
                    <div className="bg-white rounded border border-gray-200 p-3">
                        <div className="space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${activeSection === section.id
                                        ? 'bg-burgundy-50 text-burgundy-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <section.icon size={16} />
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="col-span-9">
                    <div className="bg-white rounded border border-gray-200">
                        {/* General Settings */}
                        {activeSection === 'general' && (
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="CORE Technologies"
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Time Zone
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                                            <option>UTC-05:00 (Eastern Time)</option>
                                            <option>UTC-08:00 (Pacific Time)</option>
                                            <option>UTC+00:00 (GMT)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date Format
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                                            <option>MM/DD/YYYY</option>
                                            <option>DD/MM/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Language
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                                            <option>English (US)</option>
                                            <option>English (UK)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {activeSection === 'notifications' && (
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                                            <p className="text-xs text-gray-500">Receive notifications via email</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-burgundy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                                            <p className="text-xs text-gray-500">Receive push notifications in browser</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-burgundy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Task Updates</h4>
                                            <p className="text-xs text-gray-500">Notifications about task assignments and updates</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-burgundy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Leave Requests</h4>
                                            <p className="text-xs text-gray-500">Notifications about leave approvals and requests</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-burgundy-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeSection === 'security' && (
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Change Password</h4>
                                        <div className="space-y-3">
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between py-3">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                                                <p className="text-xs text-gray-500">Add an extra layer of security</p>
                                            </div>
                                            <button className="px-3 py-1.5 text-xs font-medium text-burgundy-600 hover:bg-burgundy-50 rounded border border-burgundy-300">
                                                Enable 2FA
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">Active Sessions</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Current Session</p>
                                                    <p className="text-xs text-gray-500">Chrome on macOS • New York, US</p>
                                                </div>
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Settings */}
                        {activeSection === 'appearance' && (
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Theme
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button className="p-4 border-2 border-burgundy-600 rounded-lg bg-white">
                                                <div className="text-sm font-medium text-gray-900 mb-1">Light</div>
                                                <div className="text-xs text-gray-500">Default theme</div>
                                            </button>
                                            <button className="p-4 border-2 border-gray-200 rounded-lg bg-gray-900">
                                                <div className="text-sm font-medium text-white mb-1">Dark</div>
                                                <div className="text-xs text-gray-400">Dark mode</div>
                                            </button>
                                            <button className="p-4 border-2 border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-900">
                                                <div className="text-sm font-medium text-gray-900 mb-1">Auto</div>
                                                <div className="text-xs text-gray-500">System</div>
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Density
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                                            <option>Compact (Executive Density)</option>
                                            <option>Comfortable</option>
                                            <option>Spacious</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Default view for other sections */}
                        {!['general', 'notifications', 'security', 'appearance'].includes(activeSection) && (
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    {sections.find(s => s.id === activeSection)?.label}
                                </h2>
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <SettingsIcon size={32} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-600">Settings for this section are coming soon...</p>
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2">
                                <RefreshCw size={14} />
                                Reset to Defaults
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 hover:bg-burgundy-700 rounded flex items-center gap-2">
                                <Save size={14} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
