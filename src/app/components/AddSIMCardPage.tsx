"use client";

import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, Save, Smartphone, Globe, Signal, Database, Clock, Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createSimCard } from '@/app/services/simCardsService';

interface AddSIMCardPageProps {
  onNavigate?: (page: string) => void;
}

export const AddSIMCardPage: React.FC<AddSIMCardPageProps> = ({ onNavigate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sim_id: '',
    provider_name: '',
    service_name: '',
    countries_covered: 0,
    status: 'active' as 'active' | 'inactive',
    student_visible: true,
    network_type: '4G/5G',
    data_allowance: '',
    validity: '',
    popularity: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.provider_name.trim()) {
      newErrors.provider_name = 'Provider name is required';
    }

    if (!formData.service_name.trim()) {
      newErrors.service_name = 'Service name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const submittableData = {
        ...formData,
        countries_covered: Number(formData.countries_covered),
        popularity: Number(formData.popularity)
      };

      await createSimCard(submittableData);
      toast.success('SIM card added successfully');
      setIsSubmitting(false);
      onNavigate?.('services-sim-cards'); // Navigate back
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to add SIM card";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Check if form has unsaved changes
    const hasChanges = formData.provider_name.trim() !== '' || formData.service_name.trim() !== '' || formData.sim_id.trim() !== '';
    if (hasChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) return;
    }
    onNavigate?.('services-sim-cards');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f9fb] custom-scrollbar-light">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-[#62748e] hover:text-[#0f172b] mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium text-sm sm:text-base">Back to SIM Cards</span>
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-[32px] font-bold text-[#0f172b] mb-1 sm:mb-2">Add New SIM Plan</h1>
              <p className="text-sm sm:text-base text-[#62748e]">Enter the details of the new SIM card to add it to the marketplace.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} className="h-12 px-6 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-12 px-6 bg-[#0e042f] hover:bg-[#1a0c4a] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Add SIM Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Smartphone size={16} className="text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-[#0f172b]">General Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sim_id">Reference ID</Label>
                    <Input
                      id="sim_id"
                      value={formData.sim_id}
                      onChange={(e) => handleChange('sim_id', e.target.value)}
                      placeholder="e.g. SIM-001 (Auto-generated)"
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider_name">Provider Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="provider_name"
                      value={formData.provider_name}
                      onChange={(e) => handleChange('provider_name', e.target.value)}
                      placeholder="e.g. Airalo"
                      className={`rounded-xl h-11 ${errors.provider_name ? 'border-red-500' : ''}`}
                    />
                    {errors.provider_name && (
                      <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.provider_name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_name">Service Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="service_name"
                    value={formData.service_name}
                    onChange={(e) => handleChange('service_name', e.target.value)}
                    placeholder="e.g. Europe Travel Pack"
                    className={`rounded-xl h-11 ${errors.service_name ? 'border-red-500' : ''}`}
                  />
                  {errors.service_name && (
                    <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.service_name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Signal size={16} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-[#0f172b]">Plan Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="countries_covered">Countries Covered</Label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="countries_covered"
                      type="number"
                      value={formData.countries_covered}
                      onChange={(e) => handleChange('countries_covered', e.target.value)}
                      className="rounded-xl h-11 pl-9"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network_type">Network Type</Label>
                  <Select value={formData.network_type} onValueChange={(val) => handleChange('network_type', val)}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5G">5G</SelectItem>
                      <SelectItem value="4G/5G">4G/5G</SelectItem>
                      <SelectItem value="4G">4G</SelectItem>
                      <SelectItem value="3G">3G</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_allowance">Data Allowance</Label>
                  <div className="relative">
                    <Database size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="data_allowance"
                      value={formData.data_allowance}
                      onChange={(e) => handleChange('data_allowance', e.target.value)}
                      className="rounded-xl h-11 pl-9"
                      placeholder="e.g. 10GB"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validity">Validity</Label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="validity"
                      value={formData.validity}
                      onChange={(e) => handleChange('validity', e.target.value)}
                      className="rounded-xl h-11 pl-9"
                      placeholder="e.g. 30 Days"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Status & Visibility */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-[#0f172b] mb-4">Status & Visibility</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(val: any) => handleChange('status', val)}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    {formData.student_visible ? <Eye className="text-purple-600" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                    <div>
                      <div className="text-sm font-bold text-gray-700">Visible to Students</div>
                      <div className="text-xs text-gray-500">Toggle in marketplace</div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.student_visible}
                    onCheckedChange={(val) => handleChange('student_visible', val)}
                  />
                </div>
              </div>
            </div>

            {/* Popularity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-[#0f172b] mb-4">Popularity</h2>
              <div className="space-y-2">
                <Label htmlFor="popularity">Popularity Score</Label>
                <div className="relative">
                  <Zap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="popularity"
                    type="number"
                    value={formData.popularity}
                    onChange={(e) => handleChange('popularity', e.target.value)}
                    className="rounded-xl h-11 pl-9"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
