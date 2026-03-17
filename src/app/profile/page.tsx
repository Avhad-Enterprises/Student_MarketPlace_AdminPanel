"use client";

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Mail, Shield, Key } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState({ full_name: 'Admin User', email: 'admin@example.com' });
    
    useEffect(() => {
        try {
            const userJson = localStorage.getItem('auth_user');
            if (userJson) {
                setUser(JSON.parse(userJson));
            }
        } catch (e) { }
    }, []);

    const initials = user.full_name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <AdminLayout activePage="profile">
            <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-8">
                <div className="bg-white rounded-[24px] p-8 shadow-sm flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#c27aff] to-[#fb64b6] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                        {initials || 'AU'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{user.full_name}</h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <Mail size={16} /> {user.email}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-[24px] p-6 shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Shield size={20} className="text-[#c27aff]" /> Account Information
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-slate-500">Full Name</label>
                                <div className="text-slate-900 font-medium">{user.full_name}</div>
                            </div>
                            <div>
                                <label className="text-sm text-slate-500">Email Address</label>
                                <div className="text-slate-900 font-medium">{user.email}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Key size={20} className="text-[#fb64b6]" /> Security
                        </h2>
                        <p className="text-sm text-slate-500">Settings and options to secure your account.</p>
                        <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
