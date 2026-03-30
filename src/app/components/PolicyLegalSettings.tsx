'use client';

import React, { useState, useEffect } from 'react';
import { 
    Scale, 
    ShieldCheck, 
    Mail, 
    Search, 
    Filter, 
    Plus, 
    ChevronDown, 
    Edit, 
    Globe, 
    Trash2,
    CheckCircle2,
    MoreHorizontal,
    FileText,
    ExternalLink,
    Copy,
    Clock,
    User
} from 'lucide-react';
import { policySettingsService, PolicyGlobalSettings, PolicyPage } from '../../services/policySettingsService';
import { toast } from 'sonner';

interface Props {
    globalSettings: PolicyGlobalSettings;
    setGlobalSettings: React.Dispatch<React.SetStateAction<PolicyGlobalSettings>>;
    onSaveGlobal?: () => void;
    isSaving?: boolean;
}

const PolicyLegalSettings: React.FC<Props> = ({ globalSettings, setGlobalSettings, onSaveGlobal, isSaving }) => {
    const [pages, setPages] = useState<PolicyPage[]>([]);
    const [isLoadingPages, setIsLoadingPages] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [visibilityFilter, setVisibilityFilter] = useState('All Visibility');
    
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newPage, setNewPage] = useState<Partial<PolicyPage>>({
        title: '',
        type: 'Terms & Conditions',
        status: 'Draft',
        visibility: 'Public',
        version: 'v1.0',
        effective_date: new Date().toISOString().split('T')[0],
        author_name: 'Admin',
        content: ''
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setIsLoadingPages(true);
        try {
            const data = await policySettingsService.getPolicyPages();
            setPages(data);
        } catch (error) {
            toast.error('Failed to load policy pages');
        } finally {
            setIsLoadingPages(false);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPage.title) {
            toast.error('Policy Title is required');
            return;
        }

        setIsSubmitting(true);
        try {
            await policySettingsService.createPolicyPage(newPage);
            toast.success('Policy page created successfully');
            setIsCreateModalOpen(false);
            setNewPage({
                title: '',
                type: 'Terms & Conditions',
                status: 'Draft',
                visibility: 'Public',
                version: 'v1.0',
                effective_date: new Date().toISOString().split('T')[0],
                author_name: 'Admin',
                content: ''
            });
            fetchPages();
        } catch (error) {
            toast.error('Failed to create policy page');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggle = (field: keyof PolicyGlobalSettings) => {
        setGlobalSettings((prev: any) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (field: keyof PolicyGlobalSettings, value: any) => {
        setGlobalSettings((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const SectionHeader = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
        <div className="mb-10 border-b border-slate-50 pb-8">
            <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                    <Icon size={20} />
                </div>
                <h2 className="text-[18px] font-bold text-[#0f172b]">{title}</h2>
            </div>
            <p className="text-slate-400 font-medium text-[14px] ml-11">{description}</p>
        </div>
    );

    const ToggleRow = ({ label, sublabel, enabled, onToggle }: { label: string, sublabel: string, enabled: boolean, onToggle: () => void }) => (
        <div className="flex items-center justify-between py-6 px-1 border-b border-gray-50 last:border-0 grow">
            <div className="space-y-1">
                <p className="text-[15px] font-bold text-[#334155]">{label}</p>
                <p className="text-[13px] text-slate-400 font-medium">{sublabel}</p>
            </div>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
                    enabled ? 'bg-[#0f172b]' : 'bg-slate-200'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );

    const InputField = ({ label, sublabel, value, onChange, type = "text", placeholder = "", rightLabel = "" }: { label: string, sublabel?: string, value: any, onChange: (val: any) => void, type?: string, placeholder?: string, rightLabel?: string }) => (
        <div className="flex flex-col gap-2 py-4">
            <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#334155]">{label}</span>
                {sublabel && <span className="text-[12px] text-slate-400 font-medium mb-2">{sublabel}</span>}
            </div>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all"
                />
                {rightLabel && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold text-[12px]">
                        {rightLabel}
                    </div>
                )}
            </div>
        </div>
    );

    const filteredPages = pages.filter(page => {
        const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             page.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'All Types' || page.type === typeFilter;
        const matchesStatus = statusFilter === 'All Status' || page.status === statusFilter;
        const matchesVisibility = visibilityFilter === 'All Visibility' || page.visibility === visibilityFilter;
        return matchesSearch && matchesType && matchesStatus && matchesVisibility;
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1250px] mx-auto pb-20 pt-4">
            
            <div className="space-y-8">
                {/* 1. Global Policy Rules */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Global Policy Rules" 
                        description="Default settings for all policy pages" 
                        icon={ShieldCheck}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 items-start">
                        <ToggleRow 
                            label="Default Re-acceptance Behavior" 
                            sublabel="Require users to re-accept updated policies" 
                            enabled={globalSettings.enable_reacceptance} 
                            onToggle={() => handleToggle('enable_reacceptance')} 
                        />
                        <ToggleRow 
                            label="Consent Timestamp Storage" 
                            sublabel="Automatically store precise consent timestamps" 
                            enabled={globalSettings.enable_consent_timestamp} 
                            onToggle={() => handleToggle('enable_consent_timestamp')} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-4">
                        <InputField 
                            label="Acceptance Log Retention (months)" 
                            value={globalSettings.log_retention_months} 
                            onChange={(val) => handleInputChange('log_retention_months', val)} 
                            type="number" 
                        />
                        <InputField 
                            label="Legal Contact Email" 
                            value={globalSettings.legal_contact_email} 
                            onChange={(val) => handleInputChange('legal_contact_email', val)} 
                            placeholder="legal@example.com"
                        />
                    </div>
                </div>

                {/* 2. Policy Management Repository */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search policy pages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-12 pr-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all"
                            />
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <select 
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[13px] font-bold text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all min-w-[140px] cursor-pointer"
                            >
                                <option>All Types</option>
                                <option>Terms & Conditions</option>
                                <option>Privacy Policy</option>
                                <option>Refund Policy</option>
                            </select>
                            
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[13px] font-bold text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all min-w-[140px] cursor-pointer"
                            >
                                <option>All Status</option>
                                <option>Published</option>
                                <option>Draft</option>
                                <option>Archived</option>
                            </select>

                            <select 
                                value={visibilityFilter}
                                onChange={(e) => setVisibilityFilter(e.target.value)}
                                className="h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[13px] font-bold text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all min-w-[140px] cursor-pointer"
                            >
                                <option>All Visibility</option>
                                <option>Public</option>
                                <option>Internal</option>
                                <option>Private</option>
                            </select>
                            
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-[#0f172b] hover:bg-[#1e293b] text-white px-6 h-[52px] rounded-xl text-[13px] font-bold transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Create Policy Page
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="text-left py-4 px-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Policy Title</th>
                                    <th className="text-left py-4 px-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                                    <th className="text-left py-4 px-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-4 px-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Version</th>
                                    <th className="text-left py-4 px-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Effective Date</th>
                                    <th className="text-left py-4 px-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Last Updated</th>
                                    <th className="text-left py-4 px-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Visibility</th>
                                    <th className="text-right py-4 px-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingPages ? (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center text-slate-400 font-medium">Loading policy pages...</td>
                                    </tr>
                                ) : filteredPages.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center text-slate-400 font-medium">No policy pages found matching your search.</td>
                                    </tr>
                                ) : filteredPages.map((page) => (
                                    <tr key={page.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-bold text-[#0f172b]">{page.title}</span>
                                                <span className="text-[12px] text-slate-400 font-medium">{page.slug || `/legal/${page.title.toLowerCase().replace(/ /g, '-')}`}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold">
                                                {page.type}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                                page.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {page.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="text-[13px] font-bold text-slate-600">{page.version}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="text-[13px] font-medium text-slate-600">{page.effective_date}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-slate-600">{new Date(page.last_updated_at || '').toLocaleDateString()}</span>
                                                <span className="text-[11px] text-slate-400 font-medium">by {page.author_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="text-[13px] font-bold text-slate-600">{page.visibility}</span>
                                        </td>
                                        <td className="py-6 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-[#0f172b] transition-all">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-[#0f172b] transition-all">
                                                    <Copy size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-red-600 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Policy Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                    <Plus size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#0f172b]">Create Policy Page</h3>
                                    <p className="text-sm text-slate-400 font-medium">Add a new legal document to your repository</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                            >
                                <MoreHorizontal size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#334155]">Policy Title</label>
                                    <input 
                                        type="text"
                                        required
                                        value={newPage.title}
                                        onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                                        className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all"
                                        placeholder="e.g. Terms of Service"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#334155]">URL Slug</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input 
                                            type="text"
                                            value={newPage.slug}
                                            onChange={(e) => setNewPage({...newPage, slug: e.target.value})}
                                            className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-12 pr-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all"
                                            placeholder="terms-of-service"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#334155]">Policy Type</label>
                                    <select 
                                        value={newPage.type}
                                        onChange={(e) => setNewPage({...newPage, type: e.target.value})}
                                        className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all cursor-pointer"
                                    >
                                        <option>Terms & Conditions</option>
                                        <option>Privacy Policy</option>
                                        <option>Refund Policy</option>
                                        <option>Cookie Policy</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#334155]">Initial Status</label>
                                    <select 
                                        value={newPage.status}
                                        onChange={(e) => setNewPage({...newPage, status: e.target.value})}
                                        className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all cursor-pointer"
                                    >
                                        <option>Draft</option>
                                        <option>Published</option>
                                        <option>Archived</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#334155]">Version</label>
                                    <input 
                                        type="text"
                                        value={newPage.version}
                                        onChange={(e) => setNewPage({...newPage, version: e.target.value})}
                                        className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all"
                                        placeholder="v1.0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#334155]">Effective Date</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input 
                                            type="date"
                                            value={newPage.effective_date}
                                            onChange={(e) => setNewPage({...newPage, effective_date: e.target.value})}
                                            className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-12 pr-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#334155]">Visibility</label>
                                    <select 
                                        value={newPage.visibility}
                                        onChange={(e) => setNewPage({...newPage, visibility: e.target.value})}
                                        className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all cursor-pointer"
                                    >
                                        <option>Public</option>
                                        <option>Internal</option>
                                        <option>Private</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#334155]">Author</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input 
                                            type="text"
                                            value={newPage.author_name}
                                            onChange={(e) => setNewPage({...newPage, author_name: e.target.value})}
                                            className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-12 pr-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[14px] font-bold text-[#334155]">Policy Content (Markdown supported)</label>
                                <textarea 
                                    rows={6}
                                    value={newPage.content}
                                    onChange={(e) => setNewPage({...newPage, content: e.target.value})}
                                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all resize-none"
                                    placeholder="Enter your policy text here..."
                                />
                            </div>

                            <div className="pt-6 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-6 h-[52px] border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 h-[52px] bg-[#6929c4] hover:bg-[#52199b] text-white rounded-xl text-[13px] font-bold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Policy'}
                                    <CheckCircle2 size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PolicyLegalSettings;
