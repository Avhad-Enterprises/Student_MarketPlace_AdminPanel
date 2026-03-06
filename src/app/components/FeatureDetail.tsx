'use client';

/**
 * AI VISA ASSISTANT - FEATURE DETAILS PAGE
 * 
 * Enterprise Configuration Console for Individual Features
 * LEFT (65%): Configuration Workspace with Logical Layers
 * RIGHT (35%): Live Preview + Analytics + Impact Metrics
 */

import React, { useState, useEffect } from 'react';
import {
    Save,
    Upload,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Clock,
    User,
    ArrowLeft,
    ExternalLink,
    Sparkles,
    Zap,
    Target,
    Settings,
    BarChart3,
    TrendingUp,
    Users,
    MessageSquare,
    ChevronDown,
    AlertCircle,
    Globe,
    Lock,
    Unlock,
    GripVertical,
    Activity,
    GitBranch,
    Info,
    Bot,
    ChevronRight,
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { aiFeatureService, AiFeature } from '@/services/aiFeatureService';

// Reusing the same Custom Select since the main one is missing in target
const Select: React.FC<{ value: string; onValueChange: (val: string) => void; children: React.ReactNode }> = ({ value, onValueChange, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedChild = React.Children.toArray(children).find(
        (child: any) => child.props.value === value
    ) as React.ReactElement;

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 transition-all text-left"
            >
                <span className="truncate">{selectedChild ? selectedChild.props.children : 'Select option'}</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 max-h-60 overflow-auto">
                    {React.Children.map(children, (child: any) =>
                        React.cloneElement(child, {
                            onClick: () => {
                                onValueChange(child.props.value);
                                setIsOpen(false);
                            },
                            isSelected: child.props.value === value
                        })
                    )}
                </div>
            )}
        </div>
    );
};

const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
const SelectValue: React.FC = () => null;
const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
const SelectItem: React.FC<{ value: string; children: React.ReactNode; onClick?: () => void; isSelected?: boolean }> = ({ children, onClick, isSelected }) => (
    <div
        onClick={onClick}
        className={`px-4 py-2 text-sm cursor-pointer hover:bg-purple-50 flex items-center justify-between ${isSelected ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'}`}
    >
        {children}
    </div>
);

interface FeatureDetailProps {
    featureId: string;
    onBack: () => void;
}

