import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface UniversityShortlistingFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const UniversityShortlistingForm: React.FC<UniversityShortlistingFormProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Preferred Universities */}
      <div>
        <Label htmlFor="preferred-universities" className="text-sm font-medium text-gray-900">
          Preferred Universities
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          List
        </p>
        <Textarea
          id="preferred-universities"
          rows={4}
          placeholder="List preferred universities (one per line)..."
          value={data.preferredUniversities || ''}
          onChange={(e) => updateField('preferredUniversities', e.target.value)}
        />
      </div>

      {/* Preferred Course per University */}
      <div>
        <Label htmlFor="preferred-courses" className="text-sm font-medium text-gray-900">
          Preferred Course per University
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Mapping
        </p>
        <Textarea
          id="preferred-courses"
          rows={4}
          placeholder="Map courses to universities (e.g., MIT - MS in Computer Science)..."
          value={data.preferredCourses || ''}
          onChange={(e) => updateField('preferredCourses', e.target.value)}
        />
      </div>

      {/* Country */}
      <div>
        <Label htmlFor="shortlist-country" className="text-sm font-medium text-gray-900">
          Country
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          University country
        </p>
        <Input
          id="shortlist-country"
          placeholder="e.g., USA, Canada, UK"
          value={data.shortlistCountry || ''}
          onChange={(e) => updateField('shortlistCountry', e.target.value)}
        />
      </div>

      {/* Priority Level */}
      <div>
        <Label htmlFor="priority-level" className="text-sm font-medium text-gray-900">
          Priority Level
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Dream / target / safe
        </p>
        <Select
          value={data.priorityLevel || ''}
          onValueChange={(value) => updateField('priorityLevel', value)}
        >
          <SelectTrigger id="priority-level">
            <SelectValue placeholder="Select priority level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dream">Dream - Ambitious</SelectItem>
            <SelectItem value="Target">Target - Realistic</SelectItem>
            <SelectItem value="Safe">Safe - Backup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Intake */}
      <div>
        <Label htmlFor="shortlist-intake" className="text-sm font-medium text-gray-900">
          Intake
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Planned intake
        </p>
        <Input
          id="shortlist-intake"
          placeholder="e.g., Fall 2024, Spring 2025"
          value={data.shortlistIntake || ''}
          onChange={(e) => updateField('shortlistIntake', e.target.value)}
        />
      </div>

      {/* Budget Fit */}
      <div>
        <Label htmlFor="budget-fit" className="text-sm font-medium text-gray-900">
          Budget Fit
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.budgetFit || ''}
          onValueChange={(value) => updateField('budgetFit', value)}
        >
          <SelectTrigger id="budget-fit">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes - Within Budget</SelectItem>
            <SelectItem value="Tight">Tight - At Upper Limit</SelectItem>
            <SelectItem value="No">No - Over Budget</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Eligibility Fit */}
      <div>
        <Label htmlFor="eligibility-fit" className="text-sm font-medium text-gray-900">
          Eligibility Fit
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.eligibilityFit || ''}
          onValueChange={(value) => updateField('eligibilityFit', value)}
        >
          <SelectTrigger id="eligibility-fit">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes - Meets Requirements</SelectItem>
            <SelectItem value="Borderline">Borderline</SelectItem>
            <SelectItem value="No">No - Below Requirements</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Visa Safety Consideration */}
      <div>
        <Label htmlFor="visa-safety" className="text-sm font-medium text-gray-900">
          Visa Safety Consideration
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.visaSafety || ''}
          onValueChange={(value) => updateField('visaSafety', value)}
        >
          <SelectTrigger id="visa-safety">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low Risk">Low Risk</SelectItem>
            <SelectItem value="Medium Risk">Medium Risk</SelectItem>
            <SelectItem value="High Risk">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
