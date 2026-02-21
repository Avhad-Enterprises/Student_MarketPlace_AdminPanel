import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

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

  return (
    <div className="space-y-6">
      {/* Application Order */}
      <div>
        <Label htmlFor="application-order" className="text-sm font-medium text-gray-900">
          Application Order
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Submission order
        </p>
        <Textarea
          id="application-order"
          rows={3}
          placeholder="List universities in order of application submission..."
          value={data.applicationOrder || ''}
          onChange={(e) => updateField('applicationOrder', e.target.value)}
        />
      </div>

      {/* Application Type */}
      <div>
        <Label htmlFor="application-type" className="text-sm font-medium text-gray-900">
          Application Type
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Early / regular / late
        </p>
        <Select
          value={data.applicationType || ''}
          onValueChange={(value) => updateField('applicationType', value)}
        >
          <SelectTrigger id="application-type">
            <SelectValue placeholder="Select application type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Early Decision">Early Decision</SelectItem>
            <SelectItem value="Early Action">Early Action</SelectItem>
            <SelectItem value="Regular">Regular</SelectItem>
            <SelectItem value="Rolling">Rolling</SelectItem>
            <SelectItem value="Late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deadline Awareness */}
      <div>
        <Label htmlFor="deadline-awareness" className="text-sm font-medium text-gray-900">
          Deadline Awareness
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.deadlineAwareness || ''}
          onValueChange={(value) => updateField('deadlineAwareness', value)}
        >
          <SelectTrigger id="deadline-awareness">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes - Fully Aware</SelectItem>
            <SelectItem value="Partial">Partial - Some Awareness</SelectItem>
            <SelectItem value="No">No - Needs Information</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deadline Risk Level */}
      <div>
        <Label htmlFor="deadline-risk" className="text-sm font-medium text-gray-900">
          Deadline Risk Level
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Low / medium / high
        </p>
        <Select
          value={data.deadlineRisk || ''}
          onValueChange={(value) => updateField('deadlineRisk', value)}
        >
          <SelectTrigger id="deadline-risk">
            <SelectValue placeholder="Select risk level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low - Ample Time</SelectItem>
            <SelectItem value="Medium">Medium - Some Pressure</SelectItem>
            <SelectItem value="High">High - Tight Deadline</SelectItem>
            <SelectItem value="Critical">Critical - Immediate Action Needed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* SOP Approach */}
      <div>
        <Label htmlFor="sop-approach" className="text-sm font-medium text-gray-900">
          SOP Approach
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Single / customized
        </p>
        <Select
          value={data.sopApproach || ''}
          onValueChange={(value) => updateField('sopApproach', value)}
        >
          <SelectTrigger id="sop-approach">
            <SelectValue placeholder="Select SOP approach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single Generic">Single Generic SOP</SelectItem>
            <SelectItem value="Lightly Customized">Lightly Customized</SelectItem>
            <SelectItem value="Fully Customized">Fully Customized per University</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customization Level */}
      <div>
        <Label htmlFor="customization-level" className="text-sm font-medium text-gray-900">
          Customization Level
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Low / medium / high
        </p>
        <Select
          value={data.customizationLevel || ''}
          onValueChange={(value) => updateField('customizationLevel', value)}
        >
          <SelectTrigger id="customization-level">
            <SelectValue placeholder="Select customization level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low - Minimal Changes</SelectItem>
            <SelectItem value="Medium">Medium - Moderate Changes</SelectItem>
            <SelectItem value="High">High - Extensive Customization</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LOR Type */}
      <div>
        <Label htmlFor="lor-type" className="text-sm font-medium text-gray-900">
          LOR Type
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Academic / professional / mixed
        </p>
        <Select
          value={data.lorType || ''}
          onValueChange={(value) => updateField('lorType', value)}
        >
          <SelectTrigger id="lor-type">
            <SelectValue placeholder="Select LOR type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Academic Only">Academic Only</SelectItem>
            <SelectItem value="Professional Only">Professional Only</SelectItem>
            <SelectItem value="Mixed">Mixed (Academic + Professional)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Number of LORs Required */}
      <div>
        <Label htmlFor="lor-count" className="text-sm font-medium text-gray-900">
          Number of LORs Required
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Count
        </p>
        <Input
          id="lor-count"
          type="number"
          placeholder="e.g., 2 or 3"
          value={data.lorCount || ''}
          onChange={(e) => updateField('lorCount', e.target.value)}
        />
      </div>

      {/* Strategy Notes */}
      <div>
        <Label htmlFor="strategy-notes" className="text-sm font-medium text-gray-900">
          Strategy Notes
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Special considerations
        </p>
        <Textarea
          id="strategy-notes"
          rows={5}
          placeholder="Add any special considerations or strategic notes..."
          value={data.strategyNotes || ''}
          onChange={(e) => updateField('strategyNotes', e.target.value)}
        />
      </div>
    </div>
  );
};
