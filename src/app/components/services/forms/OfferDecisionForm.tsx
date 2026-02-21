import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

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
          <Select
            value={data.country || ''}
            onValueChange={(value) => updateField('country', value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USA">USA</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="UK">UK</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="Ireland">Ireland</SelectItem>
              <SelectItem value="New Zealand">New Zealand</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
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
          <Select
            value={data.offerType || ''}
            onValueChange={(value) => updateField('offerType', value)}
          >
            <SelectTrigger id="offer-type">
              <SelectValue placeholder="Select offer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Conditional">Conditional</SelectItem>
              <SelectItem value="Unconditional">Unconditional</SelectItem>
            </SelectContent>
          </Select>
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

        <div>
          <Label htmlFor="offer-deadline" className="text-sm font-medium text-gray-900">
            Offer Deadline
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            By when does the student need to respond?
          </p>
          <Input
            id="offer-deadline"
            type="date"
            value={data.offerDeadline || ''}
            onChange={(e) => updateField('offerDeadline', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="deposit-required" className="text-sm font-medium text-gray-900">
            Deposit Required
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Is any deposit required to accept the offer?
          </p>
          <Select
            value={data.depositRequired || ''}
            onValueChange={(value) => updateField('depositRequired', value)}
          >
            <SelectTrigger id="deposit-required">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
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
          <Select
            value={data.scholarshipOffered || ''}
            onValueChange={(value) => updateField('scholarshipOffered', value)}
          >
            <SelectTrigger id="scholarship-offered">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
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
            How relevant is this course to the student's background?
          </p>
          <Select
            value={data.courseRelevance || ''}
            onValueChange={(value) => updateField('courseRelevance', value)}
          >
            <SelectTrigger id="course-relevance">
              <SelectValue placeholder="Select relevance level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Highly Relevant">Highly Relevant</SelectItem>
              <SelectItem value="Moderately Relevant">Moderately Relevant</SelectItem>
              <SelectItem value="Somewhat Relevant">Somewhat Relevant</SelectItem>
              <SelectItem value="Not Relevant">Not Relevant</SelectItem>
            </SelectContent>
          </Select>
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
          <Select
            value={data.employabilityOutlook || ''}
            onValueChange={(value) => updateField('employabilityOutlook', value)}
          >
            <SelectTrigger id="employability-outlook">
              <SelectValue placeholder="Select outlook" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Average">Average</SelectItem>
              <SelectItem value="Below Average">Below Average</SelectItem>
              <SelectItem value="Uncertain">Uncertain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="industry-alignment" className="text-sm font-medium text-gray-900">
            Industry Alignment
          </Label>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Does the course align with the student's target industry?
          </p>
          <Select
            value={data.industryAlignment || ''}
            onValueChange={(value) => updateField('industryAlignment', value)}
          >
            <SelectTrigger id="industry-alignment">
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Perfectly Aligned">Perfectly Aligned</SelectItem>
              <SelectItem value="Well Aligned">Well Aligned</SelectItem>
              <SelectItem value="Partially Aligned">Partially Aligned</SelectItem>
              <SelectItem value="Not Aligned">Not Aligned</SelectItem>
            </SelectContent>
          </Select>
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
          <Select
            value={data.visaSuccessProbability || ''}
            onValueChange={(value) => updateField('visaSuccessProbability', value)}
          >
            <SelectTrigger id="visa-success-probability">
              <SelectValue placeholder="Select probability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Very High">Very High (90%+)</SelectItem>
              <SelectItem value="High">High (70-90%)</SelectItem>
              <SelectItem value="Medium">Medium (50-70%)</SelectItem>
              <SelectItem value="Low">Low (&lt;50%)</SelectItem>
            </SelectContent>
          </Select>
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
            Will the student's profile gaps be questioned?
          </p>
          <Select
            value={data.gapSensitivity || ''}
            onValueChange={(value) => updateField('gapSensitivity', value)}
          >
            <SelectTrigger id="gap-sensitivity">
              <SelectValue placeholder="Select sensitivity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No Concern">No Concern</SelectItem>
              <SelectItem value="Minor Concern">Minor Concern</SelectItem>
              <SelectItem value="Moderate Concern">Moderate Concern</SelectItem>
              <SelectItem value="Major Concern">Major Concern</SelectItem>
            </SelectContent>
          </Select>
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
          <Select
            value={data.studentPreferenceLevel || ''}
            onValueChange={(value) => updateField('studentPreferenceLevel', value)}
          >
            <SelectTrigger id="student-preference-level">
              <SelectValue placeholder="Select preference level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="First Choice">First Choice</SelectItem>
              <SelectItem value="Highly Interested">Highly Interested</SelectItem>
              <SelectItem value="Moderately Interested">Moderately Interested</SelectItem>
              <SelectItem value="Backup Option">Backup Option</SelectItem>
              <SelectItem value="Not Interested">Not Interested</SelectItem>
            </SelectContent>
          </Select>
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
          <Select
            value={data.followUpRequired || ''}
            onValueChange={(value) => updateField('followUpRequired', value)}
          >
            <SelectTrigger id="follow-up-required">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes - Follow-up needed</SelectItem>
              <SelectItem value="No">No - All clear</SelectItem>
              <SelectItem value="Pending">Pending - Waiting for info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
