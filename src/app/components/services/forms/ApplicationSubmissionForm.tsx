import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { DateInput } from '../../ui/date-input';

interface ApplicationSubmissionFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const ApplicationSubmissionForm: React.FC<ApplicationSubmissionFormProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* SOP Uploaded */}
      <div>
        <Label htmlFor="sop-uploaded" className="text-sm font-medium text-gray-900">
          SOP Uploaded
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.sopUploaded || ''}
          onValueChange={(value) => updateField('sopUploaded', value)}
        >
          <SelectTrigger id="sop-uploaded">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LORs Uploaded */}
      <div>
        <Label htmlFor="lors-uploaded" className="text-sm font-medium text-gray-900">
          LORs Uploaded
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.lorsUploaded || ''}
          onValueChange={(value) => updateField('lorsUploaded', value)}
        >
          <SelectTrigger id="lors-uploaded">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Uploaded">All Uploaded</SelectItem>
            <SelectItem value="Partially Uploaded">Partially Uploaded</SelectItem>
            <SelectItem value="Not Uploaded">Not Uploaded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transcripts Uploaded */}
      <div>
        <Label htmlFor="transcripts-uploaded" className="text-sm font-medium text-gray-900">
          Transcripts Uploaded
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.transcriptsUploaded || ''}
          onValueChange={(value) => updateField('transcriptsUploaded', value)}
        >
          <SelectTrigger id="transcripts-uploaded">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Application Fee Paid */}
      <div>
        <Label htmlFor="fee-paid" className="text-sm font-medium text-gray-900">
          Application Fee Paid
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.feePaid || ''}
          onValueChange={(value) => updateField('feePaid', value)}
        >
          <SelectTrigger id="fee-paid">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Waived">Waived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submission Date */}
      <DateInput
        id="submission-date"
        label="Submission Date"
        helperText="Date"
        value={data.submissionDate || ''}
        onValueChange={(value) => updateField('submissionDate', value)}
      />

      {/* Application Portal */}
      <div>
        <Label htmlFor="application-portal" className="text-sm font-medium text-gray-900">
          Application Portal
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Portal name
        </p>
        <Input
          id="application-portal"
          placeholder="e.g., Common App, Coalition App, University Portal"
          value={data.applicationPortal || ''}
          onChange={(e) => updateField('applicationPortal', e.target.value)}
        />
      </div>

      {/* Confirmation Received */}
      <div>
        <Label htmlFor="confirmation-received" className="text-sm font-medium text-gray-900">
          Confirmation Received
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.confirmationReceived || ''}
          onValueChange={(value) => updateField('confirmationReceived', value)}
        >
          <SelectTrigger id="confirmation-received">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Errors Faced */}
      <div>
        <Label htmlFor="errors-faced" className="text-sm font-medium text-gray-900">
          Errors Faced
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Details
        </p>
        <Textarea
          id="errors-faced"
          rows={3}
          placeholder="Describe any errors or issues encountered during submission..."
          value={data.errorsFaced || ''}
          onChange={(e) => updateField('errorsFaced', e.target.value)}
        />
      </div>

      {/* Resolution Notes */}
      <div>
        <Label htmlFor="resolution-notes" className="text-sm font-medium text-gray-900">
          Resolution Notes
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          How resolved
        </p>
        <Textarea
          id="resolution-notes"
          rows={4}
          placeholder="Add notes about how errors were resolved or next steps..."
          value={data.resolutionNotes || ''}
          onChange={(e) => updateField('resolutionNotes', e.target.value)}
        />
      </div>
    </div>
  );
};
