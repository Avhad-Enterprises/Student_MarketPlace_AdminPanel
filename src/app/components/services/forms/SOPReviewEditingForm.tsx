import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface SOPReviewEditingFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const SOPReviewEditingForm: React.FC<SOPReviewEditingFormProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* SOP Version */}
      <div>
        <Label htmlFor="sop-version" className="text-sm font-medium text-gray-900">
          SOP Version
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Current version
        </p>
        <Input
          id="sop-version"
          placeholder="e.g., Version 1.0, Draft 3"
          value={data.sopVersion || ''}
          onChange={(e) => updateField('sopVersion', e.target.value)}
        />
      </div>

      {/* Draft Status */}
      <div>
        <Label htmlFor="draft-status" className="text-sm font-medium text-gray-900">
          Draft Status
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Draft / revised / final
        </p>
        <Select
          value={data.draftStatus || ''}
          onValueChange={(value) => updateField('draftStatus', value)}
        >
          <SelectTrigger id="draft-status">
            <SelectValue placeholder="Select draft status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Initial Draft">Initial Draft</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Revised">Revised</SelectItem>
            <SelectItem value="Near Final">Near Final</SelectItem>
            <SelectItem value="Final">Final</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assigned Editor */}
      <div>
        <Label htmlFor="assigned-editor" className="text-sm font-medium text-gray-900">
          Assigned Editor
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Responsible person
        </p>
        <Input
          id="assigned-editor"
          placeholder="e.g., Sarah Johnson"
          value={data.assignedEditor || ''}
          onChange={(e) => updateField('assignedEditor', e.target.value)}
        />
      </div>

      {/* Structure Quality */}
      <div>
        <Label htmlFor="structure-quality" className="text-sm font-medium text-gray-900">
          Structure Quality
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Assessment
        </p>
        <Select
          value={data.structureQuality || ''}
          onValueChange={(value) => updateField('structureQuality', value)}
        >
          <SelectTrigger id="structure-quality">
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
            <SelectItem value="Needs Major Work">Needs Major Work</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Relevance */}
      <div>
        <Label htmlFor="content-relevance" className="text-sm font-medium text-gray-900">
          Content Relevance
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Assessment
        </p>
        <Select
          value={data.contentRelevance || ''}
          onValueChange={(value) => updateField('contentRelevance', value)}
        >
          <SelectTrigger id="content-relevance">
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Highly Relevant">Highly Relevant</SelectItem>
            <SelectItem value="Relevant">Relevant</SelectItem>
            <SelectItem value="Somewhat Relevant">Somewhat Relevant</SelectItem>
            <SelectItem value="Not Relevant">Not Relevant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Language & Clarity */}
      <div>
        <Label htmlFor="language-clarity" className="text-sm font-medium text-gray-900">
          Language & Clarity
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Assessment
        </p>
        <Select
          value={data.languageClarity || ''}
          onValueChange={(value) => updateField('languageClarity', value)}
        >
          <SelectTrigger id="language-clarity">
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
            <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feedback Notes */}
      <div>
        <Label htmlFor="feedback-notes" className="text-sm font-medium text-gray-900">
          Feedback Notes
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Key feedback
        </p>
        <Textarea
          id="feedback-notes"
          rows={5}
          placeholder="Provide detailed feedback on the SOP..."
          value={data.feedbackNotes || ''}
          onChange={(e) => updateField('feedbackNotes', e.target.value)}
        />
      </div>

      {/* Revision Count */}
      <div>
        <Label htmlFor="revision-count" className="text-sm font-medium text-gray-900">
          Revision Count
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Number
        </p>
        <Input
          id="revision-count"
          type="number"
          placeholder="e.g., 1, 2, 3"
          value={data.revisionCount || ''}
          onChange={(e) => updateField('revisionCount', e.target.value)}
        />
      </div>
    </div>
  );
};
