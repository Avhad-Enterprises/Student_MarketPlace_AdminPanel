import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { CustomSelect } from '../../common/CustomSelect';
import { GraduationCap, Briefcase, Ruler, AlertCircle } from 'lucide-react';

interface ProfileEvaluationFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const ProfileEvaluationForm: React.FC<ProfileEvaluationFormProps> = ({
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
      {/* Academic Profile */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={GraduationCap} title="Academic Profile" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Highest Qualification</Label>
            <Input
              id="highest-qualification"
              placeholder="e.g., Bachelor's in Computer Science"
              value={data.highestQualification || ''}
              onChange={(e) => updateField('highestQualification', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">GPA / Percentage</Label>
            <Input
              id="gpa-percentage"
              placeholder="e.g., 3.8 / 4.0 or 85%"
              value={data.gpaPercentage || ''}
              onChange={(e) => updateField('gpaPercentage', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Grading System</Label>
            <CustomSelect
              value={data.gradingSystem || ''}
              onChange={(value) => updateField('gradingSystem', value)}
              options={[
                { value: "4.0 Scale", label: "4.0 Scale" },
                { value: "10.0 Scale", label: "10.0 Scale" },
                { value: "Percentage", label: "Percentage" },
                { value: "Class/Division", label: "Class/Division" },
                { value: "Other", label: "Other" }
              ]}
              placeholder="Select grading system"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Institution Type / Tier</Label>
            <CustomSelect
              value={data.institutionTier || ''}
              onChange={(value) => updateField('institutionTier', value)}
              options={[
                { value: "Tier 1 - Top Ranked", label: "Tier 1 - Top Ranked" },
                { value: "Tier 2 - Well-known", label: "Tier 2 - Well-known" },
                { value: "Tier 3 - Average", label: "Tier 3 - Average" },
                { value: "Unknown", label: "Unknown" }
              ]}
              placeholder="Select institution tier"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Backlogs</Label>
            <CustomSelect
              value={data.backlogs || ''}
              onChange={(value) => updateField('backlogs', value)}
              options={[
                { value: "No", label: "No" },
                { value: "Yes - All Cleared", label: "Yes - All Cleared" },
                { value: "Yes - Some Pending", label: "Yes - Some Pending" }
              ]}
              placeholder="Select option"
            />
          </div>
        </div>
      </section>

      {/* Professional Experience */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Briefcase} title="Professional Experience" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Work Experience (Years)</Label>
            <Input
              id="work-experience"
              type="number"
              placeholder="e.g., 2"
              value={data.workExperience || ''}
              onChange={(e) => updateField('workExperience', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Field Relevance</Label>
            <CustomSelect
              value={data.fieldRelevance || ''}
              onChange={(value) => updateField('fieldRelevance', value)}
              options={[
                { value: "Highly Relevant", label: "Highly Relevant" },
                { value: "Somewhat Relevant", label: "Somewhat Relevant" },
                { value: "Not Relevant", label: "Not Relevant" },
                { value: "No Work Experience", label: "No Work Experience" }
              ]}
              placeholder="Select relevance"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Internships / Projects</Label>
            <Textarea
              id="internships-projects"
              rows={3}
              placeholder="Describe internships and projects..."
              value={data.internshipsProjects || ''}
              onChange={(e) => updateField('internshipsProjects', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Research / Publications</Label>
            <Textarea
              id="research-publications"
              rows={3}
              placeholder="List research papers, publications, or conference presentations..."
              value={data.researchPublications || ''}
              onChange={(e) => updateField('researchPublications', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Gap Analysis */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Ruler} title="Gap Analysis" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gap Years</Label>
            <CustomSelect
              value={data.gapYears || ''}
              onChange={(value) => updateField('gapYears', value)}
              options={[
                { value: "No", label: "No" },
                { value: "Yes", label: "Yes" }
              ]}
              placeholder="Select option"
            />
          </div>

          {data.gapYears === 'Yes' && (
            <div className="space-y-2 animate-in slide-in-from-left-2 duration-300">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gap Duration</Label>
              <Input
                id="gap-duration"
                placeholder="e.g., 1 year, 6 months"
                value={data.gapDuration || ''}
                onChange={(e) => updateField('gapDuration', e.target.value)}
                className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
              />
            </div>
          )}

          {data.gapYears === 'Yes' && (
            <div className="space-y-2 md:col-span-2 animate-in slide-in-from-left-2 duration-300">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gap Explanation Available</Label>
              <CustomSelect
                value={data.gapExplanation || ''}
                onChange={(value) => updateField('gapExplanation', value)}
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" }
                ]}
                placeholder="Select option"
              />
            </div>
          )}
        </div>
      </section>

      {/* Reviewer Notes */}
      <section className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100/50 space-y-6">
        <SectionHeader icon={AlertCircle} title="Reviewer Notes" />
        <div className="space-y-2">
          <Label className="text-xs font-bold text-purple-700 uppercase tracking-wider">Additional Notes</Label>
          <Textarea
            id="additional-notes"
            rows={4}
            placeholder="Add any concerns or observations..."
            value={data.additionalNotes || ''}
            onChange={(e) => updateField('additionalNotes', e.target.value)}
            className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200"
          />
        </div>
      </section>
    </div>
  );
};
