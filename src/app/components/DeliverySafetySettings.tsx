import React, { useState } from 'react';
import { 
    Shield, 
    Zap, 
    Lock, 
    Eye, 
    UserX, 
    Globe, 
    MousePointer2, 
    Trophy, 
    User, 
    Target, 
    Calendar, 
    ChevronDown, 
    FileText, 
    CheckCircle,
    Clock,
    AlertTriangle,
    Fingerprint,
    Search,
    Plus,
    Activity,
    Upload,
    Database,
    Key
} from 'lucide-react';
import { DeliverySafetySettings } from '@/services/deliverySafetySettingsService';
import { Switch } from './ui/switch';

interface DeliverySafetySettingsProps {
    settings: DeliverySafetySettings;
    setSettings: React.Dispatch<React.SetStateAction<DeliverySafetySettings>>;
}

const DeliverySafetySettingsComp: React.FC<DeliverySafetySettingsProps> = ({ settings, setSettings }) => {
    const [activeSubTab, setActiveSubTab] = useState<'rate_limits' | 'abuse_prevention' | 'data_protection' | 'access_control' | 'monitoring'>('rate_limits');

    const handleChange = (field: keyof DeliverySafetySettings, value: any) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const subTabs = [
        { id: 'rate_limits', label: 'Rate Limits', icon: Zap },
        { id: 'abuse_prevention', label: 'Abuse Prevention', icon: UserX },
        { id: 'data_protection', label: 'Data Protection', icon: Database },
        { id: 'access_control', label: 'Access Control', icon: Key },
        { id: 'monitoring', label: 'Security Monitoring', icon: Activity },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Sub-Navigation */}
            <div className="bg-white rounded-[24px] p-2 border border-gray-100 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar max-w-fit mx-auto md:mx-0">
                {subTabs.map((sub) => (
                    <button
                        key={sub.id}
                        onClick={() => setActiveSubTab(sub.id as any)}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[14px] font-bold transition-all whitespace-nowrap ${
                            activeSubTab === sub.id
                                ? 'bg-[#0a061d] text-white shadow-lg shadow-purple-900/20'
                                : 'text-gray-500 hover:text-[#0f172b] hover:bg-gray-50'
                        }`}
                    >
                        <sub.icon size={18} />
                        {sub.label}
                    </button>
                ))}
            </div>

            {activeSubTab === 'rate_limits' && (
                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shadow-inner">
                                <Zap className="text-orange-500" size={28} />
                            </div>
                            <div>
                                <h2 className="text-[28px] font-extrabold text-[#0f172b] tracking-tight">Rate Limit Configuration</h2>
                                <p className="text-gray-400 font-medium">Control request rates to prevent abuse and ensure fair usage</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* API Requests */}
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    <Activity size={16} className="text-orange-500" />
                                    API Requests per Minute
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[18px] font-bold shadow-sm"
                                        value={settings.api_requests_per_minute}
                                        onChange={(e) => handleChange('api_requests_per_minute', parseInt(e.target.value))}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">REQ/M</span>
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">Maximum API calls per minute per user.</p>
                            </div>

                            {/* Login Attempts */}
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    <Lock size={16} className="text-orange-500" />
                                    Login Attempts per Hour
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[18px] font-bold shadow-sm"
                                        value={settings.login_attempts_per_hour}
                                        onChange={(e) => handleChange('login_attempts_per_hour', parseInt(e.target.value))}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">ATTEMPTS</span>
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">Failed login attempts before lockout.</p>
                            </div>

                            {/* Booking Limit */}
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-orange-500" />
                                    Booking Creation Limit per User
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[18px] font-bold shadow-sm"
                                        value={settings.booking_creation_limit_per_user}
                                        onChange={(e) => handleChange('booking_creation_limit_per_user', parseInt(e.target.value))}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">PER DAY</span>
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">Maximum bookings per day per user.</p>
                            </div>

                            {/* Form Submissions */}
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    <Shield size={16} className="text-orange-500" />
                                    Form Submissions per IP
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[18px] font-bold shadow-sm"
                                        value={settings.form_submissions_per_ip}
                                        onChange={(e) => handleChange('form_submissions_per_ip', parseInt(e.target.value))}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">PER HOUR</span>
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">Maximum form submissions per hour per IP.</p>
                            </div>

                            {/* File Upload Limit */}
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    <Upload size={16} className="text-orange-500" />
                                    File Upload Limit (MB)
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[18px] font-bold shadow-sm"
                                        value={settings.file_upload_limit_mb}
                                        onChange={(e) => handleChange('file_upload_limit_mb', parseInt(e.target.value))}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">MB</span>
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">Maximum file size for uploads.</p>
                            </div>
                        </div>

                        {/* Behavior Box */}
                        <div className="p-8 rounded-[32px] bg-blue-50/50 border border-blue-100 flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Activity size={20} className="text-blue-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-bold text-blue-900">Rate Limiting Behavior</h4>
                                <p className="text-[14px] text-blue-700 leading-relaxed font-medium">When limits are exceeded, requests will be rejected with HTTP 429 (Too Many Requests) status. Users will see a friendly error message and retry-after header.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'abuse_prevention' && (
                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-5 mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                            <UserX className="text-emerald-500" size={28} />
                        </div>
                        <div>
                            <h2 className="text-[28px] font-extrabold text-[#0f172b] tracking-tight">Abuse Prevention Configuration</h2>
                            <p className="text-gray-400 font-medium">Automated protection against malicious activities</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-4">
                            <SecurityToggle 
                                label="Enable CAPTCHA"
                                sublabel="Require CAPTCHA verification on forms"
                                icon={Fingerprint}
                                enabled={settings.enable_captcha}
                                onChange={(val: boolean) => handleChange('enable_captcha', val)}
                                color="emerald"
                            />
                            <SecurityToggle 
                                label="Block Disposable Emails"
                                sublabel="Prevent registration with temporary email addresses"
                                icon={Globe}
                                enabled={settings.block_disposable_emails}
                                onChange={(val: boolean) => handleChange('block_disposable_emails', val)}
                                color="emerald"
                            />
                            <SecurityToggle 
                                label="Auto Block Repeated Failed Logins"
                                sublabel="Automatically block IPs with repeated failed login attempts"
                                icon={Lock}
                                enabled={settings.auto_block_failed_logins}
                                onChange={(val: boolean) => handleChange('auto_block_failed_logins', val)}
                                color="emerald"
                            />
                            <SecurityToggle 
                                label="Auto Flag Suspicious Activity"
                                sublabel="Flag unusual patterns for admin review"
                                icon={Target}
                                enabled={settings.auto_flag_suspicious}
                                onChange={(val: boolean) => handleChange('auto_flag_suspicious', val)}
                                color="emerald"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-gray-50">
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1">Suspicious Threshold Count</label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                        value={settings.suspicious_threshold_count}
                                        onChange={(e) => handleChange('suspicious_threshold_count', parseInt(e.target.value))}
                                    />
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">Number of suspicious events before flagging.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1">Auto Lock Duration (minutes)</label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                        value={settings.auto_lock_duration_mins}
                                        onChange={(e) => handleChange('auto_lock_duration_mins', parseInt(e.target.value))}
                                    />
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">Account lock duration after suspicious activity.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'data_protection' && (
                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-5 mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                            <Database className="text-indigo-500" size={28} />
                        </div>
                        <div>
                            <h2 className="text-[28px] font-extrabold text-[#0f172b] tracking-tight">Data Protection Configuration</h2>
                            <p className="text-gray-400 font-medium">Manage data retention, encryption, and privacy settings</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1">Data Retention Period (days)</label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                        value={settings.auto_deletion_days}
                                        onChange={(e) => handleChange('auto_deletion_days', parseInt(e.target.value))}
                                    />
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">How long to keep user data.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1">Auto Delete Inactive Accounts After (days)</label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                        value={settings.auto_delete_inactive_days}
                                        onChange={(e) => handleChange('auto_delete_inactive_days', parseInt(e.target.value))}
                                    />
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">Delete accounts with no activity.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <SecurityToggle 
                                label="Mask Sensitive Data in Logs"
                                sublabel="Hide sensitive information in system logs"
                                icon={Eye}
                                enabled={settings.pii_masking}
                                onChange={(val: boolean) => handleChange('pii_masking', val)}
                                color="indigo"
                            />
                            <SecurityToggle 
                                label="Encrypt Uploaded Documents"
                                sublabel="Encrypt all documents at rest"
                                icon={Lock}
                                enabled={settings.encrypt_documents}
                                onChange={(val: boolean) => handleChange('encrypt_documents', val)}
                                color="indigo"
                            />
                        </div>

                        {/* GDPR Notice */}
                        <div className="p-6 rounded-[24px] bg-emerald-50 border border-emerald-100 flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <Shield size={20} className="text-emerald-600" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-[15px] font-bold text-emerald-900">GDPR Compliance</h4>
                                <p className="text-[13px] text-emerald-700 leading-relaxed font-medium">These settings help maintain GDPR compliance by managing data retention, encryption, and user privacy. Users can request data deletion at any time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'access_control' && (
                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-5 mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
                            <Key className="text-purple-500" size={28} />
                        </div>
                        <div>
                            <h2 className="text-[28px] font-extrabold text-[#0f172b] tracking-tight">Access Control Configuration</h2>
                            <p className="text-gray-400 font-medium">Manage session settings and access restrictions</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1">Session Timeout (minutes)</label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                        value={settings.session_timeout_mins}
                                        onChange={(e) => handleChange('session_timeout_mins', parseInt(e.target.value))}
                                    />
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">Auto logout after inactivity.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1">Force Password Reset Every (days)</label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                        value={settings.password_reset_days}
                                        onChange={(e) => handleChange('password_reset_days', parseInt(e.target.value))}
                                    />
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">Set to 0 to disable forced resets.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <SecurityToggle 
                                label="Allow Multiple Active Sessions"
                                sublabel="Users can log in from multiple devices simultaneously"
                                icon={Shield}
                                enabled={settings.allow_multiple_sessions}
                                onChange={(val: boolean) => handleChange('allow_multiple_sessions', val)}
                                color="purple"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[14px] font-bold text-[#0f172b] ml-1">IP Whitelist</label>
                            <textarea 
                                className="w-full h-[120px] p-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[15px] font-medium shadow-sm resize-none"
                                value={settings.ip_whitelist}
                                onChange={(e) => handleChange('ip_whitelist', e.target.value)}
                                placeholder="192.168.1.1, 10.0.0.0/8"
                            />
                            <p className="text-[12px] text-gray-400 font-medium ml-1">Only these IPs can access admin panel (leave empty to allow all).</p>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'monitoring' && (
                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-5 mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                            <Activity className="text-orange-500" size={28} />
                        </div>
                        <div>
                            <h2 className="text-[28px] font-extrabold text-[#0f172b] tracking-tight">Security Monitoring Configuration</h2>
                            <p className="text-gray-400 font-medium">Configure security logging and monitoring</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <SecurityToggle 
                                label="Enable Activity Logging"
                                sublabel="Log all user activities for audit purposes"
                                icon={FileText}
                                enabled={settings.enable_activity_logging}
                                onChange={(val: boolean) => handleChange('enable_activity_logging', val)}
                                color="orange"
                            />
                            <SecurityToggle 
                                label="Enable Admin Action Logs"
                                sublabel="Track all administrative actions"
                                icon={Shield}
                                enabled={settings.enable_admin_logs}
                                onChange={(val: boolean) => handleChange('enable_admin_logs', val)}
                                color="orange"
                            />
                            <SecurityToggle 
                                label="Enable IP Tracking"
                                sublabel="Track IP addresses for security analysis"
                                icon={Globe}
                                enabled={settings.enable_ip_tracking}
                                onChange={(val: boolean) => handleChange('enable_ip_tracking', val)}
                                color="orange"
                            />
                            <SecurityToggle 
                                label="Enable AI Decision Logs"
                                sublabel="Log all AI-generated decisions and recommendations"
                                icon={Activity}
                                enabled={settings.enable_ai_logs}
                                onChange={(val: boolean) => handleChange('enable_ai_logs', val)}
                                color="orange"
                            />
                        </div>

                        <div className="pt-4">
                            <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-50 text-purple-600 font-bold text-[14px] hover:bg-purple-100 transition-all border border-purple-100">
                                <Eye size={18} />
                                View Security Logs
                            </button>
                        </div>

                        {/* Best Practices Notice */}
                        <div className="p-8 rounded-[32px] bg-[#fffbeb] border border-[#fef3c7] flex gap-5 items-start">
                            <div className="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center flex-shrink-0 mt-1">
                                <Shield size={20} className="text-[#92400e]" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-[16px] font-bold text-[#92400e]">Security Logging Best Practices</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-[14px] text-[#b45309] font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                                        Keep activity logging enabled for auditability
                                    </li>
                                    <li className="flex items-center gap-2 text-[14px] text-[#b45309] font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                                        Review security logs regularly for anomalies
                                    </li>
                                    <li className="flex items-center gap-2 text-[14px] text-[#b45309] font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                                        Admin action logs help track internal changes
                                    </li>
                                    <li className="flex items-center gap-2 text-[14px] text-[#b45309] font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                                        IP tracking assists in identifying suspicious patterns
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SecurityToggle = ({ label, sublabel, icon: Icon, enabled, onChange, color }: any) => {
    const colorClasses: any = {
        emerald: 'text-emerald-500 bg-emerald-50 border-emerald-100',
        indigo: 'text-indigo-500 bg-indigo-50 border-indigo-100',
        purple: 'text-purple-500 bg-purple-50 border-purple-100',
        orange: 'text-orange-500 bg-orange-50 border-orange-100',
    };

    return (
        <div className={`p-8 rounded-[32px] border transition-all duration-300 ${enabled ? 'bg-white shadow-[0_15px_40px_-5px_rgba(0,0,0,0.05)] border-gray-100' : 'bg-gray-50/50 border-gray-50'}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorClasses[color] || 'bg-gray-100 text-gray-500'}`}>
                        <Icon size={24} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-[17px] font-bold text-[#0f172b]">{label}</h4>
                        <p className="text-[14px] text-gray-400 font-medium leading-relaxed">{sublabel}</p>
                    </div>
                </div>
                <Switch 
                    checked={enabled} 
                    onCheckedChange={onChange}
                    className="data-[state=checked]:bg-[#0f172b]"
                />
            </div>
        </div>
    );
};

export default DeliverySafetySettingsComp;
