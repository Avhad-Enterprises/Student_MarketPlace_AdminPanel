'use client';
import { DateInput } from './ui/date-input';

/**
 * ARTICLE DETAILS PAGE
 * 
 * Structured Knowledge Editor (NOT a simple blog editor)
 * 
 * Features:
 * - Structured content blocks (modular sections)
 * - AI metadata controls
 * - Version control
 * - Publishing workflow
 * - AI usage impact tracking
 */

import React, { useState } from 'react';
import {
    ArrowLeft,
    Save,
    CheckCircle2,
    FileText,
    Globe,
    Tag,
    Clock,
    User,
    GitBranch,
    AlertTriangle,
    Sparkles,
    Target,
    Settings,
    Eye,
    ChevronDown,
    ChevronUp,
    Plus,
    Trash2,
    BarChart3,
    TrendingUp,
    Users,
    MessageSquare,
    Calendar,
    RotateCcw,
    ExternalLink,
    Info,
} from 'lucide-react';
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { toast } from 'sonner';

interface ArticleDetailProps {
    articleId: string;
    onBack: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleId, onBack }) => {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

    const [formData, setFormData] = useState({
        title: 'F-1 Student Visa Requirements for USA',
        collection: 'visa',
        country: 'USA',
        tags: ['F-1', 'Student Visa', 'Requirements'],
        contentType: 'visa',
        status: 'published',
        version: 'v2.4',
        priorityWeight: 'high',
        isPrimarySource: true,
        overrideDefault: false,
        confidenceBoost: 10,
        lastEditedBy: 'Admin User',
        lastReviewedBy: 'Content Manager',
        nextReviewDate: '2024-05-15',
    });

    const [sections, setSections] = useState([
        { id: 'overview', title: 'Overview', content: 'The F-1 visa is a non-immigrant student visa that allows international students to pursue academic studies in the United States.' },
        { id: 'eligibility', title: 'Eligibility Criteria', content: 'Must be enrolled in an academic program, language training program, or vocational program.' },
        { id: 'documents', title: 'Required Documents', content: 'Valid passport, DS-160 form, SEVIS fee receipt, I-20 form, financial documents.' },
        { id: 'steps', title: 'Application Steps', content: '1. Receive I-20 from school\n2. Pay SEVIS fee\n3. Complete DS-160\n4. Schedule visa interview' },
        { id: 'fees', title: 'Fees', content: 'SEVIS Fee: $350\nVisa Application Fee: $160\nTotal: $510' },
        { id: 'processing', title: 'Processing Time', content: 'Average processing time: 3-5 weeks after interview' },
        { id: 'notes', title: 'Important Notes', content: 'Apply early, prepare for interview questions, bring all documents to interview.' },
    ]);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
        setHasUnsavedChanges(true);
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
        );
    };

    const handleSave = () => {
        toast.success('Draft saved successfully');
        setHasUnsavedChanges(false);
    };

    const handlePublish = () => {
        toast.success('Article published successfully');
        setHasUnsavedChanges(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-[1800px] mx-auto px-8 py-5">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#253154] mb-3 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Knowledge Base
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                <FileText size={28} className="text-white" />
                            </div>

                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-[22px] font-bold text-[#253154]">{formData.title}</h1>
                                    {formData.status === 'published' ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg border border-green-300 flex items-center gap-1.5">
                                            <CheckCircle2 size={12} />
                                            Published
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg border border-amber-300 flex items-center gap-1.5">
                                            <Clock size={12} />
                                            Draft
                                        </span>
                                    )}
                                    {hasUnsavedChanges && (
                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-lg border border-orange-300">
                                            Unsaved Changes
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <GitBranch size={12} />
                                        <span>{formData.version}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User size={12} />
                                        <span>Last edited by: {formData.lastEditedBy}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-10" onClick={handleSave} disabled={!hasUnsavedChanges}>
                                <Save size={16} className="mr-2" />
                                Save Draft
                            </Button>
                            <Button className="bg-[#253154] hover:bg-[#1a2340] text-white h-10 shadow-lg shadow-purple-900/20" onClick={handlePublish}>
                                <CheckCircle2 size={16} className="mr-2" />
                                Publish
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="max-w-[1800px] mx-auto px-8 py-8">
                <div className="flex gap-8">
                    {/* LEFT: Article Editor (65%) */}
                    <div className="flex-1 w-[65%] space-y-6">
                        {/* ========== ARTICLE IDENTITY ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                                <h2 className="text-base font-bold text-[#253154] flex items-center gap-2">
                                    <Target size={18} />
                                    Article Identity
                                </h2>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Title <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        maxLength={150}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.title.length}/150 characters</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Collection</label>
                                        <Select value={formData.collection} onValueChange={(val) => handleChange('collection', val)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="visa">Visa Requirements</SelectItem>
                                                <SelectItem value="sop">SOP Guidelines</SelectItem>
                                                <SelectItem value="scholarships">Scholarships</SelectItem>
                                                <SelectItem value="ielts">IELTS Info</SelectItem>
                                                <SelectItem value="costs">Cost Estimates</SelectItem>
                                                <SelectItem value="faqs">FAQs</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                                        <Select value={formData.country} onValueChange={(val) => handleChange('country', val)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USA">🇺🇸 USA</SelectItem>
                                                <SelectItem value="UK">🇬🇧 UK</SelectItem>
                                                <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                                                <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                                                <SelectItem value="Global">🌍 Global</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Content Type</label>
                                        <Select value={formData.contentType} onValueChange={(val) => handleChange('contentType', val)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="visa">Visa</SelectItem>
                                                <SelectItem value="sop">SOP</SelectItem>
                                                <SelectItem value="scholarship">Scholarship</SelectItem>
                                                <SelectItem value="general">General</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg border border-purple-200 flex items-center gap-1.5">
                                                {tag}
                                                <button onClick={() => handleChange('tags', formData.tags.filter((_, i) => i !== idx))}>
                                                    <Trash2 size={12} />
                                                </button>
                                            </span>
                                        ))}
                                        <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-200 flex items-center gap-1.5">
                                            <Plus size={12} />
                                            Add Tag
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========== STRUCTURED CONTENT EDITOR ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                                <h2 className="text-base font-bold text-[#253154] flex items-center gap-2">
                                    <FileText size={18} />
                                    Structured Content Blocks
                                </h2>
                                <p className="text-xs text-gray-600 mt-1">Modular sections for organized knowledge</p>
                            </div>

                            <div className="p-6 space-y-3">
                                {sections.map((section) => (
                                    <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleSection(section.id)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="text-sm font-bold text-gray-900">{section.title}</span>
                                            {expandedSections.includes(section.id) ? (
                                                <ChevronUp size={18} className="text-gray-600" />
                                            ) : (
                                                <ChevronDown size={18} className="text-gray-600" />
                                            )}
                                        </button>
                                        {expandedSections.includes(section.id) && (
                                            <div className="p-4 bg-white">
                                                <textarea
                                                    value={section.content}
                                                    onChange={(e) => {
                                                        const newSections = sections.map((s) =>
                                                            s.id === section.id ? { ...s, content: e.target.value } : s
                                                        );
                                                        setSections(newSections);
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    rows={6}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                                    <Plus size={18} />
                                    <span className="text-sm font-semibold">Add New Section</span>
                                </button>
                            </div>
                        </div>

                        {/* ========== AI METADATA CONTROLS ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                                <h2 className="text-base font-bold text-[#253154] flex items-center gap-2">
                                    <Sparkles size={18} />
                                    AI Metadata Controls
                                </h2>
                                <p className="text-xs text-gray-600 mt-1">Control how AI uses this content</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Weight</label>
                                        <Select value={formData.priorityWeight} onValueChange={(val) => handleChange('priorityWeight', val)}>
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

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confidence Boost Level</label>
                                        <input
                                            type="number"
                                            value={formData.confidenceBoost}
                                            onChange={(e) => handleChange('confidenceBoost', parseInt(e.target.value))}
                                            min="0"
                                            max="20"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Primary Source</p>
                                            <p className="text-xs text-gray-600">Mark as authoritative reference</p>
                                        </div>
                                        <button
                                            onClick={() => handleChange('isPrimarySource', !formData.isPrimarySource)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isPrimarySource ? 'bg-amber-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isPrimarySource ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Override Default Answer</p>
                                            <p className="text-xs text-gray-600">Force AI to use this content</p>
                                        </div>
                                        <button
                                            onClick={() => handleChange('overrideDefault', !formData.overrideDefault)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.overrideDefault ? 'bg-amber-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.overrideDefault ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========== PUBLISHING WORKFLOW ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                                <h2 className="text-base font-bold text-[#253154] flex items-center gap-2">
                                    <Settings size={18} />
                                    Publishing Workflow
                                </h2>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Edited By</label>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <User size={16} className="text-gray-600" />
                                            <span className="text-sm text-gray-700">{formData.lastEditedBy}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Reviewed By</label>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <User size={16} className="text-gray-600" />
                                            <span className="text-sm text-gray-700">{formData.lastReviewedBy}</span>
                                        </div>
                                    </div>
                                </div>

                                <DateInput
                                    label="Next Review Date"
                                    value={formData.nextReviewDate}
                                    onChange={(e) => handleChange('nextReviewDate', e.target.value)}
                                    helperText={`This article will be flagged for review on ${formData.nextReviewDate}. Ensure all information is current and accurate.`}
                                />

                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                                    <Calendar size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-blue-800">
                                        This article will be flagged for review on <strong>{formData.nextReviewDate}</strong>. Ensure all information is current and accurate.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Sticky Sidebar (35%) */}
                    <div className="w-[35%] space-y-6">
                        <div className="sticky top-24 space-y-6">
                            {/* Version Control */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                                <div className="px-5 py-4 bg-gradient-to-r from-[#253154] to-[#0e042f] text-white">
                                    <h3 className="text-sm font-bold flex items-center gap-2">
                                        <GitBranch size={16} />
                                        Version Control
                                    </h3>
                                </div>
                                <div className="p-5 space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div>
                                            <p className="text-sm font-bold text-green-900">Current Version</p>
                                            <p className="text-xs text-green-700">{formData.version}</p>
                                        </div>
                                        <CheckCircle2 size={18} className="text-green-600" />
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Previous Versions</p>
                                        {['v2.3', 'v2.2', 'v2.1'].map((version) => (
                                            <div key={version} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-sm text-gray-700">{version}</span>
                                                <button className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
                                                    <RotateCcw size={12} />
                                                    Rollback
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <Button variant="outline" size="sm" className="w-full">
                                        <Eye size={14} className="mr-2" />
                                        View Changes
                                    </Button>
                                </div>
                            </div>

                            {/* AI Usage Impact */}
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-5">
                                <h3 className="text-sm font-bold text-purple-900 mb-4 flex items-center gap-2">
                                    <BarChart3 size={16} />
                                    AI Usage Impact (30d)
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-purple-800">Used in conversations</span>
                                            <span className="text-sm font-bold text-purple-900">342</span>
                                        </div>
                                        <div className="w-full bg-purple-200 rounded-full h-2">
                                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-purple-800">Triggered in Visa queries</span>
                                            <span className="text-sm font-bold text-purple-900">67</span>
                                        </div>
                                        <div className="w-full bg-purple-200 rounded-full h-2">
                                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-purple-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-purple-800">Avg confidence</span>
                                            <span className="text-lg font-bold text-purple-900">82%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Health */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5">
                                <h3 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    Content Health
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-green-800">Status</span>
                                        <span className="text-xs font-bold text-green-700">Up to date</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-green-800">Last review</span>
                                        <span className="text-xs font-bold text-green-700">12 days ago</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-green-800">Completeness</span>
                                        <span className="text-xs font-bold text-green-700">100%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Best Practices */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
                                <div className="flex items-start gap-3">
                                    <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-bold text-blue-900 mb-2">Best Practices</h3>
                                        <ul className="text-xs text-blue-800 space-y-1.5">
                                            <li>• Keep content current and accurate</li>
                                            <li>• Use structured sections for clarity</li>
                                            <li>• Set appropriate priority weights</li>
                                            <li>• Review content every 90 days</li>
                                        </ul>
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
