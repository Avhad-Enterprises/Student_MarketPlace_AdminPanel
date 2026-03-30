import axios from 'axios';

const API_URL = 'https://smapi.test-zone.xyz/api/students';

export interface Student {
    id: string; // db id (UUID)
    student_id: string; // display id (STU-...)
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth?: string;
    country_code?: string;
    phone_number?: string;
    nationality?: string;
    current_country?: string;
    primary_destination?: string;
    current_stage?: string;
    lead_source?: string;
    campaign?: string;
    account_status: boolean;
    risk_level: 'low' | 'medium' | 'high';
    country_preferences: string; // JSON string
    applications_count: string | number;
    assigned_counselor: string;
    intended_intake: string;
    created_at: string;
    notes?: string;
    
    // Education Snapshot
    highest_qualification?: string;
    field_of_study?: string;
    current_institution?: string;
    graduation_year?: string;
    gpa?: string;

    // Lead & Attribution
    first_touch_date?: string;
    conversion_path_summary?: string;

    // Intent & Preferences
    preferred_course_level?: string;
    budget_range?: string;
    intake_preference?: string;
    test_scores?: string;
    
    // Additional fields for the 11 tabs
    student_intent?: string;
    interested_services?: string; // JSON string
    communication_preference?: string;
    timezone?: string;
    
    // Planning & Application
    planning_countries?: string;
    planning_intake?: string;
    planning_course_level?: string;
    planning_field_of_study?: string;
    career_goal?: string;
    long_term_plan?: string;
    annual_budget?: string;
    funding_source?: string;
    family_constraints?: string;
    timeline_urgency?: string;
    consultation_notes?: string;

    // Evaluation
    eval_grading_system?: string;
    eval_institution_tier?: string;
    eval_backlogs?: string;
    eval_work_exp?: string;
    eval_field_relevance?: string;
    eval_internships?: string;
    eval_research?: string;
    eval_gap_years?: string;
    eval_additional_notes?: string;

    // Eligibility
    eligibility_prerequisites?: boolean | number;
    eligibility_bridge_course?: boolean | number;
    eligibility_english_test?: boolean | number;
    eligibility_funds_ready?: boolean | number;
    eligibility_sponsor_identified?: boolean | number;
    eligibility_loan_required?: boolean | number;
    eligibility_gap_explanation?: boolean | number;
    visa_risk?: string;
    visa_notes?: string;

    // Career
    intended_job_role?: string;
    preferred_industry?: string;
    career_country_preference?: string;
    job_market_awareness?: string;
    salary_expectations?: string;
    stay_back_interest?: boolean | number;
    career_discussion_notes?: string;

    // Shortlisting
    shortlisted_universities?: string;
    shortlisted_course_details?: string;
    shortlisted_country?: string;
    shortlisted_priority?: string;
    shortlisted_intake?: string;
    shortlisted_budget_fit?: string;
    shortlisted_eligibility_fit?: string;
    shortlisted_visa_safety?: string;

    // Application Strategy
    app_strategy_order?: string;
    app_strategy_type?: string;
    app_strategy_deadline_awareness?: string;
    app_strategy_deadline_risk?: string;
    app_strategy_sop_approach?: string;
    app_strategy_customization_level?: string;
    app_strategy_lor_type?: string;
    app_strategy_lor_count?: string;
    app_strategy_notes?: string;

    // SOP
    sop_version?: string;
    sop_draft_status?: string;
    sop_assigned_editor?: string;
    sop_structure_quality?: string;
    sop_content_relevance?: string;
    sop_language_clarity?: string;
    sop_feedback_notes?: string;
    sop_revision_count?: string;

    // LOR
    lor_count_required?: string;
    lor_recommender_name?: string;
    lor_recommender_relation?: string;
    lor_recommender_email?: string;
    lor_current_status?: string;
    lor_coordination_notes?: string;

    // Submission
    submission_sop_uploaded?: boolean | number;
    submission_lors_uploaded?: boolean | number;
    submission_transcripts_uploaded?: boolean | number;
    submission_fee_paid?: boolean | number;
    submission_portal?: string;
    submission_confirmation_received?: boolean | number;
    submission_date?: string;
    submission_errors_faced?: string;
    submission_resolution_notes?: string;

