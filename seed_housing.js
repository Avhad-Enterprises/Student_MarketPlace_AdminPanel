const { Client } = require('pg');

const config = {
    host: 'mmv-phase2-rds.c7o2kkcw83e3.ap-south-1.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'MMVPhase2_2026',
    database: 'StudenMarketPlace',
    ssl: { rejectUnauthorized: false }
};

async function seedHousing() {
    const client = new Client(config);
    try {
        await client.connect();
        console.log('Connected to DB');

        // Check if table exists
        const res = await client.query("SELECT to_regclass('public.housing')");
        if (!res.rows[0].to_regclass) {
            console.log('Housing table does not exist yet. Please ensure backend has run and initialized the table.');
            return;
        }

        const housingData = [
            ['HSG-9801', 'Student.com', 'Student Residence', 'London, UK', 125, 'active', true, '$800/mo', true, 6789],
            ['HSG-9802', 'Unite Students', 'Student Residence', 'Manchester, UK', 45, 'active', true, '$650/mo', true, 4321],
            ['HSG-9803', 'AmberStudent', 'Shared Apartment', 'Multiple Cities', 250, 'active', true, '$750/mo', true, 8901],
            ['HSG-9804', 'Casita', 'Private Room', 'Sydney, Australia', 80, 'inactive', true, '$900/mo', false, 2345]
        ];

        for (const data of housingData) {
            await client.query(
                "INSERT INTO housing (reference_id, provider_name, housing_type, location, countries_covered, status, student_visible, avg_rent, verified, popularity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (reference_id) DO NOTHING",
                data
            );
        }

        console.log('Seeded housing data successfully');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await client.end();
    }
}

seedHousing();
