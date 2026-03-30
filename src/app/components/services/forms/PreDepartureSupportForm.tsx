import React from 'react';
import { DateInput } from '../../ui/date-input';
import { CustomSelect } from '../../common/CustomSelect';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Plane, Home, Shield, GraduationCap, Backpack, FileText } from 'lucide-react';

interface PreDepartureSupportFormProps {
  data: any;
  onChange: (data: any) => void;
}

export function PreDepartureSupportForm({ data, onChange }: PreDepartureSupportFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
      <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
        <Icon size={18} />
      </div>
      <h3 className="text-lg font-bold text-[#253154] tracking-tight">{title}</h3>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* A. Travel Readiness */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Plane} title="Travel Readiness" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <DateInput
              label="Planned Travel Date"
              value={data.plannedTravelDate || ''}
              onValueChange={(value) => updateField('plannedTravelDate', value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Flight Booked</Label>
            <CustomSelect
              value={data.flightBooked || ''}
              onChange={(value) => updateField('flightBooked', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "in-progress", label: "In Progress" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Airline Name</Label>
            <Input
              value={data.airlineName || ''}
              onChange={(e) => updateField('airlineName', e.target.value)}
              placeholder="e.g., Emirates, British Airways"
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Departure Airport</Label>
            <Input
              value={data.departureAirport || ''}
              onChange={(e) => updateField('departureAirport', e.target.value)}
              placeholder="e.g., Delhi (DEL), Mumbai (BOM)"
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Arrival Airport</Label>
            <Input
              value={data.arrivalAirport || ''}
              onChange={(e) => updateField('arrivalAirport', e.target.value)}
              placeholder="e.g., London Heathrow (LHR), Toronto (YYZ)"
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>
        </div>
      </section>

      {/* B. Accommodation Planning */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Home} title="Accommodation Planning" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Accommodation Type</Label>
            <CustomSelect
              value={data.accommodationType || ''}
              onChange={(value) => updateField('accommodationType', value)}
              options={[
                { value: "university-housing", label: "University Housing" },
                { value: "private", label: "Private" },
                { value: "temporary", label: "Temporary" },
                { value: "with-relatives", label: "With Relatives" }
              ]}
              placeholder="Select type"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Accommodation Confirmed</Label>
            <CustomSelect
              value={data.accommodationConfirmed || ''}
              onChange={(value) => updateField('accommodationConfirmed', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "pending", label: "Pending" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address Available</Label>
            <CustomSelect
              value={data.addressAvailable || ''}
              onChange={(value) => updateField('addressAvailable', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "partial", label: "Partial" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Initial Stay Duration</Label>
            <Input
              value={data.initialStayDuration || ''}
              onChange={(e) => updateField('initialStayDuration', e.target.value)}
              placeholder="e.g., 6 months, 1 year"
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all"
            />
          </div>
        </div>
      </section>

      {/* C. Essential Setup Before Travel */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Shield} title="Essential Setup Before Travel" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Travel Insurance Arranged</Label>
            <CustomSelect
              value={data.travelInsuranceArranged || ''}
              onChange={(value) => updateField('travelInsuranceArranged', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "in-progress", label: "In Progress" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Forex / International Card Ready</Label>
            <CustomSelect
              value={data.forexCardReady || ''}
              onChange={(value) => updateField('forexCardReady', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "in-progress", label: "In Progress" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Important Documents Collected</Label>
            <CustomSelect
              value={data.importantDocsCollected || ''}
              onChange={(value) => updateField('importantDocsCollected', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "partial", label: "Partial" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emergency Contact Shared</Label>
            <CustomSelect
              value={data.emergencyContactShared || ''}
              onChange={(value) => updateField('emergencyContactShared', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" }
              ]}
              placeholder="Select status"
            />
          </div>
        </div>
      </section>

      {/* D. Pre-Departure Orientation */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={GraduationCap} title="Pre-Departure Orientation" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orientation Session Attended</Label>
            <CustomSelect
              value={data.orientationAttended || ''}
              onChange={(value) => updateField('orientationAttended', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "scheduled", label: "Scheduled" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Country Rules Explained</Label>
            <CustomSelect
              value={data.countryRulesExplained || ''}
              onChange={(value) => updateField('countryRulesExplained', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "partial", label: "Partial" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">University Reporting Instructions Shared</Label>
            <CustomSelect
              value={data.reportingInstructionsShared || ''}
              onChange={(value) => updateField('reportingInstructionsShared', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" }
              ]}
              placeholder="Select status"
            />
          </div>
        </div>
      </section>

      {/* E. Packing & Preparation */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Backpack} title="Packing & Preparation" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Packing Guidance Shared</Label>
            <CustomSelect
              value={data.packingGuidanceShared || ''}
              onChange={(value) => updateField('packingGuidanceShared', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Restricted Items Explained</Label>
            <CustomSelect
              value={data.restrictedItemsExplained || ''}
              onChange={(value) => updateField('restrictedItemsExplained', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" }
              ]}
              placeholder="Select status"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Weather Awareness</Label>
            <CustomSelect
              value={data.weatherAwareness || ''}
              onChange={(value) => updateField('weatherAwareness', value)}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" }
              ]}
              placeholder="Select status"
            />
          </div>
        </div>
      </section>

      {/* F. Notes */}
      <section className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100/50 space-y-6">
        <SectionHeader icon={FileText} title="Notes" />
        <div className="space-y-2">
          <Label className="text-xs font-bold text-purple-700 uppercase tracking-wider">Pre-Departure Notes</Label>
          <Textarea
            value={data.preDepartureNotes || ''}
            onChange={(e) => updateField('preDepartureNotes', e.target.value)}
            rows={4}
            placeholder="Special instructions, travel concerns, or specific packing requirements before travel..."
            className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200"
          />
        </div>
      </section>
    </div>
  );
}
