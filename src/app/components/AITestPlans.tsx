'use client';

/**
 * AI TEST ASSISTANT - PLANS CONFIGURATION
 * 
 * Minimal AI coaching control panel.
 * Simple configuration, powerful execution.
 */

import React, { useState } from 'react';
import {
    Save,
    Target,
    Clock,
    Calendar,
    TrendingUp,
    Zap,
    ChevronDown,
    ChevronUp,
    Info,
    CheckCircle,
    AlertCircle,
    Play,
    RotateCcw,
    Sparkles,
    BookOpen,
    FileText,
    Volume2,
    Headphones,
    Award,
    Flame,
    HelpCircle,
    X,
} from 'lucide-react';
import { toast } from 'sonner';

type IntensityMode = 'light' | 'normal' | 'intense';
type MockFrequency = 'conservative' | 'balanced' | 'aggressive';

interface AITestPlansProps {
    onNavigate?: (page: string) => void;
}

export const AITestPlans: React.FC<AITestPlansProps> = ({ onNavigate }) => {
    // 1. Weakness Priority
    const [weakSkillBoost, setWeakSkillBoost] = useState(30); // 20, 30, or 40
    const [ensureMinSkills, setEnsureMinSkills] = useState(true);
    const [preventOverload, setPreventOverload] = useState(true);

    // 2. Study Intensity
    const [intensityMode, setIntensityMode] = useState<IntensityMode>('normal');
    const [customIntensity, setCustomIntensity] = useState({
        light: { timeMin: 30, timeMax: 45, tasksMin: 1, tasksMax: 2 },
        normal: { timeMin: 60, timeMax: 90, tasksMin: 2, tasksMax: 3 },
        intense: { timeMin: 120, timeMax: 180, tasksMin: 3, tasksMax: 5 },
    });

    // 3. Mock Test Strategy
    const [mockFrequency, setMockFrequency] = useState<MockFrequency>('balanced');
    const [examCountdownBoost, setExamCountdownBoost] = useState(true);
    const [boostDaysBefore, setBoostDaysBefore] = useState(14);
    const [autoExamReady, setAutoExamReady] = useState(true);
    const [readyBandThreshold, setReadyBandThreshold] = useState(6.5);
    const [readyConsistency, setReadyConsistency] = useState(75);

    // 4. Exam Readiness Weights
    const [readinessWeights, setReadinessWeights] = useState({
        mockPerformance: 40,
        consistency: 30,
        skillBalance: 20,
        completionRate: 10,
    });

    // 5. Motivation & Streak
    const [enableStreak, setEnableStreak] = useState(true);
    const [minDailyActivity, setMinDailyActivity] = useState(30);
    const [graceDays, setGraceDays] = useState(1);
    const [streakMilestone, setStreakMilestone] = useState(7);
    const [showNudges, setShowNudges] = useState(true);

    // UI State
    const [expandedSections, setExpandedSections] = useState<string[]>(['weakness-priority']);
    const [isSaving, setIsSaving] = useState(false);
    const [showSimulation, setShowSimulation] = useState(false);

    // Calculations
    const readinessTotalWeight = Object.values(readinessWeights).reduce((sum, val) => sum + val, 0);
    const isReadinessValid = readinessTotalWeight === 100;

    // Handlers
    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const handleReadinessWeightChange = (key: string, value: number) => {
        setReadinessWeights(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!isReadinessValid) {
            toast.error('Invalid configuration', {
                description: 'Readiness weights must total 100%'
            });
            return;
        }

        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Plans configuration saved', {
                description: 'AI coaching system updated successfully'
            });
        } catch (error) {
            toast.error('Failed to save', { description: 'Please try again' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLoadPreset = () => {
        // Reset to IELTS recommended defaults
        setWeakSkillBoost(30);
        setEnsureMinSkills(true);
        setPreventOverload(true);
        setIntensityMode('normal');
        setMockFrequency('balanced');
        setExamCountdownBoost(true);
        setBoostDaysBefore(14);
        setAutoExamReady(true);
        setReadyBandThreshold(6.5);
        setReadyConsistency(75);
        setReadinessWeights({ mockPerformance: 40, consistency: 30, skillBalance: 20, completionRate: 10 });
        setEnableStreak(true);
        setMinDailyActivity(30);
        setGraceDays(1);
        setStreakMilestone(7);
        setShowNudges(true);

        toast.success('Preset loaded', { description: 'IELTS recommended settings applied' });
    };

    // Calculate confidence score preview
    const previewConfidence =
        (0.92 * readinessWeights.mockPerformance / 100) +
        (0.85 * readinessWeights.consistency / 100) +
        (0.78 * readinessWeights.skillBalance / 100) +
        (0.95 * readinessWeights.completionRate / 100);
    const confidencePercent = Math.round(previewConfidence * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#faf7ff] via-white to-[#f8faff]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#253154]">AI Study Plans</h1>
                            <p className="text-sm text-gray-600 mt-1">Configure intelligent coaching behavior</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleLoadPreset}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-[#253154] rounded-xl text-sm font-medium transition-colors"
                            >
                                <RotateCcw size={16} />
                                <span>Load IELTS Preset</span>
                            </button>
                            <button
                                onClick={() => setShowSimulation(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
                            >
                                <Play size={16} />
                                <span>Preview Weekly Plan</span>
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !isReadinessValid}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Warning */}
            {!isReadinessValid && (
                <div className="max-w-[1400px] mx-auto px-8 py-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-amber-900">Invalid Configuration</p>
                            <p className="text-xs text-amber-700 mt-1">
                                Readiness weights total {readinessTotalWeight}% (must be 100%)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
                {/* 1. WEAKNESS PRIORITY SETTINGS */}
                <CollapsibleSection
                    title="Weakness Priority Settings"
                    subtitle="How AI focuses on weaker skills"
                    icon={<Target size={20} className="text-red-600" />}
                    expanded={expandedSections.includes('weakness-priority')}
                    onToggle={() => toggleSection('weakness-priority')}
                >
                    <div className="space-y-6">
                        {/* Weak Skill Boost */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-base font-semibold text-[#253154]">Weak Skill Boost</h3>
                                <TooltipHelper text="If a skill band is lowest, system assigns more tasks for that skill" />
                            </div>

                            <div className="flex gap-3 mb-4">
                                {[20, 30, 40].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => setWeakSkillBoost(value)}
                                        className={`flex-1 px-6 py-4 rounded-xl text-sm font-semibold transition-all ${weakSkillBoost === value
                                            ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <div className="text-base">{value === 20 ? 'Low' : value === 30 ? 'Medium' : 'High'}</div>
                                        <div className={`text-xs mt-1 ${weakSkillBoost === value ? 'text-red-100' : 'text-gray-600'}`}>
                                            {value}% extra focus
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-xs text-red-800">
                                    <strong>Example:</strong> If Writing is at Band 5.5 and other skills are 6.5+,
                                    AI will assign {weakSkillBoost}% more Writing tasks.
                                </p>
                            </div>
                        </div>

                        {/* Balance Rules */}
                        <div>
                            <h3 className="text-base font-semibold text-[#253154] mb-4">Skill Balance Rules</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={ensureMinSkills}
                                        onChange={(e) => setEnsureMinSkills(e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-[#253154]">Ensure minimum 2 skills per day</p>
                                        <p className="text-xs text-gray-600 mt-0.5">Prevents focusing on only one skill area</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={preventOverload}
                                        onChange={(e) => setPreventOverload(e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-[#253154]">Prevent single-skill overload</p>
                                        <p className="text-xs text-gray-600 mt-0.5">Caps maximum tasks per skill per day</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* 2. STUDY INTENSITY MODES */}
                <CollapsibleSection
                    title="Study Intensity Modes"
                    subtitle="Daily study time and task volume"
                    icon={<Clock size={20} className="text-blue-600" />}
                    expanded={expandedSections.includes('intensity')}
                    onToggle={() => toggleSection('intensity')}
                >
                    <div className="space-y-6">
                        {/* Mode Selector */}
                        <div>
                            <h3 className="text-base font-semibold text-[#253154] mb-4">Select Intensity Template</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {(['light', 'normal', 'intense'] as IntensityMode[]).map((mode) => {
                                    const config = customIntensity[mode];
                                    const isSelected = intensityMode === mode;
                                    return (
                                        <button
                                            key={mode}
                                            onClick={() => setIntensityMode(mode)}
                                            className={`p-5 rounded-xl border-2 transition-all text-left ${isSelected
                                                ? 'border-blue-600 bg-blue-50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className={`text-base font-bold capitalize ${isSelected ? 'text-blue-700' : 'text-[#253154]'}`}>
                                                    {mode}
                                                </h4>
                                                {isSelected && <CheckCircle size={18} className="text-blue-600" />}
                                            </div>
                                            <p className={`text-xs mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                                                {config.timeMin}–{config.timeMax} mins daily
                                            </p>
                                            <p className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                                                {config.tasksMin}–{config.tasksMax} tasks per day
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Custom Adjustment */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                            <h4 className="text-sm font-semibold text-[#253154] mb-4">
                                Customize {intensityMode.charAt(0).toUpperCase() + intensityMode.slice(1)} Mode
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-600 block mb-2">Daily time range (mins)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={customIntensity[intensityMode].timeMin}
                                            onChange={(e) => setCustomIntensity(prev => ({
                                                ...prev,
                                                [intensityMode]: { ...prev[intensityMode], timeMin: parseInt(e.target.value) }
                                            }))}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-400">—</span>
                                        <input
                                            type="number"
                                            value={customIntensity[intensityMode].timeMax}
                                            onChange={(e) => setCustomIntensity(prev => ({
                                                ...prev,
                                                [intensityMode]: { ...prev[intensityMode], timeMax: parseInt(e.target.value) }
                                            }))}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-2">Tasks per day range</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={customIntensity[intensityMode].tasksMin}
                                            onChange={(e) => setCustomIntensity(prev => ({
                                                ...prev,
                                                [intensityMode]: { ...prev[intensityMode], tasksMin: parseInt(e.target.value) }
                                            }))}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-400">—</span>
                                        <input
                                            type="number"
                                            value={customIntensity[intensityMode].tasksMax}
                                            onChange={(e) => setCustomIntensity(prev => ({
                                                ...prev,
                                                [intensityMode]: { ...prev[intensityMode], tasksMax: parseInt(e.target.value) }
                                            }))}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* 3. MOCK TEST STRATEGY */}
                <CollapsibleSection
                    title="Mock Test Strategy"
                    subtitle="Full test scheduling and exam readiness"
                    icon={<Calendar size={20} className="text-purple-600" />}
                    expanded={expandedSections.includes('mock-strategy')}
                    onToggle={() => toggleSection('mock-strategy')}
                >
                    <div className="space-y-6">
                        {/* Mock Frequency */}
                        <div>
                            <h3 className="text-base font-semibold text-[#253154] mb-4">Mock Frequency Control</h3>
                            <select
                                value={mockFrequency}
                                onChange={(e) => setMockFrequency(e.target.value as MockFrequency)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="conservative">Conservative — 1 mock every 14 days</option>
                                <option value="balanced">Balanced — 1 mock every 7 days</option>
                                <option value="aggressive">Aggressive — 2 mocks per week</option>
                            </select>
                        </div>

                        {/* Exam Countdown Boost */}
                        <div className="border border-gray-200 rounded-xl p-5">
                            <label className="flex items-center gap-3 cursor-pointer mb-4">
                                <input
                                    type="checkbox"
                                    checked={examCountdownBoost}
                                    onChange={(e) => setExamCountdownBoost(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <div>
                                    <p className="text-sm font-medium text-[#253154]">Increase mock frequency before exam</p>
                                    <p className="text-xs text-gray-600 mt-0.5">Automatically boost practice as exam approaches</p>
                                </div>
                            </label>

                            {examCountdownBoost && (
                                <div className="pl-8">
                                    <label className="text-xs text-gray-600 block mb-2">Days before exam to increase frequency</label>
                                    <input
                                        type="number"
                                        value={boostDaysBefore}
                                        onChange={(e) => setBoostDaysBefore(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Auto Exam Ready Badge */}
                        <div className="border border-gray-200 rounded-xl p-5">
                            <label className="flex items-center gap-3 cursor-pointer mb-4">
                                <input
                                    type="checkbox"
                                    checked={autoExamReady}
                                    onChange={(e) => setAutoExamReady(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-[#253154]">Show &quot;Exam Ready&quot; badge automatically</p>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">EXAM READY</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">Display readiness badge when criteria met</p>
                                </div>
                            </label>

                            {autoExamReady && (
                                <div className="pl-8 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-600 block mb-2">Minimum average band</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={readyBandThreshold}
                                            onChange={(e) => setReadyBandThreshold(parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 block mb-2">Minimum consistency (%)</label>
                                        <input
                                            type="number"
                                            value={readyConsistency}
                                            onChange={(e) => setReadyConsistency(parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CollapsibleSection>

                {/* 4. EXAM READINESS ENGINE */}
                <CollapsibleSection
                    title="Exam Readiness Engine"
                    subtitle="How confidence score is calculated"
                    icon={<TrendingUp size={20} className="text-green-600" />}
                    expanded={expandedSections.includes('readiness')}
                    onToggle={() => toggleSection('readiness')}
                >
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                            <Info size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-green-900">Adjust Weight Distribution</p>
                                <p className="text-xs text-green-700 mt-1">
                                    Control how much each factor contributes to the confidence score. Total must equal 100%.
                                </p>
                            </div>
                        </div>

                        {/* Weight Sliders */}
                        <div className="space-y-5">
                            {Object.entries(readinessWeights).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-[#253154] capitalize flex items-center gap-2">
                                            {key === 'mockPerformance' && 'Recent Mock Performance'}
                                            {key === 'consistency' && 'Practice Consistency'}
                                            {key === 'skillBalance' && 'Skill Balance'}
                                            {key === 'completionRate' && 'Task Completion Rate'}
                                            <TooltipHelper text={
                                                key === 'mockPerformance' ? 'How well student performs in full mock tests' :
                                                    key === 'consistency' ? 'Regular daily practice without long breaks' :
                                                        key === 'skillBalance' ? 'All skills at similar band levels' :
                                                            'Percentage of assigned tasks completed'
                                            } />
                                        </label>
                                        <span className={`text-sm font-bold ${isReadinessValid ? 'text-green-600' : 'text-red-600'}`}>
                                            {value}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={value}
                                        onChange={(e) => handleReadinessWeightChange(key, parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Total Weight Indicator */}
                        <div className={`p-4 rounded-xl border-2 ${isReadinessValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-semibold ${isReadinessValid ? 'text-green-900' : 'text-red-900'}`}>
                                    Total Weight: {readinessTotalWeight}%
                                </span>
                                {isReadinessValid ? (
                                    <CheckCircle size={20} className="text-green-600" />
                                ) : (
                                    <AlertCircle size={20} className="text-red-600" />
                                )}
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={20} />
                                <h4 className="text-base font-semibold">Live Preview</h4>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <div className="text-4xl font-bold">{confidencePercent}%</div>
                                <div className="text-sm text-green-100">Confidence Score Example</div>
                            </div>
                            <p className="text-xs text-green-100 mt-3">
                                Based on sample data: 92% mock score, 85% consistency, 78% balance, 95% completion
                            </p>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* 5. MOTIVATION & STREAK SETTINGS */}
                <CollapsibleSection
                    title="Motivation & Streak Settings"
                    subtitle="Daily engagement and rewards"
                    icon={<Flame size={20} className="text-orange-600" />}
                    expanded={expandedSections.includes('motivation')}
                    onToggle={() => toggleSection('motivation')}
                >
                    <div className="space-y-6">
                        {/* Enable Streak System */}
                        <div className="border border-gray-200 rounded-xl p-5">
                            <label className="flex items-center gap-3 cursor-pointer mb-4">
                                <input
                                    type="checkbox"
                                    checked={enableStreak}
                                    onChange={(e) => setEnableStreak(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <div>
                                    <p className="text-sm font-medium text-[#253154]">Enable Streak System</p>
                                    <p className="text-xs text-gray-600 mt-0.5">Track consecutive days of activity</p>
                                </div>
                            </label>

                            {enableStreak && (
                                <div className="pl-8 space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-600 block mb-2">Min daily activity (mins)</label>
                                            <input
                                                type="number"
                                                value={minDailyActivity}
                                                onChange={(e) => setMinDailyActivity(parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 block mb-2">Grace days per week</label>
                                            <input
                                                type="number"
                                                value={graceDays}
                                                onChange={(e) => setGraceDays(parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 block mb-2">Milestone (days)</label>
                                            <select
                                                value={streakMilestone}
                                                onChange={(e) => setStreakMilestone(parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            >
                                                <option value="7">7 days</option>
                                                <option value="14">14 days</option>
                                                <option value="30">30 days</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Motivational Nudges */}
                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={showNudges}
                                onChange={(e) => setShowNudges(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <div>
                                <p className="text-sm font-medium text-[#253154]">Show motivational nudges</p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    Display encouraging messages and reminders to keep students engaged
                                </p>
                            </div>
                        </label>
                    </div>
                </CollapsibleSection>
            </div>

            {/* Plan Simulation Modal */}
            {showSimulation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-[#253154]">Weekly Plan Preview</h3>
                                <p className="text-sm text-gray-600 mt-1">Based on current configuration</p>
                            </div>
                            <button
                                onClick={() => setShowSimulation(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                <div key={day} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-base font-bold text-[#253154]">Day {day}</h4>
                                        <span className="text-xs text-gray-600">
                                            {customIntensity[intensityMode].timeMin}–{customIntensity[intensityMode].timeMax} mins
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {day === 1 && (
                                            <>
                                                <TaskPreviewItem icon={<FileText size={16} className="text-purple-600" />} title="Writing Task 2" subtitle="Essay about education" />
                                                <TaskPreviewItem icon={<Headphones size={16} className="text-blue-600" />} title="Listening Section 3" subtitle="Academic conversation" />
                                            </>
                                        )}
                                        {day === 2 && (
                                            <>
                                                <TaskPreviewItem icon={<BookOpen size={16} className="text-green-600" />} title="Reading Passage 2" subtitle="Science article" />
                                                <TaskPreviewItem icon={<Volume2 size={16} className="text-orange-600" />} title="Speaking Part 2" subtitle="Describe a place" />
                                            </>
                                        )}
                                        {day === 3 && (
                                            <>
                                                <TaskPreviewItem icon={<FileText size={16} className="text-purple-600" />} title="Writing Task 1" subtitle="Graph description" />
                                                <TaskPreviewItem icon={<Headphones size={16} className="text-blue-600" />} title="Listening Section 1" subtitle="Social situation" />
                                                <TaskPreviewItem icon={<BookOpen size={16} className="text-green-600" />} title="Reading Passage 1" subtitle="History topic" />
                                            </>
                                        )}
                                        {day === 4 && (
                                            <>
                                                <TaskPreviewItem icon={<Volume2 size={16} className="text-orange-600" />} title="Speaking Part 1" subtitle="Personal questions" />
                                                <TaskPreviewItem icon={<FileText size={16} className="text-purple-600" />} title="Writing Task 2" subtitle="Opinion essay" />
                                            </>
                                        )}
                                        {day === 5 && (
                                            <>
                                                <TaskPreviewItem icon={<Headphones size={16} className="text-blue-600" />} title="Listening Section 4" subtitle="Academic lecture" />
                                                <TaskPreviewItem icon={<BookOpen size={16} className="text-green-600" />} title="Reading Passage 3" subtitle="Complex text" />
                                            </>
                                        )}
                                        {day === 6 && (
                                            <>
                                                <TaskPreviewItem icon={<Volume2 size={16} className="text-orange-600" />} title="Speaking Part 3" subtitle="Discussion questions" />
                                                <TaskPreviewItem icon={<FileText size={16} className="text-purple-600" />} title="Writing Practice" subtitle="Mixed tasks" />
                                            </>
                                        )}
                                        {day === 7 && (
                                            <>
                                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                                                    <Award size={20} className="text-purple-600" />
                                                    <div>
                                                        <p className="text-sm font-bold text-purple-900">Full Mock Test</p>
                                                        <p className="text-xs text-purple-700">All 4 skills — 2h 45m</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-semibold text-[#253154]">Weak Skill Focus: Writing (+{weakSkillBoost}%)</p>
                                <p className="text-xs text-gray-600 mt-1">Intensity: {intensityMode.charAt(0).toUpperCase() + intensityMode.slice(1)}</p>
                            </div>
                            <button
                                onClick={() => setShowSimulation(false)}
                                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const CollapsibleSection: React.FC<{
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    expanded: boolean;
    onToggle: () => void;
}> = ({ title, subtitle, icon, children, expanded, onToggle }) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    {icon}
                </div>
                <div className="text-left">
                    <h2 className="text-lg font-semibold text-[#253154]">{title}</h2>
                    <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>
                </div>
            </div>
            {expanded ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
        </button>
        {expanded && <div className="p-6 pt-0">{children}</div>}
    </div>
);

const TooltipHelper: React.FC<{ text: string }> = ({ text }) => (
    <div className="group relative inline-flex">
        <HelpCircle size={16} className="text-gray-400 cursor-help" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-10 max-w-xs">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
    </div>
);

const TaskPreviewItem: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-200">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-[#253154]">{title}</p>
            <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
    </div>
);
