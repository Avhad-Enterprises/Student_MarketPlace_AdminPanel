import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Globe, Briefcase, MapPin, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { toast } from "sonner";
import { LeadStatus, LeadFormData, leadStatusService } from '../../services/leadStatusService';
import { CustomSelect } from './common/CustomSelect';

interface LeadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead?: LeadStatus | null;
    onSuccess: () => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ open, onOpenChange, lead, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<LeadFormData>({
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '',
        phoneNumber: '',
        nationality: '',
        currentCountry: '',
        primaryDestination: '',
        intendedIntake: '',
        currentStage: 'new',
        riskLevel: 'low',
        leadSource: 'Direct',
        assignedCounselor: '',
        notes: '',
    });

    useEffect(() => {
        if (lead) {
            setFormData({
                firstName: lead.first_name || '',
                lastName: lead.last_name || '',
                email: '', // Backend doesn't return email in LeadStatus
                countryCode: '',
                phoneNumber: '',
                nationality: lead.country || '',
                currentCountry: lead.country || '',
                primaryDestination: '',
                intendedIntake: '',
                currentStage: lead.stage || 'new',
                riskLevel: lead.risk_level || 'low',
                leadSource: 'Direct',
                assignedCounselor: lead.counselor || '',
                notes: '',
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                countryCode: '',
                phoneNumber: '',
                nationality: '',
                currentCountry: '',
                primaryDestination: '',
                intendedIntake: '',
                currentStage: 'new',
                riskLevel: 'low',
                leadSource: 'Direct',
                assignedCounselor: '',
                notes: '',
            });
        }
    }, [lead, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (lead) {
                await leadStatusService.updateLead(lead.db_id, formData);
                toast.success('Lead updated successfully');
            } else {
                await leadStatusService.createLead(formData);
                toast.success('Lead created successfully');
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Error saving lead:', error);
            toast.error(lead ? 'Failed to update lead' : 'Failed to create lead');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof LeadFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl p-0">
                <div className="bg-[#0e042f] p-6 text-white sticky top-0 z-10 flex items-center justify-between">
                    <div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                {lead ? 'Edit Lead' : 'Add New Lead'}
                            </DialogTitle>
                        </DialogHeader>
                        <p className="text-purple-200 text-sm mt-1">Fill in the student details to {lead ? 'update' : 'create'} a lead.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2">
                                <User size={16} className="text-purple-600" /> First Name *
                            </label>
                            <input
                                required
                                value={formData.firstName}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 transition-all outline-none"
                                placeholder="e.g. John"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2">
                                <User size={16} className="text-purple-600" /> Last Name *
                            </label>
                            <input
                                required
                                value={formData.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 transition-all outline-none"
                                placeholder="e.g. Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2">
                                <Mail size={16} className="text-purple-600" /> Email *
                            </label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 transition-all outline-none"
                                placeholder="john.doe@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2">
                                <Phone size={16} className="text-purple-600" /> Phone Number
                            </label>
                            <input
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 transition-all outline-none"
                                placeholder="+1 234 567 890"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2">
                                <Globe size={16} className="text-purple-600" /> Current Country
                            </label>
                            <input
                                value={formData.currentCountry}
                                onChange={(e) => handleChange('currentCountry', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 transition-all outline-none"
                                placeholder="e.g. India"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2">
                                <MapPin size={16} className="text-purple-600" /> Primary Destination
                            </label>
                            <input
                                value={formData.primaryDestination}
                                onChange={(e) => handleChange('primaryDestination', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 transition-all outline-none"
                                placeholder="e.g. USA, UK"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2">
                                <Briefcase size={16} className="text-purple-600" /> Assigned Counselor
                            </label>
                            <input
                                value={formData.assignedCounselor}
                                onChange={(e) => handleChange('assignedCounselor', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 transition-all outline-none"
                                placeholder="e.g. Sarah Johnson"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] mb-2">Stage</label>
                            <CustomSelect
                                value={formData.currentStage || 'new'}
                                onChange={(val) => handleChange('currentStage', val)}
                                options={[
                                    { value: 'new', label: 'New/Inquiry' },
                                    { value: 'lead', label: 'Qualified Lead' },
                                    { value: 'application', label: 'Application' },
                                    { value: 'visa', label: 'Visa Process' },
                                    { value: 'completed', label: 'Completed' },
                                ]}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] mb-2">Risk Level</label>
                            <CustomSelect
                                value={formData.riskLevel || 'low'}
                                onChange={(val) => handleChange('riskLevel', val)}
                                options={[
                                    { value: 'low', label: 'Low Risk' },
                                    { value: 'medium', label: 'Medium Risk' },
                                    { value: 'high', label: 'High Risk' },
                                ]}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-[#0e042f] flex items-center gap-2">
                                <AlertCircle size={16} className="text-purple-600" /> Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-600 transition-all outline-none resize-none"
                                placeholder="Additional details about the student..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 px-6 py-4 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-4 bg-[#0e042f] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 hover:bg-[#1a0c4a] transition-all disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <RefreshCw className="animate-spin" size={20} />
                            ) : (
                                <Save size={20} />
                            )}
                            {lead ? 'Update Lead' : 'Create Lead'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LeadModal;
