"use client";

import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { GitBranch } from 'lucide-react';

export default function AIFlowsPage() {
    return (
        <AdminLayout activePage="ai-flows">
            <div className="py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0e042f] flex items-center gap-3">
                        <GitBranch className="text-indigo-600" size={32} />
                        Flows & Forms
                    </h1>
                    <p className="text-gray-500 mt-2">Design and manage logic flows and information collection forms for the assistant.</p>
                </div>

                <div className="bg-white rounded-[32px] p-12 border border-gray-100 shadow-xl shadow-indigo-900/5 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
                        <GitBranch className="text-indigo-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0e042f] mb-3">Flows Module</h2>
                    <p className="text-gray-500 max-w-md">
                        This module is currently being implemented. Soon you'll be able to create visual logical branches and custom intake forms.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
