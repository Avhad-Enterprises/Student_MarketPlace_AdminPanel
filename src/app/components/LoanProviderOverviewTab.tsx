
import React from 'react';
import { Users, Activity, CheckCircle, DollarSign, Percent, TrendingUp } from 'lucide-react';

interface LoanProviderOverviewTabProps {
    providerId: string;
}

export const LoanProviderOverviewTab: React.FC<LoanProviderOverviewTabProps> = ({ providerId }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[#253154]">Provider Overview</h2>
                <p className="text-sm text-gray-600">Executive summary and performance snapshot for loan provider {providerId}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                            <p className="text-2xl font-bold text-[#253154]">8,247</p>
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600 font-medium">↑ 12% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Applications</p>
                            <p className="text-2xl font-bold text-[#253154]">342</p>
                        </div>
                    </div>
                    <p className="text-xs text-purple-600 font-medium">Processing average: 4.2 days</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                            <p className="text-2xl font-bold text-[#253154]">79.1%</p>
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600 font-medium">↑ 2.4% industry average</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#253154] mb-4">Provider Summary</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Prodigy Finance provides education loans to international postgraduate students attending top-ranked universities globally.
                    Their unique platform uses a future-earnings-based credit model, allowing them to lend to students who might not otherwise have access to funding.
                </p>
            </div>
        </div>
    );
};
