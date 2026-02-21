import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

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

  return (
    <div className="space-y-6">
      {/* Highest Qualification */}
      <div>
        <Label htmlFor="highest-qualification" className="text-sm font-medium text-gray-900">
          Highest Qualification
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Highest completed qualification
        </p>
        <Input
          id="highest-qualification"
          placeholder="e.g., Bachelor's in Computer Science"
          value={data.highestQualification || ''}
          onChange={(e) => updateField('highestQualification', e.target.value)}
        />
      </div>

      {/* GPA / Percentage */}
      <div>
        <Label htmlFor="gpa-percentage" className="text-sm font-medium text-gray-900">
          GPA / Percentage
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Academic score
        </p>
        <Input
          id="gpa-percentage"
          placeholder="e.g., 3.8 / 4.0 or 85%"
          value={data.gpaPercentage || ''}
          onChange={(e) => updateField('gpaPercentage', e.target.value)}
        />
      </div>

      {/* Grading System */}
      <div>
        <Label htmlFor="grading-system" className="text-sm font-medium text-gray-900">
          Grading System
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Scale used
        </p>
        <Select
          value={data.gradingSystem || ''}
          onValueChange={(value) => updateField('gradingSystem', value)}
        >
          <SelectTrigger id="grading-system">
            <SelectValue placeholder="Select grading system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4.0 Scale">4.0 Scale</SelectItem>
            <SelectItem value="10.0 Scale">10.0 Scale</SelectItem>
            <SelectItem value="Percentage">Percentage</SelectItem>
            <SelectItem value="Class/Division">Class/Division</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Institution Type / Tier */}
      <div>
        <Label htmlFor="institution-tier" className="text-sm font-medium text-gray-900">
          Institution Type / Tier
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Reputed / average / unknown
        </p>
        <Select
          value={data.institutionTier || ''}
          onValueChange={(value) => updateField('institutionTier', value)}
        >
          <SelectTrigger id="institution-tier">
            <SelectValue placeholder="Select institution tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tier 1 - Top Ranked">Tier 1 - Top Ranked</SelectItem>
            <SelectItem value="Tier 2 - Well-known">Tier 2 - Well-known</SelectItem>
            <SelectItem value="Tier 3 - Average">Tier 3 - Average</SelectItem>
            <SelectItem value="Unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Backlogs */}
      <div>
        <Label htmlFor="backlogs" className="text-sm font-medium text-gray-900">
          Backlogs
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.backlogs || ''}
          onValueChange={(value) => updateField('backlogs', value)}
        >
          <SelectTrigger id="backlogs">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Yes - All Cleared">Yes - All Cleared</SelectItem>
            <SelectItem value="Yes - Some Pending">Yes - Some Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Experience (Years) */}
      <div>
        <Label htmlFor="work-experience" className="text-sm font-medium text-gray-900">
          Work Experience (Years)
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Total experience
        </p>
        <Input
          id="work-experience"
          type="number"
          placeholder="e.g., 2"
          value={data.workExperience || ''}
          onChange={(e) => updateField('workExperience', e.target.value)}
        />
      </div>

      {/* Field Relevance */}
      <div>
        <Label htmlFor="field-relevance" className="text-sm font-medium text-gray-900">
          Field Relevance
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Related to intended course?
        </p>
        <Select
          value={data.fieldRelevance || ''}
          onValueChange={(value) => updateField('fieldRelevance', value)}
        >
          <SelectTrigger id="field-relevance">
            <SelectValue placeholder="Select relevance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Highly Relevant">Highly Relevant</SelectItem>
            <SelectItem value="Somewhat Relevant">Somewhat Relevant</SelectItem>
            <SelectItem value="Not Relevant">Not Relevant</SelectItem>
            <SelectItem value="No Work Experience">No Work Experience</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Internships / Projects */}
      <div>
        <Label htmlFor="internships-projects" className="text-sm font-medium text-gray-900">
          Internships / Projects
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Relevant experience
        </p>
        <Textarea
          id="internships-projects"
          rows={3}
          placeholder="Describe internships and projects..."
          value={data.internshipsProjects || ''}
          onChange={(e) => updateField('internshipsProjects', e.target.value)}
        />
      </div>

      {/* Research / Publications */}
      <div>
        <Label htmlFor="research-publications" className="text-sm font-medium text-gray-900">
          Research / Publications
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Any research work?
        </p>
        <Textarea
          id="research-publications"
          rows={3}
          placeholder="List research papers, publications, or conference presentations..."
          value={data.researchPublications || ''}
          onChange={(e) => updateField('researchPublications', e.target.value)}
        />
      </div>

      {/* Gap Years */}
      <div>
        <Label htmlFor="gap-years" className="text-sm font-medium text-gray-900">
          Gap Years
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Any gaps?
        </p>
        <Select
          value={data.gapYears || ''}
          onValueChange={(value) => updateField('gapYears', value)}
        >
          <SelectTrigger id="gap-years">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gap Duration */}
      {data.gapYears === 'Yes' && (
        <div>
          <Label htmlFor="gap-duration" className="text-sm font-medium text-gray-900">
            Gap Duration
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Length of gap
          </p>
          <Input
            id="gap-duration"
            placeholder="e.g., 1 year, 6 months"
            value={data.gapDuration || ''}
            onChange={(e) => updateField('gapDuration', e.target.value)}
          />
        </div>
      )}

      {/* Gap Explanation Available */}
      {data.gapYears === 'Yes' && (
        <div>
          <Label htmlFor="gap-explanation" className="text-sm font-medium text-gray-900">
            Gap Explanation Available
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Yes / No
          </p>
          <Select
            value={data.gapExplanation || ''}
            onValueChange={(value) => updateField('gapExplanation', value)}
          >
            <SelectTrigger id="gap-explanation">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Additional Notes */}
      <div>
        <Label htmlFor="additional-notes" className="text-sm font-medium text-gray-900">
          Additional Notes
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Concerns during review
        </p>
        <Textarea
          id="additional-notes"
          rows={4}
          placeholder="Add any concerns or observations..."
          value={data.additionalNotes || ''}
          onChange={(e) => updateField('additionalNotes', e.target.value)}
        />
      </div>
    </div>
  );
};
