import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';

// Service-specific form imports
import { UniversitySelectionForm } from './forms/UniversitySelectionForm';
import { ProfileEvaluationForm } from './forms/ProfileEvaluationForm';
import { EligibilityReadinessForm } from './forms/EligibilityReadinessForm';
import { CareerOutcomeInsightsForm } from './forms/CareerOutcomeInsightsForm';
import { UniversityShortlistingForm } from './forms/UniversityShortlistingForm';
import { ApplicationStrategyForm } from './forms/ApplicationStrategyForm';
import { SOPReviewEditingForm } from './forms/SOPReviewEditingForm';
import { LORCoordinationForm } from './forms/LORCoordinationForm';
import { ApplicationSubmissionForm } from './forms/ApplicationSubmissionForm';
import { OfferDecisionForm } from './forms/OfferDecisionForm';
import { VisaApplicationAssistanceForm } from './VisaApplicationAssistanceForm';
import { ComplianceRenewalsForm } from './ComplianceRenewalsForm';
import { PreDepartureSupportForm } from './forms/PreDepartureSupportForm';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    name: string;
    status: string;
    description?: string;
    category?: string;
    assignedTo?: string;
    startedOn?: string;
    lastUpdate?: string;
  };
  studentName: string;
  onSave?: (data: any) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  service,
  studentName,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave?.(formData);
    setIsSaving(false);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Not Started':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const renderServiceForm = () => {
    switch (service.name) {
      case 'University Selection Consultation':
        return <UniversitySelectionForm data={formData} onChange={setFormData} />;
      case 'Profile Evaluation':
        return <ProfileEvaluationForm data={formData} onChange={setFormData} />;
      case 'Eligibility & Readiness Check':
        return <EligibilityReadinessForm data={formData} onChange={setFormData} />;
      case 'Career Outcome Insights':
        return <CareerOutcomeInsightsForm data={formData} onChange={setFormData} />;
      case 'University Shortlisting':
        return <UniversityShortlistingForm data={formData} onChange={setFormData} />;
      case 'Application Strategy':
        return <ApplicationStrategyForm data={formData} onChange={setFormData} />;
      case 'SOP Review & Editing':
        return <SOPReviewEditingForm data={formData} onChange={setFormData} />;
      case 'LOR Coordination':
        return <LORCoordinationForm data={formData} onChange={setFormData} />;
      case 'Application Submission Support':
        return <ApplicationSubmissionForm data={formData} onChange={setFormData} />;
      case 'Offer Review & Decision':
        return <OfferDecisionForm data={formData} onChange={setFormData} />;
      case 'Visa Application Assistance':
        return <VisaApplicationAssistanceForm data={formData} onChange={setFormData} />;
      case 'Compliance Renewals':
        return <ComplianceRenewalsForm data={formData} onChange={setFormData} />;
      case 'Pre-Departure Support':
        return <PreDepartureSupportForm data={formData} onChange={setFormData} />;
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            No form available for this service type.
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1100px] h-[90vh] flex flex-col p-0 gap-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900 mb-1">
                {service.name}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-600">Student: {studentName}</span>
                <span className="text-gray-300">•</span>
                <Badge className={getStatusColor(service.status)}>
                  {service.status}
                </Badge>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {renderServiceForm()}
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t border-gray-200 shrink-0">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#253154] hover:bg-[#1a2340] text-white"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};