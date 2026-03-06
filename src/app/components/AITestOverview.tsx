'use client';

/**
 * AI TEST ASSISTANT - OVERVIEW (ENTERPRISE MONITORING DASHBOARD)
 * 
 * STRUCTURE:
 * - Page Header
 * - Global Filters Row
 * - Metrics Grid (Usage Stats + Evaluation Health)
 * - Charts Section (Sessions, Score, Skills, Time Distribution)
 * - Mock Test Insights
 * - Feedback Summary
 * - System Alerts Panel
 * - System Alerts Panel
 */

import React, { useState } from 'react';
import {
    Download,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Users,
    Clock,
    XCircle,
    CheckCircle2,
    MessageSquare,
    Target,
    Activity,
    FileText,
    Filter,
    RefreshCw,
    ChevronDown,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Headphones,
    Mic,
    BookOpen,
    BarChart3,
    AlertCircle,
    Info,
    Zap,
    Eye,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { CustomSelect } from './common/CustomSelect';

interface AITestOverviewProps {
    onNavigate?: (page: string, filterType?: string) => void;
}

export const AITestOverview: React.FC<AITestOverviewProps> = ({ onNavigate }) => {
    const [dateRange, setDateRange] = useState('30d');
    const [examType, setExamType] = useState('all');
    const [skill, setSkill] = useState('all');
    const [planMode, setPlanMode] = useState('all');
    const [status, setStatus] = useState('all');

    // Mock Data - Usage Stats
    const usageStats = {
        totalSessions: 4238,
        todaySessions: 156,
        weeklyChange: 12,
        activeStudents: 1847,
        dailyActive: 423,
        completionRate: 73.4,
        startedSessions: 4238,
        finishedSessions: 3110,
        dropOffRate: 26.6,
        dropOffLocation: 'Writing Task 2',
    };

    // Mock Data - Evaluation Health
    const evaluationHealth = {
        aiSuccessRate: 96.8,
        speakingTranscriptionFailures: 34,
        writingEvaluationFailures: 12,
        avgResponseTime: 2.4,
    };

    // Mock Data - Mock Test Insights
    const mockTestInsights = {
        completionTrend: [65, 68, 72, 75, 78, 81, 84],
        avgScore: 6.5,
        examReadyPercent: 42,
        belowTargetPercent: 28,
        avgConfidenceScore: 7.2,
    };

    // Mock Data - Feedback
    const feedbackData = {
        helpful: 1847,
        notHelpful: 234,
        ratings: {
            five: 856,
            four: 645,
            three: 312,
            two: 145,
            one: 89,
        },
    };

    const commonComplaints = [
        { text: 'Scoring too strict', count: 87, severity: 'high' },
        { text: 'Audio not playing', count: 56, severity: 'critical' },
        { text: 'Unclear feedback', count: 43, severity: 'medium' },
        { text: 'Speaking transcription error', count: 34, severity: 'high' },
    ];

    // Mock Data - System Alerts
    const systemAlerts = [
        {
            id: 'alert-1',
            type: 'Speaking transcription failures',
            severity: 'critical',
            count: 34,
            timestamp: '2 hours ago',
            filterType: 'transcription',
        },
        {
            id: 'alert-2',
            type: 'Writing evaluation timeout',
            severity: 'warning',
            count: 12,
            timestamp: '4 hours ago',
            filterType: 'evaluation-failure',
        },
        {
            id: 'alert-3',
            type: 'Listening audio playback issues',
            severity: 'warning',
            count: 8,
            timestamp: '6 hours ago',
            filterType: 'audio-error',
        },
        {
            id: 'alert-4',
            type: 'High response time warning',
            severity: 'info',
            count: 5,
            timestamp: '1 day ago',
            filterType: 'performance-warning',
        },
    ];

    // Handle alert navigation
    const handleViewAlertDetails = (filterType: string) => {
        if (onNavigate) {
            onNavigate('ai-test-reports', filterType);
        }
    };

    // Chart data
    const sessionsChartData = [
        { day: 'Mon', sessions: 520 },
        { day: 'Tue', sessions: 645 },
        { day: 'Wed', sessions: 590 },
        { day: 'Thu', sessions: 720 },
        { day: 'Fri', sessions: 810 },
        { day: 'Sat', sessions: 490 },
        { day: 'Sun', sessions: 463 },
    ];

    const scoreChartData = [
        { month: 'Jan', score: 5.8 },
        { month: 'Feb', score: 6.1 },
        { month: 'Mar', score: 6.3 },
        { month: 'Apr', score: 6.5 },
    ];

    const skillsData = [
        { skill: 'Reading', value: 7.2, color: 'bg-blue-500' },
        { skill: 'Writing', value: 5.8, color: 'bg-purple-500' },
        { skill: 'Speaking', value: 6.4, color: 'bg-green-500' },
        { skill: 'Listening', value: 6.9, color: 'bg-amber-500' },
    ];

    const practiceTimeData = [
        { skill: 'Reading', minutes: 2340 },
        { skill: 'Writing', minutes: 3120 },
        { skill: 'Speaking', minutes: 1890 },
        { skill: 'Listening', minutes: 2456 },
    ];

    const getSeverityBadge = (severity: string) => {
        const configs = {
            critical: { label: 'Critical', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
            warning: { label: 'Warning', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
            info: { label: 'Info', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
            high: { label: 'High', bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200' },
            medium: { label: 'Medium', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
        };
        const config = configs[severity as keyof typeof configs];
        return (
            <div className={`inline-flex px-3 py-1 rounded-lg text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
                {config.label}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#faf7ff] via-white to-[#f8faff]">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-[1920px] mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#253154]">Overview</h1>
                            <p className="text-sm text-gray-600 mt-1">Monitor practice activity, scoring health, and student performance trends.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Date Range Filter */}
                            <CustomSelect
                                value={dateRange}
                                onChange={setDateRange}
                                options={[
                                    { value: '7d', label: 'Last 7 days' },
                                    { value: '30d', label: 'Last 30 days' },
                                    { value: '90d', label: 'Last 90 days' },
                                    { value: 'custom', label: 'Custom' },
                                ]}
                                className="w-40"
                            />

                            {/* Export */}
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-[#253154] rounded-xl text-sm font-medium transition-colors shadow-sm">
                                <Download size={16} />
                                <span>Export</span>
                            </button>

                            {/* Refresh */}
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-[#253154] rounded-xl text-sm font-medium transition-colors shadow-sm">
                                <RefreshCw size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Filter Row */}
            <div className="max-w-[1920px] mx-auto px-8 py-6">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter size={20} className="text-[#253154]" />
                        <div className="flex-1 grid grid-cols-4 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Exam Type</label>
                                <CustomSelect
                                    value={examType}
                                    onChange={setExamType}
                                    options={[
                                        { value: 'all', label: 'All Exams' },
                                        { value: 'ielts-academic', label: 'IELTS Academic' },
                                        { value: 'ielts-general', label: 'IELTS General' },
                                        { value: 'toefl', label: 'TOEFL' },
                                        { value: 'visa', label: 'Visa' },
                                    ]}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Skill</label>
                                <CustomSelect
                                    value={skill}
                                    onChange={setSkill}
                                    options={[
                                        { value: 'all', label: 'All Skills' },
                                        { value: 'reading', label: 'Reading' },
                                        { value: 'writing', label: 'Writing' },
                                        { value: 'speaking', label: 'Speaking' },
                                        { value: 'listening', label: 'Listening' },
                                        { value: 'mock', label: 'Mock' },
                                    ]}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Plan Mode</label>
                                <CustomSelect
                                    value={planMode}
                                    onChange={setPlanMode}
                                    options={[
                                        { value: 'all', label: 'All Plans' },
                                        { value: 'light', label: 'Light' },
                                        { value: 'normal', label: 'Normal' },
                                        { value: 'intense', label: 'Intense' },
                                    ]}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Status</label>
                                <CustomSelect
                                    value={status}
                                    onChange={setStatus}
                                    options={[
                                        { value: 'all', label: 'All Status' },
                                        { value: 'active', label: 'Active' },
                                        { value: 'completed', label: 'Completed' },
                                        { value: 'dropped', label: 'Dropped' },
                                    ]}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid - Row 1: Usage Stats */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <MetricCard
                        title="Total Practice Sessions"
                        value={usageStats.totalSessions.toLocaleString()}
                        subtitle={`${usageStats.todaySessions} today / ${usageStats.weeklyChange > 0 ? '+' : ''}${usageStats.weeklyChange}% vs last week`}
                        icon={Activity}
                        bgClass="bg-blue-50"
                        colorClass="text-blue-600"
                        tooltip="Total number of practice sessions across all skills"
                        trend="up"
                        trendValue={`+${usageStats.weeklyChange}%`}
                    />

                    <MetricCard
                        title="Active Students"
                        value={usageStats.activeStudents.toLocaleString()}
                        subtitle={`${usageStats.dailyActive} daily active`}
                        icon={Users}
                        bgClass="bg-green-50"
                        colorClass="text-green-600"
                        tooltip="Number of students actively practicing"
                    />

                    <MetricCard
                        title="Completion Rate"
                        value={`${usageStats.completionRate}%`}
                        subtitle={`${usageStats.finishedSessions} / ${usageStats.startedSessions} finished`}
                        icon={CheckCircle2}
                        bgClass="bg-purple-50"
                        colorClass="text-purple-600"
                        tooltip="Percentage of sessions completed successfully"
                    />

                    <MetricCard
                        title="Drop-Off Rate"
                        value={`${usageStats.dropOffRate}%`}
                        subtitle={`Most common: ${usageStats.dropOffLocation}`}
                        icon={XCircle}
                        bgClass="bg-red-50"
                        colorClass="text-red-600"
                        tooltip="Percentage of sessions abandoned before completion"
                        trend="down"
                        trendValue={`${usageStats.dropOffRate}%`}
                    />
                </div>

                {/* Metrics Grid - Row 2: Evaluation Health */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <MetricCard
                        title="AI Evaluation Success"
                        value={`${evaluationHealth.aiSuccessRate}%`}
                        subtitle="Writing + Speaking grading"
                        icon={Target}
                        bgClass="bg-green-50"
                        colorClass="text-green-600"
                        tooltip="Success rate of AI-powered evaluation system"
                        trend="up"
                        trendValue={`${evaluationHealth.aiSuccessRate}%`}
                    />

                    <MetricCard
                        title="Speaking Transcription Failures"
                        value={evaluationHealth.speakingTranscriptionFailures.toString()}
                        subtitle="Requires manual review"
                        icon={Mic}
                        bgClass="bg-amber-50"
                        colorClass="text-amber-600"
                        tooltip="Number of speaking sessions with transcription errors"
                        trend="down"
                        isWarning={evaluationHealth.speakingTranscriptionFailures > 30}
                    />

                    <MetricCard
                        title="Writing Evaluation Failures"
                        value={evaluationHealth.writingEvaluationFailures.toString()}
                        subtitle="System timeout or errors"
                        icon={FileText}
                        bgClass="bg-orange-50"
                        colorClass="text-orange-600"
                        tooltip="Number of writing tasks that failed evaluation"
                    />

                    <MetricCard
                        title="Avg Evaluation Response Time"
                        value={`${evaluationHealth.avgResponseTime}s`}
                        subtitle="Target: <3s"
                        icon={Clock}
                        bgClass="bg-blue-50"
                        colorClass="text-blue-600"
                        tooltip="Average time to evaluate submissions"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Sessions Trend Chart */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#253154] mb-6">Sessions Trend</h3>
                        <div className="space-y-4">
                            {sessionsChartData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-600 w-12">{item.day}</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all"
                                            style={{ width: `${(item.sessions / 850) * 100}%` }}
                                        >
                                            <span className="text-xs font-semibold text-white">{item.sessions}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Score Trend Chart */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#253154] mb-6">Score Trend</h3>
                        <div className="space-y-4">
                            {scoreChartData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-600 w-12">{item.month}</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-3 transition-all"
                                            style={{ width: `${(item.score / 9) * 100}%` }}
                                        >
                                            <span className="text-xs font-semibold text-white">{item.score}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weakest Skill Trend */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#253154] mb-6">Current Skill Scores</h3>
                        <div className="space-y-4">
                            {skillsData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-600 w-20">{item.skill}</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                        <div
                                            className={`${item.color} h-full rounded-full flex items-center justify-end pr-3 transition-all`}
                                            style={{ width: `${(item.value / 9) * 100}%` }}
                                        >
                                            <span className="text-xs font-semibold text-white">{item.value}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Practice Time Distribution */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#253154] mb-6">Practice Time Distribution</h3>
                        <div className="space-y-4">
                            {practiceTimeData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-600 w-20">{item.skill}</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-gray-400 to-gray-500 h-full rounded-full flex items-center justify-end pr-3 transition-all"
                                            style={{ width: `${(item.minutes / 3500) * 100}%` }}
                                        >
                                            <span className="text-xs font-semibold text-white">{item.minutes} min</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mock Test Insights Section */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Mock Completion Trend */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#253154] mb-6">Mock Test Completion Trend</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Completion Rate</span>
                                <span className="text-2xl font-bold text-[#253154]">84%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {mockTestInsights.completionTrend.map((value, idx) => (
                                    <div key={idx} className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                                        <div
                                            className="bg-gradient-to-t from-green-500 to-green-400"
                                            style={{ height: `${value}px` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Avg Mock Score</span>
                                    <span className="text-lg font-bold text-[#253154]">{mockTestInsights.avgScore}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exam Readiness Snapshot */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#253154] mb-6">Exam Readiness Snapshot</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-green-700">Exam Ready</span>
                                    <CheckCircle2 size={20} className="text-green-600" />
                                </div>
                                <p className="text-3xl font-bold text-green-700">{mockTestInsights.examReadyPercent}%</p>
                                <p className="text-xs text-green-600 mt-1">Students scoring 7.0+</p>
                            </div>

                            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-red-700">Below Target</span>
                                    <AlertTriangle size={20} className="text-red-600" />
                                </div>
                                <p className="text-3xl font-bold text-red-700">{mockTestInsights.belowTargetPercent}%</p>
                                <p className="text-xs text-red-600 mt-1">Students scoring below 6.0</p>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Avg Confidence Score</span>
                                    <span className="text-lg font-bold text-[#253154]">{mockTestInsights.avgConfidenceScore}/10</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feedback Summary Section */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Left: Feedback Distribution */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#253154] mb-6">Feedback Summary</h3>

                        {/* Helpful vs Not Helpful */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-green-600" />
                                    <span className="text-sm font-medium text-gray-700">Helpful</span>
                                </div>
                                <span className="text-lg font-bold text-[#253154]">{feedbackData.helpful}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <XCircle size={18} className="text-red-600" />
                                    <span className="text-sm font-medium text-gray-700">Not Helpful</span>
                                </div>
                                <span className="text-lg font-bold text-[#253154]">{feedbackData.notHelpful}</span>
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="pt-6 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-[#253154] mb-4">Rating Distribution</h4>
                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count = feedbackData.ratings[`${['one', 'two', 'three', 'four', 'five'][rating - 1]}` as keyof typeof feedbackData.ratings];
                                    const total = Object.values(feedbackData.ratings).reduce((a, b) => a + b, 0);
                                    const percentage = (count / total) * 100;
                                    return (
                                        <div key={rating} className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-600 w-8">{rating} ⭐</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 w-12 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Common Complaints */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#253154] mb-6">Common Complaints</h3>
                        <div className="space-y-3">
                            {commonComplaints.map((complaint, idx) => (
                                <button
                                    key={idx}
                                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left border border-gray-200"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#253154]">{complaint.text}</span>
                                        {getSeverityBadge(complaint.severity)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">{complaint.count} reports</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-purple-600 hover:underline">View details →</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Alerts Panel */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#253154] flex items-center gap-2">
                            <AlertCircle size={20} />
                            System Alerts
                        </h3>
                        <button className="text-sm text-purple-600 hover:underline font-medium">View All</button>
                    </div>

                    <div className="space-y-3">
                        {systemAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    {alert.severity === 'critical' && <AlertTriangle size={20} className="text-red-600" />}
                                    {alert.severity === 'warning' && <AlertCircle size={20} className="text-amber-600" />}
                                    {alert.severity === 'info' && <Info size={20} className="text-blue-600" />}

                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[#253154]">{alert.type}</p>
                                        <p className="text-xs text-gray-500 mt-1">{alert.count} occurrences • {alert.timestamp}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {getSeverityBadge(alert.severity)}
                                    <button
                                        className="text-sm text-purple-600 hover:underline font-medium flex items-center gap-1"
                                        onClick={() => handleViewAlertDetails(alert.filterType)}
                                    >
                                        View Details
                                        <Eye size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// MetricCard Component (Reused from existing components)
interface MetricCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ElementType;
    bgClass: string;
    colorClass: string;
    tooltip: string;
    trend?: 'up' | 'down';
    trendValue?: string;
    isWarning?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    bgClass,
    colorClass,
    tooltip,
    trend,
    trendValue,
    isWarning
}) => {
    return (
        <div className={`bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between h-[130px] relative overflow-hidden group transition-all duration-300 ease-in-out border-2 ${isWarning ? 'border-red-200' : 'border-transparent'} hover:shadow-lg hover:border-purple-200`}>
            <div className="flex items-center justify-between">
                <span className="text-[#253154] font-medium text-[15px]">{title}</span>
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center cursor-help hover:text-[#0e042f] hover:border-[#0e042f] transition-colors flex-shrink-0"
                            >
                                i
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#0e042f] text-white rounded-xl text-xs px-3 py-2">
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-end gap-3 mt-2">
                <div className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                    <div className="flex baseline gap-2">
                        <p className="text-[28px] font-bold text-[#253154] leading-none">{value}</p>
                        {trend && trendValue && (
                            <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                <span className="text-xs font-semibold">{trendValue}</span>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                </div>
            </div>

            <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <Icon size={80} />
            </div>
        </div>
    );
};
