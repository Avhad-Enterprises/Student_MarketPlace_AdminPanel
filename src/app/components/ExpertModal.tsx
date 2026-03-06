import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Briefcase, Star, Clock, FileText, Camera, RefreshCw } from 'lucide-react';
import { Expert, ExpertFormData } from '@/services/expertService';
import { toast } from 'sonner';

interface ExpertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ExpertFormData) => Promise<void>;
    expert?: Expert | null;
}

export const ExpertModal: React.FC<ExpertModalProps> = ({ isOpen, onClose, onSave, expert }) => {
    const [formData, setFormData] = useState<ExpertFormData>({
        full_name: '',
        email: '',
        phone: '',
        specialization: '',
        experience_years: 0,
        rating: 0,
        status: 'active',
        avatar_url: '',
        bio: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (expert) {
            setFormData({
                full_name: expert.full_name || '',
                email: expert.email || '',
                phone: expert.phone || '',
                specialization: expert.specialization || '',
                experience_years: expert.experience_years || 0,
                rating: expert.rating || 0,
                status: expert.status || 'active',
                avatar_url: expert.avatar_url || '',
                bio: expert.bio || ''
            });
        } else {
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                specialization: '',
                experience_years: 0,
                rating: 0,
                status: 'active',
                avatar_url: '',
                bio: ''
            });
        }
    }, [expert, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'experience_years' || name === 'rating' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
            toast.success(expert ? 'Expert updated successfully' : 'Expert added successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to save expert');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0e042f]">{expert ? 'Edit Expert' : 'Add New Expert'}</h2>
                        <p className="text-gray-500 text-sm mt-1">Fill in the professional details of the expert.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar-light">
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Full Name *</label>
                            <div className="relative">
                                <User size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Sarah Johnson"
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Email Address *</label>
                            <div className="relative">
                                <Mail size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="e.g. sarah@example.com"
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. +1 234 567 890"
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Specialization</label>
                            <div className="relative">
                                <Briefcase size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="e.g. Visa & Immigration"
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Experience (Years)</label>
                            <div className="relative">
                                <Clock size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                <input
                                    type="number"
                                    name="experience_years"
                                    value={formData.experience_years}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Status</label>
                            <div className="relative">
                                <RefreshCw size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 appearance-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="on-leave">On Leave</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#0e042f] ml-1">Avatar URL</label>
                        <div className="relative">
                            <Camera size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                            <input
                                type="text"
                                name="avatar_url"
                                value={formData.avatar_url}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#0e042f] ml-1">Professional Bio</label>
                        <div className="relative">
                            <FileText size={18} className="absolute top-4 left-4 text-gray-400" />
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="A brief description of their professional background..."
                                rows={4}
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 resize-none"
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 md:p-8 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 h-[52px] rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="bg-[#0e042f] text-white px-8 h-[52px] rounded-2xl font-bold shadow-lg shadow-indigo-900/20 hover:bg-[#1a0c4a] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? <RefreshCw className="animate-spin" size={20} /> : null}
                        {expert ? 'Update Expert' : 'Save Expert'}
                    </button>
                </div>
            </div>
        </div>
    );
};
