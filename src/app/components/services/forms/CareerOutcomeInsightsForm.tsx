import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { CustomSelect } from '../../common/CustomSelect';

interface CareerOutcomeInsightsFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const CareerOutcomeInsightsForm: React.FC<CareerOutcomeInsightsFormProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Intended Job Role */}
      <div>
        <Label htmlFor="intended-job-role" className="text-sm font-medium text-gray-900">
          Intended Job Role
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Target role
        </p>
        <Input
          id="intended-job-role"
          placeholder="e.g., Software Engineer, Data Analyst"
          value={data.intendedJobRole || ''}
          onChange={(e) => updateField('intendedJobRole', e.target.value)}
        />
      </div>

      {/* Preferred Industry */}
      <div>
        <Label htmlFor="preferred-industry" className="text-sm font-medium text-gray-900">
          Preferred Industry
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Industry choice
        </p>
        <Input
          id="preferred-industry"
          placeholder="e.g., Technology, Finance, Healthcare"
          value={data.preferredIndustry || ''}
          onChange={(e) => updateField('preferredIndustry', e.target.value)}
        />
      </div>

      {/* Country Preference for Career */}
      <div>
        <Label htmlFor="career-country-preference" className="text-sm font-medium text-gray-900">
          Country Preference for Career
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Post-study work country
        </p>
        <CustomSelect
          value={data.careerCountryPreference || ''}
          onChange={(value) => updateField('careerCountryPreference', value)}
          options={[
            { value: 'usa', label: 'USA' },
            { value: 'canada', label: 'Canada' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'australia', label: 'Australia' },
            { value: 'germany', label: 'Germany' },
            { value: 'france', label: 'France' },
            { value: 'home-country', label: 'Home Country' },
            { value: 'other', label: 'Other' }
          ]}
          placeholder="Select country"
        />
      </div>

      {/* Awareness of Job Market */}
      <div>
        <Label htmlFor="job-market-awareness" className="text-sm font-medium text-gray-900">
          Awareness of Job Market
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <CustomSelect
          value={data.jobMarketAwareness || ''}
          onChange={(value) => updateField('jobMarketAwareness', value)}
          options={[
            { value: 'High', label: 'High - Well-informed' },
            { value: 'Moderate', label: 'Moderate - Some knowledge' },
            { value: 'Low', label: 'Low - Limited awareness' },
            { value: 'None', label: 'None - No awareness' }
          ]}
          placeholder="Select option"
        />
      </div>

      {/* Salary Expectations */}
      <div>
        <Label htmlFor="salary-expectations" className="text-sm font-medium text-gray-900">
          Salary Expectations
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Expected range
        </p>
        <Input
          id="salary-expectations"
          placeholder="e.g., $80,000 - $100,000 per year"
          value={data.salaryExpectations || ''}
          onChange={(e) => updateField('salaryExpectations', e.target.value)}
        />
      </div>

      {/* PR / Stay-back Interest */}
      <div>
        <Label htmlFor="pr-interest" className="text-sm font-medium text-gray-900">
          PR / Stay-back Interest
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <CustomSelect
          value={data.stayBackInterest || ''}
          onChange={(value) => updateField('stayBackInterest', value)}
          options={[
            { value: 'Yes - High Priority', label: 'Yes - High Priority' },
            { value: 'Yes - Interested', label: 'Yes - Interested' },
            { value: 'Maybe', label: 'Maybe' },
            { value: 'No', label: 'No' },
            { value: 'Undecided', label: 'Undecided' }
          ]}
          placeholder="Select option"
        />
      </div>

      {/* Career Discussion Notes */}
      <div>
        <Label htmlFor="career-discussion-notes" className="text-sm font-medium text-gray-900">
          Career Discussion Notes
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Key insights
        </p>
        <Textarea
          id="career-discussion-notes"
          rows={6}
          placeholder="Add notes from career discussions..."
          value={data.careerDiscussionNotes || ''}
          onChange={(e) => updateField('careerDiscussionNotes', e.target.value)}
        />
      </div>
    </div>
  );
};
