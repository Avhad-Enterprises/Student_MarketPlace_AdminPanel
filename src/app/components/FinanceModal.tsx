"use client";

import React, { useState, useEffect } from 'react';
import { DateInput } from './ui/date-input';
import { X, Check, Calendar as CalendarIcon, DollarSign, Type, FileText, User, CreditCard } from 'lucide-react';
import { financeService, Payment, PaymentFormData } from '@/services/financeService';
import { leadStatusService, LeadStatus } from '@/services/leadStatusService';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface FinanceModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    payment?: Payment | null;
}

export const FinanceModal: React.FC<FinanceModalProps> = ({ open, onClose, onSave, payment }) => {
    const [students, setStudents] = useState<LeadStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<PaymentFormData>({
        student_db_id: 0,
        payment_id: '',
        invoice_number: '',
        description: '',
        amount: 0,
        currency: 'USD',
        service_type: 'General',
        status: 'pending',
        payment_method: 'Credit Card',
        due_date: format(new Date(), 'yyyy-MM-dd'),
        paid_date: null,
        notes: ''
    });

    useEffect(() => {
        if (open) {
            fetchStudents();
            if (payment) {
                setFormData({
                    student_db_id: payment.student_db_id,
                    payment_id: payment.payment_id,
                    invoice_number: payment.invoice_number,
                    description: payment.description,
                    amount: payment.amount,
                    currency: payment.currency,
                    service_type: payment.service_type || 'General',
                    status: payment.status,
                    payment_method: payment.payment_method,
                    due_date: payment.due_date ? format(new Date(payment.due_date), 'yyyy-MM-dd') : '',
                    paid_date: payment.paid_date ? format(new Date(payment.paid_date), 'yyyy-MM-dd') : null,
                    notes: payment.notes || ''
                });
            } else {
                setFormData({
                    student_db_id: 0,
                    payment_id: '',
                    invoice_number: '',
                    description: '',
                    amount: 0,
                    currency: 'USD',
                    service_type: 'General',
                    status: 'pending',
                    payment_method: 'Credit Card',
                    due_date: format(new Date(), 'yyyy-MM-dd'),
                    paid_date: null,
                    notes: ''
                });
            }
        }
    }, [open, payment]);

    const fetchStudents = async () => {
        try {
            const data = await leadStatusService.getAllLeads();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.student_db_id === 0) {
            toast.error('Please select a student');
            return;
        }
        
        if (formData.amount <= 0) {
            toast.error('Amount must be greater than 0');
            return;
        }

        setLoading(true);
        try {
            if (payment) {
                await financeService.updatePayment(payment.id, formData);
                toast.success('Invoice updated successfully');
            } else {
                await financeService.createPayment(formData);
                toast.success('Invoice created successfully');
            }
            onSave();
            onClose();
        } catch (error: any) {
            console.error('Error saving payment:', error);
            const message = error.response?.data?.error || error.message || 'Failed to save invoice';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0e042f]">{payment ? 'Edit Invoice' : 'Create New Invoice'}</h2>
                        <p className="text-sm text-gray-500 mt-1">Fill in the details for the financial record</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"><X size={20} className="text-gray-400" /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar-light">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Student Selection */}
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2"><User size={16} className="text-indigo-600" />Student</label>
                                <select
                                    value={formData.student_db_id}
                                    onChange={(e) => setFormData({ ...formData, student_db_id: parseInt(e.target.value) })}
                                    className="w-full h-12 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-4 transition-all"
                                    required
                                >
                                    <option value={0}>Select a student</option>
                                    {students.map((student) => (
                                        <option key={student.db_id} value={student.db_id}>
                                            {student.first_name} {student.last_name} ({student.student_id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Service Type - NEW */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2"><Type size={16} className="text-indigo-600" />Service Type</label>
                                <select
                                    value={formData.service_type}
                                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                    className="w-full h-12 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-4 transition-all"
                                    required
                                >
                                    <option value="Tuition">Tuition</option>
                                    <option value="Accommodation">Accommodation</option>
                                    <option value="Visa Fee">Visa Fee</option>
                                    <option value="Service Fee">Service Fee</option>
                                    <option value="Insurance">Insurance</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Amount & Currency */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2"><DollarSign size={16} className="text-indigo-600" />Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                    className="w-full h-12 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-4 transition-all font-bold text-indigo-600"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2"><FileText size={16} className="text-indigo-600" />Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="e.g. Q3 Installment"
                                    className="w-full h-12 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-4 transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2"><Type size={16} className="text-indigo-600" />Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full h-12 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-4 transition-all"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="INR">INR (₹)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>

                            {/* Status & Method */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2"><Check size={16} className="text-indigo-600" />Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full h-12 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-4 transition-all"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2"><CreditCard size={16} className="text-indigo-600" />Payment Method</label>
                                <select
                                    value={formData.payment_method}
                                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                    className="w-full h-12 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-4 transition-all"
                                >
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <DateInput
                                label="Due Date"
                                required
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            />

                            <DateInput
                                label="Paid Date (Optional)"
                                value={formData.paid_date || ''}
                                onChange={(e) => setFormData({ ...formData, paid_date: e.target.value || null })}
                            />

                            {/* Notes */}
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2"><FileText size={16} className="text-indigo-600" />Notes</label>
                                <textarea
                                    value={formData.notes || ''}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Additional details..."
                                    className="w-full h-24 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none p-4 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-6 border-t border-gray-100 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl bg-gray-50 text-gray-700 font-semibold hover:bg-gray-100 transition-all border border-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-12 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                payment ? 'Update Invoice' : 'Create Invoice'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
