const fs = require('fs');
const XLSX = require('xlsx');

// Create sample data containing headers and rows
const data = [
  ['First Name', 'Last Name', 'Email', 'Phone Number', 'Country', 'Passport Number', 'Date of Birth', 'Gender', 'Risk Level'],
  ['John', 'Doe', 'john.doe@example.com', '+1234567890', 'USA', 'A12345678', '1995-05-15', 'Male', 'low'],
  ['Jane', 'Smith', 'jane.smith@example.com', '+0987654321', 'UK', 'B87654321', '1998-09-22', 'Female', 'medium'],
  ['Alex', 'Jones', 'alex.jones@example.com', '+1122334455', 'Canada', 'C11223344', '1997-02-10', 'Other', 'high']
];

// Create worksheet
const ws = XLSX.utils.aoa_to_sheet(data);

// Create workbook and append worksheet
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Students');

// Write workbook to file
const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
fs.writeFileSync('c:\\Projects\\student_marketplace_frontend\\sample_students.xlsx', wbout);

console.log('Sample Excel file generated: sample_students.xlsx');
