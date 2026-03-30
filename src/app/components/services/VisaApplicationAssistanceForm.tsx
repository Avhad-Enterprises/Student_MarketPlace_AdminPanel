import React from 'react';
import { DateInput } from '../ui/date-input';
import { CustomSelect } from '../common/CustomSelect';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Globe, GraduationCap, Banknote, FileCheck, Calendar, MessageSquare, Info } from 'lucide-react';

interface VisaApplicationAssistanceFormProps {
  data: any;
  onChange: (data: any) => void;
}

export function VisaApplicationAssistanceForm({ data, onChange }: VisaApplicationAssistanceFormProps) {
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
      {/* A. Visa Profile Basics */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Globe} title="Visa Profile Basics" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Country</Label>
            <CustomSelect
              value={data.targetCountry || ''}
              onChange={(value) => updateField('targetCountry', value)}
              options={[
                { value: "United Kingdom", label: "United Kingdom" },
                { value: "USA", label: "USA" },
                { value: "Canada", label: "Canada" },
                { value: "Australia", label: "Australia" },
                { value: "Germany", label: "Germany" },
                { value: "France", label: "France" },
                { value: "Ireland", label: "Ireland" }
              ]}
              placeholder="Select target country"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visa Type</Label>
            <CustomSelect
              value={data.visaType || ''}
              onChange={(value) => updateField('visaType', value)}
              options={[
                { value: "student-tier-4", label: "Student Visa (Tier 4) - UK" },
                { value: "f1-visa", label: "F-1 Student Visa - USA" },
                { value: "study-permit", label: "Study Permit - Canada" },
                { value: "student-subclass-500", label: "Student Visa (Subclass 500) - Australia" },
                { value: "student-visa-eu", label: "Student Visa - EU" },
                { value: "other", label: "Other" }
              ]}
              placeholder="Select visa type"
            />
          </div>

          <div className="space-y-2">
            <DateInput
              label="Intake / Start Date"
              value={data.intakeStartDate || ''}
              onValueChange={(value) => updateField('intakeStartDate', value)}
            />
          </div>
        </div>
      </section>

      {/* B. University & Offer Reference */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={GraduationCap} title="University & Offer Reference" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">University Name</Label>
            <Input
              value={data.universityName || ''}
              onChange={(e) => updateField('universityName', e.target.value)}
              placeholder="Enter university name"
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Offer Letter Status</Label>
            <CustomSelect
              value={data.offerLetterUploaded || ''}
              onChange={(value) => updateField('offerLetterUploaded', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "pending", label: "Pending" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CAS / I-20 / COE Status</Label>
            <CustomSelect
              value={data.casStatus || ''}
              onChange={(value) => updateField('casStatus', value)}
              options={[
                { value: "issued", label: "Issued" },
                { value: "requested", label: "Requested" },
                { value: "not-requested", label: "Not Requested" },
                { value: "pending-documents", label: "Pending Documents" }
              ]}
              placeholder="Select status"
            />
          </div>
        </div>
      </section>

      {/* C. Financial Documentation */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Banknote} title="Financial Documentation" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Proof of Funds Available</Label>
            <CustomSelect
              value={data.proofOfFunds || ''}
              onChange={(value) => updateField('proofOfFunds', value)}
              options={[
                { value: "yes-complete", label: "Yes - Complete" },
                { value: "partial", label: "Partial" },
                { value: "in-progress", label: "In Progress" },
                { value: "not-available", label: "Not Available" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Funds Source</Label>
            <CustomSelect
              value={data.fundsSource || ''}
              onChange={(value) => updateField('fundsSource', value)}
              options={[
                { value: "self", label: "Self" },
                { value: "sponsor", label: "Sponsor" },
                { value: "loan", label: "Loan" },
                { value: "combination", label: "Combination" }
              ]}
              placeholder="Select source"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loan Status</Label>
            <CustomSelect
              value={data.loanStatus || ''}
              onChange={(value) => updateField('loanStatus', value)}
              options={[
                { value: "approved", label: "Approved" },
                { value: "in-progress", label: "In Progress" },
                { value: "not-applied", label: "Not Applied" },
                { value: "rejected", label: "Rejected" },
                { value: "not-applicable", label: "Not Applicable" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bank Statement Duration</Label>
            <CustomSelect
              value={data.bankStatementDuration || ''}
              onChange={(value) => updateField('bankStatementDuration', value)}
              options={[
                { value: "sufficient", label: "Sufficient (Meets requirement)" },
                { value: "3-months", label: "3 Months" },
                { value: "6-months", label: "6 Months" },
                { value: "insufficient", label: "Insufficient" }
              ]}
              placeholder="Select duration"
            />
          </div>
        </div>
      </section>

      {/* D. Tracking & Appointments */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Calendar} title="Application & Appointment Tracking" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Application Form Filled</Label>
            <CustomSelect
              value={data.applicationFormFilled || ''}
              onChange={(value) => updateField('applicationFormFilled', value)}
              options={[
                { value: "completed", label: "Completed" },
                { value: "in-progress", label: "In Progress" },
                { value: "not-started", label: "Not Started" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Appointment Status</Label>
            <CustomSelect
              value={data.appointmentBooked || ''}
              onChange={(value) => updateField('appointmentBooked', value)}
              options={[
                { value: "yes", label: "Booked" },
                { value: "no", label: "Not Booked" },
                { value: "pending", label: "Pending" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <DateInput
              label="Appointment Date"
              value={data.appointmentDate || ''}
              onValueChange={(value) => updateField('appointmentDate', value)}
            />
          </div>
        </div>
      </section>

      {/* E. Notes & Remarks */}
      <section className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100/50 space-y-6">
        <SectionHeader icon={MessageSquare} title="Notes & Remarks" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-purple-700 uppercase tracking-wider">Special Case Notes</Label>
            <Textarea
              value={data.specialCaseNotes || ''}
              onChange={(e) => updateField('specialCaseNotes', e.target.value)}
              rows={3}
              placeholder="Country- or profile-specific notes..."
              className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Internal Remarks</Label>
            <Textarea
              value={data.internalRemarks || ''}
              onChange={(e) => updateField('internalRemarks', e.target.value)}
              rows={3}
              placeholder="Anything the visa team should know..."
              className="bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
