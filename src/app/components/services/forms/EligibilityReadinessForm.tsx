import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { CustomSelect } from '../../common/CustomSelect';
import { ClipboardCheck, Languages, Banknote, ShieldAlert, FileText } from 'lucide-react';

interface EligibilityReadinessFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const EligibilityReadinessForm: React.FC<EligibilityReadinessFormProps> = ({
  data,
  onChange,
}) => {
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
      {/* A. Academic Readiness */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={ClipboardCheck} title="Academic Readiness" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Meets Course Prerequisites</Label>
            <CustomSelect
              value={data.meetsPrerequisites || ''}
              onChange={(value) => updateField('meetsPrerequisites', value)}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "Partially", label: "Partially" }
              ]}
              placeholder="Select option"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bridge Course Required</Label>
            <CustomSelect
              value={data.bridgeCourse || ''}
              onChange={(value) => updateField('bridgeCourse', value)}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "Maybe", label: "Maybe" }
              ]}
              placeholder="Select option"
            />
          </div>
        </div>
      </section>

      {/* B. Language Proficiency */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Languages} title="Language Proficiency" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">English Test Required</Label>
            <CustomSelect
              value={data.englishTestRequired || ''}
              onChange={(value) => updateField('englishTestRequired', value)}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" }
              ]}
              placeholder="Select option"
            />
          </div>

          {data.englishTestRequired === 'Yes' && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Test Type</Label>
                <CustomSelect
                  value={data.testType || ''}
                  onChange={(value) => updateField('testType', value)}
                  options={[
                    { value: "IELTS", label: "IELTS" },
                    { value: "TOEFL", label: "TOEFL" },
                    { value: "PTE", label: "PTE" },
                    { value: "Duolingo", label: "Duolingo" }
                  ]}
                  placeholder="Select test type"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Test Status</Label>
                <CustomSelect
                  value={data.testStatus || ''}
                  onChange={(value) => updateField('testStatus', value)}
                  options={[
                    { value: "Not Started", label: "Not Started" },
                    { value: "Preparing", label: "Preparing" },
                    { value: "Booked", label: "Booked" },
                    { value: "Completed", label: "Completed" }
                  ]}
                  placeholder="Select test status"
                />
              </div>

              {data.testStatus === 'Completed' && (
                <div className="space-y-2 md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                  <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score Available</Label>
                  <CustomSelect
                    value={data.scoreAvailable || ''}
                    onChange={(value) => updateField('scoreAvailable', value)}
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" }
                    ]}
                    placeholder="Select option"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* C. Financial Readiness */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Banknote} title="Financial Readiness" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Proof of Funds Ready</Label>
            <CustomSelect
              value={data.proofOfFunds || ''}
              onChange={(value) => updateField('proofOfFunds', value)}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "In Progress", label: "In Progress" }
              ]}
              placeholder="Select option"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sponsor Identified</Label>
            <CustomSelect
              value={data.sponsorIdentified || ''}
              onChange={(value) => updateField('sponsorIdentified', value)}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "Not Applicable", label: "Not Applicable" }
              ]}
              placeholder="Select option"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loan Required</Label>
            <CustomSelect
              value={data.loanRequired || ''}
              onChange={(value) => updateField('loanRequired', value)}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "Maybe", label: "Maybe" }
              ]}
              placeholder="Select option"
            />
          </div>
        </div>
      </section>

      {/* D. Visa Risk & Compliance */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={ShieldAlert} title="Visa Risk & Compliance" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gap Explanation Required for Visa</Label>
            <CustomSelect
              value={data.gapExplanationVisa || ''}
              onChange={(value) => updateField('gapExplanationVisa', value)}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
                { value: "Not Applicable", label: "Not Applicable" }
              ]}
              placeholder="Select option"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Country-specific Visa Risk Details</Label>
            <Textarea
              rows={3}
              placeholder="Describe any visa-related concerns or specific country risks..."
              value={data.visaRisk || ''}
              onChange={(e) => updateField('visaRisk', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>
        </div>
      </section>

      {/* E. Additional Notes */}
      <section className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100/50 space-y-6">
        <SectionHeader icon={FileText} title="Additional Notes" />
        <div className="space-y-2">
          <Label className="text-xs font-bold text-purple-700 uppercase tracking-wider">General Visa & Readiness Notes</Label>
          <Textarea
            rows={4}
            placeholder="Add any other important readiness or eligibility considerations..."
            value={data.visaNotes || ''}
            onChange={(e) => updateField('visaNotes', e.target.value)}
            className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200"
          />
        </div>
      </section>
    </div>
  );
};
