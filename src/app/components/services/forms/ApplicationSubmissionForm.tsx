import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { CustomSelect } from '../../common/CustomSelect';
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* SOP Uploaded */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">SOP Uploaded</Label>
          <CustomSelect
            value={data.sopUploaded || ''}
            onChange={(value) => updateField('sopUploaded', value)}
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
              { value: "In Progress", label: "In Progress" }
            ]}
            placeholder="Select status"
          />
        </div>

        {/* LORs Uploaded */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">LORs Uploaded</Label>
          <CustomSelect
            value={data.lorsUploaded || ''}
            onChange={(value) => updateField('lorsUploaded', value)}
            options={[
              { value: "All Uploaded", label: "All Uploaded" },
              { value: "Partially Uploaded", label: "Partially Uploaded" },
              { value: "Not Uploaded", label: "Not Uploaded" }
            ]}
            placeholder="Select status"
          />
        </div>

        {/* Transcripts Uploaded */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transcripts Uploaded</Label>
          <CustomSelect
            value={data.transcriptsUploaded || ''}
            onChange={(value) => updateField('transcriptsUploaded', value)}
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
              { value: "Pending", label: "Pending" }
            ]}
            placeholder="Select status"
          />
        </div>

        {/* Application Fee Paid */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Application Fee Paid</Label>
          <CustomSelect
            value={data.feePaid || ''}
            onChange={(value) => updateField('feePaid', value)}
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
              { value: "Pending", label: "Pending" },
              { value: "Waived", label: "Waived" }
            ]}
            placeholder="Select status"
          />
        </div>

        {/* Submission Date */}
        <div className="space-y-2">
          <DateInput
            id="submission-date"
            label="Submission Date"
            value={data.submissionDate || ''}
            onValueChange={(value) => updateField('submissionDate', value)}
          />
        </div>

        {/* Confirmation Received */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirmation Received</Label>
          <CustomSelect
            value={data.confirmationReceived || ''}
            onChange={(value) => updateField('confirmationReceived', value)}
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
              { value: "Pending", label: "Pending" }
            ]}
            placeholder="Select status"
          />
        </div>
      </div>

      <div className="p-6 bg-purple-50/30 rounded-2xl border border-purple-100/50 space-y-6">
        {/* Application Portal */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-purple-700 uppercase tracking-wider">Application Portal</Label>
          <Input
            id="application-portal"
            placeholder="e.g., Common App, Coalition App, University Portal"
            value={data.applicationPortal || ''}
            onChange={(e) => updateField('applicationPortal', e.target.value)}
            className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200"
          />
        </div>

        {/* Errors Faced */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-red-600 uppercase tracking-wider">Errors Faced</Label>
          <Textarea
            id="errors-faced"
            rows={2}
            placeholder="Describe any errors or issues encountered during submission..."
            value={data.errorsFaced || ''}
            onChange={(e) => updateField('errorsFaced', e.target.value)}
            className="bg-white border-red-100 focus:border-red-300 focus:ring-red-200"
          />
        </div>

        {/* Resolution Notes */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolution Notes</Label>
          <Textarea
            id="resolution-notes"
            rows={3}
            placeholder="Add notes about how errors were resolved or next steps..."
            value={data.resolutionNotes || ''}
            onChange={(e) => updateField('resolutionNotes', e.target.value)}
            className="bg-white border-emerald-100 focus:border-emerald-300 focus:ring-emerald-200"
          />
        </div>
      </div>
    </div>
  );
};
