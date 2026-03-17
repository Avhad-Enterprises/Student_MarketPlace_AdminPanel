'use client';

import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Bot,
    Shield,
    Bell,
    Globe,
    Save,
    CheckCircle2,
    Lock,
    Mail,
    Smartphone,
    Loader2
} from 'lucide-react';
import { AssistantSetup } from './AssistantSetup';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { systemSettingsService, SystemSettings, NotificationSetting } from '@/services/systemSettingsService';
import { authService } from '@/services/authService';

type SettingsTab = 'general' | 'ai' | 'security' | 'notifications';

export const SettingsOverviewPage: React.FC = () => {

    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [systemSettings, setSystemSettings] = useState<SystemSettings>({
        platform_name: '',
        support_email: '',
        primary_currency: 'USD'
    });
    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);
    
    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);


    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const [sysRes, notifyRes] = await Promise.all([
                systemSettingsService.getSystemSettings(),
                systemSettingsService.getNotificationSettings()
            ]);
            setSystemSettings(sysRes.data);
            setNotificationSettings(notifyRes.data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSystem = async () => {
        setIsSaving(true);
        try {
            await systemSettingsService.updateSystemSettings(systemSettings);
            toast.success('System settings updated successfully');
        } catch (error) {
            toast.error('Failed to update system settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleNotification = async (key: string, enabled: boolean) => {
        try {
            await systemSettingsService.updateNotificationSetting(key, enabled);
            setNotificationSettings(prev =>
                prev.map(n => n.key === key ? { ...n, enabled } : n)
            );
            toast.success('Notification preference updated');
        } catch (error) {
            toast.error('Failed to update notification setting');
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        setIsUpdatingPassword(true);
        try {
            await authService.changePassword(currentPassword, newPassword);
            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Failed to update password';
            toast.error(errorMsg);
        } finally {
            setIsUpdatingPassword(false);
        }
    };


    const tabs = [
        { id: 'general', label: 'General Settings', icon: Globe },
        { id: 'ai', label: 'AI Assistant', icon: Bot },
        { id: 'security', label: 'Security & Access', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <Loader2 className="w-10 h-10 text-[#0f172b] animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading settings...</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'ai':
                return <AssistantSetup />;
            case 'general':
                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="max-w-2xl">
                            <h2 className="text-xl font-bold text-[#0f172b] mb-6">General Application Settings</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                                    <input
                                        type="text"
                                        value={systemSettings.platform_name}
                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, platform_name: e.target.value }))}
                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-[#0f172b] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                                    <input
                                        type="email"
                                        value={systemSettings.support_email}
                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, support_email: e.target.value }))}
                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-[#0f172b] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Currency</label>
                                    <select
                                        value={systemSettings.primary_currency}
                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, primary_currency: e.target.value }))}
                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-[#0f172b] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                    >
                                        <option value="USD">USD - United States Dollar</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="INR">INR - Indian Rupee</option>
                                    </select>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        onClick={handleSaveSystem}
                                        disabled={isSaving}
                                        className="bg-[#0f172b] hover:bg-[#1a2340] text-white px-8 rounded-xl h-11"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={18} className="mr-2 animate-spin" />
                                        ) : (
                                            <Save size={18} className="mr-2" />
                                        )}
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="max-w-2xl">
                            <h2 className="text-xl font-bold text-[#0f172b] mb-6">Security & Password</h2>

                            <div className="space-y-8">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                                        <Lock size={20} className="text-[#0f172b]" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-[#0f172b]">Two-Factor Authentication</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account.</p>
                                        <Button variant="outline" size="sm" className="mt-3">Enable 2FA</Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-[#0f172b]">Change Password</h3>
                                    <div>
                                        <label className="block text-[xs] font-medium text-gray-500 mb-1.5 ml-1">Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-[#0f172b] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[xs] font-medium text-gray-500 mb-1.5 ml-1">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-[#0f172b] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[xs] font-medium text-gray-500 mb-1.5 ml-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-[#0f172b] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <Button 
                                        onClick={handlePasswordChange}
                                        disabled={isUpdatingPassword}
                                        className="bg-[#0f172b] hover:bg-[#1a2340] text-white px-8 rounded-xl h-11 mt-2 flex items-center justify-center"
                                    >
                                        {isUpdatingPassword ? (
                                            <>
                                                <Loader2 size={16} className="mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Password'
                                        )}
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="max-w-2xl">
                            <h2 className="text-xl font-bold text-[#0f172b] mb-6">Notification Preferences</h2>

                            <div className="space-y-4">
                                {notificationSettings.map((pref) => {
                                    const Icon = pref.key.includes('push') ? Smartphone : Mail;
                                    return (
                                        <div key={pref.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-purple-200 shadow-sm transition-all">
                                                    <Icon size={18} className="text-gray-600 group-hover:text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-[#0f172b]">{pref.title}</h3>
                                                    <p className="text-xs text-gray-500 mt-0.5">{pref.description}</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={pref.enabled}
                                                    onChange={(e) => handleToggleNotification(pref.key, e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f172b]"></div>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full py-6 md:py-10">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="mb-8 px-4 sm:px-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#0f172b] rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/10">
                            <SettingsIcon size={22} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#0f172b]">Settings</h1>
                    </div>
                    <p className="text-[#62748e]">Manage your application preferences, AI assistant, and security settings</p>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit mx-4 sm:mx-0">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as SettingsTab)}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-[#0f172b] text-white shadow-md'
                                    : 'text-[#62748e] hover:bg-gray-50 hover:text-[#0f172b]'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="font-semibold text-sm">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full ml-1" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="transition-all duration-300">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
