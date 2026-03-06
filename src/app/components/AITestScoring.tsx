'use client';

/**
 * AI TEST ASSISTANT - SCORING CONFIGURATION
 * 
 * Minimal and powerful scoring control system.
 * Simple configuration without overwhelming complexity.
 */

import React, { useState } from 'react';
import {
    Settings,
    Save,
    AlertCircle,
    Info,
    CheckCircle,
    Sliders,
    FileText,
    Volume2,
    BookOpen,
    Cpu,
    ChevronDown,
    ChevronUp,
    HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// Types
type BandMapping = { range: string; band: string };

interface AITestScoringProps {
    onNavigate?: (page: string) => void;
}

export const AITestScoring: React.FC<AITestScoringProps> = ({ onNavigate }) => {
    // Reading & Listening Band Mappings
    const [readingMapping, setReadingMapping] = useState<BandMapping[]>([
        { range: '39-40', band: '9.0' },
        { range: '37-38', band: '8.5' },
        { range: '35-36', band: '8.0' },
        { range: '33-34', band: '7.5' },
        { range: '30-32', band: '7.0' },
        { range: '27-29', band: '6.5' },
        { range: '23-26', band: '6.0' },
        { range: '19-22', band: '5.5' },
        { range: '16-18', band: '5.0' },
    ]);

    const [listeningMapping, setListeningMapping] = useState<BandMapping[]>([
        { range: '39-40', band: '9.0' },
        { range: '37-38', band: '8.5' },
        { range: '35-36', band: '8.0' },
        { range: '32-34', band: '7.5' },
        { range: '30-31', band: '7.0' },
        { range: '26-29', band: '6.5' },
        { range: '23-25', band: '6.0' },
        { range: '18-22', band: '5.5' },
        { range: '16-17', band: '5.0' },
    ]);

    const [readingTotalQuestions, setReadingTotalQuestions] = useState(40);
    const [listeningTotalQuestions, setListeningTotalQuestions] = useState(40);
    const [readingNegativeMarking, setReadingNegativeMarking] = useState(false);
    const [listeningNegativeMarking, setListeningNegativeMarking] = useState(false);

    // Writing Scoring
    const [writingWeights, setWritingWeights] = useState({
        taskResponse: 25,
        coherence: 25,
        lexical: 25,
        grammar: 25,
    });
    const [writingStrictness, setWritingStrictness] = useState('standard');
    const [applyWordCountPenalty, setApplyWordCountPenalty] = useState(true);
    const [minWordCount, setMinWordCount] = useState(150);
    const [wordCountPenalty, setWordCountPenalty] = useState('-0.5');
    const [enableOffTopicDetection, setEnableOffTopicDetection] = useState(true);
    const [offTopicSensitivity, setOffTopicSensitivity] = useState('medium');

    // Speaking Scoring
    const [speakingWeights, setSpeakingWeights] = useState({
        fluency: 25,
        vocabulary: 25,
        grammar: 25,
        pronunciation: 25,
    });
    const [minSpeakingDuration, setMinSpeakingDuration] = useState(120);
    const [idealRangeMin, setIdealRangeMin] = useState(120);
    const [idealRangeMax, setIdealRangeMax] = useState(180);
    const [applyDurationPenalty, setApplyDurationPenalty] = useState(true);
    const [fillerSensitivity, setFillerSensitivity] = useState('medium');

    // AI Model & Safety
    const [writingModel, setWritingModel] = useState('gpt-4-turbo');
    const [speechModel, setSpeechModel] = useState('whisper-1');
    const [retryAttempts, setRetryAttempts] = useState(3);
    const [timeoutDuration, setTimeoutDuration] = useState(30);
    const [confidenceThreshold, setConfidenceThreshold] = useState(85);

    // UI State
    const [expandedSections, setExpandedSections] = useState<string[]>(['reading-listening']);
    const [isSaving, setIsSaving] = useState(false);

    // Calculations
    const writingTotalWeight = Object.values(writingWeights).reduce((sum, val) => sum + val, 0);
    const speakingTotalWeight = Object.values(speakingWeights).reduce((sum, val) => sum + val, 0);
    const isWritingWeightValid = writingTotalWeight === 100;
    const isSpeakingWeightValid = speakingTotalWeight === 100;
    const isFormValid = isWritingWeightValid && isSpeakingWeightValid;

    // Handlers
    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const handleWritingWeightChange = (key: string, value: number) => {
        setWritingWeights(prev => ({ ...prev, [key]: value }));
    };

    const handleSpeakingWeightChange = (key: string, value: number) => {
        setSpeakingWeights(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!isFormValid) {
            toast.error('Invalid configuration', {
                description: 'All criteria weights must total 100%'
            });
            return;
        }

        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success('Scoring configuration saved', {
                description: 'Changes will apply to new test evaluations'
            });
        } catch (error) {
            toast.error('Failed to save', { description: 'Please try again' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#faf7ff] via-white to-[#f8faff]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#253154]">Scoring Configuration</h1>
                            <p className="text-sm text-gray-600 mt-1">Configure AI evaluation and band calculation</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !isFormValid}
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
            {!isFormValid && (
                <div className="max-w-[1400px] mx-auto px-8 py-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-amber-900">Invalid Configuration</p>
                            <p className="text-xs text-amber-700 mt-1">
                                {!isWritingWeightValid && `Writing criteria weights total ${writingTotalWeight}% (must be 100%). `}
                                {!isSpeakingWeightValid && `Speaking criteria weights total ${speakingTotalWeight}% (must be 100%).`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">
                {/* 1. READING & LISTENING */}
                <CollapsibleSection
                    title="Reading & Listening"
                    subtitle="Band mapping based on correct answers"
                    icon={<BookOpen size={20} className="text-blue-600" />}
                    expanded={expandedSections.includes('reading-listening')}
                    onToggle={() => toggleSection('reading-listening')}
                >
                    <div className="grid grid-cols-2 gap-8">
                        {/* Reading */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold text-[#253154]">Reading</h3>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-600">Total Questions:</label>
                                    <input
                                        type="number"
                                        value={readingTotalQuestions}
                                        onChange={(e) => setReadingTotalQuestions(parseInt(e.target.value))}
                                        className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Correct Answers</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Band</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {readingMapping.map((mapping, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={mapping.range}
                                                        onChange={(e) => {
                                                            const newMapping = [...readingMapping];
                                                            newMapping[idx].range = e.target.value;
                                                            setReadingMapping(newMapping);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={mapping.band}
                                                        onChange={(e) => {
                                                            const newMapping = [...readingMapping];
                                                            newMapping[idx].band = e.target.value;
                                                            setReadingMapping(newMapping);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={readingNegativeMarking}
                                    onChange={(e) => setReadingNegativeMarking(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-[#253154]">Enable negative marking</span>
                            </label>
                        </div>

                        {/* Listening */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold text-[#253154]">Listening</h3>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-600">Total Questions:</label>
                                    <input
                                        type="number"
                                        value={listeningTotalQuestions}
                                        onChange={(e) => setListeningTotalQuestions(parseInt(e.target.value))}
                                        className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Correct Answers</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Band</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {listeningMapping.map((mapping, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={mapping.range}
                                                        onChange={(e) => {
                                                            const newMapping = [...listeningMapping];
                                                            newMapping[idx].range = e.target.value;
                                                            setListeningMapping(newMapping);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={mapping.band}
                                                        onChange={(e) => {
                                                            const newMapping = [...listeningMapping];
                                                            newMapping[idx].band = e.target.value;
                                                            setListeningMapping(newMapping);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={listeningNegativeMarking}
                                    onChange={(e) => setListeningNegativeMarking(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-[#253154]">Enable negative marking</span>
                            </label>
                        </div>
                    </div>

                    {/* Preview Example */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-xs font-semibold text-blue-900 mb-2">Preview Example</p>
                        <p className="text-sm text-blue-800">
                            If student gets <strong>32 correct answers</strong> in Reading → Band <strong>7.0</strong>
                        </p>
                    </div>
                </CollapsibleSection>

                {/* 2. WRITING SCORING */}
                <CollapsibleSection
                    title="Writing Scoring Settings"
                    subtitle="AI evaluation criteria and rules"
                    icon={<FileText size={20} className="text-purple-600" />}
                    expanded={expandedSections.includes('writing')}
                    onToggle={() => toggleSection('writing')}
                >
                    <div className="space-y-8">
                        {/* Criteria Weights */}
                        <div>
                            <h3 className="text-base font-semibold text-[#253154] mb-4">Criteria Weights</h3>
                            <div className="space-y-5">
                                {Object.entries(writingWeights).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-[#253154] capitalize">
                                                {key === 'taskResponse' ? 'Task Response' : key}
                                            </label>
                                            <span className={`text-sm font-bold ${isWritingWeightValid ? 'text-purple-600' : 'text-red-600'}`}>
                                                {value}%
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={value}
                                            onChange={(e) => handleWritingWeightChange(key, parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className={`mt-4 p-4 rounded-xl border-2 ${isWritingWeightValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-semibold ${isWritingWeightValid ? 'text-green-900' : 'text-red-900'}`}>
                                        Total Weight: {writingTotalWeight}%
                                    </span>
                                    {isWritingWeightValid ? (
                                        <CheckCircle size={20} className="text-green-600" />
                                    ) : (
                                        <AlertCircle size={20} className="text-red-600" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Strictness Level */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-base font-semibold text-[#253154]">Strictness Level</h3>
                                <TooltipHelper text="Controls how strictly the AI evaluates writing quality" />
                            </div>
                            <select
                                value={writingStrictness}
                                onChange={(e) => setWritingStrictness(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="lenient">Lenient - More forgiving, higher scores</option>
                                <option value="standard">Standard - IELTS-like evaluation</option>
                                <option value="strict">Strict - Very critical, lower scores</option>
                            </select>
                        </div>

                        {/* Basic Penalty Rules */}
                        <div>
                            <h3 className="text-base font-semibold text-[#253154] mb-4">Basic Penalty Rules</h3>
                            <div className="space-y-6">
                                {/* Word Count Penalty */}
                                <div className="border border-gray-200 rounded-xl p-5">
                                    <label className="flex items-center gap-2 cursor-pointer mb-4">
                                        <input
                                            type="checkbox"
                                            checked={applyWordCountPenalty}
                                            onChange={(e) => setApplyWordCountPenalty(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="text-sm font-medium text-[#253154]">Apply word count penalty</span>
                                    </label>

                                    {applyWordCountPenalty && (
                                        <div className="grid grid-cols-2 gap-4 pl-6">
                                            <div>
                                                <label className="text-xs text-gray-600 block mb-2">Minimum word count</label>
                                                <input
                                                    type="number"
                                                    value={minWordCount}
                                                    onChange={(e) => setMinWordCount(parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600 block mb-2">Penalty band</label>
                                                <select
                                                    value={wordCountPenalty}
                                                    onChange={(e) => setWordCountPenalty(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                >
                                                    <option value="-0.5">-0.5 band</option>
                                                    <option value="-1.0">-1.0 band</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Off-Topic Detection */}
                                <div className="border border-gray-200 rounded-xl p-5">
                                    <label className="flex items-center gap-2 cursor-pointer mb-4">
                                        <input
                                            type="checkbox"
                                            checked={enableOffTopicDetection}
                                            onChange={(e) => setEnableOffTopicDetection(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="text-sm font-medium text-[#253154]">Enable off-topic detection</span>
                                    </label>

                                    {enableOffTopicDetection && (
                                        <div className="pl-6">
                                            <label className="text-xs text-gray-600 block mb-2">Sensitivity</label>
                                            <div className="flex gap-2">
                                                {['low', 'medium', 'high'].map((level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setOffTopicSensitivity(level)}
                                                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${offTopicSensitivity === level
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* 3. SPEAKING SCORING */}
                <CollapsibleSection
                    title="Speaking Scoring Settings"
                    subtitle="AI evaluation criteria and timing rules"
                    icon={<Volume2 size={20} className="text-green-600" />}
                    expanded={expandedSections.includes('speaking')}
                    onToggle={() => toggleSection('speaking')}
                >
                    <div className="space-y-8">
                        {/* Criteria Weights */}
                        <div>
                            <h3 className="text-base font-semibold text-[#253154] mb-4">Criteria Weights</h3>
                            <div className="space-y-5">
                                {Object.entries(speakingWeights).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-[#253154] capitalize">{key}</label>
                                            <span className={`text-sm font-bold ${isSpeakingWeightValid ? 'text-green-600' : 'text-red-600'}`}>
                                                {value}%
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={value}
                                            onChange={(e) => handleSpeakingWeightChange(key, parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className={`mt-4 p-4 rounded-xl border-2 ${isSpeakingWeightValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-semibold ${isSpeakingWeightValid ? 'text-green-900' : 'text-red-900'}`}>
                                        Total Weight: {speakingTotalWeight}%
                                    </span>
                                    {isSpeakingWeightValid ? (
                                        <CheckCircle size={20} className="text-green-600" />
                                    ) : (
                                        <AlertCircle size={20} className="text-red-600" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Timing Rules */}
                        <div>
                            <h3 className="text-base font-semibold text-[#253154] mb-4">Timing Rules</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs text-gray-600 block mb-2">Minimum duration (sec)</label>
                                    <input
                                        type="number"
                                        value={minSpeakingDuration}
                                        onChange={(e) => setMinSpeakingDuration(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-2">Ideal range min (sec)</label>
                                    <input
                                        type="number"
                                        value={idealRangeMin}
                                        onChange={(e) => setIdealRangeMin(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-2">Ideal range max (sec)</label>
                                    <input
                                        type="number"
                                        value={idealRangeMax}
                                        onChange={(e) => setIdealRangeMax(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer mt-4">
                                <input
                                    type="checkbox"
                                    checked={applyDurationPenalty}
                                    onChange={(e) => setApplyDurationPenalty(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm text-[#253154]">Apply penalty if too short</span>
                            </label>
                        </div>

                        {/* Filler Sensitivity */}
                        <div>
                            <h3 className="text-base font-semibold text-[#253154] mb-4">Filler Word Sensitivity</h3>
                            <div className="flex gap-3">
                                {['low', 'medium', 'high'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setFillerSensitivity(level)}
                                        className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium capitalize transition-colors ${fillerSensitivity === level
                                            ? 'bg-green-600 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                                Controls how strictly the AI counts filler words like &quot;um&quot;, &quot;uh&quot;, &quot;like&quot;
                            </p>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* 4. AI MODEL & SAFETY CONTROLS */}
                <CollapsibleSection
                    title="AI Model & Safety Controls"
                    subtitle="Technical configuration"
                    icon={<Cpu size={20} className="text-indigo-600" />}
                    expanded={expandedSections.includes('ai-model')}
                    onToggle={() => toggleSection('ai-model')}
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-[#253154] block mb-2">Writing model</label>
                                <select
                                    value={writingModel}
                                    onChange={(e) => setWritingModel(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="gpt-4-turbo">GPT-4 Turbo (Recommended)</option>
                                    <option value="gpt-4">GPT-4</option>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[#253154] block mb-2">Speech transcription model</label>
                                <select
                                    value={speechModel}
                                    onChange={(e) => setSpeechModel(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="whisper-1">Whisper v1 (Recommended)</option>
                                    <option value="whisper-large">Whisper Large</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm font-medium text-[#253154] block mb-2">Retry attempts</label>
                                <input
                                    type="number"
                                    value={retryAttempts}
                                    onChange={(e) => setRetryAttempts(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[#253154] block mb-2">Timeout (seconds)</label>
                                <input
                                    type="number"
                                    value={timeoutDuration}
                                    onChange={(e) => setTimeoutDuration(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-[#253154] block mb-2">Confidence threshold (%)</label>
                                <input
                                    type="number"
                                    value={confidenceThreshold}
                                    onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Info size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-indigo-900">Technical Note</p>
                                    <p className="text-xs text-indigo-700 mt-1">
                                        These settings control AI model behavior and reliability. Changes may affect evaluation speed and accuracy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>
            </div>
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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-10">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
    </div>
);
