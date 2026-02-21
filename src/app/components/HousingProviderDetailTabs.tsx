/**
 * HOUSING PROVIDER DETAIL TABS - REFINED OVERVIEW
 * 
 * Complete implementation matching Forex/Food design system:
 * - Clean read-only layout
 * - NO internal edit buttons
 * - Consistent card spacing, typography, and colors
 * - 5 structured sections
 */

import React, { useState } from 'react';
import {
  Edit3,
  Save,
  X,
  Home,
  MapPin,
  Globe,
  DollarSign,
  Shield,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Building,
  Key,
  Map,
  Target,
  Eye,
  EyeOff,
  Flag,
  Zap,
  Clock,
  HeadphonesIcon,
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
import type {
  HousingProviderData,
  CityListing,
  PricingFees,
  EligibilityRules,
  JourneyStep,
  ActivityLogEntry,
} from './HousingProviderDetail';

// ============================================
// OVERVIEW TAB - REFINED
// ============================================

interface OverviewTabProps {
  providerData: HousingProviderData;
  setProviderData: (data: HousingProviderData) => void;
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

export const HousingOverviewTab: React.FC<OverviewTabProps> = ({
  providerData,
  setProviderData,
  addActivityLog,
  userRole,
}) => {
  // Calculate coverage metrics
  const totalCountries = providerData.cityCoverage
    ? new Set(providerData.cityCoverage.map((c: CityListing) => c.country)).size
    : 5;
  const totalCities = providerData.cityCoverage?.length || 12;
  const totalActiveListings = providerData.cityCoverage
    ? providerData.cityCoverage.reduce((sum: number, city: CityListing) => sum + city.listingCount, 0)
    : 45;
  const avgMonthlyRent =
    providerData.cityCoverage && providerData.cityCoverage.length > 0
      ? providerData.cityCoverage.reduce((sum: number, city: CityListing) => sum + city.avgRent, 0) /
      providerData.cityCoverage.length
      : 1250;
  const instantBookingEnabled = providerData.bookingModel === 'Instant';

  return (
    <div className="space-y-6">
      {/* SECTION 1: PROVIDER INFORMATION */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#253154] mb-4">
          Provider Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">
                Provider Name
              </div>
              <div className="text-sm font-bold text-gray-900">
                {providerData.name}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">
                Housing Type
              </div>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold inline-block">
                {providerData.housingType}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">
                Booking Model
              </div>
              <span
                className={`px-3 py-1.5 border rounded-lg text-sm font-semibold inline-block ${providerData.bookingModel === 'Instant'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : providerData.bookingModel === 'Request'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
              >
                {providerData.bookingModel}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">
                Payment Handled By
              </div>
              <div className="text-sm font-bold text-gray-900">
                {providerData.paymentHandledBy}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">
                Description
              </div>
              <p className="text-sm text-gray-900 leading-relaxed">
                {providerData.description}
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">
                Cancellation Policy
              </div>
              <p className="text-sm text-gray-700">
                {providerData.cancellationSummary}
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">
                Support Escalation Flow
              </div>
              <p className="text-sm text-gray-700">
                {providerData.supportEscalation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: COVERAGE SNAPSHOT - METRIC CARDS */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
          Coverage Snapshot
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total Countries */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">
                Total Countries
              </span>
              <Globe size={16} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              {totalCountries}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} />
              +2
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              vs last month
            </div>
          </div>

          {/* Total Cities */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">
                Total Cities
              </span>
              <Building size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              {totalCities}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} />
              +3
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              New markets added
            </div>
          </div>

          {/* Total Active Listings */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">
                Active Listings
              </span>
              <Home size={16} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              {totalActiveListings}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} />
              +8.5%
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Total available units
            </div>
          </div>

          {/* Average Monthly Rent */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">
                Avg Monthly Rent
              </span>
              <DollarSign size={16} className="text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              ${avgMonthlyRent.toFixed(0)}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <TrendingUp size={12} />
              +3.2%
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Across all locations
            </div>
          </div>

          {/* Instant Booking Enabled */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">
                Instant Booking
              </span>
              <Zap size={16} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              {instantBookingEnabled ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded">
                  Yes
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm font-bold rounded">
                  No
                </span>
              )}
            </div>
            <div className="text-xs text-gray-600">Quick confirmations</div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Booking automation
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: OPERATIONAL SETTINGS */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#253154] mb-4">
          Operational Settings
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Contract Type
            </div>
            <div className="text-sm font-bold text-gray-900">Commission</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Commission %
            </div>
            <div className="text-sm font-bold text-gray-900">15%</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-1">
              VAT Handling
            </div>
            <div className="text-sm font-bold text-gray-900">Included</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Refund Processed By
            </div>
            <div className="text-sm font-bold text-gray-900">Platform</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg col-span-2">
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Deposit Handling
            </div>
            <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-semibold inline-block">
              Required
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: COMPLIANCE & SAFETY */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#253154] mb-4">
          Compliance & Safety
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Background Verification Required */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield size={18} className="text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Background Verification
              </span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
              Required
            </span>
          </div>

          {/* KYC Level */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle size={18} className="text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                KYC Level
              </span>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
              Enhanced
            </span>
          </div>

          {/* Insurance Coverage */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield size={18} className="text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Insurance Coverage
              </span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
              Yes
            </span>
          </div>

          {/* Student Protection Policy */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Users size={18} className="text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Student Protection
              </span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
              Active
            </span>
          </div>
        </div>

        {/* Student Protection Policy Text */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs font-semibold text-blue-900 mb-2">
            Student Protection Policy
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            Full security deposit protection with escrow handling, 24/7
            emergency support, legal assistance coverage, and dispute resolution
            services. Students are covered for property damages, rental
            disputes, and early termination scenarios.
          </p>
        </div>
      </div>

      {/* SECTION 5: SERVICE SLA */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#253154] mb-4">
          Service SLA
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Avg Response Time
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-gray-900">
                &lt; 2 hours
              </span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Emergency Support
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-emerald-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                Yes
              </span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Escalation Time
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <span className="text-sm font-bold text-gray-900">
                &lt; 24 hours
              </span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Dedicated Account Manager
            </div>
            <div className="flex items-center gap-2">
              <HeadphonesIcon size={16} className="text-purple-600" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                Yes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LISTINGS & COVERAGE TAB
// ============================================

// ... (rest of tabs remain unchanged)