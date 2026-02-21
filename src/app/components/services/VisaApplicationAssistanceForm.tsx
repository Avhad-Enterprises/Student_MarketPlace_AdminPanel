import React from 'react';

interface VisaApplicationAssistanceFormProps {
  data: any;
  onChange: (data: any) => void;
}

export function VisaApplicationAssistanceForm({ data, onChange }: VisaApplicationAssistanceFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* A. Visa Profile Basics */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">A. Visa Profile Basics</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Target Country</label>
            <input
              type="text"
              value={data.targetCountry || ''}
              onChange={(e) => updateField('targetCountry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
              placeholder="e.g., United Kingdom, USA, Canada"
            />
            <p className="text-sm text-gray-500 mt-1">Which country is the visa being applied for?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Visa Type</label>
            <select
              value={data.visaType || ''}
              onChange={(e) => updateField('visaType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select visa type</option>
              <option value="student-tier-4">Student Visa (Tier 4) - UK</option>
              <option value="f1-visa">F-1 Student Visa - USA</option>
              <option value="study-permit">Study Permit - Canada</option>
              <option value="student-subclass-500">Student Visa (Subclass 500) - Australia</option>
              <option value="student-visa-eu">Student Visa - EU</option>
              <option value="other">Other</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">What type of student visa is required?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Intake / Start Date</label>
            <input
              type="date"
              value={data.intakeStartDate || ''}
              onChange={(e) => updateField('intakeStartDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            />
            <p className="text-sm text-gray-500 mt-1">When does the course begin?</p>
          </div>
        </div>
      </section>

      {/* B. University & Offer Reference */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">B. University & Offer Reference</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">University Name</label>
            <input
              type="text"
              value={data.universityName || ''}
              onChange={(e) => updateField('universityName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
              placeholder="Enter university name"
            />
            <p className="text-sm text-gray-500 mt-1">Which university is issuing the CAS / I-20 / COE?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Offer Letter Uploaded</label>
            <select
              value={data.offerLetterUploaded || ''}
              onChange={(e) => updateField('offerLetterUploaded', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="pending">Pending</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Is the official offer letter available?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CAS / I-20 / COE Status</label>
            <select
              value={data.casStatus || ''}
              onChange={(e) => updateField('casStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="issued">Issued</option>
              <option value="requested">Requested</option>
              <option value="not-requested">Not Requested</option>
              <option value="pending-documents">Pending Documents</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Has the visa reference document been issued?</p>
          </div>
        </div>
      </section>

      {/* C. Financial Documentation */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">C. Financial Documentation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Proof of Funds Available</label>
            <select
              value={data.proofOfFunds || ''}
              onChange={(e) => updateField('proofOfFunds', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes-complete">Yes - Complete</option>
              <option value="partial">Partial</option>
              <option value="in-progress">In Progress</option>
              <option value="not-available">Not Available</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Does the student have required financial proof?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Funds Source</label>
            <select
              value={data.fundsSource || ''}
              onChange={(e) => updateField('fundsSource', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select source</option>
              <option value="self">Self</option>
              <option value="sponsor">Sponsor</option>
              <option value="loan">Loan</option>
              <option value="combination">Combination</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Self, sponsor, loan, or combination?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loan Status</label>
            <select
              value={data.loanStatus || ''}
              onChange={(e) => updateField('loanStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="approved">Approved</option>
              <option value="in-progress">In Progress</option>
              <option value="not-applied">Not Applied</option>
              <option value="rejected">Rejected</option>
              <option value="not-applicable">Not Applicable</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Approved / in progress / not applied</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bank Statement Duration Covered</label>
            <select
              value={data.bankStatementDuration || ''}
              onChange={(e) => updateField('bankStatementDuration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select duration</option>
              <option value="sufficient">Sufficient (Meets requirement)</option>
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="insufficient">Insufficient</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Does the statement cover required months?</p>
          </div>
        </div>
      </section>

      {/* D. Visa Documents Checklist */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">D. Visa Documents Checklist</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Passport Validity</label>
            <select
              value={data.passportValidity || ''}
              onChange={(e) => updateField('passportValidity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="valid">Valid (Meets requirement)</option>
              <option value="expiring-soon">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="renewal-needed">Renewal Needed</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Is the passport valid for required duration?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Academic Transcripts Uploaded</label>
            <select
              value={data.academicTranscripts || ''}
              onChange={(e) => updateField('academicTranscripts', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes-all">Yes - All Documents</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
              <option value="not-uploaded">Not Uploaded</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Are all academic documents ready?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Language Test Report</label>
            <select
              value={data.languageTestReport || ''}
              onChange={(e) => updateField('languageTestReport', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="available">Available</option>
              <option value="pending-result">Pending Result</option>
              <option value="test-scheduled">Test Scheduled</option>
              <option value="not-taken">Not Taken</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Is the language test report available?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Medical / Insurance Documents</label>
            <select
              value={data.medicalInsurance || ''}
              onChange={(e) => updateField('medicalInsurance', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
              <option value="not-started">Not Started</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Are health-related documents completed?</p>
          </div>
        </div>
      </section>

      {/* E. Application & Appointment Tracking */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">E. Application & Appointment Tracking</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Visa Application Form Filled</label>
            <select
              value={data.applicationFormFilled || ''}
              onChange={(e) => updateField('applicationFormFilled', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="not-started">Not Started</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Has the visa application form been completed?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Biometrics Required</label>
            <select
              value={data.biometricsRequired || ''}
              onChange={(e) => updateField('biometricsRequired', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not-sure">Not Sure</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Is biometric submission required?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Appointment Booked</label>
            <select
              value={data.appointmentBooked || ''}
              onChange={(e) => updateField('appointmentBooked', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="pending">Pending</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Has the appointment been booked?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Appointment Date</label>
            <input
              type="date"
              value={data.appointmentDate || ''}
              onChange={(e) => updateField('appointmentDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            />
            <p className="text-sm text-gray-500 mt-1">When is the appointment scheduled?</p>
          </div>
        </div>
      </section>

      {/* F. Interview Preparation (If Applicable) */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">F. Interview Preparation (If Applicable)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Interview Required</label>
            <select
              value={data.interviewRequired || ''}
              onChange={(e) => updateField('interviewRequired', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not-sure">Not Sure</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Does this visa require an interview?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Interview Preparation Done</label>
            <select
              value={data.interviewPrepDone || ''}
              onChange={(e) => updateField('interviewPrepDone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="in-progress">In Progress</option>
              <option value="not-started">Not Started</option>
              <option value="not-applicable">Not Applicable</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Has preparation been completed?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mock Interview Notes</label>
            <textarea
              value={data.mockInterviewNotes || ''}
              onChange={(e) => updateField('mockInterviewNotes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
              placeholder="Important preparation points..."
            />
            <p className="text-sm text-gray-500 mt-1">Important preparation points</p>
          </div>
        </div>
      </section>

      {/* G. Visa Application Notes */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-[#253154]">G. Visa Application Notes</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Special Case Notes</label>
            <textarea
              value={data.specialCaseNotes || ''}
              onChange={(e) => updateField('specialCaseNotes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
              placeholder="Country- or profile-specific notes..."
            />
            <p className="text-sm text-gray-500 mt-1">Country- or profile-specific notes</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Internal Remarks</label>
            <textarea
              value={data.internalRemarks || ''}
              onChange={(e) => updateField('internalRemarks', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#253154]"
              placeholder="Anything the visa team should know..."
            />
            <p className="text-sm text-gray-500 mt-1">Anything the visa team should know</p>
          </div>
        </div>
      </section>
    </div>
  );
}
