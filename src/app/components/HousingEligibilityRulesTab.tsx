/**
 * HOUSING ELIGIBILITY & RULES TAB - COMPLETE IMPLEMENTATION
 * 
 * Full admin-grade eligibility configuration system with:
 * - Student type requirements
 * - Visa & residency rules
 * - Financial eligibility
 * - Booking rules & policies
 * - Rule behavior configuration
 * - Complete audit logging
 */

import React, { useState } from 'react';
import {
  Shield,
  Users,
  FileText,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Edit3,
  Save,
  X,
  Info,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import type { ActivityLogEntry } from './HousingProviderDetail';

// Type definition
export interface EligibilityRule {
  studentType: {
    internationalAllowed: boolean;
    domesticAllowed: boolean;
    minAge: number;
    studentStatusRequired: string;
  };
  visaResidency: {
    allowedVisaTypes: string[];
    idVerificationRequired: boolean;
    passportRequired: boolean;
  };
  financialEligibility: {
    proofOfFundsRequired: boolean;
    minimumIncomeThreshold?: number;
    guarantorRequired: boolean;
    creditScoreRequired: boolean;
    alternativeAllowed: boolean;
  };
  bookingRules: {
    minStayMonths: number;
    maxStayMonths: number | null;
    cancellationPolicy: 'Flexible' | 'Moderate' | 'Strict' | 'Custom';
    refundPolicyText: string;
    checkInWindowRules: string;
  };
  ruleBehavior: 'Hard Block' | 'Soft Warning' | 'Manual Review';
  lastUpdatedBy?: string;
  lastUpdatedDate?: string;
}

interface EligibilityRulesTabProps {
  providerId: string;
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

export const HousingEligibilityRulesTabEnhanced: React.FC<EligibilityRulesTabProps> = ({
  providerId,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';

  // State
  const [rules, setRules] = useState<EligibilityRule>({
    studentType: {
      internationalAllowed: true,
      domesticAllowed: true,
      minAge: 18,
      studentStatusRequired: 'Enrolled',
    },
    visaResidency: {
      allowedVisaTypes: ['F-1', 'J-1', 'Tier 4', 'Student Visa'],
      idVerificationRequired: true,
      passportRequired: true,
    },
    financialEligibility: {
      proofOfFundsRequired: true,
      minimumIncomeThreshold: 2500,
      guarantorRequired: false,
      creditScoreRequired: false,
      alternativeAllowed: true,
    },
    bookingRules: {
      minStayMonths: 3,
      maxStayMonths: 24,
      cancellationPolicy: 'Moderate',
      refundPolicyText: 'Full refund if cancelled 30+ days before move-in. 50% refund if 15-29 days. No refund if less than 14 days.',
      checkInWindowRules: 'Check-in available Mon-Fri 9am-5pm. Weekend check-ins require advance notice.',
    },
    ruleBehavior: 'Soft Warning',
    lastUpdatedBy: 'System',
    lastUpdatedDate: '2024-02-01',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [tempRules, setTempRules] = useState<EligibilityRule | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [visaInput, setVisaInput] = useState('');

  const handleEdit = () => {
    setTempRules({ ...rules });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!tempRules) return;

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedRules = {
        ...tempRules,
        lastUpdatedBy: 'Current Admin',
        lastUpdatedDate: new Date().toISOString().split('T')[0],
      };

      setRules(updatedRules);

      addActivityLog({
        admin: 'Current Admin',
        action: 'Updated',
        entity: 'Eligibility Rules',
        summary: 'Updated housing eligibility requirements',
      });

      toast.success('Eligibility rules updated successfully');
      setShowEditModal(false);
      setTempRules(null);
    } catch (error) {
      toast.error('Failed to update eligibility rules');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (!confirm('Are you sure you want to reset all rules to default?')) return;

    const defaultRules: EligibilityRule = {
      studentType: {
        internationalAllowed: true,
        domesticAllowed: true,
        minAge: 18,
        studentStatusRequired: 'Any',
      },
      visaResidency: {
        allowedVisaTypes: [],
        idVerificationRequired: false,
        passportRequired: false,
      },
      financialEligibility: {
        proofOfFundsRequired: false,
        minimumIncomeThreshold: undefined,
        guarantorRequired: false,
        creditScoreRequired: false,
        alternativeAllowed: true,
      },
      bookingRules: {
        minStayMonths: 1,
        maxStayMonths: null,
        cancellationPolicy: 'Flexible',
        refundPolicyText: '',
        checkInWindowRules: '',
      },
      ruleBehavior: 'Soft Warning',
      lastUpdatedBy: 'Current Admin',
      lastUpdatedDate: new Date().toISOString().split('T')[0],
    };

    setRules(defaultRules);

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Eligibility Rules',
      summary: 'Reset eligibility rules to default',
    });

    toast.success('Rules reset to default');
  };

  const addVisaType = () => {
    if (!visaInput.trim()) return;
    if (!tempRules) return;

    if (tempRules.visaResidency.allowedVisaTypes.includes(visaInput.trim())) {
      toast.error('Visa type already added');
      return;
    }

    setTempRules({
      ...tempRules,
      visaResidency: {
        ...tempRules.visaResidency,
        allowedVisaTypes: [...tempRules.visaResidency.allowedVisaTypes, visaInput.trim()],
      },
    });
    setVisaInput('');
  };

  const removeVisaType = (visa: string) => {
    if (!tempRules) return;

    setTempRules({
      ...tempRules,
      visaResidency: {
        ...tempRules.visaResidency,
        allowedVisaTypes: tempRules.visaResidency.allowedVisaTypes.filter(v => v !== visa),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Eligibility & Rules</h2>
            <p className="text-sm text-gray-600">Configure student eligibility requirements and booking policies</p>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleResetToDefault}>
              Reset to Default
            </Button>
            <Button size="sm" onClick={handleEdit} className="flex items-center gap-2">
              <Edit3 size={16} />
              Edit Rules
            </Button>
          </div>
        )}
      </div>

      {/* Rule Behavior Indicator */}
      <div className={`p-4 rounded-xl border-2 ${
        rules.ruleBehavior === 'Hard Block' ? 'bg-red-50 border-red-300' :
        rules.ruleBehavior === 'Soft Warning' ? 'bg-amber-50 border-amber-300' :
        'bg-blue-50 border-blue-300'
      }`}>
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className={
            rules.ruleBehavior === 'Hard Block' ? 'text-red-600' :
            rules.ruleBehavior === 'Soft Warning' ? 'text-amber-600' :
            'text-blue-600'
          } />
          <div className="flex-1">
            <div className="font-semibold text-gray-900 mb-1">
              Rule Behavior: {rules.ruleBehavior}
            </div>
            <div className="text-sm text-gray-700">
              {rules.ruleBehavior === 'Hard Block' && 'Students who don\'t meet requirements will be blocked from proceeding.'}
              {rules.ruleBehavior === 'Soft Warning' && 'Students will see a warning but can still submit applications.'}
              {rules.ruleBehavior === 'Manual Review' && 'Applications will be sent for manual admin review.'}
            </div>
          </div>
        </div>
      </div>

      {/* Student Type Requirements */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Student Type Requirements</h3>
            <p className="text-sm text-gray-500">Who can apply for housing</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">International Students Allowed</div>
                <div className="text-xs text-gray-600 mt-1">Students from outside the host country</div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                rules.studentType.internationalAllowed ? 'bg-emerald-100' : 'bg-gray-100'
              }`}>
                {rules.studentType.internationalAllowed ? (
                  <>
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Allowed</span>
                  </>
                ) : (
                  <>
                    <X size={16} className="text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Not Allowed</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Domestic Students Allowed</div>
                <div className="text-xs text-gray-600 mt-1">Students from the host country</div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                rules.studentType.domesticAllowed ? 'bg-emerald-100' : 'bg-gray-100'
              }`}>
                {rules.studentType.domesticAllowed ? (
                  <>
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Allowed</span>
                  </>
                ) : (
                  <>
                    <X size={16} className="text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Not Allowed</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-2">Minimum Age Required</div>
              <div className="text-3xl font-bold text-gray-900">{rules.studentType.minAge} years</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-2">Student Status Required</div>
              <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {rules.studentType.studentStatusRequired}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visa & Residency */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <FileText size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Visa & Residency Requirements</h3>
            <p className="text-sm text-gray-500">Documentation and verification requirements</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-3">Allowed Visa Types</div>
            {rules.visaResidency.allowedVisaTypes.length === 0 ? (
              <p className="text-sm text-gray-600">No specific visa restrictions</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {rules.visaResidency.allowedVisaTypes.map(visa => (
                  <span key={visa} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {visa}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">ID Verification Required</div>
                <div className="text-xs text-gray-600 mt-1">Must verify government-issued ID</div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                rules.visaResidency.idVerificationRequired ? 'bg-emerald-100' : 'bg-gray-100'
              }`}>
                {rules.visaResidency.idVerificationRequired ? (
                  <>
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Required</span>
                  </>
                ) : (
                  <>
                    <X size={16} className="text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Not Required</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900">Passport Required</div>
                <div className="text-xs text-gray-600 mt-1">Must provide valid passport</div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                rules.visaResidency.passportRequired ? 'bg-emerald-100' : 'bg-gray-100'
              }`}>
                {rules.visaResidency.passportRequired ? (
                  <>
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Required</span>
                  </>
                ) : (
                  <>
                    <X size={16} className="text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Not Required</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Eligibility */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <DollarSign size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Financial Eligibility</h3>
            <p className="text-sm text-gray-500">Financial requirements and verification</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-900">Proof of Funds Required</div>
              <div className="text-xs text-gray-600 mt-1">Must demonstrate financial capacity</div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              rules.financialEligibility.proofOfFundsRequired ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              {rules.financialEligibility.proofOfFundsRequired ? (
                <>
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">Required</span>
                </>
              ) : (
                <>
                  <X size={16} className="text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Not Required</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-2">Minimum Monthly Income</div>
            {rules.financialEligibility.minimumIncomeThreshold ? (
              <div className="text-2xl font-bold text-emerald-600">
                ${rules.financialEligibility.minimumIncomeThreshold}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No minimum set</div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-900">Guarantor Required</div>
              <div className="text-xs text-gray-600 mt-1">Co-signer or sponsor needed</div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              rules.financialEligibility.guarantorRequired ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              {rules.financialEligibility.guarantorRequired ? (
                <>
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">Required</span>
                </>
              ) : (
                <>
                  <X size={16} className="text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Not Required</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-900">Credit Score Required</div>
              <div className="text-xs text-gray-600 mt-1">Must have credit history</div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              rules.financialEligibility.creditScoreRequired ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              {rules.financialEligibility.creditScoreRequired ? (
                <>
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">Required</span>
                </>
              ) : (
                <>
                  <X size={16} className="text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Not Required</span>
                </>
              )}
            </div>
          </div>

          {rules.financialEligibility.creditScoreRequired && (
            <div className="col-span-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 text-sm">Alternative Options Available</div>
                  <div className="text-xs text-blue-700 mt-1">
                    {rules.financialEligibility.alternativeAllowed 
                      ? 'Students without credit score can provide alternative documentation'
                      : 'No alternative options - credit score is mandatory'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Rules */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <Calendar size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Booking Rules & Policies</h3>
            <p className="text-sm text-gray-500">Stay duration and cancellation policies</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-2">Minimum Stay Duration</div>
              <div className="text-3xl font-bold text-gray-900">{rules.bookingRules.minStayMonths} <span className="text-lg">months</span></div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-2">Maximum Stay Duration</div>
              <div className="text-3xl font-bold text-gray-900">
                {rules.bookingRules.maxStayMonths ? (
                  <>{rules.bookingRules.maxStayMonths} <span className="text-lg">months</span></>
                ) : (
                  <span className="text-lg text-gray-600">No limit</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-2">Cancellation Policy</div>
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${
              rules.bookingRules.cancellationPolicy === 'Flexible' ? 'bg-emerald-100 text-emerald-700' :
              rules.bookingRules.cancellationPolicy === 'Moderate' ? 'bg-amber-100 text-amber-700' :
              rules.bookingRules.cancellationPolicy === 'Strict' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {rules.bookingRules.cancellationPolicy}
            </span>
            {rules.bookingRules.refundPolicyText && (
              <div className="mt-3 text-sm text-gray-700 leading-relaxed">
                {rules.bookingRules.refundPolicyText}
              </div>
            )}
          </div>

          {rules.bookingRules.checkInWindowRules && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-900 mb-2">Check-In Window Rules</div>
              <div className="text-sm text-blue-800">{rules.bookingRules.checkInWindowRules}</div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      {rules.lastUpdatedBy && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Last updated by <span className="font-semibold text-gray-900">{rules.lastUpdatedBy}</span>
            </span>
            <span className="text-gray-500">{rules.lastUpdatedDate}</span>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Eligibility Rules</DialogTitle>
            <DialogDescription>Configure comprehensive eligibility requirements and booking policies</DialogDescription>
          </DialogHeader>

          {tempRules && (
            <div className="space-y-6 py-4">
              {/* Rule Behavior */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Rule Behavior</h4>
                <Select 
                  value={tempRules.ruleBehavior} 
                  onValueChange={(val: any) => setTempRules({ ...tempRules, ruleBehavior: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hard Block">Hard Block - Students cannot proceed</SelectItem>
                    <SelectItem value="Soft Warning">Soft Warning - Show warning but allow</SelectItem>
                    <SelectItem value="Manual Review">Manual Review - Admin approval required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student Type */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Student Type Requirements</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Switch
                        checked={tempRules.studentType.internationalAllowed}
                        onCheckedChange={(val) => setTempRules({
                          ...tempRules,
                          studentType: { ...tempRules.studentType, internationalAllowed: val },
                        })}
                      />
                      <span className="text-sm font-semibold text-gray-700">Allow International Students</span>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Switch
                        checked={tempRules.studentType.domesticAllowed}
                        onCheckedChange={(val) => setTempRules({
                          ...tempRules,
                          studentType: { ...tempRules.studentType, domesticAllowed: val },
                        })}
                      />
                      <span className="text-sm font-semibold text-gray-700">Allow Domestic Students</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Age</label>
                      <Input
                        type="number"
                        value={tempRules.studentType.minAge}
                        onChange={(e) => setTempRules({
                          ...tempRules,
                          studentType: { ...tempRules.studentType, minAge: parseInt(e.target.value) },
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Student Status Required</label>
                      <Select 
                        value={tempRules.studentType.studentStatusRequired}
                        onValueChange={(val) => setTempRules({
                          ...tempRules,
                          studentType: { ...tempRules.studentType, studentStatusRequired: val },
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Any">Any</SelectItem>
                          <SelectItem value="Enrolled">Enrolled</SelectItem>
                          <SelectItem value="Offer Received">Offer Received</SelectItem>
                          <SelectItem value="Conditional Offer">Conditional Offer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visa & Residency */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Visa & Residency</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Allowed Visa Types</label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={visaInput}
                        onChange={(e) => setVisaInput(e.target.value)}
                        placeholder="e.g., F-1, J-1, Tier 4"
                        onKeyPress={(e) => e.key === 'Enter' && addVisaType()}
                      />
                      <Button type="button" onClick={addVisaType}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tempRules.visaResidency.allowedVisaTypes.map(visa => (
                        <span key={visa} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          {visa}
                          <button onClick={() => removeVisaType(visa)} className="hover:text-purple-900">
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Switch
                        checked={tempRules.visaResidency.idVerificationRequired}
                        onCheckedChange={(val) => setTempRules({
                          ...tempRules,
                          visaResidency: { ...tempRules.visaResidency, idVerificationRequired: val },
                        })}
                      />
                      <span className="text-sm font-semibold text-gray-700">ID Verification Required</span>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Switch
                        checked={tempRules.visaResidency.passportRequired}
                        onCheckedChange={(val) => setTempRules({
                          ...tempRules,
                          visaResidency: { ...tempRules.visaResidency, passportRequired: val },
                        })}
                      />
                      <span className="text-sm font-semibold text-gray-700">Passport Required</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Eligibility */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Financial Eligibility</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Switch
                        checked={tempRules.financialEligibility.proofOfFundsRequired}
                        onCheckedChange={(val) => setTempRules({
                          ...tempRules,
                          financialEligibility: { ...tempRules.financialEligibility, proofOfFundsRequired: val },
                        })}
                      />
                      <span className="text-sm font-semibold text-gray-700">Proof of Funds Required</span>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Min Income (Optional)</label>
                      <Input
                        type="number"
                        value={tempRules.financialEligibility.minimumIncomeThreshold || ''}
                        onChange={(e) => setTempRules({
                          ...tempRules,
                          financialEligibility: { 
                            ...tempRules.financialEligibility, 
                            minimumIncomeThreshold: e.target.value ? parseInt(e.target.value) : undefined 
                          },
                        })}
                        placeholder="No minimum"
                      />
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Switch
                        checked={tempRules.financialEligibility.guarantorRequired}
                        onCheckedChange={(val) => setTempRules({
                          ...tempRules,
                          financialEligibility: { ...tempRules.financialEligibility, guarantorRequired: val },
                        })}
                      />
                      <span className="text-sm font-semibold text-gray-700">Guarantor Required</span>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Switch
                        checked={tempRules.financialEligibility.creditScoreRequired}
                        onCheckedChange={(val) => setTempRules({
                          ...tempRules,
                          financialEligibility: { ...tempRules.financialEligibility, creditScoreRequired: val },
                        })}
                      />
                      <span className="text-sm font-semibold text-gray-700">Credit Score Required</span>
                    </div>

                    {tempRules.financialEligibility.creditScoreRequired && (
                      <div className="col-span-2 flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Switch
                          checked={tempRules.financialEligibility.alternativeAllowed}
                          onCheckedChange={(val) => setTempRules({
                            ...tempRules,
                            financialEligibility: { ...tempRules.financialEligibility, alternativeAllowed: val },
                          })}
                        />
                        <span className="text-sm font-semibold text-blue-900">Allow Alternative Documentation (No Credit Score)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Rules */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Booking Rules</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Min Stay (Months)</label>
                      <Input
                        type="number"
                        value={tempRules.bookingRules.minStayMonths}
                        onChange={(e) => setTempRules({
                          ...tempRules,
                          bookingRules: { ...tempRules.bookingRules, minStayMonths: parseInt(e.target.value) },
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Max Stay (Months, Optional)</label>
                      <Input
                        type="number"
                        value={tempRules.bookingRules.maxStayMonths || ''}
                        onChange={(e) => setTempRules({
                          ...tempRules,
                          bookingRules: { 
                            ...tempRules.bookingRules, 
                            maxStayMonths: e.target.value ? parseInt(e.target.value) : null 
                          },
                        })}
                        placeholder="No limit"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cancellation Policy</label>
                      <Select 
                        value={tempRules.bookingRules.cancellationPolicy}
                        onValueChange={(val: any) => setTempRules({
                          ...tempRules,
                          bookingRules: { ...tempRules.bookingRules, cancellationPolicy: val },
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Flexible">Flexible</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Strict">Strict</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Refund Policy Text</label>
                      <textarea
                        value={tempRules.bookingRules.refundPolicyText}
                        onChange={(e) => setTempRules({
                          ...tempRules,
                          bookingRules: { ...tempRules.bookingRules, refundPolicyText: e.target.value },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                        placeholder="Describe refund conditions..."
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Check-In Window Rules</label>
                      <Input
                        value={tempRules.bookingRules.checkInWindowRules}
                        onChange={(e) => setTempRules({
                          ...tempRules,
                          bookingRules: { ...tempRules.bookingRules, checkInWindowRules: e.target.value },
                        })}
                        placeholder="e.g., Mon-Fri 9am-5pm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Rules'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
