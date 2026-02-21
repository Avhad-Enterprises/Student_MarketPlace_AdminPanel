export const mockApplications = [
    {
        id: 1,
        university: 'University of Oxford',
        course: 'MSc in Computer Science',
        country: 'United Kingdom',
        intake: 'Fall 2025',
        appStatus: 'Submitted',
        offerStatus: 'Pending',
        lastUpdated: '2024-02-15',
        assignedCounselor: 'Sarah Johnson',
        counselorInitials: 'SJ',
        createdDate: '2024-01-10'
    },
    {
        id: 2,
        university: 'Stanford University',
        course: 'MS in AI',
        country: 'USA',
        intake: 'Spring 2026',
        appStatus: 'Draft',
        offerStatus: 'Pending',
        lastUpdated: '2024-02-10',
        assignedCounselor: 'Michael Chen',
        counselorInitials: 'MC',
        createdDate: '2024-02-01'
    }
];

export const mockDocuments = [
    {
        id: 1,
        name: 'Academic Transcript.pdf',
        category: 'Academic',
        status: 'Verified',
        uploadedDate: '2024-01-15'
    },
    {
        id: 2,
        name: 'Passport Copy.jpg',
        category: 'Visa',
        status: 'Uploaded',
        uploadedDate: '2024-02-01'
    },
    {
        id: 3,
        name: 'IELTS Certificate.pdf',
        category: 'Academic',
        status: 'Pending',
        uploadedDate: '-'
    }
];

export const mockPaymentsForTable = [
    {
        invoiceId: 'INV-2024-001',
        serviceName: 'University Application Fee',
        amount: '$150.00',
        status: 'Paid',
        paymentMethod: 'Credit Card',
        date: '2024-01-20'
    },
    {
        invoiceId: 'INV-2024-002',
        serviceName: 'Counseling Service Fee',
        amount: '$500.00',
        status: 'Pending',
        paymentMethod: '-',
        date: '2024-02-05'
    }
];

export const mockTimelineEvents = [
    {
        id: 1,
        title: 'Application Submitted',
        date: 'Feb 15, 2024',
        details: 'MSc Computer Science application submitted to University of Oxford.',
        type: 'Application',
        colorScheme: 'blue',
        timestamp: new Date('2024-02-15')
    },
    {
        id: 2,
        title: 'Document Verified',
        date: 'Feb 10, 2024',
        details: 'Academic transcripts have been verified by the admissions team.',
        type: 'Document',
        colorScheme: 'emerald',
        timestamp: new Date('2024-02-10')
    },
    {
        id: 3,
        title: 'Counseling Session',
        date: 'Feb 05, 2024',
        details: 'Initial counseling session completed with Sarah Johnson.',
        type: 'Communication',
        colorScheme: 'purple',
        timestamp: new Date('2024-02-05')
    }
];
