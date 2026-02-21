import React from 'react';
import { Plane, Home, Shield, GraduationCap, Backpack, FileText } from 'lucide-react';

interface PreDepartureSupportFormProps {
  data: any;
  onChange: (data: any) => void;
}

export function PreDepartureSupportForm({ data, onChange }: PreDepartureSupportFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* A. Travel Readiness */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Plane className="size-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Travel Readiness</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planned Travel Date
            </label>
            <input
              type="date"
              value={data.plannedTravelDate || ''}
              onChange={(e) => updateField('plannedTravelDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">When is the student planning to travel?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flight Booked
            </label>
            <select
              value={data.flightBooked || ''}
              onChange={(e) => updateField('flightBooked', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="in-progress">In Progress</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Has the flight ticket been booked?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Airline Name
            </label>
            <input
              type="text"
              value={data.airlineName || ''}
              onChange={(e) => updateField('airlineName', e.target.value)}
              placeholder="e.g., Emirates, British Airways"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">Which airline is the student flying with?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Airport
            </label>
            <input
              type="text"
              value={data.departureAirport || ''}
              onChange={(e) => updateField('departureAirport', e.target.value)}
              placeholder="e.g., Delhi (DEL), Mumbai (BOM)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">From which city/country is the student departing?</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Airport
            </label>
            <input
              type="text"
              value={data.arrivalAirport || ''}
              onChange={(e) => updateField('arrivalAirport', e.target.value)}
              placeholder="e.g., London Heathrow (LHR), Toronto (YYZ)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">Where will the student land?</p>
          </div>
        </div>
      </section>

      {/* B. Accommodation Planning */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Home className="size-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Accommodation Planning</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accommodation Type
            </label>
            <select
              value={data.accommodationType || ''}
              onChange={(e) => updateField('accommodationType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select type</option>
              <option value="university-housing">University Housing</option>
              <option value="private">Private</option>
              <option value="temporary">Temporary</option>
              <option value="with-relatives">With Relatives</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">University housing / Private / Temporary / With relatives</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accommodation Confirmed
            </label>
            <select
              value={data.accommodationConfirmed || ''}
              onChange={(e) => updateField('accommodationConfirmed', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="pending">Pending</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Is accommodation confirmed before arrival?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Available
            </label>
            <select
              value={data.addressAvailable || ''}
              onChange={(e) => updateField('addressAvailable', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="partial">Partial</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Is the accommodation address available?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Stay Duration
            </label>
            <input
              type="text"
              value={data.initialStayDuration || ''}
              onChange={(e) => updateField('initialStayDuration', e.target.value)}
              placeholder="e.g., 6 months, 1 year"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">How long is the initial accommodation arranged for?</p>
          </div>
        </div>
      </section>

      {/* C. Essential Setup Before Travel */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="size-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Essential Setup Before Travel</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Travel Insurance Arranged
            </label>
            <select
              value={data.travelInsuranceArranged || ''}
              onChange={(e) => updateField('travelInsuranceArranged', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="in-progress">In Progress</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Has travel or health insurance been arranged?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forex / International Card Ready
            </label>
            <select
              value={data.forexCardReady || ''}
              onChange={(e) => updateField('forexCardReady', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="in-progress">In Progress</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Does the student have international payment access?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Important Documents Collected
            </label>
            <select
              value={data.importantDocsCollected || ''}
              onChange={(e) => updateField('importantDocsCollected', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="partial">Partial</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Does the student have all required documents for travel?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Shared
            </label>
            <select
              value={data.emergencyContactShared || ''}
              onChange={(e) => updateField('emergencyContactShared', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Has emergency contact information been shared?</p>
          </div>
        </div>
      </section>

      {/* D. Pre-Departure Orientation */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="size-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Pre-Departure Orientation</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orientation Session Attended
            </label>
            <select
              value={data.orientationAttended || ''}
              onChange={(e) => updateField('orientationAttended', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="scheduled">Scheduled</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Has the student attended pre-departure briefing?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country Rules Explained
            </label>
            <select
              value={data.countryRulesExplained || ''}
              onChange={(e) => updateField('countryRulesExplained', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="partial">Partial</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Have laws, work rules, and norms been explained?</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University Reporting Instructions Shared
            </label>
            <select
              value={data.reportingInstructionsShared || ''}
              onChange={(e) => updateField('reportingInstructionsShared', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Does the student know when/where to report?</p>
          </div>
        </div>
      </section>

      {/* E. Packing & Preparation */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Backpack className="size-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Packing & Preparation</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Packing Guidance Shared
            </label>
            <select
              value={data.packingGuidanceShared || ''}
              onChange={(e) => updateField('packingGuidanceShared', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Has packing guidance been discussed?</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restricted Items Explained
            </label>
            <select
              value={data.restrictedItemsExplained || ''}
              onChange={(e) => updateField('restrictedItemsExplained', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Has the student been informed of prohibited items?</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weather Awareness
            </label>
            <select
              value={data.weatherAwareness || ''}
              onChange={(e) => updateField('weatherAwareness', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Is the student aware of destination weather?</p>
          </div>
        </div>
      </section>

      {/* F. Notes */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="size-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Notes</h3>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pre-Departure Notes
          </label>
          <textarea
            value={data.preDepartureNotes || ''}
            onChange={(e) => updateField('preDepartureNotes', e.target.value)}
            rows={4}
            placeholder="Special instructions or concerns before travel..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">Special instructions or concerns before travel.</p>
        </div>
      </section>
    </div>
  );
}
