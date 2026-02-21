/**
 * HOUSING ANALYTICS TAB - READ-ONLY WITH ACTIONABLE INSIGHTS
 * 
 * Comprehensive performance dashboard with:
 * - Advanced filters (Date, Country, City, Listing Type, Booking Type, Channel)
 * - 8 KPI cards with metrics
 * - Funnel analytics with conversion tracking
 * - Demand & supply insights
 * - Quality & support metrics
 * - Export functionality
 * - Proper empty states (no fake data when unavailable)
 */

import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  XCircle,
  Download,
  Filter,
  AlertCircle,
  MapPin,
  Home,
  Users,
  Target,
  Activity,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface AnalyticsFilters {
  dateRange: string;
  country: string;
  city: string;
  listingType: string;
  bookingType: string;
  channel: string;
}

interface HousingAnalyticsTabProps {
  providerId: string;
  hasData?: boolean; // Control whether to show data or empty state
}

export const HousingAnalyticsTabEnhanced: React.FC<HousingAnalyticsTabProps> = ({
  providerId,
  hasData = true, // Default to showing data for demo
}) => {
  // Filters
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: 'last_30_days',
    country: 'all',
    city: 'all',
    listingType: 'all',
    bookingType: 'all',
    channel: 'all',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Export handler
  const handleExport = (format: 'csv' | 'pdf') => {
    toast.success(`Exporting analytics report as ${format.toUpperCase()}...`);
    // Simulate export
    setTimeout(() => {
      toast.success(`Analytics report downloaded successfully`);
    }, 1500);
  };

  // Mock data (only shown if hasData is true)
  const kpiData = {
    searches: { value: 12450, change: +15.2 },
    listingViews: { value: 8930, change: +12.8 },
    bookingRequests: { value: 1234, change: +8.5 },
    confirmedBookings: { value: 487, change: +5.2 },
    conversionRate: { value: 3.9, change: +0.4 },
    avgTimeToBooking: { value: 3.2, change: -0.5 },
    avgRent: { value: 1250, change: +3.1 },
    cancellationRate: { value: 2.1, change: -0.3 },
  };

  const funnelData = [
    { stage: 'Search', count: 12450, conversion: 100, dropOff: 0, avgTime: '0m' },
    { stage: 'Listing View', count: 8930, conversion: 71.7, dropOff: 28.3, avgTime: '8m' },
    { stage: 'Booking Initiated', count: 2150, conversion: 17.3, dropOff: 75.9, avgTime: '15m' },
    { stage: 'Booking Submitted', count: 1234, conversion: 9.9, dropOff: 42.6, avgTime: '12m' },
    { stage: 'Payment Completed', count: 892, conversion: 7.2, dropOff: 27.7, avgTime: '5m' },
    { stage: 'Booking Confirmed', count: 487, conversion: 3.9, dropOff: 45.4, avgTime: '2h' },
    { stage: 'Move-In Confirmed', count: 458, conversion: 3.7, dropOff: 6.0, avgTime: '30d' },
  ];

  const demandByCity = [
    { city: 'New York', searches: 3200, bookings: 145, availability: 234 },
    { city: 'London', searches: 2800, bookings: 132, availability: 312 },
    { city: 'Toronto', searches: 2100, bookings: 89, availability: 145 },
    { city: 'Sydney', searches: 1900, bookings: 67, availability: 178 },
    { city: 'Berlin', searches: 1200, bookings: 34, availability: 42 },
  ];

  const pricePerformance = [
    { range: '$0-500', conversions: 45, avgTime: '2.1d' },
    { range: '$500-1000', conversions: 123, avgTime: '3.5d' },
    { range: '$1000-1500', conversions: 187, avgTime: '4.2d' },
    { range: '$1500-2000', conversions: 98, avgTime: '5.8d' },
    { range: '$2000+', conversions: 34, avgTime: '7.3d' },
  ];

  const qualityMetrics = {
    complaintRate: 1.2,
    refundRate: 0.8,
    avgResponseTime: '2.3h',
    issueResolutionRate: 94.5,
  };

  const availabilityData = [
    { name: 'Available', value: 825, color: '#10b981' },
    { name: 'Limited', value: 156, color: '#f59e0b' },
    { name: 'Waitlist', value: 64, color: '#3b82f6' },
    { name: 'Unavailable', value: 22, color: '#6b7280' },
  ];

  // Empty state
  if (!hasData) {
    return (
      <div className="space-y-6">
        {/* Filters (still visible) */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filters
                {showFilters && <ChevronDown size={14} />}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
              <Select value={filters.dateRange} onValueChange={(val) => setFilters({ ...filters, dateRange: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                  <SelectItem value="year_to_date">Year to Date</SelectItem>
                  <SelectItem value="all_time">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.country} onValueChange={(val) => setFilters({ ...filters, country: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.city} onValueChange={(val) => setFilters({ ...filters, city: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="new_york">New York</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="toronto">Toronto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <Activity size={40} className="text-gray-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Analytics Data Yet</h3>
              <p className="text-sm text-gray-600 max-w-md">
                Analytics data will appear here once students start searching and booking housing.
                This provider was recently added.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm">
                <Info size={14} className="mr-2" />
                Learn About Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main analytics view with data
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
              {showFilters && <ChevronDown size={14} />}
            </Button>
            <span className="text-sm text-gray-600">
              Showing: {filters.dateRange.replace(/_/g, ' ')} • {filters.country === 'all' ? 'All Countries' : filters.country}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download size={14} className="mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download size={14} className="mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
            <Select value={filters.dateRange} onValueChange={(val) => setFilters({ ...filters, dateRange: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                <SelectItem value="year_to_date">Year to Date</SelectItem>
                <SelectItem value="all_time">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.country} onValueChange={(val) => setFilters({ ...filters, country: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="uk">UK</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.city} onValueChange={(val) => setFilters({ ...filters, city: val })}>
              <SelectTrigger>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="new_york">New York</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="toronto">Toronto</SelectItem>
                <SelectItem value="sydney">Sydney</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.listingType} onValueChange={(val) => setFilters({ ...filters, listingType: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Listing Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="student_residence">Student Residence</SelectItem>
                <SelectItem value="shared_apartment">Shared Apartment</SelectItem>
                <SelectItem value="private_room">Private Room</SelectItem>
                <SelectItem value="homestay">Homestay</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.bookingType} onValueChange={(val) => setFilters({ ...filters, bookingType: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Booking Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="instant">Instant Book</SelectItem>
                <SelectItem value="request">Request to Book</SelectItem>
                <SelectItem value="redirect">Redirect</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.channel} onValueChange={(val) => setFilters({ ...filters, channel: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Search size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Searches</div>
              <div className="text-2xl font-bold text-gray-900">{kpiData.searches.value.toLocaleString()}</div>
            </div>
          </div>
          <div className={`text-xs font-semibold ${kpiData.searches.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {kpiData.searches.change > 0 ? '↑' : '↓'} {Math.abs(kpiData.searches.change)}% vs last period
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Eye size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Listing Views</div>
              <div className="text-2xl font-bold text-gray-900">{kpiData.listingViews.value.toLocaleString()}</div>
            </div>
          </div>
          <div className={`text-xs font-semibold ${kpiData.listingViews.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {kpiData.listingViews.change > 0 ? '↑' : '↓'} {Math.abs(kpiData.listingViews.change)}% vs last period
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <FileText size={20} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Booking Requests</div>
              <div className="text-2xl font-bold text-gray-900">{kpiData.bookingRequests.value.toLocaleString()}</div>
            </div>
          </div>
          <div className={`text-xs font-semibold ${kpiData.bookingRequests.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {kpiData.bookingRequests.change > 0 ? '↑' : '↓'} {Math.abs(kpiData.bookingRequests.change)}% vs last period
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Confirmed Bookings</div>
              <div className="text-2xl font-bold text-gray-900">{kpiData.confirmedBookings.value.toLocaleString()}</div>
            </div>
          </div>
          <div className={`text-xs font-semibold ${kpiData.confirmedBookings.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {kpiData.confirmedBookings.change > 0 ? '↑' : '↓'} {Math.abs(kpiData.confirmedBookings.change)}% vs last period
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Target size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Conversion Rate</div>
              <div className="text-2xl font-bold text-gray-900">{kpiData.conversionRate.value}%</div>
            </div>
          </div>
          <div className={`text-xs font-semibold ${kpiData.conversionRate.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {kpiData.conversionRate.change > 0 ? '↑' : '↓'} {Math.abs(kpiData.conversionRate.change)}% vs last period
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Clock size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Avg Time to Booking</div>
              <div className="text-2xl font-bold text-gray-900">{kpiData.avgTimeToBooking.value} days</div>
            </div>
          </div>
          <div className={`text-xs font-semibold ${kpiData.avgTimeToBooking.change < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {kpiData.avgTimeToBooking.change < 0 ? '↓' : '↑'} {Math.abs(kpiData.avgTimeToBooking.change)} days vs last period
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign size={20} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Avg Monthly Rent</div>
              <div className="text-2xl font-bold text-gray-900">${kpiData.avgRent.value}</div>
            </div>
          </div>
          <div className={`text-xs font-semibold ${kpiData.avgRent.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {kpiData.avgRent.change > 0 ? '↑' : '↓'} {Math.abs(kpiData.avgRent.change)}% vs last period
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Cancellation Rate</div>
              <div className="text-2xl font-bold text-gray-900">{kpiData.cancellationRate.value}%</div>
            </div>
          </div>
          <div className={`text-xs font-semibold ${kpiData.cancellationRate.change < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {kpiData.cancellationRate.change < 0 ? '↓' : '↑'} {Math.abs(kpiData.cancellationRate.change)}% vs last period
          </div>
        </div>
      </div>

      {/* Funnel Analytics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Conversion Funnel</h3>
            <p className="text-sm text-gray-500">Track student journey from search to move-in</p>
          </div>
        </div>

        <div className="space-y-3">
          {funnelData.map((stage, index) => (
            <div key={stage.stage} className="relative">
              <div className="flex items-center gap-4">
                <div className="w-32 text-sm font-semibold text-gray-700">{stage.stage}</div>
                <div className="flex-1">
                  <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-between px-4"
                      style={{ width: `${stage.conversion}%` }}
                    >
                      <span className="text-sm font-bold text-white">{stage.count.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-white">{stage.conversion.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div className="w-24 text-right">
                  {index > 0 && (
                    <div className="text-xs font-semibold text-red-600">
                      -{stage.dropOff.toFixed(1)}% drop
                    </div>
                  )}
                  <div className="text-xs text-gray-500">Avg: {stage.avgTime}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demand & Supply Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* City Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <MapPin size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Top Cities by Demand</h3>
              <p className="text-sm text-gray-500">Searches vs Bookings</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={demandByCity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="searches" fill="#3b82f6" name="Searches" />
              <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Availability Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Home size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Listing Availability</h3>
              <p className="text-sm text-gray-500">Current status distribution</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={availabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {availabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <DollarSign size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Price Band Performance</h3>
            <p className="text-sm text-gray-500">Conversions by price range</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={pricePerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="conversions" fill="#f59e0b" name="Conversions" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quality & Support Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Quality & Support Metrics</h3>
            <p className="text-sm text-gray-500">Service quality indicators</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Complaint Rate</div>
            <div className="text-2xl font-bold text-gray-900">{qualityMetrics.complaintRate}%</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">↓ 0.3% vs last period</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Refund Rate</div>
            <div className="text-2xl font-bold text-gray-900">{qualityMetrics.refundRate}%</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">↓ 0.2% vs last period</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Avg Response Time</div>
            <div className="text-2xl font-bold text-gray-900">{qualityMetrics.avgResponseTime}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">↓ 0.5h vs last period</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Resolution Rate</div>
            <div className="text-2xl font-bold text-gray-900">{qualityMetrics.issueResolutionRate}%</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">↑ 1.2% vs last period</div>
          </div>
        </div>
      </div>
    </div>
  );
};
