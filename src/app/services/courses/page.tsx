"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { CoursesOverviewPage } from '../../components/CoursesOverviewPage';

export default function CoursesPage() {
    return (
        <AdminLayout activePage="services-courses">
            <div className="py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0e042f]">Courses & Certifications</h1>
                    <p className="text-gray-500 mt-2">Manage educational programs, certifications, and student learning paths.</p>
                </div>
                <CoursesOverviewPage />
            </div>
        </AdminLayout>
    );
}
