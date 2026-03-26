import React from 'react';
import { DateInput } from '../ui/date-input';

interface ComplianceRenewalsFormProps {
  data: any;
  onChange: (data: any) => void;
}

export function ComplianceRenewalsForm({ data, onChange }: ComplianceRenewalsFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* A. Visa Validity Tracking */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">A. Visa Validity Tracking</h3>
        <div className="space-y-4">
          <DateInput
            label="Visa Start Date"
            value={data.visaStartDate || ''}
            onChange={(e) => updateField('visaStartDate', e.target.value)}
            helperText="When does the visa become valid?"
          />

          <DateInput
            label="Visa Expiry Date"
            value={data.visaExpiryDate || ''}
            onChange={(e) => updateField('visaExpiryDate', e.target.value)}
            helperText="When does the visa expire?"
          />

          <div>
            <label className="block text-sm font-medium mb-1">Multiple Entry Allowed</label>
            <select
              value={data.multipleEntryAllowed || ''}
              onChange={(e) => updateField('multipleEntryAllowed', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not-sure">Not Sure</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Is multiple entry permitted?</p>
          </div>
        </div>
      </section>

      {/* B. Compliance Requirements */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">B. Compliance Requirements</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Work Hour Restrictions</label>
            <select
              value={data.workHourRestrictions || ''}
              onChange={(e) => updateField('workHourRestrictions', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes-20-hours">Yes - 20 Hours/Week</option>
              <option value="yes-custom">Yes - Custom Limit</option>
              <option value="no">No Restrictions</option>
              <option value="not-allowed">Work Not Allowed</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Are work limits applicable?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Attendance Requirements</label>
            <select
              value={data.attendanceRequirements || ''}
              onChange={(e) => updateField('attendanceRequirements', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes-mandatory">Yes - Mandatory</option>
              <option value="yes-minimum">Yes - Minimum Threshold</option>
              <option value="no">No Requirements</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Is attendance monitoring mandatory?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address Reporting Required</label>
            <select
              value={data.addressReporting || ''}
              onChange={(e) => updateField('addressReporting', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes">Yes - Mandatory</option>
              <option value="no">No</option>
              <option value="only-change">Only When Changed</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Is address reporting mandatory?</p>
          </div>
        </div>
      </section>

      {/* C. Extension / Renewal Planning */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">C. Extension / Renewal Planning</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Extension Eligible</label>
            <select
              value={data.extensionEligible || ''}
              onChange={(e) => updateField('extensionEligible', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="conditional">Conditional</option>
              <option value="not-sure">Not Sure</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Can the visa be extended?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Extension Type</label>
            <select
              value={data.extensionType || ''}
              onChange={(e) => updateField('extensionType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select type</option>
              <option value="study">Study Extension</option>
              <option value="work">Work Visa</option>
              <option value="dependent">Dependent Visa</option>
              <option value="other">Other</option>
              <option value="not-applicable">Not Applicable</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Study / work / dependent / other</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Renewal Window</label>
            <input
              type="text"
              value={data.renewalWindow || ''}
              onChange={(e) => updateField('renewalWindow', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
              placeholder="e.g., 3 months before expiry"
            />
            <p className="text-sm text-gray-500 mt-1">When should renewal be initiated?</p>
          </div>
        </div>
      </section>

      {/* D. Compliance Monitoring */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">D. Compliance Monitoring</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Compliance Check-ins Required</label>
            <select
              value={data.complianceCheckIns || ''}
              onChange={(e) => updateField('complianceCheckIns', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes-monthly">Yes - Monthly</option>
              <option value="yes-quarterly">Yes - Quarterly</option>
              <option value="yes-biannual">Yes - Bi-Annual</option>
              <option value="no">No</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Are periodic reviews required?</p>
          </div>

          <DateInput
            label="Last Compliance Review Date"
            value={data.lastReviewDate || ''}
            onChange={(e) => updateField('lastReviewDate', e.target.value)}
            helperText="When was it last reviewed?"
          />

          <div>
            <label className="block text-sm font-medium mb-1">Issues Noted</label>
            <textarea
              value={data.issuesNoted || ''}
              onChange={(e) => updateField('issuesNoted', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
              placeholder="Any compliance concerns..."
            />
            <p className="text-sm text-gray-500 mt-1">Any compliance concerns?</p>
          </div>
        </div>
      </section>

      {/* E. Post-study Transition (Optional) */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">E. Post-study Transition (Optional)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">PSW / Work Visa Interest</label>
            <select
              value={data.pswInterest || ''}
              onChange={(e) => updateField('pswInterest', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes-high">Yes - High Interest</option>
              <option value="yes-maybe">Yes - Maybe</option>
              <option value="no">No</option>
              <option value="not-sure">Not Sure</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Interest in post-study work visa?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Eligibility Awareness</label>
            <select
              value={data.eligibilityAwareness || ''}
              onChange={(e) => updateField('eligibilityAwareness', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes-fully-aware">Yes - Fully Aware</option>
              <option value="partial">Partial Understanding</option>
              <option value="no">No</option>
              <option value="needs-counselling">Needs Counselling</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Does the student understand PSW rules?</p>
          </div>
        </div>
      </section>

      {/* F. Notes */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">F. Notes</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Compliance Notes</label>
            <textarea
              value={data.complianceNotes || ''}
              onChange={(e) => updateField('complianceNotes', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
              placeholder="Important reminders or risks..."
            />
            <p className="text-sm text-gray-500 mt-1">Important reminders or risks</p>
          </div>
        </div>
      </section>
    </div>
  );
}
