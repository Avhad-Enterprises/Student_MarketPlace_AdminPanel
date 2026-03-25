"use client";

import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, Save, TrendingUp, Globe, Calendar, User, GraduationCap, FileText, UserCheck, Building, MessageSquare, Plane, PlaneTakeoff, List, Target, Users, CheckCircle } from 'lucide-react';
import { CustomSelect } from './common/CustomSelect';
import { DateInput } from './ui/date-input';
import { toast } from 'sonner';
import { createStudent } from '../services/studentsService';
import { createApplication } from '../services/applicationsService';
import { Plus, Trash2 } from 'lucide-react';

export interface DraftApplication {
  id: string; // local id for ui rendering
  universityName: string;
  country: string;
  course: string;
  intake: string;
  previousEducation: string;
  gpa: string;
  testScores: string;
  notes: string;
  status: string;
  offerStatus: string;
  counselor: string;
  backlogs: string;
  program: string;
  specialization: string;
  applicationType: string;
}

interface AddStudentPageProps {
  onNavigate?: (page: string) => void;
}

export const AddStudentPage: React.FC<AddStudentPageProps> = ({ onNavigate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic-info');
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
    // Existing extended fields
    studentIntent: '',
    interestedServices: [] as string[],
    communicationPreference: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // New fields
    highestQualification: '',
    fieldOfStudy: '',
    currentInstitution: '',
    graduationYear: '',
    gpa: '',
    firstTouchDate: '',
    conversionPathSummary: '',
    preferredCourseLevel: '',
    budgetRange: '',
    intakePreference: '',
    testScores: '',
    // Planning & Application fields
    planningCountries: '',
    planningIntake: '',
    planningCourseLevel: '',
    planningFieldOfStudy: '',
    careerGoal: '',
    longTermPlan: '',
    annualBudget: '',
    fundingSource: '',
    familyConstraints: '',
    timelineUrgency: '',
    consultationNotes: '',
    
    evalGradingSystem: '',
    evalInstitutionTier: '',
    evalBacklogs: '',
    evalWorkExp: '',
    evalFieldRelevance: '',
    evalInternships: '',
    evalResearch: '',
    evalGapYears: '',
    evalAdditionalNotes: '',
    
    eligibilityPrerequisites: false,
    eligibilityBridgeCourse: false,
    eligibilityEnglishTest: false,
    eligibilityFundsReady: false,
    eligibilitySponsorIdentified: false,
    eligibilityLoanRequired: false,
    eligibilityGapExplanation: false,
    visaRisk: '',
    visaNotes: '',
    
    intendedJobRole: '',
    preferredIndustry: '',
    careerCountryPreference: '',
    jobMarketAwareness: '',
    salaryExpectations: '',
    stayBackInterest: false,
    careerDiscussionNotes: '',

    // University Shortlisting
    shortlistedUniversities: '',
    shortlistedCourseDetails: '',
    shortlistedCountry: '',
    shortlistedPriority: '',
    shortlistedIntake: '',
    shortlistedBudgetFit: '',
    shortlistedEligibilityFit: '',
    shortlistedVisaSafety: '',

    // Application Strategy
    appStrategyOrder: '',
    appStrategyType: '',
    appStrategyDeadlineAwareness: '',
    appStrategyDeadlineRisk: '',
    appStrategySopApproach: '',
    appStrategyCustomizationLevel: '',
    appStrategyLorType: '',
    appStrategyLorCount: '',
    appStrategyNotes: '',

    // SOP Review & Editing
    sopVersion: '',
    sopDraftStatus: '',
    sopAssignedEditor: '',
    sopStructureQuality: '',
    sopContentRelevance: '',
    sopLanguageClarity: '',
    sopFeedbackNotes: '',
    sopRevisionCount: '',

    // LOR Coordination
    lorCountRequired: '',
    lorRecommenderName: '',
    lorRecommenderRelation: '',
    lorRecommenderEmail: '',
    lorCurrentStatus: '',
    lorCoordinationNotes: '',

    // Application Submission Support
    submissionSopUploaded: false,
    submissionLorsUploaded: false,
    submissionTranscriptsUploaded: false,
    submissionFeePaid: false,
    submissionPortal: '',
    submissionConfirmationReceived: false,
    submissionDate: '',
    submissionErrorsFaced: '',
    submissionResolutionNotes: '',

    // Offer Review & Decision
    offerUniversityName: '',
    offerCourseName: '',
    offerCountry: '',
    offerIntake: '',
    offerType: '',
    offerConditions: '',
    offerDeadline: '',
    offerDepositRequired: false,
    offerDepositAmount: '',
    offerTuitionFee: '',
    offerLivingCost: '',
    offerScholarship: '',
    offerTotalCost: '',
    offerCourseRelevance: '',
    offerUniversityRanking: '',
    offerEmployabilityOutlook: '',
    offerIndustryAlignment: '',
    offerVisaProbability: '',
    offerCountryRisks: '',
    offerGapSensitivity: '',
    offerPreferenceLevel: '',
    offerFamilyConcerns: '',
    offerStudentQuestions: '',
    offerDiscussionSummary: '',

    // Visa & Compliance
    visaTargetCountry: '',
    visaType: '',
    visaStartDate: '',
    visaUniversityName: '',
    visaOfferUploaded: false,
    visaCasStatus: '',
    visaFundsProofAvailable: false,
    visaFundsSource: '',
    visaLoanStatus: '',
    visaBankStatementDuration: '',
    visaPassportValidity: '',
    visaTranscriptsUploaded: false,
    visaLanguageReportUploaded: false,
    visaMedicalUploaded: false,
    visaFormFilled: false,
    visaBiometricsRequired: false,
    visaAppointmentBooked: false,
    visaAppointmentDate: '',
    visaInterviewRequired: false,
    visaInterviewPrepDone: false,
    visaMockInterviewNotes: '',
    visaSpecialCaseNotes: '',
    visaInternalRemarks: '',

    compVisaStartDate: '',
    compVisaExpiryDate: '',
    compMultipleEntry: false,
    compWorkRestrictions: '',
    compAttendanceReq: '',
    compAddressReporting: false,
    compExtensionEligible: false,
    compExtensionType: '',
    compRenewalWindow: '',
    compCheckinsRequired: false,
    compLastReviewDate: '',
    compIssuesNoted: '',
    compPswInterest: false,
    compEligibilityAwareness: false,
    compNotes: '',

    // Pre-Departure Support
    predepTravelDate: '',
    predepFlightBooked: false,
    predepAirlineName: '',
    predepDepartureAirport: '',
    predepArrivalAirport: '',
    predepAccommodationType: '',
    predepAccommodationConfirmed: false,
    predepAddress: '',
    predepInitialStayDuration: '',
    predepInsuranceArranged: false,
    predepForexReady: false,
    predepDocsCollected: false,
    predepEmergencyContact: '',
    predepOrientationAttended: false,
    predepRulesExplained: false,
    predepReportingInstructionsShared: false,
    predepPackingGuidanceShared: false,
    predepRestrictedItemsExplained: false,
    predepWeatherAwareness: false,
    predepNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accountStatus, setAccountStatus] = useState(true);

  const [draftApplications, setDraftApplications] = useState<DraftApplication[]>([{
    id: Date.now().toString(),
    universityName: '',
    country: '',
    course: '',
    intake: '',
    previousEducation: '',
    gpa: '',
    testScores: '',
    notes: '',
    status: '',
    offerStatus: '',
    counselor: '',
    backlogs: '',
    program: '',
    specialization: '',
    applicationType: ''
  }]);

  const handleAddApplication = () => {
    setDraftApplications(prev => [...prev, {
      id: Date.now().toString(),
      universityName: '',
      country: '',
      course: '',
      intake: '',
      previousEducation: '',
      gpa: '',
      testScores: '',
      notes: '',
      status: '',
      offerStatus: '',
      counselor: '',
      backlogs: '',
      program: '',
      specialization: '',
      applicationType: ''
    }]);
  };

  const handleRemoveApplication = (id: string) => {
    setDraftApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleAppChange = (id: string, field: keyof DraftApplication, value: string) => {
    setDraftApplications(prev => prev.map(app => app.id === id ? { ...app, [field]: value } : app));
  };

  const handleCheckboxChange = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
      const payload = {
        ...formData,
        riskLevel: formData.riskLevel,
        accountStatus: accountStatus,
      };

      const createdStudent = await createStudent(payload);
      const studentDBid = createdStudent.id || createdStudent.student_id;
      
      // Save draft applications
      if (draftApplications.some(app => app.universityName.trim() !== '')) {
        for (const app of draftApplications) {
          if (!app.universityName.trim()) continue;
          
          const serializedNotes = `[Additional Application Data]
Course: ${app.course || 'N/A'}
Offer Status: ${app.offerStatus || 'N/A'}
Previous Education: ${app.previousEducation || 'N/A'}
GPA/Marks: ${app.gpa || 'N/A'}
Test Scores: ${app.testScores || 'N/A'}
Backlogs: ${app.backlogs || 'N/A'}
Program: ${app.program || 'N/A'}
Specialization: ${app.specialization || 'N/A'}
Application Type: ${app.applicationType || 'N/A'}

[Notes]
${app.notes || 'None provided'}`;

          await createApplication({
            studentDbId: studentDBid,
            universityName: app.universityName,
            country: app.country,
            intake: app.intake,
            status: app.status || 'in-progress',
            counselor: app.counselor,
            notes: serializedNotes
          });
        }
      }

      toast.success('Student Profile & Applications saved successfully');
      setIsSubmitting(false);
      onNavigate?.('students-all');
    } catch (error: any) {
      console.error('Failed to create student:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create student';
      toast.error(`Failed to create student: ${errorMsg}`);
      setIsSubmitting(false);
    }
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

        {/* Top Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 overflow-x-auto custom-scrollbar-hide mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('basic-info')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === 'basic-info'
                ? 'bg-purple-50 text-purple-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User size={18} />
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('add-application')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === 'add-application'
                ? 'bg-purple-50 text-purple-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Building size={18} />
            Add Application
          </button>
          <button
            onClick={() => setActiveTab('planning-and-application')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === 'planning-and-application'
                ? 'bg-purple-50 text-purple-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare size={18} />
            Planning & Application
          </button>
          <button
            onClick={() => setActiveTab('offer-review')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === 'offer-review'
                ? 'bg-purple-50 text-purple-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText size={18} />
            Offer Review & Decision
          </button>
          <button
            onClick={() => setActiveTab('visa-compliance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === 'visa-compliance'
                ? 'bg-purple-50 text-purple-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Plane size={18} />
            Visa & Compliance
          </button>
          <button
            onClick={() => setActiveTab('pre-departure-support')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === 'pre-departure-support'
                ? 'bg-purple-50 text-purple-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <PlaneTakeoff size={18} />
            Pre-Departure Support
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* LEFT COLUMN - Main Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {activeTab === 'basic-info' && (
              <>
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
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">First Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.firstName} onChange={(e) => { setFormData({ ...formData, firstName: e.target.value }); if (errors.firstName) setErrors({ ...errors, firstName: '' }); }} className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 transition-all text-base ${errors.firstName ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'}`} placeholder="Enter first name" />
                    {errors.firstName && <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Last Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.lastName} onChange={(e) => { setFormData({ ...formData, lastName: e.target.value }); if (errors.lastName) setErrors({ ...errors, lastName: '' }); }} className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 transition-all text-base ${errors.lastName ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'}`} placeholder="Enter last name" />
                    {errors.lastName && <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: '' }); }} className={`w-full h-[44px] px-4 border rounded-xl focus:outline-none focus:ring-2 transition-all text-base ${errors.email ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-purple-100 focus:border-purple-500'}`} placeholder="student@email.com" />
                  {errors.email && <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Date of Birth</label>
                    <DateInput value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                    <p className="text-xs text-[#62748e] mt-1.5">Used for eligibility and compliance checks</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Phone Number</label>
                    <div className="flex gap-3">
                      <CustomSelect value={formData.countryCode} onChange={(value) => setFormData({ ...formData, countryCode: value })} options={[{ value: '+1', label: '🇺🇸 +1' }, { value: '+44', label: '🇬🇧 +44' }, { value: '+61', label: '🇦🇺 +61' }, { value: '+91', label: '🇮🇳 +91' }]} className="w-32" />
                      <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="flex-1 h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="555-123-4567" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Nationality & Residence */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Globe size={14} className="text-blue-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f172b]">Nationality & Residence</h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Nationality</label>
                    <CustomSelect value={formData.nationality} onChange={(value) => setFormData({ ...formData, nationality: value })} options={[{ value: 'indian', label: 'Indian' }, { value: 'american', label: 'American' }, { value: 'british', label: 'British' }, { value: 'canadian', label: 'Canadian' }, { value: 'australian', label: 'Australian' }, { value: 'chinese', label: 'Chinese' }, { value: 'other', label: 'Other' }]} placeholder="Select nationality" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Current Country of Residence</label>
                    <CustomSelect value={formData.currentCountry} onChange={(value) => setFormData({ ...formData, currentCountry: value })} options={[{ value: 'india', label: 'India' }, { value: 'usa', label: 'United States' }, { value: 'uk', label: 'United Kingdom' }, { value: 'canada', label: 'Canada' }, { value: 'australia', label: 'Australia' }, { value: 'china', label: 'China' }, { value: 'other', label: 'Other' }]} placeholder="Select country" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Student ID</label>
                  <input type="text" value="Auto-generated on save" disabled className="w-full h-[44px] px-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed text-base" />
                  <p className="text-xs text-[#62748e] mt-1.5">Generated on save</p>
                </div>
              </div>
            </div>


            {/* SECTION 3: Academic Context */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={14} className="text-indigo-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f172b]">Academic Context</h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Primary Destination</label>
                    <CustomSelect value={formData.primaryDestination} onChange={(value) => setFormData({ ...formData, primaryDestination: value })} options={[{ value: 'usa', label: 'USA' }, { value: 'canada', label: 'Canada' }, { value: 'uk', label: 'UK' }, { value: 'australia', label: 'Australia' }, { value: 'europe', label: 'Europe' }, { value: 'other', label: 'Other' }]} placeholder="Select destination" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Intended Intake</label>
                    <CustomSelect value={formData.intendedIntake} onChange={(value) => setFormData({ ...formData, intendedIntake: value })} options={[{ value: 'fall-2025', label: 'Fall 2025' }, { value: 'spring-2026', label: 'Spring 2026' }, { value: 'fall-2026', label: 'Fall 2026' }, { value: 'spring-2027', label: 'Spring 2027' }]} placeholder="Select intake" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Current Stage</label>
                    <CustomSelect value={formData.currentStage} onChange={(value) => setFormData({ ...formData, currentStage: value })} options={[{ value: 'prospect', label: 'Prospect' }, { value: 'applied', label: 'Applied' }, { value: 'offer-received', label: 'Offer Received' }, { value: 'enrolled', label: 'Enrolled' }]} placeholder="Select stage" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Student Type / Primary Intent</label>
                    <CustomSelect value={formData.studentIntent} onChange={(value) => setFormData({ ...formData, studentIntent: value })} options={[{ value: 'study-abroad-degree', label: 'Study Abroad (Degree)' }, { value: 'language-program', label: 'Language Program' }, { value: 'short-term-course', label: 'Short-Term Course' }, { value: 'exchange-program', label: 'Exchange Program' }, { value: 'not-sure', label: 'Not Sure Yet' }]} placeholder="Select student type" />
                    <p className="text-xs text-[#62748e] mt-1.5">Defines the student&apos;s primary journey</p>
                  </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Lead Source</label>
                    <CustomSelect value={formData.leadSource} onChange={(value) => setFormData({ ...formData, leadSource: value })} options={[{ value: 'organic', label: 'Organic Search' }, { value: 'referral', label: 'Referral' }, { value: 'paid-ads', label: 'Paid Ads' }, { value: 'event', label: 'Event / Fair' }, { value: 'partner', label: 'Partner' }, { value: 'counselor', label: 'Counselor Added' }]} placeholder="Select lead source" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Campaign / Referrer</label>
                    <input type="text" value={formData.campaign} onChange={(e) => setFormData({ ...formData, campaign: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Enter campaign name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">First Touch Date</label>
                  <DateInput value={formData.firstTouchDate || ''} onChange={(e) => setFormData({ ...formData, firstTouchDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Conversion Path Summary</label>
                  <textarea value={formData.conversionPathSummary} onChange={(e) => setFormData({ ...formData, conversionPathSummary: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Describe the conversion path..." />
                </div>
              </div>
            </div>

            {/* SECTION 5: Intent & Preferences */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-pink-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f172b]">Intent & Preferences</h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Preferred Countries</label>
                    <CustomSelect value={formData.countryPreferences[0] || ''} onChange={(value) => setFormData({ ...formData, countryPreferences: [value] })} options={[{ value: 'usa', label: 'USA' }, { value: 'canada', label: 'Canada' }, { value: 'uk', label: 'UK' }, { value: 'australia', label: 'Australia' }]} placeholder="Select preferred countries" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Preferred Course Level</label>
                    <CustomSelect value={formData.preferredCourseLevel} onChange={(value) => setFormData({ ...formData, preferredCourseLevel: value })} options={[{ value: 'undergrad', label: 'Undergraduate' }, { value: 'postgrad', label: 'Postgraduate' }, { value: 'diploma', label: 'Diploma' }, { value: 'phd', label: 'PhD' }]} placeholder="Select preferred course level" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Budget Range</label>
                    <input type="text" value={formData.budgetRange} onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. $20k - $40k" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Intake Preference</label>
                    <CustomSelect value={formData.intakePreference} onChange={(value) => setFormData({ ...formData, intakePreference: value })} options={[{ value: 'fall', label: 'Fall' }, { value: 'spring', label: 'Spring' }, { value: 'summer', label: 'Summer' }, { value: 'winter', label: 'Winter' }]} placeholder="Select intake preference" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Test Scores (IELTS, GRE)</label>
                    <input type="text" value={formData.testScores} onChange={(e) => setFormData({ ...formData, testScores: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. IELTS 7.5, GRE 320" />
                  </div>
                </div>
              </div>
            </div>
            </>
            )}

            {activeTab === 'add-application' && (
              <div className="space-y-6">
                {draftApplications.map((app, index) => (
                  <div key={app.id} className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100 relative">
                    {draftApplications.length > 1 && (
                      <button onClick={() => handleRemoveApplication(app.id)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Building size={16} className="text-indigo-600" />
                      </div>
                      <h2 className="text-lg font-bold text-[#0f172b]">Application #{index + 1}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">University *</label>
                        <input type="text" value={app.universityName} onChange={(e) => handleAppChange(app.id, 'universityName', e.target.value)} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Enter university name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Application Status</label>
                        <CustomSelect value={app.status} onChange={(value) => handleAppChange(app.id, 'status', value)} options={[{ value: 'in-progress', label: 'In Progress' }, { value: 'submitted', label: 'Submitted' }, { value: 'decision-received', label: 'Decision Received' }, { value: 'pending-docs', label: 'Pending Docs' }, { value: 'closed', label: 'Closed' }]} placeholder="Select application status" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Country</label>
                        <CustomSelect value={app.country} onChange={(value) => handleAppChange(app.id, 'country', value)} options={[{ value: 'usa', label: 'USA' }, { value: 'uk', label: 'UK' }, { value: 'canada', label: 'Canada' }, { value: 'australia', label: 'Australia' }]} placeholder="Select country" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Offer Status</label>
                        <CustomSelect value={app.offerStatus} onChange={(value) => handleAppChange(app.id, 'offerStatus', value)} options={[{ value: 'pending', label: 'Pending' }, { value: 'conditional', label: 'Conditional' }, { value: 'unconditional', label: 'Unconditional' }, { value: 'rejected', label: 'Rejected' }, { value: 'withdrawn', label: 'Withdrawn' }]} placeholder="Select offer status" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Course</label>
                        <input type="text" value={app.course} onChange={(e) => handleAppChange(app.id, 'course', e.target.value)} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Enter course name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Assigned Counselor</label>
                        <input type="text" value={app.counselor} onChange={(e) => handleAppChange(app.id, 'counselor', e.target.value)} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Counselor name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Intake</label>
                        <input type="text" value={app.intake} onChange={(e) => handleAppChange(app.id, 'intake', e.target.value)} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Fall 2024" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Backlogs</label>
                        <input type="text" value={app.backlogs} onChange={(e) => handleAppChange(app.id, 'backlogs', e.target.value)} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Number of backlogs" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Previous Education</label>
                        <input type="text" value={app.previousEducation} onChange={(e) => handleAppChange(app.id, 'previousEducation', e.target.value)} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Previous degree" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Program</label>
                        <input type="text" value={app.program} onChange={(e) => handleAppChange(app.id, 'program', e.target.value)} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Program name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">GPA / Marks</label>
                        <input type="text" value={app.gpa} onChange={(e) => handleAppChange(app.id, 'gpa', e.target.value)} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Final score" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Specialization</label>
                        <input type="text" value={app.specialization} onChange={(e) => handleAppChange(app.id, 'specialization', e.target.value)} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Area of focus" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Test Scores</label>
                        <input type="text" value={app.testScores} onChange={(e) => handleAppChange(app.id, 'testScores', e.target.value)} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="IELTS/TOEFL/GRE/GMAT" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Application Type</label>
                        <CustomSelect value={app.applicationType} onChange={(value) => handleAppChange(app.id, 'applicationType', value)} options={[{ value: 'direct', label: 'Direct' }, { value: 'pathway', label: 'Pathway' }, { value: 'transfer', label: 'Transfer' }]} placeholder="Select application type" />
                      </div>
                    </div>
                    <div className="mt-5">
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Notes</label>
                      <textarea value={app.notes} onChange={(e) => handleAppChange(app.id, 'notes', e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Additional application notes..."></textarea>
                    </div>
                  </div>
                ))}
                
                <button onClick={handleAddApplication} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50/50 transition-all font-medium text-base">
                  <Plus size={20} />
                  Add New Application
                </button>
              </div>
            )}

            {activeTab === 'planning-and-application' && (
              <div className="space-y-6">
                {/* 1. University Selection Consultation */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={16} className="text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">University Selection Consultation</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Preferred Destination Countries</label>
                      <input type="text" value={formData.planningCountries} onChange={(e) => setFormData({ ...formData, planningCountries: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. USA, Germany" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Preferred Intake(s)</label>
                      <input type="text" value={formData.planningIntake} onChange={(e) => setFormData({ ...formData, planningIntake: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Fall 2024, Spring 2025" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Course Level</label>
                      <CustomSelect value={formData.planningCourseLevel} onChange={(value) => setFormData({ ...formData, planningCourseLevel: value })} options={[{ value: 'undergraduate', label: 'Undergraduate' }, { value: 'postgraduate', label: 'Postgraduate' }, { value: 'doctorate', label: 'Doctorate' }]} placeholder="Select course level" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Field(s) of Study</label>
                      <input type="text" value={formData.planningFieldOfStudy} onChange={(e) => setFormData({ ...formData, planningFieldOfStudy: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Data Science, MBA" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Career Goal</label>
                      <input type="text" value={formData.careerGoal} onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="What is the student's career goal?" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Long-term Plan</label>
                      <input type="text" value={formData.longTermPlan} onChange={(e) => setFormData({ ...formData, longTermPlan: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Long-term aspirations..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Annual Budget Range</label>
                      <input type="text" value={formData.annualBudget} onChange={(e) => setFormData({ ...formData, annualBudget: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. $20,000 - $50,000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Funding Source</label>
                      <input type="text" value={formData.fundingSource} onChange={(e) => setFormData({ ...formData, fundingSource: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Personal Savings, Loan, Scholarship" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Family / Location Constraints</label>
                      <input type="text" value={formData.familyConstraints} onChange={(e) => setFormData({ ...formData, familyConstraints: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Any specific constraints?" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Timeline Urgency</label>
                      <CustomSelect value={formData.timelineUrgency} onChange={(value) => setFormData({ ...formData, timelineUrgency: value })} options={[{ value: 'immediate', label: 'Immediate' }, { value: 'high', label: 'High' }, { value: 'moderate', label: 'Moderate' }, { value: 'low', label: 'Low' }]} placeholder="Select timeline urgency" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Conversation Notes</label>
                    <textarea value={formData.consultationNotes} onChange={(e) => setFormData({ ...formData, consultationNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Notes from the consultation..."></textarea>
                  </div>
                </div>

                {/* 2. Profile Evaluation */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={16} className="text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Profile Evaluation</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Highest Qualification</label>
                      <CustomSelect value={formData.highestQualification} onChange={(value) => setFormData({ ...formData, highestQualification: value })} options={[{ value: 'high-school', label: 'High School' }, { value: 'bachelors', label: 'Bachelors' }, { value: 'masters', label: 'Masters' }]} placeholder="Select highest qualification" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">GPA / Percentage</label>
                      <input type="text" value={formData.gpa} onChange={(e) => setFormData({ ...formData, gpa: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Score" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Grading System</label>
                      <CustomSelect value={formData.evalGradingSystem} onChange={(value) => setFormData({ ...formData, evalGradingSystem: value })} options={[{ value: 'percentage', label: 'Percentage' }, { value: 'gpa-4', label: 'GPA (4.0)' }, { value: 'gpa-10', label: 'GPA (10.0)' }]} placeholder="Select grading system" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Institution Type / Tier</label>
                      <CustomSelect value={formData.evalInstitutionTier} onChange={(value) => setFormData({ ...formData, evalInstitutionTier: value })} options={[{ value: 'tier-1', label: 'Tier 1' }, { value: 'tier-2', label: 'Tier 2' }, { value: 'tier-3', label: 'Tier 3' }]} placeholder="Select institution type / tier" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Backlogs</label>
                      <input type="text" value={formData.evalBacklogs} onChange={(e) => setFormData({ ...formData, evalBacklogs: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Number of backlogs" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Work Experience (Years)</label>
                      <input type="text" value={formData.evalWorkExp} onChange={(e) => setFormData({ ...formData, evalWorkExp: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. 2 years" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Field Relevance</label>
                      <CustomSelect value={formData.evalFieldRelevance} onChange={(value) => setFormData({ ...formData, evalFieldRelevance: value })} options={[{ value: 'highly-relevant', label: 'Highly Relevant' }, { value: 'relevant', label: 'Relevant' }, { value: 'not-relevant', label: 'Not Relevant' }]} placeholder="Select field relevance" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Gap Years</label>
                      <input type="text" value={formData.evalGapYears} onChange={(e) => setFormData({ ...formData, evalGapYears: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Number of gap years" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Internships / Projects</label>
                      <textarea value={formData.evalInternships} onChange={(e) => setFormData({ ...formData, evalInternships: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="List key internships and projects..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Research / Publications</label>
                      <textarea value={formData.evalResearch} onChange={(e) => setFormData({ ...formData, evalResearch: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="List research work..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Additional Notes</label>
                      <textarea value={formData.evalAdditionalNotes} onChange={(e) => setFormData({ ...formData, evalAdditionalNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Additional notes..."></textarea>
                    </div>
                  </div>
                </div>

                {/* 3. Eligibility & Readiness Check */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                      <UserCheck size={16} className="text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Eligibility & Readiness Check</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'eligibilityPrerequisites', label: 'Meets Course Prerequisites' },
                        { id: 'eligibilityBridgeCourse', label: 'Bridge Course Required' },
                        { id: 'eligibilityEnglishTest', label: 'English Test Required' },
                        { id: 'eligibilityFundsReady', label: 'Proof of Funds Ready' },
                        { id: 'eligibilitySponsorIdentified', label: 'Sponsor Identified' },
                        { id: 'eligibilityLoanRequired', label: 'Loan Required' },
                        { id: 'eligibilityGapExplanation', label: 'Gap Explanation Required for Visa' },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={(formData as any)[item.id]}
                            onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Country-specific Visa Risk</label>
                      <CustomSelect value={formData.visaRisk} onChange={(value) => setFormData({ ...formData, visaRisk: value })} options={[{ value: 'low', label: 'Low' }, { value: 'moderate', label: 'Moderate' }, { value: 'high', label: 'High' }]} placeholder="Select country-specific visa risk" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Visa Notes</label>
                      <textarea value={formData.visaNotes} onChange={(e) => setFormData({ ...formData, visaNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Visa notes..."></textarea>
                    </div>
                  </div>
                </div>

                {/* 4. Career Outcome Insights */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={16} className="text-orange-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Career Outcome Insights</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Intended Job Role</label>
                      <input type="text" value={formData.intendedJobRole} onChange={(e) => setFormData({ ...formData, intendedJobRole: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Software Engineer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Preferred Industry</label>
                      <input type="text" value={formData.preferredIndustry} onChange={(e) => setFormData({ ...formData, preferredIndustry: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Tech, Finance" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Country Preference for Career</label>
                      <input type="text" value={formData.careerCountryPreference} onChange={(e) => setFormData({ ...formData, careerCountryPreference: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Canada, Germany" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Awareness of Job Market</label>
                      <CustomSelect value={formData.jobMarketAwareness} onChange={(value) => setFormData({ ...formData, jobMarketAwareness: value })} options={[{ value: 'high', label: 'High' }, { value: 'moderate', label: 'Moderate' }, { value: 'low', label: 'Low' }]} placeholder="Select awareness of job market" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Salary Expectations</label>
                      <input type="text" value={formData.salaryExpectations} onChange={(e) => setFormData({ ...formData, salaryExpectations: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Expected salary range" />
                    </div>
                    <div className="flex items-center mt-8">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.stayBackInterest}
                          onChange={(e) => handleCheckboxChange('stayBackInterest', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">PR / Stay-back Interest</span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Career Discussion Notes</label>
                    <textarea value={formData.careerDiscussionNotes} onChange={(e) => setFormData({ ...formData, careerDiscussionNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Career discussion notes..."></textarea>
                  </div>
                </div>

                {/* 5. University Shortlisting */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                      <List size={16} className="text-purple-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">University Shortlisting</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Preferred Universities</label>
                      <input type="text" value={formData.shortlistedUniversities} onChange={(e) => setFormData({ ...formData, shortlistedUniversities: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="List of universities..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Preferred Course per University</label>
                      <input type="text" value={formData.shortlistedCourseDetails} onChange={(e) => setFormData({ ...formData, shortlistedCourseDetails: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Course details..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Country</label>
                      <CustomSelect value={formData.shortlistedCountry} onChange={(value) => setFormData({ ...formData, shortlistedCountry: value })} options={[{ value: 'usa', label: 'USA' }, { value: 'uk', label: 'UK' }, { value: 'canada', label: 'Canada' }]} placeholder="Select country" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Priority Level</label>
                      <CustomSelect value={formData.shortlistedPriority} onChange={(value) => setFormData({ ...formData, shortlistedPriority: value })} options={[{ value: 'dream', label: 'Dream' }, { value: 'reach', label: 'Reach' }, { value: 'safety', label: 'Safety' }]} placeholder="Select priority level" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Intake</label>
                      <input type="text" value={formData.shortlistedIntake} onChange={(e) => setFormData({ ...formData, shortlistedIntake: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Fall 2024" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Budget Fit</label>
                      <CustomSelect value={formData.shortlistedBudgetFit} onChange={(value) => setFormData({ ...formData, shortlistedBudgetFit: value })} options={[{ value: 'within', label: 'Within Budget' }, { value: 'slight-stretch', label: 'Slight Stretch' }, { value: 'above', label: 'Above Budget' }]} placeholder="Select budget fit" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Eligibility Fit</label>
                      <CustomSelect value={formData.shortlistedEligibilityFit} onChange={(value) => setFormData({ ...formData, shortlistedEligibilityFit: value })} options={[{ value: 'qualified', label: 'Qualified' }, { value: 'borderline', label: 'Borderline' }, { value: 'under-qualified', label: 'Under-qualified' }]} placeholder="Select eligibility fit" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Visa Safety Consideration</label>
                      <CustomSelect value={formData.shortlistedVisaSafety} onChange={(value) => setFormData({ ...formData, shortlistedVisaSafety: value })} options={[{ value: 'safe', label: 'Safe' }, { value: 'moderate', label: 'Moderate' }, { value: 'risky', label: 'Risky' }]} placeholder="Select visa safety consideration" />
                    </div>
                  </div>
                </div>

                {/* 6. Application Strategy */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <Target size={16} className="text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Application Strategy</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Application Order</label>
                      <input type="text" value={formData.appStrategyOrder} onChange={(e) => setFormData({ ...formData, appStrategyOrder: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. 1st, 2nd..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Application Type</label>
                      <CustomSelect value={formData.appStrategyType} onChange={(value) => setFormData({ ...formData, appStrategyType: value })} options={[{ value: 'early-decision', label: 'Early Decision' }, { value: 'regular', label: 'Regular' }, { value: 'rolling', label: 'Rolling' }]} placeholder="Select application type" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Deadline Awareness</label>
                      <CustomSelect value={formData.appStrategyDeadlineAwareness} onChange={(value) => setFormData({ ...formData, appStrategyDeadlineAwareness: value })} options={[{ value: 'aware', label: 'Fully Aware' }, { value: 'partial', label: 'Partially Aware' }, { value: 'not-aware', label: 'Not Aware' }]} placeholder="Select deadline awareness" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Deadline Risk Level</label>
                      <CustomSelect value={formData.appStrategyDeadlineRisk} onChange={(value) => setFormData({ ...formData, appStrategyDeadlineRisk: value })} options={[{ value: 'low', label: 'Low' }, { value: 'moderate', label: 'Moderate' }, { value: 'high', label: 'High' }]} placeholder="Select deadline risk level" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">SOP Approach</label>
                      <input type="text" value={formData.appStrategySopApproach} onChange={(e) => setFormData({ ...formData, appStrategySopApproach: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="SOP strategy..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Customization Level</label>
                      <CustomSelect value={formData.appStrategyCustomizationLevel} onChange={(value) => setFormData({ ...formData, appStrategyCustomizationLevel: value })} options={[{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} placeholder="Select customization level" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">LOR Type</label>
                      <CustomSelect value={formData.appStrategyLorType} onChange={(value) => setFormData({ ...formData, appStrategyLorType: value })} options={[{ value: 'academic', label: 'Academic' }, { value: 'professional', label: 'Professional' }, { value: 'mixed', label: 'Mixed' }]} placeholder="Select lor type" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Number of LORs Required</label>
                      <input type="text" value={formData.appStrategyLorCount} onChange={(e) => setFormData({ ...formData, appStrategyLorCount: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Count" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Strategy Notes</label>
                    <textarea value={formData.appStrategyNotes} onChange={(e) => setFormData({ ...formData, appStrategyNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Strategy notes..."></textarea>
                  </div>
                </div>

                {/* 7. SOP Review & Editing */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">SOP Review & Editing</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">SOP Version</label>
                      <input type="text" value={formData.sopVersion} onChange={(e) => setFormData({ ...formData, sopVersion: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="v1, v2..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Draft Status</label>
                      <CustomSelect value={formData.sopDraftStatus} onChange={(value) => setFormData({ ...formData, sopDraftStatus: value })} options={[{ value: 'not-started', label: 'Not Started' }, { value: 'first-draft', label: 'First Draft' }, { value: 'final', label: 'Final' }]} placeholder="Select draft status" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Assigned Editor</label>
                      <input type="text" value={formData.sopAssignedEditor} onChange={(e) => setFormData({ ...formData, sopAssignedEditor: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Editor name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Structure Quality</label>
                      <CustomSelect value={formData.sopStructureQuality} onChange={(value) => setFormData({ ...formData, sopStructureQuality: value })} options={[{ value: 'good', label: 'Good' }, { value: 'average', label: 'Average' }, { value: 'poor', label: 'Poor' }]} placeholder="Select structure quality" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Content Relevance</label>
                      <CustomSelect value={formData.sopContentRelevance} onChange={(value) => setFormData({ ...formData, sopContentRelevance: value })} options={[{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} placeholder="Select content relevance" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Language & Clarity</label>
                      <CustomSelect value={formData.sopLanguageClarity} onChange={(value) => setFormData({ ...formData, sopLanguageClarity: value })} options={[{ value: 'excellent', label: 'Excellent' }, { value: 'good', label: 'Good' }, { value: 'needs-work', label: 'Needs Work' }]} placeholder="Select language & clarity" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Feedback Notes</label>
                      <textarea value={formData.sopFeedbackNotes} onChange={(e) => setFormData({ ...formData, sopFeedbackNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Feedback notes..."></textarea>
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Revision Count</label>
                      <input type="text" value={formData.sopRevisionCount} onChange={(e) => setFormData({ ...formData, sopRevisionCount: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Revision count" />
                    </div>
                  </div>
                </div>

                {/* 8. LOR Coordination */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Users size={16} className="text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">LOR Coordination</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Number of LORs Required</label>
                      <input type="text" value={formData.lorCountRequired} onChange={(e) => setFormData({ ...formData, lorCountRequired: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Count" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Recommender Name</label>
                      <input type="text" value={formData.lorRecommenderName} onChange={(e) => setFormData({ ...formData, lorRecommenderName: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Recommender name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Relationship to Student</label>
                      <input type="text" value={formData.lorRecommenderRelation} onChange={(e) => setFormData({ ...formData, lorRecommenderRelation: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Relationship to student" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Recommender Email</label>
                      <input type="email" value={formData.lorRecommenderEmail} onChange={(e) => setFormData({ ...formData, lorRecommenderEmail: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Recommender email" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Current Status</label>
                      <CustomSelect value={formData.lorCurrentStatus} onChange={(value) => setFormData({ ...formData, lorCurrentStatus: value })} options={[{ value: 'requested', label: 'Requested' }, { value: 'received', label: 'Received' }, { value: 'uploaded', label: 'Uploaded' }]} placeholder="Select current status" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Coordination Notes</label>
                    <textarea value={formData.lorCoordinationNotes} onChange={(e) => setFormData({ ...formData, lorCoordinationNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Coordination notes..."></textarea>
                  </div>
                </div>

                {/* 9. Application Submission Support */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Application Submission Support</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'submissionSopUploaded', label: 'SOP Uploaded' },
                        { id: 'submissionLorsUploaded', label: 'LORs Uploaded' },
                        { id: 'submissionTranscriptsUploaded', label: 'Transcripts Uploaded' },
                        { id: 'submissionFeePaid', label: 'Application Fee Paid' },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={(formData as any)[item.id]}
                            onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Submission Date</label>
                        <input type="date" value={formData.submissionDate} onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Application Portal</label>
                        <input type="text" value={formData.submissionPortal} onChange={(e) => setFormData({ ...formData, submissionPortal: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="URL or Portal Name" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.submissionConfirmationReceived}
                          onChange={(e) => handleCheckboxChange('submissionConfirmationReceived', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Confirmation Received</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Errors Faced</label>
                      <textarea value={formData.submissionErrorsFaced} onChange={(e) => setFormData({ ...formData, submissionErrorsFaced: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Errors faced..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Resolution Notes</label>
                      <textarea value={formData.submissionResolutionNotes} onChange={(e) => setFormData({ ...formData, submissionResolutionNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Resolution notes..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'offer-review' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* 1. Offer Details */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Offer Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Offer Received From</label>
                      <input type="text" value={formData.offerUniversityName} onChange={(e) => setFormData({ ...formData, offerUniversityName: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="University Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Course Name</label>
                      <input type="text" value={formData.offerCourseName} onChange={(e) => setFormData({ ...formData, offerCourseName: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Course Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Country</label>
                      <CustomSelect value={formData.offerCountry} onChange={(value) => setFormData({ ...formData, offerCountry: value })} options={[{ value: 'usa', label: 'USA' }, { value: 'uk', label: 'UK' }, { value: 'canada', label: 'Canada' }, { value: 'australia', label: 'Australia' }]} placeholder="Select country" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Intake</label>
                      <input type="text" value={formData.offerIntake} onChange={(e) => setFormData({ ...formData, offerIntake: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Fall 2025" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Offer Type</label>
                      <CustomSelect value={formData.offerType} onChange={(value) => setFormData({ ...formData, offerType: value })} options={[{ value: 'conditional', label: 'Conditional' }, { value: 'unconditional', label: 'Unconditional' }, { value: 'rejected', label: 'Rejected' }, { value: 'waitlisted', label: 'Waitlisted' }]} placeholder="Select offer type" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Conditions Mentioned</label>
                    <textarea value={formData.offerConditions} onChange={(e) => setFormData({ ...formData, offerConditions: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="List any conditions mentioned..."></textarea>
                  </div>
                </div>

                {/* 2. Financial Considerations */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={16} className="text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Financial Considerations</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Offer Deadline</label>
                      <input type="date" value={formData.offerDeadline} onChange={(e) => setFormData({ ...formData, offerDeadline: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" />
                    </div>
                    <div className="flex items-center mt-7">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.offerDepositRequired}
                          onChange={(e) => handleCheckboxChange('offerDepositRequired', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Deposit Required</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Deposit Amount</label>
                      <input type="text" value={formData.offerDepositAmount} onChange={(e) => setFormData({ ...formData, offerDepositAmount: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. $2000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Tuition Fee (Annual)</label>
                      <input type="text" value={formData.offerTuitionFee} onChange={(e) => setFormData({ ...formData, offerTuitionFee: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. $30000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Estimated Living Cost</label>
                      <input type="text" value={formData.offerLivingCost} onChange={(e) => setFormData({ ...formData, offerLivingCost: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. $15000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Scholarship Offered</label>
                      <input type="text" value={formData.offerScholarship} onChange={(e) => setFormData({ ...formData, offerScholarship: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. $5000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Total First-Year Cost</label>
                      <input type="text" value={formData.offerTotalCost} onChange={(e) => setFormData({ ...formData, offerTotalCost: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Sum of fees + living - scholarship" />
                    </div>
                  </div>
                </div>

                {/* 3. Strategic Analysis */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <Target size={16} className="text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Strategic Analysis</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Course Relevance</label>
                      <CustomSelect value={formData.offerCourseRelevance} onChange={(value) => setFormData({ ...formData, offerCourseRelevance: value })} options={[{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} placeholder="Select course relevance" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">University Ranking / Reputation</label>
                      <input type="text" value={formData.offerUniversityRanking} onChange={(e) => setFormData({ ...formData, offerUniversityRanking: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Top 100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Employability Outlook</label>
                      <CustomSelect value={formData.offerEmployabilityOutlook} onChange={(value) => setFormData({ ...formData, offerEmployabilityOutlook: value })} options={[{ value: 'high', label: 'High' }, { value: 'moderate', label: 'Moderate' }, { value: 'low', label: 'Low' }]} placeholder="Select employability outlook" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Industry Alignment</label>
                      <CustomSelect value={formData.offerIndustryAlignment} onChange={(value) => setFormData({ ...formData, offerIndustryAlignment: value })} options={[{ value: 'excellent', label: 'Excellent' }, { value: 'good', label: 'Good' }, { value: 'fair', label: 'Fair' }]} placeholder="Select industry alignment" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Visa Success Probability</label>
                      <CustomSelect value={formData.offerVisaProbability} onChange={(value) => setFormData({ ...formData, offerVisaProbability: value })} options={[{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} placeholder="Select visa success probability" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Gap Sensitivity</label>
                      <CustomSelect value={formData.offerGapSensitivity} onChange={(value) => setFormData({ ...formData, offerGapSensitivity: value })} options={[{ value: 'high', label: 'High' }, { value: 'moderate', label: 'Moderate' }, { value: 'low', label: 'Low' }]} placeholder="Select gap sensitivity" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Student Preference Level</label>
                      <CustomSelect value={formData.offerPreferenceLevel} onChange={(value) => setFormData({ ...formData, offerPreferenceLevel: value })} options={[{ value: 'first-choice', label: 'First Choice' }, { value: 'backup', label: 'Backup' }, { value: 'interested', label: 'Interested' }]} placeholder="Select preference level" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Country-specific Risks</label>
                    <input type="text" value={formData.offerCountryRisks} onChange={(e) => setFormData({ ...formData, offerCountryRisks: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="List any country-specific concerns" />
                  </div>
                </div>

                {/* 4. Counseling & Final Review */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={16} className="text-purple-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Counseling & Final Review</h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Family Concerns Raised</label>
                      <textarea value={formData.offerFamilyConcerns} onChange={(e) => setFormData({ ...formData, offerFamilyConcerns: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Family concerns..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Student Questions / Doubts</label>
                      <textarea value={formData.offerStudentQuestions} onChange={(e) => setFormData({ ...formData, offerStudentQuestions: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Student's questions..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Discussion Summary</label>
                      <textarea value={formData.offerDiscussionSummary} onChange={(e) => setFormData({ ...formData, offerDiscussionSummary: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Brief summary of the discussion..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visa-compliance' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* 1. Visa Application Assistance */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <Plane size={16} className="text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Visa Application Assistance</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Target Country</label>
                      <CustomSelect value={formData.visaTargetCountry} onChange={(value) => setFormData({ ...formData, visaTargetCountry: value })} options={[{ value: 'usa', label: 'USA' }, { value: 'uk', label: 'UK' }, { value: 'canada', label: 'Canada' }, { value: 'australia', label: 'Australia' }]} placeholder="Select target country" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Visa Type</label>
                      <input type="text" value={formData.visaType} onChange={(e) => setFormData({ ...formData, visaType: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. F-1, Student Visa" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Intake / Start Date</label>
                      <input type="date" value={formData.visaStartDate} onChange={(e) => setFormData({ ...formData, visaStartDate: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">University Name</label>
                      <input type="text" value={formData.visaUniversityName} onChange={(e) => setFormData({ ...formData, visaUniversityName: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="University Name" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.visaOfferUploaded}
                          onChange={(e) => handleCheckboxChange('visaOfferUploaded', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Offer Letter Uploaded</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">CAS / I-20 / COE Status</label>
                      <CustomSelect value={formData.visaCasStatus} onChange={(value) => setFormData({ ...formData, visaCasStatus: value })} options={[{ value: 'pending', label: 'Pending' }, { value: 'received', label: 'Received' }, { value: 'under-process', label: 'Under Process' }, { value: 'requested', label: 'Requested' }]} placeholder="Select status" />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.visaFundsProofAvailable}
                          onChange={(e) => handleCheckboxChange('visaFundsProofAvailable', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Proof of Funds Available</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Funds Source</label>
                        <input type="text" value={formData.visaFundsSource} onChange={(e) => setFormData({ ...formData, visaFundsSource: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Savings, Loan" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Loan Status</label>
                        <CustomSelect value={formData.visaLoanStatus} onChange={(value) => setFormData({ ...formData, visaLoanStatus: value })} options={[{ value: 'not-needed', label: 'Not Needed' }, { value: 'applied', label: 'Applied' }, { value: 'sanctioned', label: 'Sanctioned' }, { value: 'disbursed', label: 'Disbursed' }]} placeholder="Select loan status" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Bank Statement Duration Covered</label>
                        <input type="text" value={formData.visaBankStatementDuration} onChange={(e) => setFormData({ ...formData, visaBankStatementDuration: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. 6 Months" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Passport Validity</label>
                        <input type="date" value={formData.visaPassportValidity} onChange={(e) => setFormData({ ...formData, visaPassportValidity: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { id: 'visaTranscriptsUploaded', label: 'Academic Transcripts' },
                      { id: 'visaLanguageReportUploaded', label: 'Language Test Report' },
                      { id: 'visaMedicalUploaded', label: 'Medical / Insurance' },
                      { id: 'visaFormFilled', label: 'Visa Application Filled' },
                      { id: 'visaBiometricsRequired', label: 'Biometrics Required' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={(formData as any)[item.id]}
                          onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-8 space-y-5">
                    <div className="flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.visaAppointmentBooked}
                          onChange={(e) => handleCheckboxChange('visaAppointmentBooked', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Appointment Booked</span>
                      </label>
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Appointment Date</label>
                        <input type="date" value={formData.visaAppointmentDate} onChange={(e) => setFormData({ ...formData, visaAppointmentDate: e.target.value })} className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.visaInterviewRequired}
                          onChange={(e) => handleCheckboxChange('visaInterviewRequired', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Interview Required</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.visaInterviewPrepDone}
                          onChange={(e) => handleCheckboxChange('visaInterviewPrepDone', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Interview Prep Done</span>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Mock Interview Notes</label>
                        <textarea value={formData.visaMockInterviewNotes} onChange={(e) => setFormData({ ...formData, visaMockInterviewNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Notes from mock sessions..."></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Special Case Notes</label>
                        <textarea value={formData.visaSpecialCaseNotes} onChange={(e) => setFormData({ ...formData, visaSpecialCaseNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Any special cases or risks..."></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Internal Remarks</label>
                        <textarea value={formData.visaInternalRemarks} onChange={(e) => setFormData({ ...formData, visaInternalRemarks: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Internal team notes..."></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Compliance & Renewals */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Compliance & Renewals</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Visa Start Date</label>
                      <input type="date" value={formData.compVisaStartDate} onChange={(e) => setFormData({ ...formData, compVisaStartDate: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Visa Expiry Date</label>
                      <input type="date" value={formData.compVisaExpiryDate} onChange={(e) => setFormData({ ...formData, compVisaExpiryDate: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.compMultipleEntry}
                          onChange={(e) => handleCheckboxChange('compMultipleEntry', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Multiple Entry Allowed</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Work Hour Restrictions</label>
                      <input type="text" value={formData.compWorkRestrictions} onChange={(e) => setFormData({ ...formData, compWorkRestrictions: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. 20 hrs/week" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Attendance Requirements</label>
                      <input type="text" value={formData.compAttendanceReq} onChange={(e) => setFormData({ ...formData, compAttendanceReq: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. 80%" />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.compAddressReporting}
                          onChange={(e) => handleCheckboxChange('compAddressReporting', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Address Reporting Required</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.compExtensionEligible}
                          onChange={(e) => handleCheckboxChange('compExtensionEligible', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Extension Eligible</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Extension Type</label>
                      <input type="text" value={formData.compExtensionType} onChange={(e) => setFormData({ ...formData, compExtensionType: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Extension Type" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Renewal Window</label>
                      <input type="text" value={formData.compRenewalWindow} onChange={(e) => setFormData({ ...formData, compRenewalWindow: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Renewal Window" />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.compCheckinsRequired}
                          onChange={(e) => handleCheckboxChange('compCheckinsRequired', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Compliance Check-ins Required</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Last Compliance Review Date</label>
                      <input type="date" value={formData.compLastReviewDate} onChange={(e) => setFormData({ ...formData, compLastReviewDate: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Issues Noted</label>
                      <textarea value={formData.compIssuesNoted} onChange={(e) => setFormData({ ...formData, compIssuesNoted: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Describe any compliance issues..."></textarea>
                    </div>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.compPswInterest}
                          onChange={(e) => handleCheckboxChange('compPswInterest', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">PSW / Work Visa Interest</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.compEligibilityAwareness}
                          onChange={(e) => handleCheckboxChange('compEligibilityAwareness', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Eligibility Awareness</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Compliance Notes</label>
                      <textarea value={formData.compNotes} onChange={(e) => setFormData({ ...formData, compNotes: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="General compliance notes..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pre-departure-support' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Pre-Departure Support */}
                <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Plane size={16} className="text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0f172b]">Pre-Departure Support</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Planned Travel Date</label>
                      <input type="date" value={formData.predepTravelDate} onChange={(e) => setFormData({ ...formData, predepTravelDate: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" />
                    </div>
                    <div className="flex items-center mt-7">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.predepFlightBooked}
                          onChange={(e) => handleCheckboxChange('predepFlightBooked', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Flight Booked</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Airline Name</label>
                      <input type="text" value={formData.predepAirlineName} onChange={(e) => setFormData({ ...formData, predepAirlineName: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Airline Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Departure Airport</label>
                      <input type="text" value={formData.predepDepartureAirport} onChange={(e) => setFormData({ ...formData, predepDepartureAirport: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Departure Airport" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Arrival Airport</label>
                      <input type="text" value={formData.predepArrivalAirport} onChange={(e) => setFormData({ ...formData, predepArrivalAirport: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Arrival Airport" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Accommodation Type</label>
                      <CustomSelect value={formData.predepAccommodationType} onChange={(value) => setFormData({ ...formData, predepAccommodationType: value })} options={[{ value: 'university-halls', label: 'University Halls' }, { value: 'private-apartment', label: 'Private Apartment' }, { value: 'homestay', label: 'Homestay' }, { value: 'temporary-hotel', label: 'Temporary Hotel' }]} placeholder="Select accommodation type" />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.predepAccommodationConfirmed}
                          onChange={(e) => handleCheckboxChange('predepAccommodationConfirmed', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">Accommodation Confirmed</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Address Available</label>
                      <textarea value={formData.predepAddress} onChange={(e) => setFormData({ ...formData, predepAddress: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Full address in target country..."></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Initial Stay Duration</label>
                        <input type="text" value={formData.predepInitialStayDuration} onChange={(e) => setFormData({ ...formData, predepInitialStayDuration: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. 1 Year" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Emergency Contact Shared</label>
                        <input type="text" value={formData.predepEmergencyContact} onChange={(e) => setFormData({ ...formData, predepEmergencyContact: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Emergency contact name/phone" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { id: 'predepInsuranceArranged', label: 'Travel Insurance Arranged' },
                      { id: 'predepForexReady', label: 'Forex / Int. Card Ready' },
                      { id: 'predepDocsCollected', label: 'Important Docs Collected' },
                      { id: 'predepOrientationAttended', label: 'Orientation Session Attended' },
                      { id: 'predepRulesExplained', label: 'Country Rules Explained' },
                      { id: 'predepReportingInstructionsShared', label: 'Uni Reporting Instructions' },
                      { id: 'predepPackingGuidanceShared', label: 'Packing Guidance Shared' },
                      { id: 'predepRestrictedItemsExplained', label: 'Restricted Items Explained' },
                      { id: 'predepWeatherAwareness', label: 'Weather Awareness' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={(formData as any)[item.id]}
                          onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-[#0f172b] transition-colors">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-8">
                    <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Pre-Departure Notes</label>
                    <textarea value={formData.predepNotes} onChange={(e) => setFormData({ ...formData, predepNotes: e.target.value })} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 resize-none text-base" placeholder="Any additional notes or pending tasks..."></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'basic-info' && activeTab !== 'add-application' && activeTab !== 'planning-and-application' && activeTab !== 'offer-review' && activeTab !== 'visa-compliance' && activeTab !== 'pre-departure-support' && (
              <div className="bg-white rounded-2xl sm:rounded-[20px] p-8 sm:p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={32} className="text-purple-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f172b] mb-2">Save Student Profile First</h2>
                <p className="text-[#62748e] max-w-md mx-auto">
                  Please save the basic profile and applications before proceeding further.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Sidebar (1/3 width) */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* RIGHT SECTION 1: Assignment & Status */}
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
                    <button onClick={() => setAccountStatus(!accountStatus)} className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${accountStatus ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${accountStatus ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                    <div>
                      <p className="text-sm font-medium text-[#0f172b]">{accountStatus ? 'Active' : 'Inactive'}</p>
                      <p className="text-xs text-[#62748e]">Student can access their portal</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Assigned Counselor</label>
                  <CustomSelect value={formData.assignedCounselor} onChange={(value) => setFormData({ ...formData, assignedCounselor: value })} options={[{ value: 'sarah-johnson', label: 'Sarah Johnson' }, { value: 'mike-davis', label: 'Mike Davis' }, { value: 'emma-wilson', label: 'Emma Wilson' }, { value: 'john-smith', label: 'John Smith' }]} placeholder="Select counselor" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Risk Level</label>
                  <CustomSelect value={formData.riskLevel} onChange={(value) => setFormData({ ...formData, riskLevel: value })} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} />
                  <p className="text-xs text-[#62748e] mt-1.5">Default: Low</p>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION 2: Education Snapshot */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] p-5 sm:p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={14} className="text-indigo-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f172b]">Education Snapshot</h2>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Highest Qualification</label>
                  <CustomSelect value={formData.highestQualification} onChange={(value) => setFormData({ ...formData, highestQualification: value })} options={[{ value: 'high-school', label: 'High School' }, { value: 'bachelors', label: 'Bachelors Degree' }, { value: 'masters', label: 'Masters Degree' }, { value: 'diploma', label: 'Diploma' }]} placeholder="Select highest qualification" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Field of Study</label>
                  <input type="text" value={formData.fieldOfStudy} onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Current Institution</label>
                  <input type="text" value={formData.currentInstitution} onChange={(e) => setFormData({ ...formData, currentInstitution: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="Enter institution name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">Graduation Year</label>
                  <input type="text" value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="YYYY" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0f172b] mb-1.5">GPA / Percentage</label>
                  <input type="text" value={formData.gpa} onChange={(e) => setFormData({ ...formData, gpa: e.target.value })} className="w-full h-[44px] px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-base" placeholder="e.g. 3.8 or 85%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};