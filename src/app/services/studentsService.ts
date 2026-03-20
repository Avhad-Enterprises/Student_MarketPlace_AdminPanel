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
