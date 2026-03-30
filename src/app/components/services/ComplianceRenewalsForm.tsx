import React from 'react';
import { DateInput } from '../ui/date-input';
import { CustomSelect } from '../common/CustomSelect';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ShieldCheck, ClipboardCheck, CalendarClock, Activity, MessageSquare } from 'lucide-react';

interface ComplianceRenewalsFormProps {
  data: any;
  onChange: (data: any) => void;
}

export function ComplianceRenewalsForm({ data, onChange }: ComplianceRenewalsFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
      <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
        <Icon size={18} />
      </div>
      <h3 className="text-lg font-bold text-[#253154] tracking-tight">{title}</h3>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* A. Visa Validity Tracking */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={ShieldCheck} title="Visa Validity Tracking" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <DateInput
              label="Visa Start Date"
              value={data.visaStartDate || ''}
              onValueChange={(value) => updateField('visaStartDate', value)}
            />
          </div>

          <div className="space-y-2">
            <DateInput
              label="Visa Expiry Date"
              value={data.visaExpiryDate || ''}
              onValueChange={(value) => updateField('visaExpiryDate', value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Multiple Entry Allowed</Label>
            <CustomSelect
              value={data.multipleEntryAllowed || ''}
              onChange={(value) => updateField('multipleEntryAllowed', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "not-sure", label: "Not Sure" }
              ]}
              placeholder="Select status"
            />
          </div>
        </div>
      </section>

      {/* B. Compliance Requirements */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={ClipboardCheck} title="Compliance Requirements" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Work Hour Restrictions</Label>
            <CustomSelect
              value={data.workHourRestrictions || ''}
              onChange={(value) => updateField('workHourRestrictions', value)}
              options={[
                { value: "yes-20-hours", label: "Yes - 20 Hours/Week" },
                { value: "yes-custom", label: "Yes - Custom Limit" },
                { value: "no", label: "No Restrictions" },
                { value: "not-allowed", label: "Work Not Allowed" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance Requirements</Label>
            <CustomSelect
              value={data.attendanceRequirements || ''}
              onChange={(value) => updateField('attendanceRequirements', value)}
              options={[
                { value: "yes-mandatory", label: "Yes - Mandatory" },
                { value: "yes-minimum", label: "Yes - Minimum Threshold" },
                { value: "no", label: "No Requirements" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address Reporting Required</Label>
            <CustomSelect
              value={data.addressReporting || ''}
              onChange={(value) => updateField('addressReporting', value)}
              options={[
                { value: "yes", label: "Yes - Mandatory" },
                { value: "no", label: "No" },
                { value: "only-change", label: "Only When Changed" }
              ]}
              placeholder="Select status"
            />
          </div>
        </div>
      </section>

      {/* C. Extension / Renewal Planning */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={CalendarClock} title="Extension & Renewal Planning" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Extension Eligible</Label>
            <CustomSelect
              value={data.extensionEligible || ''}
              onChange={(value) => updateField('extensionEligible', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "conditional", label: "Conditional" },
                { value: "not-sure", label: "Not Sure" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Extension Type</Label>
            <CustomSelect
              value={data.extensionType || ''}
              onChange={(value) => updateField('extensionType', value)}
              options={[
                { value: "study", label: "Study Extension" },
                { value: "work", label: "Work Visa" },
                { value: "dependent", label: "Dependent Visa" },
                { value: "other", label: "Other" },
                { value: "not-applicable", label: "Not Applicable" }
              ]}
              placeholder="Select type"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Renewal Window</Label>
            <Input
              value={data.renewalWindow || ''}
              onChange={(e) => updateField('renewalWindow', e.target.value)}
              placeholder="e.g., 3 months before expiry"
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>
        </div>
      </section>

      {/* D. Monitoring & Reviews */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Activity} title="Monitoring & Reviews" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Check-ins Required</Label>
            <CustomSelect
              value={data.complianceCheckIns || ''}
              onChange={(value) => updateField('complianceCheckIns', value)}
              options={[
                { value: "yes-monthly", label: "Yes - Monthly" },
                { value: "yes-quarterly", label: "Yes - Quarterly" },
                { value: "yes-biannual", label: "Yes - Bi-Annual" },
                { value: "no", label: "No" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <DateInput
              label="Last Review Date"
              value={data.lastReviewDate || ''}
              onValueChange={(value) => updateField('lastReviewDate', value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Issues Noted</Label>
            <Textarea
              value={data.issuesNoted || ''}
              onChange={(e) => updateField('issuesNoted', e.target.value)}
              rows={3}
              placeholder="Record any compliance concerns or noted issues..."
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>
        </div>
      </section>

      {/* E. Transition & Notes */}
      <section className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100/50 space-y-6">
        <SectionHeader icon={MessageSquare} title="Transition & Notes" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-purple-700 uppercase tracking-wider">PSW Interest</Label>
            <CustomSelect
              value={data.pswInterest || ''}
              onChange={(value) => updateField('pswInterest', value)}
              options={[
                { value: "yes-high", label: "Yes - High Interest" },
                { value: "yes-maybe", label: "Yes - Maybe" },
                { value: "no", label: "No" },
                { value: "not-sure", label: "Not Sure" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-purple-700 uppercase tracking-wider">Eligibility Awareness</Label>
            <CustomSelect
              value={data.eligibilityAwareness || ''}
              onChange={(value) => updateField('eligibilityAwareness', value)}
              options={[
                { value: "yes-fully-aware", label: "Yes - Fully Aware" },
                { value: "partial", label: "Partial Understanding" },
                { value: "no", label: "No" },
                { value: "needs-counselling", label: "Needs Counselling" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">General Compliance Notes</Label>
            <Textarea
              value={data.complianceNotes || ''}
              onChange={(e) => updateField('complianceNotes', e.target.value)}
              rows={4}
              placeholder="Important reminders, risks, or post-study transition plans..."
              className="bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
