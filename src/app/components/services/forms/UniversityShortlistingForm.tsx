import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { CustomSelect } from '../../common/CustomSelect';

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
        <CustomSelect
          value={data.shortlistCountry || ''}
          onChange={(value) => updateField('shortlistCountry', value)}
          options={[
            { value: 'usa', label: 'USA' },
            { value: 'canada', label: 'Canada' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'australia', label: 'Australia' },
            { value: 'germany', label: 'Germany' },
            { value: 'france', label: 'France' },
            { value: 'other', label: 'Other' }
          ]}
          placeholder="Select country"
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
        <CustomSelect
          value={data.priorityLevel || ''}
          onChange={(value) => updateField('priorityLevel', value)}
          options={[
            { value: 'Dream', label: 'Dream - Ambitious' },
            { value: 'Target', label: 'Target - Realistic' },
            { value: 'Safe', label: 'Safe - Backup' }
          ]}
          placeholder="Select priority level"
        />
      </div>

      {/* Intake */}
      <div>
        <Label htmlFor="shortlist-intake" className="text-sm font-medium text-gray-900">
          Intake
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Planned intake
        </p>
        <CustomSelect
          value={data.shortlistIntake || ''}
          onChange={(value) => updateField('shortlistIntake', value)}
          options={[
            { value: 'fall-2025', label: 'Fall 2025' },
            { value: 'spring-2026', label: 'Spring 2026' },
            { value: 'fall-2026', label: 'Fall 2026' },
            { value: 'spring-2027', label: 'Spring 2027' }
          ]}
          placeholder="Select intake"
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
        <CustomSelect
          value={data.budgetFit || ''}
          onChange={(value) => updateField('budgetFit', value)}
          options={[
            { value: 'Yes', label: 'Yes - Within Budget' },
            { value: 'Tight', label: 'Tight - At Upper Limit' },
            { value: 'No', label: 'No - Over Budget' }
          ]}
          placeholder="Select option"
        />
      </div>

      {/* Eligibility Fit */}
      <div>
        <Label htmlFor="eligibility-fit" className="text-sm font-medium text-gray-900">
          Eligibility Fit
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <CustomSelect
          value={data.eligibilityFit || ''}
          onChange={(value) => updateField('eligibilityFit', value)}
          options={[
            { value: 'Yes', label: 'Yes - Meets Requirements' },
            { value: 'Borderline', label: 'Borderline' },
            { value: 'No', label: 'No - Below Requirements' }
          ]}
          placeholder="Select option"
        />
      </div>

      {/* Visa Safety Consideration */}
      <div>
        <Label htmlFor="visa-safety" className="text-sm font-medium text-gray-900">
          Visa Safety Consideration
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <CustomSelect
          value={data.visaSafety || ''}
          onChange={(value) => updateField('visaSafety', value)}
          options={[
            { value: 'Low Risk', label: 'Low Risk' },
            { value: 'Medium Risk', label: 'Medium Risk' },
            { value: 'High Risk', label: 'High Risk' }
          ]}
          placeholder="Select option"
        />
      </div>
    </div>
  );
};
