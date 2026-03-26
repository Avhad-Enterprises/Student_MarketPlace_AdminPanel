
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Globe, GraduationCap, UserCheck, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { CustomSelect } from './common/CustomSelect';
import { DateInput } from './ui/date-input';
import { toast } from 'sonner';
import { createStudent, updateStudent, Student } from '../services/studentsService';


// Helper for safely parsing JSON
const safeJSONParse = (value: any) => {
    try {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === 'object') return value; // Already parsed object
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed) return [];
            return JSON.parse(trimmed);
        }
        return [];
    } catch (e) {
        console.error('Failed to parse JSON:', value);
        return [];
    }
};

interface AddStudentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStudentAdded?: () => void;
    studentToEdit?: Student | null;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ open, onOpenChange, onStudentAdded, studentToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        countryCode: '+1',
        phoneNumber: '',
        nationality: '',
        currentCountry: '',
        primaryDestination: '',
        intendedIntake: '',
        currentStage: '',
        assignedCounselor: '',
        riskLevel: 'low',
        leadSource: '',
        campaign: '',
        countryPreferences: [] as string[],
        notes: '',
        studentIntent: '',
        interestedServices: [] as string[],
        communicationPreference: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [accountStatus, setAccountStatus] = useState(true);

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            if (studentToEdit) {
                // Populate form for editing
                setFormData({
                    firstName: studentToEdit.first_name || '',
                    lastName: studentToEdit.last_name || '',
                    email: studentToEdit.email || '',
                    // Format date to YYYY-MM-DD if it exists
                    dateOfBirth: studentToEdit.date_of_birth ? new Date(studentToEdit.date_of_birth).toISOString().split('T')[0] : '',
                    countryCode: studentToEdit.country_code || '+1',
                    phoneNumber: studentToEdit.phone_number || '',
                    nationality: studentToEdit.nationality || '',
                    currentCountry: studentToEdit.current_country || '',
                    primaryDestination: studentToEdit.primary_destination || '',
                    intendedIntake: studentToEdit.intended_intake || '',
                    currentStage: studentToEdit.current_stage || '',
                    assignedCounselor: studentToEdit.assigned_counselor || '',
                    riskLevel: studentToEdit.risk_level || 'low',
                    leadSource: studentToEdit.lead_source || '',
                    campaign: studentToEdit.campaign || '',
                    countryPreferences: safeJSONParse(studentToEdit.country_preferences),
                    notes: studentToEdit.notes || '',
                    studentIntent: '', // Not in backend payload
                    interestedServices: [], // Not in backend payload
                    communicationPreference: '', // Not in backend payload
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                });
                // Robust check for account status to handle booleans, strings ('true'/'false'), and numbers (1/0)
                const rawStatus = studentToEdit.account_status as any;
                const isActive = rawStatus === true || rawStatus === 'true' || rawStatus === 1 || rawStatus === '1';
                setAccountStatus(isActive);
            } else {
                // Reset for new student
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    dateOfBirth: '',
                    countryCode: '+1',
                    phoneNumber: '',
                    nationality: '',
                    currentCountry: '',
                    primaryDestination: '',
                    intendedIntake: '',
                    currentStage: '',
                    assignedCounselor: '',
                    riskLevel: 'low',
                    leadSource: '',
                    campaign: '',
                    countryPreferences: [],
                    notes: '',
                    studentIntent: '',
                    interestedServices: [],
                    communicationPreference: '',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                });
                setAccountStatus(true);
            }
            setErrors({});
        }
    }, [open, studentToEdit]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsSubmitting(true);

        try {
            if (studentToEdit) {
                console.log("Submitting update for ID:", studentToEdit.id);
                console.log("Account Status sending:", accountStatus);
                console.log("Risk Level:", formData.riskLevel);

                await updateStudent(studentToEdit.id, {
                    ...formData,
                    riskLevel: formData.riskLevel,
                    accountStatus: accountStatus,
                });
                toast.success('Student updated successfully');
            } else {
                await createStudent({
                    ...formData,
                    riskLevel: formData.riskLevel,
                    accountStatus: accountStatus,
                });
                toast.success('Student created successfully');
            }

            setIsSubmitting(false);
            onOpenChange(false);
            onStudentAdded?.();
        } catch (error) {
            console.error('Failed to save student:', error);
            toast.error(studentToEdit ? 'Failed to update student' : 'Failed to create student');
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Check if form has unsaved changes
        const hasChanges = Object.values(formData).some(value =>
            Array.isArray(value) ? value.length > 0 : value !== '' && value !== 'low' && value !== '+1' && value !== Intl.DateTimeFormat().resolvedOptions().timeZone
        );

        if (hasChanges) {
            const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
            if (!confirmed) return;
        }
        onOpenChange(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="bg-[#f8f9fb] rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold text-[#0f172b]">
                                        {studentToEdit ? 'Edit Student' : 'Add New Student'}
                                    </h2>
                                    <p className="text-sm text-[#62748e]">
                                        {studentToEdit ? 'Update student information' : 'Create a student profile to begin applications'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar-light">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* LEFT COLUMN - Main Content (2/3 width) */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* SECTION 1: Basic Information */}
                                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-2 mb-5">
                                                <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                    <User size={14} className="text-purple-600" />
                                                </div>
                                                <h3 className="text-base font-bold text-[#0f172b]">Basic Information</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">
                                                            First Name <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.firstName}
                                                            onChange={(e) => {
                                                                setFormData({ ...formData, firstName: e.target.value });
                                                                if (errors.firstName) setErrors({ ...errors, firstName: '' });
                                                            }}
                                                            className={`w-full h-[40px] px-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm ${errors.firstName
                                                                ? 'border-red-300 focus:ring-red-100'
                                                                : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'
                                                                }`}
                                                            placeholder="First name"
                                                        />
                                                        {errors.firstName && (
                                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                                <AlertCircle size={10} />
                                                                {errors.firstName}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">
                                                            Last Name <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.lastName}
                                                            onChange={(e) => {
                                                                setFormData({ ...formData, lastName: e.target.value });
                                                                if (errors.lastName) setErrors({ ...errors, lastName: '' });
                                                            }}
                                                            className={`w-full h-[40px] px-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm ${errors.lastName
                                                                ? 'border-red-300 focus:ring-red-100'
                                                                : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'
                                                                }`}
                                                            placeholder="Last name"
                                                        />
                                                        {errors.lastName && (
                                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                                <AlertCircle size={10} />
                                                                {errors.lastName}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">
                                                        Email <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => {
                                                            setFormData({ ...formData, email: e.target.value });
                                                            if (errors.email) setErrors({ ...errors, email: '' });
                                                        }}
                                                        className={`w-full h-[40px] px-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm ${errors.email
                                                            ? 'border-red-300 focus:ring-red-100'
                                                            : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'
                                                            }`}
                                                        placeholder="student@email.com"
                                                    />
                                                    {errors.email && (
                                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                            <AlertCircle size={10} />
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <DateInput
                                                        label="Date of Birth"
                                                        value={formData.dateOfBirth}
                                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                    />
                                                    <div>
                                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Phone</label>
                                                        <div className="flex gap-2">
                                                            <CustomSelect
                                                                value={formData.countryCode}
                                                                onChange={(value) => setFormData({ ...formData, countryCode: value })}
                                                                options={[
                                                                    { value: '+1', label: '🇺🇸 +1' },
                                                                    { value: '+44', label: '🇬🇧 +44' },
                                                                    { value: '+91', label: '🇮🇳 +91' },
                                                                ]}
                                                                className="w-24"
                                                            />
                                                            <input
                                                                type="tel"
                                                                value={formData.phoneNumber}
                                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                                className="flex-1 h-[40px] px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-sm"
                                                                placeholder="555-0000"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 2: Academic Context */}
                                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-2 mb-5">
                                                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <GraduationCap size={14} className="text-blue-600" />
                                                </div>
                                                <h3 className="text-base font-bold text-[#0f172b]">Academic Context</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Destination</label>
                                                        <CustomSelect
                                                            value={formData.primaryDestination}
                                                            onChange={(value) => setFormData({ ...formData, primaryDestination: value })}
                                                            options={[
                                                                { value: 'usa', label: 'USA' },
                                                                { value: 'canada', label: 'Canada' },
                                                                { value: 'uk', label: 'UK' },
                                                                { value: 'australia', label: 'Australia' },
                                                            ]}
                                                            placeholder="Select destination"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Intake</label>
                                                        <CustomSelect
                                                            value={formData.intendedIntake}
                                                            onChange={(value) => setFormData({ ...formData, intendedIntake: value })}
                                                            options={[
                                                                { value: 'fall-2025', label: 'Fall 2025' },
                                                                { value: 'spring-2026', label: 'Spring 2026' },
                                                            ]}
                                                            placeholder="Select intake"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Student Intent</label>
                                                    <CustomSelect
                                                        value={formData.studentIntent}
                                                        onChange={(value) => setFormData({ ...formData, studentIntent: value })}
                                                        options={[
                                                            { value: 'study-abroad-degree', label: 'Study Abroad (Degree)' },
                                                            { value: 'language-program', label: 'Language Program' },
                                                        ]}
                                                        placeholder="Select intent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT COLUMN - Sidebar (1/3 width) */}
                                    <div className="lg:col-span-1 space-y-6">
                                        {/* SECTION 3: Status */}
                                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                            <h3 className="text-sm font-bold text-[#0f172b] mb-4 uppercase tracking-wider">Status & Assignment</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Account Status</label>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setAccountStatus(!accountStatus)}
                                                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${accountStatus ? 'bg-emerald-600' : 'bg-gray-300'}`}
                                                        >
                                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${accountStatus ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                                        </button>
                                                        <span className="text-sm font-medium text-[#0f172b]">{accountStatus ? 'Active' : 'Inactive'}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Counselor</label>
                                                    <CustomSelect
                                                        value={formData.assignedCounselor}
                                                        onChange={(value) => setFormData({ ...formData, assignedCounselor: value })}
                                                        options={[
                                                            { value: 'sarah-johnson', label: 'Sarah Johnson' },
                                                            { value: 'mike-davis', label: 'Mike Davis' },
                                                        ]}
                                                        placeholder="Select counselor"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 4: Notes */}
                                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                            <h3 className="text-sm font-bold text-[#0f172b] mb-4 uppercase tracking-wider">Internal Notes</h3>
                                            <textarea
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-sm"
                                                placeholder="Add notes..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
                                <button
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {studentToEdit ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            {studentToEdit ? 'Update Student' : 'Create Student'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
