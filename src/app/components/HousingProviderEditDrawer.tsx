/**
 * HOUSING PROVIDER EDIT DRAWER - COMPREHENSIVE MULTI-STEP EDITOR
 * 
 * Primary edit entry point for all provider configuration:
 * - Provider Info
 * - Coverage (Countries/Cities)
 * - Pricing & Fees
 * - Eligibility & Rules
 * - Operations & Integration
 * 
 * Features:
 * - Multi-step wizard interface
 * - Real-time validation
 * - Unsaved changes warning
 * - Complete activity logging
 * - RBAC enforcement
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  AlertCircle,
  Home,
  Globe,
  DollarSign,
  Shield,
  Settings,
  CheckCircle,
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
import type { HousingProviderData, ActivityLogEntry } from './HousingProviderDetail';

interface EditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  providerData: HousingProviderData;
  onSave: (data: HousingProviderData) => void;
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

type EditStep = 'info' | 'coverage' | 'pricing' | 'eligibility' | 'operations';

export const HousingProviderEditDrawer: React.FC<EditDrawerProps> = ({
  isOpen,
  onClose,
  providerData,
  onSave,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';

  const [currentStep, setCurrentStep] = useState<EditStep>('info');
  const [tempData, setTempData] = useState<HousingProviderData>(providerData);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempData(providerData);
      setHasChanges(false);
      setCurrentStep('info');
    }
  }, [isOpen, providerData]);

  useEffect(() => {
    const changed = JSON.stringify(tempData) !== JSON.stringify(providerData);
    setHasChanges(changed);
  }, [tempData, providerData]);

  const steps: Array<{ id: EditStep; label: string; icon: any }> = [
    { id: 'info', label: 'Provider Info', icon: Home },
    { id: 'coverage', label: 'Coverage', icon: Globe },
    { id: 'pricing', label: 'Pricing & Fees', icon: DollarSign },
    { id: 'eligibility', label: 'Eligibility', icon: Shield },
    { id: 'operations', label: 'Operations', icon: Settings },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowUnsavedWarning(true);
    } else {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!canEdit) {
      toast.error('You do not have permission to edit this provider');
      return;
    }

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSave(tempData);

      addActivityLog({
        admin: 'Current Admin',
        action: 'Updated',
        entity: 'Housing Provider',
        summary: `Updated provider configuration: ${providerData.name}`,
      });

      toast.success('Provider updated successfully');
      setHasChanges(false);
      onClose();
    } catch (error) {
      toast.error('Failed to update provider');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTempData(providerData);
    setHasChanges(false);
    toast.info('Changes reset to original values');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <DialogHeader>
              <DialogTitle>Edit Housing Provider</DialogTitle>
              <DialogDescription>Configure provider settings across all modules</DialogDescription>
            </DialogHeader>
          </div>

          {/* Step Navigator */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = index < currentStepIndex;

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-purple-100 text-purple-900'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive
                          ? 'bg-purple-500 text-white'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                      </div>
                      <span className="text-sm font-semibold hidden md:block">{step.label}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {currentStep === 'info' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Provider Information</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Provider Name *</label>
                  <Input
                    value={tempData.name}
                    onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                    placeholder="e.g., Student Housing Global"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Housing Type</label>
                  <Select
                    value={tempData.housingType}
                    onValueChange={(val: any) => setTempData({ ...tempData, housingType: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student Residence">Student Residence</SelectItem>
                      <SelectItem value="Shared Apartment">Shared Apartment</SelectItem>
                      <SelectItem value="Homestay">Homestay</SelectItem>
                      <SelectItem value="Private Room">Private Room</SelectItem>
                      <SelectItem value="Multiple">Multiple Types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={tempData.description}
                    onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={4}
                    placeholder="Brief description of the provider..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Model</label>
                    <Select
                      value={tempData.bookingModel}
                      onValueChange={(val: any) => setTempData({ ...tempData, bookingModel: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instant">Instant Book</SelectItem>
                        <SelectItem value="Request">Request to Book</SelectItem>
                        <SelectItem value="Redirect">Redirect to Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Handled By</label>
                    <Select
                      value={tempData.paymentHandledBy}
                      onValueChange={(val: any) => setTempData({ ...tempData, paymentHandledBy: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Platform">Platform</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cancellation Summary</label>
                  <Input
                    value={tempData.cancellationSummary}
                    onChange={(e) => setTempData({ ...tempData, cancellationSummary: e.target.value })}
                    placeholder="e.g., Free cancellation up to 48 hours before..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Support Escalation</label>
                  <Input
                    value={tempData.supportEscalation}
                    onChange={(e) => setTempData({ ...tempData, supportEscalation: e.target.value })}
                    placeholder="e.g., Live chat → Email → Phone"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <Switch
                    checked={tempData.studentVisibility}
                    onCheckedChange={(val) => setTempData({ ...tempData, studentVisibility: val })}
                  />
                  <span className="text-sm font-semibold text-gray-700">Visible to Students</span>
                </div>
              </div>
            )}

            {currentStep === 'coverage' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Coverage & Locations</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Countries Covered</label>
                  <p className="text-xs text-gray-500 mb-2">Add/remove countries where this provider operates</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tempData.countries.map(country => (
                      <span key={country} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold flex items-center gap-2">
                        {country}
                        <button
                          onClick={() => setTempData({
                            ...tempData,
                            countries: tempData.countries.filter(c => c !== country),
                          })}
                          className="hover:text-purple-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(val) => {
                        if (!tempData.countries.includes(val)) {
                          setTempData({
                            ...tempData,
                            countries: [...tempData.countries, val],
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Add country..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Spain">Spain</SelectItem>
                        <SelectItem value="Netherlands">Netherlands</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cities Covered</label>
                  <p className="text-xs text-gray-500 mb-2">Add/remove specific cities</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tempData.cities.map(city => (
                      <span key={city} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                        {city}
                        <button
                          onClick={() => setTempData({
                            ...tempData,
                            cities: tempData.cities.filter(c => c !== city),
                          })}
                          className="hover:text-blue-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Type city name and press Enter..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const city = input.value.trim();
                        if (city && !tempData.cities.includes(city)) {
                          setTempData({
                            ...tempData,
                            cities: [...tempData.cities, city],
                          });
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4">
                  <div className="text-sm font-semibold text-blue-900 mb-1">Coverage Summary</div>
                  <div className="text-xs text-blue-700">
                    {tempData.countries.length} countries • {tempData.cities.length} cities
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'pricing' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing & Fees Configuration</h3>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-sm font-semibold text-amber-900 mb-1">Note</div>
                  <div className="text-xs text-amber-700">
                    Detailed pricing configuration is available in the Pricing & Fees tab.
                    Use this section for basic pricing model selection.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Integration Type</label>
                  <Select
                    value={tempData.integrationType}
                    onValueChange={(val: any) => setTempData({ ...tempData, integrationType: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="API">API (Automated)</SelectItem>
                      <SelectItem value="Redirect">Redirect to Provider</SelectItem>
                      <SelectItem value="Manual">Manual Entry</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    {tempData.integrationType === 'API' && 'Pricing synced automatically from provider API'}
                    {tempData.integrationType === 'Redirect' && 'Students redirected to provider website for pricing'}
                    {tempData.integrationType === 'Manual' && 'Pricing entered manually in platform'}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 'eligibility' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Eligibility & Rules</h3>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-semibold text-blue-900 mb-1">Note</div>
                  <div className="text-xs text-blue-700">
                    Comprehensive eligibility rules are configured in the Eligibility & Rules tab.
                    Use this section for quick reference only.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Booking Model</div>
                    <div className="text-lg font-bold text-gray-900">{tempData.bookingModel}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Payment Handler</div>
                    <div className="text-lg font-bold text-gray-900">{tempData.paymentHandledBy}</div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'operations' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Operations & Integration</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Provider Status</label>
                  <Select
                    value={tempData.status}
                    onValueChange={(val: any) => setTempData({ ...tempData, status: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    {tempData.status === 'active' && 'Provider is live and accepting bookings'}
                    {tempData.status === 'paused' && 'Temporarily paused - not visible to students'}
                    {tempData.status === 'disabled' && 'Disabled - requires reactivation'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Integration Type</label>
                  <Select
                    value={tempData.integrationType}
                    onValueChange={(val: any) => setTempData({ ...tempData, integrationType: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="API">API Integration</SelectItem>
                      <SelectItem value="Redirect">Redirect</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mt-4">
                  <div className="text-sm font-semibold text-purple-900 mb-1">Advanced Operations</div>
                  <div className="text-xs text-purple-700">
                    For detailed operations settings (sync, webhooks, API credentials), use the Operations tab.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {hasChanges && (
              <div className="flex items-center gap-2 mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle size={16} className="text-amber-600" />
                <span className="text-sm text-amber-800">You have unsaved changes</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                >
                  <ChevronLeft size={16} className="mr-2" />
                  Previous
                </Button>
                {currentStepIndex < steps.length - 1 && (
                  <Button
                    variant="outline"
                    onClick={handleNext}
                  >
                    Next
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!hasChanges || isSaving}
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving || !canEdit}
                >
                  {isSaving ? 'Saving...' : 'Save All Changes'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Warning */}
      <Dialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>You have unsaved changes that will be lost</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to close without saving? All changes will be discarded.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUnsavedWarning(false)}
            >
              Keep Editing
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowUnsavedWarning(false);
                setHasChanges(false);
                onClose();
              }}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};