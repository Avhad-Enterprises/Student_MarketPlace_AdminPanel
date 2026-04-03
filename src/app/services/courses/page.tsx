"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '../../components/AdminLayout';
import { CoursesOverviewPage } from '../../components/CoursesOverviewPage';

const CoursesPage = () => {
    const router = useRouter();

    return (
        <AdminLayout activePage="services-courses">
            <div className="py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0e042f]">Academic Courses</h1>
                    <p className="text-gray-500 mt-2">Manage degrees, certifications, and bootcamp partnerships.</p>
                </div>

                <CoursesOverviewPage onNavigate={(path: string) => router.push(path)} />
            </div>
        </AdminLayout>
    );
};

export default CoursesPage;
