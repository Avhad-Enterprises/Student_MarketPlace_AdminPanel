"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Lock, MessageSquare } from 'lucide-react';

/**
 * A premium, high-fidelity Unauthorized Page for RBAC security enforcement.
 */
export const UnauthorizedPage: React.FC = () => {
    const router = useRouter();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#faf7ff] via-white to-[#f8faff]">
            <div className="max-w-[550px] w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                
                {/* Visual Iconography */}
                <div className="relative inline-block">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-100 shadow-sm relative z-10">
                        <ShieldAlert size={48} className="text-red-500" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-10 h-10 bg-[#0e042f] rounded-full flex items-center justify-center shadow-lg border-4 border-white z-20">
                        <Lock size={18} className="text-white" />
                    </div>
                    {/* Decorative Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-100/30 rounded-full animate-pulse -z-0" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-[32px] font-extrabold text-[#0f172b] tracking-tight leading-tight">
                        Access Restricted
                    </h1>
                    <p className="text-[#64748b] text-[17px] font-medium leading-relaxed px-4">
                        You don't have the required permissions to view this module. 
                        Please contact your administrator if you believe this is an error.
                    </p>
                </div>

                {/* Additional Context Card */}
                <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.04)] text-left">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                            <ShieldAlert size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#0f172b]">Security First</h3>
                            <p className="text-sm text-[#64748b] mt-1 leading-relaxed">
                                Our Role-Based Access Control (RBAC) ensures that only authorized personnel can access sensitive sections of the marketplace.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto h-[52px] px-8 bg-white border border-gray-200 rounded-[16px] text-sm font-bold text-[#0f172b] hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-sm"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full sm:w-auto h-[52px] px-8 bg-[#0a061d] text-white rounded-[16px] text-sm font-bold hover:bg-[#1a1438] transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-lg shadow-purple-950/10"
                    >
                        Return to Dashboard
                    </button>
                </div>

                <div className="pt-8 flex items-center justify-center gap-6">
                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors uppercase tracking-wider">
                        <MessageSquare size={14} />
                        Contact Admin
                    </button>
                    <div className="w-px h-3 bg-gray-200" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Ref: SEC-RBAC-403
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
