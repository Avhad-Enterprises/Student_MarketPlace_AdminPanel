const fs = require('fs');
const XLSX = require('xlsx');

// Create sample data containing headers and rows
const data = [
  ['Student Name', 'University', 'Country', 'Intake Period', 'Application Status', 'Assigned Counselor', 'Notes'],
  ['John Doe', 'Harvard University', 'USA', 'Fall 2024', 'Submitted', 'Jane Counselor', 'Awaiting interview'],
  ['Jane Smith', 'University of Oxford', 'UK', 'Sep 2024', 'In Progress', 'Bob Advisor', 'Docs being verified'],
  ['Alex Jones', 'University of Toronto', 'Canada', 'Jan 2025', 'Pending Docs', '', 'Need SOP update']
];

// Create worksheet
const ws = XLSX.utils.aoa_to_sheet(data);

// Create workbook and append worksheet
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Applications');

// Write workbook to file
const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
fs.writeFileSync('c:\\Projects\\student_marketplace_frontend\\sample_applications.xlsx', wbout);

console.log('Sample Applications Excel file generated: sample_applications.xlsx');
