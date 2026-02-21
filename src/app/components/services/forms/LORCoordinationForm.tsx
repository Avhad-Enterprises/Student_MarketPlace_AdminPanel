import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface LORCoordinationFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const LORCoordinationForm: React.FC<LORCoordinationFormProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Number of LORs Required */}
      <div>
        <Label htmlFor="lor-required-count" className="text-sm font-medium text-gray-900">
          Number of LORs Required
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Count
        </p>
        <Input
          id="lor-required-count"
          type="number"
          placeholder="e.g., 2 or 3"
          value={data.lorRequiredCount || ''}
          onChange={(e) => updateField('lorRequiredCount', e.target.value)}
        />
      </div>

      {/* Recommender Name */}
      <div>
        <Label htmlFor="recommender-name" className="text-sm font-medium text-gray-900">
          Recommender Name
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Name
        </p>
        <Input
          id="recommender-name"
          placeholder="e.g., Dr. John Smith"
          value={data.recommenderName || ''}
          onChange={(e) => updateField('recommenderName', e.target.value)}
        />
      </div>

      {/* Relationship to Student */}
      <div>
        <Label htmlFor="recommender-relationship" className="text-sm font-medium text-gray-900">
          Relationship to Student
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Professor / manager
        </p>
        <Select
          value={data.recommenderRelationship || ''}
          onValueChange={(value) => updateField('recommenderRelationship', value)}
        >
          <SelectTrigger id="recommender-relationship">
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Professor">Professor</SelectItem>
            <SelectItem value="Academic Advisor">Academic Advisor</SelectItem>
            <SelectItem value="Department Head">Department Head</SelectItem>
            <SelectItem value="Direct Manager">Direct Manager</SelectItem>
            <SelectItem value="Senior Colleague">Senior Colleague</SelectItem>
            <SelectItem value="Research Supervisor">Research Supervisor</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Recommender Email */}
      <div>
        <Label htmlFor="recommender-email" className="text-sm font-medium text-gray-900">
          Recommender Email
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Email
        </p>
        <Input
          id="recommender-email"
          type="email"
          placeholder="e.g., john.smith@university.edu"
          value={data.recommenderEmail || ''}
          onChange={(e) => updateField('recommenderEmail', e.target.value)}
        />
      </div>

      {/* Current Status */}
      <div>
        <Label htmlFor="lor-status" className="text-sm font-medium text-gray-900">
          Current Status
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Requested / received / follow-up
        </p>
        <Select
          value={data.lorStatus || ''}
          onValueChange={(value) => updateField('lorStatus', value)}
        >
          <SelectTrigger id="lor-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Not Requested">Not Requested</SelectItem>
            <SelectItem value="Requested">Requested</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Received">Received</SelectItem>
            <SelectItem value="Needs Follow-up">Needs Follow-up</SelectItem>
            <SelectItem value="Declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Coordination Notes */}
      <div>
        <Label htmlFor="coordination-notes" className="text-sm font-medium text-gray-900">
          Coordination Notes
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Issues or follow-ups
        </p>
        <Textarea
          id="coordination-notes"
          rows={5}
          placeholder="Add notes about coordination, follow-ups, or any issues..."
          value={data.coordinationNotes || ''}
          onChange={(e) => updateField('coordinationNotes', e.target.value)}
        />
      </div>
    </div>
  );
};
