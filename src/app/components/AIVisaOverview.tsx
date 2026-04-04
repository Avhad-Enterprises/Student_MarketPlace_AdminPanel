/**
 * AI VISA ASSISTANT - OVERVIEW (ENTERPRISE MONITORING DASHBOARD)
 * 
 * 4-LAYER ARCHITECTURE:
 * Layer 1: Executive Summary (8 KPI Cards)
 * Layer 2: Usage & Adoption Analytics
 * Layer 3: Flow & Knowledge Performance
 * Layer 4: Quality & Incident Management
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
    Globe,
    Star,
    Eye,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Database,
    FileText,
    ChevronDown,
    ChevronUp,
    Filter,
    UserX,
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
import { PermissionGuard } from './common/PermissionGuard';

export const AIVisaOverview: React.FC = () => {
    const [dateRange, setDateRange] = useState('today');
    const [chartToggle, setChartToggle] = useState<'conversations' | 'users'>('conversations');
    const [systemHealthCollapsed, setSystemHealthCollapsed] = useState(false);

    // Mock data - Layer 1: Executive Summary
    const executiveKPIs = {
        totalConversations: 1247,
        activeUsers: 856,
        successRate: 94.2,
        avgResponseTime: 340,
        failedRequests: 23,
        dropOffRate: 18.5,
        escalatedToHuman: 42,
        lowConfidenceCount: 67,
    };

    // Layer 2: Usage & Adoption
    const featureUsage = [
        { name: 'University Search', value: 342, percentage: 27.4 },
        { name: 'SOP Review', value: 278, percentage: 22.3 },
        { name: 'Visa Requirements', value: 225, percentage: 18.0 },
        { name: 'Eligibility', value: 198, percentage: 15.9 },
        { name: 'Scholarship', value: 156, percentage: 12.5 },
        { name: 'Timeline', value: 48, percentage: 3.9 },
    ];

    const countryUsage = [
        { country: 'United States', count: 425, percentage: 34.1, flag: '🇺🇸' },
        { country: 'United Kingdom', count: 312, percentage: 25.0, flag: '🇬🇧' },
        { country: 'Canada', count: 287, percentage: 23.0, flag: '🇨🇦' },
        { country: 'Australia', count: 198, percentage: 15.9, flag: '🇦🇺' },
        { country: 'Germany', count: 134, percentage: 10.7, flag: '🇩🇪' },
    ];

    const completionStats = {
        started: 1247,
        completed: 1016,
        abandoned: 231,
        completionRate: 81.5,
    };

    // Layer 3: Flow & Knowledge Performance
    const flowPerformance = [
        {
            name: 'University Search',
            started: 520,
            completed: 380,
            completionRate: 73.1,
            dropOffRate: 26.9,
            avgTime: '3m 12s',
            status: 'good',
        },
        {
            name: 'SOP Review',
            started: 340,
            completed: 298,
            completionRate: 87.6,
            dropOffRate: 12.4,
            avgTime: '5m 45s',
            status: 'excellent',
        },
        {
            name: 'Visa Requirements',
            started: 280,
            completed: 195,
            completionRate: 69.6,
            dropOffRate: 30.4,
            avgTime: '2m 38s',
            status: 'warning',
        },
        {
            name: 'Eligibility Check',
            started: 230,
            completed: 198,
            completionRate: 86.1,
            dropOffRate: 13.9,
            avgTime: '4m 20s',
            status: 'good',
        },
    ];

    const knowledgeBaseHealth = {
        totalArticles: 1248,
        draftPending: 23,
        updatedThisMonth: 156,
        countriesCovered: 45,
        outdatedWarning: true,
    };

    const aiRuntimeInfo = {
        modelVersion: 'GPT-4-Turbo (v1.2.4)',
        environment: 'Production',
        lastDeployment: '2024-02-10 14:30 UTC',
        knowledgeBaseVersion: 'KB-v2.8.1',
        lastSync: '2 hours ago',
    };

    // Layer 4: Quality & Incident Management
    const feedbackData = {
        positive: 78,
        neutral: 15,
        negative: 7,
        trend: 'up',
    };

    const confidenceDistribution = [
        { range: '0-40%', count: 23, color: 'bg-red-600' },
        { range: '40-60%', count: 44, color: 'bg-amber-600' },
        { range: '60-80%', count: 182, color: 'bg-blue-600' },
        { range: '80-100%', count: 998, color: 'bg-green-600' },
    ];

    const lowConfidenceResponses = [
        {
            student: 'Sarah Ahmed',
            feature: 'Visa Requirements',
            confidence: 45,
            rating: 2,
            date: '2024-02-15',
        },
        {
            student: 'John Smith',
            feature: 'SOP Review',
            confidence: 52,
            rating: 3,
            date: '2024-02-14',
        },
        {
            student: 'Maria Garcia',
            feature: 'Eligibility',
            confidence: 38,
            rating: 1,
            date: '2024-02-14',
        },
    ];

    const systemAlerts = [
        {
            title: 'Knowledge base content outdated',
            severity: 'high',
            timestamp: '2024-02-14 09:15',
            affectedModule: 'Visa Requirements',
        },
        {
            title: 'High response time detected',
            severity: 'medium',
            timestamp: '2024-02-15 14:30',
            affectedModule: 'University Search',
        },
    ];

    const topConversations = [
        {
            student: 'Alex Johnson',
            topic: 'MS in Computer Science - USA Universities',
            feature: 'University Search',
            rating: 5,
            date: '2024-02-15',
        },
        {
            student: 'Priya Sharma',
            topic: 'SOP review for UK universities',
            feature: 'SOP Review',
            rating: 4,
            date: '2024-02-15',
        },
        {
            student: 'Mohammed Ali',
            topic: 'Visa requirements for Canada',
            feature: 'Visa Requirements',
            rating: 5,
            date: '2024-02-14',
        },
        {
            student: 'Emma Wilson',
            topic: 'Scholarship opportunities in Germany',
            feature: 'Scholarship',
            rating: 4,
            date: '2024-02-14',
        },
        {
            student: 'Li Wei',
            topic: 'Eligibility check for Australian universities',
            feature: 'Eligibility',
            rating: 5,
            date: '2024-02-14',
        },
    ];

    // Helper functions
    const getStatusColor = (value: number, type: 'success' | 'dropoff' | 'time') => {
        if (type === 'success') {
            if (value >= 90) return { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-600' };
            if (value >= 80) return { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-600' };
            return { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-600' };
        }
        if (type === 'dropoff') {
            if (value < 25) return { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-600' };
            if (value < 40) return { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-600' };
            return { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-600' };
        }
        // time
        if (value < 500) return { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-600' };
        if (value < 1000) return { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-600' };
        return { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-600' };
    };

    const getFlowStatusIndicator = (status: string) => {
        if (status === 'excellent') return '🟢';
        if (status === 'good') return '🟢';
        if (status === 'warning') return '🟡';
        return '🔴';
    };

    const successRateColor = getStatusColor(executiveKPIs.successRate, 'success');
    const dropOffColor = getStatusColor(executiveKPIs.dropOffRate, 'dropoff');
    const responseTimeColor = getStatusColor(executiveKPIs.avgResponseTime, 'time');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-[1400px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[#253154]">AI Visa Assistant – Overview</h1>
                                <p className="text-sm text-gray-600 mt-1">Enterprise monitoring dashboard</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                {aiRuntimeInfo.environment}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Date Range Filter */}
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="w-[140px]">
                                    <Calendar size={16} className="mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="7days">7 Days</SelectItem>
                                    <SelectItem value="30days">30 Days</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Export Report */}
                            <PermissionGuard module="ai-visa" action="export">
                                <Button variant="outline">
                                    <Download size={16} className="mr-2" />
                                    Export Report
                                </Button>
                            </PermissionGuard>

                            {/* View Error Logs */}
                            <PermissionGuard module="ai-visa" action="view">
                                <Button variant="outline" className="text-red-600 hover:text-red-700">
                                    <AlertTriangle size={16} className="mr-2" />
                                    View Error Logs
                                </Button>
                            </PermissionGuard>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">
                {/* ========== LAYER 1: EXECUTIVE SUMMARY ========== */}
                <div>
                    <h2 className="text-lg font-bold text-[#253154] mb-4">Executive Summary</h2>

                    {/* Row 1: Usage Health */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Total Conversations */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600 uppercase">Total Conversations</span>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                            <p className="text-3xl font-bold text-[#253154]">{executiveKPIs.totalConversations.toLocaleString()}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <ArrowUpRight size={14} className="text-green-600" />
                                <span className="text-xs text-green-600 font-semibold">+12% from yesterday</span>
                            </div>
                        </div>

                        {/* Active AI Users */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600 uppercase">Active AI Users</span>
                                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            </div>
                            <p className="text-3xl font-bold text-[#253154]">{executiveKPIs.activeUsers.toLocaleString()}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <ArrowUpRight size={14} className="text-green-600" />
                                <span className="text-xs text-green-600 font-semibold">+8% from yesterday</span>
                            </div>
                        </div>

                        {/* Response Success Rate */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600 uppercase">Response Success Rate</span>
                                <div className={`w-2 h-2 ${successRateColor.dot} rounded-full`}></div>
                            </div>
                            <p className={`text-3xl font-bold ${successRateColor.text}`}>{executiveKPIs.successRate}%</p>
                            <div className="flex items-center gap-1 mt-1">
                                <ArrowUpRight size={14} className="text-green-600" />
                                <span className="text-xs text-green-600 font-semibold">+2.1% from yesterday</span>
                            </div>
                        </div>

                        {/* Avg Response Time */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600 uppercase">Avg Response Time</span>
                                <div className={`w-2 h-2 ${responseTimeColor.dot} rounded-full`}></div>
                            </div>
                            <p className={`text-3xl font-bold ${responseTimeColor.text}`}>{executiveKPIs.avgResponseTime}ms</p>
                            <div className="flex items-center gap-1 mt-1">
                                <ArrowDownRight size={14} className="text-green-600" />
                                <span className="text-xs text-green-600 font-semibold">-45ms improvement</span>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Risk Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Failed Requests */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600 uppercase">Failed Requests</span>
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            </div>
                            <p className="text-3xl font-bold text-red-600">{executiveKPIs.failedRequests}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <ArrowDownRight size={14} className="text-green-600" />
                                <span className="text-xs text-gray-600">1.8% of total</span>
                            </div>
                        </div>

                        {/* Drop-off Rate */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600 uppercase">Drop-off Rate</span>
                                <div className={`w-2 h-2 ${dropOffColor.dot} rounded-full`}></div>
                            </div>
                            <p className={`text-3xl font-bold ${dropOffColor.text}`}>{executiveKPIs.dropOffRate}%</p>
                            <div className="flex items-center gap-1 mt-1">
                                <ArrowDownRight size={14} className="text-green-600" />
                                <span className="text-xs text-gray-600">231 conversations</span>
                            </div>
                        </div>

                        {/* Escalated to Human */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600 uppercase">Escalated to Human</span>
                                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                            </div>
                            <p className="text-3xl font-bold text-amber-600">{executiveKPIs.escalatedToHuman}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <ArrowUpRight size={14} className="text-amber-600" />
                                <span className="text-xs text-gray-600">3.4% of total</span>
                            </div>
                        </div>

                        {/* Low Confidence Responses */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600 uppercase">Low Confidence Responses</span>
                                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                            </div>
                            <p className="text-3xl font-bold text-amber-600">{executiveKPIs.lowConfidenceCount}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <ArrowDownRight size={14} className="text-green-600" />
                                <span className="text-xs text-gray-600">5.4% of total</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== LAYER 2: USAGE & ADOPTION ANALYTICS ========== */}
                <div>
                    <h2 className="text-lg font-bold text-[#253154] mb-4">Usage & Adoption Analytics</h2>

                    {/* Row 1: Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        {/* Daily Conversation Trend */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-[#253154]">Daily Conversation Trend</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setChartToggle('conversations')}
                                        className={`px-3 py-1 text-xs font-semibold rounded ${chartToggle === 'conversations'
                                                ? 'bg-[#253154] text-white'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        Conversations
                                    </button>
                                    <button
                                        onClick={() => setChartToggle('users')}
                                        className={`px-3 py-1 text-xs font-semibold rounded ${chartToggle === 'users'
                                                ? 'bg-[#253154] text-white'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        Unique Users
                                    </button>
                                </div>
                            </div>
                            <div className="h-48 flex items-center justify-center border border-dashed border-gray-300 rounded">
                                <div className="text-center">
                                    <Activity size={32} className="text-gray-400 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500">Line chart: {chartToggle}</p>
                                    <p className="text-xs text-gray-400">Completion rate overlay</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature Usage Breakdown */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <h3 className="text-sm font-bold text-[#253154] mb-4">Feature Usage Breakdown</h3>
                            <div className="space-y-2.5">
                                {featureUsage.map((feature, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-700 font-medium">{feature.name}</span>
                                            <span className="text-xs font-bold text-[#253154]">{feature.value}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-[#253154] h-1.5 rounded-full transition-all"
                                                style={{ width: `${feature.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Country Usage & Completion */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Country-wise Usage */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <h3 className="text-sm font-bold text-[#253154] mb-4 flex items-center gap-2">
                                <Globe size={16} />
                                Country-wise Usage (Top 5)
                            </h3>
                            <div className="space-y-2.5">
                                {countryUsage.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{item.flag}</span>
                                                <span className="text-xs font-medium text-gray-700">{item.country}</span>
                                            </div>
                                            <span className="text-xs font-bold text-[#253154]">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-[#253154] h-1.5 rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Drop-off vs Completion */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <h3 className="text-sm font-bold text-[#253154] mb-4">Drop-off vs Completion</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                                    <span className="text-sm font-semibold text-gray-700">Started</span>
                                    <span className="text-lg font-bold text-[#253154]">{completionStats.started}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                                    <span className="text-sm font-semibold text-gray-700">Completed</span>
                                    <span className="text-lg font-bold text-green-600">{completionStats.completed}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                                    <span className="text-sm font-semibold text-gray-700">Abandoned</span>
                                    <span className="text-lg font-bold text-red-600">{completionStats.abandoned}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-700">Completion Rate</span>
                                        <span className="text-xl font-bold text-green-600">{completionStats.completionRate}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== LAYER 3: FLOW & KNOWLEDGE PERFORMANCE ========== */}
                <div>
                    <h2 className="text-lg font-bold text-[#253154] mb-4">Flow & Knowledge Performance</h2>

                    {/* Flow Performance Table */}
                    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
                        <h3 className="text-sm font-bold text-[#253154] mb-4 flex items-center gap-2">
                            <Activity size={16} />
                            Flow Performance
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Flow Name</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Started</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Completed</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Completion %</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Drop-off %</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Avg Time</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flowPerformance.map((flow, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-3 pr-4 text-gray-900 font-medium">{flow.name}</td>
                                            <td className="py-3 pr-4 text-gray-700">{flow.started}</td>
                                            <td className="py-3 pr-4 text-gray-700">{flow.completed}</td>
                                            <td className="py-3 pr-4">
                                                <span
                                                    className={`font-semibold ${flow.completionRate >= 80
                                                            ? 'text-green-600'
                                                            : flow.completionRate >= 70
                                                                ? 'text-amber-600'
                                                                : 'text-red-600'
                                                        }`}
                                                >
                                                    {flow.completionRate}%
                                                </span>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <span
                                                    className={`font-semibold ${flow.dropOffRate < 25
                                                            ? 'text-green-600'
                                                            : flow.dropOffRate < 40
                                                                ? 'text-amber-600'
                                                                : 'text-red-600'
                                                        }`}
                                                >
                                                    {flow.dropOffRate}%
                                                </span>
                                            </td>
                                            <td className="py-3 pr-4 text-gray-700">{flow.avgTime}</td>
                                            <td className="py-3">
                                                <span className="text-lg">{getFlowStatusIndicator(flow.status)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Knowledge Base & AI Runtime */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Knowledge Base Health */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg border border-gray-200 p-5">
                                <h3 className="text-sm font-bold text-[#253154] mb-4 flex items-center gap-2">
                                    <Database size={16} />
                                    Knowledge Base Health
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="p-3 bg-gray-50 rounded">
                                        <p className="text-xs text-gray-600 mb-1">Total Articles</p>
                                        <p className="text-xl font-bold text-[#253154]">{knowledgeBaseHealth.totalArticles}</p>
                                    </div>
                                    <div className="p-3 bg-amber-50 rounded">
                                        <p className="text-xs text-gray-600 mb-1">Draft Pending</p>
                                        <p className="text-xl font-bold text-amber-600">{knowledgeBaseHealth.draftPending}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded">
                                        <p className="text-xs text-gray-600 mb-1">Updated This Month</p>
                                        <p className="text-xl font-bold text-green-600">{knowledgeBaseHealth.updatedThisMonth}</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded">
                                        <p className="text-xs text-gray-600 mb-1">Countries Covered</p>
                                        <p className="text-xl font-bold text-blue-600">{knowledgeBaseHealth.countriesCovered}</p>
                                    </div>
                                </div>
                                {knowledgeBaseHealth.outdatedWarning && (
                                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2">
                                        <AlertTriangle size={16} className="text-amber-600 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-amber-900">Content Update Required</p>
                                            <p className="text-xs text-amber-700 mt-0.5">
                                                15 articles not updated in 30+ days
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* AI Runtime Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <h3 className="text-sm font-bold text-[#253154] mb-4 flex items-center gap-2">
                                <Zap size={16} />
                                AI Runtime Info
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-600 mb-0.5">Model Version</p>
                                    <p className="text-xs font-semibold text-gray-900">{aiRuntimeInfo.modelVersion}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-0.5">Environment</p>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                        {aiRuntimeInfo.environment}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-0.5">Last Deployment</p>
                                    <p className="text-xs font-semibold text-gray-900">{aiRuntimeInfo.lastDeployment}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-0.5">Knowledge Base</p>
                                    <p className="text-xs font-semibold text-gray-900">{aiRuntimeInfo.knowledgeBaseVersion}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-0.5">Last Sync</p>
                                    <p className="text-xs font-semibold text-gray-900">{aiRuntimeInfo.lastSync}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== LAYER 4: QUALITY & INCIDENT MANAGEMENT ========== */}
                <div>
                    <h2 className="text-lg font-bold text-[#253154] mb-4">Quality & Incident Management</h2>

                    {/* Row 1: Feedback & Confidence */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        {/* Feedback Summary */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-[#253154] flex items-center gap-2">
                                    <Star size={16} />
                                    Feedback Summary
                                </h3>
                                {feedbackData.trend === 'up' ? (
                                    <TrendingUp size={16} className="text-green-600" />
                                ) : (
                                    <TrendingDown size={16} className="text-red-600" />
                                )}
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-700">Positive</span>
                                    <span className="text-sm font-bold text-green-600">{feedbackData.positive}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-700">Neutral</span>
                                    <span className="text-sm font-bold text-amber-600">{feedbackData.neutral}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-700">Negative</span>
                                    <span className="text-sm font-bold text-red-600">{feedbackData.negative}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Confidence Distribution */}
                        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5">
                            <h3 className="text-sm font-bold text-[#253154] mb-4">Confidence Distribution</h3>
                            <div className="space-y-2.5">
                                {confidenceDistribution.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-700 font-medium">{item.range}</span>
                                            <span className="text-xs font-bold text-gray-900">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`${item.color} h-2 rounded-full transition-all`}
                                                style={{ width: `${(item.count / 1247) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Low Confidence Responses */}
                    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-[#253154] flex items-center gap-2">
                                <AlertTriangle size={16} />
                                Low Confidence Responses
                            </h3>
                            <Button variant="outline" size="sm">
                                <Filter size={14} className="mr-1" />
                                Confidence {'<'} 60%
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Student</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Feature</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Confidence</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Rating</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3 pr-4">Date</th>
                                        <th className="text-left text-xs font-bold text-gray-600 pb-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowConfidenceResponses.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-3 pr-4 text-gray-900">{item.student}</td>
                                            <td className="py-3 pr-4 text-gray-700">{item.feature}</td>
                                            <td className="py-3 pr-4">
                                                <span
                                                    className={`font-semibold ${item.confidence < 50 ? 'text-red-600' : 'text-amber-600'
                                                        }`}
                                                >
                                                    {item.confidence}%
                                                </span>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            className={i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 text-gray-600">{item.date}</td>
                                            <td className="py-3">
                                                <Button variant="ghost" size="sm" className="text-[#253154] h-7 px-2">
                                                    <Eye size={12} className="mr-1" />
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
