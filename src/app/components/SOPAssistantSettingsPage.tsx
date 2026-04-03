'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Save,
    Settings,
    Bot,
    MessageCircle,
    Shield,
    Zap,
    RotateCcw,
    CheckCircle2,
    Loader2,
    ChevronDown,
    Sparkles,
    Cpu,
    Target,
    Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import { sopAssistantService, SOPAssistantSettings } from '@/services/sopAssistantService';

// Fallback Select component for consistency
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
                className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f172b] focus:ring-offset-2 cursor-pointer transition-all"
            >
                <span className="font-medium text-gray-700">{value}</span>
                <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-white p-1 text-gray-950 shadow-xl ring-1 ring-black ring-opacity-5">
                    {React.Children.map(children, (child: any) => {
                        if (child.type === SelectContent) {
                            return React.Children.map(child.props.children, (item: any) => (
                                <div
                                    className={`relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 px-3 text-sm outline-none transition-colors ${value === item.props.value ? 'bg-purple-50 text-purple-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
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

const SelectContent = ({ children }: any) => children;
const SelectItem = ({ children, value }: any) => <div data-value={value}>{children}</div>;

export const SOPAssistantSettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('runtime');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const [settings, setSettings] = useState<SOPAssistantSettings>({
        model_provider: 'openai',
        model_version: 'gpt-4o',
        system_prompt: '',
        confidence_threshold: 70,
        auto_approval: false,
        max_tokens: 2000,
        temperature: 0.5
    });

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingAutoApproval, setPendingAutoApproval] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const response = await sopAssistantService.getSettings();
            if (response.data) {
                setSettings(response.data);
                if (response.data.updated_at) {
                    setLastUpdated(new Date(response.data.updated_at).toLocaleString());
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await sopAssistantService.updateSettings(settings);
            toast.success('Settings updated successfully');
            setLastUpdated(new Date().toLocaleString());
        } catch (error) {
            toast.error('Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    const sections = [
        { id: 'runtime', label: 'AI Runtime', icon: Cpu },
        { id: 'prompt', label: 'Analysis Logic', icon: MessageCircle },
        { id: 'thresholds', label: 'Thresholds & Rules', icon: Target },
        { id: 'safety', label: 'Security & Safety', icon: Shield },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
                <Loader2 className="w-10 h-10 text-[#0f172b] animate-spin mb-4" />
                <p className="text-gray-500 font-medium font-sans">Initializing SOP Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="w-full py-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-4 sm:px-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-tr from-[#0f172b] to-[#253154] rounded-2xl flex items-center justify-center shadow-xl shadow-purple-900/10 transition-transform hover:scale-105 duration-300">
                                <Settings size={24} className="text-white" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-[#0f172b] tracking-tight">SOP Intelligence Console</h1>
                        </div>
                        <p className="text-[#62748e] font-medium ml-1">Configure advanced AI parameters for Statement of Purpose analysis</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {lastUpdated && (
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl border border-purple-100">
                                <Activity size={16} className="text-purple-600" />
                                <span className="text-xs font-semibold text-purple-700">Refreshed: {lastUpdated}</span>
                            </div>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-[#0f172b] hover:bg-[#1a2340] text-white px-8 rounded-xl h-12 shadow-lg shadow-purple-900/20 transition-all hover:translate-y-[-2px] active:translate-y-0"
                        >
                            {isSaving ? (
                                <Loader2 size={20} className="mr-2 animate-spin" />
                            ) : (
                                <Save size={20} className="mr-2" />
                            )}
                            Save Configuration
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full lg:w-[280px] shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 space-y-1 sticky top-8">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all duration-300 ${activeSection === section.id
                                            ? 'bg-[#0f172b] text-white shadow-lg shadow-purple-900/10 translate-x-1'
                                            : 'text-[#62748e] hover:bg-gray-50 hover:text-[#0f172b]'
                                            }`}
                                    >
                                        <Icon size={20} className={activeSection === section.id ? 'text-purple-400' : ''} />
                                        <span className="font-bold text-[15px]">{section.label}</span>
                                        {activeSection === section.id && (
                                            <div className="ml-auto w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Logic Area */}
                    <div className="flex-1 space-y-6">
                        {/* Runtime Settings */}
                        {activeSection === 'runtime' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#0f172b] rounded-xl flex items-center justify-center shadow-lg">
                                            <Cpu size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-[#0f172b]">Compute & Core Intelligence</h2>
                                            <p className="text-sm text-gray-500 font-medium">Define the foundational LLM architecture and performance bounds</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#0f172b] ml-1">AI Model Provider</label>
                                            <Select value={settings.model_provider} onValueChange={(val: any) => setSettings({ ...settings, model_provider: val })}>
                                                <SelectContent>
                                                    <SelectItem value="openai">OpenAI (Pro)</SelectItem>
                                                    <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                                                    <SelectItem value="google">Google Gemini</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#0f172b] ml-1">Model Version</label>
                                            <Select value={settings.model_version} onValueChange={(val: any) => setSettings({ ...settings, model_version: val })}>
                                                <SelectContent>
                                                    <SelectItem value="gpt-4o">GPT-4o (Omni)</SelectItem>
                                                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#0f172b] ml-1">Maximum Token Limit</label>
                                            <input
                                                type="number"
                                                value={settings.max_tokens}
                                                onChange={(e) => setSettings({ ...settings, max_tokens: parseInt(e.target.value) })}
                                                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-[#0f172b] focus:ring-2 focus:ring-purple-100 outline-none transition-all font-medium text-gray-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#0f172b] ml-1 flex items-center gap-2">
                                                Creativity Level (Temperature)
                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] uppercase font-bold">{settings.temperature < 0.4 ? 'Precise' : settings.temperature > 0.7 ? 'Creative' : 'Balanced'}</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={settings.temperature}
                                                onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                                                className="w-full h-11 py-2"
                                            />
                                            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">
                                                <span>Fact-Based</span>
                                                <span>Natural</span>
                                                <span>Imaginative</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Analysis Logic Area */}
                        {activeSection === 'prompt' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#0f172b] rounded-xl flex items-center justify-center shadow-lg">
                                            <Sparkles size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-[#0f172b]">Cognitive Analysis Prompt</h2>
                                            <p className="text-sm text-gray-500 font-medium">Fine-tune the internal heuristic and reasoning logic of the SOP assistant</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-sm font-bold text-[#0f172b]">System Reasoning Engine</label>
                                            <button onClick={() => setSettings({ ...settings, system_prompt: 'You are a professional Statement of Purpose (SOP) reviewer. Analyze the provided SOP for clarity, tone, structure, and impact. Provide a confidence score and detailed feedback.' })} className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 translate-y-0.5">
                                                <RotateCcw size={12} />
                                                Reset to Global Default
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <textarea
                                                value={settings.system_prompt}
                                                onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
                                                className="w-full min-h-[350px] p-6 rounded-2xl border border-gray-200 focus:border-[#0f172b] focus:ring-4 focus:ring-purple-50/50 outline-none transition-all font-mono text-[13px] leading-relaxed text-gray-700 bg-gray-50/30"
                                                placeholder="Define the core logic here..."
                                            />
                                            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest pointer-events-none group-focus-within:opacity-0 transition-opacity">
                                                Advanced Engine Script
                                            </div>
                                        </div>
                                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start gap-4 transform transition-all hover:scale-[1.01]">
                                            <MessageCircle size={18} className="text-blue-600 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-blue-900 mb-1">PRO TIP: Structured Reasoning</p>
                                                <p className="text-xs text-blue-700/80 leading-relaxed font-medium">Use structured blocks like &quot;[Objective]&quot;, &quot;[Context]&quot;, and &quot;[Constraints]&quot; in your prompt to improve the AI&apos;s adherence to complex SOP review rules.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Thresholds Area */}
                        {activeSection === 'thresholds' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#0f172b] rounded-xl flex items-center justify-center shadow-lg">
                                            <Target size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-[#0f172b]">Heuristic Thresholds</h2>
                                            <p className="text-sm text-gray-500 font-medium">Set the rigorous bars for automated quality assurance</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 space-y-10">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between ml-1">
                                            <div className="space-y-0.5">
                                                <label className="text-sm font-bold text-[#0f172b]">Confidence Pass-Rate (%)</label>
                                                <p className="text-xs text-gray-500 font-medium">Minimum AI certainty required to flag a record as &quot;Reviewed&quot;</p>
                                            </div>
                                            <span className="text-2xl font-black text-purple-600 tabular-nums">{settings.confidence_threshold}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={settings.confidence_threshold}
                                            onChange={(e) => setSettings({ ...settings, confidence_threshold: parseInt(e.target.value) })}
                                            className="w-full accent-[#0f172b]"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className={`p-4 rounded-xl border transition-all ${settings.confidence_threshold <= 50 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                                                <h4 className={`text-xs font-bold mb-1 ${settings.confidence_threshold <= 50 ? 'text-amber-900' : 'text-gray-900'}`}>Lenient Mode</h4>
                                                <p className="text-[10px] font-medium text-gray-500 tracking-tight">Captures more SOPs but increases risk of false positives from the AI.</p>
                                            </div>
                                            <div className={`p-4 rounded-xl border transition-all ${settings.confidence_threshold > 80 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                                <h4 className={`text-xs font-bold mb-1 ${settings.confidence_threshold > 80 ? 'text-green-900' : 'text-gray-900'}`}>Rigorous Mode</h4>
                                                <p className="text-[10px] font-medium text-gray-500 tracking-tight">Ensures high precision but requires human review for more records.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-100">
                                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-white transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm group-hover:scale-110 transition-transform">
                                                    <Zap size={20} className={settings.auto_approval ? 'text-amber-500 fill-amber-500' : 'text-gray-400'} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-[#0f172b]">Autonomous Approval</h3>
                                                    <p className="text-xs text-gray-500 font-medium">Automatically mark SOPs as &quot;Approved&quot; if score exceeds threshold</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={settings.auto_approval}
                                                    onChange={(e) => {
                                                        const newVal = e.target.checked;
                                                        if (newVal) {
                                                            setPendingAutoApproval(true);
                                                            setIsConfirmModalOpen(true);
                                                        } else {
                                                            setSettings({ ...settings, auto_approval: false });
                                                        }
                                                    }}
                                                />
                                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f172b]"></div>
                                            </label>
                                        </div>

                                        {/* Confirmation Modal */}
                                        <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
                                            <AlertDialogContent className="bg-white rounded-[32px] border-none shadow-2xl p-0 overflow-hidden max-w-[500px]">
                                                <div className="bg-[#0f172b] p-8 text-white relative">
                                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                                        <Zap size={100} />
                                                    </div>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-2xl font-bold mb-2">Enable Autonomous Approval?</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-slate-300 text-sm font-medium leading-relaxed">
                                                            Activating this feature will allow the AI to automatically mark Statement of Purpose documents as "Approved" if they exceed your set confidence threshold.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                </div>
                                                <div className="p-8 space-y-6">
                                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                                                        <Shield className="text-amber-600 mt-0.5 shrink-0" size={18} />
                                                        <p className="text-[13px] text-amber-900 font-medium leading-relaxed">
                                                            This may bypass human review for high-confidence records. Ensure your prompt logic and thresholds are thoroughly tested.
                                                        </p>
                                                    </div>
                                                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
                                                        <AlertDialogCancel 
                                                            className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                                                            onClick={() => setIsConfirmModalOpen(false)}
                                                        >
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction 
                                                            className="flex-1 h-12 rounded-xl bg-[#0f172b] text-white font-bold hover:bg-[#1e293b] shadow-lg shadow-slate-200"
                                                            onClick={() => {
                                                                setSettings({ ...settings, auto_approval: true });
                                                                setIsConfirmModalOpen(false);
                                                                toast.info('Autonomous Approval enabled. Review your thresholds.');
                                                            }}
                                                        >
                                                            Yes, Enable Feature
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </div>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Area */}
                        {activeSection === 'safety' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-red-50/50 to-amber-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#0f172b] rounded-xl flex items-center justify-center shadow-lg">
                                            <Shield size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-[#0f172b]">Boundary & Intelligence Safety</h2>
                                            <p className="text-sm text-gray-500 font-medium">Control data sanitization and output guardrails</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-amber-300 shadow-sm shrink-0">
                                            <Shield size={20} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-amber-900 mb-1">PII Data Sanitization</h3>
                                            <p className="text-xs text-amber-800 font-medium leading-relaxed mb-4">Automatically detect and mask student names, passport numbers, and contact information before sending data to LLM providers. Recommended for GDPR compliance.</p>
                                            <Button variant="outline" size="sm" className="bg-white border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold h-9">Configure Data Stripping</Button>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <h4 className="text-xs font-bold text-[#0f172b] uppercase tracking-widest ml-1">Regulatory Boundaries</h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { label: 'Prohibit Immigration Legal Advice', enabled: true },
                                                { label: 'Enforce Plagiarism Red-Flags', enabled: true },
                                                { label: 'Strict Style Governance', enabled: false }
                                            ].map((rule, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                    <span className="text-sm font-bold text-gray-700">{rule.label}</span>
                                                    <div className={`px-2 py-1 rounded text-[10px] font-black uppercase ${rule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                        {rule.enabled ? 'Active' : 'Standby'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
