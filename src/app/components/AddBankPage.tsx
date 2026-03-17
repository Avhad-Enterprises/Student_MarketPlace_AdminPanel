"use client";

import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, Save, Building2, Globe, CreditCard, DollarSign, Smartphone, Users, Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createBank } from '@/app/services/banksService';

interface AddBankPageProps {
  onNavigate?: (page: string) => void;
}

export const AddBankPage: React.FC<AddBankPageProps> = ({ onNavigate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bank_id: '',
    bank_name: '',
    account_type: '',
    countries_covered: 0,
    status: 'active' as 'active' | 'inactive',
    student_visible: true,
    min_balance: '',
    digital_onboarding: true,
    student_friendly: true,
    popularity: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bank_name.trim()) {
      newErrors.bank_name = 'Bank name is required';
    }

    if (!formData.account_type.trim()) {
      newErrors.account_type = 'Account type is required';
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

      await createBank(submittableData);
      toast.success('Bank added successfully');
      setIsSubmitting(false);
      onNavigate?.('services-banks'); // Navigate back
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to add bank";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = formData.bank_name.trim() !== '' || formData.account_type.trim() !== '' || formData.bank_id.trim() !== '';
    if (hasChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) return;
    }
    onNavigate?.('services-banks');
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
            <span className="font-medium text-sm sm:text-base">Back to Banks</span>
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-[32px] font-bold text-[#0f172b] mb-1 sm:mb-2">Add New Bank</h1>
              <p className="text-sm sm:text-base text-[#62748e]">Enter the details of the new banking partner to add it to the services list.</p>
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
                    Add Bank
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
                  <Building2 size={16} className="text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-[#0f172b]">General Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank_id">Reference ID</Label>
                    <Input
                      id="bank_id"
                      value={formData.bank_id}
                      onChange={(e) => handleChange('bank_id', e.target.value)}
                      placeholder="e.g. BNK-001 (Auto-generated)"
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Bank Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="bank_name"
                      value={formData.bank_name}
                      onChange={(e) => handleChange('bank_name', e.target.value)}
                      placeholder="e.g. HSBC International"
                      className={`rounded-xl h-11 ${errors.bank_name ? 'border-red-500' : ''}`}
                    />
                    {errors.bank_name && (
                      <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.bank_name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_type">Account Type <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="account_type"
                      value={formData.account_type}
                      onChange={(e) => handleChange('account_type', e.target.value)}
                      placeholder="e.g. Student Savings Account"
                      className={`rounded-xl h-11 pl-9 ${errors.account_type ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.account_type && (
                    <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.account_type}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Globe size={16} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-[#0f172b]">Account Details</h2>
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
                  <Label htmlFor="min_balance">Minimum Balance</Label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="min_balance"
                      value={formData.min_balance}
                      onChange={(e) => handleChange('min_balance', e.target.value)}
                      className="rounded-xl h-11 pl-9"
                      placeholder="e.g. $100"
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

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-[#0f172b] mb-4">Features</h2>

              <div className="space-y-3">
                {/* Digital Onboarding */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Smartphone className="text-blue-600" size={18} />
                    <div>
                      <div className="text-xs font-bold text-gray-700">Digital Onboarding</div>
                      <div className="text-[10px] text-gray-500">Online application</div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.digital_onboarding}
                    onCheckedChange={(val) => handleChange('digital_onboarding', val)}
                  />
                </div>

                {/* Student Friendly */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users className="text-amber-600" size={18} />
                    <div>
                      <div className="text-xs font-bold text-gray-700">Student Friendly</div>
                      <div className="text-[10px] text-gray-500">Special student offers</div>
                    </div>
                  </div>
                  <Switch
                    checked={formData.student_friendly}
                    onCheckedChange={(val) => handleChange('student_friendly', val)}
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
