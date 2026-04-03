import axios from 'axios';

console.log('--- Loading countriesService (Updated) ---');

import { API_BASE_URL } from "@/config/api";

const API_URL = `${API_BASE_URL}/api/countries`;

export interface CountryFormData {
    country_name: string;
    country_code: string;
    region: string;
    visa_difficulty: 'Low' | 'Medium' | 'High';
    cost_of_living: 'Low' | 'Medium' | 'High';
    status: string;
    visible: boolean;
    capital_city?: string;
    official_languages?: string;
    climate?: string;
    safety_rating?: number;
    living_cost_min?: number;
    living_cost_max?: number;
    total_cost_min?: number;
    total_cost_max?: number;
    health_insurance_min?: number;
    health_insurance_max?: number;
    academic_system?: string;
    bachelor_duration?: number;
    master_duration?: number;
    intake_seasons?: string;
    ielts_min?: number;
    ielts_max?: number;
    toefl_min?: number;
    toefl_max?: number;
    student_visa_type?: string;
    visa_processing_min?: number;
    visa_processing_max?: number;
    work_hours_per_week?: number;
    psw_duration_months?: number;
    top_universities?: string[];
    popular_cities?: string[];
    job_market_strengths?: string[];
    pr_pathway?: string;
    roi_score?: string;
    visa_success_rate?: number;
    pr_probability?: string;
    acceptance_rate?: number;
    tags?: string[];
    visa_providers?: string[];
    loan_providers?: string[];
    housing_providers?: string[];
    insurance_providers?: string[];
    forex_providers?: string[];
    service_availability: {
        visa: boolean;
        insurance: boolean;
        housing: boolean;
        loans: boolean;
        forex: boolean;
        courses: boolean;
        food: boolean;
    };
    popularity?: number;
    
    // Expanded fields
    tuition_fees_min?: number;
    tuition_fees_max?: number;
    monthly_living_expenses?: number;
    accommodation_min?: number;
    accommodation_max?: number;
    food_monthly?: number;
    transport_monthly?: number;
    health_insurance_annual?: number;
    
    education_overview?: string;
    major_intakes?: string;
    avg_degree_duration?: string;
    credit_system_info?: string;
    top_unis_summary?: string;
    
    visa_process_info?: string;
    visa_fee?: number;
    permit_validity?: string;
    psw_duration?: string;
    psw_conditions?: string;
    part_time_work_hours?: number;
    spouse_work_allowed?: boolean;
    
    job_market_info?: string;
    key_industries?: string;
    pr_pathway_info?: string;
    settlement_options?: string;
    
    ai_context_summary?: string;
    decision_pros_cons?: string;
    key_attractions?: string;
    potential_challenges?: string;
    
    marketplace_notes?: string;
    partner_summary?: string;
    
    hero_image?: string;
    flag_icon?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    slug?: string;
}

export interface Country extends CountryFormData {
    id: string;
    name: string;
    code: string;
    universities_count?: number;
    created_at?: string;
    updated_at?: string;
}

// Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

export const getAll = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    region?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
} = {}) => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader(),
            params
        });
        return response.data; // Returns { data: Country[], pagination: ... }
    } catch (error) {
        console.error('Error fetching countries:', error);
        return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }
};

