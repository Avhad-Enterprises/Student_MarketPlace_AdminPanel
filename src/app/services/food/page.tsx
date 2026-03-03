"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { FoodOverviewPage } from '../../components/FoodOverviewPage';

const FoodPage = () => {
    return (
        <AdminLayout activePage="services-food">
            <div className="py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0e042f]">Food Services</h1>
                    <p className="text-gray-500 mt-2">Manage food delivery, meal kits, and student dining partners.</p>
                </div>

                <FoodOverviewPage />
            </div>
        </AdminLayout>
    );
};

export default FoodPage;
