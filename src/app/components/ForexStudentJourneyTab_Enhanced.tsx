/**
 * FOREX STUDENT JOURNEY TAB - FULL FUNCTIONALITY
 * 
 * Features:
 * - Drag-and-drop reordering
 * - Complete CRUD operations
 * - Conditional visibility rules
 * - Step configuration modal
 * - Activity logging
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Edit3,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Settings,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import type { AuditLogEntry } from './common/ServiceProviderLogsTab';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface ReadOnlyTabProps {
  providerId: string;
  addActivityLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  trigger: 'Manual' | 'API' | 'System';
  estimatedTime: string;
  requiredDocs: string[];
  failureMessage: string;
  enabled: boolean;
  order: number;
  conditions?: {
    countries?: string[];
    minAmount?: number;
    maxAmount?: number;
    studentTypes?: string[];
  };
}

// Draggable Step Component
const DraggableJourneyStep: React.FC<{
  step: JourneyStep;
  index: number;
  canEdit: boolean;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (step: JourneyStep) => void;
  onToggle: (stepId: string) => void;
  onDelete: (stepId: string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}> = ({ step, index, canEdit, onMove, onEdit, onToggle, onDelete, expanded, onToggleExpand }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'journey-step',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: canEdit,
  });

  const [, drop] = useDrop({
    accept: 'journey-step',
    hover(item: { index: number }) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl border-2 transition-all ${
        isDragging ? 'border-purple-300 opacity-50' : 'border-gray-200 hover:border-gray-300'
      } ${!step.enabled ? 'opacity-60' : ''}`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {canEdit && (
            <div className="cursor-move mt-1">
              <GripVertical size={20} className="text-gray-400" />
            </div>
          )}

          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex-shrink-0">
            {step.order}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#253154] mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={onToggleExpand}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <Switch
                  checked={step.enabled}
                  onCheckedChange={() => onToggle(step.id)}
                  disabled={!canEdit}
                />

                {canEdit && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(step)}>
                      <Edit3 size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(step.id)} className="text-red-600">
                      <Trash2 size={14} />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Compact Info */}
            {!expanded && (
              <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {step.estimatedTime}
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold">
                  {step.trigger}
                </span>
                {step.requiredDocs.length > 0 && (
                  <span className="flex items-center gap-1">
                    <FileText size={12} />
                    {step.requiredDocs.length} docs
                  </span>
                )}
              </div>
            )}

            {/* Expanded Details */}
            {expanded && (
              <div className="mt-4 space-y-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-1">Trigger</div>
                    <div className="text-sm text-gray-900 px-2 py-1 bg-blue-50 rounded inline-block">
                      {step.trigger}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-1">Estimated Time</div>
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock size={14} />
                      {step.estimatedTime}
                    </div>
                  </div>
                </div>

                {step.requiredDocs.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-1">Required Documents</div>
                    <div className="flex flex-wrap gap-2">
                      {step.requiredDocs.map((doc, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {step.failureMessage && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-1">Failure Message</div>
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
                      <AlertCircle size={14} className="inline mr-1" />
                      {step.failureMessage}
                    </div>
                  </div>
                )}

                {step.conditions && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-1">Visibility Conditions</div>
                    <div className="space-y-2">
                      {step.conditions.countries && step.conditions.countries.length > 0 && (
                        <div className="text-sm text-gray-700">
                          Countries: {step.conditions.countries.join(', ')}
                        </div>
                      )}
                      {step.conditions.minAmount && (
                        <div className="text-sm text-gray-700">
                          Min Amount: ${step.conditions.minAmount}
                        </div>
                      )}
                      {step.conditions.maxAmount && (
                        <div className="text-sm text-gray-700">
                          Max Amount: ${step.conditions.maxAmount}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForexStudentJourneyTab: React.FC<ReadOnlyTabProps> = ({
  providerId,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';

  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([
    {
      id: 'step-1',
      title: 'Select Currency & Amount',
      description: 'Student browses providers and selects transfer details',
      trigger: 'Manual',
      estimatedTime: '2 mins',
      requiredDocs: [],
      failureMessage: 'Currency pair not supported',
      enabled: true,
      order: 1,
      conditions: {
        countries: ['All'],
      },
    },
    {
      id: 'step-2',
      title: 'Identity Verification (KYC)',
      description: 'Complete KYC verification if required',
      trigger: 'System',
      estimatedTime: '10 mins',
      requiredDocs: ['Passport', 'Proof of Address', 'Student ID'],
      failureMessage: 'KYC verification failed. Please check your documents.',
      enabled: true,
      order: 2,
      conditions: {
        minAmount: 1000,
      },
    },
    {
      id: 'step-3',
      title: 'Rate Confirmation',
      description: 'Review and lock exchange rate for the transfer',
      trigger: 'API',
      estimatedTime: '1 min',
      requiredDocs: [],
      failureMessage: 'Rate expired. Please refresh.',
      enabled: true,
      order: 3,
    },
    {
      id: 'step-4',
      title: 'Payment Initiation',
      description: 'Student initiates payment via selected method',
      trigger: 'Manual',
      estimatedTime: '5 mins',
      requiredDocs: [],
      failureMessage: 'Payment failed. Please try another method.',
      enabled: true,
      order: 4,
    },
    {
      id: 'step-5',
      title: 'Transfer Processing',
      description: 'Transfer is being processed by the provider',
      trigger: 'API',
      estimatedTime: '1-2 hours',
      requiredDocs: [],
      failureMessage: 'Transfer delayed. Contact support.',
      enabled: true,
      order: 5,
    },
    {
      id: 'step-6',
      title: 'Completion & Receipt',
      description: 'Transfer completed successfully, receipt generated',
      trigger: 'System',
      estimatedTime: 'Instant',
      requiredDocs: [],
      failureMessage: '',
      enabled: true,
      order: 6,
    },
  ]);

  const [editingStep, setEditingStep] = useState<JourneyStep | null>(null);
  const [showStepModal, setShowStepModal] = useState(false);
  const [deletingStepId, setDeletingStepId] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    const key = `forex_journey_${providerId}`;
    localStorage.setItem(key, JSON.stringify(journeySteps));
  }, [journeySteps, providerId]);

  // Handlers
  const handleMoveStep = (dragIndex: number, hoverIndex: number) => {
    const updatedSteps = [...journeySteps];
    const [draggedStep] = updatedSteps.splice(dragIndex, 1);
    updatedSteps.splice(hoverIndex, 0, draggedStep);

    // Update order numbers
    const reorderedSteps = updatedSteps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));

    setJourneySteps(reorderedSteps);

    addActivityLog({
      user: 'Current Admin',
      action: 'Reordered',
      entity: 'Journey Steps',
      entityId: providerId,
      changes: `Reordered journey steps`,
      metadata: { section: 'Student Journey' },
    });
  };

  const handleAddStep = () => {
    setEditingStep({
      id: `step-${Date.now()}`,
      title: '',
      description: '',
      trigger: 'Manual',
      estimatedTime: '',
      requiredDocs: [],
      failureMessage: '',
      enabled: true,
      order: journeySteps.length + 1,
    });
    setShowStepModal(true);
  };

  const handleEditStep = (step: JourneyStep) => {
    setEditingStep({ ...step });
    setShowStepModal(true);
  };

  const handleSaveStep = () => {
    if (!editingStep) return;

    const isNew = !journeySteps.find(s => s.id === editingStep.id);

    if (isNew) {
      setJourneySteps([...journeySteps, editingStep]);
      addActivityLog({
        user: 'Current Admin',
        action: 'Created',
        entity: 'Journey Step',
        entityId: editingStep.id,
        changes: `Added new step: ${editingStep.title}`,
        metadata: { section: 'Student Journey' },
      });
      toast.success('Journey step added successfully');
    } else {
      setJourneySteps(journeySteps.map(s => s.id === editingStep.id ? editingStep : s));
      addActivityLog({
        user: 'Current Admin',
        action: 'Updated',
        entity: 'Journey Step',
        entityId: editingStep.id,
        changes: `Updated step: ${editingStep.title}`,
        metadata: { section: 'Student Journey' },
      });
      toast.success('Journey step updated successfully');
    }

    setShowStepModal(false);
    setEditingStep(null);
  };

  const handleToggleStep = (stepId: string) => {
    setJourneySteps(journeySteps.map(s =>
      s.id === stepId ? { ...s, enabled: !s.enabled } : s
    ));

    const step = journeySteps.find(s => s.id === stepId);
    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'Journey Step',
      entityId: stepId,
      changes: `${step?.enabled ? 'Disabled' : 'Enabled'} step: ${step?.title}`,
      metadata: { section: 'Student Journey' },
    });
    toast.success(`Step ${step?.enabled ? 'disabled' : 'enabled'}`);
  };

  const handleDeleteStep = (stepId: string) => {
    const step = journeySteps.find(s => s.id === stepId);
    if (!step) return;

    const updatedSteps = journeySteps
      .filter(s => s.id !== stepId)
      .map((s, index) => ({ ...s, order: index + 1 }));

    setJourneySteps(updatedSteps);

    addActivityLog({
      user: 'Current Admin',
      action: 'Deleted',
      entity: 'Journey Step',
      entityId: stepId,
      changes: `Deleted step: ${step.title}`,
      metadata: { section: 'Student Journey' },
    });

    toast.success('Journey step deleted successfully');
    setDeletingStepId(null);
  };

  const handleToggleExpand = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    setExpandedSteps(new Set(journeySteps.map(s => s.id)));
  };

  const handleCollapseAll = () => {
    setExpandedSteps(new Set());
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#253154]">Student Journey Configuration</h2>
            <p className="text-sm text-gray-600">
              Define the step-by-step transfer flow for students. Drag to reorder steps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previewMode ? handleCollapseAll : handleExpandAll}
            >
              {expandedSteps.size === journeySteps.length ? 'Collapse All' : 'Expand All'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye size={14} className="mr-2" />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </Button>

            {canEdit && (
              <Button size="sm" onClick={handleAddStep} className="bg-[#0e042f] hover:bg-[#1a0a4a]">
                <Plus size={14} className="mr-2" />
                Add Step
              </Button>
            )}
          </div>
        </div>

        {/* Journey Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-600 mb-1">Total Steps</div>
            <div className="text-2xl font-bold text-[#253154]">{journeySteps.length}</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-600 mb-1">Enabled Steps</div>
            <div className="text-2xl font-bold text-emerald-600">
              {journeySteps.filter(s => s.enabled).length}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-600 mb-1">Avg Completion</div>
            <div className="text-2xl font-bold text-blue-600">2.1 hrs</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-600 mb-1">Success Rate</div>
            <div className="text-2xl font-bold text-purple-600">94.5%</div>
          </div>
        </div>

        {/* Journey Steps */}
        {previewMode ? (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-base font-bold text-[#253154] mb-4">Student View Preview</h3>
            <div className="space-y-4">
              {journeySteps
                .filter(s => s.enabled)
                .map((step, index) => (
                  <div key={step.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {step.estimatedTime}
                          </span>
                          {step.requiredDocs.length > 0 && (
                            <span className="flex items-center gap-1">
                              <FileText size={12} />
                              {step.requiredDocs.length} documents required
                            </span>
                          )}
                        </div>
                      </div>
                      <CheckCircle size={20} className="text-gray-300" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {journeySteps.map((step, index) => (
              <DraggableJourneyStep
                key={step.id}
                step={step}
                index={index}
                canEdit={canEdit}
                onMove={handleMoveStep}
                onEdit={handleEditStep}
                onToggle={handleToggleStep}
                onDelete={(id) => setDeletingStepId(id)}
                expanded={expandedSteps.has(step.id)}
                onToggleExpand={() => handleToggleExpand(step.id)}
              />
            ))}
          </div>
        )}

        {/* Step Edit Modal */}
        <Dialog open={showStepModal} onOpenChange={setShowStepModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStep?.title ? 'Edit Journey Step' : 'Add New Journey Step'}</DialogTitle>
              <DialogDescription>Configure step details, triggers, and conditions</DialogDescription>
            </DialogHeader>

            {editingStep && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Step Title</label>
                    <Input
                      value={editingStep.title}
                      onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                      placeholder="e.g., Identity Verification"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
                    <textarea
                      value={editingStep.description}
                      onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                      placeholder="Describe what happens in this step"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 outline-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Trigger</label>
                    <Select
                      value={editingStep.trigger}
                      onValueChange={(v: any) => setEditingStep({ ...editingStep, trigger: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="API">API</SelectItem>
                        <SelectItem value="System">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Estimated Time</label>
                    <Input
                      value={editingStep.estimatedTime}
                      onChange={(e) => setEditingStep({ ...editingStep, estimatedTime: e.target.value })}
                      placeholder="e.g., 10 mins"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Required Documents (comma-separated)</label>
                    <Input
                      value={editingStep.requiredDocs.join(', ')}
                      onChange={(e) => setEditingStep({
                        ...editingStep,
                        requiredDocs: e.target.value.split(',').map(d => d.trim()).filter(Boolean)
                      })}
                      placeholder="e.g., Passport, Proof of Address"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Failure Message</label>
                    <Input
                      value={editingStep.failureMessage}
                      onChange={(e) => setEditingStep({ ...editingStep, failureMessage: e.target.value })}
                      placeholder="Message shown if this step fails"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Visibility Conditions (Optional)</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Min Amount ($)</label>
                      <Input
                        type="number"
                        value={editingStep.conditions?.minAmount || ''}
                        onChange={(e) => setEditingStep({
                          ...editingStep,
                          conditions: {
                            ...editingStep.conditions,
                            minAmount: parseFloat(e.target.value) || undefined
                          }
                        })}
                        placeholder="No minimum"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Max Amount ($)</label>
                      <Input
                        type="number"
                        value={editingStep.conditions?.maxAmount || ''}
                        onChange={(e) => setEditingStep({
                          ...editingStep,
                          conditions: {
                            ...editingStep.conditions,
                            maxAmount: parseFloat(e.target.value) || undefined
                          }
                        })}
                        placeholder="No maximum"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={editingStep.enabled}
                      onCheckedChange={(checked) => setEditingStep({ ...editingStep, enabled: checked })}
                    />
                    <span className="text-sm font-semibold text-gray-700">Enabled</span>
                  </label>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStepModal(false)}>Cancel</Button>
              <Button onClick={handleSaveStep} className="bg-[#0e042f] hover:bg-[#1a0a4a]">
                Save Step
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingStepId} onOpenChange={() => setDeletingStepId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                Confirm Deletion
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this journey step? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingStepId(null)}>Cancel</Button>
              <Button
                onClick={() => deletingStepId && handleDeleteStep(deletingStepId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Step
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
};
