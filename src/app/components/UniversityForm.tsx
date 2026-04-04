"use client";

import React, { useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { PermissionGuard } from './common/PermissionGuard';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    ArrowLeft, Save, X, Globe, User, TrendingUp, 
    GraduationCap, UserCheck, CheckCircle, Building, 
    Target, List, Plane, PlaneTakeoff,
    Clock, Briefcase, Calendar, Shield, PieChart, Tag, 
    Image, Layout, MessageSquare, FileText, Smartphone, 
    Globe2, ExternalLink, ShieldCheck, DollarSign, Info, 
    Plus, Trash2, Check, AlertCircle, Search, Sparkles, 
    Building2, CreditCard, Home, MapPin, ArrowRight,
    School, BookOpen, Users, Heart, Layers, Settings, Loader2, ClipboardList
} from 'lucide-react';

import { toast } from 'sonner';
import { UniversityFormData, universityService } from '@/services/universityService';
import { getAll as getAllCountries, Country } from '@/app/services/countriesService';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DateInput } from "@/components/ui/date-input";

export interface UniversityFormProps {
    initialData?: any;
    isEdit?: boolean;
    initialTab?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    onAdd?: (data: any) => Promise<void>; // Backwards compatibility for dialog
}

export const UniversityForm: React.FC<UniversityFormProps> = ({
    initialData,
    isEdit = false,
    initialTab = 'basic-info',
    onSuccess,
    onCancel,
    onAdd
}) => {
    const router = useRouter();
    const { hasPermission: canModify } = usePermission('universities', isEdit ? 'edit' : 'create');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(initialTab);
    const searchParams = useSearchParams();

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
        if (isEdit && initialData?.id) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('tab', tabId);
            router.replace(`/universities/edit/${initialData.id}?${params.toString()}`, { scroll: false });
        }
    };
