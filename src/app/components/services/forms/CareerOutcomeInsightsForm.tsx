import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

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
        <Input
          id="career-country-preference"
          placeholder="e.g., USA, Canada, Home Country"
          value={data.careerCountryPreference || ''}
          onChange={(e) => updateField('careerCountryPreference', e.target.value)}
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
        <Select
          value={data.jobMarketAwareness || ''}
          onValueChange={(value) => updateField('jobMarketAwareness', value)}
        >
          <SelectTrigger id="job-market-awareness">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High - Well-informed</SelectItem>
            <SelectItem value="Moderate">Moderate - Some knowledge</SelectItem>
            <SelectItem value="Low">Low - Limited awareness</SelectItem>
            <SelectItem value="None">None - No awareness</SelectItem>
          </SelectContent>
        </Select>
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
        <Select
          value={data.prInterest || ''}
          onValueChange={(value) => updateField('prInterest', value)}
        >
          <SelectTrigger id="pr-interest">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes - High Priority">Yes - High Priority</SelectItem>
            <SelectItem value="Yes - Interested">Yes - Interested</SelectItem>
            <SelectItem value="Maybe">Maybe</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Undecided">Undecided</SelectItem>
          </SelectContent>
        </Select>
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
