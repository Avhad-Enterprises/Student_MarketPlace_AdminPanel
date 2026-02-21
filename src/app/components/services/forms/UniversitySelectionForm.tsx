import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

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
        <Input
          id="preferred-countries"
          placeholder="e.g., USA, Canada, UK, Australia"
          value={data.preferredCountries || ''}
          onChange={(e) => updateField('preferredCountries', e.target.value)}
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
        <Input
          id="preferred-intakes"
          placeholder="e.g., Fall 2024, Spring 2025"
          value={data.preferredIntakes || ''}
          onChange={(e) => updateField('preferredIntakes', e.target.value)}
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
        <Select
          value={data.courseLevel || ''}
          onValueChange={(value) => updateField('courseLevel', value)}
        >
          <SelectTrigger id="course-level">
            <SelectValue placeholder="Select course level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Undergraduate">Undergraduate (UG)</SelectItem>
            <SelectItem value="Postgraduate">Postgraduate (PG)</SelectItem>
            <SelectItem value="Diploma">Diploma</SelectItem>
            <SelectItem value="PhD">PhD</SelectItem>
          </SelectContent>
        </Select>
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
        <Select
          value={data.longTermPlan || ''}
          onValueChange={(value) => updateField('longTermPlan', value)}
        >
          <SelectTrigger id="long-term-plan">
            <SelectValue placeholder="Select long-term plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Stay Abroad">Stay Abroad</SelectItem>
            <SelectItem value="Return Home">Return Home</SelectItem>
            <SelectItem value="Undecided">Undecided</SelectItem>
          </SelectContent>
        </Select>
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
        <Select
          value={data.fundingSource || ''}
          onValueChange={(value) => updateField('fundingSource', value)}
        >
          <SelectTrigger id="funding-source">
            <SelectValue placeholder="Select funding source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Self-funded">Self-funded</SelectItem>
            <SelectItem value="Family">Family</SelectItem>
            <SelectItem value="Education Loan">Education Loan</SelectItem>
            <SelectItem value="Scholarship">Scholarship</SelectItem>
            <SelectItem value="Sponsor">Sponsor</SelectItem>
            <SelectItem value="Mixed">Mixed Sources</SelectItem>
          </SelectContent>
        </Select>
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
        <Select
          value={data.timelineUrgency || ''}
          onValueChange={(value) => updateField('timelineUrgency', value)}
        >
          <SelectTrigger id="timeline-urgency">
            <SelectValue placeholder="Select urgency level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low - Flexible timeline</SelectItem>
            <SelectItem value="Medium">Medium - Prefer specific intake</SelectItem>
            <SelectItem value="High">High - Must apply soon</SelectItem>
            <SelectItem value="Critical">Critical - Urgent application</SelectItem>
          </SelectContent>
        </Select>
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