export const getMetrics = async () => {
    try {
        const response = await axios.get(`${API_URL}/metrics`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return {
            totalCountries: 0,
            activeCountries: 0,
            visaFriendly: 0,
            highDemand: 0,
            withUniversities: 0
        };
    }
};

export const getCountryById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const createCountry = async (data: CountryFormData) => {
    const payload = {
        name: data.country_name,
        code: data.country_code,
        region: data.region,
        visa_difficulty: data.visa_difficulty,
        cost_of_living: data.cost_of_living,
        status: data.status.toLowerCase(),
        popularity: data.popularity || 0,
        service_visa: data.service_availability.visa,
        service_insurance: data.service_availability.insurance,
        service_housing: data.service_availability.housing,
        service_loans: data.service_availability.loans,
        service_forex: data.service_availability.forex,
        service_courses: data.service_availability.courses,
        service_food: data.service_availability.food,
        
        // Expanded fields
        tuition_fees_min: data.tuition_fees_min,
        tuition_fees_max: data.tuition_fees_max,
        monthly_living_expenses: data.monthly_living_expenses,
        accommodation_min: data.accommodation_min,
        accommodation_max: data.accommodation_max,
        food_monthly: data.food_monthly,
        transport_monthly: data.transport_monthly,
        health_insurance_annual: data.health_insurance_annual,
        
        education_overview: data.education_overview,
        major_intakes: data.major_intakes,
        avg_degree_duration: data.avg_degree_duration,
        credit_system_info: data.credit_system_info,
        top_unis_summary: data.top_unis_summary,
        
        visa_process_info: data.visa_process_info,
        visa_fee: data.visa_fee,
        permit_validity: data.permit_validity,
        psw_duration: data.psw_duration,
        psw_conditions: data.psw_conditions,
        part_time_work_hours: data.part_time_work_hours,
        spouse_work_allowed: data.spouse_work_allowed,
        
        job_market_info: data.job_market_info,
        key_industries: data.key_industries,
        pr_pathway_info: data.pr_pathway_info,
        settlement_options: data.settlement_options,
        
        ai_context_summary: data.ai_context_summary,
        decision_pros_cons: data.decision_pros_cons,
        key_attractions: data.key_attractions,
        potential_challenges: data.potential_challenges,
        
        marketplace_notes: data.marketplace_notes,
        partner_summary: data.partner_summary,
        
        hero_image: data.hero_image,
        flag_icon: data.flag_icon,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
        slug: data.slug,
        capital_city: data.capital_city,
        official_languages: data.official_languages,
        climate: data.climate,
        safety_rating: data.safety_rating,
        living_cost_min: data.living_cost_min,
        living_cost_max: data.living_cost_max,
        total_cost_min: data.total_cost_min,
        total_cost_max: data.total_cost_max,
        health_insurance_min: data.health_insurance_min,
        health_insurance_max: data.health_insurance_max,
        academic_system: data.academic_system,
        bachelor_duration: data.bachelor_duration,
        master_duration: data.master_duration,
        intake_seasons: data.intake_seasons,
        ielts_min: data.ielts_min,
        ielts_max: data.ielts_max,
        toefl_min: data.toefl_min,
        toefl_max: data.toefl_max,
        student_visa_type: data.student_visa_type,
        visa_processing_min: data.visa_processing_min,
        visa_processing_max: data.visa_processing_max,
        work_hours_per_week: data.work_hours_per_week,
        psw_duration_months: data.psw_duration_months,
        top_universities: data.top_universities,
        popular_cities: data.popular_cities,
        job_market_strengths: data.job_market_strengths,
        pr_pathway: data.pr_pathway,
        roi_score: data.roi_score,
        visa_success_rate: data.visa_success_rate,
        pr_probability: data.pr_probability,
        acceptance_rate: data.acceptance_rate,
        tags: data.tags,
        visa_providers: data.visa_providers,
        loan_providers: data.loan_providers,
        housing_providers: data.housing_providers,
        insurance_providers: data.insurance_providers,
        forex_providers: data.forex_providers,
    };

    const response = await axios.post(API_URL, payload, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateCountry = async (id: string, data: CountryFormData) => {
    const payload = {
        name: data.country_name,
        code: data.country_code,
        region: data.region,
        visa_difficulty: data.visa_difficulty,
        cost_of_living: data.cost_of_living,
        status: data.status.toLowerCase(),
        popularity: data.popularity,
        service_visa: data.service_availability.visa,
        service_insurance: data.service_availability.insurance,
        service_housing: data.service_availability.housing,
        service_loans: data.service_availability.loans,
        service_forex: data.service_availability.forex,
        service_courses: data.service_availability.courses,
        service_food: data.service_availability.food,
        
        // Expanded fields
        tuition_fees_min: data.tuition_fees_min,
        tuition_fees_max: data.tuition_fees_max,
        monthly_living_expenses: data.monthly_living_expenses,
        accommodation_min: data.accommodation_min,
        accommodation_max: data.accommodation_max,
        food_monthly: data.food_monthly,
        transport_monthly: data.transport_monthly,
        health_insurance_annual: data.health_insurance_annual,
        
        education_overview: data.education_overview,
        major_intakes: data.major_intakes,
        avg_degree_duration: data.avg_degree_duration,
        credit_system_info: data.credit_system_info,
        top_unis_summary: data.top_unis_summary,
        
        visa_process_info: data.visa_process_info,
        visa_fee: data.visa_fee,
        permit_validity: data.permit_validity,
        psw_duration: data.psw_duration,
        psw_conditions: data.psw_conditions,
        part_time_work_hours: data.part_time_work_hours,
        spouse_work_allowed: data.spouse_work_allowed,
        
        job_market_info: data.job_market_info,
        key_industries: data.key_industries,
        pr_pathway_info: data.pr_pathway_info,
        settlement_options: data.settlement_options,
        
        ai_context_summary: data.ai_context_summary,
        decision_pros_cons: data.decision_pros_cons,
        key_attractions: data.key_attractions,
        potential_challenges: data.potential_challenges,
        
        marketplace_notes: data.marketplace_notes,
        partner_summary: data.partner_summary,
        
        hero_image: data.hero_image,
        flag_icon: data.flag_icon,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
        slug: data.slug,
        capital_city: data.capital_city,
        official_languages: data.official_languages,
        climate: data.climate,
        safety_rating: data.safety_rating,
        living_cost_min: data.living_cost_min,
        living_cost_max: data.living_cost_max,
        total_cost_min: data.total_cost_min,
        total_cost_max: data.total_cost_max,
        health_insurance_min: data.health_insurance_min,
        health_insurance_max: data.health_insurance_max,
        academic_system: data.academic_system,
        bachelor_duration: data.bachelor_duration,
        master_duration: data.master_duration,
        intake_seasons: data.intake_seasons,
        ielts_min: data.ielts_min,
        ielts_max: data.ielts_max,
        toefl_min: data.toefl_min,
        toefl_max: data.toefl_max,
        student_visa_type: data.student_visa_type,
        visa_processing_min: data.visa_processing_min,
        visa_processing_max: data.visa_processing_max,
        work_hours_per_week: data.work_hours_per_week,
        psw_duration_months: data.psw_duration_months,
        top_universities: data.top_universities,
        popular_cities: data.popular_cities,
        job_market_strengths: data.job_market_strengths,
        pr_pathway: data.pr_pathway,
        roi_score: data.roi_score,
        visa_success_rate: data.visa_success_rate,
        pr_probability: data.pr_probability,
        acceptance_rate: data.acceptance_rate,
        tags: data.tags,
        visa_providers: data.visa_providers,
        loan_providers: data.loan_providers,
        housing_providers: data.housing_providers,
        insurance_providers: data.insurance_providers,
        forex_providers: data.forex_providers,
    };
    const response = await axios.put(`${API_URL}/${id}`, payload, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deleteCountry = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const importCountries = async (data: any[]) => {
    const response = await axios.post(`${API_URL}/import`, data, {
        headers: getAuthHeader()
    });
    return response.data;
};


export const exportCountries = async (ids?: string[]) => {
    const params = ids && ids.length > 0 ? { ids: ids.join(',') } : {};
    const response = await axios.get(`${API_URL}/export/data`, { // Returns JSON array
        headers: getAuthHeader(),
        params
    });
    return response.data;
};

export const bulkUpdateCountries = async (ids: string[], status: 'active' | 'inactive') => {
    const response = await axios.post(`${API_URL}/bulk-update`, { ids, status }, {
        headers: getAuthHeader()
    });
    return response.data;
};
