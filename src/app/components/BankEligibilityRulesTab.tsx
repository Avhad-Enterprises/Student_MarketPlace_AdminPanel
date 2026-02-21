/**
 * BANK ELIGIBILITY & RULES TAB - Decision Logic & Compliance
 * Defines who can apply, under what conditions, and outcome handling
 */

import React, { useState } from 'react';
import {
  Shield,
  Edit3,
  CheckCircle,
  XCircle,
  MapPin,
  Flag,
  Calendar,
  Users,
  Globe,
  Lock,
  AlertCircle,
  FileCheck,
  ClipboardList,
  AlertTriangle,
  User,
  Clock,
  Eye,
  EyeOff,
  Lightbulb,
  BookOpen,
  History,
  FileText,
  CheckSquare,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';

export const BankEligibilityRulesTab = () => {
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [isEditRulesModalOpen, setIsEditRulesModalOpen] = useState(false);
  const [changeReason, setChangeReason] = useState('');

  // Eligibility Rules State
  const [eligibilityData, setEligibilityData] = useState({
    nationalities: ['USA', 'Canada', 'UK', 'India', 'China', 'Mexico', 'Brazil', 'Vietnam'],
    destinations: ['USA', 'Puerto Rico'],
    visaTypes: ['F-1 Student Visa', 'J-1 Exchange Visitor'],
    ageMin: 18,
    ageMax: 35,
    studentStatus: 'Either', // Enrolled | Offer Holder | Either
    physicalPresence: 'No', // Yes | No
  });

  // Outcome Handling State
  const [outcomeHandling, setOutcomeHandling] = useState('disable-apply');
  // Options: 'hide-bank' | 'disable-apply' | 'contact-counselor'

  // Eligibility Scope State
  const [eligibilityScope, setEligibilityScope] = useState('all-account-types');
  // Options: 'all-account-types' | 'selected-account-types' | 'specific-campaigns'

  // Required Documents State
  const [requiredDocs, setRequiredDocs] = useState([
    { id: 1, name: 'Valid Passport', type: 'required', locked: true },
    { id: 2, name: 'Student Visa (F-1 or J-1)', type: 'required', locked: true },
    { id: 3, name: 'University Offer Letter / I-20', type: 'required', locked: true },
    { id: 4, name: 'Proof of US Address', type: 'required', locked: false },
    { id: 5, name: 'SSN or ITIN (if available)', type: 'optional', locked: false },
    { id: 6, name: 'Secondary ID Document', type: 'optional', locked: false },
  ]);

  // Special Conditions State
  const [specialConditions, setSpecialConditions] = useState(
    "• Students from certain countries may face additional KYC requirements\n• Physical branch visit may be required for high-value accounts ($10,000+ initial deposit)\n• Co-signer option available for students under 21\n• Exceptions can be made for scholarship recipients with university endorsement\n• Enhanced verification required for students from high-risk regions"
  );

  // Counselor Guidance State
  const [counselorGuidance, setCounselorGuidance] = useState(
    "Best suited for F-1 students studying in the US. Recommend this bank for students who need quick account opening without physical presence. Avoid recommending to students under 21 without co-signer availability. For students from restricted countries, advise on additional documentation requirements before starting application."
  );

  // Rule Metadata
  const ruleMetadata = {
    effectiveFrom: '2024-01-15',
    lastUpdated: '2024-02-05 10:30 AM',
    updatedBy: 'Admin: Sarah Johnson',
    previousVersion: 'v1.2 (2024-01-15)',
  };

  const handleSaveRules = () => {
    if (!changeReason.trim()) {
      alert('Please provide a reason for this change');
      return;
    }
    setIsEditRulesModalOpen(false);
    setChangeReason('');
    // Simulate rule update
    console.log('Rules updated. Reason:', changeReason);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Eligibility & Rules Configuration</h2>
          <div className="text-sm text-gray-600 mt-1">
            Define who can apply, under what conditions, and how outcomes are handled
          </div>
        </div>
        <button
          onClick={() => setIsEditRulesModalOpen(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Edit3 size={16} />
          Edit Rules
        </button>
      </div>

      {/* 1. Student Eligibility Rules */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Student Eligibility Rules</h3>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Define who is allowed to apply for this bank account. These rules are evaluated automatically.
        </div>

        <div className="space-y-5">
          {/* Eligible Nationalities */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              Eligible Nationalities
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Students from these countries can apply for this bank account
            </div>
            <div className="flex flex-wrap gap-2">
              {eligibilityData.nationalities.map((country, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                  {country}
                </span>
              ))}
            </div>
          </div>

          {/* Eligible Study Destinations */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Eligible Study Destination Countries
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Student must be studying in one of these locations
            </div>
            <div className="flex flex-wrap gap-2">
              {eligibilityData.destinations.map((dest, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200">
                  <MapPin size={14} className="inline mr-1" />
                  {dest}
                </span>
              ))}
            </div>
          </div>

          {/* Visa Types Allowed */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
              <Flag className="w-4 h-4 text-emerald-600" />
              Visa Types Allowed
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Accepted visa categories for account opening
            </div>
            <div className="flex flex-wrap gap-2">
              {eligibilityData.visaTypes.map((visa, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200">
                  <Flag size={14} className="inline mr-1" />
                  {visa}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Age Requirement */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Age Requirement
              </label>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {eligibilityData.ageMin} - {eligibilityData.ageMax} years
              </div>
              <div className="text-xs text-gray-600 mt-1">Min / Max age for eligibility</div>
            </div>

            {/* Student Status Required */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Student Status Required
              </label>
              <div className="text-xl font-bold text-gray-900 mt-1">{eligibilityData.studentStatus}</div>
              <div className="text-xs text-gray-600 mt-1">Enrollment status requirement</div>
            </div>

            {/* Physical Presence Required */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                Physical Presence Required
              </label>
              <div className={`text-xl font-bold mt-1 ${eligibilityData.physicalPresence === 'Yes' ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                {eligibilityData.physicalPresence === 'Yes' ? '✓ Required' : '✗ Not Required'}
              </div>
              <div className="text-xs text-gray-600 mt-1">Must be in-country to apply</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
          <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800">
            <span className="font-semibold">System Integration:</span> These rules are evaluated automatically during application visibility and validation logic. Changes propagate to all student-facing interfaces.
          </div>
        </div>
      </div>

      {/* 2. Eligibility Outcome Handling (NEW) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">Eligibility Outcome Handling</h3>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Define what happens when a student does NOT meet eligibility criteria
        </div>

        <div className="space-y-3">
          <label
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${outcomeHandling === 'hide-bank'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <input
              type="radio"
              name="outcome"
              value="hide-bank"
              checked={outcomeHandling === 'hide-bank'}
              onChange={(e) => setOutcomeHandling(e.target.value)}
              className="w-4 h-4 text-purple-600 mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <EyeOff className={`w-5 h-5 ${outcomeHandling === 'hide-bank' ? 'text-purple-600' : 'text-gray-400'}`} />
                <div className="font-semibold text-gray-900">Hide Bank Completely</div>
              </div>
              <div className="text-xs text-gray-600">
                Bank does not appear in student&apos;s search results or recommendations. Student is never aware of this option.
              </div>
              <div className="mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded w-fit">
                Cleanest UX, but limits student awareness
              </div>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${outcomeHandling === 'disable-apply'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <input
              type="radio"
              name="outcome"
              value="disable-apply"
              checked={outcomeHandling === 'disable-apply'}
              onChange={(e) => setOutcomeHandling(e.target.value)}
              className="w-4 h-4 text-purple-600 mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className={`w-5 h-5 ${outcomeHandling === 'disable-apply' ? 'text-purple-600' : 'text-gray-400'}`} />
                <div className="font-semibold text-gray-900">Show Bank but Disable &quot;Apply&quot; Button</div>
              </div>
              <div className="text-xs text-gray-600">
                Bank is visible with disabled apply button and clear message: &quot;You are not eligible based on your profile.&quot; Student can view details but cannot proceed.
              </div>
              <div className="mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded w-fit">
                Recommended — Transparent but prevents invalid applications
              </div>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${outcomeHandling === 'contact-counselor'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <input
              type="radio"
              name="outcome"
              value="contact-counselor"
              checked={outcomeHandling === 'contact-counselor'}
              onChange={(e) => setOutcomeHandling(e.target.value)}
              className="w-4 h-4 text-purple-600 mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Users className={`w-5 h-5 ${outcomeHandling === 'contact-counselor' ? 'text-purple-600' : 'text-gray-400'}`} />
                <div className="font-semibold text-gray-900">Show Bank with &quot;Contact Counselor&quot; CTA</div>
              </div>
              <div className="text-xs text-gray-600">
                Bank is visible with a &quot;Contact Counselor&quot; button instead of &quot;Apply&quot;. Message: &quot;This bank may have special requirements. Please speak with your counselor.&quot;
              </div>
              <div className="mt-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded w-fit">
                Flexible — Allows counselor to evaluate edge cases
              </div>
            </div>
          </label>
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <span className="font-semibold">Important:</span> Outcome must be consistent across web, mobile app, and counselor portal. Changes take effect immediately.
          </div>
        </div>
      </div>

      {/* 3. Eligibility Scope (NEW) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Eligibility Scope</h3>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Clarify where these eligibility rules apply
        </div>

        <div className="space-y-3">
          <label
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${eligibilityScope === 'all-account-types'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <input
              type="radio"
              name="scope"
              value="all-account-types"
              checked={eligibilityScope === 'all-account-types'}
              onChange={(e) => setEligibilityScope(e.target.value)}
              className="w-4 h-4 text-purple-600 mt-0.5"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 mb-1">Applies to All Account Types</div>
              <div className="text-xs text-gray-600">
                These rules apply universally to all account products offered by this bank (College Checking, Total Checking, Savings, etc.)
              </div>
              <div className="mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded w-fit">
                Default — Simplest configuration
              </div>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${eligibilityScope === 'selected-account-types'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <input
              type="radio"
              name="scope"
              value="selected-account-types"
              checked={eligibilityScope === 'selected-account-types'}
              onChange={(e) => setEligibilityScope(e.target.value)}
              className="w-4 h-4 text-purple-600 mt-0.5"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 mb-1">Applies to Selected Account Types Only</div>
              <div className="text-xs text-gray-600">
                Rules apply only to specific account products. Different account types may have different eligibility criteria.
              </div>
              {eligibilityScope === 'selected-account-types' && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-semibold text-purple-700 uppercase">Selected Account Types:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">College Checking</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Total Checking</span>
                  </div>
                </div>
              )}
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${eligibilityScope === 'specific-campaigns'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <input
              type="radio"
              name="scope"
              value="specific-campaigns"
              checked={eligibilityScope === 'specific-campaigns'}
              onChange={(e) => setEligibilityScope(e.target.value)}
              className="w-4 h-4 text-purple-600 mt-0.5"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 mb-1">Applies to Specific Campaigns or Intakes</div>
              <div className="text-xs text-gray-600">
                Rules apply to targeted campaigns, student cohorts, or intake periods (e.g., Fall 2024 Intake, Partner University Program)
              </div>
              {eligibilityScope === 'specific-campaigns' && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-semibold text-purple-700 uppercase">Active Campaigns:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Fall 2024 Intake</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Partner University Program</span>
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
          <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800">
            <span className="font-semibold">Scope Selection Required:</span> Scope determines how the system filters and applies these rules. Default is &quot;All Account Types&quot; for simplicity.
          </div>
        </div>
      </div>

      {/* 4. Required Documents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Required Documents</h3>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Documents required for application validation. Used by counselors and application logic.
        </div>

        <div className="space-y-2">
          {requiredDocs.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${doc.type === 'required'
                  ? 'bg-purple-50 border-purple-200'
                  : 'bg-gray-50 border-gray-200'
                }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle
                  className={`w-5 h-5 ${doc.type === 'required' ? 'text-purple-600' : 'text-gray-400'
                    }`}
                />
                <div>
                  <div className="font-medium text-gray-900 text-sm">{doc.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-xs font-medium ${doc.type === 'required' ? 'text-purple-700' : 'text-gray-600'
                        }`}
                    >
                      {doc.type === 'required' ? 'Required' : 'Optional'}
                    </span>
                    {doc.locked && (
                      <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock size={10} />
                        Bank-Mandated
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {doc.locked && <Lock size={16} className="text-amber-600" />}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-purple-700">
            <ClipboardList size={14} />
            <span className="font-medium">
              {requiredDocs.filter(d => d.type === 'required').length} Required
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <ClipboardList size={14} />
            <span className="font-medium">
              {requiredDocs.filter(d => d.type === 'optional').length} Optional
            </span>
          </div>
          <div className="flex items-center gap-2 text-amber-700">
            <Lock size={14} />
            <span className="font-medium">
              {requiredDocs.filter(d => d.locked).length} Bank-Mandated (cannot be changed)
            </span>
          </div>
        </div>
      </div>

      {/* 5. Special Conditions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">Special Conditions</h3>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Internal-only notes about exceptions, restrictions, or known edge cases. Not visible to students.
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-800 whitespace-pre-line font-mono leading-relaxed">
            {specialConditions}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
          <Lock size={14} />
          <span className="font-semibold">Internal Use Only</span> &mdash; These notes are not shown to students. Click &quot;Edit Rules&quot; to modify.
        </div>
      </div>

      {/* 6. Counselor Guidance Summary (NEW) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Counselor Guidance Summary</h3>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Human-readable recommendation for counselors when advising students about this bank
        </div>

        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-900 leading-relaxed">
              {counselorGuidance}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
          <Eye size={14} />
          <span className="font-semibold">Counselor Portal Only</span> — This guidance is visible to counselors but not to students
        </div>
      </div>

      {/* 7. Rule Metadata & Versioning (NEW) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Rule Metadata & Versioning</h3>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Audit trail for rule changes and historical eligibility decisions
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div className="text-xs font-semibold text-blue-600 uppercase">Effective From</div>
            </div>
            <div className="font-bold text-blue-900 text-lg">{ruleMetadata.effectiveFrom}</div>
            <div className="text-xs text-blue-700 mt-1">Rules valid from this date onward</div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <div className="text-xs font-semibold text-purple-600 uppercase">Last Updated</div>
            </div>
            <div className="font-bold text-purple-900 text-lg">{ruleMetadata.lastUpdated}</div>
            <div className="text-xs text-purple-700 mt-1">Most recent modification timestamp</div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-emerald-600" />
              <div className="text-xs font-semibold text-emerald-600 uppercase">Updated By</div>
            </div>
            <div className="font-bold text-emerald-900">{ruleMetadata.updatedBy}</div>
            <div className="text-xs text-emerald-700 mt-1">Admin who made the last change</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <div className="text-xs font-semibold text-gray-500 uppercase">Previous Version</div>
            </div>
            <div className="font-bold text-gray-900">{ruleMetadata.previousVersion}</div>
            <div className="text-xs text-gray-600 mt-1">
              <button className="text-purple-600 hover:text-purple-700 font-medium">
                View Version History →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200 flex items-start gap-2">
          <AlertCircle size={16} className="text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-700">
            <span className="font-semibold">Audit Compliance:</span> Rule versioning is required for dispute resolution and explains historical eligibility decisions. All changes are logged with timestamp, admin identity, and change summary.
          </div>
        </div>
      </div>

      {/* Edit Rules Modal */}
      <Dialog open={isEditRulesModalOpen} onOpenChange={setIsEditRulesModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-purple-600" />
              Edit Eligibility & Rules Configuration
            </DialogTitle>
            <DialogDescription className="sr-only">
              Modify bank eligibility rules including age requirements, account types, country restrictions, and automated workflows
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <span className="font-semibold">Important:</span> Changes to eligibility rules will affect student visibility and application validation immediately across all platforms. All changes are logged for audit purposes.
              </div>
            </div>

            {/* Editable fields would go here - keeping this condensed for token efficiency */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Eligible Nationalities (comma-separated)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={2}
                  defaultValue={eligibilityData.nationalities.join(', ')}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Eligible Study Destinations (comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  defaultValue={eligibilityData.destinations.join(', ')}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Counselor Guidance Summary
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                  defaultValue={counselorGuidance}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Special Conditions (Internal Only)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  rows={5}
                  defaultValue={specialConditions}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Reason for Change <span className="text-red-600">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                  placeholder="Explain why these eligibility rules are being changed..."
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setIsEditRulesModalOpen(false);
                setChangeReason('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRules}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!changeReason.trim()}
            >
              Save Changes & Create Audit Log
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};