'use client';

/**
 * CREATE KNOWLEDGE ARTICLE
 * 
 * High-fidelity form for entering structured knowledge.
 * 
 * Features:
 * - Content editor with structured fields
 * - AI behavior configuration
 * - Country & Topic tagging
 * - Confidence & Guardrail settings
 * - Preview & Testing simulation
 */

import React, { useState } from 'react';
import {
    ArrowLeft,
    Save,
    CheckCircle2,
    FileText,
    Globe,
    Tag,
    Sparkles,
    Target,
    Settings,
    AlertTriangle,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Info,
    Shield,
    Zap,
    Layout,
    BookOpen,
    Calendar,
    Clock,
    ExternalLink,
} from 'lucide-react';
import { DateInput } from './ui/date-input';
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { toast } from 'sonner';

interface CreateArticleProps {
    onBack: () => void;
}

export const CreateArticle: React.FC<CreateArticleProps> = ({ onBack }) => {
    const [activeStep, setActiveStep] = useState(1);
    const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'content', 'ai', 'guardrails', 'testing']);

    const [formData, setFormData] = useState({
        title: '',
        collection: '',
        description: '',
        content: '',
        countries: [] as string[],
        tags: [] as string[],
        priority: 'medium',
        useInAI: true,
        confidenceThreshold: 75,
        isAuthoritative: false,
        aiInstructions: '',
        triggerPhrases: [] as string[],
        effectiveDate: '',
        expiryDate: '',
    });

    const collections = [
        { id: 'visa', name: 'Visa Requirements', icon: FileText },
        { id: 'sop', name: 'SOP Guidelines', icon: BookOpen },
        { id: 'scholarships', name: 'Scholarships', icon: Zap },
        { id: 'ielts', name: 'IELTS Info', icon: Layout },
        { id: 'costs', name: 'Cost Estimates', icon: Shield },
    ];

    const countries = [
        { id: 'USA', name: 'USA', flag: '🇺🇸' },
        { id: 'UK', name: 'UK', flag: '🇬🇧' },
        { id: 'Canada', name: 'Canada', flag: '🇨🇦' },
        { id: 'Australia', name: 'Australia', flag: '🇦🇺' },
        { id: 'Germany', name: 'Germany', flag: '🇩🇪' },
    ];

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const toggleCountry = (countryId: string) => {
        const newCountries = formData.countries.includes(countryId)
            ? formData.countries.filter(id => id !== countryId)
            : [...formData.countries, countryId];
        handleChange('countries', newCountries);
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
        );
    };

    const handleSaveDraft = () => {
        toast.success('Draft saved successfully');
    };

    const handlePublish = () => {
        if (!formData.title || !formData.collection || !formData.content) {
            toast.error('Please fill in all required fields');
            return;
        }
        toast.success('Knowledge article published and AI index updated');
        onBack();
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Sticky Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-8 py-5">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#253154] mb-3 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Knowledge Base
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Plus size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-[22px] font-bold text-[#253154]">Create Knowledge Article</h1>
                                <p className="text-sm text-gray-500">Add dynamic, structured content for AI to learn</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-10" onClick={handleSaveDraft}>
                                <Save size={16} className="mr-2" />
                                Save Draft
                            </Button>
                            <Button
                                className="bg-[#253154] hover:bg-[#1a2340] text-white h-10 shadow-lg shadow-indigo-900/20"
                                onClick={handlePublish}
                            >
                                <CheckCircle2 size={16} className="mr-2" />
                                Publish to AI
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-8 py-8">
                <div className="flex gap-8">
                    {/* LEFT: Form Sections (70%) */}
                    <div className="flex-1 w-[70%] space-y-6">

                        {/* 1. BASIC INFORMATION */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('basic')}
                                className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                        <Info size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-[#253154]">Basic Information</h2>
                                        <p className="text-xs text-gray-500">Essential article identity and classification</p>
                                    </div>
                                </div>
                                {expandedSections.includes('basic') ? (
                                    <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('basic') && (
                                <div className="px-5 pb-6 pt-2 border-t border-gray-100 space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Article Title <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., F-1 Student Visa Interview Questions (2024)"
                                            value={formData.title}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Collection <span className="text-red-600">*</span>
                                            </label>
                                            <Select value={formData.collection} onValueChange={(val) => handleChange('collection', val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select collection" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {collections.map(c => (
                                                        <SelectItem key={c.id} value={c.id}>
                                                            <div className="flex items-center gap-2">
                                                                <c.icon size={14} />
                                                                {c.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Priority Level
                                            </label>
                                            <Select value={formData.priority} onValueChange={(val) => handleChange('priority', val)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low Priority</SelectItem>
                                                    <SelectItem value="medium">Medium Priority</SelectItem>
                                                    <SelectItem value="high">High Priority</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Target Countries</label>
                                        <div className="flex flex-wrap gap-2">
                                            {countries.map(country => (
                                                <button
                                                    key={country.id}
                                                    onClick={() => toggleCountry(country.id)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 border ${formData.countries.includes(country.id)
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                                                        }`}
                                                >
                                                    <span>{country.flag}</span>
                                                    {country.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. KNOWLEDGE CONTENT */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('content')}
                                className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-[#253154]">Knowledge Content</h2>
                                        <p className="text-xs text-gray-500">The actual data AI will use to respond</p>
                                    </div>
                                </div>
                                {expandedSections.includes('content') ? (
                                    <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('content') && (
                                <div className="px-5 pb-6 pt-2 border-t border-gray-100 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Body Content <span className="text-red-600">*</span>
                                            </label>
                                            <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                                                <Layout size={12} />
                                                Use Template
                                            </button>
                                        </div>
                                        <textarea
                                            placeholder="Enter the detailed knowledge content here. AI will process this and use it to answer student queries..."
                                            value={formData.content}
                                            onChange={(e) => handleChange('content', e.target.value)}
                                            rows={12}
                                            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none font-mono"
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-gray-500">Markdown is supported for formatting</p>
                                            <p className="text-xs text-gray-500">{formData.content.length} characters</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description / Snippet</label>
                                        <textarea
                                            placeholder="Brief summary used for quick AI retrieval..."
                                            value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. AI BEHAVIOR CONFIG */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('ai')}
                                className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-[#253154]">AI Behavior Configuration</h2>
                                        <p className="text-xs text-gray-500">Fine-tune how AI interprets this specific content</p>
                                    </div>
                                </div>
                                {expandedSections.includes('ai') ? (
                                    <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('ai') && (
                                <div className="px-5 pb-6 pt-2 border-t border-gray-100 space-y-5">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Enable in AI Index</p>
                                                    <p className="text-[11px] text-gray-500">Make searchable for chatbot</p>
                                                </div>
                                                <button
                                                    onClick={() => handleChange('useInAI', !formData.useInAI)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.useInAI ? 'bg-blue-600' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.useInAI ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Authoritative Source</p>
                                                    <p className="text-[11px] text-gray-500">Prefer over other similar content</p>
                                                </div>
                                                <button
                                                    onClick={() => handleChange('isAuthoritative', !formData.isAuthoritative)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isAuthoritative ? 'bg-blue-600' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isAuthoritative ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                            <label className="block text-sm font-bold text-indigo-900 mb-2">Confidence Threshold</label>
                                            <input
                                                type="range"
                                                min="50"
                                                max="100"
                                                value={formData.confidenceThreshold}
                                                onChange={(e) => handleChange('confidenceThreshold', parseInt(e.target.value))}
                                                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                            <div className="flex justify-between mt-2">
                                                <span className="text-[11px] font-semibold text-indigo-700">Strict (Low recall)</span>
                                                <span className="text-[11px] font-bold text-indigo-900">{formData.confidenceThreshold}%</span>
                                                <span className="text-[11px] font-semibold text-indigo-700">Lenient (High recall)</span>
                                            </div>
                                            <p className="text-[11px] text-indigo-600 mt-3 leading-relaxed">
                                                AI will only use this content if its internal match confidence is above {formData.confidenceThreshold}%.
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Retrieval Instructions</label>
                                        <textarea
                                            placeholder="Example: Only use this article when students specifically ask about interview questions, not general visa info..."
                                            value={formData.aiInstructions}
                                            onChange={(e) => handleChange('aiInstructions', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. CONTENT GUARDRAILS */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('guardrails')}
                                className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-[#253154]">Content Guardrails</h2>
                                        <p className="text-xs text-gray-500">Lifecycle and validity constraints</p>
                                    </div>
                                </div>
                                {expandedSections.includes('guardrails') ? (
                                    <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('guardrails') && (
                                <div className="px-5 pb-6 pt-2 border-t border-gray-100 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <DateInput
                                            label="Effective Date"
                                            value={formData.effectiveDate}
                                            onChange={(e) => handleChange('effectiveDate', e.target.value)}
                                        />
                                        <DateInput
                                            label="Expiry Date (Optional)"
                                            value={formData.expiryDate}
                                            onChange={(e) => handleChange('expiryDate', e.target.value)}
                                        />
                                    </div>

                                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                                        <AlertTriangle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-orange-900">Visibility Constraint</p>
                                            <p className="text-[11px] text-orange-850 mt-0.5 leading-relaxed">
                                                Setting an expiry date will automatically de-index this knowledge from the AI chatbot on the specified date. Use this for time-sensitive intake information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 5. PREVIEW & TESTING */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('testing')}
                                className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center">
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-[#253154]">Preview & Testing</h2>
                                        <p className="text-xs text-gray-500">Test AI response with this content</p>
                                    </div>
                                </div>
                                {expandedSections.includes('testing') ? (
                                    <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('testing') && (
                                <div className="px-5 pb-6 pt-2 border-t border-gray-100 bg-gray-50/30 space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Test Prompt</label>
                                        <textarea
                                            placeholder="Enter a test question to see how AI uses this content..."
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm resize-none"
                                        />
                                    </div>

                                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-11">
                                        <Sparkles size={16} className="mr-2" />
                                        Test AI Response
                                    </Button>

                                    <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
                                        <p className="text-xs font-semibold text-cyan-900 mb-2 uppercase tracking-wider">Matching Confidence Simulation</p>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs text-cyan-800">Content Relevance</span>
                                                    <span className="text-xs font-bold text-cyan-900">85%</span>
                                                </div>
                                                <div className="w-full bg-cyan-200 rounded-full h-2">
                                                    <div className="bg-cyan-600 h-2 rounded-full transition-all" style={{ width: '85%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Sidebar (30%) */}
                    <div className="w-[30%] space-y-6">
                        <div className="sticky top-24 space-y-6">

                            {/* STATUS CARD */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h3 className="text-sm font-bold text-[#253154] mb-4 flex items-center gap-2">
                                    <Layout size={16} />
                                    Article Summary
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-xs font-medium text-gray-500">Status</span>
                                        <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase">Draft</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-xs font-medium text-gray-500">Completeness</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-100 rounded-full h-1.5">
                                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-900">35%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-xs font-medium text-gray-500">AI Enabled</span>
                                        <span className="text-xs font-bold text-blue-600">{formData.useInAI ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-xs font-medium text-gray-500">Word Count</span>
                                        <span className="text-xs font-bold text-gray-900">
                                            {formData.content.split(/\s+/).filter(Boolean).length} words
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* CHECKLIST CARD */}
                            <div className="bg-gradient-to-br from-[#253154] to-[#1a2340] rounded-xl shadow-lg p-6 text-white">
                                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    Publishing Checklist
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${formData.title ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                                            {formData.title && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-xs ${formData.title ? 'text-white' : 'text-white/50'}`}>Title added</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${formData.collection ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                                            {formData.collection && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-xs ${formData.collection ? 'text-white' : 'text-white/50'}`}>Collection selected</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${formData.content.length > 50 ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                                            {formData.content.length > 50 && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-xs ${formData.content.length > 50 ? 'text-white' : 'text-white/50'}`}>Content depth analysis</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${formData.countries.length > 0 ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                                            {formData.countries.length > 0 && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-xs ${formData.countries.length > 0 ? 'text-white' : 'text-white/50'}`}>Country assignment</span>
                                    </div>
                                </div>

                                <div className="mt-5 pt-5 border-t border-white/10 uppercase tracking-tighter">
                                    <p className="text-[10px] text-white/50">Article Score</p>
                                    <p className="text-2xl font-black">74/100</p>
                                </div>
                            </div>

                            {/* HELP CARD */}
                            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
                                <div className="flex items-start gap-4 text-blue-900">
                                    <BookOpen size={20} className="flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-bold">Need Help?</h4>
                                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                            Make sure your content is broken down into clear headings. AI performs better with structured data rather than long walls of text.
                                        </p>
                                        <button className="text-xs font-bold mt-2 flex items-center gap-1 hover:underline">
                                            View Documentation
                                            <ExternalLink size={12} />
                                        </button>
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
