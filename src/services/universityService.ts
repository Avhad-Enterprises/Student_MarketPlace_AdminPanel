import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/universities`;

export interface UniversityFormData {
    // 1. BASIC INFORMATION
    name: string;
    city: string;
    country: string;
    region: string;
    university_type: string; // Public/Private
    world_ranking: number;
    national_ranking: number;
    website: string;
    logo_url: string;
    established_year: number;
    location: string;
    
    // 2. ADMISSIONS
    acceptance_rate: number;
    application_fee: number;
    application_deadline_fall: string;
    application_deadline_spring: string;
    application_deadline: string; // Specific date
    min_gpa: number;
    avg_gpa: string; // Range or textual
    english_requirement: string; // Textual overview
    min_ielts: number;
    
    // 3. STUDENT BODY
    total_students: number;
    international_students: number;
    international_ratio: number;
    international_students_percentage: number; // Aliased for clarity
    gender_ratio: string;
    student_faculty_ratio: string;
    popular_programs: string[];
    
    // 4. COSTS
    tuition_fees: number;
    tuition_fees_min: number;
    tuition_fees_max: number;
    living_cost: number;
    living_cost_min: number;
    living_cost_max: number;
    total_annual_cost: number;
    financial_aid_available: boolean;
    financial_aid_details: string;
    scholarships_info: string;
    
    // 5. ACADEMIC & CAREER
    research_rating: string;
    research_funding: number;
    campus_size: string;
    graduate_outcome_rate: number;
    employment_rate: number;
    average_starting_salary: number;
    top_recruiters: string[]; // JSONB
    career_services: string;
    
    // 6. PROGRAM STRUCTURE
    degree_levels: string[]; // Bachelor, Master...
    credit_system: string;
    undergraduate_duration: number;
    undergraduate_credits: number;
    graduate_duration: number;
    graduate_programs: string[];
    internship_available: boolean;
    industry_partners: string[];
    
    // 7. CAMPUS LIFE
    campus_facilities: string[];
    housing_available: boolean;
    housing_types: string;
    student_orgs_count: number;
    varsity_sports_count: number;
    on_campus_living_percentage: number;
    countries_represented: number;
    
    // 8. CONTENT
    description: string;
    overview: string;
    academic_programs_content: string;
    admissions_content: string;
    financial_aid_content: string;
    campus_life_content: string;
    career_outcomes_content: string;
    research_content: string;
    key_facts: string[];
    pros: string[];
    cons: string[];
    
    // 9. MEDIA
    university_logo: string;
    university_banner: string;
    gallery_images: string[];
    video_tour_url: string;
    campus_map_url: string;
    hero_image: string;
    
    // 10. AI / DECISION FIELDS
    roi_rating: string;         // High / Medium / Low
    prestige_level: string;     // Top Tier / Mid Tier / Low Tier
    tags: string[];             // Ivy League, STEM Strong, etc.
    ai_context_summary: string;
    key_selling_points: string[];
    admission_difficulty: string;
    
    // 11. SYSTEM / CONTROL
    application_status: string; // Open/Closed
    status: string; // active/inactive
    visible: boolean;
    is_featured: boolean;
    display_order: number;
    admin_notes: string;
    slug: string;
    meta_title: string;
    meta_description: string;
}

export const universityService = {
    create: async (data: UniversityFormData) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.post(API_URL, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    update: async (id: string, data: Partial<UniversityFormData>) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.put(`${API_URL}/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    delete: async (id: string) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    bulkUpdateStatus: async (ids: string[], status: 'active' | 'disabled') => {
        const token = localStorage.getItem('auth_token');
        // Simulate bulk update by calling update for each ID
        // In a real scenario, the backend should support a bulk endpoint
        const promises = ids.map(id =>
            axios.put(`${API_URL}/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            })
        );
        await Promise.all(promises);
        return { message: `Updated ${ids.length} universities` };
    },

    getAll: async (params: {
        page?: number;
        limit?: number;
        search?: string;
        countryId?: string;
        type?: string;
        status?: string;
        sort?: string;
        order?: 'asc' | 'desc';
        applicationStatus?: string;
    } = {}) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page: params.page || 1,
                limit: params.limit || 10,
                search: params.search,
                country_id: params.countryId, // Map to backend snake_case
                type: params.type,
                status: params.status,
                sort: params.sort,
                order: params.order,
                application_status: params.applicationStatus // Map to backend snake_case
            }
        });
        return response.data;
    },

    getMetrics: async () => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`${API_URL}/metrics`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    import: async (data: any[]) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.post(`${API_URL}/import`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    export: async (format: string = 'xlsx') => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`${API_URL}/export/data`, { // Changed to /export/data based on controller
            params: { format },
            responseType: 'blob', // Important for file download
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};
