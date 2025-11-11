import { useState } from 'react';
import {
    User,
    Bell,
    Lock,
    CreditCard,
    Globe,
    Save,
    Mail,
    Phone,
    Building,
    MapPin,
    Eye,
    EyeOff,
    Check,
    Download,
    Calendar
} from 'lucide-react';

const ClientSettings = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing' | 'preferences'>('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Profile state
    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        company: 'Acme Corporation',
        position: 'Project Manager',
        address: '123 Business St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        projectUpdates: true,
        documentShared: true,
        messageReceived: true,
        taskAssigned: false,
        weeklyDigest: true,
        marketingEmails: false
    });

    // Preferences
    const [preferences, setPreferences] = useState({
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
    });

    const handleSave = () => {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'preferences', label: 'Preferences', icon: Globe }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-steel-900">Settings</h1>
                <p className="text-steel-600 mt-1">Manage your account preferences and settings</p>
            </div>

            {/* Settings Interface */}
            <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-4">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-steel-200 bg-steel-50">
                        <div className="p-4 space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-burgundy-50 text-burgundy-700 font-medium'
                                            : 'text-steel-600 hover:bg-white'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span className="text-sm">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-steel-900 mb-1">Profile Information</h2>
                                    <p className="text-sm text-steel-600">Update your personal and company information</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-1">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                            <input
                                                type="text"
                                                value={profileData.firstName}
                                                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                                className="w-full pl-10 pr-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-1">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                            <input
                                                type="text"
                                                value={profileData.lastName}
                                                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                                className="w-full pl-10 pr-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-1">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full pl-10 pr-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-1">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                className="w-full pl-10 pr-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-1">
                                            Company
                                        </label>
                                        <div className="relative">
                                            <Building size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                            <input
                                                type="text"
                                                value={profileData.company}
                                                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                                className="w-full pl-10 pr-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-1">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.position}
                                            onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                                            className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-steel-200">
                                    <h3 className="text-base font-semibold text-steel-900 mb-4">Address Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                                Street Address
                                            </label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                                <input
                                                    type="text"
                                                    value={profileData.address}
                                                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                                    className="w-full pl-10 pr-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-steel-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                value={profileData.city}
                                                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-steel-700 mb-1">State</label>
                                            <input
                                                type="text"
                                                value={profileData.state}
                                                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                                                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-steel-700 mb-1">ZIP Code</label>
                                            <input
                                                type="text"
                                                value={profileData.zipCode}
                                                onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                                                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-steel-700 mb-1">Country</label>
                                            <input
                                                type="text"
                                                value={profileData.country}
                                                onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                                                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-steel-900 mb-1">Notification Preferences</h2>
                                    <p className="text-sm text-steel-600">Choose what notifications you want to receive</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-steel-50 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <Bell size={20} className="text-burgundy-600 mt-0.5" />
                                            <div>
                                                <h3 className="text-sm font-medium text-steel-900">Email Notifications</h3>
                                                <p className="text-sm text-steel-600 mt-0.5">Receive notifications via email</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications.emailNotifications}
                                                onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-steel-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy-600"></div>
                                        </label>
                                    </div>

                                    <div className="space-y-3 pl-4">
                                        {[
                                            { key: 'projectUpdates', label: 'Project Updates', desc: 'Get notified about project status changes' },
                                            { key: 'documentShared', label: 'Document Shared', desc: 'When new documents are shared with you' },
                                            { key: 'messageReceived', label: 'New Messages', desc: 'When you receive a new message' },
                                            { key: 'taskAssigned', label: 'Task Assigned', desc: 'When a task is assigned to you' },
                                            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your weekly activity' },
                                            { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Product updates and announcements' }
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between p-3 border border-steel-200 rounded-lg">
                                                <div>
                                                    <h4 className="text-sm font-medium text-steel-900">{item.label}</h4>
                                                    <p className="text-xs text-steel-600 mt-0.5">{item.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key as keyof typeof notifications] as boolean}
                                                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-steel-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-steel-900 mb-1">Security Settings</h2>
                                    <p className="text-sm text-steel-600">Manage your password and security preferences</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-steel-50 rounded-lg border border-steel-200">
                                        <h3 className="text-sm font-semibold text-steel-900 mb-3">Change Password</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Enter current password"
                                                        className="w-full pl-10 pr-10 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                                    />
                                                    <button
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-steel-400 hover:text-steel-600"
                                                    >
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                    className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                                />
                                            </div>

                                            <button className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 text-sm font-medium">
                                                Update Password
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-steel-50 rounded-lg border border-steel-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold text-steel-900 mb-1">Two-Factor Authentication</h3>
                                                <p className="text-sm text-steel-600">Add an extra layer of security to your account</p>
                                            </div>
                                            <button className="px-4 py-2 bg-white border border-steel-300 text-steel-700 rounded-lg hover:bg-steel-50 text-sm font-medium">
                                                Enable 2FA
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-steel-50 rounded-lg border border-steel-200">
                                        <h3 className="text-sm font-semibold text-steel-900 mb-3">Active Sessions</h3>
                                        <div className="space-y-2">
                                            {[
                                                { device: 'Chrome on Windows', location: 'New York, US', time: 'Current session', active: true },
                                                { device: 'Safari on iPhone', location: 'New York, US', time: '2 hours ago', active: false }
                                            ].map((session, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-steel-200">
                                                    <div>
                                                        <p className="text-sm font-medium text-steel-900">{session.device}</p>
                                                        <p className="text-xs text-steel-600">{session.location} • {session.time}</p>
                                                    </div>
                                                    {session.active ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Active</span>
                                                    ) : (
                                                        <button className="text-xs text-red-600 hover:text-red-700 font-medium">Revoke</button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Billing Tab */}
                        {activeTab === 'billing' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-steel-900 mb-1">Billing & Invoices</h2>
                                    <p className="text-sm text-steel-600">Manage your billing information and view invoices</p>
                                </div>

                                <div className="p-4 bg-burgundy-50 rounded-lg border border-burgundy-200">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-sm font-semibold text-burgundy-900 mb-1">Current Plan</h3>
                                            <p className="text-2xl font-bold text-burgundy-900 mb-1">Professional</p>
                                            <p className="text-sm text-burgundy-700">$299/month • Renews on Dec 15, 2024</p>
                                        </div>
                                        <button className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 text-sm font-medium">
                                            Upgrade Plan
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-steel-50 rounded-lg border border-steel-200">
                                    <h3 className="text-sm font-semibold text-steel-900 mb-3">Payment Method</h3>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-steel-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                                                <CreditCard size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-steel-900">•••• •••• •••• 4242</p>
                                                <p className="text-xs text-steel-600">Expires 12/2025</p>
                                            </div>
                                        </div>
                                        <button className="text-sm text-burgundy-600 hover:text-burgundy-700 font-medium">
                                            Update
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-steel-50 rounded-lg border border-steel-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-steel-900">Recent Invoices</h3>
                                        <button className="text-sm text-burgundy-600 hover:text-burgundy-700 font-medium">
                                            View All
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'INV-2024-11', date: 'Nov 1, 2024', amount: '$299.00', status: 'Paid' },
                                            { id: 'INV-2024-10', date: 'Oct 1, 2024', amount: '$299.00', status: 'Paid' },
                                            { id: 'INV-2024-09', date: 'Sep 1, 2024', amount: '$299.00', status: 'Paid' }
                                        ].map((invoice) => (
                                            <div key={invoice.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-steel-200">
                                                <div className="flex items-center gap-3">
                                                    <Calendar size={16} className="text-steel-400" />
                                                    <div>
                                                        <p className="text-sm font-medium text-steel-900">{invoice.id}</p>
                                                        <p className="text-xs text-steel-600">{invoice.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold text-steel-900">{invoice.amount}</span>
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                        {invoice.status}
                                                    </span>
                                                    <button className="p-1.5 text-steel-600 hover:bg-steel-100 rounded transition-colors">
                                                        <Download size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-steel-900 mb-1">Display Preferences</h2>
                                    <p className="text-sm text-steel-600">Customize your experience</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-2">Language</label>
                                        <select
                                            value={preferences.language}
                                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                            className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                            <option value="zh">Chinese</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-2">Timezone</label>
                                        <select
                                            value={preferences.timezone}
                                            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                                            className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                        >
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                            <option value="Europe/London">London (GMT)</option>
                                            <option value="Europe/Paris">Paris (CET)</option>
                                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-2">Date Format</label>
                                        <select
                                            value={preferences.dateFormat}
                                            onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                                            className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                        >
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-2">Time Format</label>
                                        <select
                                            value={preferences.timeFormat}
                                            onChange={(e) => setPreferences({ ...preferences, timeFormat: e.target.value })}
                                            className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                        >
                                            <option value="12h">12-hour (2:30 PM)</option>
                                            <option value="24h">24-hour (14:30)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-steel-200">
                                    <h3 className="text-base font-semibold text-steel-900 mb-4">Advanced Settings</h3>
                                    <div className="space-y-3">
                                        <div className="p-4 bg-steel-50 rounded-lg border border-steel-200">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-steel-900 mb-1">API Access</h4>
                                                    <p className="text-sm text-steel-600">Generate API keys for integrations</p>
                                                </div>
                                                <button className="px-4 py-2 bg-white border border-steel-300 text-steel-700 rounded-lg hover:bg-steel-50 text-sm font-medium">
                                                    Manage API Keys
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-steel-50 rounded-lg border border-steel-200">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-steel-900 mb-1">Data Export</h4>
                                                    <p className="text-sm text-steel-600">Download all your data</p>
                                                </div>
                                                <button className="px-4 py-2 bg-white border border-steel-300 text-steel-700 rounded-lg hover:bg-steel-50 text-sm font-medium flex items-center gap-2">
                                                    <Download size={16} />
                                                    Export Data
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-red-900 mb-1">Delete Account</h4>
                                                    <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                                                </div>
                                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="flex items-center justify-between pt-6 border-t border-steel-200 mt-6">
                            <div>
                                {saveSuccess && (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Check size={16} />
                                        <span className="text-sm font-medium">Settings saved successfully!</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 flex items-center gap-2 font-medium transition-colors"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientSettings;
