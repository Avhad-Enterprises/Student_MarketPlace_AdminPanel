const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000'; // Standard backend port
const token = 'YOUR_TOKEN_HERE'; // I should find a way to get a token or use a bypass if possible

async function testSettings() {
    try {
        console.log('Fetching settings...');
        const res = await axios.get(`${API_BASE_URL}/api/settings/system`);
        console.log('GET Response:', res.data);

        const payload = {
            ...res.data.data,
            document_access_roles: ['Admin', 'TestRole'],
            mask_sensitive_documents: false
        };

        console.log('Updating settings...');
        const updateRes = await axios.post(`${API_BASE_URL}/api/settings/system`, payload);
        console.log('POST Response:', updateRes.data);

        console.log('Fetching again to verify...');
        const finalRes = await axios.get(`${API_BASE_URL}/api/settings/system`);
        console.log('Final GET Response:', finalRes.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testSettings();
