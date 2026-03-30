'use client';

import React, { useState } from 'react';
import { 
    Server, 
    Settings as SettingsIcon, 
    Activity, 
    ShieldAlert, 
    FileText, 
    Database, 
    Cpu, 
    Save, 
    CheckCircle2, 
    AlertTriangle,
    FlaskConical,
    Terminal,
    Globe,
    Lock,
    ShieldCheck,
    RefreshCw,
    Clock,
    DatabaseZap,
    Download,
    Mail,
    MessageSquare,
    Zap,
    HardDrive,
    Trash2,
    Key,
    UserX,
    RotateCw,
    ExternalLink,
    Search,
    BarChart3,
    MoreHorizontal
} from 'lucide-react';
import { SystemSettings } from '@/services/systemSettingsService';

interface Props {
    settings: SystemSettings;
    setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
    onSave?: () => void;
    isSaving?: boolean;
}

const AdvancedSystemSettings: React.FC<Props> = ({ settings, setSettings, onSave, isSaving }) => {

    const handleToggle = (field: keyof SystemSettings) => {
        setSettings((prev: any) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleFeatureFlagToggle = (flagKey: string) => {
        const currentFlags = settings.feature_flags || {};
        setSettings((prev: any) => ({
            ...prev,
            feature_flags: {
                ...currentFlags,
                [flagKey]: !currentFlags[flagKey]
            }
        }));
    };

    const handleInputChange = (field: keyof SystemSettings, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const SectionHeader = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
        <div className="mb-8 border-b border-slate-50 pb-6">
            <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                    <Icon size={20} />
                </div>
                <h2 className="text-[17px] font-bold text-[#0f172b] tracking-tight">{title}</h2>
            </div>
            <p className="text-slate-400 font-medium text-[13px] ml-11">{description}</p>
        </div>
    );

    const StatusChip = ({ label, status, icon: Icon }: { label: string, status: 'Healthy' | 'Operational' | 'Active', icon: any }) => (
        <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-slate-100 rounded-2xl group hover:border-indigo-100 transition-all">
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <span className="text-[14px] font-bold text-[#334155]">{label}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                status === 'Healthy' || status === 'Operational' || status === 'Active' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'Healthy' || status === 'Operational' || status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                {status}
            </div>
        </div>
    );

    const ControlToggle = ({ label, description, enabled, onToggle, warning = false }: { label: string, description: string, enabled: boolean, onToggle: () => void, warning?: boolean }) => (
        <div className="flex items-center justify-between p-5 bg-[#f8fafc] border border-slate-100 rounded-2xl">
            <div className="space-y-0.5">
                <p className="text-[14px] font-bold text-[#334155] flex items-center gap-2">
                    {label}
                    {warning && enabled && <AlertTriangle size={14} className="text-amber-500" />}
                </p>
                <p className="text-[12px] text-slate-400 font-medium">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${
                    enabled ? (warning ? 'bg-amber-500' : 'bg-[#0f172b]') : 'bg-slate-200'
                }`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1300px] mx-auto pb-24 pt-4 px-4">
            
            <div className="grid grid-cols-1 gap-8">
                
                {/* 1. System Status & Health */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-sm transition-all hover:shadow-md">
                    <SectionHeader 
                        title="System Status & Health" 
                        description="Current operational status of all system components" 
                        icon={Activity}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <StatusChip label="System Status" status="Healthy" icon={Server} />
                        <StatusChip label="Background Job Queue" status="Active" icon={Cpu} />
                        <StatusChip label="Email Provider" status="Operational" icon={Mail} />
                        <StatusChip label="SMS Provider" status="Operational" icon={MessageSquare} />
                        <StatusChip label="Storage" status="Healthy" icon={HardDrive} />
                        <StatusChip label="Webhook Delivery" status="Active" icon={Zap} />
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2 text-[12px] text-slate-400 font-medium">
                        <Clock size={14} />
                        Last incident: 2024-03-30 10:30 AM
                    </div>
                </div>

                {/* 2. Audit & Monitoring Controls */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-sm">
                    <SectionHeader 
                        title="Audit & Monitoring Controls" 
                        description="Configure system logging and monitoring behavior" 
                        icon={Terminal}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <ControlToggle 
                            label="Enable Audit Logging" 
                            description="Track all admin actions" 
                            enabled={!!settings.enable_audit_logging} 
                            onToggle={() => handleToggle('enable_audit_logging')}
                        />
                        <ControlToggle 
                            label="Enable User Activity Logs" 
                            description="Track user actions" 
                            enabled={!!settings.enable_user_activity_logs} 
                            onToggle={() => handleToggle('enable_user_activity_logs')}
                        />
                        <ControlToggle 
                            label="Enable Data Change Logs" 
                            description="Track data modifications" 
                            enabled={!!settings.enable_data_change_logs} 
                            onToggle={() => handleToggle('enable_data_change_logs')}
                        />
                        <ControlToggle 
                            label="Enable Login Activity Logs" 
                            description="Track login attempts" 
                            enabled={!!settings.enable_login_activity_logs} 
                            onToggle={() => handleToggle('enable_login_activity_logs')}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Log Retention Period (days)</label>
                            <input 
                                type="number"
                                value={settings.system_log_retention_days}
                                onChange={(e) => handleInputChange('system_log_retention_days', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="90"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Failed Login Threshold</label>
                            <input 
                                type="number"
                                value={settings.failed_login_threshold}
                                onChange={(e) => handleInputChange('failed_login_threshold', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Webhook Failure Threshold</label>
                            <input 
                                type="number"
                                value={settings.webhook_failure_threshold}
                                onChange={(e) => handleInputChange('webhook_failure_threshold', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Email Bounce Threshold</label>
                            <input 
                                type="number"
                                value={settings.email_bounce_threshold}
                                onChange={(e) => handleInputChange('email_bounce_threshold', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="15"
                            />
                        </div>
                    </div>
                    <div className="mt-8">
                        <button className="px-6 h-[44px] bg-[#0f172b] text-white rounded-xl text-[13px] font-bold hover:bg-[#1e293b] transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                             Export Audit Logs
                             <Download size={16} />
                        </button>
                    </div>
                </div>

                {/* 3. Security & Session Controls */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-sm">
                    <SectionHeader 
                        title="Security & Session Controls" 
                        description="Configure authentication and access security settings" 
                        icon={Lock}
                    />
                    <div className="space-y-4 mb-8">
                        <ControlToggle 
                            label="Enforce Two-Factor Authentication for Admins" 
                            description="Require 2FA for all admin accounts" 
                            enabled={!!settings.enforce_2fa_admins} 
                            onToggle={() => handleToggle('enforce_2fa_admins')}
                        />
                        <ControlToggle 
                            label="Password Complexity Rules" 
                            description="Require special characters and numbers" 
                            enabled={!!settings.password_complexity_rules} 
                            onToggle={() => handleToggle('password_complexity_rules')}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Session Timeout Duration (minutes)</label>
                            <input 
                                type="number"
                                value={settings.session_timeout_minutes}
                                onChange={(e) => handleInputChange('session_timeout_minutes', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="60"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Password Minimum Length</label>
                            <input 
                                type="number"
                                value={settings.password_min_length}
                                onChange={(e) => handleInputChange('password_min_length', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="12"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-1">
                            <label className="text-[13px] font-bold text-[#334155]">Password Expiry Period (days)</label>
                            <input 
                                type="number"
                                value={settings.password_expiry_days}
                                onChange={(e) => handleInputChange('password_expiry_days', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="90"
                            />
                        </div>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">IP Allowlist (CIDR notation)</label>
                            <textarea 
                                value={settings.ip_allowlist}
                                onChange={(e) => handleInputChange('ip_allowlist', e.target.value)}
                                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 text-[14px] font-medium h-[100px] resize-none"
                                placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                            />
                            <p className="text-[11px] text-slate-400 font-medium">Leave empty to allow all IPs.</p>
                        </div>
                        <button className="px-6 h-[44px] border-2 border-red-100 text-red-600 rounded-xl text-[13px] font-bold hover:bg-red-50 transition-all flex items-center gap-2">
                            Force Logout All Users
                        </button>
                    </div>
                </div>

                {/* 4. Data Management & Maintenance */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-sm">
                    <SectionHeader 
                        title="Data Management & Maintenance" 
                        description="System maintenance tools and operations" 
                        icon={Database}
                    />
                    <div className="mb-10">
                        <ControlToggle 
                            label="Maintenance Mode" 
                            description="Temporarily disable public access" 
                            enabled={!!settings.maintenance_mode} 
                            onToggle={() => handleToggle('maintenance_mode')}
                            warning={true}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="h-[52px] border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-all">
                            <RotateCw size={18} className="text-slate-400" /> Rebuild Search Index
                        </button>
                        <button className="h-[52px] border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-all">
                            <BarChart3 size={18} className="text-slate-400" /> Recalculate Analytics
                        </button>
                        <button className="h-[52px] border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-all">
                            <Zap size={18} className="text-slate-400" /> Re-run Failed Jobs
                        </button>
                        <button className="h-[52px] border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-all">
                            <Trash2 size={18} className="text-slate-400" /> Clear System Cache
                        </button>
                    </div>
                </div>

                {/* 5. Backup & Recovery */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-sm">
                    <SectionHeader 
                        title="Backup & Recovery" 
                        description="Configure automated backups and recovery options" 
                        icon={DatabaseZap}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Backup Frequency</label>
                            <select 
                                value={settings.backup_frequency}
                                onChange={(e) => handleInputChange('backup_frequency', e.target.value)}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                            >
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Backup Retention Period (days)</label>
                            <input 
                                type="number"
                                value={settings.backup_retention_days}
                                onChange={(e) => handleInputChange('backup_retention_days', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="30"
                            />
                        </div>
                    </div>
                    <div className="bg-indigo-50/50 rounded-2xl p-6 mb-8 border border-indigo-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-[14px]">
                                <ShieldCheck size={18} /> Last Backup
                            </div>
                            <span className="text-[12px] text-slate-400 font-bold tracking-tight">2024-03-30 03:00 AM</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[13px] font-bold text-[#334155] mb-2 px-1">Available Restore Points</p>
                        {[ '2024-03-30', '2024-03-29', '2024-03-28' ].map((date) => (
                            <div key={date} className="flex items-center justify-between py-3 px-4 bg-[#f8fafc] rounded-xl border border-slate-100 group hover:border-indigo-100 transition-all">
                                <span className="text-[14px] font-medium text-slate-600">{date}</span>
                                <button className="px-4 h-[32px] border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm">
                                    Restore
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. System Defaults & Internal Limits */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-sm">
                    <SectionHeader 
                        title="System Defaults & Internal Limits" 
                        description="Configure global system limits and default values" 
                        icon={HardDrive}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Global Rate Limit (requests/min)</label>
                            <input 
                                type="number"
                                value={settings.global_rate_limit}
                                onChange={(e) => handleInputChange('global_rate_limit', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="1000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Max File Upload Size (MB)</label>
                            <input 
                                type="number"
                                value={settings.max_file_upload_mb}
                                onChange={(e) => handleInputChange('max_file_upload_mb', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Max Concurrent Exports</label>
                            <input 
                                type="number"
                                value={settings.max_concurrent_exports}
                                onChange={(e) => handleInputChange('max_concurrent_exports', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#334155]">Pagination Default Size</label>
                            <input 
                                type="number"
                                value={settings.pagination_default_size}
                                onChange={(e) => handleInputChange('pagination_default_size', parseInt(e.target.value))}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                                placeholder="25"
                            />
                        </div>
                    </div>
                </div>

                {/* 7. Feature Flags / Experimental Features */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-sm">
                    <SectionHeader 
                        title="Feature Flags / Experimental Features" 
                        description="Enable or disable experimental features and functionality" 
                        icon={FlaskConical}
                    />
                    <div className="mb-10">
                        <ControlToggle 
                            label="Enable Beta Features" 
                            description="Allow access to experimental features" 
                            enabled={!!settings.enable_beta_features} 
                            onToggle={() => handleToggle('enable_beta_features')}
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <p className="text-[13px] font-bold text-slate-400 px-1 border-b border-slate-50 pb-2">Feature Flags</p>
                        <div className="space-y-3">
                            {[ 'AI Visa Assistant v2', 'Advanced Analytics Dashboard', 'Multi-language Support', 'Custom Branding', 'API v2 Endpoints' ].map((flag) => (
                                <div key={flag} className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-slate-300" />
                                        <span className="text-[14px] font-bold text-[#334155]">{flag}</span>
                                    </div>
                                    <button
                                        onClick={() => handleFeatureFlagToggle(flag)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${
                                            settings.feature_flags?.[flag] ? 'bg-[#0f172b]' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.feature_flags?.[flag] ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-slate-50">
                        <div className="space-y-2 max-w-md">
                            <label className="text-[13px] font-bold text-[#334155]">Environment Scope</label>
                            <select 
                                value={settings.environment_scope}
                                onChange={(e) => handleInputChange('environment_scope', e.target.value)}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium"
                            >
                                <option>Production</option>
                                <option>Staging</option>
                                <option>UAT</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 8. Developer & Diagnostics */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-sm">
                    <SectionHeader 
                        title="Developer & Diagnostics" 
                        description="System diagnostics and testing tools" 
                        icon={Terminal}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <button className="h-[52px] border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Send Test Email
                        </button>
                        <button className="h-[52px] border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Send Test SMS
                        </button>
                        <button className="h-[52px] border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Test Webhook Ping
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <p className="text-[13px] font-bold text-slate-400 px-1 border-b border-slate-50 pb-2">System Information</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Build Version</span>
                                <span className="text-[15px] font-bold text-slate-700">v2.4.1</span>
                            </div>
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Release Date</span>
                                <span className="text-[15px] font-bold text-slate-700">2024-03-10</span>
                            </div>
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Environment</span>
                                <span className="text-[15px] font-bold text-slate-700">Production</span>
                            </div>
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Deployment Region</span>
                                <span className="text-[15px] font-bold text-slate-700">US-East-1</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 9. Import / Export Utilities */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-sm">
                    <SectionHeader 
                        title="Import / Export Utilities" 
                        description="Manage bulk data operations and processing" 
                        icon={Download}
                    />
                    <div className="space-y-4 mb-8">
                        <p className="text-[13px] font-bold text-slate-400 px-1 border-b border-slate-50 pb-2">Recent Import Jobs</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-5 bg-[#f8fafc] rounded-2xl border border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[15px] font-bold text-[#334155]">Student Data Import</p>
                                    <p className="text-[12px] text-slate-400 font-medium tracking-tight uppercase">Completed - 245 records</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-extrabold border border-emerald-100">Success</span>
                            </div>
                            <div className="flex items-center justify-between p-5 bg-[#f8fafc] rounded-2xl border border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[15px] font-bold text-[#334155]">University Data Import</p>
                                    <p className="text-[12px] text-slate-400 font-medium tracking-tight uppercase">Failed - 12 errors</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-extrabold border border-red-100">Failed</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="h-[44px] border border-slate-200 rounded-xl px-6 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Reprocess Failed Imports
                        </button>
                        <button className="h-[44px] border border-slate-200 rounded-xl px-6 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Download Error Reports
                        </button>
                    </div>
                </div>

                {/* 10. Danger Zone */}
                <div className="bg-red-50/30 rounded-[32px] border border-red-100 p-10 shadow-sm">
                    <div className="mb-8 flex items-center gap-3 group">
                        <div className="p-2 rounded-lg bg-red-100 text-red-600 group-hover:animate-bounce">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h2 className="text-[17px] font-bold text-red-600 tracking-tight">Danger Zone</h2>
                            <p className="text-red-400 font-medium text-[13px]">Critical actions that require confirmation and admin access</p>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-red-100 border-t border-b border-red-100">
                        {[
                            { label: 'Disable All Automations', desc: 'Stop all automated workflows and jobs', btn: 'Disable', icon: RotateCw },
                            { label: 'Rotate System Secrets', desc: 'Generate new API keys and tokens', btn: 'Rotate', icon: Key },
                            { label: 'Purge Archived Records', desc: 'Permanently delete archived data', btn: 'Purge', icon: Trash2 },
                            { label: 'Reset Demo Data', desc: 'Restore default demo environment', btn: 'Reset', icon: UserX },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-6 group hover:bg-red-50/50 transition-all px-2 rounded-lg">
                                <div className="space-y-0.5">
                                    <p className="text-[15px] font-bold text-red-900">{item.label}</p>
                                    <p className="text-[12px] text-red-400 font-medium italic">{item.desc}</p>
                                </div>
                                <button className="px-6 h-[34px] border-2 border-red-200 text-red-600 rounded-lg text-[11px] font-extrabold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm">
                                    {item.btn}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            
            {/* Save Status (Floating) */}
            <div className="fixed bottom-10 right-10 z-[60] flex items-center gap-4">
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-3 px-10 h-[64px] bg-[#0f172b] hover:bg-[#1e293b] text-white rounded-full text-[15px] font-heavy tracking-tight transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Activity size={22} className="animate-spin" />
                            Synchronizing System...
                        </>
                    ) : (
                        <>
                            <Save size={22} />
                            Deploy System Configuration
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdvancedSystemSettings;
