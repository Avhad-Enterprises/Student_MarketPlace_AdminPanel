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
    ChevronDown,
    Send,
    RefreshCw,
    Loader2 as Loader
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { aiAssistantService, AiAssistantSettingsVersion } from '../../services/aiAssistantService';
import { AddEnquiryModal } from './AddEnquiryModal';

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
                        if (child && child.type === SelectContent) {
                            return React.Children.map(child.props.children, (item: any) => {
                                if (!item) return null;
                                return (
                                    <div
                                        key={item.props?.value || Math.random()}
                                        className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100"
                                        onClick={() => {
                                            onValueChange(item.props?.value);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {item.props?.children}
                                    </div>
                                );
                            });
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
    const [versions, setVersions] = useState<AiAssistantSettingsVersion[]>([]);
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        profileIcon: '',
        escalationMessage: 'I apologize, but I am not confident in my answer. Would you like to speak with a professional counsellor?',
        escalationButtonText: 'Connect with Counsellor',
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

    // Chat Simulation State
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isTyping]);

    // Initialize and sync chat with welcome message
    useEffect(() => {
        if (chatMessages.length <= 1) {
            setChatMessages([
                { role: 'assistant', content: formData.welcomeMessage, timestamp: new Date() }
            ]);
        }
    }, [formData.welcomeMessage]);

    const handleConnectToCounsellor = () => {
        setIsEnquiryModalOpen(true);
    };

    const resetChat = () => {
        setChatMessages([
            { role: 'assistant', content: formData.welcomeMessage, timestamp: new Date() }
        ]);
        setChatInput('');
        setIsTyping(false);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!chatInput.trim() || isTyping) return;

        const currentInput = chatInput;
        const userMsg = { role: 'user', content: currentInput, timestamp: new Date() };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);

        // Simulate AI "Thinking"
        await new Promise(resolve => setTimeout(resolve, 1500));

        let response = "";
        const input = currentInput.toLowerCase();

        // Mock AI Reasoning Logic
        if (guardrails.noGuaranteedApproval && (input.includes('guarantee') || input.includes('will i get'))) {
            response = "I cannot provide guarantees on visa approval. My role is to guide you through the requirements and best practices based on current regulations.";
        } else if (input.includes('hello') || input.includes('hi')) {
            response = `Hello! I am ${formData.assistantName}. How can I assist you with your study abroad visa process today?`;
        } else if (input.includes('human') || input.includes('counsellor') || input.includes('person') || input.includes('talk to someone')) {
            response = formData.escalationMessage;
            setChatMessages(prev => [...prev, {
                role: 'assistant',
                content: response,
                timestamp: new Date(),
                isEscalation: true
            }]);
            setIsTyping(false);
            return;
        } else if (input.includes('usa') || input.includes('united states')) {
            response = "The USA is a top destination! For a Student Visa (F-1), you'll primarily need an I-20 form from a SEVP-certified school, proof of financial support, and a valid passport. Popular universities include Stanford, MIT, and NYU. Are you looking for undergraduate or graduate programs?";
        } else if (input.includes('uk') || input.includes('united kingdom')) {
            response = "The UK offers great one-year Masters programs. You'll need a CAS (Confirmation of Acceptance for Studies) from your university and to meet the 70-point threshold under the Student Visa route. Would you like to know about the NHS health surcharge?";
        } else if (input.includes('university') || input.includes('universities')) {
            if (input.includes('usa') || input.includes('united states')) {
                response = "In the United States, some highly-ranked universities for international students are Harvard, Yale, and UC Berkeley. Depending on your GPA and GRE/SAT scores, I can suggest more specific options.";
            } else {
                response = "I can suggest universities based on your target country. We have data for the USA, UK, Canada, and Australia. Which one interests you most?";
            }
        } else if (input.includes('cost') || input.includes('price') || input.includes('fee')) {
            response = "Visa and tuition costs vary significantly. A US F-1 visa fee is $185 plus the SEVIS fee ($350). Would you like me to provide a breakdown for a specific country?";
        } else if (input.includes('document') || input.includes('need') || input.includes('prep')) {
            response = "Generally, you'll need: 1. A valid Passport, 2. Admission Letter, 3. Financial Statements, 4. English Proficiency scores (IELTS/TOEFL), and 5. Academic Transcripts. Should we go over the financial requirements in detail?";
        } else {
            // Contextual style-based varied fallback
            const prefixes = formData.tone === 'friendly'
                ? ["That's a great question! ", "I'd be happy to help with that. ", "Sure thing! "]
                : ["I understand your query. ", "Rest assured, ", "Regarding your request: "];

            const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            response = randomPrefix + "I'm analyzing your request regarding " + (input.length > 20 ? "those details" : input) + ". ";

            if (formData.answerStyle === 'detailed') {
                response += "The study abroad process is multifaceted, involving academic selection, financial planning, and legal visa documentation. ";
            }

            response += "To give you the most accurate advice, could you tell me which country or specific university you are targeting?";
        }

        setChatMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
        setIsTyping(false);
    };

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
                        profileIcon: data.profile_icon || '',
                        escalationMessage: data.escalation_message || 'I apologize, but I am not confident in my answer. Would you like to speak with a professional counsellor?',
                        escalationButtonText: data.escalation_button_text || 'Connect with Counsellor',
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
        fetchVersions();
    }, []);

    const fetchVersions = async () => {
        try {
            const data = await aiAssistantService.getVersions();
            if (data && Array.isArray(data)) {
                setVersions(data);
            } else {
                setVersions([]);
            }
        } catch (error) {
            console.error('Failed to fetch versions:', error);
            setVersions([]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profileIcon: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRollback = async (versionId: number) => {
        if (!window.confirm('Are you sure you want to rollback to this version? This will overwrite your current settings.')) {
            return;
        }

        try {
            setLoading(true);
            await aiAssistantService.rollbackVersion(versionId);
            toast.success('Settings rolled back successfully');

            // Reload settings and versions
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
                    profileIcon: data.profile_icon || '',
                    escalationMessage: data.escalation_message,
                    escalationButtonText: data.escalation_button_text,
                } as any);
                setAssistantStatus(data.status);
                setStrictMode(data.strict_mode);
                if (data.updated_at) {
                    setLastPublished(new Date(data.updated_at).toLocaleString());
                }
                fetchVersions();
            }
        } catch (error) {
            toast.error('Failed to rollback settings');
        } finally {
            setLoading(false);
        }
    };

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
                profile_icon: formData.profileIcon,
                escalation_message: formData.escalationMessage,
                escalation_button_text: formData.escalationButtonText,
            };

            await aiAssistantService.updateSettings(dataToSave);
            toast.success(isPublish ? 'Changes published successfully' : 'Draft saved successfully');
            if (isPublish) {
                setLastPublished(new Date().toLocaleString());
            }
            fetchVersions();
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
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-xl">
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
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                <div className="w-20 h-20 bg-gradient-to-br from-[#253154] to-[#0e042f] rounded-2xl flex items-center justify-center mb-4 shadow-lg overflow-hidden border-2 border-white">
                                                    {formData.profileIcon ? (
                                                        <img src={formData.profileIcon} alt="Icon Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Bot size={40} className="text-white" />
                                                    )}
                                                </div>
                                                <p className="text-sm font-semibold text-gray-700 mb-2">Profile Icon</p>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                        <Upload size={14} className="mr-2" />
                                                        Upload
                                                    </Button>
                                                    {formData.profileIcon && (
                                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setFormData({ ...formData, profileIcon: '' })}>
                                                            <RotateCcw size={14} className="mr-2" />
                                                            Reset
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2 text-center">Recommended: 512x512px PNG (Max 2MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ========== ENVIRONMENT CONTROL ========== */}
                            {activeSection === 'environment' && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-xl">
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
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
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
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
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
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-red-50 rounded-t-xl">
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
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-xl">
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

                                        {/* Escalation Action Configuration */}
                                        <div className="pt-4 border-t border-gray-100 space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Escalation Message:</label>
                                                <textarea
                                                    value={formData.escalationMessage}
                                                    onChange={(e) => setFormData({ ...formData, escalationMessage: e.target.value })}
                                                    rows={3}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253154] focus:border-transparent text-sm resize-none"
                                                    placeholder="Enter message to show before escalation button..."
                                                />
                                            </div>
                                        </div>

                                        {/* Escalation Preview */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="block text-sm font-bold text-gray-700 mb-3">Escalation Flow Preview:</label>
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <Bot size={20} className="text-[#253154] flex-shrink-0 mt-1" />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-700 mb-3">{formData.escalationMessage}</p>
                                                        <button
                                                            onClick={handleConnectToCounsellor}
                                                            className="px-4 py-2 bg-[#253154] text-white text-sm font-semibold rounded-lg hover:bg-[#1a2340] transition-colors"
                                                        >
                                                            {formData.escalationButtonText}
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
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl">
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
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-xl">
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
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-green-50 rounded-t-xl">
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
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50 rounded-t-xl">
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
                                            {(!Array.isArray(versions) || versions.length === 0) ? (
                                                <div className="text-center py-10">
                                                    <History size={40} className="mx-auto text-gray-300 mb-3" />
                                                    <p className="text-sm text-gray-500">No version history available yet.</p>
                                                    <p className="text-xs text-gray-400 mt-1">Versions are created automatically when you save changes.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                                    {versions.map((item, idx) => (
                                                        <div key={item.id} className="relative flex gap-4">
                                                            <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${idx === 0
                                                                ? 'bg-green-600 border-green-600'
                                                                : 'bg-white border-gray-300'
                                                                }`}>
                                                                {idx === 0 && <CheckCircle2 size={12} className="text-white" />}
                                                            </div>
                                                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <h4 className="text-sm font-bold text-gray-900">{item.version_label}</h4>
                                                                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">ID: {item.id}</span>
                                                                        </div>
                                                                        <p className="text-xs text-gray-600">Created {new Date(item.created_at).toLocaleString()} by {item.created_by}</p>
                                                                    </div>
                                                                    {idx === 0 ? (
                                                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">CURRENT VERSION</span>
                                                                    ) : (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => handleRollback(item.id)}
                                                                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 h-8"
                                                                        >
                                                                            <RotateCcw size={14} className="mr-2" />
                                                                            Restore
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
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
                                <div className="p-0 flex flex-col h-[500px]">
                                    {/* Chat Header (Compact) */}
                                    <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50/50">
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                {formData.profileIcon ? (
                                                    <img src={formData.profileIcon} className="w-8 h-8 rounded-full object-cover border border-gray-200" alt="Bot Icon" />
                                                ) : (
                                                    <div className="w-8 h-8 bg-[#253154] rounded-full flex items-center justify-center">
                                                        <Bot size={18} className="text-white" />
                                                    </div>
                                                )}
                                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#253154]">{formData.assistantName}</p>
                                                <p className="text-[10px] text-gray-500">{assistantStatus === 'online' ? 'Online' : 'Offline'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={resetChat}
                                            className="p-1.5 text-gray-400 hover:text-[#253154] transition-colors"
                                            title="Reset Chat"
                                        >
                                            <RefreshCw size={14} />
                                        </button>
                                    </div>

                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                                        {chatMessages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user'
                                                    ? 'bg-[#253154] text-white rounded-tr-none'
                                                    : 'bg-white border text-gray-700 shadow-sm rounded-tl-none'
                                                    }`}>
                                                    <p>{msg.content}</p>
                                                    {msg.isEscalation && (
                                                        <button
                                                            onClick={handleConnectToCounsellor}
                                                            className="mt-3 w-full py-2 bg-[#253154] text-white text-xs font-bold rounded-lg hover:bg-[#1a2340] transition-colors"
                                                        >
                                                            {formData.escalationButtonText}
                                                        </button>
                                                    )}
                                                    <p className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-gray-300 text-right' : 'text-gray-400'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                                                    <div className="flex gap-1">
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }}
                                        className="p-3 border-t bg-white"
                                    >
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                placeholder="Ask your assistant anything..."
                                                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#253154] transition-all"
                                                disabled={isTyping}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!chatInput.trim() || isTyping}
                                                className="absolute right-1.5 top-1.5 p-1.5 bg-[#253154] text-white rounded-lg hover:bg-[#1a2340] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isTyping ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400 text-center mt-2">
                                            Testing: {formData.tone} tone • {formData.answerStyle} style
                                        </p>
                                    </form>
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

            <AddEnquiryModal
                isOpen={isEnquiryModalOpen}
                onClose={() => setIsEnquiryModalOpen(false)}
                onSuccess={() => {
                    setIsEnquiryModalOpen(false);
                    fetchVersions(); // Or just a success toast, AddEnquiryModal already toasts
                }}
            />
        </div>
    );
};
