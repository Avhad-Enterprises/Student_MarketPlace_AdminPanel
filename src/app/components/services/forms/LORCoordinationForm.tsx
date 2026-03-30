import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { CustomSelect } from '../../common/CustomSelect';
import { Users, UserPlus, Info, Mail, Activity } from 'lucide-react';

interface LORCoordinationFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const LORCoordinationForm: React.FC<LORCoordinationFormProps> = ({
  data,
  onChange,
}) => {
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
      {/* A. Requirement Overview */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Info} title="Requirement Overview" />
        <div className="mt-4">
          <div className="space-y-2 max-w-xs transition-all">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Number of LORs Required</Label>
            <Input
              type="number"
              placeholder="e.g., 2 or 3"
              value={data.lorRequiredCount || ''}
              onChange={(e) => updateField('lorRequiredCount', e.target.value)}
              className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all font-medium"
            />
          </div>
        </div>
      </section>

      {/* B. Recommender Details */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={UserPlus} title="Recommender Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recommender Name</Label>
            <div className="relative">
              <Input
                placeholder="e.g., Dr. John Smith"
                value={data.recommenderName || ''}
                onChange={(e) => updateField('recommenderName', e.target.value)}
                className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all pl-9"
              />
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Relationship to Student</Label>
            <CustomSelect
              value={data.recommenderRelationship || ''}
              onChange={(value) => updateField('recommenderRelationship', value)}
              options={[
                { value: "Professor", label: "Professor" },
                { value: "Academic Advisor", label: "Academic Advisor" },
                { value: "Department Head", label: "Department Head" },
                { value: "Direct Manager", label: "Direct Manager" },
                { value: "Senior Colleague", label: "Senior Colleague" },
                { value: "Research Supervisor", label: "Research Supervisor" },
                { value: "Other", label: "Other" }
              ]}
              placeholder="Select relationship"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recommender Email</Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="e.g., john.smith@university.edu"
                value={data.recommenderEmail || ''}
                onChange={(e) => updateField('recommenderEmail', e.target.value)}
                className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-purple-300 transition-all pl-9"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* C. Progress Status */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <SectionHeader icon={Activity} title="Progress Tracking" />
        <div className="mt-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current LOR Status</Label>
            <CustomSelect
              value={data.lorStatus || ''}
              onChange={(value) => updateField('lorStatus', value)}
              options={[
                { value: "Not Requested", label: "Not Requested" },
                { value: "Requested", label: "Requested" },
                { value: "Confirmed", label: "Confirmed" },
                { value: "In Progress", label: "In Progress" },
                { value: "Received", label: "Received" },
                { value: "Needs Follow-up", label: "Needs Follow-up" },
                { value: "Declined", label: "Declined" }
              ]}
              placeholder="Select status"
            />
          </div>
        </div>
      </section>

      {/* D. Additional Notes */}
      <section className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100/50 space-y-6">
        <SectionHeader icon={Info} title="Coordination Notes" />
        <div className="space-y-2">
          <Label className="text-xs font-bold text-purple-700 uppercase tracking-wider">Issues or Follow-ups</Label>
          <Textarea
            rows={5}
            placeholder="Add notes about coordination, follow-ups, or any issues encountered..."
            value={data.coordinationNotes || ''}
            onChange={(e) => updateField('coordinationNotes', e.target.value)}
            className="bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200"
          />
        </div>
      </section>
    </div>
  );
};
