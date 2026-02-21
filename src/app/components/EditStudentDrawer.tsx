import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Globe, GraduationCap, UserCheck, TrendingUp, FileText, AlertCircle, Phone, Mail, Calendar as CalendarIcon, MapPin, Target, ShieldCheck } from 'lucide-react';
import { CustomSelect } from './common/CustomSelect';
import { DateInput } from './ui/date-input';
import { toast } from 'sonner';
import { updateStudent, getStudentById, Student } from '../services/studentsService';
import { format } from 'date-fns';

interface EditStudentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student | null;
    onSave: (updatedStudent: Student) => void;
}

// Helper for safely parsing JSON
const safeJSONParse = (value: any) => {
    try {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === 'object') return value;
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

export const EditStudentDrawer: React.FC<EditStudentDrawerProps> = ({ isOpen, onClose, student, onSave }) => {
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
        riskLevel: 'low' as 'low' | 'medium' | 'high',
        leadSource: '',
        campaign: '',
        countryPreferences: [] as string[],
        notes: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [accountStatus, setAccountStatus] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && student) {
            console.log('Drawer opened or student changed, populating form. student.id:', student.id);
            // Immediate population from existing data
            populateForm(student);

            // Fresh fetch in background
            if (student.id) {
                const fetchFreshData = async () => {
                    setIsLoading(true);
                    try {
                        const freshStudent = await getStudentById(student.id);
                        console.log('Fresh background data received:', freshStudent);
                        populateForm(freshStudent);
                    } catch (error) {
                        console.error('Failed to fetch fresh student data:', error);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchFreshData();
            }
        }
    }, [isOpen, student]);

    const populateForm = (studentData: any) => {
        if (!studentData) return;

        // Guard against invalid data objects (like success messages)
        const hasRequiredFields = studentData.first_name || studentData.last_name || studentData.email || studentData.student_id;

        console.log('populateForm called. studentData present:', !!studentData, 'hasRequiredFields:', !!hasRequiredFields);

        if (!hasRequiredFields) {
            console.warn('populateForm blocked: studentData missing required fields', studentData);
            return;
        }

        setFormData({
            firstName: studentData.first_name || '',
            lastName: studentData.last_name || '',
            email: studentData.email || '',
            dateOfBirth: studentData.date_of_birth ? format(new Date(studentData.date_of_birth), 'yyyy-MM-dd') : '',
            countryCode: studentData.country_code || '+1',
            phoneNumber: studentData.phone_number || '',
            nationality: studentData.nationality || '',
            currentCountry: studentData.current_country || '',
            primaryDestination: studentData.primary_destination || '',
            intendedIntake: studentData.intended_intake || '',
            currentStage: studentData.current_stage || '',
            assignedCounselor: studentData.assigned_counselor || '',
            riskLevel: studentData.risk_level || 'low',
            leadSource: studentData.lead_source || '',
            campaign: studentData.campaign || '',
            countryPreferences: safeJSONParse(studentData.country_preferences),
            notes: studentData.notes || '',
        });
        const rawStatus = studentData.account_status as any;
        setAccountStatus(rawStatus === true || rawStatus === 'true' || rawStatus === 1 || rawStatus === '1');
        setErrors({});
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Valid email is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors');
            return;
        }

        if (!student) return;

        setIsSubmitting(true);
        console.log('Original student data:', student);
        try {
            const payload = {
                ...formData,
                accountStatus: accountStatus
            };
            console.log('Sending update payload:', payload);

            const result = await updateStudent(student.id, payload);
            console.log('Update result:', result);
            toast.success('Student profile updated');

            // Map camelCase payload back to snake_case for local state consistency
            const mappedUpdatedStudent = {
                ...student,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                date_of_birth: formData.dateOfBirth,
                country_code: formData.countryCode,
                phone_number: formData.phoneNumber,
                nationality: formData.nationality,
                current_country: formData.currentCountry,
                primary_destination: formData.primaryDestination,
                intended_intake: formData.intendedIntake,
                current_stage: formData.currentStage,
                assigned_counselor: formData.assignedCounselor,
                risk_level: formData.riskLevel,
                lead_source: formData.leadSource,
                campaign: formData.campaign,
                country_preferences: JSON.stringify(formData.countryPreferences),
                notes: formData.notes,
                account_status: accountStatus
            };

            // Backend returns message, so we must use our mapped object to keep UI in sync
            onSave(mappedUpdatedStudent);
            onClose();
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('Failed to update student');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-[2px]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-[#0e042f] px-8 py-6 text-white relative flex-shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -z-0"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 text-purple-200 mb-2">
                                        <User size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Edit Student Profile</span>
                                    </div>
                                    <h2 className="text-2xl font-bold">Edit Information</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar-light space-y-8 relative">
                            {isLoading && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Refreshing Data...</span>
                                    </div>
                                </div>
                            )}
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <User size={16} className="text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Personal Details</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        />
                                        {errors.firstName && <p className="text-[10px] text-red-500 font-bold">{errors.firstName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        />
                                        {errors.lastName && <p className="text-[10px] text-red-500 font-bold">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        />
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date of Birth</label>
                                        <DateInput
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            className="w-full h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                                        <div className="flex gap-2">
                                            <CustomSelect
                                                value={formData.countryCode}
                                                onChange={(val) => setFormData({ ...formData, countryCode: val })}
                                                options={[
                                                    { value: '+1', label: '+1' },
                                                    { value: '+44', label: '+44' },
                                                    { value: '+91', label: '+91' },
                                                    { value: '+61', label: '+61' },
                                                ]}
                                                className="w-24"
                                            />
                                            <input
                                                type="tel"
                                                value={formData.phoneNumber}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, ''); // Digits only
                                                    setFormData({ ...formData, phoneNumber: val });
                                                }}
                                                className="flex-1 h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Academic info */}
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                        <GraduationCap size={16} className="text-purple-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Academic & Lead Context</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Primary Destination</label>
                                        <CustomSelect
                                            value={formData.primaryDestination}
                                            onChange={(val) => setFormData({ ...formData, primaryDestination: val })}
                                            options={[
                                                { value: 'usa', label: 'USA' },
                                                { value: 'uk', label: 'UK' },
                                                { value: 'canada', label: 'Canada' },
                                                { value: 'australia', label: 'Australia' },
                                            ]}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Intake Term</label>
                                        <CustomSelect
                                            value={formData.intendedIntake}
                                            onChange={(val) => setFormData({ ...formData, intendedIntake: val })}
                                            options={[
                                                { value: 'fall-2025', label: 'Fall 2025' },
                                                { value: 'spring-2026', label: 'Spring 2026' },
                                            ]}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nationality</label>
                                        <input
                                            type="text"
                                            value={formData.nationality}
                                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lead Source</label>
                                        <CustomSelect
                                            value={formData.leadSource}
                                            onChange={(val) => setFormData({ ...formData, leadSource: val })}
                                            options={[
                                                { value: 'organic-search', label: 'Organic Search' },
                                                { value: 'referral', label: 'Referral' },
                                                { value: 'social-media', label: 'Social Media' },
                                            ]}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status and Risk */}
                            <div className="space-y-6 pt-4 pb-10">
                                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                        <ShieldCheck size={16} className="text-emerald-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Internal Controls</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Account Status</label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setAccountStatus(!accountStatus)}
                                                className={`relative w-12 h-6 rounded-full transition-all duration-200 ${accountStatus ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${accountStatus ? 'translate-x-7' : 'translate-x-1'}`} />
                                            </button>
                                            <span className={`text-sm font-bold ${accountStatus ? 'text-emerald-700' : 'text-gray-500'}`}>
                                                {accountStatus ? 'Active Account' : 'Inactive Account'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Risk Level</label>
                                        <div className="flex gap-2">
                                            {(['low', 'medium', 'high'] as const).map((level) => (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, riskLevel: level })}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${formData.riskLevel === level
                                                        ? level === 'low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            level === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                'bg-red-50 text-red-700 border-red-200'
                                                        : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200'
                                                        }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Internal Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm min-h-[120px]"
                                        placeholder="Add private staff notes here..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-8 py-2.5 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0a4a] transition-all text-sm font-bold shadow-lg shadow-purple-900/20 flex items-center gap-2 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                Save Profile Changes
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
