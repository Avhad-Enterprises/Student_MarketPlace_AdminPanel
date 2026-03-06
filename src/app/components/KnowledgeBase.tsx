'use client';

/**
 * CONTENT & KNOWLEDGE BASE
 * 
 * Structured Knowledge Management Console
 * - NOT a blog editor -
 * 
 * Features:
 * - Knowledge Dashboard with metrics & health alerts
 * - Collection-based organization (Visa, SOP, Scholarships, etc.)
 * - Article listing with filtering
 * - Enterprise content management
 */

import React, { useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    FileText,
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingUp,
    BarChart3,
    FolderOpen,
    Tag,
    Globe,
    Edit,
    Eye,
    MoreHorizontal,
    Calendar,
    RefreshCw,
    Download,
    Upload,
    AlertCircle,
    ChevronRight,
    ChevronDown,
    Sparkles,
    Target,
    Award,
    DollarSign,
    BookOpen,
    HelpCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface Article {
    id: string;
    title: string;
    collection: string;
    country: string;
    tags: string[];
    status: 'draft' | 'published';
    version: string;
    lastUpdated: string;
    usageCount?: number;
}

interface KnowledgeBaseProps {
    onNavigate: (page: string, articleId?: string) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onNavigate }) => {
    const [activeView, setActiveView] = useState<'dashboard' | 'articles'>('dashboard');
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const collections = [
        { id: 'visa', name: 'Visa Requirements', icon: FileText, count: 42, drafts: 3, color: 'bg-blue-600' },
        { id: 'sop', name: 'SOP Guidelines', icon: Edit, count: 28, drafts: 2, color: 'bg-purple-600' },
        { id: 'scholarships', name: 'Scholarships', icon: Award, count: 65, drafts: 8, color: 'bg-amber-600' },
        { id: 'ielts', name: 'IELTS Info', icon: BookOpen, count: 15, drafts: 1, color: 'bg-green-600' },
        { id: 'costs', name: 'Cost Estimates', icon: DollarSign, count: 34, drafts: 5, color: 'bg-red-600' },
        { id: 'faqs', name: 'FAQs', icon: HelpCircle, count: 89, drafts: 12, color: 'bg-cyan-600' },
    ];

    const articles: Article[] = [
        {
            id: 'art-001',
            title: 'F-1 Student Visa Requirements for USA',
            collection: 'Visa Requirements',
            country: 'USA',
            tags: ['F-1', 'Student Visa', 'Requirements'],
            status: 'published',
            version: 'v2.4',
            lastUpdated: '2024-02-10',
            usageCount: 342,
        },
        {
            id: 'art-002',
            title: 'UK Tier 4 Student Visa Process 2024',
            collection: 'Visa Requirements',
            country: 'UK',
            tags: ['Tier 4', 'Student Visa', 'UK'],
            status: 'published',
            version: 'v1.8',
            lastUpdated: '2024-01-28',
            usageCount: 267,
        },
        {
            id: 'art-003',
            title: 'SOP Writing Best Practices',
            collection: 'SOP Guidelines',
            country: 'Global',
            tags: ['SOP', 'Writing', 'Best Practices'],
            status: 'draft',
            version: 'v1.0',
            lastUpdated: '2024-02-14',
            usageCount: 0,
        },
        {
            id: 'art-004',
            title: 'Canada Study Permit Requirements',
            collection: 'Visa Requirements',
            country: 'Canada',
            tags: ['Study Permit', 'Canada'],
            status: 'published',
            version: 'v3.1',
            lastUpdated: '2023-11-15',
            usageCount: 189,
        },
    ];

    const metrics = [
        { label: 'Total Articles', value: '273', icon: FileText, color: 'bg-blue-600', change: '+12' },
        { label: 'Published', value: '242', icon: CheckCircle2, color: 'bg-green-600', change: '+8' },
        { label: 'Drafts', value: '31', icon: Clock, color: 'bg-amber-600', change: '+4' },
        { label: 'Recently Updated', value: '18', icon: TrendingUp, color: 'bg-purple-600', change: '+6' },
    ];

    const contentDistribution = [
        { category: 'Visa Requirements', count: 42, percentage: 15, color: 'bg-blue-500' },
        { category: 'Scholarships', count: 65, percentage: 24, color: 'bg-amber-500' },
        { category: 'FAQs', count: 89, percentage: 33, color: 'bg-cyan-500' },
        { category: 'Cost Estimates', count: 34, percentage: 12, color: 'bg-red-500' },
        { category: 'SOP Guidelines', count: 28, percentage: 10, color: 'bg-purple-500' },
        { category: 'IELTS Info', count: 15, percentage: 6, color: 'bg-green-500' },
    ];

    const healthAlerts = [
        { type: 'warning', message: 'Canada Visa data not updated in 90 days', action: 'Review Now' },
        { type: 'error', message: '5 articles missing country tags', action: 'Fix Tags' },
        { type: 'info', message: '12 drafts older than 30 days', action: 'Review Drafts' },
    ];

    const filteredArticles = selectedCollection
        ? articles.filter(a => a.collection === collections.find(c => c.id === selectedCollection)?.name)
        : articles;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-[1800px] mx-auto px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-[22px] font-bold text-[#253154]">Content & Knowledge Base</h1>
                            <p className="text-[13px] text-gray-600 mt-0.5">Structured knowledge management for AI responses</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-10">
                                <Download size={16} className="mr-2" />
                                Export
                            </Button>
                            <Button variant="outline" className="h-10">
                                <Upload size={16} className="mr-2" />
                                Import
                            </Button>
                            <Button
                                className="bg-[#253154] hover:bg-[#1a2340] text-white h-10 shadow-lg shadow-purple-900/20"
                                onClick={() => onNavigate('create-article')}
                            >
                                <Plus size={16} className="mr-2" />
                                Create Article
                            </Button>
                        </div>
                    </div>

                    {/* View Tabs */}
                    <div className="flex items-center gap-2 mt-4">
                        <button
                            onClick={() => setActiveView('dashboard')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeView === 'dashboard'
                                    ? 'bg-[#253154] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <BarChart3 size={14} className="inline mr-2" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveView('articles')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeView === 'articles'
                                    ? 'bg-[#253154] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <FileText size={14} className="inline mr-2" />
                            All Articles
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-8 py-8">
                {/* ========== DASHBOARD VIEW ========== */}
                {activeView === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Metrics Row */}
                        <div className="grid grid-cols-4 gap-5">
                            {metrics.map((metric, idx) => {
                                const Icon = metric.icon;
                                return (
                                    <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                                            <div className={`w-10 h-10 ${metric.color} rounded-lg flex items-center justify-center`}>
                                                <Icon size={20} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <p className="text-3xl font-bold text-[#253154]">{metric.value}</p>
                                            <span className="text-xs font-semibold text-green-600">{metric.change}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Content Distribution Chart */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-base font-bold text-[#253154] mb-4 flex items-center gap-2">
                                <BarChart3 size={18} />
                                Content Distribution
                            </h2>
                            <div className="space-y-4">
                                {contentDistribution.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">{item.category}</span>
                                            <span className="text-sm font-bold text-gray-900">{item.count} articles ({item.percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className={`${item.color} h-2.5 rounded-full transition-all`} style={{ width: `${item.percentage}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content Health Alerts */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-base font-bold text-[#253154] mb-4 flex items-center gap-2">
                                <AlertTriangle size={18} />
                                Content Health Alerts
                            </h2>
                            <div className="space-y-3">
                                {healthAlerts.map((alert, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${alert.type === 'error'
                                                ? 'bg-red-50 border-red-500'
                                                : alert.type === 'warning'
                                                    ? 'bg-amber-50 border-amber-500'
                                                    : 'bg-blue-50 border-blue-500'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {alert.type === 'error' ? (
                                                <AlertCircle size={20} className="text-red-600" />
                                            ) : alert.type === 'warning' ? (
                                                <AlertTriangle size={20} className="text-amber-600" />
                                            ) : (
                                                <AlertCircle size={20} className="text-blue-600" />
                                            )}
                                            <span className="text-sm font-medium text-gray-800">{alert.message}</span>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            {alert.action}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== ARTICLES VIEW ========== */}
                {activeView === 'articles' && (
                    <div className="space-y-6">
                        {/* Compact Metrics Row */}
                        <div className="grid grid-cols-4 gap-5">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Articles</span>
                                    <FileText size={16} className="text-blue-600" />
                                </div>
                                <p className="text-2xl font-bold text-[#253154]">273</p>
                                <p className="text-xs text-green-600 font-semibold mt-1">+12 this month</p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Drafts</span>
                                    <Clock size={16} className="text-amber-600" />
                                </div>
                                <p className="text-2xl font-bold text-[#253154]">31</p>
                                <p className="text-xs text-amber-600 font-semibold mt-1">11% of total</p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Published</span>
                                    <CheckCircle2 size={16} className="text-green-600" />
                                </div>
                                <p className="text-2xl font-bold text-[#253154]">242</p>
                                <p className="text-xs text-green-600 font-semibold mt-1">89% of total</p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Usage (30D)</span>
                                    <TrendingUp size={16} className="text-purple-600" />
                                </div>
                                <p className="text-2xl font-bold text-[#253154]">1,248</p>
                                <p className="text-xs text-purple-600 font-semibold mt-1">+23% vs last month</p>
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search size={20} className="absolute inset-y-0 left-4 my-auto text-[#253154]" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-[50px] bg-white rounded-xl border-none shadow-sm pl-12 pr-4 text-[16px] font-medium text-gray-700 placeholder-[#253154] focus:ring-2 focus:ring-purple-100 outline-none"
                                />
                            </div>

                            {/* Collection Filter Dropdown */}
                            <div className="relative">
                                <button className="h-[50px] px-5 bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center gap-2 min-w-[180px]">
                                    <FolderOpen size={18} strokeWidth={1.5} />
                                    <span className="font-medium text-sm">
                                        {selectedCollection ? collections.find(c => c.id === selectedCollection)?.name : 'All Collections'}
                                    </span>
                                    <ChevronRight size={16} className="ml-auto" />
                                </button>
                            </div>

                            <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                                <Filter size={20} strokeWidth={1.5} />
                            </button>
                            <button className="h-[50px] min-w-[50px] bg-white border border-gray-200 rounded-xl text-[#253154] hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors flex items-center justify-center">
                                <RefreshCw size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Collection Filter Chips (Optional - shown when filtered) */}
                        {selectedCollection && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500">Filtered by:</span>
                                <button
                                    onClick={() => setSelectedCollection(null)}
                                    className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200 flex items-center gap-2 hover:bg-purple-200 transition-colors"
                                >
                                    <FolderOpen size={12} />
                                    {collections.find(c => c.id === selectedCollection)?.name}
                                    <span className="ml-1">×</span>
                                </button>
                            </div>
                        )}

                        {/* Full-Width Table Card */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[30%]">Title</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[15%]">Collection</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[12%]">Country</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[12%]">Status</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[10%]">Version</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[12%]">Last Updated</th>
                                        <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[9%]">Usage (30d)</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[8%]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredArticles.map((article) => (
                                        <tr
                                            key={article.id}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <button
                                                    onClick={() => onNavigate('article-detail', article.id)}
                                                    className="font-bold text-[#253154] text-[14px] hover:text-purple-600 transition-colors text-left"
                                                >
                                                    {article.title}
                                                </button>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">
                                                    {article.collection}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Globe size={14} className="text-gray-500" />
                                                    <span className="text-gray-700 text-[14px]">{article.country}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {article.status === 'published' ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[12px] font-medium rounded-lg border border-green-200 inline-flex items-center gap-1.5">
                                                        <CheckCircle2 size={12} />
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[12px] font-medium rounded-lg border border-amber-200 inline-flex items-center gap-1.5">
                                                        <Clock size={12} />
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-gray-600 text-[13px] font-semibold">{article.version}</span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-gray-500 text-[13px]">{article.lastUpdated}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {article.usageCount !== undefined ? (
                                                    <span className="text-gray-900 font-bold text-[14px]">{article.usageCount}</span>
                                                ) : (
                                                    <span className="text-gray-400 text-[14px]">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => onNavigate('article-detail', article.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Eye size={16} className="text-gray-600" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <MoreHorizontal size={16} className="text-gray-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="border-t border-gray-100 bg-gray-50/30">
                                <div className="flex items-center justify-between px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600">Rows per page:</span>
                                        <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-600">
                                            Showing <span className="font-semibold text-gray-900">1-4</span> of <span className="font-semibold text-gray-900">273</span>
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                                                <ChevronDown size={16} className="rotate-90" />
                                            </button>
                                            <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                                <ChevronDown size={16} className="-rotate-90" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
