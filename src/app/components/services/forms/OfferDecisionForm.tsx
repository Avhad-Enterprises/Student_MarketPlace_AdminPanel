import React from 'react';
import { DateInput } from '../../ui/date-input';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { CustomSelect } from '../../common/CustomSelect';

interface OfferDecisionFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const OfferDecisionForm: React.FC<OfferDecisionFormProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* A. OFFER OVERVIEW */}
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
          A. Offer Overview
        </h3>

        <div>
          <Label htmlFor="offer-received-from" className="text-sm font-medium text-gray-900">
            Offer Received From
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Which university has issued the offer?
          </p>
          <Input
            id="offer-received-from"
            placeholder="e.g., University of Toronto"
            value={data.offerReceivedFrom || ''}
            onChange={(e) => updateField('offerReceivedFrom', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="course-name" className="text-sm font-medium text-gray-900">
            Course Name
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Which course is the offer for?
          </p>
          <Input
            id="course-name"
            placeholder="e.g., Master of Science in Computer Science"
            value={data.courseName || ''}
            onChange={(e) => updateField('courseName', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="country" className="text-sm font-medium text-gray-900">
            Country
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Which country is this offer from?
          </p>
          <CustomSelect
            value={data.country || ''}
            onChange={(value) => updateField('country', value)}
            options={[
              { value: 'USA', label: 'USA' },
              { value: 'Canada', label: 'Canada' },
              { value: 'UK', label: 'UK' },
              { value: 'Australia', label: 'Australia' },
              { value: 'Germany', label: 'Germany' },
              { value: 'Ireland', label: 'Ireland' },
              { value: 'New Zealand', label: 'New Zealand' },
              { value: 'Other', label: 'Other' }
            ]}
            placeholder="Select country"
          />
        </div>

        <div>
          <Label htmlFor="intake" className="text-sm font-medium text-gray-900">
            Intake
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Which intake does the offer apply to?
          </p>
          <Input
            id="intake"
            placeholder="e.g., Fall 2024, Spring 2025"
            value={data.intake || ''}
            onChange={(e) => updateField('intake', e.target.value)}
          />
        </div>
      </div>

      {/* B. OFFER DETAILS */}
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
          B. Offer Details
        </h3>

        <div>
          <Label htmlFor="offer-type" className="text-sm font-medium text-gray-900">
            Offer Type
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Is the offer conditional or unconditional?
          </p>
          <CustomSelect
            value={data.offerType || ''}
            onChange={(value) => updateField('offerType', value)}
            options={[
              { value: 'Conditional', label: 'Conditional' },
              { value: 'Unconditional', label: 'Unconditional' }
            ]}
            placeholder="Select offer type"
          />
        </div>

        <div>
          <Label htmlFor="conditions-mentioned" className="text-sm font-medium text-gray-900">
            Conditions Mentioned
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Are there academic, financial, or language conditions?
          </p>
          <Textarea
            id="conditions-mentioned"
            rows={3}
            placeholder="Describe any conditions attached to the offer..."
            value={data.conditionsMentioned || ''}
            onChange={(e) => updateField('conditionsMentioned', e.target.value)}
          />
        </div>

          <DateInput
            label="Offer Deadline"
            value={data.offerDeadline || ''}
            onChange={(e) => updateField('offerDeadline', e.target.value)}
            helperText="By when does the student need to respond?"
          />

        <div>
          <Label htmlFor="deposit-required" className="text-sm font-medium text-gray-900">
            Deposit Required
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Is any deposit required to accept the offer?
          </p>
          <CustomSelect
            value={data.depositRequired || ''}
            onChange={(value) => updateField('depositRequired', value)}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
            placeholder="Select option"
          />
        </div>

        <div>
          <Label htmlFor="deposit-amount" className="text-sm font-medium text-gray-900">
            Deposit Amount
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            How much needs to be paid to secure the seat?
          </p>
          <Input
            id="deposit-amount"
            placeholder="e.g., $5,000 CAD"
            value={data.depositAmount || ''}
            onChange={(e) => updateField('depositAmount', e.target.value)}
          />
        </div>
      </div>

      {/* C. FINANCIAL FIT */}
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
          C. Financial Fit
        </h3>

        <div>
          <Label htmlFor="tuition-fee-annual" className="text-sm font-medium text-gray-900">
            Tuition Fee (Annual)
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            What is the yearly tuition fee?
          </p>
          <Input
            id="tuition-fee-annual"
            placeholder="e.g., $30,000 CAD"
            value={data.tuitionFeeAnnual || ''}
            onChange={(e) => updateField('tuitionFeeAnnual', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="estimated-living-cost" className="text-sm font-medium text-gray-900">
            Estimated Living Cost
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            What is the expected cost of living?
          </p>
          <Input
            id="estimated-living-cost"
            placeholder="e.g., $15,000 CAD/year"
            value={data.estimatedLivingCost || ''}
            onChange={(e) => updateField('estimatedLivingCost', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="scholarship-offered" className="text-sm font-medium text-gray-900">
            Scholarship Offered
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Is any scholarship included in the offer?
          </p>
          <CustomSelect
            value={data.scholarshipOffered || ''}
            onChange={(value) => updateField('scholarshipOffered', value)}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
            placeholder="Select option"
          />
        </div>

        <div>
          <Label htmlFor="total-first-year-cost" className="text-sm font-medium text-gray-900">
            Total First-Year Cost
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            What is the approximate first-year expense?
          </p>
          <Input
            id="total-first-year-cost"
            placeholder="e.g., $45,000 CAD"
            value={data.totalFirstYearCost || ''}
            onChange={(e) => updateField('totalFirstYearCost', e.target.value)}
          />
        </div>
      </div>

      {/* D. ACADEMIC & CAREER ALIGNMENT */}
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
          D. Academic & Career Alignment
        </h3>

        <div>
          <Label htmlFor="course-relevance" className="text-sm font-medium text-gray-900">
            Course Relevance
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            How relevant is this course to the student&apos;s background?
          </p>
          <CustomSelect
            value={data.courseRelevance || ''}
            onChange={(value) => updateField('courseRelevance', value)}
            options={[
              { value: 'Highly Relevant', label: 'Highly Relevant' },
              { value: 'Moderately Relevant', label: 'Moderately Relevant' },
              { value: 'Somewhat Relevant', label: 'Somewhat Relevant' },
              { value: 'Not Relevant', label: 'Not Relevant' }
            ]}
            placeholder="Select relevance level"
          />
        </div>

        <div>
          <Label htmlFor="university-ranking" className="text-sm font-medium text-gray-900">
            University Ranking / Reputation
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            How is the university perceived academically?
          </p>
          <Textarea
            id="university-ranking"
            rows={2}
            placeholder="e.g., Top 50 globally, well-regarded in CS programs..."
            value={data.universityRanking || ''}
            onChange={(e) => updateField('universityRanking', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="employability-outlook" className="text-sm font-medium text-gray-900">
            Employability Outlook
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            What are the job prospects after completing this course?
          </p>
          <CustomSelect
            value={data.employabilityOutlook || ''}
            onChange={(value) => updateField('employabilityOutlook', value)}
            options={[
              { value: 'Excellent', label: 'Excellent' },
              { value: 'Good', label: 'Good' },
              { value: 'Average', label: 'Average' },
              { value: 'Below Average', label: 'Below Average' },
              { value: 'Uncertain', label: 'Uncertain' }
            ]}
            placeholder="Select outlook"
          />
        </div>

        <div>
          <Label htmlFor="industry-alignment" className="text-sm font-medium text-gray-900">
            Industry Alignment
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Does the course align with the student&apos;s target industry?
          </p>
          <CustomSelect
            value={data.industryAlignment || ''}
            onChange={(value) => updateField('industryAlignment', value)}
            options={[
              { value: 'Perfectly Aligned', label: 'Perfectly Aligned' },
              { value: 'Well Aligned', label: 'Well Aligned' },
              { value: 'Partially Aligned', label: 'Partially Aligned' },
              { value: 'Not Aligned', label: 'Not Aligned' }
            ]}
            placeholder="Select alignment"
          />
        </div>
      </div>

      {/* E. VISA & RISK CONSIDERATIONS */}
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
          E. Visa & Risk Considerations
        </h3>

        <div>
          <Label htmlFor="visa-success-probability" className="text-sm font-medium text-gray-900">
            Visa Success Probability
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            How safe is this offer from a visa perspective?
          </p>
          <CustomSelect
            value={data.visaSuccessProbability || ''}
            onChange={(value) => updateField('visaSuccessProbability', value)}
            options={[
              { value: 'Very High', label: 'Very High (90%+)' },
              { value: 'High', label: 'High (70-90%)' },
              { value: 'Medium', label: 'Medium (50-70%)' },
              { value: 'Low', label: 'Low (<50%)' }
            ]}
            placeholder="Select probability"
          />
        </div>

        <div>
          <Label htmlFor="country-specific-risks" className="text-sm font-medium text-gray-900">
            Country-specific Risks
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Any known visa or compliance risks?
          </p>
          <Textarea
            id="country-specific-risks"
            rows={3}
            placeholder="Describe any visa concerns, policy changes, or compliance requirements..."
            value={data.countrySpecificRisks || ''}
            onChange={(e) => updateField('countrySpecificRisks', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="gap-sensitivity" className="text-sm font-medium text-gray-900">
            Gap Sensitivity
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Will the student&apos;s profile gaps be questioned?
          </p>
          <CustomSelect
            value={data.gapSensitivity || ''}
            onChange={(value) => updateField('gapSensitivity', value)}
            options={[
              { value: 'No Concern', label: 'No Concern' },
              { value: 'Minor Concern', label: 'Minor Concern' },
              { value: 'Moderate Concern', label: 'Moderate Concern' },
              { value: 'Major Concern', label: 'Major Concern' }
            ]}
            placeholder="Select sensitivity"
          />
        </div>
      </div>

      {/* F. STUDENT PREFERENCE & FEEDBACK */}
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
          F. Student Preference & Feedback
        </h3>

        <div>
          <Label htmlFor="student-preference-level" className="text-sm font-medium text-gray-900">
            Student Preference Level
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            How interested is the student in this offer?
          </p>
          <CustomSelect
            value={data.studentPreferenceLevel || ''}
            onChange={(value) => updateField('studentPreferenceLevel', value)}
            options={[
              { value: 'First Choice', label: 'First Choice' },
              { value: 'Highly Interested', label: 'Highly Interested' },
              { value: 'Moderately Interested', label: 'Moderately Interested' },
              { value: 'Backup Option', label: 'Backup Option' },
              { value: 'Not Interested', label: 'Not Interested' }
            ]}
            placeholder="Select preference level"
          />
        </div>

        <div>
          <Label htmlFor="family-concerns-raised" className="text-sm font-medium text-gray-900">
            Family Concerns Raised
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Any concerns from parents or sponsors?
          </p>
          <Textarea
            id="family-concerns-raised"
            rows={3}
            placeholder="Document any concerns raised by family members or sponsors..."
            value={data.familyConcernsRaised || ''}
            onChange={(e) => updateField('familyConcernsRaised', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="student-questions-doubts" className="text-sm font-medium text-gray-900">
            Student Questions / Doubts
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            What clarifications were asked during discussion?
          </p>
          <Textarea
            id="student-questions-doubts"
            rows={3}
            placeholder="List questions or doubts raised by the student..."
            value={data.studentQuestionsDoubts || ''}
            onChange={(e) => updateField('studentQuestionsDoubts', e.target.value)}
          />
        </div>
      </div>

      {/* G. COUNSELLOR NOTES */}
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
          G. Counsellor Notes
        </h3>

        <div>
          <Label htmlFor="discussion-summary" className="text-sm font-medium text-gray-900">
            Discussion Summary
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Key points discussed during offer review.
          </p>
          <Textarea
            id="discussion-summary"
            rows={4}
            placeholder="Summarize the offer review discussion..."
            value={data.discussionSummary || ''}
            onChange={(e) => updateField('discussionSummary', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="follow-up-required" className="text-sm font-medium text-gray-900">
            Follow-up Required
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Is another discussion or clarification needed?
          </p>
          <CustomSelect
            value={data.followUpRequired || ''}
            onChange={(value) => updateField('followUpRequired', value)}
            options={[
              { value: 'Yes', label: 'Yes - Follow-up needed' },
              { value: 'No', label: 'No - All clear' },
              { value: 'Pending', label: 'Pending - Waiting for info' }
            ]}
            placeholder="Select option"
          />
        </div>
      </div>
    </div>
  );
};
