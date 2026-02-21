"use client";

import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, Save, TrendingUp, Globe, Calendar, User, GraduationCap, FileText, UserCheck } from 'lucide-react';
import { CustomSelect } from './common/CustomSelect';
import { DateInput } from './ui/date-input';
import { toast } from 'sonner';

interface AddStudentPageProps {
  onNavigate?: (page: string) => void;
}

export const AddStudentPage: React.FC<AddStudentPageProps> = ({ onNavigate }) => {
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
    // New fields
    studentIntent: '',
    interestedServices: [] as string[],
    communicationPreference: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accountStatus, setAccountStatus] = useState(true);

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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Student created successfully');
    setIsSubmitting(false);
    onNavigate?.('students-all');
  };

  const handleCancel = () => {
    // Check if form has unsaved changes
    const hasChanges = Object.values(formData).some(value =>
      Array.isArray(value) ? value.length > 0 : value !== '' && value !== 'low'
    );

    if (hasChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }

    onNavigate?.('students');
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);

    // Simulate API call to save draft
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Draft saved successfully');
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f9fb] custom-scrollbar-light">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-[#62748e] hover:text-[#0f172b] mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium text-sm sm:text-base">Back to Students</span>
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-[32px] font-bold text-[#0f172b] mb-1 sm:mb-2">Add New Student</h1>
              <p className="text-sm sm:text-base text-[#62748e]">Create a student profile to begin applications and services</p>
            </div>

            {/* Action Buttons - Top Right */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="px-6 py-3 bg-white text-[#0e042f] border border-[#0e042f] rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0e042f]/30 border-t-[#0e042f] rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Draft
                  </>
                )}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#0e042f] text-white rounded-xl hover:bg-[#1a0c4a] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20 text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Student
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Shopify-Style Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* LEFT COLUMN - Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* SECTION 1: Basic Information */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-purple-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f172b]">Basic Information</h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                      className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 transition-all text-base ${errors.firstName
                        ? 'border-red-300 focus:ring-red-100'
                        : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'
                        }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} />
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
                      className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 transition-all text-base ${errors.lastName
                        ? 'border-red-300 focus:ring-red-100'
                        : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'
                        }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 transition-all text-base ${errors.email
                      ? 'border-red-300 focus:ring-red-100'
                      : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'
                      }`}
                    placeholder="student@email.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Date of Birth</label>
                  <DateInput
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                  <p className="text-xs text-[#62748e] mt-1.5">Used for eligibility and compliance checks</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Phone Number</label>
                  <div className="flex gap-3">
                    <CustomSelect
                      value={formData.countryCode}
                      onChange={(value) => setFormData({ ...formData, countryCode: value })}
                      options={[
                        { value: '+1', label: '🇺🇸 +1' },
                        { value: '+44', label: '🇬🇧 +44' },
                        { value: '+61', label: '🇦🇺 +61' },
                        { value: '+91', label: '🇮🇳 +91' },
                      ]}
                      className="w-32"
                    />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="flex-1 h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base"
                      placeholder="555-123-4567"
                    />
                  </div>
                </div>

                {/* Nationality & Residence Section */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Globe size={14} className="text-blue-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Nationality & Residence</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Nationality</label>
                      <CustomSelect
                        value={formData.nationality}
                        onChange={(value) => setFormData({ ...formData, nationality: value })}
                        options={[
                          { value: 'indian', label: 'Indian' },
                          { value: 'american', label: 'American' },
                          { value: 'british', label: 'British' },
                          { value: 'canadian', label: 'Canadian' },
                          { value: 'australian', label: 'Australian' },
                          { value: 'chinese', label: 'Chinese' },
                          { value: 'other', label: 'Other' },
                        ]}
                        placeholder="Select nationality"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Current Country of Residence</label>
                      <CustomSelect
                        value={formData.currentCountry}
                        onChange={(value) => setFormData({ ...formData, currentCountry: value })}
                        options={[
                          { value: 'india', label: 'India' },
                          { value: 'usa', label: 'United States' },
                          { value: 'uk', label: 'United Kingdom' },
                          { value: 'canada', label: 'Canada' },
                          { value: 'australia', label: 'Australia' },
                          { value: 'china', label: 'China' },
                          { value: 'other', label: 'Other' },
                        ]}
                        placeholder="Select country"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Student ID</label>
                  <input
                    type="text"
                    value="Auto-generated on save"
                    disabled
                    className="w-full h-[44px] px-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed text-base"
                  />
                  <p className="text-xs text-[#62748e] mt-1.5">Generated on save</p>
                </div>
              </div>
            </div>

            {/* SECTION 2: Academic Context */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={14} className="text-blue-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f172b]">Academic Context</h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Primary Destination</label>
                  <CustomSelect
                    value={formData.primaryDestination}
                    onChange={(value) => setFormData({ ...formData, primaryDestination: value })}
                    options={[
                      { value: 'usa', label: 'USA' },
                      { value: 'canada', label: 'Canada' },
                      { value: 'uk', label: 'UK' },
                      { value: 'australia', label: 'Australia' },
                      { value: 'europe', label: 'Europe' },
                      { value: 'other', label: 'Other' },
                    ]}
                    placeholder="Select destination"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Intended Intake</label>
                  <CustomSelect
                    value={formData.intendedIntake}
                    onChange={(value) => setFormData({ ...formData, intendedIntake: value })}
                    options={[
                      { value: 'fall-2025', label: 'Fall 2025' },
                      { value: 'spring-2026', label: 'Spring 2026' },
                      { value: 'fall-2026', label: 'Fall 2026' },
                      { value: 'spring-2027', label: 'Spring 2027' },
                    ]}
                    placeholder="Select intake"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Current Stage</label>
                  <CustomSelect
                    value={formData.currentStage}
                    onChange={(value) => setFormData({ ...formData, currentStage: value })}
                    options={[
                      { value: 'prospect', label: 'Prospect' },
                      { value: 'applied', label: 'Applied' },
                      { value: 'offer-received', label: 'Offer Received' },
                      { value: 'enrolled', label: 'Enrolled' },
                    ]}
                    placeholder="Select stage"
                  />
                </div>

                {/* NEW: Student Intent */}
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Student Type / Primary Intent</label>
                  <CustomSelect
                    value={formData.studentIntent}
                    onChange={(value) => setFormData({ ...formData, studentIntent: value })}
                    options={[
                      { value: 'study-abroad-degree', label: 'Study Abroad (Degree)' },
                      { value: 'language-program', label: 'Language Program' },
                      { value: 'short-term-course', label: 'Short-Term Course' },
                      { value: 'exchange-program', label: 'Exchange Program' },
                      { value: 'not-sure', label: 'Not Sure Yet' },
                    ]}
                    placeholder="Select student type"
                  />
                  <p className="text-xs text-[#62748e] mt-1.5">Defines the student&apos;s primary journey and helps route services correctly</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Sidebar (1/3 width) */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* SECTION 3: Assignment & Status */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <UserCheck size={14} className="text-emerald-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f172b]">Assignment & Status</h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-2">Account Status</label>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <button
                      onClick={() => setAccountStatus(!accountStatus)}
                      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${accountStatus ? 'bg-emerald-600' : 'bg-gray-300'
                        }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${accountStatus ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                      />
                    </button>
                    <div>
                      <p className="text-sm font-medium text-[#0f172b]">{accountStatus ? 'Active' : 'Inactive'}</p>
                      <p className="text-xs text-[#62748e]">Student can access their portal</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Assigned Counselor</label>
                  <CustomSelect
                    value={formData.assignedCounselor}
                    onChange={(value) => setFormData({ ...formData, assignedCounselor: value })}
                    options={[
                      { value: 'sarah-johnson', label: 'Sarah Johnson' },
                      { value: 'mike-davis', label: 'Mike Davis' },
                      { value: 'emma-wilson', label: 'Emma Wilson' },
                      { value: 'john-smith', label: 'John Smith' },
                    ]}
                    placeholder="Select counselor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Risk Level</label>
                  <CustomSelect
                    value={formData.riskLevel}
                    onChange={(value) => setFormData({ ...formData, riskLevel: value })}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                    ]}
                  />
                  <p className="text-xs text-[#62748e] mt-1.5">Default: Low</p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Lead & Attribution */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={14} className="text-amber-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f172b]">Lead & Attribution</h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Lead Source</label>
                  <CustomSelect
                    value={formData.leadSource}
                    onChange={(value) => setFormData({ ...formData, leadSource: value })}
                    options={[
                      { value: 'organic', label: 'Organic Search' },
                      { value: 'referral', label: 'Referral' },
                      { value: 'paid-ads', label: 'Paid Ads' },
                      { value: 'event', label: 'Event / Fair' },
                      { value: 'partner', label: 'Partner' },
                      { value: 'counselor', label: 'Counselor Added' },
                    ]}
                    placeholder="Select lead source"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Campaign / Referrer</label>
                  <input
                    type="text"
                    value={formData.campaign}
                    onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                    className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base"
                    placeholder="Enter campaign or referrer name"
                  />
                  <p className="text-xs text-[#62748e] mt-1.5">Optional</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Created By</label>
                  <input
                    type="text"
                    value="Admin User"
                    disabled
                    className="w-full h-[44px] px-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-base font-medium"
                  />
                  <p className="text-xs text-[#62748e] mt-1.5">System recorded</p>
                </div>

                {/* NEW: Communication Preference */}
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Preferred Communication Channel</label>
                  <CustomSelect
                    value={formData.communicationPreference}
                    onChange={(value) => setFormData({ ...formData, communicationPreference: value })}
                    options={[
                      { value: 'whatsapp', label: 'WhatsApp' },
                      { value: 'email', label: 'Email' },
                      { value: 'phone', label: 'Phone Call' },
                    ]}
                    placeholder="Select channel"
                  />
                  <p className="text-xs text-[#62748e] mt-1.5">Preferred channel for counselor communication</p>
                </div>
              </div>
            </div>

            {/* SECTION 5: Optional Metadata */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-slate-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f172b]">Optional Metadata</h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Country Preference</label>
                  <CustomSelect
                    value=""
                    onChange={(value) => {
                      // This would need to be a multi-select in a real implementation
                      console.log('Selected:', value);
                    }}
                    options={[
                      { value: 'usa', label: 'USA' },
                      { value: 'canada', label: 'Canada' },
                      { value: 'uk', label: 'UK' },
                      { value: 'australia', label: 'Australia' },
                      { value: 'germany', label: 'Germany' },
                      { value: 'france', label: 'France' },
                    ]}
                    placeholder="Select countries (multi-select)"
                  />
                  <p className="text-xs text-[#62748e] mt-1.5">You can select multiple countries</p>
                </div>

                {/* NEW: Interested Services */}
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Interested Services</label>
                  <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    {[
                      { value: 'visa', label: 'Visa Assistance' },
                      { value: 'loan', label: 'Education Loan' },
                      { value: 'housing', label: 'Housing' },
                      { value: 'forex', label: 'Forex' },
                      { value: 'insurance', label: 'Insurance' },
                      { value: 'employment', label: 'Employment Support' },
                      { value: 'counseling', label: 'Counseling Only' },
                    ].map((service) => (
                      <label key={service.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interestedServices.includes(service.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                interestedServices: [...formData.interestedServices, service.value],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                interestedServices: formData.interestedServices.filter((s) => s !== service.value),
                              });
                            }
                          }}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{service.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-[#62748e] mt-1.5">Helps counselors and operations prioritize services after student creation</p>
                </div>

                {/* NEW: Timezone */}
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Timezone</label>
                  <CustomSelect
                    value={formData.timezone}
                    onChange={(value) => setFormData({ ...formData, timezone: value })}
                    options={[
                      { value: 'America/New_York', label: 'Eastern Time (ET)' },
                      { value: 'America/Chicago', label: 'Central Time (CT)' },
                      { value: 'America/Denver', label: 'Mountain Time (MT)' },
                      { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                      { value: 'Europe/London', label: 'GMT / London' },
                      { value: 'Europe/Paris', label: 'CET / Paris' },
                      { value: 'Asia/Dubai', label: 'GST / Dubai' },
                      { value: 'Asia/Kolkata', label: 'IST / India' },
                      { value: 'Asia/Shanghai', label: 'CST / China' },
                      { value: 'Asia/Tokyo', label: 'JST / Japan' },
                      { value: 'Australia/Sydney', label: 'AEDT / Sydney' },
                    ]}
                  />
                  <p className="text-xs text-[#62748e] mt-1.5">Used for scheduling calls and notifications. Auto-detected by system</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base"
                    placeholder="Add any additional notes about the student..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};