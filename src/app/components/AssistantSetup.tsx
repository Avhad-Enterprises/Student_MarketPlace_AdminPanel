'use client';

/**
 * AI CONFIGURATION CONSOLE
 * 
 * Enterprise Two-Column Split Layout
 * LEFT: Configuration Workspace with Vertical Tab Navigation (60%)
 * RIGHT: Live Preview & Context Panel (40% - Sticky)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    Save,
    Upload,
    Globe,
    Activity,
    Settings,
    MessageCircle,
    Shield,
    AlertTriangle,
    Eye,
    Clock,
    Zap,
    User,
    Bot,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    FileText,
    ExternalLink,
    TrendingUp,
    DollarSign,
    Gauge,
    Target,
    Scale,
    AlertOctagon,
    Megaphone,
    FileCheck,
    BarChart3,
    GitBranch,
    History,
    ChevronRight,
    Info,
    ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { aiAssistantService } from '../../services/aiAssistantService';

// Fallback Select component since the UI one is missing
const Select = ({ children, value, onValueChange }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 cursor-pointer"
            >
                <span>{value}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md">
                    {React.Children.map(children, (child: any) => {
                        if (child.type === SelectContent) {
                            return React.Children.map(child.props.children, (item: any) => (
                                <div
                                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100"
                                    onClick={() => {
                                        onValueChange(item.props.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    {item.props.children}
                                </div>
                            ));
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
};

const SelectTrigger = ({ children }: any) => children;
const SelectValue = ({ children }: any) => children;
const SelectContent = ({ children }: any) => children;
const SelectItem = ({ children, value }: any) => <div data-value={value}>{children}</div>;

export const AssistantSetup: React.FC = () => {
    const [activeSection, setActiveSection] = useState('identity');
    const [assistantStatus, setAssistantStatus] = useState('online');
    const [strictMode, setStrictMode] = useState(true);
    const [loading, setLoading] = useState(true);
    const [lastPublished, setLastPublished] = useState<string>('');

    // Form state
    const [formData, setFormData] = useState({
        assistantName: 'Study Abroad Visa Assistant',
        tagline: 'Your intelligent companion for visa guidance',
        defaultLanguage: 'en',
        modelProvider: 'openai',
        modelVersion: 'gpt-4-turbo',
        temperature: 0.7,
        responseLength: 'medium',
        memoryWindow: '8k',
        streaming: true,
        timeout: 30,
        retryAttempts: 3,
        tone: 'friendly',
        answerStyle: 'detailed',
        communicationStyle: 'conversational',
        confidenceThreshold: 60,
        confidenceVisibility: 'internal',
        escalationAction: 'show-button',
        welcomeMessage: 'Hello! I\'m your Study Abroad Visa Assistant. How can I help you today?',
    });

    const [guardrails, setGuardrails] = useState({
        noLegalAdvice: true,
        noGuaranteedApproval: true,
        noFinancialGuarantee: true,
        noImmigrationConsultancy: true,
        noPolicyInterpretation: true,
    });

    const [escalationTriggers, setEscalationTriggers] = useState({
        lowConfidence: true,
        userRequestsHuman: true,
        cannotAnswer: true,
        negativeSentiment: true,
    });

    const [formattingRules, setFormattingRules] = useState({
        alwaysDisclaimer: true,
        showChecklistTable: true,
        countryLinks: true,
        estimatedTime: true,
        ctaButton: true,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const data = await aiAssistantService.getSettings();
                if (data) {
                    setFormData({
                        assistantName: data.assistant_name,
                        tagline: data.tagline,
                        defaultLanguage: data.default_language,
                        modelProvider: data.model_provider,
                        modelVersion: data.model_version,
                        temperature: data.temperature,
                        responseLength: data.response_length,
                        memoryWindow: data.memory_window,
                        streaming: data.streaming,
                        timeout: data.timeout,
                        retryAttempts: data.retry_attempts,
                        tone: data.tone,
                        answerStyle: data.answer_style,
                        communicationStyle: data.communication_style,
                        confidenceThreshold: data.confidence_threshold,
                        confidenceVisibility: data.confidence_visibility,
                        escalationAction: data.escalation_action,
                        welcomeMessage: data.welcome_message,
                    });
                    setGuardrails(typeof data.guardrails === 'string' ? JSON.parse(data.guardrails) : data.guardrails);
                    setEscalationTriggers(typeof data.escalation_triggers === 'string' ? JSON.parse(data.escalation_triggers) : data.escalation_triggers);
                    setFormattingRules(typeof data.formatting_rules === 'string' ? JSON.parse(data.formatting_rules) : data.formatting_rules);
                    setAssistantStatus(data.status);
                    setStrictMode(data.strict_mode);
                    if (data.updated_at) {
                        setLastPublished(new Date(data.updated_at).toLocaleString());
                    }
                }
            } catch (error) {
                toast.error('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (isPublish: boolean = false) => {
        try {
            const dataToSave = {
                assistant_name: formData.assistantName,
                tagline: formData.tagline,
                default_language: formData.defaultLanguage,
                model_provider: formData.modelProvider,
                model_version: formData.modelVersion,
                temperature: formData.temperature,
                response_length: formData.responseLength,
                memory_window: formData.memoryWindow,
                streaming: formData.streaming,
                timeout: formData.timeout,
                retry_attempts: formData.retryAttempts,
                tone: formData.tone,
                answer_style: formData.answerStyle,
                communication_style: formData.communicationStyle,
                confidence_threshold: formData.confidenceThreshold,
                confidence_visibility: formData.confidenceVisibility,
                escalation_action: formData.escalationAction,
                welcome_message: formData.welcomeMessage,
                guardrails,
                escalation_triggers: escalationTriggers,
                formatting_rules: formattingRules,
                status: assistantStatus,
                strict_mode: strictMode,
            };

            await aiAssistantService.updateSettings(dataToSave);
            toast.success(isPublish ? 'Changes published successfully' : 'Draft saved successfully');
            if (isPublish) {
                setLastPublished(new Date().toLocaleString());
            }
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    const sections = [
        { id: 'identity', label: 'Core Identity', icon: Bot },
        { id: 'environment', label: 'Environment', icon: Activity },
        { id: 'runtime', label: 'AI Runtime', icon: Settings },
        { id: 'behavior', label: 'Behavior', icon: MessageCircle },
        { id: 'guardrails', label: 'Guardrails', icon: Shield },
        { id: 'escalation', label: 'Escalation', icon: AlertTriangle },
        { id: 'messages', label: 'Welcome Messages', icon: Megaphone },
        { id: 'formatting', label: 'Response Formatting', icon: FileCheck },
        { id: 'confidence', label: 'Confidence Display', icon: BarChart3 },
        { id: 'versioning', label: 'Version Control', icon: GitBranch },
    ];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'online':
                return { bg: 'bg-green-100', text: 'Online', dotColor: 'bg-green-600', textColor: 'text-green-700' };
            case 'maintenance':
                return { bg: 'bg-amber-100', text: 'Maintenance', dotColor: 'bg-amber-600', textColor: 'text-amber-700' };
            case 'offline':
                return { bg: 'bg-red-100', text: 'Offline', dotColor: 'bg-red-600', textColor: 'text-red-700' };
            default:
                return { bg: 'bg-gray-100', text: 'Unknown', dotColor: 'bg-gray-600', textColor: 'text-gray-700' };
        }
    };

    const statusConfig = getStatusConfig(assistantStatus);

    const getCostImpact = () => {
        if (formData.modelVersion === 'gpt-4-turbo') return { label: 'High', color: 'text-red-600' };
        if (formData.modelVersion === 'gpt-4') return { label: 'Medium-High', color: 'text-orange-600' };
        return { label: 'Low', color: 'text-green-600' };
    };

    const getPerformanceMode = () => {
        if (formData.temperature < 0.4) return { label: 'Precise', color: 'text-blue-600' };
        if (formData.temperature > 0.7) return { label: 'Creative', color: 'text-purple-600' };
        return { label: 'Balanced', color: 'text-green-600' };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-[1800px] mx-auto px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-[22px] font-bold text-[#253154]">AI Configuration Console</h1>
                            <p className="text-[13px] text-gray-600 mt-0.5">Control AI behavior, boundaries, and response logic</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Status Indicator */}
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${statusConfig.bg} border-gray-200`}>
                                <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}></div>
                                <span className={`text-xs font-semibold ${statusConfig.textColor}`}>{statusConfig.text}</span>
                            </div>

                            {/* Version */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <FileText size={14} className="text-gray-600" />
                                <span className="text-xs font-semibold text-gray-700">v1.4</span>
                            </div>

                            {/* Last Published */}
                            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                                <Clock size={14} className="text-blue-600" />
                                <span className="text-xs text-blue-700">Published: {lastPublished || 'Never'}</span>
                            </div>

                            {/* Save Draft */}
                            <Button variant="outline" className="h-10" onClick={() => handleSave(false)}>
                                <Save size={16} className="mr-2" />
                                Save Draft
                            </Button>

                            {/* Publish */}
                            <Button
                                onClick={() => handleSave(true)}
                                className="bg-[#253154] hover:bg-[#1a2340] text-white h-10 shadow-lg shadow-purple-900/20"
                            >
                                <CheckCircle2 size={16} className="mr-2" />
                                Publish Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Layout: Two-Column Split */}
            <div className="max-w-[1800px] mx-auto px-8 py-8">
                <div className="flex gap-8">
                    {/* LEFT: Configuration Workspace (60%) */}
                    <div className="flex-1 w-[60%] space-y-6">
                        {/* Vertical Tab Navigation */}
                        <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
                            <div className="grid grid-cols-5 gap-2">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`flex flex-col items-center gap-2 px-3 py-3 rounded-lg transition-all text-center ${activeSection === section.id
                                                ? 'bg-[#253154] text-white shadow-md'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon size={18} strokeWidth={2} />
                                            <span className="text-[11px] font-semibold leading-tight">{section.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Configuration Content */}
                        <div className="space-y-6">
                            {/* ========== CORE IDENTITY ========== */}
                            {activeSection === 'identity' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#253154] rounded-lg flex items-center justify-center">
                                                <Bot size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-[#253154]">Core Identity</h2>
                                                <p className="text-xs text-gray-600">Define your assistant&apos;s name, personality, and branding</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-5">
                                        {/* Two-Column Layout */}
                                        <div className="grid grid-cols-2 gap-6">
                                            {/* Left Column */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Assistant Name <span className="text-red-600">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.assistantName}
                                                        onChange={(e) => setFormData({ ...formData, assistantName: e.target.value })}
                                                        maxLength={50}
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">{formData.assistantName.length}/50 characters</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Tagline / Short Description
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.tagline}
                                                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                                        maxLength={80}
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">{formData.tagline.length}/80 characters</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Default Language</label>
                                                    <Select value={formData.defaultLanguage} onValueChange={(val: any) => setFormData({ ...formData, defaultLanguage: val })}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="en">🇬🇧 English</SelectItem>
                                                            <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                                                            <SelectItem value="fr">🇫🇷 French</SelectItem>
                                                            <SelectItem value="de">🇩🇪 German</SelectItem>
                                                            <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Right Column - Icon Upload */}
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                                                <div className="w-20 h-20 bg-gradient-to-br from-[#253154] to-[#0e042f] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                                    <Bot size={40} className="text-white" />
                                                </div>
                                                <p className="text-sm font-semibold text-gray-700 mb-2">Profile Icon</p>
                                                <Button variant="outline" size="sm">
                                                    <Upload size={14} className="mr-2" />
                                                    Upload Icon
                                                </Button>
                                                <p className="text-xs text-gray-500 mt-2 text-center">Recommended: 512x512px PNG</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ========== ENVIRONMENT CONTROL ========== */}
                            {activeSection === 'environment' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                                <Activity size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-[#253154]">Environment Control</h2>
                                                <p className="text-xs text-gray-600">Manage deployment status and availability</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-5">
                                        {/* Environment Status Card */}
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse"></div>
                                                        <h3 className="text-sm font-bold text-green-800">Production Environment</h3>
                                                    </div>
                                                    <p className="text-xs text-green-700">Last Deployed: Feb 15, 2024 10:30 UTC</p>
                                                    <p className="text-xs text-green-600">Deployed By: Admin User</p>
                                                </div>
                                                <div className="px-3 py-1 bg-green-100 border border-green-300 rounded-lg">
                                                    <span className="text-xs font-bold text-green-700">LIVE</span>
                                                </div>
                                            </div>

                                            <div className="border-t border-green-200 pt-4">
                                                <label className="block text-xs font-semibold text-gray-700 mb-3">Status Control</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <button
                                                        onClick={() => setAssistantStatus('online')}
                                                        className={`px-4 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${assistantStatus === 'online'
                                                            ? 'border-green-600 bg-green-50 text-green-700 shadow-sm'
                                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 justify-center">
                                                            <div className={`w-2 h-2 rounded-full ${assistantStatus === 'online' ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                                                            Online
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setAssistantStatus('maintenance');
                                                            toast.warning('Users will see maintenance message');
                                                        }}
                                                        className={`px-4 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${assistantStatus === 'maintenance'
                                                            ? 'border-amber-600 bg-amber-50 text-amber-700 shadow-sm'
                                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 justify-center">
                                                            <div className={`w-2 h-2 rounded-full ${assistantStatus === 'maintenance' ? 'bg-amber-600' : 'bg-gray-400'}`}></div>
                                                            Maintenance
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setAssistantStatus('offline');
                                                            toast.error('Assistant will be unavailable to users');
                                                        }}
                                                        className={`px-4 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${assistantStatus === 'offline'
                                                            ? 'border-red-600 bg-red-50 text-red-700 shadow-sm'
                                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 justify-center">
                                                            <div className={`w-2 h-2 rounded-full ${assistantStatus === 'offline' ? 'bg-red-600' : 'bg-gray-400'}`}></div>
                                                            Offline
                                                        </div>
                                                    </button>
                                                </div>
                                                {assistantStatus === 'maintenance' && (
                                                    <div className="mt-3 px-3 py-2 bg-amber-100 border border-amber-300 rounded-lg flex items-start gap-2">
                                                        <AlertCircle size={14} className="text-amber-700 mt-0.5 flex-shrink-0" />
                                                        <p className="text-xs text-amber-800">Users will see: &quot;Assistant is currently under maintenance. Please check back soon.&quot;</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ========== AI RUNTIME ========== */}
                            {activeSection === 'runtime' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                <Settings size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-[#253154]">AI Runtime Configuration</h2>
                                                <p className="text-xs text-gray-600">Model, temperature, and performance settings</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-5">
                                        {/* Compact Grid Layout */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Model Provider</label>
                                                <Select value={formData.modelProvider} onValueChange={(val: any) => setFormData({ ...formData, modelProvider: val })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="openai">OpenAI</SelectItem>
                                                        <SelectItem value="anthropic">Anthropic</SelectItem>
                                                        <SelectItem value="google">Google AI</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Model Version</label>
                                                <Select value={formData.modelVersion} onValueChange={(val: any) => setFormData({ ...formData, modelVersion: val })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                                                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Response Length</label>
                                                <Select value={formData.responseLength} onValueChange={(val: any) => setFormData({ ...formData, responseLength: val })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="short">Short (150 tokens)</SelectItem>
                                                        <SelectItem value="medium">Medium (500 tokens)</SelectItem>
                                                        <SelectItem value="detailed">Detailed (1000 tokens)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Memory Window</label>
                                                <Select value={formData.memoryWindow} onValueChange={(val: any) => setFormData({ ...formData, memoryWindow: val })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="4k">4K tokens</SelectItem>
                                                        <SelectItem value="8k">8K tokens</SelectItem>
                                                        <SelectItem value="16k">16K tokens</SelectItem>
                                                        <SelectItem value="32k">32K tokens</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Temperature Slider with Visual Spectrum */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Temperature: {formData.temperature}
                                            </label>
                                            <div className="relative">
                                                <div className="h-2 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full mb-2"></div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={formData.temperature}
                                                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                                                <span>🎯 Precise</span>
                                                <span>⚖️ Balanced</span>
                                                <span>✨ Creative</span>
                                            </div>
                                        </div>

                                        {/* Impact Indicators */}
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-100">
                                                <DollarSign size={20} className="text-red-600" />
                                                <div>
                                                    <p className="text-xs text-gray-600">Cost Impact</p>
                                                    <p className={`text-sm font-bold ${getCostImpact().color}`}>{getCostImpact().label}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                                                <Gauge size={20} className="text-green-600" />
                                                <div>
                                                    <p className="text-xs text-gray-600">Performance Mode</p>
                                                    <p className={`text-sm font-bold ${getPerformanceMode().color}`}>{getPerformanceMode().label}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ========== BEHAVIOR ========== */}
                            {activeSection === 'behavior' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                                <MessageCircle size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-[#253154]">Behavior & Personality</h2>
                                                <p className="text-xs text-gray-600">Control tone, style, and communication approach</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tone</label>
                                                <Select value={formData.tone} onValueChange={(val: any) => setFormData({ ...formData, tone: val })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="friendly">Friendly</SelectItem>
                                                        <SelectItem value="professional">Professional</SelectItem>
                                                        <SelectItem value="formal">Formal</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Answer Style</label>
                                                <Select value={formData.answerStyle} onValueChange={(val: any) => setFormData({ ...formData, answerStyle: val })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="short">Short & Direct</SelectItem>
                                                        <SelectItem value="detailed">Detailed & Explanatory</SelectItem>
                                                        <SelectItem value="stepbystep">Step-by-step</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Communication</label>
                                                <Select value={formData.communicationStyle} onValueChange={(val: any) => setFormData({ ...formData, communicationStyle: val })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="conversational">Conversational</SelectItem>
                                                        <SelectItem value="technical">Technical</SelectItem>
                                                        <SelectItem value="educational">Educational</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ========== GUARDRAILS ========== */}
                            {activeSection === 'guardrails' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-red-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                                                <Shield size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-[#253154]">Safety Guardrails</h2>
                                                <p className="text-xs text-gray-600">Define restrictions and safety boundaries</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        {/* Strict Mode Highlight Card */}
                                        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-lg p-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <AlertOctagon size={24} className="text-yellow-700" />
                                                    <div>
                                                        <h3 className="text-sm font-bold text-yellow-900">Strict Mode</h3>
                                                        <p className="text-xs text-yellow-700">Enforces all guardrails without exceptions</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setStrictMode(!strictMode)}
                                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${strictMode ? 'bg-yellow-600' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${strictMode ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Guardrail Cards */}
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { key: 'noLegalAdvice', icon: Scale, title: 'No Legal Advice', desc: 'Prevents assistant from offering legal interpretation or advice' },
                                                { key: 'noGuaranteedApproval', icon: CheckCircle2, title: 'No Guaranteed Approval', desc: 'Cannot promise visa approval or guaranteed outcomes' },
                                                { key: 'noFinancialGuarantee', icon: DollarSign, title: 'No Financial Guarantees', desc: 'Cannot provide financial guarantees or investment advice' },
                                                { key: 'noImmigrationConsultancy', icon: Globe, title: 'No Immigration Consultancy', desc: 'Cannot act as official immigration consultant' },
                                                { key: 'noPolicyInterpretation', icon: FileText, title: 'No Policy Interpretation', desc: 'Cannot interpret or provide official policy guidance' },
                                            ].map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <div
                                                        key={item.key}
                                                        className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                                                    >
                                                        <div className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Icon size={18} className="text-gray-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                                            <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setGuardrails({ ...guardrails, [item.key]: !guardrails[item.key as keyof typeof guardrails] })}
                                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${guardrails[item.key as keyof typeof guardrails] ? 'bg-[#253154]' : 'bg-gray-300'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${guardrails[item.key as keyof typeof guardrails] ? 'translate-x-6' : 'translate-x-1'
                                                                    }`}
                                                            />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ========== ESCALATION ========== */}
                            {activeSection === 'escalation' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                                <AlertTriangle size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-[#253154]">Escalation Logic</h2>
                                                <p className="text-xs text-gray-600">Configure when to escalate to human counsellors</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-5">
                                        {/* Escalate When */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-3">Escalate When:</label>
                                            <div className="space-y-3">
                                                {[
                                                    { key: 'lowConfidence', label: 'Confidence below threshold', icon: BarChart3 },
                                                    { key: 'userRequestsHuman', label: 'User asks for human assistance', icon: User },
                                                    { key: 'cannotAnswer', label: 'AI cannot provide answer', icon: AlertCircle },
                                                    { key: 'negativeSentiment', label: 'Negative sentiment detected', icon: AlertTriangle },
                                                ].map((item) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <Icon size={16} className="text-gray-600" />
                                                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => setEscalationTriggers({ ...escalationTriggers, [item.key]: !escalationTriggers[item.key as keyof typeof escalationTriggers] })}
                                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${escalationTriggers[item.key as keyof typeof escalationTriggers] ? 'bg-[#253154]' : 'bg-gray-300'
                                                                    }`}
                                                            >
                                                                <span
                                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${escalationTriggers[item.key as keyof typeof escalationTriggers] ? 'translate-x-6' : 'translate-x-1'
                                                                        }`}
                                                                />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Confidence Threshold Slider */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                                Confidence Threshold: {formData.confidenceThreshold}%
                                            </label>
                                            <div className="relative">
                                                <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mb-2"></div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    step="5"
                                                    value={formData.confidenceThreshold}
                                                    onChange={(e) => setFormData({ ...formData, confidenceThreshold: parseInt(e.target.value) })}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                                                <span>🔴 Low Risk</span>
                                                <span>🟡 Medium</span>
                                                <span>🟢 High Risk</span>
                                            </div>
                                        </div>

                                        {/* Escalation Preview */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="block text-sm font-bold text-gray-700 mb-3">Escalation Flow Preview:</label>
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <Bot size={20} className="text-[#253154] flex-shrink-0 mt-1" />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-700 mb-3">I apologize, but I&apos;m not confident in my answer. Would you like to speak with a professional counsellor?</p>
                                                        <button className="px-4 py-2 bg-[#253154] text-white text-sm font-semibold rounded-lg hover:bg-[#1a2340] transition-colors">
                                                            Connect with Counsellor
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ========== WELCOME MESSAGES ========== */}
                            {activeSection === 'messages' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                                <Megaphone size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-[#253154]">Welcome Messages</h2>
                                                <p className="text-xs text-gray-600">First impression when students start a conversation</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Welcome Message</label>
                                            <textarea
                                                value={formData.welcomeMessage}
                                                onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                                                maxLength={200}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">{formData.welcomeMessage.length}/200 characters</p>
                                        </div>

                                        {/* Chat Preview */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-3">Preview:</label>
                                            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-[#253154] to-[#0e042f] rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Bot size={20} className="text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-gray-900 mb-1">{formData.assistantName}</p>
                                                        <div className="bg-white rounded-lg p-3 shadow-sm">
                                                            <p className="text-sm text-gray-700">{formData.welcomeMessage}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ========== FORMATTING ========== */}
                            {activeSection === 'formatting' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                                                <FileCheck size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-[#253154]">Response Formatting</h2>
                                                <p className="text-xs text-gray-600">Control how responses are structured and displayed</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {[
                                                { key: 'alwaysDisclaimer', label: 'Always Include Disclaimers', cat: 'Content Structure' },
                                                { key: 'showChecklistTable', label: 'Show Checklist Tables', cat: 'Tables' },
                                                { key: 'countryLinks', label: 'Include Country Resource Links', cat: 'CTA' },
                                                { key: 'estimatedTime', label: 'Show Estimated Time', cat: 'Content Structure' },
                                                { key: 'ctaButton', label: 'Include CTA Buttons', cat: 'CTA' },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                                                        <p className="text-xs text-gray-500">Category: {item.cat}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setFormattingRules({ ...formattingRules, [item.key]: !formattingRules[item.key as keyof typeof formattingRules] })}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formattingRules[item.key as keyof typeof formattingRules] ? 'bg-[#253154]' : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formattingRules[item.key as keyof typeof formattingRules] ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ========== CONFIDENCE DISPLAY ========== */}
                            {activeSection === 'confidence' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-green-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                                                <BarChart3 size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-[#253154]">Confidence Visibility</h2>
                                                <p className="text-xs text-gray-600">Control who can see AI confidence scores</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        {[
                                            {
                                                value: 'internal',
                                                title: 'Internal Only',
                                                desc: 'Confidence scores visible to admins and counsellors only',
                                                icon: Eye,
                                            },
                                            {
                                                value: 'counsellor',
                                                title: 'Show to Counsellors',
                                                desc: 'Counsellors can see scores, students cannot',
                                                icon: User,
                                            },
                                            {
                                                value: 'hidden',
                                                title: 'Hide from Students',
                                                desc: 'Confidence scores never shown to students',
                                                icon: AlertCircle,
                                            },
                                        ].map((option) => {
                                            const Icon = option.icon;
                                            return (
                                                <div
                                                    key={option.value}
                                                    onClick={() => setFormData({ ...formData, confidenceVisibility: option.value })}
                                                    className={`
                                                        flex items-start gap-3 p-4 border-2 rounded-lg transition-all cursor-pointer
                                                        ${formData.confidenceVisibility === option.value
                                                            ? 'border-purple-600 bg-purple-50/50'
                                                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'}
                                                    `}
                                                >
                                                    <div className={`
                                                        w-10 h-10 border rounded-lg flex items-center justify-center flex-shrink-0
                                                        ${formData.confidenceVisibility === option.value ? 'bg-purple-100 border-purple-300' : 'bg-gray-100 border-gray-300'}
                                                    `}>
                                                        <Icon size={18} className={formData.confidenceVisibility === option.value ? 'text-purple-600' : 'text-gray-600'} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`text-sm font-bold ${formData.confidenceVisibility === option.value ? 'text-purple-900' : 'text-gray-900'}`}>{option.title}</h4>
                                                        <p className="text-xs text-gray-600 mt-0.5">{option.desc}</p>
                                                    </div>
                                                    <div className={`
                                                        w-5 h-5 border-2 rounded-full flex items-center justify-center
                                                        ${formData.confidenceVisibility === option.value ? 'border-purple-600' : 'border-gray-300'}
                                                    `}>
                                                        {formData.confidenceVisibility === option.value && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full"></div>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ========== VERSIONING ========== */}
                            {activeSection === 'versioning' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
                                                <GitBranch size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-[#253154]">Version Control</h2>
                                                <p className="text-xs text-gray-600">Manage configuration versions and rollbacks</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-5">
                                        {/* Timeline */}
                                        <div className="relative">
                                            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                            {[
                                                { version: 'v1.4', date: '2024-02-15', status: 'current', author: 'Admin User' },
                                                { version: 'v1.3', date: '2024-02-10', status: 'previous', author: 'Admin User' },
                                                { version: 'v1.2', date: '2024-02-05', status: 'archived', author: 'System' },
                                            ].map((item, idx) => (
                                                <div key={item.version} className="relative flex gap-4 pb-6">
                                                    <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center ${item.status === 'current'
                                                        ? 'bg-green-600 border-green-600'
                                                        : 'bg-white border-gray-300'
                                                        }`}>
                                                        {item.status === 'current' && <CheckCircle2 size={14} className="text-white" />}
                                                    </div>
                                                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <h4 className="text-sm font-bold text-gray-900">{item.version}</h4>
                                                                <p className="text-xs text-gray-600">Published {item.date} by {item.author}</p>
                                                            </div>
                                                            {item.status === 'current' ? (
                                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">LIVE</span>
                                                            ) : (
                                                                <Button variant="outline" size="sm">
                                                                    <RotateCcw size={14} className="mr-2" />
                                                                    Rollback
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Sticky Preview & Context Panel (40%) */}
                    <div className="w-[40%] space-y-6">
                        <div className="sticky top-24 space-y-6">
                            {/* Live Preview Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                                <div className="px-5 py-4 bg-gradient-to-r from-[#253154] to-[#0e042f] text-white">
                                    <div className="flex items-center gap-2">
                                        <Eye size={18} />
                                        <h3 className="text-sm font-bold">Live Preview</h3>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#253154] to-[#0e042f] rounded-full flex items-center justify-center flex-shrink-0">
                                                <Bot size={24} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-[#253154]">{formData.assistantName}</p>
                                                <p className="text-xs text-gray-600">{formData.tagline}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 shadow-sm mb-3">
                                            <p className="text-sm text-gray-700">{formData.welcomeMessage}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <button className="px-3 py-2 bg-white hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-700 border border-gray-200">
                                                University Search
                                            </button>
                                            <button className="px-3 py-2 bg-white hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-700 border border-gray-200">
                                                Visa Requirements
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Context Info Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
                                <div className="flex items-start gap-3">
                                    <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-bold text-blue-900 mb-2">Configuration Tips</h3>
                                        <ul className="text-xs text-blue-800 space-y-1.5">
                                            <li>• Higher temperature = more creative responses</li>
                                            <li>• Enable guardrails to prevent sensitive topics</li>
                                            <li>• Set confidence threshold based on risk tolerance</li>
                                            <li>• Test changes in draft mode before publishing</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Impact Summary Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="text-sm font-bold text-gray-900 mb-4">Impact Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Cost per 1K queries</span>
                                        <span className={`text-xs font-bold ${getCostImpact().color}`}>${formData.modelVersion === 'gpt-4-turbo' ? '12.50' : '8.20'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Avg Response Time</span>
                                        <span className="text-xs font-bold text-gray-900">2.3s</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Guardrails Active</span>
                                        <span className="text-xs font-bold text-green-600">{Object.values(guardrails).filter(Boolean).length}/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
