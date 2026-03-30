import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { CustomSelect } from '../../common/CustomSelect';
import { FileEdit, UserCheck, BarChart3, MessageSquare, History } from 'lucide-react';

interface SOPReviewEditingFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const SOPReviewEditingForm: React.FC<SOPReviewEditingFormProps> = ({
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
      {/* A. Version control */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={History} title="Version Control" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current SOP Version</Label>
            <Input
              placeholder="e.g., Version 1.0, Draft 3"
              value={data.sopVersion || ''}
              onChange={(e) => updateField('sopVersion', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Draft Status</Label>
            <CustomSelect
              value={data.draftStatus || ''}
              onChange={(value) => updateField('draftStatus', value)}
              options={[
                { value: "Initial Draft", label: "Initial Draft" },
                { value: "Under Review", label: "Under Review" },
                { value: "Revised", label: "Revised" },
                { value: "Near Final", label: "Near Final" },
                { value: "Final", label: "Final" }
              ]}
              placeholder="Select draft status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Editor</Label>
            <div className="relative">
              <Input
                placeholder="e.g., Sarah Johnson"
                value={data.assignedEditor || ''}
                onChange={(e) => updateField('assignedEditor', e.target.value)}
                className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all pl-9"
              />
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="space-y-2 transition-all">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revision Count</Label>
            <Input
              type="number"
              placeholder="e.g., 1, 2, 3"
              value={data.revisionCount || ''}
              onChange={(e) => updateField('revisionCount', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all font-medium"
            />
          </div>
        </div>
      </section>

      {/* B. Quality Assessment */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={BarChart3} title="Quality Assessment" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Structure Quality</Label>
            <CustomSelect
              value={data.structureQuality || ''}
              onChange={(value) => updateField('structureQuality', value)}
              options={[
                { value: "Excellent", label: "Excellent" },
                { value: "Good", label: "Good" },
                { value: "Fair", label: "Fair" },
                { value: "Poor", label: "Poor" },
                { value: "Needs Major Work", label: "Needs Major Work" }
              ]}
              placeholder="Select rating"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Content Relevance</Label>
            <CustomSelect
              value={data.contentRelevance || ''}
              onChange={(value) => updateField('contentRelevance', value)}
              options={[
                { value: "Highly Relevant", label: "Highly Relevant" },
                { value: "Relevant", label: "Relevant" },
                { value: "Somewhat Relevant", label: "Somewhat Relevant" },
                { value: "Not Relevant", label: "Not Relevant" }
              ]}
              placeholder="Select rating"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Language & Clarity</Label>
            <CustomSelect
              value={data.languageClarity || ''}
              onChange={(value) => updateField('languageClarity', value)}
              options={[
                { value: "Excellent", label: "Excellent" },
                { value: "Good", label: "Good" },
                { value: "Fair", label: "Fair" },
                { value: "Poor", label: "Poor" },
                { value: "Needs Improvement", label: "Needs Improvement" }
              ]}
              placeholder="Select rating"
            />
          </div>
        </div>
      </section>

      {/* C. Feedback & Notes */}
      <section className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100/50 space-y-6">
        <SectionHeader icon={MessageSquare} title="Feedback & Revision Notes" />
        <div className="space-y-2">
          <Label className="text-xs font-bold text-purple-700 uppercase tracking-wider">Key Feedback</Label>
          <Textarea
            rows={5}
            placeholder="Provide detailed feedback on the SOP structure, content, and specific areas for improvement..."
            value={data.feedbackNotes || ''}
            onChange={(e) => updateField('feedbackNotes', e.target.value)}
            className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 transition-all shadow-sm"
          />
        </div>
      </section>
    </div>
  );
};
