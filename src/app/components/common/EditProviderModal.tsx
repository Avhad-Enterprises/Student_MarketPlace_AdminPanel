/**
 * EDIT PROVIDER MODAL
 * Universal modal for editing basic provider information
 * Used across ALL service detail pages for consistency
 */

import React, { useState } from 'react';
import { X, Building2, Globe, MapPin, User, Mail, Phone, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

export interface EditProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProviderBasicData) => void;
  serviceType: string; // "Bank", "Insurance", "SIM Card", etc.
  initialData: ProviderBasicData;
}

export interface ProviderBasicData {
  providerName: string;
  legalName?: string;
  headquarters?: string;
  supportedCountries: string[];
  partnerType: string; // read-only
  accountManager?: string;
  supportEmail: string;
  supportPhone?: string;
}

export const EditProviderModal: React.FC<EditProviderModalProps> = ({
  open,
  onOpenChange,
  onSave,
  serviceType,
  initialData,
}) => {
  const [formData, setFormData] = useState<ProviderBasicData>(initialData);
  const [countryInput, setCountryInput] = useState('');

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const addCountry = () => {
    if (countryInput.trim() && !formData.supportedCountries.includes(countryInput.trim())) {
      setFormData({
        ...formData,
        supportedCountries: [...formData.supportedCountries, countryInput.trim()],
      });
      setCountryInput('');
    }
  };

  const removeCountry = (country: string) => {
    setFormData({
      ...formData,
      supportedCountries: formData.supportedCountries.filter((c) => c !== country),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Edit {serviceType} Provider Basics
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update basic provider information. Advanced settings are available in the Settings tab.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Provider Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Provider Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.providerName}
                onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="e.g., Chase Bank"
              />
            </div>
          </div>

          {/* Legal Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Legal Name (Optional)
            </label>
            <input
              type="text"
              value={formData.legalName || ''}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="e.g., JPMorgan Chase Bank, N.A."
            />
          </div>

          {/* Row: Headquarters + Partner Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Headquarters */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Headquarters (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.headquarters || ''}
                  onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="e.g., New York, USA"
                />
              </div>
            </div>

            {/* Partner Type (Read-Only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                Partner Type
                <Lock className="w-3 h-3" />
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium">
                {formData.partnerType}
              </div>
              <div className="text-xs text-gray-500 mt-1">Read-only</div>
            </div>
          </div>

          {/* Supported Countries */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Supported Countries
            </label>
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={countryInput}
                  onChange={(e) => setCountryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCountry())}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Type country name and press Enter"
                />
              </div>
              <button
                onClick={addCountry}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.supportedCountries.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium"
                >
                  <span>{country}</span>
                  <button
                    onClick={() => removeCountry(country)}
                    className="hover:text-purple-900 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Account Manager */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Account Manager (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.accountManager || ''}
                onChange={(e) => setFormData({ ...formData, accountManager: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="e.g., John Smith"
              />
            </div>
          </div>

          {/* Row: Support Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Support Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Support Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="support@example.com"
                />
              </div>
            </div>

            {/* Support Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Support Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.supportPhone || ''}
                  onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.providerName || !formData.supportEmail}
            className="px-6 py-2.5 bg-[#253154] hover:bg-[#1a0a4a] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
