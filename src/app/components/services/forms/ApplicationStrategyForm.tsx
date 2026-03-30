import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { CustomSelect } from '../../common/CustomSelect';
import { Target, FileText, Users, Lightbulb } from 'lucide-react';

interface ApplicationStrategyFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const ApplicationStrategyForm: React.FC<ApplicationStrategyFormProps> = ({
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
      {/* A. Submission Strategy */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Target} title="Submission Strategy" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Application Type</Label>
            <CustomSelect
              value={data.applicationType || ''}
              onChange={(value) => updateField('applicationType', value)}
              options={[
                { value: "Early Decision", label: "Early Decision" },
                { value: "Early Action", label: "Early Action" },
                { value: "Regular", label: "Regular" },
                { value: "Rolling", label: "Rolling" },
                { value: "Late", label: "Late" }
              ]}
              placeholder="Select application type"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deadline Risk Level</Label>
            <CustomSelect
              value={data.deadlineRisk || ''}
              onChange={(value) => updateField('deadlineRisk', value)}
              options={[
                { value: "Low", label: "Low - Ample Time" },
                { value: "Medium", label: "Medium - Some Pressure" },
                { value: "High", label: "High - Tight Deadline" },
                { value: "Critical", label: "Critical - Immediate Action Needed" }
              ]}
              placeholder="Select risk level"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deadline Awareness</Label>
            <CustomSelect
              value={data.deadlineAwareness || ''}
              onChange={(value) => updateField('deadlineAwareness', value)}
              options={[
                { value: "Yes", label: "Yes - Fully Aware" },
                { value: "Partial", label: "Partial - Some Awareness" },
                { value: "No", label: "No - Needs Information" }
              ]}
              placeholder="Select awareness level"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Application Submission Order</Label>
            <Textarea
              rows={3}
              placeholder="List universities in order of application submission..."
              value={data.applicationOrder || ''}
              onChange={(e) => updateField('applicationOrder', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>
        </div>
      </section>

      {/* B. Content Approach */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={FileText} title="Content & Customization" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">SOP Approach</Label>
            <CustomSelect
              value={data.sopApproach || ''}
              onChange={(value) => updateField('sopApproach', value)}
              options={[
                { value: "Single Generic", label: "Single Generic SOP" },
                { value: "Lightly Customized", label: "Lightly Customized" },
                { value: "Fully Customized", label: "Fully Customized per University" }
              ]}
              placeholder="Select SOP approach"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customization Level</Label>
            <CustomSelect
              value={data.customizationLevel || ''}
              onChange={(value) => updateField('customizationLevel', value)}
              options={[
                { value: "Low", label: "Low - Minimal Changes" },
                { value: "Medium", label: "Medium - Moderate Changes" },
                { value: "High", label: "High - Extensive Customization" }
              ]}
              placeholder="Select customization level"
            />
          </div>
        </div>
      </section>

      {/* C. LOR Strategy */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Users} title="LOR Strategy" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">LOR Type</Label>
            <CustomSelect
              value={data.lorType || ''}
              onChange={(value) => updateField('lorType', value)}
              options={[
                { value: "Academic Only", label: "Academic Only" },
                { value: "Professional Only", label: "Professional Only" },
                { value: "Mixed", label: "Mixed (Academic + Professional)" }
              ]}
              placeholder="Select LOR type"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Number of LORs Required</Label>
            <Input
              type="number"
              placeholder="e.g., 2 or 3"
              value={data.lorCount || ''}
              onChange={(e) => updateField('lorCount', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>
        </div>
      </section>

      {/* D. Additional Notes */}
      <section className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100/50 space-y-6">
        <SectionHeader icon={Lightbulb} title="Strategic Considerations" />
        <div className="space-y-2">
          <Label className="text-xs font-bold text-purple-700 uppercase tracking-wider">Strategy Notes</Label>
          <Textarea
            rows={5}
            placeholder="Add any special considerations or strategic notes for the application process..."
            value={data.strategyNotes || ''}
            onChange={(e) => updateField('strategyNotes', e.target.value)}
            className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200"
          />
        </div>
      </section>
    </div>
  );
};
