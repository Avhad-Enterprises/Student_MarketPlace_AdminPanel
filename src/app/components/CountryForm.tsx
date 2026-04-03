"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    ArrowLeft, Save, X, Globe, User, TrendingUp, 
    GraduationCap, UserCheck, CheckCircle, Building, 
    Target, List, Users, Plane, PlaneTakeoff,
    Clock, Briefcase, Calendar, Shield, PieChart, Tag, 
    Image, Layout, MessageSquare, FileText, Smartphone, 
    Globe2, ExternalLink, ShieldCheck, DollarSign, Info, 
    Plus, Trash2, Check, AlertCircle, Search, Sparkles, 
    Building2, CreditCard, Home, MapPin, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { CountryFormData, createCountry, updateCountry } from '@/services/countriesService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountryFormProps {
    initialData?: CountryFormData;
    countryId?: string;
    isEdit?: boolean;
    initialTab?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const CountryForm: React.FC<CountryFormProps> = ({
    initialData,
    countryId,
    isEdit = false,
    initialTab = 'basic-info',
    onSuccess,
    onCancel
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(initialTab);
    
    // Sync activeTab with URL query parameter
    React.useEffect(() => {
        const queryTab = searchParams.get('tab');
        if (queryTab && queryTab !== activeTab) {
            setActiveTab(queryTab);
        }
    }, [searchParams]);

    // Update URL when tab changes
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        if (isEdit && countryId) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('tab', tabId);
            router.replace(`/countries/edit/${countryId}?${params.toString()}`, { scroll: false });
        }
    };
    
    const [formData, setFormData] = useState<CountryFormData>(initialData || {
        country_name: '',
        country_code: '',
        region: '',
        visa_difficulty: 'Medium',
        cost_of_living: 'Medium',
        status: 'Active',
        visible: true,
        service_availability: {
            visa: true,
            insurance: true,
            housing: true,
            loans: true,
            forex: true,
            courses: true,
            food: true
        },
        popularity: 0,
        
        // Expanded fields
        tuition_fees_min: 0,
        tuition_fees_max: 0,
        living_cost_min: 0,
        living_cost_max: 0,
        health_insurance_min: 0,
        health_insurance_max: 0,
        total_cost_min: 0,
        total_cost_max: 0,
        monthly_living_expenses: 0,
        accommodation_min: 0,
        accommodation_max: 0,
        food_monthly: 0,
        transport_monthly: 0,
        health_insurance_annual: 0,
        capital_city: '',
        official_languages: '',
        climate: '',
        safety_rating: 0,
        
        education_overview: '',
        major_intakes: '',
        avg_degree_duration: '',
        credit_system_info: '',
        top_unis_summary: '',
        
        visa_process_info: '',
        visa_fee: 0,
        permit_validity: '',
        psw_duration: '',
        psw_conditions: '',
        part_time_work_hours: 20,
        spouse_work_allowed: false,
        
        job_market_info: '',
        key_industries: '',
        pr_pathway_info: '',
        settlement_options: '',
        
        ai_context_summary: '',
        decision_pros_cons: '',
        key_attractions: '',
        potential_challenges: '',
        
        marketplace_notes: '',
        partner_summary: '',
        
        hero_image: '',
        flag_icon: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        slug: '',
        academic_system: '',
        bachelor_duration: 3,
        master_duration: 1,
        intake_seasons: '',
        ielts_min: 6.0,
        ielts_max: 7.5,
        toefl_min: 80,
        toefl_max: 110,
        student_visa_type: '',
        visa_processing_min: 15,
        visa_processing_max: 30,
        work_hours_per_week: 20,
        psw_duration_months: 24,
        top_universities: [],
        popular_cities: [],
        job_market_strengths: [],
        pr_pathway: '',
        roi_score: 'Medium',
        visa_success_rate: 85,
        pr_probability: 'Medium',
        acceptance_rate: 30,
        tags: [],
        visa_providers: [],
        loan_providers: [],
        housing_providers: [],
        insurance_providers: [],
        forex_providers: [],
    });

    const handleChange = (field: keyof CountryFormData, value: any) => {
        setFormData(prev => {
            const newState = { ...prev, [field]: value };
            
            // Auto-calculate total costs if component fields change
            if ([
                'tuition_fees_min', 'living_cost_min', 'health_insurance_min',
                'tuition_fees_max', 'living_cost_max', 'health_insurance_max'
            ].includes(field as string)) {
                newState.total_cost_min = (Number(newState.tuition_fees_min) || 0) + 
                                         (Number(newState.living_cost_min) || 0) + 
                                         (Number(newState.health_insurance_min) || 0);
                
                newState.total_cost_max = (Number(newState.tuition_fees_max) || 0) + 
                                         (Number(newState.living_cost_max) || 0) + 
                                         (Number(newState.health_insurance_max) || 0);
            }
            
            return newState;
        });
    };

    const handleServiceChange = (service: keyof CountryFormData['service_availability'], checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            service_availability: {
                ...prev.service_availability,
                [service]: checked
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit && countryId) {
                await updateCountry(countryId, formData);
                toast.success('Country updated successfully');
            } else {
                await createCountry(formData);
                toast.success('Country created successfully');
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/countries');
            }
        } catch (error: any) {
            console.error('Error saving country:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to save country';
            toast.error(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'basic-info', label: 'BASIC INFORMATION', icon: Globe },
        { id: 'costs', label: 'COSTS (COMPARISON READY)', icon: TrendingUp },
        { id: 'academic', label: 'ACADEMIC SYSTEM', icon: GraduationCap },
        { id: 'visa', label: 'VISA & WORK RIGHTS', icon: UserCheck },
        { id: 'opportunities', label: 'OPPORTUNITIES', icon: Building },
        { id: 'ai-fields', label: 'DECISION / AI FIELDS', icon: Target },
        { id: 'marketplace', label: 'MARKETPLACE', icon: List },
        { id: 'media-seo', label: 'MEDIA & SEO', icon: PlaneTakeoff },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto pb-20">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#0f172b] leading-tight">
                            {isEdit ? 'Edit Country Profile' : 'Add New Destination'}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                            <Globe size={13} />
                            Fill in comprehensive data for student comparison and AI guidance
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        type="button" 
                        onClick={() => router.back()}
                        className="px-5 h-11 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 h-11 bg-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:bg-purple-700 hover:shadow-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save size={16} />
                                {isEdit ? 'Update Destination' : 'Publish Destination'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-100 flex overflow-x-auto no-scrollbar mb-8 sticky top-4 z-10 backdrop-blur-md bg-white/90">
                <div className="flex p-1 gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all text-sm ${
                                activeTab === tab.id
                                    ? 'bg-purple-50 text-purple-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="space-y-6">
                
                {/* 1. BASIC INFORMATION */}
                {activeTab === 'basic-info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><User size={16} /></span>
                                Identity & Region
                            </h2>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Country Name</label>
                                    <Input 
                                        className="h-[44px] border-slate-200 rounded-xl focus:ring-purple-100 focus:border-purple-600 transition-all"
                                        placeholder="e.g. United Kingdom"
                                        value={formData.country_name}
                                        onChange={(e) => handleChange('country_name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Country Code (ISO 2)</label>
                                    <Input 
                                        className="h-[44px] border-slate-200 rounded-xl focus:ring-purple-100 focus:border-purple-600 transition-all"
                                        placeholder="e.g. GB"
                                        maxLength={2}
                                        value={formData.country_code}
                                        onChange={(e) => handleChange('country_code', e.target.value.toUpperCase())}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Popularity Rank (0-100)</label>
                                    <Input 
                                        type="number"
                                        className="h-[44px] border-slate-200 rounded-xl focus:ring-purple-100 focus:border-purple-600 transition-all"
                                        value={formData.popularity}
                                        onChange={(e) => handleChange('popularity', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Capital City</label>
                                        <Input 
                                            className="h-[44px] border-slate-200 rounded-xl focus:ring-purple-100 focus:border-purple-600 transition-all"
                                            placeholder="e.g. London"
                                            value={formData.capital_city}
                                            onChange={(e) => handleChange('capital_city', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Safety Rating (out of 5)</label>
                                        <Input 
                                            type="number"
                                            step="0.1"
                                            max="5"
                                            min="0"
                                            className="h-[44px] border-slate-200 rounded-xl focus:ring-purple-100 focus:border-purple-600 transition-all"
                                            placeholder="4.5"
                                            value={formData.safety_rating}
                                            onChange={(e) => handleChange('safety_rating', parseFloat(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Official Languages</label>
                                    <Input 
                                        className="h-[44px] border-slate-200 rounded-xl focus:ring-purple-100 focus:border-purple-600 transition-all"
                                        placeholder="e.g. English, French (Comma separated)"
                                        value={formData.official_languages}
                                        onChange={(e) => handleChange('official_languages', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Climate</label>
                                    <textarea 
                                        className="w-full min-h-[80px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-purple-100 focus:border-purple-600 transition-all outline-none"
                                        placeholder="Describe the climate (e.g. Temperate, Oceanic...)"
                                        value={formData.climate}
                                        onChange={(e) => handleChange('climate', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Globe size={16} /></span>
                                Regional Targeting
                            </h2>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Primary Region</label>
                                    <Select value={formData.region} onValueChange={(v) => handleChange('region', v)}>
                                        <SelectTrigger className="h-[44px] border-slate-200 rounded-xl focus:ring-purple-100">
                                            <SelectValue placeholder="Select region" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-xl">
                                            {['North America', 'Europe', 'Asia', 'Oceania', 'Africa', 'South America'].map(r => (
                                                <SelectItem key={r} value={r}>{r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Visibility Status</label>
                                    <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                                        <SelectTrigger className="h-[44px] border-slate-200 rounded-xl focus:ring-purple-100">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-xl">
                                            <SelectItem value="Active">Active (Visible)</SelectItem>
                                            <SelectItem value="Inactive">Inactive (Hidden)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-3 pt-4">
                                    <Checkbox 
                                        id="visible" 
                                        checked={formData.visible} 
                                        onCheckedChange={(v) => handleChange('visible', v)}
                                        className="w-5 h-5 rounded-md data-[state=checked]:bg-purple-600 border-slate-300"
                                    />
                                    <label htmlFor="visible" className="text-sm font-medium text-slate-700 cursor-pointer">
                                        Show in user-facing search results
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. COSTS (COMPARISON READY) */}
                {activeTab === 'costs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp size={16} /></span>
                                Main Costs
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tuition Fees</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Minimum Tuition ($)</label>
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                placeholder="e.g. 10000"
                                                value={formData.tuition_fees_min}
                                                onChange={(e) => handleChange('tuition_fees_min', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Maximum Tuition ($)</label>
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                placeholder="e.g. 35000"
                                                value={formData.tuition_fees_max}
                                                onChange={(e) => handleChange('tuition_fees_max', parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Living Costs</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Min Living Cost ($)</label>
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                placeholder="e.g. 8000"
                                                value={formData.living_cost_min}
                                                onChange={(e) => handleChange('living_cost_min', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Max Living Cost ($)</label>
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                placeholder="e.g. 15000"
                                                value={formData.living_cost_max}
                                                onChange={(e) => handleChange('living_cost_max', parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Health Insurance</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Min Insurance ($)</label>
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                placeholder="e.g. 500"
                                                value={formData.health_insurance_min}
                                                onChange={(e) => handleChange('health_insurance_min', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Max Insurance ($)</label>
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                placeholder="e.g. 1200"
                                                value={formData.health_insurance_max}
                                                onChange={(e) => handleChange('health_insurance_max', parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 flex flex-col justify-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-8 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><CheckCircle size={16} /></span>
                                Total Estimation (Comparison Ready)
                            </h2>
                            <div className="space-y-8">
                                <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                    <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Total Minimum Cost ($)</label>
                                    <Input 
                                        type="number"
                                        className="h-[52px] text-xl font-bold text-purple-700 bg-purple-50/30 border-purple-100 rounded-xl"
                                        value={formData.total_cost_min}
                                        onChange={(e) => handleChange('total_cost_min', parseFloat(e.target.value))}
                                    />
                                    <p className="mt-2 text-[12px] text-slate-400">Automatically calculated from component mins.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                    <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Total Maximum Cost ($)</label>
                                    <Input 
                                        type="number"
                                        className="h-[52px] text-xl font-bold text-purple-700 bg-purple-50/30 border-purple-100 rounded-xl"
                                        value={formData.total_cost_max}
                                        onChange={(e) => handleChange('total_cost_max', parseFloat(e.target.value))}
                                    />
                                    <p className="mt-2 text-[12px] text-slate-400">Automatically calculated from component maxes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. ACADEMIC SYSTEM */}
                {activeTab === 'academic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><GraduationCap size={16} /></span>
                                System & Durations
                            </h2>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Academic System Type</label>
                                    <Input 
                                        className="h-[44px] border-slate-200 rounded-xl"
                                        placeholder="e.g. Semester-based, ECTS standard"
                                        value={formData.academic_system}
                                        onChange={(e) => handleChange('academic_system', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Bachelor Duration (Years)</label>
                                        <Input 
                                            type="number" step="0.5"
                                            className="h-[44px] border-slate-200 rounded-xl"
                                            value={formData.bachelor_duration}
                                            onChange={(e) => handleChange('bachelor_duration', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Master Duration (Years)</label>
                                        <Input 
                                            type="number" step="0.5"
                                            className="h-[44px] border-slate-200 rounded-xl"
                                            value={formData.master_duration}
                                            onChange={(e) => handleChange('master_duration', parseFloat(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Intake Seasons (Multi-select style)</label>
                                    <Input 
                                        className="h-[44px] border-slate-200 rounded-xl"
                                        placeholder="e.g. Fall, Spring, Summer (Comma separated)"
                                        value={formData.intake_seasons}
                                        onChange={(e) => handleChange('intake_seasons', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Target size={16} /></span>
                                English Proficiency Requirements (Avg)
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">IELTS Scores</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-xs text-slate-500">Min Score</label>
                                            <Input 
                                                type="number" step="0.5"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                value={formData.ielts_min}
                                                onChange={(e) => handleChange('ielts_min', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-xs text-slate-500">Max Score (Typical)</label>
                                            <Input 
                                                type="number" step="0.5"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                value={formData.ielts_max}
                                                onChange={(e) => handleChange('ielts_max', parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">TOEFL Scores</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-xs text-slate-500">Min Score</label>
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                value={formData.toefl_min}
                                                onChange={(e) => handleChange('toefl_min', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-xs text-slate-500">Max Score (Typical)</label>
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                value={formData.toefl_max}
                                                onChange={(e) => handleChange('toefl_max', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. VISA & WORK RIGHTS */}
                {activeTab === 'visa' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 divide-y divide-slate-50">
                            <div className="pb-6">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><UserCheck size={16} /></span>
                                    Visa Types & Fees
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Primary Student Visa Type</label>
                                        <Input 
                                            className="h-[44px] border-slate-200 rounded-xl"
                                            placeholder="e.g. Subclass 500, Tier 4 Student Visa"
                                            value={formData.student_visa_type}
                                            onChange={(e) => handleChange('student_visa_type', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Visa Difficulty</label>
                                            <Select value={formData.visa_difficulty} onValueChange={(v) => handleChange('visa_difficulty', v)}>
                                                <SelectTrigger className="h-[44px] border-slate-200 rounded-xl">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Low">Low</SelectItem>
                                                    <SelectItem value="Medium">Medium</SelectItem>
                                                    <SelectItem value="High">High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Application Fee ($)</label>
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl"
                                                value={formData.visa_fee}
                                                onChange={(e) => handleChange('visa_fee', parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={16} className="text-blue-500" /> Processing Times (Days)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs text-slate-500">Minimum Days</label>
                                        <Input 
                                            type="number"
                                            className="h-[44px] border-slate-200 rounded-xl"
                                            value={formData.visa_processing_min}
                                            onChange={(e) => handleChange('visa_processing_min', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs text-slate-500">Maximum Days</label>
                                        <Input 
                                            type="number"
                                            className="h-[44px] border-slate-200 rounded-xl"
                                            value={formData.visa_processing_max}
                                            onChange={(e) => handleChange('visa_processing_max', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Briefcase size={16} /></span>
                                Work Rights & PSW
                            </h2>
                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">During Study</h3>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Work Hours Allowed (Per Week)</label>
                                        <div className="flex items-center gap-3">
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl w-32"
                                                value={formData.work_hours_per_week}
                                                onChange={(e) => handleChange('work_hours_per_week', parseInt(e.target.value))}
                                            />
                                            <span className="text-sm text-slate-500 font-medium">hours / week</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pt-1">
                                        <Checkbox 
                                            id="spouse-work" 
                                            checked={formData.spouse_work_allowed} 
                                            onCheckedChange={(v) => handleChange('spouse_work_allowed', v)}
                                            className="w-5 h-5 rounded-md data-[state=checked]:bg-indigo-600"
                                        />
                                        <label htmlFor="spouse-work" className="text-sm font-medium text-slate-700 cursor-pointer">
                                            Dependent / Spouse Work Allowed
                                        </label>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 space-y-4">
                                    <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">After Study (PSW)</h3>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-indigo-900 mb-1.5">Post-Study Work Duration (Months)</label>
                                        <div className="flex items-center gap-3">
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-indigo-200 rounded-xl w-32 bg-white"
                                                value={formData.psw_duration_months}
                                                onChange={(e) => handleChange('psw_duration_months', parseInt(e.target.value))}
                                            />
                                            <span className="text-sm text-indigo-600 font-medium">months</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-indigo-900 mb-1.5">PSW Conditions / Notes</label>
                                        <textarea 
                                            className="w-full min-h-[80px] p-4 border border-indigo-100 rounded-xl text-sm focus:ring-1 focus:ring-indigo-200 focus:border-indigo-400 transition-all outline-none bg-white/80"
                                            placeholder="Describe eligibility, STEM extensions, etc."
                                            value={formData.psw_conditions}
                                            onChange={(e) => handleChange('psw_conditions', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. OPPORTUNITIES */}
                {activeTab === 'opportunities' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Building size={16} /></span>
                                Institutions & Locations
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5 font-semibold">Top Universities (Linked)</label>
                                    <textarea 
                                        className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition-all"
                                        placeholder="Enter university names or IDs (Comma separated)"
                                        value={formData.top_universities?.join(', ')}
                                        onChange={(e) => handleChange('top_universities', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">Select from existing institutions in the database.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5 font-semibold">Popular Cities (Linked)</label>
                                    <textarea 
                                        className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition-all"
                                        placeholder="e.g. London, Manchester, Birmingham (Comma separated)"
                                        value={formData.popular_cities?.join(', ')}
                                        onChange={(e) => handleChange('popular_cities', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 divide-y divide-slate-50">
                            <div className="pb-6">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center"><TrendingUp size={16} /></span>
                                    Market & Growth
                                </h2>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5 font-semibold">Job Market Strengths</label>
                                    <textarea 
                                        className="w-full min-h-[110px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-cyan-100 focus:border-cyan-600 outline-none transition-all"
                                        placeholder="e.g. High Demand in Tech, Nursing shortage (Comma separated)"
                                        value={formData.job_market_strengths?.join(', ')}
                                        onChange={(e) => handleChange('job_market_strengths', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><UserCheck size={16} /></span>
                                    Permanent Residency
                                </h2>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5 font-semibold">PR Pathway Details</label>
                                    <textarea 
                                        className="w-full min-h-[140px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all"
                                        placeholder="Describe point systems, work experience required for PR..."
                                        value={formData.pr_pathway}
                                        onChange={(e) => handleChange('pr_pathway', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. DECISION / AI FIELDS */}
                {activeTab === 'ai-fields' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 divide-y divide-slate-50">
                            <div className="pb-8">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><Target size={16} /></span>
                                    Success Metrics
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">ROI Score</label>
                                        <Select value={formData.roi_score} onValueChange={(v) => handleChange('roi_score', v)}>
                                            <SelectTrigger className="h-[44px] border-slate-200 rounded-xl">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="High">High (Excellent)</SelectItem>
                                                <SelectItem value="Medium">Medium (Stable)</SelectItem>
                                                <SelectItem value="Low">Low (Variable)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">PR Probability</label>
                                        <Select value={formData.pr_probability} onValueChange={(v) => handleChange('pr_probability', v)}>
                                            <SelectTrigger className="h-[44px] border-slate-200 rounded-xl">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="High">High (Pathway Ready)</SelectItem>
                                                <SelectItem value="Medium">Medium (Points Based)</SelectItem>
                                                <SelectItem value="Low">Low (Restricted)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Visa Success Rate (%)</label>
                                        <div className="relative">
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl pr-10"
                                                value={formData.visa_success_rate}
                                                onChange={(e) => handleChange('visa_success_rate', parseFloat(e.target.value))}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Acceptance Rate (%)</label>
                                        <div className="relative">
                                            <Input 
                                                type="number"
                                                className="h-[44px] border-slate-200 rounded-xl pr-10"
                                                value={formData.acceptance_rate}
                                                onChange={(e) => handleChange('acceptance_rate', parseFloat(e.target.value))}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><List size={16} className="text-orange-500" /> Administrative Tags</h3>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Search Tags / Meta Tags</label>
                                    <textarea 
                                        className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-orange-100 focus:border-orange-600 outline-none transition-all"
                                        placeholder="e.g. Budget Friendly, STEM Hub, High PR (Comma separated)"
                                        value={formData.tags?.join(', ')}
                                        onChange={(e) => handleChange('tags', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0f172b] text-white rounded-[24px] p-8 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-serif italic text-xl">AI</span>
                                Intelligence context
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Detailed AI Context Summary (Used for Chatbot)</label>
                                    <textarea 
                                        className="w-full min-h-[180px] p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-200 focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
                                        placeholder="Write a master summary that the AI will use to answer user queries..."
                                        value={formData.ai_context_summary}
                                        onChange={(e) => handleChange('ai_context_summary', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                     <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Top Attractions & Challenges</label>
                                        <textarea 
                                            className="w-full min-h-[120px] p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-200 focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
                                            placeholder="Marketability points and potential risks..."
                                            value={formData.key_attractions}
                                            onChange={(e) => handleChange('key_attractions', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. MARKETPLACE */}
                {activeTab === 'marketplace' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 divide-y divide-slate-50">
                            <div className="pb-6">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Plane size={16} /></span>
                                    Visa & Travel
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5 font-semibold">Visa Assistance Providers</label>
                                        <textarea 
                                            className="w-full min-h-[80px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                                            placeholder="e.g. VFS Global, IDP Education (Comma separated)"
                                            value={formData.visa_providers?.join(', ')}
                                            onChange={(e) => handleChange('visa_providers', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="py-6">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Building size={16} /></span>
                                    Accommodation
                                </h2>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5 font-semibold">Housing / Hostel Providers</label>
                                    <textarea 
                                        className="w-full min-h-[80px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                                        placeholder="e.g. AmberStudent, Casita, Unilodgers (Comma separated)"
                                        value={formData.housing_providers?.join(', ')}
                                        onChange={(e) => handleChange('housing_providers', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><PlaneTakeoff size={16} /></span>
                                    Financial Services
                                </h2>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5 font-semibold">Forex & Card Providers</label>
                                    <textarea 
                                        className="w-full min-h-[80px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition-all"
                                        placeholder="e.g. Niyo Global, Thomas Cook (Comma separated)"
                                        value={formData.forex_providers?.join(', ')}
                                        onChange={(e) => handleChange('forex_providers', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 divide-y divide-slate-50">
                            <div className="pb-6">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><GraduationCap size={16} /></span>
                                    Education Loans
                                </h2>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5 font-semibold">Loan & Financing Partners</label>
                                    <textarea 
                                        className="w-full min-h-[120px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-purple-100 focus:border-purple-600 outline-none transition-all"
                                        placeholder="e.g. HDFC Credila, Auxilo, Mpower Financing (Comma separated)"
                                        value={formData.loan_providers?.join(', ')}
                                        onChange={(e) => handleChange('loan_providers', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><UserCheck size={16} /></span>
                                    Health Insurance
                                </h2>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5 font-semibold">OSHC / Health Insurance Providers</label>
                                    <textarea 
                                        className="w-full min-h-[120px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-red-100 focus:border-red-600 outline-none transition-all"
                                        placeholder="e.g. Allianz, Bupa, NIB (Comma separated)"
                                        value={formData.insurance_providers?.join(', ')}
                                        onChange={(e) => handleChange('insurance_providers', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 8. MEDIA & SEO */}
                {activeTab === 'media-seo' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Plane size={16} /></span>
                                Assets
                            </h2>
                            <div className="space-y-5">
                                 <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Country_Banner (Hero Image URL)</label>
                                    <Input 
                                        className="h-[44px] border-slate-200 rounded-xl"
                                        placeholder="https://..."
                                        value={formData.hero_image}
                                        onChange={(e) => handleChange('hero_image', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Flag / Icon URL</label>
                                    <Input 
                                        className="h-[44px] border-slate-200 rounded-xl"
                                        placeholder="https://..."
                                        value={formData.flag_icon}
                                        onChange={(e) => handleChange('flag_icon', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">URL Slug</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-sm">marketplace.com/countries/</span>
                                        <Input 
                                            className="h-[44px] border-slate-200 rounded-xl flex-1"
                                            placeholder="united-kingdom"
                                            value={formData.slug}
                                            onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/ /g, '-'))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><PlaneTakeoff size={16} /></span>
                                SEO Optimization
                            </h2>
                            <div className="space-y-5">
                                 <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Meta Title</label>
                                    <Input 
                                        className="h-[44px] border-slate-200 rounded-xl"
                                        placeholder="e.g. Study in UK - Universities, Visa & Costs"
                                        value={formData.meta_title}
                                        onChange={(e) => handleChange('meta_title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Meta Description</label>
                                    <textarea 
                                        className="w-full min-h-[80px] p-4 border border-slate-200 rounded-xl text-sm"
                                        placeholder="Compelling description for search engines..."
                                        value={formData.meta_description}
                                        onChange={(e) => handleChange('meta_description', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Keywords (Comma separated)</label>
                                    <Input 
                                        className="h-[44px] border-slate-200 rounded-xl"
                                        placeholder="study abroad, UK universities, master in uk..."
                                        value={formData.meta_keywords}
                                        onChange={(e) => handleChange('meta_keywords', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

