/**
 * VISA ELIGIBILITY & RULES TAB
 * Services & Marketplace → Visa → Visa Detail → Eligibility & Rules
 * 
 * Enterprise-grade eligibility rule management matching Insurance/Banks pattern
 * Read-only view with comprehensive edit modal and audit logging
 */

import React from 'react';
import {
  Flag,
  Globe,
  FileCheck,
  Users,
  Briefcase,
  Clock,
  AlertTriangle,
  XCircle,
  AlertCircle,
  CheckCircle,
  Edit3,
  X,
  Info,
  BookOpen,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

// ============================================
// TYPES & INTERFACES
// ============================================

interface VisaEligibilityRules {
  nationalities: {
    type: 'all' | 'selected' | 'excluded';
    countries: string[];
  };
  destinationCountries: {
    countries: string[];
  };
  visaSubCategories: string[];
  ageRange: {
    min: number;
    max: number;
    requiresApprovalOutside: boolean;
  };
  studentStatus: {
    enrolled: boolean;
    offerLetter: boolean;
  };
  languageRequirement: {
    required: boolean;
    tests: string[];
    minimumScore: string;
  };
  financialProof: {
    required: boolean;
    minimumAmount: string;
    currency: string;
  };
  gapYearRules: {
    allowed: boolean;
    maxGapYears: number;
    requiresJustification: boolean;
  };
  physicalPresence: {
    required: boolean;
    note: string;
  };
  waitingPeriod: {
    days: number;
    note: string;
  };
  audit: {
    lastUpdated: string;
    updatedBy: string;
    reason: string;
  };
}

// ============================================
// MOCK DATA
// ============================================

const mockRules: VisaEligibilityRules = {
  nationalities: {
    type: 'all',
    countries: [],
  },
  destinationCountries: {
    countries: ['United States'],
  },
  visaSubCategories: ['F-1 (Academic)', 'F-1 (Language Training)', 'F-1 (Vocational)'],
  ageRange: {
    min: 16,
    max: 99,
    requiresApprovalOutside: false,
  },
  studentStatus: {
    enrolled: false,
    offerLetter: true,
  },
  languageRequirement: {
    required: true,
    tests: ['TOEFL', 'IELTS', 'Duolingo English Test', 'PTE Academic'],
    minimumScore: 'Varies by institution',
  },
  financialProof: {
    required: true,
    minimumAmount: '25,000',
    currency: 'USD',
  },
  gapYearRules: {
    allowed: true,
    maxGapYears: 2,
    requiresJustification: true,
  },
  physicalPresence: {
    required: false,
    note: 'Can apply from home country',
  },
  waitingPeriod: {
    days: 0,
    note: 'Can enter US up to 30 days before program start',
  },
  audit: {
    lastUpdated: 'Jan 28, 2026 2:15 PM',
    updatedBy: 'Admin Michael Chen',
    reason: 'Updated language test requirements to include Duolingo',
  },
};

// ============================================
// MAIN TAB COMPONENT
// ============================================

export const VisaEligibilityRulesTab: React.FC = () => {
  const [rules, setRules] = React.useState<VisaEligibilityRules>(mockRules);
  const [showEditModal, setShowEditModal] = React.useState(false);

  const handleSaveRules = (updatedRules: VisaEligibilityRules, reason: string) => {
    setRules({
      ...updatedRules,
      audit: {
        lastUpdated: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        updatedBy: 'Admin Michael Chen',
        reason,
      },
    });
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Eligibility & Decision Rules</h2>
          <p className="text-sm text-gray-600 mt-1">
            Defines who can apply for this visa and under what conditions
          </p>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Edit Rules
        </button>
      </div>

      {/* SECTION 1: Eligible Nationalities */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Eligible Nationalities</h3>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Defines which student nationalities can apply for this visa
        </p>
        
        {rules.nationalities.type === 'all' ? (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-blue-900 font-semibold">All International Students</div>
              <div className="text-xs text-blue-800 mt-1">
                No nationality restrictions apply. Students from any country can apply for this visa.
              </div>
            </div>
          </div>
        ) : rules.nationalities.type === 'selected' ? (
          <div>
            <div className="text-xs text-gray-600 mb-2">Allowed nationalities only:</div>
            <div className="flex flex-wrap gap-2">
              {rules.nationalities.countries.slice(0, 15).map((country, idx) => (
                <div key={idx} className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-900">
                  {country}
                </div>
              ))}
              {rules.nationalities.countries.length > 15 && (
                <div className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600">
                  + {rules.nationalities.countries.length - 15} more
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs text-gray-600 mb-2">All countries except:</div>
            <div className="flex flex-wrap gap-2">
              {rules.nationalities.countries.map((country, idx) => (
                <div key={idx} className="px-3 py-2 bg-red-50 rounded-lg border border-red-200 text-sm font-semibold text-red-900">
                  {country}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Eligible Destination Countries */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-gray-900">Eligible Destination Countries</h3>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Countries where this visa allows the student to study
        </p>
        <div className="flex flex-wrap gap-2">
          {rules.destinationCountries.countries.map((country, idx) => (
            <div key={idx} className="px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200 text-sm font-semibold text-emerald-900">
              {country}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Visa Sub-Categories */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Visa Types / Sub-Categories</h3>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Different sub-categories available under this visa type
        </p>
        <div className="flex flex-wrap gap-2">
          {rules.visaSubCategories.map((category, idx) => (
            <div key={idx} className="px-3 py-2 bg-purple-50 rounded-lg border border-purple-200 text-sm font-semibold text-purple-900">
              {category}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 & 5: Age Range + Student Status (2-column grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Range */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-gray-900">Age Range</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Defines age eligibility boundaries
          </p>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-900">
              {rules.ageRange.min} – {rules.ageRange.max} years
            </div>
            {rules.ageRange.requiresApprovalOutside && (
              <div className="text-xs text-amber-800 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Students outside this range require special approval
              </div>
            )}
            {!rules.ageRange.requiresApprovalOutside && (
              <div className="text-xs text-amber-800 mt-2">
                No age restrictions for this visa category
              </div>
            )}
          </div>
        </div>

        {/* Student Status Required */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Student Status Required</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Clarifies enrollment requirements
          </p>
          <div className="space-y-2">
            {rules.studentStatus.enrolled && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-900">Enrolled Students</span>
              </div>
            )}
            {rules.studentStatus.offerLetter && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Offer Letter Holders</span>
              </div>
            )}
            {!rules.studentStatus.enrolled && !rules.studentStatus.offerLetter && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
                No student status requirements configured
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 6 & 7: Language Requirement + Financial Proof */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Requirement */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Language Requirement</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            English proficiency test requirements
          </p>
          {rules.languageRequirement.required ? (
            <div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                <div className="text-sm font-semibold text-blue-900 mb-1">Required</div>
                <div className="text-xs text-blue-800">
                  Minimum Score: {rules.languageRequirement.minimumScore}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {rules.languageRequirement.tests.map((test, idx) => (
                  <div key={idx} className="px-2 py-1 bg-blue-100 text-blue-900 rounded text-xs font-semibold">
                    {test}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
              No language test required
            </div>
          )}
        </div>

        {/* Financial Proof */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900">Financial Proof Required</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Proof of funds requirement
          </p>
          {rules.financialProof.required ? (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-sm font-semibold text-emerald-900 mb-1">Required</div>
              <div className="text-2xl font-bold text-emerald-900">
                {rules.financialProof.currency} {rules.financialProof.minimumAmount}+
              </div>
              <div className="text-xs text-emerald-800 mt-1">
                Minimum funds to demonstrate financial capability
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
              No financial proof requirement
            </div>
          )}
        </div>
      </div>

      {/* SECTION 8: Gap Year Rules */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Gap Year Rules</h3>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Policy on educational gaps between studies
        </p>
        {rules.gapYearRules.allowed ? (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm font-semibold text-purple-900 mb-2">
              Gap years allowed: Up to {rules.gapYearRules.maxGapYears} years
            </div>
            {rules.gapYearRules.requiresJustification && (
              <div className="text-xs text-purple-800 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Justification required for gaps exceeding 1 year
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-sm font-semibold text-red-900">Gap years not recommended</div>
            <div className="text-xs text-red-800 mt-1">
              May negatively impact visa approval chances
            </div>
          </div>
        )}
      </div>

      {/* SECTION 9 & 10: Physical Presence + Waiting Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Physical Presence Required */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Physical Presence Required</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Where applicant must be when applying
          </p>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-semibold text-blue-900">
              {rules.physicalPresence.required ? 'Yes' : 'No'}
            </div>
            <div className="text-xs text-blue-800 mt-1">
              {rules.physicalPresence.note}
            </div>
          </div>
        </div>

        {/* Waiting Period */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900">Entry Waiting Period</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            When student can enter destination country
          </p>
          <div className={`p-4 rounded-lg border ${
            rules.waitingPeriod.days === 0 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className={`font-semibold ${
              rules.waitingPeriod.days === 0 ? 'text-emerald-900' : 'text-amber-900'
            }`}>
              {rules.waitingPeriod.days === 0 ? 'No Waiting Period' : `${rules.waitingPeriod.days} Days`}
            </div>
            <div className={`text-xs mt-1 ${
              rules.waitingPeriod.days === 0 ? 'text-emerald-800' : 'text-amber-800'
            }`}>
              {rules.waitingPeriod.note}
            </div>
          </div>
        </div>
      </div>

      {/* AUDIT NOTICE */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm mb-2">Governance & Audit Trail</h4>
            <p className="text-xs text-gray-700 mb-3">
              All eligibility rule changes are logged for compliance and accountability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 border border-purple-100">
                <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                <div className="text-sm font-semibold text-gray-900">{rules.audit.lastUpdated}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-100">
                <div className="text-xs text-gray-500 mb-1">Updated By</div>
                <div className="text-sm font-semibold text-gray-900">{rules.audit.updatedBy}</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-100">
                <div className="text-xs text-gray-500 mb-1">Reason</div>
                <div className="text-sm font-semibold text-gray-900">{rules.audit.reason}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditRulesModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentRules={rules}
        onSave={handleSaveRules}
      />
    </div>
  );
};

// ============================================
// EDIT RULES MODAL
// ============================================

interface EditRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRules: VisaEligibilityRules;
  onSave: (rules: VisaEligibilityRules, reason: string) => void;
}

const EditRulesModal: React.FC<EditRulesModalProps> = ({
  isOpen,
  onClose,
  currentRules,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<VisaEligibilityRules>(currentRules);
  const [reason, setReason] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setFormData(currentRules);
      setReason('');
    }
  }, [isOpen, currentRules]);

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for changing the eligibility rules');
      return;
    }

    onSave(formData, reason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1400px] h-[90vh] flex flex-col p-0 gap-0">
        <DialogDescription className="sr-only">
          Edit visa eligibility rules including nationalities, destinations, language requirements, financial proof, and gap year policies
        </DialogDescription>

        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900 mb-1">
                Edit Eligibility Rules
              </DialogTitle>
              <p className="text-sm text-gray-600">
                Update rules that determine who can apply for this visa
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Nationality Rules */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Eligible Nationalities</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="nationalityType"
                    value="all"
                    checked={formData.nationalities.type === 'all'}
                    onChange={() => setFormData({
                      ...formData,
                      nationalities: { ...formData.nationalities, type: 'all' }
                    })}
                    className="mt-1 w-4 h-4 text-purple-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">All Countries (Recommended)</div>
                    <div className="text-sm text-gray-600 mt-1">No nationality restrictions apply</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="nationalityType"
                    value="selected"
                    checked={formData.nationalities.type === 'selected'}
                    onChange={() => setFormData({
                      ...formData,
                      nationalities: { ...formData.nationalities, type: 'selected' }
                    })}
                    className="mt-1 w-4 h-4 text-purple-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Selected Countries Only</div>
                    <div className="text-sm text-gray-600 mt-1">Restrict to specific nationalities</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Age Range */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Age Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Minimum Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.ageRange.min}
                    onChange={(e) => setFormData({
                      ...formData,
                      ageRange: { ...formData.ageRange, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Maximum Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.ageRange.max}
                    onChange={(e) => setFormData({
                      ...formData,
                      ageRange: { ...formData.ageRange, max: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="99"
                  />
                </div>
              </div>
            </div>

            {/* Student Status */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Student Status Required</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.studentStatus.enrolled}
                    onChange={(e) => setFormData({
                      ...formData,
                      studentStatus: { ...formData.studentStatus, enrolled: e.target.checked }
                    })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-semibold text-gray-900">Enrolled Students</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.studentStatus.offerLetter}
                    onChange={(e) => setFormData({
                      ...formData,
                      studentStatus: { ...formData.studentStatus, offerLetter: e.target.checked }
                    })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-semibold text-gray-900">Offer Letter Holders</span>
                </label>
              </div>
            </div>

            {/* Language Requirement */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Language Requirement</h3>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={formData.languageRequirement.required}
                  onChange={(e) => setFormData({
                    ...formData,
                    languageRequirement: { ...formData.languageRequirement, required: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-semibold text-gray-900">Language proficiency test required</span>
              </label>
              {formData.languageRequirement.required && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Minimum Score Requirement
                  </label>
                  <input
                    type="text"
                    value={formData.languageRequirement.minimumScore}
                    onChange={(e) => setFormData({
                      ...formData,
                      languageRequirement: { ...formData.languageRequirement, minimumScore: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., TOEFL 80+, IELTS 6.5+"
                  />
                </div>
              )}
            </div>

            {/* Financial Proof */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Financial Proof</h3>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={formData.financialProof.required}
                  onChange={(e) => setFormData({
                    ...formData,
                    financialProof: { ...formData.financialProof, required: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-semibold text-gray-900">Financial proof required</span>
              </label>
              {formData.financialProof.required && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Minimum Amount
                    </label>
                    <input
                      type="text"
                      value={formData.financialProof.minimumAmount}
                      onChange={(e) => setFormData({
                        ...formData,
                        financialProof: { ...formData.financialProof, minimumAmount: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="25,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={formData.financialProof.currency}
                      onChange={(e) => setFormData({
                        ...formData,
                        financialProof: { ...formData.financialProof, currency: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="USD"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gap Year Rules */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Gap Year Rules</h3>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={formData.gapYearRules.allowed}
                  onChange={(e) => setFormData({
                    ...formData,
                    gapYearRules: { ...formData.gapYearRules, allowed: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-semibold text-gray-900">Gap years allowed</span>
              </label>
              {formData.gapYearRules.allowed && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Maximum Gap Years
                  </label>
                  <input
                    type="number"
                    value={formData.gapYearRules.maxGapYears}
                    onChange={(e) => setFormData({
                      ...formData,
                      gapYearRules: { ...formData.gapYearRules, maxGapYears: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="2"
                  />
                </div>
              )}
            </div>

            {/* Reason for Change */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Audit & Compliance</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Reason for Change <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Explain why you're updating these eligibility rules..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be logged in the audit trail for compliance purposes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-gray-200 shrink-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
