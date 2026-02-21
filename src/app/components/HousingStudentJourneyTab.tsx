/**
 * HOUSING STUDENT JOURNEY TAB - FULLY EDITABLE & CONFIGURABLE
 * 
 * Complete journey management system with:
 * - Ordered step timeline
 * - Full CRUD operations for steps
 * - Edit modal with comprehensive fields
 * - Enable/Disable controls
 * - Reorder capability
 * - Preview mode
 * - Complete activity logging
 */

import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  GripVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  Home,
  Building,
  Shield,
  CreditCard,
  Mail,
  Info,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Play,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import type { ActivityLogEntry } from './HousingProviderDetail';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface JourneyStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  internalNotes?: string;
  stepType: 'Action' | 'Information' | 'Verification' | 'Payment' | 'Support';
  estimatedTimeRange?: string;
  enabled: boolean;
  owner: 'Student' | 'Provider' | 'Platform' | 'Counselor';
  triggerCondition?: string;
  exitCondition?: string;
  slaTime?: string;
  notifications: {
    emailReminder: boolean;
    whatsappPush: boolean;
  };
  warningBanner?: string;
}

interface StudentJourneyTabProps {
  providerId: string;
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

export const HousingStudentJourneyTabEnhanced: React.FC<StudentJourneyTabProps> = ({
  providerId,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';

  // State
  const [steps, setSteps] = useState<JourneyStep[]>([
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Discover & Search',
      description: 'Students search for housing by city, price range, and preferences',
      internalNotes: 'Ensure city filter is prominent',
      stepType: 'Information',
      estimatedTimeRange: '5-15 minutes',
      enabled: true,
      owner: 'Student',
      triggerCondition: 'page_loaded',
      notifications: { emailReminder: false, whatsappPush: false },
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'View Listing',
      description: 'Browse listing details, photos, amenities, and reviews',
      stepType: 'Information',
      estimatedTimeRange: '10-20 minutes',
      enabled: true,
      owner: 'Student',
      triggerCondition: 'listing_clicked',
      notifications: { emailReminder: false, whatsappPush: false },
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Submit Booking Request',
      description: 'Complete booking form with dates and personal information',
      stepType: 'Action',
      estimatedTimeRange: '5-10 minutes',
      enabled: true,
      owner: 'Student',
      triggerCondition: 'book_now_clicked',
      notifications: { emailReminder: true, whatsappPush: false },
      warningBanner: 'High demand city - limited availability',
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Verification / Eligibility Check',
      description: 'Platform verifies student documents and eligibility',
      stepType: 'Verification',
      estimatedTimeRange: '1-2 hours',
      enabled: true,
      owner: 'Platform',
      triggerCondition: 'booking_submitted',
      slaTime: '2 hours',
      notifications: { emailReminder: true, whatsappPush: true },
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Payment / Deposit',
      description: 'Student pays first month rent and security deposit',
      stepType: 'Payment',
      estimatedTimeRange: '5 minutes',
      enabled: true,
      owner: 'Student',
      triggerCondition: 'verification_passed',
      notifications: { emailReminder: true, whatsappPush: true },
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: 'Booking Confirmation',
      description: 'Provider confirms booking and sends lease agreement',
      stepType: 'Action',
      estimatedTimeRange: '1-3 hours',
      enabled: true,
      owner: 'Provider',
      triggerCondition: 'payment_completed',
      slaTime: '3 hours',
      notifications: { emailReminder: true, whatsappPush: true },
    },
    {
      id: 'step-7',
      stepNumber: 7,
      title: 'Pre-Arrival Support',
      description: 'Platform provides move-in instructions and local information',
      stepType: 'Support',
      estimatedTimeRange: '1-7 days before',
      enabled: true,
      owner: 'Platform',
      triggerCondition: 'booking_confirmed',
      notifications: { emailReminder: true, whatsappPush: false },
    },
    {
      id: 'step-8',
      stepNumber: 8,
      title: 'Move-In',
      description: 'Student collects keys and completes move-in inspection',
      stepType: 'Action',
      estimatedTimeRange: '30-60 minutes',
      enabled: true,
      owner: 'Student',
      triggerCondition: 'move_in_date',
      notifications: { emailReminder: true, whatsappPush: true },
    },
    {
      id: 'step-9',
      stepNumber: 9,
      title: 'Post Move-In Support / Issues',
      description: '24/7 support for maintenance requests and emergencies',
      stepType: 'Support',
      estimatedTimeRange: 'Ongoing',
      enabled: true,
      owner: 'Platform',
      triggerCondition: 'move_in_completed',
      notifications: { emailReminder: false, whatsappPush: false },
    },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingStep, setEditingStep] = useState<JourneyStep | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // New step form
  const [newStep, setNewStep] = useState<Partial<JourneyStep>>({
    title: '',
    description: '',
    internalNotes: '',
    stepType: 'Action',
    estimatedTimeRange: '',
    enabled: true,
    owner: 'Student',
    triggerCondition: '',
    exitCondition: '',
    slaTime: '',
    notifications: { emailReminder: false, whatsappPush: false },
    warningBanner: '',
  });

  // Handlers
  const handleAddStep = async () => {
    if (!newStep.title || !newStep.description) {
      toast.error('Title and description are required');
      return;
    }

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const step: JourneyStep = {
        id: `step-${Date.now()}`,
        stepNumber: steps.length + 1,
        title: newStep.title!,
        description: newStep.description!,
        internalNotes: newStep.internalNotes,
        stepType: newStep.stepType!,
        estimatedTimeRange: newStep.estimatedTimeRange,
        enabled: newStep.enabled!,
        owner: newStep.owner!,
        triggerCondition: newStep.triggerCondition,
        exitCondition: newStep.exitCondition,
        slaTime: newStep.slaTime,
        notifications: newStep.notifications!,
        warningBanner: newStep.warningBanner,
      };

      setSteps(prev => [...prev, step]);

      addActivityLog({
        admin: 'Current Admin',
        action: 'Added',
        entity: 'Journey Step',
        summary: `Added journey step: ${step.title}`,
      });

      toast.success('Journey step added successfully');
      setShowAddModal(false);
      setNewStep({
        title: '',
        description: '',
        internalNotes: '',
        stepType: 'Action',
        estimatedTimeRange: '',
        enabled: true,
        owner: 'Student',
        triggerCondition: '',
        exitCondition: '',
        slaTime: '',
        notifications: { emailReminder: false, whatsappPush: false },
        warningBanner: '',
      });
    } catch (error) {
      toast.error('Failed to add journey step');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditStep = async () => {
    if (!editingStep) return;

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const oldStep = steps.find(s => s.id === editingStep.id);

      setSteps(prev => prev.map(s => s.id === editingStep.id ? editingStep : s));

      addActivityLog({
        admin: 'Current Admin',
        action: 'Updated',
        entity: 'Journey Step',
        summary: `Updated journey step: ${editingStep.title}`,
        oldValue: oldStep?.title,
        newValue: editingStep.title,
      });

      toast.success('Journey step updated successfully');
      setShowEditModal(false);
      setEditingStep(null);
    } catch (error) {
      toast.error('Failed to update journey step');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!confirm('Are you sure you want to delete this journey step?')) return;

    const step = steps.find(s => s.id === stepId);
    const updatedSteps = steps
      .filter(s => s.id !== stepId)
      .map((s, index) => ({ ...s, stepNumber: index + 1 }));

    setSteps(updatedSteps);

    addActivityLog({
      admin: 'Current Admin',
      action: 'Deleted',
      entity: 'Journey Step',
      summary: `Deleted journey step: ${step?.title}`,
    });

    toast.success('Journey step deleted successfully');
  };

  const handleToggleEnabled = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    const newEnabled = !step?.enabled;

    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, enabled: newEnabled } : s));

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Journey Step',
      summary: `${newEnabled ? 'Enabled' : 'Disabled'} journey step: ${step?.title}`,
      oldValue: step?.enabled ? 'Enabled' : 'Disabled',
      newValue: newEnabled ? 'Enabled' : 'Disabled',
    });

    toast.success(`Journey step ${newEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(s => s.id === stepId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];

    // Update step numbers
    const reorderedSteps = newSteps.map((s, i) => ({ ...s, stepNumber: i + 1 }));
    setSteps(reorderedSteps);

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Journey Steps',
      summary: `Reordered journey step: ${steps[index].title} moved ${direction}`,
    });

    toast.success('Journey step reordered');
  };

  // Step type icon
  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'Action': return <Play size={16} />;
      case 'Information': return <Info size={16} />;
      case 'Verification': return <Shield size={16} />;
      case 'Payment': return <CreditCard size={16} />;
      case 'Support': return <Users size={16} />;
      default: return <Info size={16} />;
    }
  };

  // Owner icon
  const getOwnerIcon = (owner: string) => {
    switch (owner) {
      case 'Student': return <Users size={16} />;
      case 'Provider': return <Home size={16} />;
      case 'Platform': return <Building size={16} />;
      case 'Counselor': return <Users size={16} />;
      default: return <Users size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Mail size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Journey Configuration</h2>
            <p className="text-sm text-gray-600">Define the complete booking experience for students</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(true)}>
            <Eye size={16} className="mr-2" />
            Preview Journey
          </Button>
          {canEdit && (
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus size={16} className="mr-2" />
              Add Step
            </Button>
          )}
        </div>
      </div>

      {/* Journey Variants Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-blue-900 text-sm mb-1">Journey Variants (Coming Soon)</div>
            <div className="text-xs text-blue-700">
              In the future, you&apos;ll be able to create custom journey flows by City, Country, or Listing Type.
              For now, this journey applies to all listings.
            </div>
          </div>
          <span className="px-2.5 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold">
            Planned
          </span>
        </div>
      </div>

      {/* Journey Steps Timeline */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`relative bg-white rounded-xl border-2 transition-all ${step.enabled ? 'border-gray-200' : 'border-gray-200 opacity-60'
              }`}
          >
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-8 top-full h-4 w-0.5 bg-gray-300 z-0" />
            )}

            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Step Number Badge */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-md ${step.enabled
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}>
                  {step.stepNumber}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        {!step.enabled && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{step.description}</p>
                    </div>

                    {canEdit && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveStep(step.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveStep(step.id, 'down')}
                          disabled={index === steps.length - 1}
                        >
                          <ArrowDown size={14} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                      {getStepTypeIcon(step.stepType)}
                      {step.stepType}
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 rounded-full text-xs font-semibold text-blue-700">
                      {getOwnerIcon(step.owner)}
                      {step.owner}
                    </div>

                    {step.estimatedTimeRange && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded-full text-xs font-semibold text-amber-700">
                        <Clock size={14} />
                        {step.estimatedTimeRange}
                      </div>
                    )}

                    {step.slaTime && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 rounded-full text-xs font-semibold text-red-700">
                        <AlertCircle size={14} />
                        SLA: {step.slaTime}
                      </div>
                    )}

                    {step.notifications.emailReminder && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 rounded-full text-xs font-semibold text-purple-700">
                        <Mail size={14} />
                        Email
                      </div>
                    )}
                  </div>

                  {/* Warning Banner */}
                  {step.warningBanner && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                        <span className="text-sm text-amber-800">{step.warningBanner}</span>
                      </div>
                    </div>
                  )}

                  {/* Internal Notes */}
                  {step.internalNotes && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg mb-3">
                      <div className="text-xs font-semibold text-gray-600 mb-1">Internal Notes:</div>
                      <div className="text-sm text-gray-700">{step.internalNotes}</div>
                    </div>
                  )}

                  {/* Actions */}
                  {canEdit && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingStep(step);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit3 size={14} className="mr-2" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleEnabled(step.id)}
                      >
                        {step.enabled ? (
                          <>
                            <XCircle size={14} className="mr-2" />
                            Disable
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} className="mr-2" />
                            Enable
                          </>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteStep(step.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Step Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Journey Step</DialogTitle>
            <DialogDescription>Create a new step in the student journey</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Step Title *</label>
                <Input
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  placeholder="e.g., Document Upload"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Student-Facing Description *</label>
                <textarea
                  value={newStep.description}
                  onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  placeholder="What the student sees..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Internal Notes (Admin Only)</label>
                <textarea
                  value={newStep.internalNotes}
                  onChange={(e) => setNewStep({ ...newStep, internalNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  placeholder="Notes for internal use only..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Step Type</label>
                <Select value={newStep.stepType} onValueChange={(val: any) => setNewStep({ ...newStep, stepType: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Action">Action</SelectItem>
                    <SelectItem value="Information">Information</SelectItem>
                    <SelectItem value="Verification">Verification</SelectItem>
                    <SelectItem value="Payment">Payment</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Step Owner</label>
                <Select value={newStep.owner} onValueChange={(val: any) => setNewStep({ ...newStep, owner: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Provider">Provider</SelectItem>
                    <SelectItem value="Platform">Platform</SelectItem>
                    <SelectItem value="Counselor">Counselor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Time Range</label>
                <Input
                  value={newStep.estimatedTimeRange}
                  onChange={(e) => setNewStep({ ...newStep, estimatedTimeRange: e.target.value })}
                  placeholder="e.g., 5-10 minutes"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SLA Time (Optional)</label>
                <Input
                  value={newStep.slaTime}
                  onChange={(e) => setNewStep({ ...newStep, slaTime: e.target.value })}
                  placeholder="e.g., 2 hours"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trigger Condition</label>
                <Select
                  value={newStep.triggerCondition}
                  onValueChange={(val) => setNewStep({ ...newStep, triggerCondition: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page_loaded">Page Loaded</SelectItem>
                    <SelectItem value="listing_viewed">Listing Viewed</SelectItem>
                    <SelectItem value="book_now_clicked">Book Now Clicked</SelectItem>
                    <SelectItem value="booking_submitted">Booking Submitted</SelectItem>
                    <SelectItem value="verification_passed">Verification Passed</SelectItem>
                    <SelectItem value="payment_completed">Payment Completed</SelectItem>
                    <SelectItem value="booking_confirmed">Booking Confirmed</SelectItem>
                    <SelectItem value="move_in_date">Move-In Date</SelectItem>
                    <SelectItem value="move_in_completed">Move-In Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exit Condition (Optional)</label>
                <Input
                  value={newStep.exitCondition}
                  onChange={(e) => setNewStep({ ...newStep, exitCondition: e.target.value })}
                  placeholder="e.g., step_completed"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Warning Banner (Optional)</label>
                <Input
                  value={newStep.warningBanner}
                  onChange={(e) => setNewStep({ ...newStep, warningBanner: e.target.value })}
                  placeholder="e.g., High demand city - limited availability"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="font-semibold text-gray-900 mb-3">Notifications</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newStep.notifications?.emailReminder}
                    onCheckedChange={(val) => setNewStep({
                      ...newStep,
                      notifications: { ...newStep.notifications!, emailReminder: val },
                    })}
                  />
                  <span className="text-sm text-gray-700">Email Reminder</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newStep.notifications?.whatsappPush}
                    onCheckedChange={(val) => setNewStep({
                      ...newStep,
                      notifications: { ...newStep.notifications!, whatsappPush: val },
                    })}
                  />
                  <span className="text-sm text-gray-700">WhatsApp/Push Notification (Coming Soon)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch
                checked={newStep.enabled}
                onCheckedChange={(val) => setNewStep({ ...newStep, enabled: val })}
              />
              <span className="text-sm font-semibold text-gray-700">Enable This Step</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleAddStep} disabled={isSaving}>
              {isSaving ? 'Adding...' : 'Add Step'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Step Modal (Similar to Add) */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Journey Step</DialogTitle>
            <DialogDescription>Update step configuration</DialogDescription>
          </DialogHeader>

          {editingStep && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Step Title *</label>
                  <Input
                    value={editingStep.title}
                    onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Student-Facing Description *</label>
                  <textarea
                    value={editingStep.description}
                    onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Step Type</label>
                  <Select value={editingStep.stepType} onValueChange={(val: any) => setEditingStep({ ...editingStep, stepType: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Action">Action</SelectItem>
                      <SelectItem value="Information">Information</SelectItem>
                      <SelectItem value="Verification">Verification</SelectItem>
                      <SelectItem value="Payment">Payment</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Step Owner</label>
                  <Select value={editingStep.owner} onValueChange={(val: any) => setEditingStep({ ...editingStep, owner: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Provider">Provider</SelectItem>
                      <SelectItem value="Platform">Platform</SelectItem>
                      <SelectItem value="Counselor">Counselor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Warning Banner</label>
                  <Input
                    value={editingStep.warningBanner || ''}
                    onChange={(e) => setEditingStep({ ...editingStep, warningBanner: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <Switch
                  checked={editingStep.notifications.emailReminder}
                  onCheckedChange={(val) => setEditingStep({
                    ...editingStep,
                    notifications: { ...editingStep.notifications, emailReminder: val },
                  })}
                />
                <span className="text-sm text-gray-700">Email Reminder</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingStep.enabled}
                  onCheckedChange={(val) => setEditingStep({ ...editingStep, enabled: val })}
                />
                <span className="text-sm font-semibold text-gray-700">Enable This Step</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleEditStep} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Journey Preview</DialogTitle>
            <DialogDescription>How students see the booking journey</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-semibold text-blue-900">Preview Mode - Read Only</div>
              <div className="text-xs text-blue-700 mt-1">This is how the journey appears to students during booking</div>
            </div>

            {steps.filter(s => s.enabled).map((step, index) => (
              <div key={step.id} className="relative">
                {index < steps.filter(s => s.enabled).length - 1 && (
                  <div className="absolute left-4 top-12 h-full w-0.5 bg-blue-200 z-0" />
                )}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{step.title}</div>
                      <div className="text-sm text-gray-700">{step.description}</div>
                      {step.warningBanner && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                          ⚠️ {step.warningBanner}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowPreviewModal(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
