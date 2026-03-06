'use client';

/**
 * FLOW DETAIL PAGE - STRUCTURED STEP BUILDER
 * 
 * AI Visa Assistant → Flows & Forms → Flow Detail
 * 
 * Enterprise layered architecture matching:
 * - Assistant Setup
 * - Features Manager Detail
 * - Students Detail
 * 
 * Features:
 * - 6 collapsible layered sections
 * - Structured step builder (not visual flow chart)
 * - Professional SaaS UX
 * - Right-side preview panel
 * - Testing & simulation
 */

import React, { useState } from 'react';
import {
    ArrowLeft,
    Save,
    CheckCircle2,
    FileText,
    MessageSquare,
    GitBranch,
    Settings,
    Shield,
    TestTube,
    ChevronDown,
    ChevronUp,
    Plus,
    Trash2,
    Copy,
    GripVertical,
    Edit,
    AlertCircle,
    Info,
    Sparkles,
    Sliders,
    Target,
    Play,
    RotateCcw,
    Zap,
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

interface FlowDetailProps {
    flowId: string;
    onBack: () => void;
}

interface StepCondition {
    id: string;
    field: string;
    operator: string;
    value: string;
    action: string;
    actionValue: string;
}

interface Step {
    id: string;
    order: number;
    name: string;
    type: 'input' | 'multiselect' | 'singleselect' | 'file' | 'numeric' | 'info' | 'branch';
    questionText: string;
    placeholder: string;
    required: boolean;
    expanded: boolean;
    conditions: StepCondition[];
}

interface BranchCondition {
    id: string;
    field: string;
    operator: string;
    value: string;
    logic: 'AND' | 'OR';
}

interface BranchRule {
    id: string;
    name: string;
    enabled: boolean;
    priority: number;
    conditions: BranchCondition[];
    outcome: {
        type: 'jump' | 'risk' | 'escalate' | 'template';
        value: string;
    };
}

export const FlowDetail: React.FC<FlowDetailProps> = ({ flowId, onBack }) => {
    const [expandedSections, setExpandedSections] = useState<string[]>([
        'identity',
        'steps',
    ]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [formData, setFormData] = useState({
        name: 'Visa Eligibility Check – Canada SDS',
        slug: 'visa-eligibility-canada-sds',
        type: 'assessment',
        linkedFeature: 'eligibility-check',
        description: 'Collect student inputs and generate a risk assessment + next steps for Canada SDS visa pathway.',
        status: 'draft',
        version: 'v1.0',
    });

    const [steps, setSteps] = useState<Step[]>([
        {
            id: 'step-1',
            order: 1,
            name: 'Target Country',
            type: 'singleselect',
            questionText: 'Which country are you applying for?',
            placeholder: 'Select country (Options: Canada, UK, USA, Australia)',
            required: true,
            expanded: false,
            conditions: [],
        },
        {
            id: 'step-2',
            order: 2,
            name: 'Study Level',
            type: 'singleselect',
            questionText: 'Which level are you applying for?',
            placeholder: 'Select level (Options: Bachelors, Masters, Diploma)',
            required: true,
            expanded: false,
            conditions: [],
        },
        {
            id: 'step-3',
            order: 3,
            name: 'IELTS Score',
            type: 'numeric',
            questionText: 'Enter your IELTS overall band score',
            placeholder: 'Enter score (0-9)',
            required: true,
            expanded: true,
            conditions: [
                {
                    id: 'cond-3a',
                    field: 'step-3',
                    operator: '<',
                    value: '6.0',
                    action: 'jump',
                    actionValue: 'step-7',
                },
                {
                    id: 'cond-3b',
                    field: 'step-3',
                    operator: '>=',
                    value: '6.0',
                    action: 'variable',
                    actionValue: 'continue',
                },
            ],
        },
        {
            id: 'step-4',
            order: 4,
            name: 'Education Gap',
            type: 'numeric',
            questionText: 'How many years gap after your last education?',
            placeholder: 'Enter years (0-15)',
            required: true,
            expanded: false,
            conditions: [],
        },
        {
            id: 'step-5',
            order: 5,
            name: 'Financial Proof',
            type: 'singleselect',
            questionText: 'Do you have required financial proof (GIC + tuition proof)?',
            placeholder: 'Select (Options: Yes, No)',
            required: true,
            expanded: false,
            conditions: [],
        },
        {
            id: 'step-6',
            order: 6,
            name: 'Visa Rejection History',
            type: 'singleselect',
            questionText: 'Have you ever had a visa rejection before?',
            placeholder: 'Select (Options: Yes, No)',
            required: true,
            expanded: false,
            conditions: [],
        },
        {
            id: 'step-7',
            order: 7,
            name: 'English Improvement Advice',
            type: 'info',
            questionText: 'Your IELTS score is below SDS recommended level. Improve score to 6.0+ (or meet country requirements) before applying. I can suggest a plan.',
            placeholder: '',
            required: false,
            expanded: false,
            conditions: [],
        },
        {
            id: 'step-8',
            order: 8,
            name: 'Generate Eligibility Result',
            type: 'branch',
            questionText: 'Generate risk assessment and next steps based on collected information',
            placeholder: '',
            required: false,
            expanded: false,
            conditions: [],
        },
    ]);

    const [branchRules, setBranchRules] = useState<BranchRule[]>([
        {
            id: 'rule-1',
            name: 'High Risk – Visa Rejection',
            enabled: true,
            priority: 1,
            conditions: [
                {
                    id: 'condition-1a',
                    field: 'step-6',
                    operator: '=',
                    value: 'Yes',
                    logic: 'AND',
                },
            ],
            outcome: {
                type: 'risk',
                value: 'high',
            },
        },
        {
            id: 'rule-2',
            name: 'Medium Risk – No Financial Proof',
            enabled: true,
            priority: 2,
            conditions: [
                {
                    id: 'condition-2a',
                    field: 'step-5',
                    operator: '=',
                    value: 'No',
                    logic: 'AND',
                },
            ],
            outcome: {
                type: 'risk',
                value: 'medium',
            },
        },
        {
            id: 'rule-3',
            name: 'Low Risk – Meets SDS Baseline',
            enabled: true,
            priority: 3,
            conditions: [
                {
                    id: 'condition-3a',
                    field: 'step-1',
                    operator: '=',
                    value: 'Canada',
                    logic: 'AND',
                },
                {
                    id: 'condition-3b',
                    field: 'step-3',
                    operator: '>=',
                    value: '6.0',
                    logic: 'AND',
                },
                {
                    id: 'condition-3c',
                    field: 'step-5',
                    operator: '=',
                    value: 'Yes',
                    logic: 'AND',
                },
                {
                    id: 'condition-3d',
                    field: 'step-6',
                    operator: '=',
                    value: 'No',
                    logic: 'AND',
                },
            ],
            outcome: {
                type: 'jump',
                value: 'step-8',
            },
        },
    ]);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
        setHasUnsavedChanges(true);
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const toggleStepExpanded = (stepId: string) => {
        setSteps(prev =>
            prev.map(step =>
                step.id === stepId ? { ...step, expanded: !step.expanded } : step
            )
        );
    };

    const handleSaveDraft = () => {
        toast.success('Flow saved as draft');
        setHasUnsavedChanges(false);
    };

    const handlePublish = () => {
        toast.success('Flow published successfully');
        setHasUnsavedChanges(false);
    };

    const addNewStep = () => {
        const newStep: Step = {
            id: `step-${steps.length + 1}`,
            order: steps.length + 1,
            name: `New Step ${steps.length + 1}`,
            type: 'input',
            questionText: '',
            placeholder: '',
            required: false,
            expanded: true,
            conditions: [],
        };
        setSteps([...steps, newStep]);
        setHasUnsavedChanges(true);
    };

    const deleteStep = (stepId: string) => {
        setSteps(prev => prev.filter(step => step.id !== stepId));
        setHasUnsavedChanges(true);
        toast.success('Step deleted');
    };

    const duplicateStep = (stepId: string) => {
        const stepToDuplicate = steps.find(s => s.id === stepId);
        if (stepToDuplicate) {
            const newStep = {
                ...stepToDuplicate,
                id: `step-${Date.now()}`,
                order: steps.length + 1,
                name: `${stepToDuplicate.name} (Copy)`,
            };
            setSteps([...steps, newStep]);
            setHasUnsavedChanges(true);
            toast.success('Step duplicated');
        }
    };

    const getStepTypeLabel = (type: string) => {
        const labels = {
            input: 'Input Question',
            multiselect: 'Multi Select',
            singleselect: 'Single Select',
            file: 'File Upload',
            numeric: 'Numeric Input',
            info: 'Informational Block',
            branch: 'Conditional Branch',
        };
        return labels[type as keyof typeof labels] || type;
    };

    // ========== STEP CONDITION HANDLERS ==========
    const addStepCondition = (stepId: string) => {
        const newCondition: StepCondition = {
            id: `cond-${Date.now()}`,
            field: '',
            operator: '=',
            value: '',
            action: 'jump',
            actionValue: '',
        };
        setSteps(prev => prev.map(step => {
            if (step.id === stepId) {
                return { ...step, conditions: [...step.conditions, newCondition] };
            }
            return step;
        }));
        setHasUnsavedChanges(true);
        toast.success('Condition added');
    };

    const updateStepCondition = (stepId: string, conditionId: string, field: keyof StepCondition, value: string) => {
        setSteps(prev => prev.map(step => {
            if (step.id === stepId) {
                return {
                    ...step,
                    conditions: step.conditions.map(cond =>
                        cond.id === conditionId ? { ...cond, [field]: value } : cond
                    ),
                };
            }
            return step;
        }));
        setHasUnsavedChanges(true);
    };

    const deleteStepCondition = (stepId: string, conditionId: string) => {
        setSteps(prev => prev.map(step => {
            if (step.id === stepId) {
                return {
                    ...step,
                    conditions: step.conditions.filter(cond => cond.id !== conditionId),
                };
            }
            return step;
        }));
        setHasUnsavedChanges(true);
        toast.success('Condition deleted');
    };

    // ========== BRANCH RULE HANDLERS ==========
    const addBranchRule = () => {
        const newRule: BranchRule = {
            id: `rule-${Date.now()}`,
            name: `Rule ${branchRules.length + 1}`,
            enabled: true,
            priority: branchRules.length + 1,
            conditions: [],
            outcome: {
                type: 'jump',
                value: '',
            },
        };
        setBranchRules([...branchRules, newRule]);
        setHasUnsavedChanges(true);
        toast.success('Branch rule added');
    };

    const updateBranchRule = (ruleId: string, field: string, value: any) => {
        setBranchRules(prev => prev.map(rule =>
            rule.id === ruleId ? { ...rule, [field]: value } : rule
        ));
        setHasUnsavedChanges(true);
    };

    const deleteBranchRule = (ruleId: string) => {
        setBranchRules(prev => prev.filter(rule => rule.id !== ruleId));
        setHasUnsavedChanges(true);
        toast.success('Branch rule deleted');
    };

    const addBranchCondition = (ruleId: string) => {
        const newCondition: BranchCondition = {
            id: `cond-${Date.now()}`,
            field: '',
            operator: '=',
            value: '',
            logic: 'AND',
        };
        setBranchRules(prev => prev.map(rule => {
            if (rule.id === ruleId) {
                return { ...rule, conditions: [...rule.conditions, newCondition] };
            }
            return rule;
        }));
        setHasUnsavedChanges(true);
    };

    const updateBranchCondition = (ruleId: string, conditionId: string, field: string, value: any) => {
        setBranchRules(prev => prev.map(rule => {
            if (rule.id === ruleId) {
                return {
                    ...rule,
                    conditions: rule.conditions.map(cond =>
                        cond.id === conditionId ? { ...cond, [field]: value } : cond
                    ),
                };
            }
            return rule;
        }));
        setHasUnsavedChanges(true);
    };

    const deleteBranchCondition = (ruleId: string, conditionId: string) => {
        setBranchRules(prev => prev.map(rule => {
            if (rule.id === ruleId) {
                return {
                    ...rule,
                    conditions: rule.conditions.filter(cond => cond.id !== conditionId),
                };
            }
            return rule;
        }));
        setHasUnsavedChanges(true);
    };

    const moveBranchRuleUp = (ruleId: string) => {
        const index = branchRules.findIndex(r => r.id === ruleId);
        if (index > 0) {
            const newRules = [...branchRules];
            [newRules[index], newRules[index - 1]] = [newRules[index - 1], newRules[index]];
            newRules.forEach((rule, idx) => {
                rule.priority = idx + 1;
            });
            setBranchRules(newRules);
            setHasUnsavedChanges(true);
        }
    };

    const moveBranchRuleDown = (ruleId: string) => {
        const index = branchRules.findIndex(r => r.id === ruleId);
        if (index < branchRules.length - 1) {
            const newRules = [...branchRules];
            [newRules[index], newRules[index + 1]] = [newRules[index + 1], newRules[index]];
            newRules.forEach((rule, idx) => {
                rule.priority = idx + 1;
            });
            setBranchRules(newRules);
            setHasUnsavedChanges(true);
        }
    };

    // Get available fields for conditions
    const getAvailableFields = (currentStepOrder: number) => {
        const fields = steps
            .filter(s => s.order < currentStepOrder)
            .map(s => ({
                value: s.id,
                label: s.name,
            }));

        return [
            { value: 'system.confidence', label: 'System: Confidence Score' },
            { value: 'system.risk_score', label: 'System: Risk Score' },
            { value: 'system.country', label: 'System: Country' },
            ...fields,
        ];
    };

    const operators = [
        { value: '=', label: 'Equals' },
        { value: '!=', label: 'Not Equals' },
        { value: '>', label: 'Greater Than' },
        { value: '>=', label: 'Greater or Equal' },
        { value: '<', label: 'Less Than' },
        { value: '<=', label: 'Less or Equal' },
        { value: 'contains', label: 'Contains' },
        { value: 'in', label: 'In List' },
    ];

    // Validate conditions for circular references
    const detectCircularJump = (fromStepId: string, toStepId: string): boolean => {
        const visited = new Set<string>();
        const queue = [toStepId];

        while (queue.length > 0) {
            const current = queue.shift()!;

            if (current === fromStepId) return true;
            if (visited.has(current)) continue;

            visited.add(current);

            const step = steps.find(s => s.id === current);
            if (step) {
                step.conditions.forEach(cond => {
                    if (cond.action === 'jump' && cond.actionValue) {
                        queue.push(cond.actionValue);
                    }
                });
            }
        }

        return false;
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
                        Back to Flows & Forms
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <MessageSquare size={28} className="text-white" />
                            </div>

                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-[22px] font-bold text-[#253154]">
                                        {formData.name}
                                    </h1>
                                    {formData.status === 'active' && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg border border-green-300 flex items-center gap-1.5">
                                            <CheckCircle2 size={12} />
                                            Active
                                        </span>
                                    )}
                                    {formData.status === 'draft' && (
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg border border-amber-300 flex items-center gap-1.5">
                                            <Edit size={12} />
                                            Draft
                                        </span>
                                    )}
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-300">
                                        {formData.version}
                                    </span>
                                    {hasUnsavedChanges && (
                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-lg border border-orange-300">
                                            Unsaved Changes
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {steps.length} steps • {branchRules.length} branch rules • {steps.reduce((sum, s) => sum + s.conditions.length, 0)} step conditions
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="h-10"
                                onClick={handleSaveDraft}
                                disabled={!hasUnsavedChanges}
                            >
                                <Save size={16} className="mr-2" />
                                Save Draft
                            </Button>
                            <Button
                                className="bg-[#253154] hover:bg-[#1a2340] text-white h-10 shadow-lg shadow-purple-900/20"
                                onClick={handlePublish}
                            >
                                <CheckCircle2 size={16} className="mr-2" />
                                Publish Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="max-w-[1800px] mx-auto px-8 py-8">
                <div className="flex gap-8">
                    {/* LEFT: Flow Configuration (70%) */}
                    <div className="flex-1 w-[70%] space-y-5">
                        {/* ========== LAYER 1: FLOW IDENTITY ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('identity')}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText size={20} className="text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-base font-bold text-[#253154]">
                                            Flow Identity
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Basic flow information and configuration
                                        </p>
                                    </div>
                                </div>
                                {expandedSections.includes('identity') ? (
                                    <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('identity') && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/30">
                                    <div className="flex gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Flow Name <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => handleChange('name', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Flow Slug
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.slug}
                                                    onChange={(e) => handleChange('slug', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Flow Type
                                                    </label>
                                                    <Select
                                                        value={formData.type}
                                                        onValueChange={(val) => handleChange('type', val)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="information">Information</SelectItem>
                                                            <SelectItem value="assessment">Assessment</SelectItem>
                                                            <SelectItem value="generator">Generator</SelectItem>
                                                            <SelectItem value="hybrid">Hybrid</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Linked Feature
                                                    </label>
                                                    <Select
                                                        value={formData.linkedFeature}
                                                        onValueChange={(val) => handleChange('linkedFeature', val)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="eligibility-check">Eligibility Check</SelectItem>
                                                            <SelectItem value="document-guide">Document Guide</SelectItem>
                                                            <SelectItem value="sop-assistant">SOP Assistant</SelectItem>
                                                            <SelectItem value="financial-planning">Financial Planning</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => handleChange('description', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Status
                                                </label>
                                                <Select
                                                    value={formData.status}
                                                    onValueChange={(val) => handleChange('status', val)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="disabled">Disabled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="w-[280px]">
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                                                <h3 className="text-xs font-bold text-blue-900 mb-3 uppercase tracking-wide">
                                                    Flow Metadata
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs text-blue-700 mb-1">Created by</p>
                                                        <p className="text-sm font-semibold text-blue-900">Admin User</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-blue-700 mb-1">Last updated</p>
                                                        <p className="text-sm font-semibold text-blue-900">Feb 15, 2026</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-blue-700 mb-1">Version</p>
                                                        <p className="text-sm font-semibold text-blue-900">{formData.version}</p>
                                                    </div>
                                                    <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                                        View Version History
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ========== LAYER 2: STEPS BUILDER ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('steps')}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <GripVertical size={20} className="text-purple-600" />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-base font-bold text-[#253154]">
                                            Steps Builder
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Define questions, inputs, and step-level logic
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wider border border-purple-100">
                                        {steps.length} Steps
                                    </span>
                                    {expandedSections.includes('steps') ? (
                                        <ChevronUp size={20} className="text-gray-400" />
                                    ) : (
                                        <ChevronDown size={20} className="text-gray-400" />
                                    )}
                                </div>
                            </button>

                            {expandedSections.includes('steps') && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/30">
                                    <div className="space-y-4 pt-2">
                                        {steps.map((step, index) => (
                                            <div
                                                key={step.id}
                                                className={`bg-white rounded-xl border ${step.expanded ? 'border-purple-200 shadow-md ring-1 ring-purple-100' : 'border-gray-200 hover:border-purple-200 shadow-sm'} overflow-hidden transition-all`}
                                            >
                                                {/* Step Header */}
                                                <div className={`p-4 flex items-center justify-between ${step.expanded ? 'bg-purple-50/50' : 'hover:bg-gray-50'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
                                                            {index + 1}
                                                        </div>
                                                        <button
                                                            onClick={() => toggleStepExpanded(step.id)}
                                                            className="text-left"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-sm font-bold text-[#253154]">
                                                                    {step.name}
                                                                </h3>
                                                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium border border-gray-200">
                                                                    {getStepTypeLabel(step.type)}
                                                                </span>
                                                                {step.required && (
                                                                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">* Required</span>
                                                                )}
                                                            </div>
                                                            <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                                                {step.questionText || 'No question text defined'}
                                                            </p>
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => duplicateStep(step.id)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Duplicate"
                                                        >
                                                            <Copy size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteStep(step.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => toggleStepExpanded(step.id)}
                                                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                        >
                                                            {step.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Step Content */}
                                                {step.expanded && (
                                                    <div className="p-5 border-t border-purple-100 space-y-5 bg-white">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">
                                                                    Step Internal Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={step.name}
                                                                    onChange={(e) => {
                                                                        const newSteps = [...steps];
                                                                        newSteps[index].name = e.target.value;
                                                                        setSteps(newSteps);
                                                                        setHasUnsavedChanges(true);
                                                                    }}
                                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">
                                                                    Step Type
                                                                </label>
                                                                <Select
                                                                    value={step.type}
                                                                    onValueChange={(val: any) => {
                                                                        const newSteps = [...steps];
                                                                        newSteps[index].type = val;
                                                                        setSteps(newSteps);
                                                                        setHasUnsavedChanges(true);
                                                                    }}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="input">Input Question</SelectItem>
                                                                        <SelectItem value="multiselect">Multi Select</SelectItem>
                                                                        <SelectItem value="singleselect">Single Select</SelectItem>
                                                                        <SelectItem value="numeric">Numeric Input</SelectItem>
                                                                        <SelectItem value="file">File Upload</SelectItem>
                                                                        <SelectItem value="info">Informational Block</SelectItem>
                                                                        <SelectItem value="branch">Conditional Branch</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">
                                                                Question / Title Text
                                                            </label>
                                                            <textarea
                                                                value={step.questionText}
                                                                onChange={(e) => {
                                                                    const newSteps = [...steps];
                                                                    newSteps[index].questionText = e.target.value;
                                                                    setSteps(newSteps);
                                                                    setHasUnsavedChanges(true);
                                                                }}
                                                                rows={2}
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500"
                                                                placeholder="Enter the question to show the user..."
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">
                                                                    Placeholder / Options Hint
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={step.placeholder}
                                                                    onChange={(e) => {
                                                                        const newSteps = [...steps];
                                                                        newSteps[index].placeholder = e.target.value;
                                                                        setSteps(newSteps);
                                                                        setHasUnsavedChanges(true);
                                                                    }}
                                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                                                                    placeholder="e.g. Select an option..."
                                                                />
                                                            </div>
                                                            <div className="flex items-end pb-2">
                                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={step.required}
                                                                        onChange={(e) => {
                                                                            const newSteps = [...steps];
                                                                            newSteps[index].required = e.target.checked;
                                                                            setSteps(newSteps);
                                                                            setHasUnsavedChanges(true);
                                                                        }}
                                                                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                                    />
                                                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#253154]">Mandatory step</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Step Logic (Conditional Jumps) */}
                                                        <div className="pt-4 border-t border-gray-100">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div>
                                                                    <h4 className="text-xs font-bold text-[#253154] flex items-center gap-2">
                                                                        <GitBranch size={14} className="text-purple-600" />
                                                                        Step Logic & Jumps
                                                                    </h4>
                                                                    <p className="text-[10px] text-gray-500 mt-0.5">
                                                                        Define what happens after this step based on user input
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 text-[10px] font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                                    onClick={() => addStepCondition(step.id)}
                                                                >
                                                                    <Plus size={12} className="mr-1" />
                                                                    ADD CONDITION
                                                                </Button>
                                                            </div>

                                                            <div className="space-y-3">
                                                                {step.conditions.length > 0 ? (
                                                                    step.conditions.map((condition) => (
                                                                        <div key={condition.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                            <span className="text-[10px] font-bold text-gray-400">IF</span>
                                                                            <Select
                                                                                value={condition.operator}
                                                                                onValueChange={(val) => updateStepCondition(step.id, condition.id, 'operator', val)}
                                                                            >
                                                                                <SelectTrigger className="h-8 text-xs min-w-[100px] bg-white">
                                                                                    <SelectValue />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {operators.map(op => (
                                                                                        <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                            <input
                                                                                type="text"
                                                                                value={condition.value}
                                                                                onChange={(e) => updateStepCondition(step.id, condition.id, 'value', e.target.value)}
                                                                                className="h-8 px-2 border border-gray-300 rounded text-xs w-24 focus:ring-1 focus:ring-purple-500 bg-white"
                                                                                placeholder="Value..."
                                                                            />
                                                                            <span className="text-[10px] font-bold text-gray-400">THEN</span>
                                                                            <Select
                                                                                value={condition.action}
                                                                                onValueChange={(val) => updateStepCondition(step.id, condition.id, 'action', val)}
                                                                            >
                                                                                <SelectTrigger className="h-8 text-xs min-w-[110px] bg-white">
                                                                                    <SelectValue />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="jump">Jump to Step</SelectItem>
                                                                                    <SelectItem value="variable">Set Variable</SelectItem>
                                                                                    <SelectItem value="terminate">End Flow</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                            {condition.action === 'jump' && (
                                                                                <Select
                                                                                    value={condition.actionValue}
                                                                                    onValueChange={(val) => updateStepCondition(step.id, condition.id, 'actionValue', val)}
                                                                                >
                                                                                    <SelectTrigger className="h-8 text-xs min-w-[120px] bg-white">
                                                                                        <SelectValue placeholder="Select step" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {steps.filter(s => s.id !== step.id).map(s => (
                                                                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            )}
                                                                            <button
                                                                                onClick={() => deleteStepCondition(step.id, condition.id)}
                                                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="py-4 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50/50">
                                                                        <p className="text-[10px] text-gray-400 font-medium">Standard linear progression: Go to next step</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        <button
                                            onClick={addNewStep}
                                            className="w-full py-4 border-2 border-dashed border-purple-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-400 transition-all text-purple-600 group"
                                        >
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Plus size={20} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold uppercase tracking-wide">Add New Step</p>
                                                <p className="text-[11px] text-purple-400">Insert a new question or informational block</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ========== LAYER 3: LOGIC & BRANCHING ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('logic')}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <GitBranch size={20} className="text-orange-600" />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-base font-bold text-[#253154]">
                                            Logic & Branching
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Configure global branch rules and outcomes
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-bold rounded uppercase tracking-wider border border-orange-100">
                                        {branchRules.length} Rules
                                    </span>
                                    {expandedSections.includes('logic') ? (
                                        <ChevronUp size={20} className="text-gray-400" />
                                    ) : (
                                        <ChevronDown size={20} className="text-gray-400" />
                                    )}
                                </div>
                            </button>

                            {expandedSections.includes('logic') && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/30">
                                    <div className="space-y-4 pt-2">
                                        {branchRules.map((rule, index) => (
                                            <div key={rule.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col gap-1">
                                                            <button
                                                                onClick={() => moveBranchRuleUp(rule.id)}
                                                                disabled={index === 0}
                                                                className="text-gray-400 hover:text-orange-600 disabled:opacity-30"
                                                            >
                                                                <ChevronUp size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => moveBranchRuleDown(rule.id)}
                                                                disabled={index === branchRules.length - 1}
                                                                className="text-gray-400 hover:text-orange-600 disabled:opacity-30"
                                                            >
                                                                <ChevronDown size={14} />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <input
                                                                type="text"
                                                                value={rule.name}
                                                                onChange={(e) => updateBranchRule(rule.id, 'name', e.target.value)}
                                                                className="text-sm font-bold text-[#253154] bg-transparent border-none p-0 focus:ring-0 w-64"
                                                            />
                                                            <p className="text-[10px] text-gray-500">Priority {rule.priority}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={rule.enabled}
                                                                onChange={(e) => updateBranchRule(rule.id, 'enabled', e.target.checked)}
                                                                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                            />
                                                            <span className="text-xs font-semibold text-gray-600">Enabled</span>
                                                        </label>
                                                        <button
                                                            onClick={() => deleteBranchRule(rule.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="p-4 space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Conditions</h4>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 text-[10px] text-orange-600 font-bold"
                                                                onClick={() => addBranchCondition(rule.id)}
                                                            >
                                                                <Plus size={12} className="mr-1" /> ADD CONDITION
                                                            </Button>
                                                        </div>
                                                        {rule.conditions.map((cond, cIdx) => (
                                                            <div key={cond.id} className="flex items-center gap-2">
                                                                {cIdx > 0 && (
                                                                    <Select
                                                                        value={cond.logic}
                                                                        onValueChange={(val: any) => updateBranchCondition(rule.id, cond.id, 'logic', val)}
                                                                    >
                                                                        <SelectTrigger className="h-8 w-20 text-[10px] font-bold">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="AND">AND</SelectItem>
                                                                            <SelectItem value="OR">OR</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                                <Select
                                                                    value={cond.field}
                                                                    onValueChange={(val) => updateBranchCondition(rule.id, cond.id, 'field', val)}
                                                                >
                                                                    <SelectTrigger className="h-8 flex-1 text-xs">
                                                                        <SelectValue placeholder="Select field" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {getAvailableFields(999).map(f => (
                                                                            <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Select
                                                                    value={cond.operator}
                                                                    onValueChange={(val) => updateBranchCondition(rule.id, cond.id, 'operator', val)}
                                                                >
                                                                    <SelectTrigger className="h-8 w-28 text-xs">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {operators.map(op => (
                                                                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <input
                                                                    type="text"
                                                                    value={cond.value}
                                                                    onChange={(e) => updateBranchCondition(rule.id, cond.id, 'value', e.target.value)}
                                                                    className="h-8 w-24 px-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-orange-500"
                                                                    placeholder="Value..."
                                                                />
                                                                <button
                                                                    onClick={() => deleteBranchCondition(rule.id, cond.id)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-500"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="pt-3 border-t border-gray-100 flex items-center gap-4">
                                                        <div className="flex-1">
                                                            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Outcome</h4>
                                                            <div className="flex gap-2">
                                                                <Select
                                                                    value={rule.outcome.type}
                                                                    onValueChange={(val: any) => updateBranchRule(rule.id, 'outcome', { ...rule.outcome, type: val })}
                                                                >
                                                                    <SelectTrigger className="h-9 w-40 text-xs">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="jump">Jump to Step</SelectItem>
                                                                        <SelectItem value="risk">Set Risk Level</SelectItem>
                                                                        <SelectItem value="escalate">Escalate Flow</SelectItem>
                                                                        <SelectItem value="template">Show Template</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <input
                                                                    type="text"
                                                                    value={rule.outcome.value}
                                                                    onChange={(e) => updateBranchRule(rule.id, 'outcome', { ...rule.outcome, value: e.target.value })}
                                                                    className="h-9 flex-1 px-3 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-orange-500"
                                                                    placeholder="Value or Step ID..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={addBranchRule}
                                            className="w-full py-3 border-2 border-dashed border-orange-200 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-300 transition-all text-orange-600 group"
                                        >
                                            <Plus size={16} className="group-hover:scale-125 transition-transform" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Add New Branch Rule</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ========== LAYER 4: OUTPUT CONFIGURATION ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('output')}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Zap size={20} className="text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-base font-bold text-[#253154]">
                                            Output Configuration
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Define success screens and final actions
                                        </p>
                                    </div>
                                </div>
                                {expandedSections.includes('output') ? (
                                    <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('output') && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/30 space-y-4">
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
                                            <h3 className="text-sm font-bold text-green-700 flex items-center gap-2">
                                                <CheckCircle2 size={16} />
                                                Success Outcome
                                            </h3>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Completion Message</label>
                                                <textarea
                                                    rows={3}
                                                    defaultValue="Thank you! Your eligibility check is complete. Our AI has generated a custom report for you."
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Redirect URL (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="https://..."
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
                                            <h3 className="text-sm font-bold text-red-700 flex items-center gap-2">
                                                <AlertCircle size={16} />
                                                Rejection Outcome
                                            </h3>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Ineligibility Message</label>
                                                <textarea
                                                    rows={3}
                                                    defaultValue="Based on the information provided, you may not meet the current SDS requirements. We recommend improving your IELTS score or consulting a counsellor."
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                />
                                                <span className="text-xs font-semibold text-gray-600">Show &apos;Talk to Expert&apos; button</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ========== LAYER 5: ESCALATION SETTINGS ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('escalation')}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <Shield size={20} className="text-red-600" />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-base font-bold text-[#253154]">
                                            Escalation Settings
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Handover rules to human counsellors
                                        </p>
                                    </div>
                                </div>
                                {expandedSections.includes('escalation') ? (
                                    <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('escalation') && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/30 space-y-4">
                                    <div className="grid grid-cols-2 gap-6 pt-2">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Escalate if:
                                            </label>
                                            <div className="space-y-2">
                                                {['Confidence below threshold', 'Risk high', 'User requests human'].map((label) => (
                                                    <label key={label} className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked
                                                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm text-gray-900">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Confidence Threshold
                                                </label>
                                                <div className="space-y-2">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        defaultValue="50"
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                                                    />
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">0%</span>
                                                        <span className="text-sm font-bold text-red-600">50%</span>
                                                        <span className="text-xs text-gray-500">100%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Escalation Action
                                                </label>
                                                <Select defaultValue="contact">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select action" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="contact">Show Contact Counsellor</SelectItem>
                                                        <SelectItem value="lead">Create Lead</SelectItem>
                                                        <SelectItem value="assign">Assign to Counsellor</SelectItem>
                                                        <SelectItem value="email">Send Email Alert</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ========== LAYER 6: TESTING & SIMULATION ========== */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleSection('testing')}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                        <TestTube size={20} className="text-cyan-600" />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-base font-bold text-[#253154]">
                                            Testing & Simulation
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            Test flow with simulated user inputs
                                        </p>
                                    </div>
                                </div>
                                {expandedSections.includes('testing') ? (
                                    <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.includes('testing') && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/30 space-y-4">
                                    <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
                                        <h3 className="text-sm font-bold text-cyan-900 mb-3 flex items-center gap-2">
                                            <Sparkles size={16} />
                                            Test Scenario 1: Low Risk (Ideal Candidate)
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { label: 'Target Country', value: 'Canada' },
                                                    { label: 'Study Level', value: 'Masters' },
                                                    { label: 'IELTS Score', value: '6.5' },
                                                    { label: 'Education Gap (years)', value: '1' },
                                                    { label: 'Financial Proof', value: 'Yes' },
                                                    { label: 'Visa Rejection', value: 'No' },
                                                ].map((field) => (
                                                    <div key={field.label}>
                                                        <label className="block text-[10px] font-semibold text-cyan-800 mb-1">
                                                            {field.label}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={field.value}
                                                            readOnly
                                                            className="w-full px-2 py-1.5 border border-cyan-300 rounded text-xs bg-white font-semibold text-cyan-900"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-3 bg-white border border-cyan-300 rounded-lg">
                                                <p className="text-xs font-semibold text-cyan-900 mb-2">Expected Output:</p>
                                                <div className="space-y-2">
                                                    <p className="text-xs text-gray-800">
                                                        <span className="font-bold">✓ Risk Level:</span> <span className="text-green-700 font-bold">LOW</span>
                                                    </p>
                                                    <p className="text-xs text-gray-700">
                                                        You meet the Canada SDS baseline requirements. Strong profile with no major risk factors detected.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="p-3 bg-white border border-cyan-300 rounded-lg">
                                                    <p className="text-[10px] font-semibold text-cyan-700 uppercase mb-1">Flow Path</p>
                                                    <p className="text-xs font-bold text-cyan-900">Steps 1→2→3→4→5→6→8</p>
                                                </div>
                                                <div className="p-3 bg-white border border-cyan-300 rounded-lg">
                                                    <p className="text-[10px] font-semibold text-cyan-700 uppercase mb-1">Branch Matched</p>
                                                    <p className="text-xs font-bold text-cyan-900">Rule 3: Low Risk</p>
                                                </div>
                                                <div className="p-3 bg-white border border-cyan-300 rounded-lg">
                                                    <p className="text-[10px] font-semibold text-cyan-700 uppercase mb-1">Confidence</p>
                                                    <p className="text-xs font-bold text-green-700">92%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                                        <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            Test Scenario 2: English Improvement Path
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[10px] font-semibold text-amber-800 mb-1">
                                                        IELTS Score
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value="5.5"
                                                        readOnly
                                                        className="w-full px-2 py-1.5 border border-amber-300 rounded text-xs bg-white font-semibold text-red-700"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-semibold text-amber-800 mb-1">
                                                        Action Triggered
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value="Jump to Step 7"
                                                        readOnly
                                                        className="w-full px-2 py-1.5 border border-amber-300 rounded text-xs bg-white font-semibold text-amber-900"
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-3 bg-white border border-amber-300 rounded-lg">
                                                <p className="text-xs font-semibold text-amber-900 mb-1">Step Condition Triggered:</p>
                                                <p className="text-xs text-amber-800">
                                                    IF IELTS Score &lt; 6.0 → Jump to &quot;English Improvement Advice&quot;
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 bg-white border border-amber-300 rounded-lg">
                                                    <p className="text-[10px] font-semibold text-amber-700 uppercase mb-1">Flow Path</p>
                                                    <p className="text-xs font-bold text-amber-900">Steps 1→2→3→7→8</p>
                                                </div>
                                                <div className="p-3 bg-white border border-amber-300 rounded-lg">
                                                    <p className="text-[10px] font-semibold text-amber-700 uppercase mb-1">Advice Shown</p>
                                                    <p className="text-xs font-bold text-amber-900">Improve English First</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">
                                            <Play size={16} className="mr-2" />
                                            Run Simulation
                                        </Button>
                                        <Button variant="outline" className="flex-1">
                                            <RotateCcw size={16} className="mr-2" />
                                            Reset Test
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT: Preview Panel (30%) */}
                    <div className="w-[30%] space-y-5">
                        <div className="sticky top-24 space-y-5">
                            {/* Flow Stats */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <h3 className="text-sm font-bold text-[#253154] mb-4 flex items-center gap-2">
                                    <Info size={16} />
                                    Flow Statistics
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Total Steps</span>
                                        <span className="text-xs font-bold text-gray-900">{steps.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Required Steps</span>
                                        <span className="text-xs font-bold text-gray-900">
                                            {steps.filter(s => s.required).length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Step Conditions</span>
                                        <span className="text-xs font-bold text-gray-900">
                                            {steps.reduce((sum, s) => sum + s.conditions.length, 0)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Branch Rules</span>
                                        <span className="text-xs font-bold text-gray-900">{branchRules.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Completion Rate</span>
                                        <span className="text-xs font-bold text-green-700">78%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-5">
                                <h3 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                                    <Target size={16} />
                                    Performance (30D)
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-purple-700">Usage</span>
                                            <span className="text-xs font-bold text-purple-900">1,248</span>
                                        </div>
                                        <div className="w-full bg-purple-200 rounded-full h-2">
                                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-purple-700">Success Rate</span>
                                            <span className="text-xs font-bold text-purple-900">92%</span>
                                        </div>
                                        <div className="w-full bg-purple-200 rounded-full h-2">
                                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Tips */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-bold text-amber-900 mb-2">
                                            Best Practices
                                        </h3>
                                        <ul className="text-xs text-amber-800 space-y-1.5">
                                            <li>• Keep steps under 15 for better completion</li>
                                            <li>• Use clear, concise question text</li>
                                            <li>• Test flows before publishing</li>
                                            <li>• Monitor completion rates weekly</li>
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
