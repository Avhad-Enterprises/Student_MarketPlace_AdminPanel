
import React from 'react';
import { DollarSign, Percent, Clock, Plus, Edit3 } from 'lucide-react';
import { Button } from './ui/button';

interface LoanProviderPlansTabProps {
    providerId: string;
}

export const LoanProviderPlansTab: React.FC<LoanProviderPlansTabProps> = ({ providerId }) => {
    const plans = [
        { id: '1', name: 'Standard Student Loan', rate: '8.2% - 12.5%', tenure: '7 - 20 years', amount: 'Up to $100k', status: 'Active' },
        { id: '2', name: 'Premium Graduate Loan', rate: '7.5% - 10.2%', tenure: '5 - 15 years', amount: 'Up to $150k', status: 'Active' },
        { id: '3', name: 'Refinancing Plan', rate: '6.8% - 9.5%', tenure: 'Up to 10 years', amount: 'Variable', status: 'Active' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#253154]">Plans & Pricing</h2>
                    <p className="text-sm text-gray-600">Manage loan products and interest rates</p>
                </div>
                <Button size="sm" className="bg-[#0e042f] hover:bg-[#1a0a4a]">
                    <Plus size={14} className="mr-2" />
                    Add New Plan
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Plan Name</p>
                                <p className="text-sm font-bold text-[#253154]">{plan.name}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Interest Rate</p>
                                <p className="text-sm font-medium text-gray-900">{plan.rate}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Tenure</p>
                                <p className="text-sm font-medium text-gray-900">{plan.tenure}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-200">
                                    {plan.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                                <Edit3 size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
