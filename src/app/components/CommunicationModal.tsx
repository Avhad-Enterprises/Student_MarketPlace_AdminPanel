import React, { useState, useEffect } from 'react';
import { X, Mail, User, MessageSquare, Send, CheckCircle, AlertCircle, RefreshCw, MessageCircle, FileText } from 'lucide-react';
import { Communication, CommunicationFormData } from '@/services/communicationService';
import { toast } from 'sonner';

interface CommunicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CommunicationFormData) => Promise<void>;
    communication?: Communication | null;
}

export const CommunicationModal: React.FC<CommunicationModalProps> = ({ isOpen, onClose, onSave, communication }) => {
    const [formData, setFormData] = useState<CommunicationFormData>({
        student_db_id: 0,
        type: 'Email',
        status: 'sent',
        content: '',
        sender: '',
        subject: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (communication) {
            setFormData({
                student_db_id: communication.student_db_id,
                type: communication.type,
                status: communication.status,
                content: communication.content,
                sender: communication.sender,
                subject: communication.subject || ''
            });
        } else {
            // Try to get current user from localStorage for the sender
            let currentUser = '';
            try {
                const userJson = localStorage.getItem('auth_user');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    currentUser = user.full_name || user.email || '';
                }
            } catch (e) {
                console.error('Error parsing auth_user', e);
            }

            setFormData({
                student_db_id: 0,
                type: 'Email',
                status: 'sent',
                content: '',
                sender: currentUser,
                subject: ''
            });
        }
    }, [communication, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'student_db_id' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.student_db_id <= 0) {
            toast.error('Please enter a valid Student ID');
            return;
        }
        setIsSaving(true);
        try {
            await onSave(formData);
            toast.success(communication ? 'Communication log updated' : 'Communication log created');
            onClose();
        } catch (error) {
            toast.error('Failed to save communication log');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0e042f]">{communication ? 'Communication Details' : 'New Communication Log'}</h2>
                        <p className="text-gray-500 text-sm mt-1">Record a new interaction with a student.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar-light">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student ID */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Student DB ID *</label>
                            <div className="relative">
                                <User size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                <input
                                    required
                                    type="number"
                                    name="student_db_id"
                                    value={formData.student_db_id === 0 ? '' : formData.student_db_id}
                                    onChange={handleChange}
                                    placeholder="Enter numeric ID"
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium"
                                />
                            </div>
                        </div>

                        {/* Sender */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Sender Name *</label>
                            <div className="relative">
                                <Send size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    name="sender"
                                    value={formData.sender}
                                    onChange={handleChange}
                                    placeholder="e.g. Admin User"
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium"
                                />
                            </div>
                        </div>

                        {/* Channel Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Channel *</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 my-auto flex items-center pointer-events-none">
                                    {formData.type === 'Email' ? <Mail size={18} className="text-blue-500" /> :
                                        formData.type === 'SMS' ? <MessageSquare size={18} className="text-purple-500" /> :
                                            formData.type === 'WhatsApp' ? <MessageCircle size={18} className="text-emerald-500" /> :
                                                <Send size={18} className="text-gray-400" />}
                                </div>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium appearance-none"
                                >
                                    <option value="Email">Email</option>
                                    <option value="SMS">SMS</option>
                                    <option value="WhatsApp">WhatsApp</option>
                                    <option value="Push">Push Notification</option>
                                </select>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] ml-1">Status *</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 my-auto flex items-center pointer-events-none">
                                    {formData.status === 'sent' ? <Send size={18} className="text-blue-500" /> :
                                        formData.status === 'delivered' ? <CheckCircle size={18} className="text-purple-500" /> :
                                            formData.status === 'read' ? <CheckCircle size={18} className="text-emerald-500" /> :
                                                <AlertCircle size={18} className="text-red-500" />}
                                </div>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-10 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium appearance-none"
                                >
                                    <option value="sent">Sent</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="read">Read</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#0e042f] ml-1">Subject</label>
                        <div className="relative">
                            <FileText size={18} className="absolute inset-y-0 left-4 my-auto text-gray-400" />
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="e.g. Application Update"
                                className="w-full bg-gray-50 border-none rounded-2xl h-[52px] pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#0e042f] ml-1">Message Content *</label>
                        <div className="relative">
                            <textarea
                                required
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Type the message content here..."
                                rows={6}
                                className="w-full bg-gray-50 border-none rounded-2xl p-6 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 font-medium resize-none shadow-inner"
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
                        {communication ? 'Update Log' : 'Save Communication Log'}
                    </button>
                </div>
            </div>
        </div>
    );
};
