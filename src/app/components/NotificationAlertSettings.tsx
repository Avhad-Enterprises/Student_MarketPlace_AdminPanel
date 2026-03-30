'use client';

import React, { useState } from 'react';
import { 
    Bell, 
    Shield, 
    Zap, 
    MessageSquare, 
    ArrowUpRight, 
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    UserCheck,
    Users,
    Settings,
    Mail,
    Smartphone,
    ChevronLeft
} from 'lucide-react';
import { AdminNotificationSettings } from '../../services/adminNotificationSettingsService';
import { Checkbox } from './ui/checkbox';

interface Props {
    settings: AdminNotificationSettings;
    setSettings: React.Dispatch<React.SetStateAction<AdminNotificationSettings>>;
    onSave?: () => void;
    isSaving?: boolean;
}

type SubTab = 'admin_alerts' | 'system_notifications' | 'escalation_rules' | 'alert_channels';

const NotificationAlertSettings: React.FC<Props> = ({ settings, setSettings, onSave, isSaving }) => {
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('admin_alerts');

    const handleToggle = (field: keyof AdminNotificationSettings) => {
        setSettings((prev: AdminNotificationSettings) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleRoleToggle = (role: string) => {
        setSettings((prev: AdminNotificationSettings) => {
            const currentRoles = prev.alert_recipient_roles || [];
            const newRoles = currentRoles.includes(role)
                ? currentRoles.filter(r => r !== role)
                : [...currentRoles, role];
            return {
                ...prev,
                alert_recipient_roles: newRoles
            };
        });
    };

    const tabs: { id: SubTab; label: string; icon: React.ElementType }[] = [
        { id: 'admin_alerts', label: 'Admin Alerts', icon: Shield },
        { id: 'system_notifications', label: 'System Notifications', icon: MessageSquare },
        { id: 'escalation_rules', label: 'Escalation Rules', icon: ArrowUpRight },
        { id: 'alert_channels', label: 'Alert Channels', icon: Smartphone },
    ];

    const AlertRow = ({ label, sublabel, enabled, onToggle }: { label: string, sublabel: string, enabled: boolean, onToggle: () => void }) => (
        <div className="flex items-center justify-between py-6 px-1 border-b border-gray-50 last:border-0">
            <div className="space-y-1">
                <p className="text-[15px] font-bold text-[#334155]">{label}</p>
                <p className="text-[13px] text-slate-400 font-medium">{sublabel}</p>
            </div>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
                    enabled ? 'bg-[#0f172b]' : 'bg-slate-200'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );

    const RoleCheckbox = ({ label, role }: { label: string, role: string }) => (
        <div 
            onClick={() => handleRoleToggle(role)}
            className="flex items-center gap-3 p-4 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] transition-all cursor-pointer group"
        >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                settings.alert_recipient_roles?.includes(role) 
                ? 'bg-blue-600 border-blue-600' 
                : 'bg-white border-slate-200'
            }`}>
                {settings.alert_recipient_roles?.includes(role) && (
                    <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                )}
            </div>
            <span className={`text-[14px] font-semibold text-slate-700`}>
                {label}
            </span>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1250px] mx-auto pb-20 pt-4">

            {/* Navigation Tabs Bar */}
            <div className="bg-[#f1f5f9] rounded-2xl p-1.5 flex items-center gap-1 border border-[#e2e8f0] shadow-sm mb-10 max-w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-300 ${
                            activeSubTab === tab.id 
                            ? 'bg-white text-[#0f172b] shadow-md shadow-slate-200' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                        }`}
                    >
                        <tab.icon size={16} strokeWidth={activeSubTab === tab.id ? 2.5 : 2} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeSubTab === 'admin_alerts' && (
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                    <div className="mb-10 border-b border-slate-50 pb-8">
                        <h2 className="text-[18px] font-bold text-[#0f172b] mb-1">Admin Alert Configuration</h2>
                        <p className="text-slate-400 font-medium text-[14px]">Configure when administrators should receive alerts</p>
                    </div>

                    <div className="space-y-2">
                        <AlertRow 
                            label="Alert on High Risk Student" 
                            sublabel="Send alert when AI flags a student as high-risk"
                            enabled={settings.alert_high_risk_student}
                            onToggle={() => handleToggle('alert_high_risk_student')}
                        />
                        <AlertRow 
                            label="Alert on Visa Rejection" 
                            sublabel="Immediate notification when visa is rejected"
                            enabled={settings.alert_visa_rejection}
                            onToggle={() => handleToggle('alert_visa_rejection')}
                        />
                        <AlertRow 
                            label="Alert on Payment Failure" 
                            sublabel="Notify when payment processing fails"
                            enabled={settings.alert_payment_failure}
                            onToggle={() => handleToggle('alert_payment_failure')}
                        />
                        <AlertRow 
                            label="Alert on Expert Over Capacity" 
                            sublabel="Notify when an expert exceeds workload capacity"
                            enabled={settings.alert_expert_over_capacity}
                            onToggle={() => handleToggle('alert_expert_over_capacity')}
                        />
                    </div>

                    <div className="mt-16 pt-10 border-t border-slate-50">
                        <div className="mb-8">
                            <h3 className="text-[16px] font-bold text-[#0f172b] mb-1">Alert Recipient Roles</h3>
                            <p className="text-[14px] text-slate-400 font-medium">Select which roles should receive these alerts</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[900px]">
                            <RoleCheckbox label="Admin" role="Admin" />
                            <RoleCheckbox label="Manager" role="Manager" />
                            <RoleCheckbox label="Senior Manager" role="Senior Manager" />
                            <RoleCheckbox label="Supervisor" role="Supervisor" />
                            <RoleCheckbox label="Finance Team" role="Finance Team" />
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'system_notifications' && (
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-10 border-b border-slate-50 pb-8">
                        <h2 className="text-[18px] font-bold text-[#0f172b] mb-1">System Notification Configuration</h2>
                        <p className="text-slate-400 font-medium text-[14px]">Configure automated notifications sent to students and users</p>
                    </div>

                    <div className="space-y-2">
                        <AlertRow 
                            label="Enable Student Email Notifications" 
                            sublabel="Send automated email notifications to students"
                            enabled={settings.enable_student_email_notifications}
                            onToggle={() => handleToggle('enable_student_email_notifications')}
                        />
                        <AlertRow 
                            label="Enable Booking Reminders" 
                            sublabel="Send reminders before scheduled bookings"
                            enabled={settings.enable_booking_reminders}
                            onToggle={() => handleToggle('enable_booking_reminders')}
                        />
                        <AlertRow 
                            label="Enable Deadline Reminders" 
                            sublabel="Remind users about upcoming deadlines"
                            enabled={settings.enable_deadline_reminders}
                            onToggle={() => handleToggle('enable_deadline_reminders')}
                        />
                        <AlertRow 
                            label="Enable Invoice Reminders" 
                            sublabel="Send reminders for unpaid invoices"
                            enabled={settings.enable_invoice_reminders}
                            onToggle={() => handleToggle('enable_invoice_reminders')}
                        />
                    </div>
                </div>
            )}

            {activeSubTab === 'escalation_rules' && (
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-10 border-b border-slate-50 pb-8">
                        <h2 className="text-[18px] font-bold text-[#0f172b] mb-1">Escalation Rules Configuration</h2>
                        <p className="text-slate-400 font-medium text-[14px]">Define when cases should be escalated to senior staff</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-3">
                            <label className="block text-[14px] font-bold text-slate-700">Escalate If Lead Not Contacted Within (hours)</label>
                            <input 
                                type="number"
                                value={settings.escalate_lead_hours}
                                onChange={(e) => setSettings(prev => ({ ...prev, escalate_lead_hours: parseInt(e.target.value) || 0 }))}
                                className="w-full h-14 px-6 rounded-2xl border border-slate-200 focus:border-[#0f172b] focus:ring-4 focus:ring-slate-100 outline-none transition-all font-medium text-slate-600 bg-[#f8fafc]/50"
                            />
                            <p className="text-[12px] text-slate-400 font-medium">Escalate if lead has not been contacted</p>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[14px] font-bold text-slate-700">Escalate If Booking Not Confirmed Within (hours)</label>
                            <input 
                                type="number"
                                value={settings.escalate_booking_hours}
                                onChange={(e) => setSettings(prev => ({ ...prev, escalate_booking_hours: parseInt(e.target.value) || 0 }))}
                                className="w-full h-14 px-6 rounded-2xl border border-slate-200 focus:border-[#0f172b] focus:ring-4 focus:ring-slate-100 outline-none transition-all font-medium text-slate-600 bg-[#f8fafc]/50"
                            />
                            <p className="text-[12px] text-slate-400 font-medium">Escalate if booking is not confirmed</p>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[14px] font-bold text-slate-700">Escalation Role</label>
                            <div className="relative">
                                <select 
                                    value={settings.escalation_role}
                                    onChange={(e) => setSettings(prev => ({ ...prev, escalation_role: e.target.value }))}
                                    className="w-full h-14 px-6 rounded-2xl border border-slate-200 focus:border-[#0f172b] focus:ring-4 focus:ring-slate-100 outline-none transition-all font-medium text-slate-600 bg-[#f8fafc]/50 appearance-none pointer-events-auto cursor-pointer"
                                >
                                    <option value="Senior Manager">Senior Manager</option>
                                    <option value="Regional Manager">Regional Manager</option>
                                    <option value="Operations Head">Operations Head</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <ChevronLeft size={18} className="-rotate-90" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[14px] font-bold text-slate-700">Escalation Email</label>
                            <input 
                                type="email"
                                value={settings.escalation_email}
                                onChange={(e) => setSettings(prev => ({ ...prev, escalation_email: e.target.value }))}
                                placeholder="escalation@company.com"
                                className="w-full h-14 px-6 rounded-2xl border border-slate-200 focus:border-[#0f172b] focus:ring-4 focus:ring-slate-100 outline-none transition-all font-medium text-slate-600 bg-[#f8fafc]/50"
                            />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-orange-50/50 border border-orange-100 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                            <AlertCircle className="text-orange-600" size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[14px] font-extrabold text-[#9a3412]">Escalation Process</h4>
                            <p className="text-[13px] text-orange-700 font-medium leading-relaxed">
                                When escalation triggers, the case is automatically flagged in the dashboard, the assigned person is notified, and the escalation team receives an immediate alert. The case priority is elevated for faster resolution.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'alert_channels' && (
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-10 border-b border-slate-50 pb-8">
                        <h2 className="text-[18px] font-bold text-[#0f172b] mb-1">Alert Channel Configuration</h2>
                        <p className="text-slate-400 font-medium text-[14px]">Configure how alerts are delivered to your team</p>
                    </div>

                    <div className="space-y-2">
                        <AlertRow 
                            label="Email" 
                            sublabel="Send alerts via email"
                            enabled={settings.channel_email}
                            onToggle={() => handleToggle('channel_email')}
                        />
                        <AlertRow 
                            label="SMS" 
                            sublabel="Send critical alerts via SMS"
                            enabled={settings.channel_sms}
                            onToggle={() => handleToggle('channel_sms')}
                        />
                        <AlertRow 
                            label="In-App Notification" 
                            sublabel="Show alerts in the admin dashboard"
                            enabled={settings.channel_in_app}
                            onToggle={() => handleToggle('channel_in_app')}
                        />
                    </div>

                    <div className="mt-10 p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <Bell className="text-blue-600" size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[14px] font-extrabold text-[#1e40af]">Multi-Channel Alerts</h4>
                            <p className="text-[13px] text-blue-700 font-medium leading-relaxed">
                                Enable multiple channels to ensure critical alerts reach your team. Email and in-app notifications are recommended for all alerts, with SMS and Slack reserved for high-priority situations.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationAlertSettings;