const defaultUniversityData: UniversityFormData = {
    // 1. BASIC INFORMATION
    name: '',
    city: '',
    country: '',
    region: '',
    university_type: 'Public',
    world_ranking: 0,
    national_ranking: 0,
    website: '',
    logo_url: '',
    established_year: new Date().getFullYear(),
    location: '',
    
    // 2. ADMISSIONS
    acceptance_rate: 0,
    application_fee: 0,
    application_deadline: '',
    application_deadline_fall: '',
    application_deadline_spring: '',
    min_gpa: 0,
    avg_gpa: '',
    english_requirement: '',
    min_ielts: 0,
    min_toefl: 0,
    min_gre: 0,
    min_gmat: 0,
    admission_difficulty: 'Moderate',
    
    // 3. STUDENT BODY
    total_students: 0,
    international_students: 0,
    international_ratio: 0,
    international_students_percentage: 0,
    gender_ratio: '',
    student_faculty_ratio: '',
    popular_programs: [],
    
    // 4. COSTS
    tuition_fees: 0,
    tuition_fees_min: 0,
    tuition_fees_max: 0,
    living_cost: 0,
    living_cost_min: 0,
    living_cost_max: 0,
    total_annual_cost: 0,
    financial_aid_available: true,
    financial_aid_details: '',
    scholarships_info: '',
    
    // 5. ACADEMIC & CAREER
    research_rating: 'High',
    research_funding: 0,
    campus_size: '',
    graduate_outcome_rate: 0,
    employment_rate: 0,
    average_starting_salary: 0,
    top_recruiters: [],
    career_services: '',
    
    // 6. PROGRAM STRUCTURE
    degree_levels: [],
    credit_system: '',
    undergraduate_duration: 0,
    undergraduate_credits: 0,
    graduate_duration: 0,
    graduate_programs: [],
    internship_available: true,
    industry_partners: [],
    
    // 7. CAMPUS LIFE
    campus_facilities: [],
    housing_available: true,
    housing_types: '',
    student_orgs_count: 0,
    varsity_sports_count: 0,
    on_campus_living_percentage: 0,
    countries_represented: 0,
    
    // 8. CONTENT
    description: '',
    overview: '',
    academic_programs_content: '',
    admissions_content: '',
    financial_aid_content: '',
    campus_life_content: '',
    career_outcomes_content: '',
    research_content: '',
    key_facts: [],
    pros: [],
    cons: [],
    
    // 9. MEDIA
    university_logo: '',
    university_banner: '',
    gallery_images: [],
    video_tour_url: '',
    campus_map_url: '',
    hero_image: '',
    
    // 10. AI / DECISION FIELDS
    roi_rating: 'Medium',
    prestige_level: 'Mid Tier',
    tags: [],
    ai_context_summary: '',
    key_selling_points: [],
    
    // 11. SYSTEM / CONTROL
    application_status: 'open',
    status: 'active',
    visible: true,
    is_featured: false,
    display_order: 0,
    admin_notes: '',
    slug: '',
    meta_title: '',
    meta_description: '',
};
    const [formData, setFormData] = useState<UniversityFormData>(defaultUniversityData);

    const [activeSection, setActiveSection] = useState('overview');
    const [countries, setCountries] = useState<Country[]>([]);
    const [availableCities, setAvailableCities] = useState<string[]>([]);

    // Fetch countries on mount
    React.useEffect(() => {
        const fetchCountries = async () => {
            try {
                setIsLoading(true);
                const response = await getAllCountries();
                console.log("[UniversityForm] Fetched countries:", response);
                
                // Robustly handle both { data: [...] } and direct array [...] responses
                let countryList = [];
                if (Array.isArray(response)) {
                    countryList = response;
                } else if (response && Array.isArray(response.data)) {
                    countryList = response.data;
                } else if (response && response.countries && Array.isArray(response.countries)) {
                    countryList = response.countries;
                }

                if (countryList.length > 0) {
                    setCountries(countryList);
                    console.log(`[UniversityForm] Successfully loaded ${countryList.length} countries`);
                } else {
                    console.warn("[UniversityForm] No countries found in API response");
                }
            } catch (error) {
                console.error("[UniversityForm] Failed to fetch countries:", error);
                toast.error("Failed to load countries list");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCountries();
    }, []);

    // Update cities when country changes
    React.useEffect(() => {
        if (formData.country && countries.length > 0) {
            // Find by name (display name) or country_name (case-insensitive and trimmed)
            const searchName = formData.country.toLowerCase().trim();
            const selectedCountry = countries.find(c => 
                (c.name && c.name.toLowerCase().trim() === searchName) || 
                (c.country_name && c.country_name.toLowerCase().trim() === searchName)
            );
            
            if (selectedCountry) {
                const cities = selectedCountry.popular_cities || [];
                // Sort cities alphabetically
                const sortedCities = Array.isArray(cities) ? [...cities].sort() : [];
                setAvailableCities(sortedCities);
                console.log(`[UniversityForm] Found country ${selectedCountry.name}, loaded ${sortedCities.length} cities`);
            } else {
                console.warn(`[UniversityForm] No match found for country: ${formData.country}`);
                setAvailableCities([]);
            }
        } else {
            setAvailableCities([]);
        }
    }, [formData.country, countries]);

    // Normalize data from backend to match form state
    const normalizeUniversityData = (data: any): Partial<UniversityFormData> => {
        if (!data) return {};
        
        // Handle common API response wrappers: res.data or res.university
        const sourceData = data.data || data.university || data;
        const normalized: any = { ...sourceData };
        
        // Handle common backend -> frontend field mismatches with explicit presence checks
        if (sourceData.country_name !== undefined) normalized.country = sourceData.country_name;
        if (sourceData.type !== undefined) normalized.university_type = sourceData.type;
        if (sourceData.tuition !== undefined) normalized.tuition_fees = sourceData.tuition;
        if (sourceData.year_established !== undefined) normalized.established_year = sourceData.year_established;
        if (sourceData.world_rank !== undefined) normalized.world_ranking = sourceData.world_rank;
        if (sourceData.national_rank !== undefined) normalized.national_ranking = sourceData.national_rank;
        
        // Handle camelCase vs snake_case mismatches comprehensively
        const mappings: Record<string, string> = {
            'acceptanceRate': 'acceptance_rate',
            'applicationStatus': 'application_status',
            'isFeatured': 'is_featured',
            'displayOrder': 'display_order',
            'metaTitle': 'meta_title',
            'metaDescription': 'meta_description',
            'studentFacultyRatio': 'student_faculty_ratio',
            'genderRatio': 'gender_ratio',
            'applicationDeadline': 'application_deadline',
            'avgGpa': 'avg_gpa',
            'englishRequirement': 'english_requirement',
            'employmentRate': 'employment_rate',
            'averageStartingSalary': 'average_starting_salary',
            'researchRating': 'research_rating',
            'researchFunding': 'research_funding',
            'campusSize': 'campus_size',
            'undergraduateDuration': 'undergraduate_duration',
            'undergraduateCredits': 'undergraduate_credits',
            'graduateDuration': 'graduate_duration',
            'studentOrgsCount': 'student_orgs_count',
            'varsitySportsCount': 'varsity_sports_count',
            'onCampusLivingPercentage': 'on_campus_living_percentage',
            'countriesRepresented': 'countries_represented',
            'housingAvailable': 'housing_available',
            'financialAidAvailable': 'financial_aid_available',
            'prestigeLevel': 'prestige_level',
            'roiRating': 'roi_rating'
        };

        Object.entries(mappings).forEach(([camel, snake]) => {
            if (sourceData[camel] !== undefined && sourceData[snake] === undefined) {
                normalized[snake] = sourceData[camel];
            }
        });
        
        // Ensure numbers are numbers
        const numberFields = [
            'world_ranking', 'national_ranking', 'established_year', 'acceptance_rate', 
            'application_fee', 'min_gpa', 'min_ielts', 'min_toefl', 'min_gre', 'min_gmat',
            'total_students', 'international_students', 'international_ratio', 
            'international_students_percentage', 'tuition_fees', 'tuition_fees_min', 
            'tuition_fees_max', 'living_cost', 'living_cost_min', 'living_cost_max', 
            'total_annual_cost', 'research_funding', 'graduate_outcome_rate', 
            'employment_rate', 'average_starting_salary', 'undergraduate_duration', 
            'undergraduate_credits', 'graduate_duration', 'student_orgs_count', 
            'varsity_sports_count', 'on_campus_living_percentage', 'countries_represented'
        ];
        
        numberFields.forEach(field => {
            if (normalized[field] !== undefined && typeof normalized[field] === 'string') {
                const val = parseFloat(normalized[field]);
                normalized[field] = isNaN(val) ? 0 : val;
            }
        });

        // Ensure arrays are arrays
        const arrayFields = [
            'popular_programs', 'top_recruiters', 'degree_levels', 'graduate_programs',
            'industry_partners', 'campus_facilities', 'key_facts', 'pros', 'cons',
            'gallery_images', 'tags', 'key_selling_points'
        ];

        arrayFields.forEach(field => {
            if (normalized[field] && typeof normalized[field] === 'string') {
                try {
                    normalized[field] = JSON.parse(normalized[field]);
                } catch (e) {
                    normalized[field] = [normalized[field]];
                }
            } else if (!normalized[field]) {
                normalized[field] = [];
            }
        });

        return normalized;
    };

    // Denormalize data from form state to match backend schema
    const denormalizeUniversityData = (data: UniversityFormData): any => {
        const denormalized: any = { ...data };
        
        // Map frontend back to backend naming
        if (data.university_type !== undefined) denormalized.type = data.university_type;
        if (data.established_year !== undefined) denormalized.year_established = data.established_year;
        if (data.world_ranking !== undefined) denormalized.world_rank = data.world_ranking;
        if (data.national_ranking !== undefined) denormalized.national_rank = data.national_ranking;
        if (data.tuition_fees !== undefined) denormalized.tuition = data.tuition_fees;
        
        // Resolve country_id
        if (data.country && countries.length > 0) {
            const matched = countries.find(c => 
                (c.name && String(c.name).toLowerCase() === String(data.country).toLowerCase()) || 
                (c.country_name && String(c.country_name).toLowerCase() === String(data.country).toLowerCase())
            );
            if (matched) {
                denormalized.country_id = matched.id;
            }
        }
        
        // Handle common camelCase mappings the backend might expect
        denormalized.acceptanceRate = data.acceptance_rate;
        denormalized.applicationStatus = data.application_status;
        denormalized.isFeatured = data.is_featured;
        denormalized.displayOrder = data.display_order;
        denormalized.metaTitle = data.meta_title;
        denormalized.metaDescription = data.meta_description;
        denormalized.studentFacultyRatio = data.student_faculty_ratio;
        denormalized.genderRatio = data.gender_ratio;
        denormalized.applicationDeadline = data.application_deadline;
        denormalized.avgGpa = data.avg_gpa;
        denormalized.englishRequirement = data.english_requirement;
        denormalized.employmentRate = data.employment_rate;
        denormalized.averageStartingSalary = data.average_starting_salary;
        denormalized.researchRating = data.research_rating;
        denormalized.researchFunding = data.research_funding;
        denormalized.campusSize = data.campus_size;
        denormalized.undergraduateDuration = data.undergraduate_duration;
        denormalized.undergraduateCredits = data.undergraduate_credits;
        denormalized.graduateDuration = data.graduate_duration;
        denormalized.studentOrgsCount = data.student_orgs_count;
        denormalized.varsitySportsCount = data.varsity_sports_count;
        denormalized.onCampusLivingPercentage = data.on_campus_living_percentage;
        denormalized.countriesRepresented = data.countries_represented;
        denormalized.housingAvailable = data.housing_available;
        denormalized.financialAidAvailable = data.financial_aid_available;
        denormalized.prestigeLevel = data.prestige_level;
        denormalized.roiRating = data.roi_rating;

        return denormalized;
    };

    React.useEffect(() => {
        if (isEdit && initialData) {
            console.log("[UniversityForm] Syncing initialData with normalization", initialData);
            const normalized = normalizeUniversityData(initialData);
            
            // Special handling for country name resolution if only ID is present
            let finalCountry = normalized.country || '';
            if (!finalCountry && initialData.country_id && countries.length > 0) {
                const matched = countries.find(c => String(c.id) === String(initialData.country_id));
                if (matched) {
                    console.log("[UniversityForm] Resolved country_id to name:", matched.name);
                    finalCountry = matched.name;
                }
            }

            setFormData(prev => ({
                ...defaultUniversityData,
                ...normalized,
                country: finalCountry || prev.country // Keep existing if resolved
            }));
        }
    }, [isEdit, initialData, countries]); // Re-run when countries load to resolve IDs

    const handleChange = (field: keyof UniversityFormData, value: any) => {
        if (!canModify) return;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: keyof UniversityFormData, index: number, value: string) => {
        if (!canModify) return;
        const arr = [...(formData[field] as string[])];
        arr[index] = value;
        handleChange(field, arr);
    };

    const addArrayItem = (field: keyof UniversityFormData, value: string = '') => {
        if (!canModify) return;
        const arr = [...(formData[field] as string[])];
        arr.push(value);
        handleChange(field, arr);
    };

    const removeArrayItem = (field: keyof UniversityFormData, index: number) => {
        if (!canModify) return;
        const arr = [...(formData[field] as string[])];
        arr.splice(index, 1);
        handleChange(field, arr);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!canModify) return;
        setIsLoading(true);

        try {
            if (!formData.name || !formData.city || !formData.country) {
                toast.error("Required fields: Name, City, Country");
                setIsLoading(false);
                return;
            }

            const payload = denormalizeUniversityData(formData);
            console.log("[UniversityForm] Submitting payload:", payload);

            if (onAdd) {
                await onAdd(payload);
            } else {
                if (isEdit && initialData?.id) {
                    await universityService.update(initialData.id, payload);
                    toast.success("University updated successfully");
                } else {
                    await universityService.create(payload);
                    toast.success("University added successfully");
                }
            }

            if (onSuccess) onSuccess();
            else router.push('/universities');
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Failed to save university";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'basic-info', label: 'BASIC INFORMATION', icon: Globe },
        { id: 'admissions', label: 'ADMISSIONS', icon: UserCheck },
        { id: 'student-body', label: 'STUDENT BODY', icon: Users },
        { id: 'costs', label: 'COSTS', icon: TrendingUp },
        { id: 'academic', label: 'ACADEMIC & CAREER', icon: GraduationCap },
        { id: 'program', label: 'PROGRAM STRUCTURE', icon: BookOpen },
        { id: 'campus-life', label: 'CAMPUS LIFE', icon: Heart },
        { id: 'content', label: 'CONTENT', icon: FileText },
        { id: 'media', label: 'MEDIA', icon: Image },
        { id: 'ai-fields', label: 'AI / DECISION FIELDS', icon: Target },
        { id: 'system', label: 'SYSTEM / CONTROL', icon: Settings },
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
                        <h1 className="text-2xl font-bold text-[#0f172b]">
                            {isEdit ? 'Edit University' : 'Add New University'}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                            <School size={13} />
                            Complete all 11 tabs for high-fidelity AI matching and comparison
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
                    <PermissionGuard module="universities" action={isEdit ? 'edit' : 'create'}>
                        <button 
                            onClick={handleSubmit}
                            disabled={isLoading || !canModify}
                            className="px-6 h-11 bg-[#0f172b] text-white rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
                        >
                            {isLoading ? 'Saving...' : (
                                <>
                                    <Save size={16} />
                                    {isEdit ? 'Update Institution' : 'Publish Institution'}
                                </>
                            )}
                        </button>
                    </PermissionGuard>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-100 flex overflow-x-auto no-scrollbar mb-8 sticky top-4 z-10 backdrop-blur-md bg-white/90">
                <div className="flex p-1 gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all text-[12px] ${
                                activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <tab.icon size={14} />
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
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Building2 size={16} /></span>
                                Identity & Logo
                            </h2>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">University Name *</Label>
                                    <Input 
                                        className="h-[44px]"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="Full formal name"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Logo URL</Label>
                                        <Input 
                                            className="h-[44px]"
                                            value={formData.logo_url}
                                            onChange={(e) => handleChange('logo_url', e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Website</Label>
                                        <Input 
                                            className="h-[44px]"
                                            value={formData.website}
                                            onChange={(e) => handleChange('website', e.target.value)}
                                            placeholder="www.univ.edu"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">University Type</Label>
                                        <Select 
                                            disabled={!canModify}
                                            value={formData.university_type || undefined} 
                                            onValueChange={(v) => handleChange('university_type', v)}
                                        >
                                            <SelectTrigger className="h-[44px]">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Public">Public</SelectItem>
                                                <SelectItem value="Private">Private</SelectItem>
                                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Year Established</Label>
                                        <Input 
                                            type="number"
                                            className="h-[44px]"
                                            value={formData.established_year}
                                            onChange={(e) => handleChange('established_year', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Globe size={16} /></span>
                                Location & Ranking
                            </h2>
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Country *</Label>
                                        <Select 
                                            disabled={!canModify}
                                            value={formData.country || undefined} 
                                            onValueChange={(v) => handleChange('country', v)}
                                        >
                                            <SelectTrigger className="h-[44px]">
                                                <SelectValue placeholder="Select Country" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {countries.filter(c => c.name && c.name.trim() !== '').map(c => (
                                                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">City *</Label>
                                        {formData.country && availableCities.length === 0 ? (
                                            <div className="space-y-1">
                                                <Input 
                                                    value={formData.city || ''} 
                                                    onChange={(e) => handleChange('city', e.target.value)}
                                                    placeholder="Type City Name"
                                                    className="h-[44px]"
                                                />
                                                <p className="text-[10px] text-slate-400 italic px-1">
                                                    Enter city manually (none found in database)
                                                </p>
                                            </div>
                                        ) : (
                                            <Select 
                                                value={formData.city || undefined} 
                                                onValueChange={(v) => handleChange('city', v)}
                                                disabled={!formData.country || !canModify}
                                            >
                                                <SelectTrigger className="h-[44px]">
                                                    <SelectValue placeholder={!formData.country ? "Select country first" : "Select City"} />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {availableCities.length > 0 ? (
                                                        availableCities
                                                            .filter(city => city && typeof city === 'string' && city.trim() !== '')
                                                            .map(city => (
                                                                <SelectItem key={city} value={city}>{city}</SelectItem>
                                                            ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            {formData.country ? "No cities available" : "Select country first"}
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Full Location Address</Label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input 
                                            className="pl-10 h-[44px]"
                                            value={formData.location}
                                            onChange={(e) => handleChange('location', e.target.value)}
                                            placeholder="Street, Campus, Area"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Primary Region</Label>
                                    <Select 
                                        disabled={!canModify}
                                        value={formData.region || undefined} 
                                        onValueChange={(v) => handleChange('region', v)}
                                    >
                                        <SelectTrigger className="h-[44px]">
                                            <SelectValue placeholder="Select region" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {['North America', 'Europe', 'Asia', 'Oceania', 'Africa', 'Middle East'].map(r => (
                                                <SelectItem key={r} value={r}>{r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-slate-500 uppercase">Global Ranking</Label>
                                        <div className="flex items-center gap-3">
                                            <Input 
                                                type="number"
                                                className="h-[52px] text-xl font-bold text-indigo-700 bg-indigo-50/30 border-indigo-100 rounded-xl"
                                                value={formData.world_ranking}
                                                onChange={(e) => handleChange('world_ranking', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-slate-500 uppercase">National Ranking</Label>
                                        <div className="flex items-center gap-3">
                                            <Input 
                                                type="number"
                                                className="h-[52px] text-xl font-bold text-emerald-700 bg-emerald-50/30 border-emerald-100 rounded-xl"
                                                value={formData.national_ranking}
                                                onChange={(e) => handleChange('national_ranking', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. ADMISSIONS */}
                {activeTab === 'admissions' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><UserCheck size={16} /></span>
                                Selectivity & Deadlines
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-slate-500 uppercase">Acceptance Rate (%)</Label>
                                    <div className="relative">
                                        <TrendingUp size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                                        <Input 
                                            type="number"
                                            className="pl-10 h-[52px] text-xl font-bold text-orange-700 bg-orange-50/30 border-orange-100 rounded-xl"
                                            value={formData.acceptance_rate}
                                            onChange={(e) => handleChange('acceptance_rate', parseFloat(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <DateInput
                                        label="Primary Application Deadline"
                                        value={formData.application_deadline}
                                        onValueChange={(v) => handleChange('application_deadline', v)}
                                        placeholder="Select deadline"
                                        className="rounded-xl border-slate-200"
                                        disabled={!canModify}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-slate-500">Fall Session</Label>
                                        <Input 
                                            className="h-[40px] rounded-xl"
                                            value={formData.application_deadline_fall}
                                            onChange={(e) => handleChange('application_deadline_fall', e.target.value)}
                                            placeholder="e.g. Jan 15"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-slate-500">Spring Session</Label>
                                        <Input 
                                            className="h-[40px] rounded-xl"
                                            value={formData.application_deadline_spring}
                                            onChange={(e) => handleChange('application_deadline_spring', e.target.value)}
                                            placeholder="e.g. Oct 1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Target size={16} /></span>
                                Academic Requirements
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-slate-500 uppercase">Average GPA (Range/Text)</Label>
                                    <div className="relative">
                                        <GraduationCap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                                        <Input 
                                            className="pl-10 h-[44px] rounded-xl font-medium border-slate-200"
                                            value={formData.avg_gpa}
                                            onChange={(e) => handleChange('avg_gpa', e.target.value)}
                                            placeholder="e.g. 3.5 - 4.0 or Upper Second Class"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-slate-500 uppercase">English Proficiency Requirement</Label>
                                    <div className="relative">
                                        <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
                                        <Input 
                                            className="pl-10 h-[44px] rounded-xl font-medium border-slate-200"
                                            value={formData.english_requirement}
                                            onChange={(e) => handleChange('english_requirement', e.target.value)}
                                            placeholder="e.g. IELTS 6.5 (min 6.0) or equivalent"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Minimum Thresholds</Label>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-500">Min GPA (Value)</Label>
                                            <Input type="number" step="0.1" className="h-[38px] rounded-lg" value={formData.min_gpa} onChange={(e) => handleChange('min_gpa', parseFloat(e.target.value))} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-500">Min IELTS</Label>
                                            <Input type="number" step="0.5" className="h-[38px] rounded-lg" value={formData.min_ielts} onChange={(e) => handleChange('min_ielts', parseFloat(e.target.value))} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. STUDENT BODY */}
                {activeTab === 'student-body' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center"><Users size={16} /></span>
                                Population & Diversity
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-slate-500 uppercase">Total Students</Label>
                                    <div className="relative">
                                        <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" />
                                        <Input 
                                            type="number"
                                            className="pl-10 h-[52px] text-xl font-bold text-cyan-700 bg-cyan-50/30 border-cyan-100 rounded-xl"
                                            value={formData.total_students}
                                            onChange={(e) => handleChange('total_students', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-slate-500">International Students</Label>
                                        <Input 
                                            type="number"
                                            className="h-[40px] rounded-xl"
                                            value={formData.international_students}
                                            onChange={(e) => handleChange('international_students', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-slate-500">International Ratio (%)</Label>
                                        <Input 
                                            type="number"
                                            className="h-[40px] rounded-xl"
                                            value={formData.international_students_percentage || formData.international_ratio}
                                            onChange={(e) => {
                                                handleChange('international_students_percentage', parseFloat(e.target.value));
                                                handleChange('international_ratio', parseFloat(e.target.value));
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Student-Faculty Ratio</Label>
                                        <Input 
                                            className="h-[44px] rounded-xl"
                                            value={formData.student_faculty_ratio}
                                            onChange={(e) => handleChange('student_faculty_ratio', e.target.value)}
                                            placeholder="e.g. 15:1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Gender Ratio (M:F)</Label>
                                        <Input 
                                            className="h-[44px] rounded-xl"
                                            value={formData.gender_ratio}
                                            onChange={(e) => handleChange('gender_ratio', e.target.value)}
                                            placeholder="e.g. 48:52"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><BookOpen size={16} /></span>
                                Popular Programs
                            </h2>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input 
                                        id="new-program"
                                        className="h-[44px] rounded-xl"
                                        placeholder="Add popular program..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const input = e.currentTarget;
                                                if (input.value.trim()) {
                                                    addArrayItem('popular_programs', input.value.trim());
                                                    input.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        className="h-[44px] w-[44px] rounded-xl p-0 border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                                        onClick={() => {
                                            const input = document.getElementById('new-program') as HTMLInputElement;
                                            if (input && input.value.trim()) {
                                                addArrayItem('popular_programs', input.value.trim());
                                                input.value = '';
                                            }
                                        }}
                                    >
                                        <Plus size={18} />
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {formData.popular_programs && formData.popular_programs.length > 0 ? (
                                        formData.popular_programs.map((program, idx) => (
                                            <div 
                                                key={idx} 
                                                className="group flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 hover:border-indigo-300 transition-all"
                                            >
                                                <span>{program}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeArrayItem('popular_programs', idx)}
                                                    className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-indigo-600 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-full py-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2">
                                            <Sparkles size={24} className="opacity-20" />
                                            <p className="text-xs font-medium">No programs added yet</p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 italic mt-4 italic">These programs will be highlighted on the university profile page.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. COSTS */}
                {/* 4. COSTS */}
                {activeTab === 'costs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><DollarSign size={16} /></span>
                                Annual Expenses
                            </h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-slate-500 uppercase">Tuition Fees ($)</Label>
                                        <Input 
                                            type="number" 
                                            className="h-[52px] text-xl font-bold border-emerald-100 bg-emerald-50/10 rounded-xl" 
                                            value={formData.tuition_fees} 
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                handleChange('tuition_fees', val);
                                                handleChange('total_annual_cost', val + formData.living_cost);
                                            }} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-slate-500 uppercase">Living Cost ($)</Label>
                                        <Input 
                                            type="number" 
                                            className="h-[52px] text-xl font-bold border-indigo-100 bg-indigo-50/10 rounded-xl" 
                                            value={formData.living_cost} 
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                handleChange('living_cost', val);
                                                handleChange('total_annual_cost', val + formData.tuition_fees);
                                            }} 
                                        />
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-900 rounded-[20px] text-white">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Estimated Annual Cost</Label>
                                    <div className="flex items-end justify-between">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-emerald-400">$</span>
                                            <Input 
                                                type="number" 
                                                className="bg-transparent border-none text-3xl font-bold text-white p-0 h-auto focus-visible:ring-0 w-32"
                                                value={formData.total_annual_cost} 
                                                onChange={(e) => handleChange('total_annual_cost', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="text-[10px] text-slate-500 text-right uppercase">Auto-calculated<br/>(Override enabled)</div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Detailed Range (Optional)</Label>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-500">Min Tuition</Label>
                                            <Input type="number" className="h-[38px] rounded-lg" value={formData.tuition_fees_min} onChange={(e) => handleChange('tuition_fees_min', parseFloat(e.target.value))} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-500">Max Tuition</Label>
                                            <Input type="number" className="h-[38px] rounded-lg" value={formData.tuition_fees_max} onChange={(e) => handleChange('tuition_fees_max', parseFloat(e.target.value))} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Sparkles size={16} /></span>
                                Financial Aid & Awards
                            </h2>
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                                    <Checkbox 
                                        id="financial-aid" 
                                        checked={formData.financial_aid_available} 
                                        onCheckedChange={(v) => handleChange('financial_aid_available', !!v)}
                                    />
                                    <Label htmlFor="financial-aid" className="text-sm font-semibold cursor-pointer text-amber-900">Financial Aid Programs Available</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Financial Aid Details</Label>
                                    <textarea 
                                        className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-sm focus:border-amber-500 outline-none transition-all"
                                        placeholder="Eligibility criteria, application process, etc..."
                                        value={formData.financial_aid_details}
                                        onChange={(e) => handleChange('financial_aid_details', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Scholarships & Grants</Label>
                                    <textarea 
                                        className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-sm focus:border-amber-500 outline-none transition-all"
                                        placeholder="MERIT based awards, partial tuition waivers..."
                                        value={formData.scholarships_info}
                                        onChange={(e) => handleChange('scholarships_info', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. ACADEMIC & CAREER */}
                {activeTab === 'academic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center"><GraduationCap size={16} /></span>
                                Research & Campus
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Research Rating</Label>
                                    <Select value={formData.research_rating || undefined} onValueChange={(v) => handleChange('research_rating', v)}>
                                        <SelectTrigger className="h-[44px] rounded-xl">
                                            <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {['Very High', 'High', 'Medium', 'Emerging'].map(r => (
                                                <SelectItem key={r} value={r}>{r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400 uppercase">Research Funding ($)</Label>
                                        <Input 
                                            type="number" 
                                            className="h-[44px] rounded-xl font-semibold border-violet-100" 
                                            value={formData.research_funding} 
                                            onChange={(e) => handleChange('research_funding', parseFloat(e.target.value))} 
                                            placeholder="Annual funding..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400 uppercase">Campus Size</Label>
                                        <Input 
                                            className="h-[44px] rounded-xl border-slate-200" 
                                            value={formData.campus_size} 
                                            onChange={(e) => handleChange('campus_size', e.target.value)} 
                                            placeholder="e.g. 200 Acres"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Career Services</Label>
                                    <textarea 
                                        className="w-full min-h-[100px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-violet-100 focus:border-violet-600 outline-none transition-all"
                                        placeholder="Internship support, career fairs, resume clinics..."
                                        value={formData.career_services}
                                        onChange={(e) => handleChange('career_services', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Target size={16} /></span>
                                Career Outcomes
                            </h2>
                            <div className="space-y-6">
                                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employment Rate</Label>
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    type="number" 
                                                    className="h-[52px] text-2xl font-bold border-emerald-100 bg-white text-emerald-600 rounded-xl" 
                                                    value={formData.employment_rate} 
                                                    onChange={(e) => {
                                                        const val = parseFloat(e.target.value);
                                                        handleChange('employment_rate', val);
                                                        handleChange('graduate_outcome_rate', val); // Sync legacy field
                                                    }} 
                                                />
                                                <span className="text-xl font-bold text-slate-300">%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Starting Salary</Label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-slate-300">$</span>
                                                <Input 
                                                    type="number" 
                                                    className="h-[52px] text-2xl font-bold border-indigo-100 bg-white text-indigo-600 rounded-xl" 
                                                    value={formData.average_starting_salary} 
                                                    onChange={(e) => handleChange('average_starting_salary', parseFloat(e.target.value))} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-4 italic">Based on latest graduate survey data (within 6 months of graduation).</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Recruiters</h3>
                                        <Button size="sm" variant="ghost" className="text-violet-600 h-8 gap-1 p-0 hover:bg-transparent" onClick={() => addArrayItem('top_recruiters')}>
                                            <Plus size={14} /> Add Company
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {formData.top_recruiters.map((recruiter, idx) => (
                                            <div key={idx} className="group flex items-center gap-2">
                                                <div className="flex-1 relative">
                                                    <Briefcase size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <Input 
                                                        className="h-10 pl-9 rounded-lg border-slate-100 focus:border-violet-200"
                                                        value={recruiter}
                                                        onChange={(e) => handleArrayChange('top_recruiters', idx, e.target.value)}
                                                        placeholder="Company Name"
                                                    />
                                                </div>
                                                <Button size="icon" variant="ghost" className="text-slate-300 hover:text-red-500 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeArrayItem('top_recruiters', idx)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                        {formData.top_recruiters.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-50 rounded-xl">
                                                <p className="text-[10px] text-slate-400">No recruiters listed</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. PROGRAM STRUCTURE */}
                {activeTab === 'program' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center"><BookOpen size={16} /></span>
                                Undergraduate Studies
                            </h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400 uppercase">Duration (Years)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input 
                                                type="number" 
                                                className="h-[44px] rounded-xl font-semibold border-pink-100 bg-pink-50/10 text-pink-700" 
                                                value={formData.undergraduate_duration} 
                                                onChange={(e) => handleChange('undergraduate_duration', parseFloat(e.target.value))} 
                                            />
                                            <span className="text-xs font-medium text-slate-400">Yrs</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400 uppercase">Total Credits</Label>
                                        <Input 
                                            type="number" 
                                            className="h-[44px] rounded-xl font-semibold border-slate-200" 
                                            value={formData.undergraduate_credits} 
                                            onChange={(e) => handleChange('undergraduate_credits', parseFloat(e.target.value))} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Credit System & Standards</Label>
                                    <Input 
                                        className="h-[44px] rounded-xl"
                                        value={formData.credit_system}
                                        onChange={(e) => handleChange('credit_system', e.target.value)}
                                        placeholder="e.g. ECTS, US Credits, Semester System"
                                    />
                                </div>
                                <div className="pt-4 border-t border-slate-50">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Degree Levels Offered</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Undergraduate', 'Postgraduate', 'Doctorate', 'Vocational'].map(level => {
                                            const isChecked = formData.degree_levels.includes(level);
                                            return (
                                                <button 
                                                    key={level}
                                                    type="button"
                                                    onClick={() => {
                                                        const newLevels = isChecked 
                                                            ? formData.degree_levels.filter(l => l !== level)
                                                            : [...formData.degree_levels, level];
                                                        handleChange('degree_levels', newLevels);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${isChecked ? 'bg-pink-600 border-pink-600 text-white shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-pink-200'}`}
                                                >
                                                    {level}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Layers size={16} /></span>
                                Graduate Programs
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400 uppercase">Graduate Duration (Avg. Years)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="number" 
                                            className="h-[44px] rounded-xl font-semibold border-blue-100 bg-blue-50/10 text-blue-700" 
                                            value={formData.graduate_duration} 
                                            onChange={(e) => handleChange('graduate_duration', parseFloat(e.target.value))} 
                                        />
                                        <span className="text-xs font-medium text-slate-400">Yrs</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Graduate Program List</Label>
                                        <div className="relative group">
                                            <Input 
                                                id="new-grad-program"
                                                className="h-9 w-48 text-xs rounded-lg pr-8"
                                                placeholder="Add program..."
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const val = e.currentTarget.value.trim();
                                                        if (val) {
                                                            addArrayItem('graduate_programs', val);
                                                            e.currentTarget.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                            <Plus size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>
                                    
                                    <div className="min-h-[100px] p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <div className="flex flex-wrap gap-2">
                                            {formData.graduate_programs && formData.graduate_programs.length > 0 ? (
                                                formData.graduate_programs.map((prog, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm text-xs font-medium text-slate-600 group">
                                                        <span>{prog}</span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeArrayItem('graduate_programs', idx)}
                                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="w-full flex flex-col items-center justify-center py-4 text-slate-400 text-[10px] gap-2">
                                                    <Sparkles size={16} className="opacity-20" />
                                                    <span>No programs listed yet</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                                    <Checkbox 
                                        id="intern-req" 
                                        checked={formData.internship_available} 
                                        onCheckedChange={(v) => handleChange('internship_available', !!v)}
                                    />
                                    <Label htmlFor="intern-req" className="text-xs font-medium text-slate-600 cursor-pointer">Post-grad internship paths integrated</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. CAMPUS LIFE */}
                {activeTab === 'campus-life' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Student Organizations', field: 'student_orgs_count', icon: Users, color: 'rose', unit: '' },
                                { label: 'Varsity Sports', field: 'varsity_sports_count', icon: Target, color: 'orange', unit: '' },
                                { label: 'On-Campus Living', field: 'on_campus_living_percentage', icon: Home, color: 'indigo', unit: '%' },
                                { label: 'Countries Represented', field: 'countries_represented', icon: Globe, color: 'emerald', unit: '' },
                            ].map(({ label, field, icon: Icon, color, unit }) => (
                                <div key={field} className={`bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 space-y-3`}>
                                    <div className={`w-8 h-8 rounded-lg bg-${color}-50 text-${color}-600 flex items-center justify-center`}>
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{label}</Label>
                                        <div className="flex items-baseline gap-1">
                                            <Input
                                                type="number"
                                                className={`h-9 text-lg font-bold border-${color}-100 bg-${color}-50/10 text-${color}-700 rounded-lg p-2`}
                                                value={(formData as any)[field]}
                                                onChange={(e) => handleChange(field as any, parseFloat(e.target.value))}
                                            />
                                            {unit && <span className={`text-sm font-bold text-${color}-400`}>{unit}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Facilities + Housing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Heart size={16} /></span>
                                    Campus Facilities
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-slate-400">List key facilities available on campus</Label>
                                        <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-600 gap-1" onClick={() => addArrayItem('campus_facilities')}>
                                            <Plus size={12} /> Add
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.campus_facilities.map((fac, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <Input
                                                    className="h-9 text-xs rounded-lg border-slate-100 focus:border-rose-200"
                                                    value={fac}
                                                    onChange={(e) => handleArrayChange('campus_facilities', idx, e.target.value)}
                                                    placeholder="e.g. Olympic Swimming Pool, Library..."
                                                />
                                                <button type="button" className="text-slate-200 hover:text-red-500 transition-colors shrink-0" onClick={() => removeArrayItem('campus_facilities', idx)}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.campus_facilities.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-[10px] gap-2">
                                                <Heart size={16} className="opacity-20" />
                                                <span>No facilities listed</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><Home size={16} /></span>
                                    Housing & Residence
                                </h2>
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50/40 border border-orange-100">
                                        <Checkbox
                                            id="housing"
                                            checked={formData.housing_available}
                                            onCheckedChange={(v) => handleChange('housing_available', !!v)}
                                        />
                                        <Label htmlFor="housing" className="text-sm font-semibold cursor-pointer text-orange-900">On-Campus Housing Available</Label>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Housing Types & Details</Label>
                                        <textarea
                                            className="w-full min-h-[140px] p-4 border border-slate-200 rounded-xl text-sm focus:border-orange-400 outline-none transition-all"
                                            placeholder="Single rooms, En-suite, Shared apartments, Halls of Residence..."
                                            value={formData.housing_types}
                                            onChange={(e) => handleChange('housing_types', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 8. CONTENT */}
                {activeTab === 'content' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Section Editor */}
                        {(() => {
                            const contentSections = [
                                { key: 'overview', label: 'Overview', icon: FileText, color: 'slate', placeholder: 'A compelling overview of the university — its mission, vision, and what makes it unique...' },
                                { key: 'academic_programs_content', label: 'Academic Programs', icon: GraduationCap, color: 'violet', placeholder: 'Describe the breadth and depth of academic programs, specializations, and faculties...' },
                                { key: 'admissions_content', label: 'Admissions', icon: ClipboardList, color: 'blue', placeholder: 'Explain the admissions process, requirements, key dates, and selection criteria...' },
                                { key: 'financial_aid_content', label: 'Financial Aid', icon: DollarSign, color: 'emerald', placeholder: 'Detail available scholarships, bursaries, financial aid programs, and how to apply...' },
                                { key: 'campus_life_content', label: 'Campus Life', icon: Heart, color: 'rose', placeholder: 'Describe student life, clubs, events, accommodation, sports, and campus culture...' },
                                { key: 'career_outcomes_content', label: 'Career Outcomes', icon: Briefcase, color: 'orange', placeholder: 'Showcase graduate employment rates, top employers, career support services...' },
                                { key: 'research_content', label: 'Research', icon: Sparkles, color: 'indigo', placeholder: 'Highlight research centres, funded projects, notable research areas and innovations...' },
                            ];

                            const current = contentSections.find(s => s.key === activeSection)!;

                            return (
                                <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="flex">
                                        {/* Section Nav */}
                                        <div className="w-52 shrink-0 border-r border-slate-100 bg-slate-50/60 p-3 space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pt-1 pb-2">Page Sections</p>
                                            {contentSections.map(section => {
                                                const isActive = activeSection === section.key;
                                                const SIcon = section.icon;
                                                const filled = !!(formData as any)[section.key];
                                                return (
                                                    <button
                                                        key={section.key}
                                                        type="button"
                                                        onClick={() => setActiveSection(section.key)}
                                                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                                                            isActive
                                                                ? 'bg-white shadow-sm border border-slate-100 text-slate-900'
                                                                : 'text-slate-500 hover:bg-white/60'
                                                        }`}
                                                    >
                                                        <SIcon size={14} className={isActive ? `text-${section.color}-600` : 'text-slate-400'} />
                                                        <span className="text-xs font-medium truncate">{section.label}</span>
                                                        {filled && <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-${section.color}-400 shrink-0`} />}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Editor */}
                                        <div className="flex-1 p-8">
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className={`w-9 h-9 rounded-xl bg-${current.color}-50 text-${current.color}-600 flex items-center justify-center`}>
                                                    <current.icon size={18} />
                                                </div>
                                                <div>
                                                    <h2 className="text-base font-bold text-slate-900">{current.label}</h2>
                                                    <p className="text-[10px] text-slate-400">Rich text content for the university detail page</p>
                                                </div>
                                                {!!(formData as any)[current.key] && (
                                                    <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                                                        ✓ {((formData as any)[current.key] as string).length} chars
                                                    </span>
                                                )}
                                            </div>
                                            <textarea
                                                key={current.key}
                                                className={`w-full min-h-[360px] p-5 border border-slate-200 rounded-[16px] text-sm leading-relaxed focus:ring-2 focus:ring-${current.color}-100 focus:border-${current.color}-400 outline-none transition-all resize-none ${!canModify ? 'opacity-70 grayscale-[0.5]' : ''}`}
                                                placeholder={current.placeholder}
                                                value={(formData as any)[current.key]}
                                                onChange={(e) => handleChange(current.key as any, e.target.value)}
                                                disabled={!canModify}
                                            />
                                            <div className="flex justify-between items-center mt-3">
                                                <p className="text-[10px] text-slate-400">Supports markdown-style formatting. Changes are saved when you submit the form.</p>
                                                {(formData as any)[current.key] && (
                                                    <button type="button" onClick={() => handleChange(current.key as any, '')} className="text-[10px] text-slate-300 hover:text-red-400 transition-colors">Clear</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Pros / Cons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-emerald-50/30 rounded-[24px] p-8 border border-emerald-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                        <CheckCircle size={18} className="text-emerald-600" />
                                        Advantages (Pros)
                                    </h2>
                                    <Button size="sm" variant="ghost" className="text-emerald-700 h-8" onClick={() => addArrayItem('pros')}>
                                        <Plus size={14} /> Add Pro
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {formData.pros.map((pro, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input className="h-10 bg-white border-emerald-100 focus:border-emerald-600" value={pro} onChange={(e) => handleArrayChange('pros', idx, e.target.value)} placeholder="e.g. World-class research facilities" />
                                            <Button size="icon" variant="ghost" className="text-emerald-300 hover:text-emerald-600 shrink-0" onClick={() => removeArrayItem('pros', idx)}>
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                    {formData.pros.length === 0 && (
                                        <p className="text-[10px] text-emerald-400 text-center py-4">No pros added yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-rose-50/30 rounded-[24px] p-8 border border-rose-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-rose-900 flex items-center gap-2">
                                        <AlertCircle size={18} className="text-rose-600" />
                                        Challenges (Cons)
                                    </h2>
                                    <Button size="sm" variant="ghost" className="text-rose-700 h-8" onClick={() => addArrayItem('cons')}>
                                        <Plus size={14} /> Add Con
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {formData.cons.map((con, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input className="h-10 bg-white border-rose-100 focus:border-rose-600" value={con} onChange={(e) => handleArrayChange('cons', idx, e.target.value)} placeholder="e.g. High cost of living" />
                                            <Button size="icon" variant="ghost" className="text-rose-300 hover:text-rose-600 shrink-0" onClick={() => removeArrayItem('cons', idx)}>
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                    {formData.cons.length === 0 && (
                                        <p className="text-[10px] text-rose-400 text-center py-4">No cons added yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 9. MEDIA */}
                {activeTab === 'media' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Logo + Banner Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Logo */}
                            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-5 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center"><Image size={16} /></span>
                                    University Logo
                                </h2>
                                <div className="space-y-4">
                                    {/* Preview */}
                                    <div className="h-28 w-28 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden mb-2">
                                        {formData.university_logo ? (
                                            <img src={formData.university_logo} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-slate-300">
                                                <Image size={24} />
                                                <span className="text-[10px]">No logo</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logo Image URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                className="h-10 rounded-xl text-xs"
                                                value={formData.university_logo}
                                                onChange={(e) => handleChange('university_logo', e.target.value)}
                                                placeholder="https://example.com/logo.png"
                                            />
                                            {formData.university_logo && (
                                                <button type="button" onClick={() => handleChange('university_logo', '')} className="shrink-0 text-slate-300 hover:text-red-400 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400">Recommended: square PNG/SVG, min 200×200px</p>
                                    </div>
                                </div>
                            </div>

                            {/* Banner */}
                            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                                <h2 className="text-lg font-bold text-[#0f172b] mb-5 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Layout size={16} /></span>
                                    University Banner
                                </h2>
                                <div className="space-y-4">
                                    {/* Preview */}
                                    <div className="h-28 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                                        {formData.university_banner ? (
                                            <img src={formData.university_banner} alt="Banner" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-slate-300">
                                                <Layout size={24} />
                                                <span className="text-[10px]">No banner</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Banner Image URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                className="h-10 rounded-xl text-xs"
                                                value={formData.university_banner}
                                                onChange={(e) => handleChange('university_banner', e.target.value)}
                                                placeholder="https://example.com/banner.jpg"
                                            />
                                            {formData.university_banner && (
                                                <button type="button" onClick={() => handleChange('university_banner', '')} className="shrink-0 text-slate-300 hover:text-red-400 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400">Recommended: 1200×400px, landscape orientation</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#0f172b] flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Image size={16} /></span>
                                    Campus Gallery
                                    <span className="text-xs font-normal text-slate-400 ml-1">({formData.gallery_images.length} images)</span>
                                </h2>
                                <Button size="sm" variant="outline" className="h-9 text-xs border-dashed gap-1.5" onClick={() => addArrayItem('gallery_images')}>
                                    <Plus size={14} /> Add Image
                                </Button>
                            </div>

                            {formData.gallery_images.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 gap-3">
                                    <Image size={32} className="opacity-30" />
                                    <div className="text-center">
                                        <p className="text-sm font-medium">No gallery images yet</p>
                                        <p className="text-xs mt-1">Add image URLs to build your campus gallery</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="mt-2 border-dashed gap-1" onClick={() => addArrayItem('gallery_images')}>
                                        <Plus size={14} /> Add First Image
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.gallery_images.map((img, idx) => (
                                        <div key={idx} className="group space-y-2">
                                            {/* Preview */}
                                            <div className="h-36 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center relative">
                                                {img ? (
                                                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 text-slate-300">
                                                        <Image size={20} />
                                                        <span className="text-[10px]">Paste URL below</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('gallery_images', idx)}
                                                        className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">#{idx + 1}</span>
                                            </div>
                                            <Input
                                                className="h-9 text-xs rounded-lg bg-slate-50 border-slate-100"
                                                value={img}
                                                onChange={(e) => handleArrayChange('gallery_images', idx, e.target.value)}
                                                placeholder="https://example.com/campus-photo.jpg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Other URLs */}
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Additional Media Links</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">Hero Image URL</Label>
                                    <Input className="h-10 text-xs rounded-xl" value={formData.hero_image} onChange={(e) => handleChange('hero_image', e.target.value)} placeholder="Hero / profile image..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">Video / Virtual Tour URL</Label>
                                    <Input className="h-10 text-xs rounded-xl" value={formData.video_tour_url} onChange={(e) => handleChange('video_tour_url', e.target.value)} placeholder="YouTube / Vimeo link..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">Campus Map URL</Label>
                                    <Input className="h-10 text-xs rounded-xl" value={formData.campus_map_url} onChange={(e) => handleChange('campus_map_url', e.target.value)} placeholder="Google Maps / embed link..." />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 10. AI / DECISION FIELDS */}
                {activeTab === 'ai-fields' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Decision Scores Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* ROI Score */}
                            <div className="bg-[#0f172b] rounded-[24px] p-6 shadow-xl text-white border border-slate-800 relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-600/10 blur-[60px] rounded-full -mr-10 -mt-10" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp size={16} className="text-emerald-400" />
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ROI Score</span>
                                    </div>
                                    <Select value={formData.roi_rating || undefined} onValueChange={(v) => handleChange('roi_rating', v)}>
                                        <SelectTrigger className="h-[48px] bg-slate-900 border-slate-700 text-white rounded-xl">
                                            <SelectValue placeholder="Select ROI" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0f172b] border-slate-700 text-white">
                                            <SelectItem value="High">🟢 High</SelectItem>
                                            <SelectItem value="Medium">🟡 Medium</SelectItem>
                                            <SelectItem value="Low">🔴 Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-slate-500 mt-2">Influences Smart Match recommendation scores</p>
                                </div>
                            </div>

                            {/* Prestige Level */}
                            <div className="bg-[#0f172b] rounded-[24px] p-6 shadow-xl text-white border border-slate-800 relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-violet-600/10 blur-[60px] rounded-full -mr-10 -mt-10" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles size={16} className="text-violet-400" />
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prestige Level</span>
                                    </div>
                                    <Select value={formData.prestige_level || undefined} onValueChange={(v) => handleChange('prestige_level', v)}>
                                        <SelectTrigger className="h-[48px] bg-slate-900 border-slate-700 text-white rounded-xl">
                                            <SelectValue placeholder="Select Tier" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0f172b] border-slate-700 text-white">
                                            <SelectItem value="Top Tier">🏆 Top Tier</SelectItem>
                                            <SelectItem value="Mid Tier">🥈 Mid Tier</SelectItem>
                                            <SelectItem value="Low Tier">🥉 Low Tier</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-slate-500 mt-2">Categorises university in the prestige ranking system</p>
                                </div>
                            </div>

                            {/* AI Context summary card */}
                            <div className="bg-[#0f172b] rounded-[24px] p-6 shadow-xl text-white border border-slate-800 relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full -mr-10 -mt-10" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles size={16} className="text-blue-400" />
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Summary</span>
                                    </div>
                                    <div className={`h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                                        formData.ai_context_summary
                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            : 'bg-slate-900 text-slate-600 border border-slate-800'
                                    }`}>
                                        {formData.ai_context_summary ? `${formData.ai_context_summary.length} chars` : 'Not filled'}
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2">AI context summary status (fill below)</p>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-[#0f172b] flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center"><Tag size={16} /></span>
                                    Decision Tags
                                </h2>
                                <span className="text-xs text-slate-400">{formData.tags.length} selected</span>
                            </div>

                            {/* Quick-select presets */}
                            <div className="mb-5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Select</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        'Ivy League', 'STEM Strong', 'Affordable', 'Research Focused',
                                        'Liberal Arts', 'Engineering', 'Business Hub', 'Medical School',
                                        'International Friendly', 'Scholarship Available', 'Online Programs', 'Public University'
                                    ].map(tag => {
                                        const isSelected = formData.tags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => {
                                                    if (isSelected) {
                                                        handleChange('tags', formData.tags.filter(t => t !== tag));
                                                    } else {
                                                        handleChange('tags', [...formData.tags, tag]);
                                                    }
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                                    isSelected
                                                        ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                                                        : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-violet-200 hover:text-violet-600'
                                                }`}
                                            >
                                                {isSelected ? '✓ ' : '+ '}{tag}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Custom tag input */}
                            <div className="border-t border-slate-50 pt-5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Custom Tags</p>
                                <div className="flex gap-2">
                                    <Input
                                        id="custom-tag-input"
                                        className="h-10 rounded-xl text-sm"
                                        placeholder="Type a custom tag and press Enter..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = (e.target as HTMLInputElement).value.trim();
                                                if (val && !formData.tags.includes(val)) {
                                                    handleChange('tags', [...formData.tags, val]);
                                                    (e.target as HTMLInputElement).value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-10 px-4 rounded-xl text-xs"
                                        onClick={() => {
                                            const input = document.getElementById('custom-tag-input') as HTMLInputElement;
                                            const val = input?.value.trim();
                                            if (val && !formData.tags.includes(val)) {
                                                handleChange('tags', [...formData.tags, val]);
                                                input.value = '';
                                            }
                                        }}
                                    >
                                        <Plus size={14} /> Add
                                    </Button>
                                </div>
                                {/* Selected tags */}
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {formData.tags.map(tag => (
                                            <div key={tag} className="flex items-center gap-1.5 bg-violet-50 border border-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-medium">
                                                {tag}
                                                <button type="button" onClick={() => handleChange('tags', formData.tags.filter(t => t !== tag))} className="text-violet-300 hover:text-red-500 transition-colors">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* AI Context + Selling Points */}
                        <div className="bg-[#0f172b] rounded-[32px] p-8 shadow-2xl border border-slate-800 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-3 relative z-10">
                                <span className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center"><Sparkles size={18} /></span>
                                AI Intelligence Context
                            </h2>
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <Label className="text-slate-300 text-sm">Deep Reasoning Summary <span className="text-slate-600 text-xs">(Internal AI Model Input)</span></Label>
                                    <textarea
                                        className="w-full min-h-[140px] bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-slate-200 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 shadow-inner resize-none"
                                        placeholder="Detailed summary for AI matching algorithms: Strengths, student profile fit, research excellence..."
                                        value={formData.ai_context_summary}
                                        onChange={(e) => handleChange('ai_context_summary', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-300 text-sm">Key Selling Points</Label>
                                        <Button size="sm" variant="ghost" className="text-blue-400 h-8 hover:bg-blue-500/10 text-xs" onClick={() => addArrayItem('key_selling_points')}>
                                            <Plus size={14} /> Add Point
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.key_selling_points.map((pt, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <Input className="h-10 bg-slate-900/50 border-slate-700 text-white text-sm" value={pt} onChange={(e) => handleArrayChange('key_selling_points', idx, e.target.value)} placeholder="e.g. #1 Engineering School in Asia" />
                                                <Button size="icon" variant="ghost" className="text-slate-500 hover:text-red-400 shrink-0" onClick={() => removeArrayItem('key_selling_points', idx)}>
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                        {formData.key_selling_points.length === 0 && (
                                            <p className="text-[10px] text-slate-600 text-center py-3">No selling points added yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 11. SYSTEM / CONTROL */}
                {activeTab === 'system' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Controls & Status */}
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center"><Settings size={16} /></span>
                                Controls & Status
                            </h2>
                            <div className="space-y-6">
                                {/* Dropdowns row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Application Status</Label>
                                        <Select 
                                            disabled={!canModify}
                                            value={formData.application_status || undefined} 
                                            onValueChange={(v) => handleChange('application_status', v)}
                                        >
                                            <SelectTrigger className="h-[48px] rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="open">🟢 Open (Accepting)</SelectItem>
                                                <SelectItem value="closed">🔴 Closed (Expired)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</Label>
                                        <Select 
                                            disabled={!canModify}
                                            value={formData.status || undefined} 
                                            onValueChange={(v) => handleChange('status', v)}
                                        >
                                            <SelectTrigger className="h-[48px] rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="active">✅ Active</SelectItem>
                                                <SelectItem value="inactive">⛔ Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Toggles & number row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Is Featured */}
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                        <Checkbox
                                            id="is_featured"
                                            checked={formData.is_featured}
                                            onCheckedChange={(v) => handleChange('is_featured', !!v)}
                                            disabled={!canModify}
                                        />
                                        <div>
                                            <Label htmlFor="is_featured" className="text-sm font-medium cursor-pointer">Is Featured</Label>
                                            <p className="text-[10px] text-slate-400">Show on homepage carousel</p>
                                        </div>
                                    </div>

                                    {/* Visible */}
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                                        <Checkbox
                                            id="visible"
                                            checked={formData.visible}
                                            onCheckedChange={(v) => handleChange('visible', !!v)}
                                            disabled={!canModify}
                                        />
                                        <div>
                                            <Label htmlFor="visible" className="text-sm font-medium cursor-pointer">Published</Label>
                                            <p className="text-[10px] text-slate-400">Visible in public marketplace</p>
                                        </div>
                                    </div>

                                    {/* Display Order */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Display Order</Label>
                                        <Input
                                            type="number"
                                            className="h-[48px] rounded-xl"
                                            value={formData.display_order}
                                            onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                        <p className="text-[10px] text-slate-400">Lower values appear first</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEO & Routing */}
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Search size={16} /></span>
                                SEO & Routing
                            </h2>
                            <div className="space-y-5">
                                {/* Slug */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">URL Slug</Label>
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-100 pl-4">
                                        <span className="text-xs text-slate-400 font-mono whitespace-nowrap">/universities/</span>
                                        <Input
                                            className="h-[48px] border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
                                            value={formData.slug}
                                            onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
                                            placeholder="university-of-example"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400">Auto-formatted to lowercase with hyphens</p>
                                </div>

                                {/* Meta Title */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meta Title</Label>
                                        <span className={`text-[10px] font-mono ${formData.meta_title.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{formData.meta_title.length}/60</span>
                                    </div>
                                    <Input
                                        className="h-[48px] rounded-xl"
                                        value={formData.meta_title}
                                        onChange={(e) => handleChange('meta_title', e.target.value)}
                                        placeholder="University of Example — Programs, Rankings & Admissions"
                                    />
                                </div>

                                {/* Meta Description */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meta Description</Label>
                                        <span className={`text-[10px] font-mono ${formData.meta_description.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{formData.meta_description.length}/160</span>
                                    </div>
                                    <textarea
                                        className="w-full h-24 p-4 border border-slate-200 rounded-xl text-sm focus:border-slate-800 outline-none resize-none"
                                        value={formData.meta_description}
                                        onChange={(e) => handleChange('meta_description', e.target.value)}
                                        placeholder="Discover world-class programs, campus life, and admissions requirements at University of Example..."
                                    />
                                </div>

                                {/* Google preview */}
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Search Preview</p>
                                    <div className="space-y-1">
                                        <p className="text-blue-700 text-base font-medium truncate">{formData.meta_title || 'Page Title'}</p>
                                        <p className="text-emerald-700 text-xs font-mono truncate">yoursite.com/universities/{formData.slug || 'slug'}</p>
                                        <p className="text-slate-500 text-xs line-clamp-2">{formData.meta_description || 'Meta description will appear here...'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Notes */}
                        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-[#0f172b] mb-5 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center"><MessageSquare size={16} /></span>
                                Administrative Notes
                            </h2>
                            <textarea
                                className="w-full min-h-[160px] p-4 border border-slate-200 rounded-xl text-sm focus:border-slate-800 outline-none resize-none"
                                placeholder="Private internal notes for counselors/admins..."
                                value={formData.admin_notes}
                                onChange={(e) => handleChange('admin_notes', e.target.value)}
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
