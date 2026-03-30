import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { CustomSelect } from '../../common/CustomSelect';

interface UniversitySelectionFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const UniversitySelectionForm: React.FC<UniversitySelectionFormProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Preferred Destination Countries */}
      <div>
        <Label htmlFor="preferred-countries" className="text-sm font-medium text-gray-900">
          Preferred Destination Countries
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Which countries is the student interested in studying in?
        </p>
        <CustomSelect
          value={data.preferredCountries || ''}
          onChange={(value) => updateField('preferredCountries', value)}
          options={[
            { value: 'usa', label: 'USA' },
            { value: 'canada', label: 'Canada' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'australia', label: 'Australia' },
            { value: 'germany', label: 'Germany' },
            { value: 'france', label: 'France' },
            { value: 'other', label: 'Other' }
          ]}
          placeholder="Select countries"
        />
      </div>

      {/* Preferred Intake(s) */}
      <div>
        <Label htmlFor="preferred-intakes" className="text-sm font-medium text-gray-900">
          Preferred Intake(s)
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Which intake(s) is the student targeting?
        </p>
        <CustomSelect
          value={data.preferredIntakes || ''}
          onChange={(value) => updateField('preferredIntakes', value)}
          options={[
            { value: 'fall-2025', label: 'Fall 2025' },
            { value: 'spring-2026', label: 'Spring 2026' },
            { value: 'fall-2026', label: 'Fall 2026' },
            { value: 'spring-2027', label: 'Spring 2027' }
          ]}
          placeholder="Select target intake"
        />
      </div>

      {/* Course Level */}
      <div>
        <Label htmlFor="course-level" className="text-sm font-medium text-gray-900">
          Course Level
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          UG / PG / Diploma / PhD
        </p>
        <CustomSelect
          value={data.courseLevel || ''}
          onChange={(value) => updateField('courseLevel', value)}
          options={[
            { value: 'Undergraduate', label: 'Undergraduate (UG)' },
            { value: 'Postgraduate', label: 'Postgraduate (PG)' },
            { value: 'Diploma', label: 'Diploma' },
            { value: 'PhD', label: 'PhD' }
          ]}
          placeholder="Select course level"
        />
      </div>

      {/* Field(s) of Study */}
      <div>
        <Label htmlFor="field-of-study" className="text-sm font-medium text-gray-900">
          Field(s) of Study
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          What subject or specialization is the student aiming for?
        </p>
        <Input
          id="field-of-study"
          placeholder="e.g., Computer Science, Business Analytics"
          value={data.fieldOfStudy || ''}
          onChange={(e) => updateField('fieldOfStudy', e.target.value)}
        />
      </div>

      {/* Career Goal */}
      <div>
        <Label htmlFor="career-goal" className="text-sm font-medium text-gray-900">
          Career Goal
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          What does the student want to do after completing studies?
        </p>
        <Textarea
          id="career-goal"
          rows={3}
          placeholder="Describe the student's career aspirations..."
          value={data.careerGoal || ''}
          onChange={(e) => updateField('careerGoal', e.target.value)}
        />
      </div>

      {/* Long-term Plan */}
      <div>
        <Label htmlFor="long-term-plan" className="text-sm font-medium text-gray-900">
          Long-term Plan
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Stay abroad / return / undecided
        </p>
        <CustomSelect
          value={data.longTermPlan || ''}
          onChange={(value) => updateField('longTermPlan', value)}
          options={[
            { value: 'Stay Abroad', label: 'Stay Abroad' },
            { value: 'Return Home', label: 'Return Home' },
            { value: 'Undecided', label: 'Undecided' }
          ]}
          placeholder="Select long-term plan"
        />
      </div>

      {/* Annual Budget Range */}
      <div>
        <Label htmlFor="annual-budget" className="text-sm font-medium text-gray-900">
          Annual Budget Range
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Tuition + living per year
        </p>
        <Input
          id="annual-budget"
          placeholder="e.g., $50,000 - $70,000"
          value={data.annualBudget || ''}
          onChange={(e) => updateField('annualBudget', e.target.value)}
        />
      </div>

      {/* Funding Source */}
      <div>
        <Label htmlFor="funding-source" className="text-sm font-medium text-gray-900">
          Funding Source
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Self / family / loan / sponsor
        </p>
        <CustomSelect
          value={data.fundingSource || ''}
          onChange={(value) => updateField('fundingSource', value)}
          options={[
            { value: 'Self-funded', label: 'Self-funded' },
            { value: 'Family', label: 'Family' },
            { value: 'Education Loan', label: 'Education Loan' },
            { value: 'Scholarship', label: 'Scholarship' },
            { value: 'Sponsor', label: 'Sponsor' },
            { value: 'Mixed', label: 'Mixed Sources' }
          ]}
          placeholder="Select funding source"
        />
      </div>

      {/* Family / Location Constraints */}
      <div>
        <Label htmlFor="constraints" className="text-sm font-medium text-gray-900">
          Family / Location Constraints
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Any personal limitations?
        </p>
        <Textarea
          id="constraints"
          rows={3}
          placeholder="Describe any constraints..."
          value={data.constraints || ''}
          onChange={(e) => updateField('constraints', e.target.value)}
        />
      </div>

      {/* Timeline Urgency */}
      <div>
        <Label htmlFor="timeline-urgency" className="text-sm font-medium text-gray-900">
          Timeline Urgency
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          How urgent is the plan?
        </p>
        <CustomSelect
          value={data.timelineUrgency || ''}
          onChange={(value) => updateField('timelineUrgency', value)}
          options={[
            { value: 'Low', label: 'Low - Flexible timeline' },
            { value: 'Medium', label: 'Medium - Prefer specific intake' },
            { value: 'High', label: 'High - Must apply soon' },
            { value: 'Critical', label: 'Critical - Urgent application' }
          ]}
          placeholder="Select urgency level"
        />
      </div>

      {/* Conversation Notes */}
      <div>
        <Label htmlFor="conversation-notes" className="text-sm font-medium text-gray-900">
          Conversation Notes
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Key points discussed
        </p>
        <Textarea
          id="conversation-notes"
          rows={4}
          placeholder="Add notes from consultation..."
          value={data.conversationNotes || ''}
          onChange={(e) => updateField('conversationNotes', e.target.value)}
        />
      </div>
    </div>
  );
};
