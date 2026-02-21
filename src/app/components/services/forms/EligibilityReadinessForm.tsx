import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface EligibilityReadinessFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const EligibilityReadinessForm: React.FC<EligibilityReadinessFormProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Meets Course Prerequisites */}
      <div>
        <Label htmlFor="meets-prerequisites" className="text-sm font-medium text-gray-900">
          Meets Course Prerequisites
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.meetsPrerequisites || ''}
          onValueChange={(value) => updateField('meetsPrerequisites', value)}
        >
          <SelectTrigger id="meets-prerequisites">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Partially">Partially</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bridge Course Required */}
      <div>
        <Label htmlFor="bridge-course" className="text-sm font-medium text-gray-900">
          Bridge Course Required
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.bridgeCourse || ''}
          onValueChange={(value) => updateField('bridgeCourse', value)}
        >
          <SelectTrigger id="bridge-course">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Maybe">Maybe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* English Test Required */}
      <div>
        <Label htmlFor="english-test-required" className="text-sm font-medium text-gray-900">
          English Test Required
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.englishTestRequired || ''}
          onValueChange={(value) => updateField('englishTestRequired', value)}
        >
          <SelectTrigger id="english-test-required">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Test Type */}
      {data.englishTestRequired === 'Yes' && (
        <div>
          <Label htmlFor="test-type" className="text-sm font-medium text-gray-900">
            Test Type
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            IELTS / TOEFL / PTE
          </p>
          <Select
            value={data.testType || ''}
            onValueChange={(value) => updateField('testType', value)}
          >
            <SelectTrigger id="test-type">
              <SelectValue placeholder="Select test type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IELTS">IELTS</SelectItem>
              <SelectItem value="TOEFL">TOEFL</SelectItem>
              <SelectItem value="PTE">PTE</SelectItem>
              <SelectItem value="Duolingo">Duolingo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Test Status */}
      {data.englishTestRequired === 'Yes' && (
        <div>
          <Label htmlFor="test-status" className="text-sm font-medium text-gray-900">
            Test Status
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Not started / booked / completed
          </p>
          <Select
            value={data.testStatus || ''}
            onValueChange={(value) => updateField('testStatus', value)}
          >
            <SelectTrigger id="test-status">
              <SelectValue placeholder="Select test status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="Preparing">Preparing</SelectItem>
              <SelectItem value="Booked">Booked</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Score Available */}
      {data.testStatus === 'Completed' && (
        <div>
          <Label htmlFor="score-available" className="text-sm font-medium text-gray-900">
            Score Available
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Yes / No
          </p>
          <Select
            value={data.scoreAvailable || ''}
            onValueChange={(value) => updateField('scoreAvailable', value)}
          >
            <SelectTrigger id="score-available">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Proof of Funds Ready */}
      <div>
        <Label htmlFor="proof-of-funds" className="text-sm font-medium text-gray-900">
          Proof of Funds Ready
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.proofOfFunds || ''}
          onValueChange={(value) => updateField('proofOfFunds', value)}
        >
          <SelectTrigger id="proof-of-funds">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sponsor Identified */}
      <div>
        <Label htmlFor="sponsor-identified" className="text-sm font-medium text-gray-900">
          Sponsor Identified
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.sponsorIdentified || ''}
          onValueChange={(value) => updateField('sponsorIdentified', value)}
        >
          <SelectTrigger id="sponsor-identified">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Not Applicable">Not Applicable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loan Required */}
      <div>
        <Label htmlFor="loan-required" className="text-sm font-medium text-gray-900">
          Loan Required
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.loanRequired || ''}
          onValueChange={(value) => updateField('loanRequired', value)}
        >
          <SelectTrigger id="loan-required">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Maybe">Maybe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gap Explanation Required for Visa */}
      <div>
        <Label htmlFor="gap-explanation-visa" className="text-sm font-medium text-gray-900">
          Gap Explanation Required for Visa
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Yes / No
        </p>
        <Select
          value={data.gapExplanationVisa || ''}
          onValueChange={(value) => updateField('gapExplanationVisa', value)}
        >
          <SelectTrigger id="gap-explanation-visa">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Not Applicable">Not Applicable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Country-specific Visa Risk */}
      <div>
        <Label htmlFor="visa-risk" className="text-sm font-medium text-gray-900">
          Country-specific Visa Risk
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Details
        </p>
        <Textarea
          id="visa-risk"
          rows={3}
          placeholder="Describe any visa-related concerns or risks..."
          value={data.visaRisk || ''}
          onChange={(e) => updateField('visaRisk', e.target.value)}
        />
      </div>

      {/* Visa Notes */}
      <div>
        <Label htmlFor="visa-notes" className="text-sm font-medium text-gray-900">
          Visa Notes
        </Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Important points
        </p>
        <Textarea
          id="visa-notes"
          rows={4}
          placeholder="Add important visa-related notes..."
          value={data.visaNotes || ''}
          onChange={(e) => updateField('visaNotes', e.target.value)}
        />
      </div>
    </div>
  );
};
