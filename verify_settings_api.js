const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function verifySettings() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_BASE_URL}/login`, {
            email: 'test.user@example.com',
            password: 'password'
        });
        
        const token = loginRes.data.token;
        const headers = { 'Authorization': `Bearer ${token}` };
        console.log('Login successful');

        console.log('Fetching current settings...');
        const res = await axios.get(`${API_BASE_URL}/api/settings/system`, { headers });
        console.log('Current Roles:', res.data.data.document_access_roles);

        // Update with some new values
        const updatePayload = {
            ...res.data.data,
            document_access_roles: ['Admin', 'Manager', 'Counselor', 'Editor Test'],
            mask_sensitive_documents: false,
            kyc_required_booking: false,
            kyc_document_types: ['Passport', 'ID Card']
        };

        console.log('Updating settings...');
        await axios.post(`${API_BASE_URL}/api/settings/system`, updatePayload, { headers });
        console.log('Update success');

        console.log('Verifying persistence...');
        const finalRes = await axios.get(`${API_BASE_URL}/api/settings/system`, { headers });
        console.log('Verified Roles:', finalRes.data.data.document_access_roles);
        console.log('Verified Masking:', finalRes.data.data.mask_sensitive_documents);
        
        if (finalRes.data.data.document_access_roles.includes('Editor Test')) {
            console.log('SUCCESS: Settings persisted correctly!');
        } else {
            console.log('FAILURE: Settings did not persist correctly.');
        }

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

verifySettings();