export const FeatureDetail: React.FC<FeatureDetailProps> = ({ featureId, onBack }) => {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [modifiedSections, setModifiedSections] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [feature, setFeature] = useState<AiFeature>({
        feature_id: featureId,
        order: 1,
        name: '',
        status: 'active',
        show_in_dashboard: true,
        linked_flow: '',
        description: '',
        starter_prompt: '',
        usage_30d: 0,
        requires_ielts: false,
        requires_country: false,
        requires_profile: false,
        category: 'academic'
    });

    useEffect(() => {
        if (featureId === 'new') {
            setIsLoading(false);
            return;
        }
        const fetchDetails = async () => {
            try {
                const data = await aiFeatureService.getFeatureById(featureId);
                setFeature(data);
            } catch (error) {
                console.error('Error fetching feature details:', error);
                toast.error('Failed to load feature details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [featureId]);

    const handleChange = (field: keyof AiFeature, value: any, section: string) => {
        setFeature({ ...feature, [field]: value });
        setHasUnsavedChanges(true);
        if (!modifiedSections.includes(section)) {
            setModifiedSections([...modifiedSections, section]);
        }
    };

    const handleSave = async () => {
        try {
            if (featureId === 'new') {
                await aiFeatureService.createFeature(feature);
                toast.success('Feature created successfully');
            } else {
                await aiFeatureService.updateFeature(featureId, feature);
                toast.success('Changes saved successfully');
            }
            setHasUnsavedChanges(false);
            setModifiedSections([]);
            if (featureId === 'new') onBack();
        } catch (error) {
            toast.error(featureId === 'new' ? 'Failed to create feature' : 'Failed to save changes');
        }
    };

    const handlePublish = async () => {
        try {
            const updated: AiFeature = { ...feature, status: 'active' };
            if (featureId === 'new') {
                await aiFeatureService.createFeature(updated);
                toast.success('Feature created and published');
                onBack();
            } else {
                await aiFeatureService.updateFeature(featureId, updated);
                setFeature(updated);
                toast.success('Feature published successfully');
            }
            setHasUnsavedChanges(false);
            setModifiedSections([]);
        } catch (error) {
            toast.error('Failed to publish changes');
        }
    };

    const handleDisable = async () => {
        if (window.confirm('Are you sure you want to disable this feature? It will be hidden from all students.')) {
            try {
                const updated: AiFeature = { ...feature, status: 'disabled' };
                if (featureId === 'new') {
                    await aiFeatureService.createFeature(updated);
                    toast.success('Feature created (Disabled)');
                    onBack();
                } else {
                    await aiFeatureService.updateFeature(featureId, updated);
                    setFeature(updated);
                    toast.warning('Feature disabled');
                }
                setHasUnsavedChanges(false);
                setModifiedSections([]);
            } catch (error) {
                toast.error('Failed to disable feature');
            }
        }
    };

    const flows = [
        { id: 'university-finder-flow', name: 'University Finder Flow', status: 'published' },
        { id: 'sop-analysis-flow', name: 'SOP Analysis Flow', status: 'published' },
        { id: 'visa-info-flow', name: 'Visa Info Flow', status: 'published' },
        { id: 'eligibility-flow', name: 'Eligibility Assessment Flow', status: 'draft' },
    ];

    const selectedFlow = flows.find(f => f.id === feature.linked_flow);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-[1800px] mx-auto px-8 py-5">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#253154] mb-3 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Features Manager
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Feature Icon */}
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Sparkles size={28} className="text-white" />
                            </div>

                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-[22px] font-bold text-[#253154]">{feature.name}</h1>
                                    {/* Status Badge */}
                                    {feature.status === 'active' ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg border border-green-300 flex items-center gap-1.5">
                                            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                                            Active
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg border border-gray-300 flex items-center gap-1.5">
                                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                            Disabled
                                        </span>
                                    )}
                                    {hasUnsavedChanges && (
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg border border-amber-300">
                                            Unsaved Changes
                                        </span>
                                    )}
                                </div>
                                <p className="text-[13px] text-gray-600 mt-1">{feature.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        <span>Updated: {feature.updated_at ? new Date(feature.updated_at).toLocaleString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User size={12} />
                                        <span>By: Admin User</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Version */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                <GitBranch size={14} className="text-gray-600" />
                                <span className="text-xs font-semibold text-gray-700">v2.1</span>
                            </div>

                            {/* Save Draft */}
                            <Button
                                variant="outline"
                                className="h-10"
                                onClick={handleSave}
                                disabled={!hasUnsavedChanges}
                            >
                                <Save size={16} className="mr-2" />
                                Save Draft
                            </Button>

                            {/* Publish */}
                            <Button
                                className="bg-[#253154] hover:bg-[#1a2340] text-white h-10 shadow-lg shadow-purple-900/20"
                                onClick={handlePublish}
                            >
                                <CheckCircle2 size={16} className="mr-2" />
                                Publish Changes
                            </Button>

                            {/* Disable Feature */}
                            <Button
                                variant="outline"
                                className="h-10 border-red-200 text-red-600 hover:bg-red-50"
                                onClick={handleDisable}
                            >
                                <XCircle size={16} className="mr-2" />
                                Disable Feature
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Layout: Two-Column Split */}
            <div className="max-w-[1800px] mx-auto px-8 py-8">
                <div className="flex gap-8">
                    {/* LEFT: Configuration Workspace (65%) */}
                    <div className="flex-1 w-[65%] space-y-6">
                        {/* ========== LAYER 1: FEATURE IDENTITY & VISIBILITY ========== */}
                        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${modifiedSections.includes('identity') ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-200'
                            }`}>
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                            <Sparkles size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-[#253154]">Feature Identity & Visibility</h2>
                                            <p className="text-xs text-gray-600">Control what students see and how feature appears</p>
                                        </div>
                                    </div>
                                    {modifiedSections.includes('identity') && (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">Modified</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Feature Identity */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Target size={16} className="text-gray-600" />
                                        Feature Identity
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Feature Name <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={feature.name}
                                                onChange={(e) => handleChange('name', e.target.value, 'identity')}
                                                maxLength={50}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">{feature.name.length}/50 characters</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                            <Select value={feature.category} onValueChange={(val) => handleChange('category', val, 'identity')}>
                                                <SelectItem value="academic">🎓 Academic Planning</SelectItem>
                                                <SelectItem value="visa">📋 Visa & Immigration</SelectItem>
                                                <SelectItem value="financial">💰 Financial Planning</SelectItem>
                                                <SelectItem value="application">📝 Application Support</SelectItem>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={feature.description}
                                            onChange={(e) => handleChange('description', e.target.value, 'identity')}
                                            maxLength={150}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{feature.description.length}/150 characters</p>
                                    </div>
                                </div>

                                {/* Visibility Controls */}
                                <div className="pt-5 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Eye size={16} className="text-gray-600" />
                                        Visibility Controls
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feature.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                                                    }`}>
                                                    {feature.status === 'active' ? (
                                                        <Unlock size={20} className="text-green-600" />
                                                    ) : (
                                                        <Lock size={20} className="text-gray-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Enable Feature</p>
                                                    <p className="text-xs text-gray-600">Make feature available to students</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleChange('status', feature.status === 'active' ? 'disabled' : 'active', 'identity')}
                                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${feature.status === 'active' ? 'bg-green-600' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${feature.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feature.show_in_dashboard ? 'bg-blue-100' : 'bg-gray-100'
                                                    }`}>
                                                    <Eye size={20} className={feature.show_in_dashboard ? 'text-blue-600' : 'text-gray-600'} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Show in Dashboard</p>
                                                    <p className="text-xs text-gray-600">Display feature card in student dashboard</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleChange('show_in_dashboard', !feature.show_in_dashboard, 'identity')}
                                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${feature.show_in_dashboard ? 'bg-[#253154]' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${feature.show_in_dashboard ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Preview Badge */}
                                    <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            {feature.status === 'active' && feature.show_in_dashboard ? (
                                                <>
                                                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                                                    <span className="text-xs font-semibold text-green-700">🟢 Visible to Students</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock size={14} className="text-gray-600" />
                                                    <span className="text-xs font-semibold text-gray-700">🔒 Hidden from Students</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========== LAYER 2: FLOW & EXECUTION MAPPING ========== */}
                        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${modifiedSections.includes('flow') ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-200'
                            }`}>
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <Zap size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-[#253154]">Flow & Execution Mapping</h2>
                                            <p className="text-xs text-gray-600">Connect feature to AI conversation flow</p>
                                        </div>
                                    </div>
                                    {modifiedSections.includes('flow') && (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">Modified</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Linked Flow <span className="text-red-600">*</span>
                                    </label>
                                    <Select value={feature.linked_flow} onValueChange={(val) => handleChange('linked_flow', val, 'flow')}>
                                        {flows.map((flow) => (
                                            <SelectItem key={flow.id} value={flow.id}>
                                                <div className="flex items-center gap-2">
                                                    <span>{flow.name}</span>
                                                    {flow.status === 'draft' && (
                                                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">DRAFT</span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                {/* Flow Status Card */}
                                {selectedFlow && (
                                    <div className={`p-4 rounded-lg border-2 ${selectedFlow.status === 'published'
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-amber-50 border-amber-300'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedFlow.status === 'published' ? 'bg-green-100' : 'bg-amber-100'
                                                    }`}>
                                                    {selectedFlow.status === 'published' ? (
                                                        <CheckCircle2 size={16} className="text-green-600" />
                                                    ) : (
                                                        <AlertTriangle size={16} className="text-amber-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{selectedFlow.name}</p>
                                                    <p className={`text-xs font-semibold ${selectedFlow.status === 'published' ? 'text-green-700' : 'text-amber-700'
                                                        }`}>
                                                        Status: {selectedFlow.status === 'published' ? 'Published' : 'Draft'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <ExternalLink size={14} className="mr-2" />
                                                View Flow
                                            </Button>
                                        </div>
                                        {selectedFlow.status === 'draft' && (
                                            <div className="mt-3 flex items-start gap-2 p-2 bg-amber-100 rounded border border-amber-200">
                                                <AlertCircle size={14} className="text-amber-700 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-amber-800">
                                                    <strong>Warning:</strong> This flow is not published. Students won&apos;t be able to use this feature until the flow is live.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ========== LAYER 3: STARTER PROMPT & TRIGGER BEHAVIOR ========== */}
                        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${modifiedSections.includes('prompt') ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-200'
                            }`}>
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                            <MessageSquare size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-[#253154]">Starter Prompt & Trigger Behavior</h2>
                                            <p className="text-xs text-gray-600">Define the first message students see when using this feature</p>
                                        </div>
                                    </div>
                                    {modifiedSections.includes('prompt') && (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">Modified</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Starter Prompt <span className="text-red-600">*</span>
                                    </label>
                                    <textarea
                                        value={feature.starter_prompt}
                                        onChange={(e) => handleChange('starter_prompt', e.target.value, 'prompt')}
                                        maxLength={250}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                                        placeholder="Enter the opening message the AI will send when students click this feature..."
                                    />
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-xs text-gray-500">{feature.starter_prompt.length}/250 characters</p>
                                        <button className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
                                            <Sparkles size={12} />
                                            AI Suggestions
                                        </button>
                                    </div>
                                </div>

                                {/* Preview Simulation Box */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <Eye size={14} />
                                        Chat Preview
                                    </label>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-5">
                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                            {/* Student clicks feature */}
                                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <User size={12} className="text-gray-600" />
                                                </div>
                                                <span className="text-xs text-gray-600 italic">Student clicks &quot;{feature.name}&quot;</span>
                                            </div>

                                            {/* AI response */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-[#253154] to-[#0e042f] rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Bot size={16} className="text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-gray-900 mb-1">AI Assistant</p>
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                        <p className="text-sm text-gray-800">{feature.starter_prompt}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========== LAYER 4: ENTRY CONDITIONS & RULES ========== */}
                        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${modifiedSections.includes('conditions') ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-200'
                            }`}>
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                                            <Settings size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-[#253154]">Entry Conditions & Rules</h2>
                                            <p className="text-xs text-gray-600">Define prerequisites for students to access this feature</p>
                                        </div>
                                    </div>
                                    {modifiedSections.includes('conditions') && (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">Modified</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-sm text-gray-600 mb-4">Only show this feature if:</p>
                                <div className="space-y-3">
                                    {[
                                        { key: 'requires_ielts', label: 'IELTS score exists in profile', icon: FileText },
                                        { key: 'requires_country', label: 'Destination country selected', icon: Globe },
                                        { key: 'requires_profile', label: 'Student profile is complete', icon: User },
                                    ].map((rule) => {
                                        const Icon = rule.icon;
                                        return (
                                            <div key={rule.key} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Icon size={16} className="text-gray-600" />
                                                    <span className="text-sm font-medium text-gray-700">{rule.label}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleChange(rule.key as keyof AiFeature, !feature[rule.key as keyof AiFeature], 'conditions')}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${feature[rule.key as keyof AiFeature] ? 'bg-[#253154]' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${feature[rule.key as keyof AiFeature] ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                                    <Info size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-blue-800">
                                        If conditions are not met, the feature will be grayed out in the student dashboard with a &quot;Complete profile&quot; message.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ========== LAYER 5: ORDERING & DISPLAY LOGIC ========== */}
                        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${modifiedSections.includes('ordering') ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-200'
                            }`}>
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                            <GripVertical size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-[#253154]">Ordering & Display Logic</h2>
                                            <p className="text-xs text-gray-600">Control feature position in student dashboard</p>
                                        </div>
                                    </div>
                                    {modifiedSections.includes('ordering') && (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">Modified</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                                        <input
                                            type="number"
                                            value={feature.order}
                                            onChange={(e) => handleChange('order', parseInt(e.target.value), 'ordering')}
                                            min="1"
                                            max="20"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                                    </div>
                                    <div className="flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-600 mb-1">Current Position</p>
                                            <p className="text-2xl font-bold text-[#253154]">#{feature.order}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========== LAYER 6: ANALYTICS & USAGE INSIGHTS ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-cyan-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                                        <BarChart3 size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-[#253154]">Analytics & Usage Insights</h2>
                                        <p className="text-xs text-gray-600">Last 30 days performance metrics (Read-only)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users size={16} className="text-blue-600" />
                                            <p className="text-xs text-gray-600">Total Uses</p>
                                        </div>
                                        <p className="text-2xl font-bold text-[#253154]">1,248</p>
                                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                            <TrendingUp size={12} />
                                            +12% vs last month
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle2 size={16} className="text-green-600" />
                                            <p className="text-xs text-gray-600">Success Rate</p>
                                        </div>
                                        <p className="text-2xl font-bold text-[#253154]">87%</p>
                                        <p className="text-xs text-gray-600 mt-1">Completed conversations</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target size={16} className="text-amber-600" />
                                            <p className="text-xs text-gray-600">Avg Confidence</p>
                                        </div>
                                        <p className="text-2xl font-bold text-[#253154]">82%</p>
                                        <p className="text-xs text-gray-600 mt-1">AI response confidence</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Sticky Preview Panel (35%) */}
                    <div className="w-[35%] space-y-6">
                        <div className="sticky top-24 space-y-6">
                            {/* Live Feature Preview */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                                <div className="px-5 py-4 bg-gradient-to-r from-[#253154] to-[#0e042f] text-white">
                                    <div className="flex items-center gap-2">
                                        <Eye size={18} />
                                        <h3 className="text-sm font-bold">Student Dashboard Preview</h3>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <p className="text-xs text-gray-600 mb-3">How students will see this feature:</p>
                                    {/* Feature Card Preview */}
                                    <div className={`border-2 rounded-xl p-4 transition-all ${feature.status === 'active' && feature.show_in_dashboard
                                        ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 cursor-pointer hover:shadow-md'
                                        : 'border-gray-200 bg-gray-50 opacity-60'
                                        }`}>
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                                <Sparkles size={24} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-[#253154] mb-1">{feature.name}</h4>
                                                <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                                                {feature.status === 'active' && feature.show_in_dashboard ? (
                                                    <button className="mt-3 px-3 py-1.5 bg-[#253154] text-white text-xs font-semibold rounded-lg hover:bg-[#1a2340] transition-colors flex items-center gap-1">
                                                        Start
                                                        <ChevronRight size={12} />
                                                    </button>
                                                ) : (
                                                    <button className="mt-3 px-3 py-1.5 bg-gray-300 text-gray-600 text-xs font-semibold rounded-lg cursor-not-allowed">
                                                        Disabled
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {feature.status !== 'active' && (
                                            <div className="mt-3 p-2 bg-gray-200 border border-gray-300 rounded text-center">
                                                <p className="text-xs text-gray-600 font-semibold">Feature Disabled</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Dashboard Position Preview */}
                                    <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                                        <p className="text-xs text-blue-900 font-semibold mb-2">Dashboard Position: #{feature.order}</p>
                                        <div className="space-y-1.5">
                                            {[1, 2, 3, 4, 5].map((pos) => (
                                                <div
                                                    key={pos}
                                                    className={`h-8 rounded flex items-center px-2 text-xs ${pos === feature.order
                                                        ? 'bg-purple-600 text-white font-bold'
                                                        : 'bg-white text-gray-500'
                                                        }`}
                                                >
                                                    {pos === feature.order ? `#${pos} - ${feature.name}` : `#${pos} - Other Feature`}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Impact Metrics */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5">
                                <h3 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
                                    <Activity size={16} />
                                    Feature Health
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-700">Flow Status</span>
                                        {selectedFlow?.status === 'published' ? (
                                            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                                <CheckCircle2 size={12} />
                                                Published
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                                <AlertTriangle size={12} />
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-700">Visibility</span>
                                        <span className={`text-xs font-bold ${feature.status === 'active' && feature.show_in_dashboard ? 'text-green-600' : 'text-gray-600'
                                            }`}>
                                            {feature.status === 'active' && feature.show_in_dashboard ? 'Live' : 'Hidden'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-700">Entry Conditions</span>
                                        <span className="text-xs font-bold text-gray-900">
                                            {[feature.requires_ielts, feature.requires_country, feature.requires_profile].filter(Boolean).length}/3 Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration Tips */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
                                <div className="flex items-start gap-3">
                                    <Info size={18} className="text-blue-600 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-bold text-blue-900 mb-1">Configuration Tip</h3>
                                        <p className="text-xs text-blue-800 leading-relaxed">
                                            Make sure your Starter Prompt clearly communicates what the student can achieve with this feature. AI suggestions can help you optimize for higher engagement.
                                        </p>
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
