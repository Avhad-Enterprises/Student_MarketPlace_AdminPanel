import axios from 'axios';

const API_URL = 'http://localhost:5000/api/activities';

export interface Activity {
    id: string;
    student_db_id: string;
    title: string;
    content: string;
    type: string;
    created_at: string;
    updated_at: string;
}

// Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

export const getActivitiesByStudentId = async (studentId: string): Promise<Activity[]> => {
    try {
        const response = await axios.get(`${API_URL}/${studentId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
    }
};

export const createActivity = async (activityData: Partial<Activity>): Promise<Activity | null> => {
    try {
        const response = await axios.post(API_URL, activityData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error creating activity:', error);
        return null;
    }
};