    // Offer Review & Decision
    offer_university_name?: string;
    offer_course_name?: string;
    offer_country?: string;
    offer_intake?: string;
    offer_type?: string;
    offer_conditions?: string;
    offer_deadline?: string;
    offer_deposit_required?: boolean | number;
    offer_deposit_amount?: string;
    offer_tuition_fee?: string;
    offer_living_cost?: string;
    offer_scholarship?: string;
    offer_total_cost?: string;
    offer_course_relevance?: string;
    offer_university_ranking?: string;
    offer_employability_outlook?: string;
    offer_industry_alignment?: string;
    offer_visa_probability?: string;
    offer_country_risks?: string;
    offer_gap_sensitivity?: string;
    offer_preference_level?: string;
    offer_family_concerns?: string;
    offer_student_questions?: string;
    offer_discussion_summary?: string;

    // Visa & Compliance
    visa_target_country?: string;
    visa_type?: string;
    visa_start_date?: string;
    visa_university_name?: string;
    visa_offer_uploaded?: boolean | number;
    visa_cas_status?: string;
    visa_funds_proof_available?: boolean | number;
    visa_funds_source?: string;
    visa_loan_status?: string;
    visa_bank_statement_duration?: string;
    visa_passport_validity?: string;
    visa_transcripts_uploaded?: boolean | number;
    visa_language_report_uploaded?: boolean | number;
    visa_medical_uploaded?: boolean | number;
    visa_form_filled?: boolean | number;
    visa_biometrics_required?: boolean | number;
    visa_appointment_booked?: boolean | number;
    visa_appointment_date?: string;
    visa_interview_required?: boolean | number;
    visa_interview_prep_done?: boolean | number;
    visa_mock_interview_notes?: string;
    visa_special_case_notes?: string;
    visa_internal_remarks?: string;

    // Compliance (More)
    comp_visa_start_date?: string;
    comp_visa_expiry_date?: string;
    comp_multiple_entry?: boolean | number;
    comp_work_restrictions?: string;
    comp_attendance_req?: string;
    comp_address_reporting?: boolean | number;
    comp_extension_eligible?: boolean | number;
    comp_extension_type?: string;
    comp_renewal_window?: string;
    comp_checkins_required?: boolean | number;
    comp_last_review_date?: string;
    comp_issues_noted?: string;
    comp_psw_interest?: boolean | number;
    comp_eligibility_awareness?: boolean | number;
    comp_notes?: string;

    // Pre-Departure Support
    predep_travel_date?: string;
    predep_flight_booked?: boolean | number;
    predep_airline_name?: string;
    predep_departure_airport?: string;
    predep_arrival_airport?: string;
    predep_accommodation_type?: string;
    predep_accommodation_confirmed?: boolean | number;
    predep_address?: string;
    predep_initial_stay_duration?: string;
    predep_insurance_arranged?: boolean | number;
    predep_forex_ready?: boolean | number;
    predep_docs_collected?: boolean | number;
    predep_emergency_contact?: string;
    predep_orientation_attended?: boolean | number;
    predep_rules_explained?: boolean | number;
    predep_reporting_instructions_shared?: boolean | number;
    predep_packing_guidance_shared?: boolean | number;
    predep_restricted_items_explained?: boolean | number;
    predep_weather_awareness?: boolean | number;
    predep_notes?: string;
}

export interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface StudentsResponse {
    data: Student[];
    pagination: PaginationData;
}

export interface StudentMetrics {
    totalStudents: number;
    activeStudents: number;
    atRiskStudents: number;
    recentlyAdded: number;
    applicationsInProgress: number;
}

// Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

export const getAllStudents = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    risk_level?: string;
    sort?: string;
    order?: string;
} = {}): Promise<StudentsResponse> => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader(),
            params
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        return {
            data: [],
            pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
        };
    }
};

export const getStudentMetrics = async (): Promise<StudentMetrics> => {
    try {
        const response = await axios.get(`${API_URL}/metrics`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching student metrics:', error);
        return {
            totalStudents: 0,
            activeStudents: 0,
            atRiskStudents: 0,
            recentlyAdded: 0,
            applicationsInProgress: 0
        };
    }
};

export const createStudent = async (studentData: any): Promise<any> => {
    try {
        const response = await axios.post(API_URL, studentData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
};

export const updateStudent = async (id: string, studentData: any): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, studentData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

export const deleteStudent = async (id: string): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
};

export const getStudentById = async (id: string): Promise<Student> => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching student by id:', error);
        throw error;
    }
};
