'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    Mail, 
    Server, 
    Zap, 
    FileText, 
    User, 
    Shield, 
    ChevronDown, 
    Eye, 
    EyeOff, 
    Activity, 
    Lock,
    CheckCircle2,
    Clock,
    AlertCircle,
    Copy,
    RefreshCw,
    ToggleLeft as ToggleIcon,
    AtSign,
    PenTool,
    AlignLeft,
    CheckCircle,
    BarChart3,
    Trophy,
    Target,
    Calendar,
    MousePointer2,
    Plus,
    MessageSquare,
    Phone,
    Pencil,
    Trash2,
    Search,
    MessageCircle,
    Loader2,
    Save,
    Fingerprint,
    Globe
} from 'lucide-react';
import { CommunicationSettings, communicationSettingsService } from '../../services/communicationSettingsService';
import { messageTemplateService, MessageTemplate } from '../../services/messageTemplateService';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Button } from './ui/button';

interface Props {
    settings: CommunicationSettings;
    setSettings: React.Dispatch<React.SetStateAction<CommunicationSettings>>;
    readOnly?: boolean;
}

type SubTab = 'providers' | 'email' | 'campaign' | 'templates' | 'identity';

const CommunicationsSettings: React.FC<Props> = ({ settings, setSettings, readOnly = false }) => {
    const { hasPermission: userHasEditPermission } = usePermission('communications', 'edit');
    const canEdit = userHasEditPermission && !readOnly;
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('providers');
    const [showApiKey, setShowApiKey] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

    // Add Template Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTemplate, setNewTemplate] = useState<Partial<MessageTemplate>>({
        template_id: '',
        name: '',
        type: 'Email',
        linked_event: '',
        status: 'Active',
        content: '',
        subject: ''
    });

    useEffect(() => {
        if (activeSubTab === 'templates') {
            fetchTemplates();
        }
    }, [activeSubTab]);

    const fetchTemplates = async () => {
        setIsLoadingTemplates(true);
        try {
            const data = await messageTemplateService.getTemplates();
            setTemplates(data);
        } catch (error) {
            toast.error('Failed to load message templates');
        } finally {
            setIsLoadingTemplates(false);
        }
    };

    const handleCreateTemplate = async () => {
        if (!newTemplate.template_id || !newTemplate.name || !newTemplate.content) {
            toast.error('Please fill in required fields (ID, Name, Content)');
            return;
        }

        setIsSubmitting(true);
        try {
            await messageTemplateService.createTemplate(newTemplate as MessageTemplate);
            toast.success('Template created successfully');
            setIsAddModalOpen(false);
            setNewTemplate({
                template_id: '',
                name: '',
                type: 'Email',
                linked_event: '',
                status: 'Active',
                content: '',
                subject: ''
            });
            fetchTemplates();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create template');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTemplate = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;
        try {
            await messageTemplateService.deleteTemplate(id);
            toast.success('Template deleted successfully');
            fetchTemplates();
        } catch (error) {
            toast.error('Failed to delete template');
        }
    };

    const handleChange = (field: keyof CommunicationSettings, value: any) => {
        if (!canEdit) return;
        setSettings((prev: CommunicationSettings) => ({ ...prev, [field]: value }));
    };

    // Parse sender name list for the dropdown
    const senderNames = useMemo(() => {
        return settings.sender_name_list
            ? settings.sender_name_list.split(',').map(name => name.trim()).filter(name => name.length > 0)
            : [];
    }, [settings.sender_name_list]);

    const tabs: { id: SubTab; label: string; icon: React.ElementType }[] = [
        { id: 'providers', label: 'Providers & Infrastructure', icon: Server },
        { id: 'email', label: 'Email Settings', icon: Mail },
        { id: 'campaign', label: 'Campaign Defaults', icon: Activity },
        { id: 'templates', label: 'Templates', icon: FileText },
        { id: 'identity', label: 'Sender Identity', icon: User },
    ];

    const testConnection = async () => {
        setIsTestingConnection(true);
        try {
            const updatedSettings = await communicationSettingsService.testConnection();
            setSettings(updatedSettings);
            toast.success('Connection test successful');
        } catch (error) {
            toast.error('Connection test failed');
            handleChange('connection_status', 'failed');
        } finally {
            setIsTestingConnection(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'email': return <Mail size={16} className="text-blue-500" />;
            case 'sms': return <MessageSquare size={16} className="text-purple-500" />;
            case 'whatsapp': return <MessageCircle size={16} className="text-emerald-500" />;
            default: return <FileText size={16} className="text-gray-400" />;
        }
    };

    const SubTabToggle = ({ enabled, onChange, label, sublabel }: { enabled: boolean, onChange: (val: boolean) => void, label: string, sublabel?: string }) => (
        <div className="flex items-center justify-between p-6 rounded-[24px] hover:bg-gray-50/80 transition-all group border border-transparent hover:border-gray-100">
            <div className="space-y-1">
                <p className="text-[15px] font-bold text-[#0f172b] group-hover:text-[#6929c4] transition-colors">{label}</p>
                {sublabel && <p className="text-[13px] text-gray-400 font-medium">{sublabel}</p>}
            </div>
            <button
                onClick={() => canEdit && onChange(!enabled)}
                disabled={!canEdit}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    enabled ? 'bg-[#6929c4] shadow-[0_0_15px_rgba(105,41,196,0.2)]' : 'bg-gray-200 shadow-inner'
                } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-spring ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Sub-Navigation Tabs */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-2 border border-gray-100 shadow-sm flex items-center justify-between overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[14px] font-bold transition-all duration-300 ${
                                activeSubTab === tab.id 
                                ? 'bg-[#0f172b] text-white shadow-lg shadow-gray-200 scale-[1.02]' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <tab.icon size={18} strokeWidth={activeSubTab === tab.id ? 2.5 : 2} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeSubTab === 'providers' && (
                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <Zap className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-[24px] font-bold text-[#0f172b] tracking-tight">Email Provider Configuration</h2>
                                <p className="text-gray-400 font-medium">Connect and configure your email delivery provider</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-3">
                            <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                Email Provider <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <select 
                                    className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white appearance-none cursor-pointer text-[16px] font-bold pr-12 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={settings.email_provider}
                                    onChange={(e) => handleChange('email_provider', e.target.value)}
                                    disabled={!canEdit}
                                >
                                    <option value="SendGrid">SendGrid</option>
                                    <option value="Mailchimp">Mailchimp Transactional (Mandrill)</option>
                                    <option value="Postmark">Postmark</option>
                                    <option value="AmazonSES">Amazon SES</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#6929c4] transition-colors pointer-events-none" size={20} />
                            </div>
                            <p className="text-[13px] text-gray-400 font-medium ml-1">Select your email service provider</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    API Key <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <input 
                                        type={showApiKey ? "text" : "password"}
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold pr-14 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="········································"
                                        value={settings.api_key}
                                        onChange={(e) => handleChange('api_key', e.target.value)}
                                        disabled={!canEdit}
                                    />
                                    <button 
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6929c4] transition-all"
                                    >
                                        {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-[13px] text-gray-400 font-medium ml-1">Your SendGrid API key will be encrypted and stored securely</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1">Webhook URL</label>
                                <div className="relative group">
                                    <input 
                                        type="text"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[15px] font-medium text-gray-600 shadow-sm"
                                        placeholder="https://api.globalvisa.com/webhooks/sendgrid"
                                        value={settings.webhook_url}
                                        onChange={(e) => handleChange('webhook_url', e.target.value)}
                                    />
                                    <button className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-all">
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[14px] font-bold text-[#0f172b] ml-1">IP Pool Name</label>
                            <input 
                                type="text"
                                className="w-full md:w-1/2 h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                placeholder="main-pool"
                                value={settings.ip_pool_name}
                                onChange={(e) => handleChange('ip_pool_name', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-gray-100 gap-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-[14px] font-bold text-[#64748b] tracking-wider uppercase">Connection Status:</span>
                                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold ${
                                        settings.connection_status === 'connected' 
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-100/50' 
                                        : 'bg-red-50 text-red-600 border border-red-100 shadow-sm shadow-red-100/50'
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${settings.connection_status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                        {settings.connection_status.charAt(0).toUpperCase() + settings.connection_status.slice(1)}
                                    </div>
                                </div>
                                <div className="hidden md:block w-px h-6 bg-gray-100" />
                                <div className="flex items-center gap-2 text-gray-400 text-[13px] font-medium">
                                    <Clock size={16} />
                                    Last synced: {new Date(settings.last_synced).toLocaleString()}
                                </div>
                            </div>

                            <button
                                onClick={testConnection}
                                disabled={isTestingConnection}
                                className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white px-8 h-[54px] rounded-2xl text-[15px] font-bold transition-all active:scale-95 disabled:opacity-50 min-w-[200px]"
                            >
                                {isTestingConnection ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
                                {isTestingConnection ? 'Testing...' : 'Test Connection'}
                            </button>
                        </div>

                        <div className="bg-[#f0f7ff] border border-blue-100 rounded-[32px] p-6 flex gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-blue-50 flex items-center justify-center flex-shrink-0">
                                <Shield className="text-blue-500" size={20} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[15px] font-bold text-[#0f172b]">Security Information</h4>
                                <p className="text-[14px] text-gray-500 font-medium leading-relaxed">
                                    All API keys and credentials are encrypted at rest using AES-256 encryption. They are only decrypted when needed for sending emails and are never exposed in logs or error messages.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'email' && (
                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-12 relative overflow-hidden group animate-in fade-in zoom-in-95 duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <AtSign className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-[24px] font-bold text-[#0f172b] tracking-tight">Email Configuration</h2>
                                <p className="text-gray-400 font-medium">Configure default email settings and behavior</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* From Name & From Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    Default From Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text"
                                    className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                    placeholder="Global Visa Services"
                                    value={settings.default_from_name}
                                    onChange={(e) => handleChange('default_from_name', e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    Default From Email <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="email"
                                    className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                    placeholder="noreply@globalvisa.com"
                                    value={settings.default_from_email}
                                    onChange={(e) => handleChange('default_from_email', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Reply-To Email */}
                        <div className="space-y-3">
                            <label className="text-[14px] font-bold text-[#0f172b] ml-1">Reply-To Email</label>
                            <input 
                                type="email"
                                className="w-full md:w-1/2 h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                placeholder="support@globalvisa.com"
                                value={settings.reply_to_email}
                                onChange={(e) => handleChange('reply_to_email', e.target.value)}
                            />
                        </div>

                        {/* Footer Text */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 ml-1">
                                <AlignLeft size={16} className="text-[#6929c4]" />
                                <label className="text-[14px] font-bold text-[#0f172b]">Email Footer Text</label>
                            </div>
                            <textarea 
                                className="w-full min-h-[120px] p-6 rounded-[28px] border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white text-[15px] font-medium leading-relaxed resize-none shadow-inner"
                                placeholder="Global Visa Services | 123 Main Street, Suite 100 | support@globalvisa.com"
                                value={settings.email_footer_text}
                                onChange={(e) => handleChange('email_footer_text', e.target.value)}
                            />
                            <p className="text-[12px] text-gray-400 ml-2 font-medium italic">This appears at the bottom of all emails.</p>
                        </div>

                        {/* Email Signature */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 ml-1">
                                <PenTool size={16} className="text-[#6929c4]" />
                                <label className="text-[14px] font-bold text-[#0f172b]">Email Signature</label>
                            </div>
                            <textarea 
                                className="w-full min-h-[140px] p-8 rounded-[32px] border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white text-[15px] font-medium leading-relaxed resize-none shadow-inner"
                                placeholder="Best regards, Global Visa Services Team"
                                value={settings.email_signature}
                                onChange={(e) => handleChange('email_signature', e.target.value)}
                            />
                        </div>

                        {/* Automation Strips */}
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <SubTabToggle 
                                label="Enable Email Notifications" 
                                sublabel="Send automated email notifications to users"
                                enabled={settings.enable_notifications}
                                onChange={(val) => handleChange('enable_notifications', val)}
                            />
                            <div className="h-[1px] bg-gray-100 mx-6 opacity-50" />
                            <SubTabToggle 
                                label="Enable Auto Emails for Status Changes" 
                                sublabel="Automatically send emails when status changes occur"
                                enabled={settings.enable_auto_status_emails}
                                onChange={(val) => handleChange('enable_auto_status_emails', val)}
                            />
                            <div className="h-[1px] bg-gray-100 mx-6 opacity-50" />
                            <SubTabToggle 
                                label="Enable Campaign Tracking" 
                                sublabel="Track email opens, clicks, and conversions"
                                enabled={settings.enable_campaign_tracking}
                                onChange={(val) => handleChange('enable_campaign_tracking', val)}
                            />
                        </div>

                        {/* Domain Status */}
                        <div className="flex items-center justify-between pt-10 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className="text-[14px] font-bold text-[#64748b] tracking-wider uppercase">Domain Verification Status:</span>
                                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[13px] font-bold shadow-sm">
                                    <CheckCircle size={14} className="fill-emerald-600 text-white" />
                                    Verified
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'campaign' && (
                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-12 relative overflow-hidden group animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                                <Trophy className="text-orange-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-[24px] font-bold text-[#0f172b] tracking-tight">Campaign Default Configuration</h2>
                                <p className="text-gray-400 font-medium">Set default values for campaigns and attribution</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Campaign Owner */}
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    <User size={16} className="text-orange-500" />
                                    Default Campaign Owner
                                </label>
                                <input 
                                    type="text"
                                    className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                    placeholder="Marketing Team"
                                    value={settings.default_campaign_owner}
                                    onChange={(e) => handleChange('default_campaign_owner', e.target.value)}
                                />
                            </div>

                            {/* Lead Source Tag */}
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    <Target size={16} className="text-orange-500" />
                                    Default Lead Source Tag
                                </label>
                                <input 
                                    type="text"
                                    className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                    placeholder="Website"
                                    value={settings.default_lead_source_tag}
                                    onChange={(e) => handleChange('default_lead_source_tag', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Attribution Model */}
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    <MousePointer2 size={16} className="text-orange-500" />
                                    Default Attribution Model
                                </label>
                                <div className="relative group">
                                    <select 
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white appearance-none cursor-pointer text-[16px] font-bold pr-12 shadow-sm"
                                        value={settings.default_attribution_model}
                                        onChange={(e) => handleChange('default_attribution_model', e.target.value)}
                                    >
                                        <option value="Last-touch">Last-touch - Final interaction gets full credit</option>
                                        <option value="First-touch">First-touch - Initial interaction gets full credit</option>
                                        <option value="Linear">Linear - Credit shared equally across all steps</option>
                                        <option value="Time-decay">Time-decay - Recent steps get more credit</option>
                                        <option value="Positional">Positional - First and last get 40% each</option>
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#6929c4] transition-colors pointer-events-none" size={20} />
                                </div>
                                <p className="text-[12px] text-gray-400 font-medium ml-1">How conversion credit is attributed.</p>
                            </div>

                            {/* Auto Expiry */}
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-orange-500" />
                                    Campaign Auto Expiry (days)
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                        placeholder="90"
                                        value={settings.campaign_auto_expiry_days}
                                        onChange={(e) => handleChange('campaign_auto_expiry_days', parseInt(e.target.value))}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Days</span>
                                </div>
                            </div>
                        </div>

                        {/* Conversion Toggle Strip */}
                        <div className="pt-6 border-t border-gray-50">
                            <SubTabToggle 
                                label="Enable Conversion Tracking" 
                                sublabel="Track conversions across campaigns"
                                enabled={settings.enable_conversion_tracking}
                                onChange={(val) => handleChange('enable_conversion_tracking', val)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'templates' && (
                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                                    <FileText className="text-[#6929c4]" size={24} />
                                </div>
                                <h2 className="text-[26px] font-bold text-[#0f172b] tracking-tight">Message Templates</h2>
                            </div>
                            <p className="text-gray-400 font-medium ml-1">Manage email, SMS, and WhatsApp templates</p>
                        </div>

                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-[#0f172b] hover:bg-[#1a2b4b] text-white px-8 h-[54px] rounded-2xl text-[15px] font-bold transition-all active:scale-95 shadow-lg shadow-gray-200"
                        >
                            <Plus size={20} strokeWidth={3} />
                            Add Template
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-[#64748b] text-[13px] font-bold uppercase tracking-widest">
                                    <th className="px-6 py-4 text-left font-bold">Template ID</th>
                                    <th className="px-6 py-4 text-left font-bold">Name</th>
                                    <th className="px-6 py-4 text-left font-bold">Type</th>
                                    <th className="px-6 py-4 text-left font-bold">Linked Event</th>
                                    <th className="px-6 py-4 text-left font-bold">Status</th>
                                    <th className="px-6 py-4 text-center font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingTemplates ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-4">
                                                <RefreshCw className="animate-spin text-purple-500" size={32} />
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Templates...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : templates.map((template) => (
                                    <tr key={template.id} className="group hover:translate-x-1 transition-transform duration-300">
                                        <td className="bg-gray-50/50 rounded-l-[24px] px-6 py-6 border-y border-l border-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-colors">
                                            <span className="text-[#0f172b] font-bold text-[15px]">{template.template_id}</span>
                                        </td>
                                        <td className="bg-gray-50/50 px-6 py-6 border-y border-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-colors">
                                            <span className="text-[#0f172b] font-extrabold text-[15px]">{template.name}</span>
                                        </td>
                                        <td className="bg-gray-50/50 px-6 py-6 border-y border-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-colors">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-100 shadow-sm w-fit">
                                                {getTypeIcon(template.type)}
                                                <span className="text-[13px] font-bold text-[#0f172b]">{template.type}</span>
                                            </div>
                                        </td>
                                        <td className="bg-gray-50/50 px-6 py-6 border-y border-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-colors">
                                            <span className="text-gray-500 font-medium text-[14px]">{template.linked_event}</span>
                                        </td>
                                        <td className="bg-gray-50/50 px-6 py-6 border-y border-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-colors">
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit text-[11px] font-bold tracking-tight border ${
                                                template.status === 'Active' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : 'bg-gray-100 text-gray-500 border-gray-200'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${template.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                                                {template.status}
                                            </div>
                                        </td>
                                        <td className="bg-gray-50/50 rounded-r-[24px] px-6 py-6 border-y border-r border-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-colors">
                                            <div className="flex items-center justify-center gap-3">
                                                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#6929c4] hover:border-purple-200 hover:shadow-sm transition-all active:scale-95">
                                                    <Pencil size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteTemplate(template.template_id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-200 hover:shadow-sm transition-all active:scale-95"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeSubTab === 'identity' && (
                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-12 relative overflow-hidden group animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative mb-12 text-left">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <Fingerprint className="text-emerald-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-[24px] font-bold text-[#0f172b] tracking-tight">Sender Identity & Domain Verification</h2>
                                <p className="text-gray-400 font-medium">Manage sender domains and verification status</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10 text-left">
                        {/* Verified Domains */}
                        <div className="space-y-3">
                            <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                <Globe size={16} className="text-emerald-500" />
                                Verified Domains
                            </label>
                            <input 
                                type="text"
                                className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                placeholder="globalvisa.com, app.globalvisa.com"
                                value={settings.verified_domains}
                                onChange={(e) => handleChange('verified_domains', e.target.value)}
                            />
                            <p className="text-[12px] text-gray-400 font-medium ml-1">Comma-separated list of verified sending domains.</p>
                        </div>

                        {/* Status Badges Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1">DKIM Status</label>
                                <div className="flex items-center justify-between h-[64px] px-6 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[15px] font-bold text-emerald-700">{settings.dkim_status}</span>
                                    </div>
                                    <CheckCircle size={18} className="text-emerald-500" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#0f172b] ml-1">SPF Status</label>
                                <div className="flex items-center justify-between h-[64px] px-6 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[15px] font-bold text-emerald-700">{settings.spf_status}</span>
                                    </div>
                                    <CheckCircle size={18} className="text-emerald-500" />
                                </div>
                            </div>
                        </div>

                        {/* Sender Name List */}
                        <div className="space-y-3 pt-6 border-t border-gray-50">
                            <label className="text-[14px] font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                <User size={16} className="text-emerald-500" />
                                Sender Name List
                            </label>
                            <input 
                                type="text"
                                className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white text-[16px] font-bold shadow-sm"
                                placeholder="Global Visa Services, Support Team, Marketing Team"
                                value={settings.sender_name_list}
                                onChange={(e) => handleChange('sender_name_list', e.target.value)}
                            />
                            <p className="text-[12px] text-gray-400 font-medium ml-1">Comma-separated list of approved sender names.</p>
                        </div>

                        {/* Default Sender Toggle */}
                        <div className="space-y-3">
                            <label className="text-[14px] font-bold text-[#0f172b] ml-1">Default Sender Selection</label>
                            <div className="relative group">
                                <select 
                                    className="w-full h-[64px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white appearance-none cursor-pointer text-[16px] font-bold pr-12 shadow-sm"
                                    value={settings.default_sender_name}
                                    onChange={(e) => handleChange('default_sender_name', e.target.value)}
                                >
                                    {senderNames.length > 0 ? (
                                        senderNames.map((name, idx) => (
                                            <option key={idx} value={name}>{name}</option>
                                        ))
                                    ) : (
                                        <option value="">No senders defined</option>
                                    )}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#6929c4] transition-colors pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Template Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[700px] rounded-[32px] border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] p-0 overflow-hidden bg-white">
                    <div className="bg-[#0f172b] p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <FileText size={120} />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-[28px] font-bold tracking-tight">Add New Template</DialogTitle>
                            <p className="text-gray-400 font-medium mt-1">Create a new multi-channel communication template</p>
                        </DialogHeader>
                    </div>

                    <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <Label className="text-[14px] font-bold text-[#0f172b] ml-1">Template ID *</Label>
                                <Input 
                                    className="h-[52px] rounded-xl border-gray-200 focus:ring-purple-100 focus:border-[#6929c4] font-bold"
                                    placeholder="e.g. T005"
                                    value={newTemplate.template_id}
                                    onChange={(e) => setNewTemplate({...newTemplate, template_id: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-[14px] font-bold text-[#0f172b] ml-1">Channel Type *</Label>
                                <Select 
                                    value={newTemplate.type} 
                                    onValueChange={(val) => setNewTemplate({...newTemplate, type: val})}
                                >
                                    <SelectTrigger className="h-[52px] rounded-xl border-gray-200 font-bold">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-100">
                                        <SelectItem value="Email" className="font-medium">Email</SelectItem>
                                        <SelectItem value="SMS" className="font-medium">SMS</SelectItem>
                                        <SelectItem value="WhatsApp" className="font-medium">WhatsApp</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-[14px] font-bold text-[#0f172b] ml-1">Template Name *</Label>
                            <Input 
                                className="h-[52px] rounded-xl border-gray-200 focus:ring-purple-100 focus:border-[#6929c4] font-bold"
                                placeholder="e.g. Registration Success"
                                value={newTemplate.name}
                                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-[14px] font-bold text-[#0f172b] ml-1">Linked System Event</Label>
                            <Input 
                                className="h-[52px] rounded-xl border-gray-200 focus:ring-purple-100 focus:border-[#6929c4] font-medium"
                                placeholder="e.g. USER_REGISTERED"
                                value={newTemplate.linked_event}
                                onChange={(e) => setNewTemplate({...newTemplate, linked_event: e.target.value})}
                            />
                        </div>

                        {newTemplate.type === 'Email' && (
                            <div className="space-y-2.5 animate-in slide-in-from-top-2 duration-300">
                                <Label className="text-[14px] font-bold text-[#0f172b] ml-1">Email Subject Line</Label>
                                <Input 
                                    className="h-[52px] rounded-xl border-gray-200 focus:ring-purple-100 focus:border-[#6929c4]"
                                    placeholder="Enter subject..."
                                    value={newTemplate.subject}
                                    onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                                />
                            </div>
                        )}

                        <div className="space-y-2.5">
                            <Label className="text-[14px] font-bold text-[#0f172b] ml-1">Message Content *</Label>
                            <Textarea 
                                className="min-h-[160px] rounded-2xl border-gray-200 focus:ring-purple-100 focus:border-[#6929c4] p-4 resize-none"
                                placeholder="Compose your message here. Use {{variable}} for dynamic data..."
                                value={newTemplate.content}
                                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="space-y-0.5">
                                <Label className="text-[14px] font-bold text-[#0f172b]">Set as Active</Label>
                                <p className="text-[12px] text-gray-400 font-medium">Templates must be active to be triggered by events</p>
                            </div>
                            <Switch 
                                checked={newTemplate.status === 'Active'}
                                onCheckedChange={(val) => setNewTemplate({...newTemplate, status: val ? 'Active' : 'Inactive'})}
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-gray-50/50 border-t border-gray-100 gap-3">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsAddModalOpen(false)}
                            className="h-[54px] rounded-2xl px-8 font-bold border-gray-200 text-gray-500 hover:bg-white transition-all shadow-sm"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreateTemplate}
                            disabled={isSubmitting}
                            className="h-[54px] rounded-2xl px-10 font-bold bg-[#0f172b] hover:bg-[#1a2b4b] text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSubmitting ? 'Creating...' : 'Save Template'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CommunicationsSettings;
