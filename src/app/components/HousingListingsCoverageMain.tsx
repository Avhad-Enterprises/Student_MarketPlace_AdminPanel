/**
 * HOUSING LISTINGS & COVERAGE - MAIN PAGE
 * 
 * Enterprise-ready module with:
 * - KPI cards
 * - Powerful filters
 * - Full listings table
 * - Row actions (View/Edit/Duplicate/Archive)
 * - Routes to Create/Edit/Details pages
 */

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  X,
  Eye,
  Edit3,
  Copy,
  Archive,
  MoreVertical,
  MapPin,
  Home,
  DollarSign,
  FileText,
  CheckCircle,
  Star,
  TrendingUp,
  Building,
  Globe,
  Calendar,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface HousingListing {
  id: string;
  propertyName: string;
  listingType: 'Residence' | 'Apartment' | 'Studio' | 'Shared Room' | 'Private Room';
  country: string;
  city: string;
  minRent: number;
  maxRent: number;
  availableUnits: number;
  minContract: number;
  verified: boolean;
  featured: boolean;
  visible: boolean;
  status: 'Active' | 'Draft' | 'Archived';
  updatedAt: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

interface HousingListingsCoverageMainProps {
  providerId: string;
  onNavigateToCreate?: () => void;
  onNavigateToEdit?: (listingId: string) => void;
  onNavigateToDetails?: (listingId: string) => void;
}

export const HousingListingsCoverageMain: React.FC<HousingListingsCoverageMainProps> = ({
  providerId,
  onNavigateToCreate,
  onNavigateToEdit,
  onNavigateToDetails,
}) => {
  // Mock data
  const [listings, setListings] = useState<HousingListing[]>([
    {
      id: 'LST-001',
      propertyName: 'Downtown Student Hub',
      listingType: 'Residence',
      country: 'USA',
      city: 'New York',
      minRent: 1200,
      maxRent: 2400,
      availableUnits: 15,
      minContract: 6,
      verified: true,
      featured: true,
      visible: true,
      status: 'Active',
      updatedAt: '2024-02-10',
    },
    {
      id: 'LST-002',
      propertyName: 'Riverside Apartments',
      listingType: 'Apartment',
      country: 'UK',
      city: 'London',
      minRent: 900,
      maxRent: 1800,
      availableUnits: 8,
      minContract: 12,
      verified: true,
      featured: false,
      visible: true,
      status: 'Active',
      updatedAt: '2024-02-09',
    },
    {
      id: 'LST-003',
      propertyName: 'Campus View Studios',
      listingType: 'Studio',
      country: 'Canada',
      city: 'Toronto',
      minRent: 1000,
      maxRent: 1500,
      availableUnits: 3,
      minContract: 4,
      verified: false,
      featured: false,
      visible: true,
      status: 'Draft',
      updatedAt: '2024-02-08',
    },
    {
      id: 'LST-004',
      propertyName: 'University Heights',
      listingType: 'Shared Room',
      country: 'Australia',
      city: 'Sydney',
      minRent: 600,
      maxRent: 1200,
      availableUnits: 0,
      minContract: 6,
      verified: true,
      featured: false,
      visible: false,
      status: 'Archived',
      updatedAt: '2024-01-15',
    },
  ]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterListingType, setFilterListingType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVerified, setFilterVerified] = useState(false);

  // Dialog state
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [listingToArchive, setListingToArchive] = useState<string | null>(null);

  // Calculate KPIs
  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.status === 'Active').length;
  const draftListings = listings.filter((l) => l.status === 'Draft').length;
  const avgMonthlyRent =
    listings.length > 0
      ? Math.round(
          listings.reduce((sum, l) => sum + (l.minRent + l.maxRent) / 2, 0) / listings.length
        )
      : 0;
  const availableUnits = listings.reduce((sum, l) => sum + l.availableUnits, 0);
  
  // Find most popular city
  const cityCounts: Record<string, number> = {};
  listings.forEach((l) => {
    cityCounts[l.city] = (cityCounts[l.city] || 0) + 1;
  });
  const mostPopularCity = Object.keys(cityCounts).length > 0
    ? Object.keys(cityCounts).reduce((a, b) => (cityCounts[a] > cityCounts[b] ? a : b))
    : 'N/A';

  // Get unique filter options
  const countries = Array.from(new Set(listings.map((l) => l.country))).sort();
  const cities = Array.from(new Set(listings.map((l) => l.city))).sort();

  // Filter listings
  const filteredListings = listings.filter((listing) => {
    if (searchQuery && !listing.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !listing.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterCountry !== 'all' && listing.country !== filterCountry) return false;
    if (filterCity !== 'all' && listing.city !== filterCity) return false;
    if (filterListingType !== 'all' && listing.listingType !== filterListingType) return false;
    if (filterStatus !== 'all' && listing.status !== filterStatus) return false;
    if (filterVerified && !listing.verified) return false;
    return true;
  });

  // Handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterCountry('all');
    setFilterCity('all');
    setFilterListingType('all');
    setFilterStatus('all');
    setFilterVerified(false);
  };

  const handleToggleVisible = (listingId: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId ? { ...l, visible: !l.visible } : l
      )
    );
    toast.success('Visibility updated');
  };

  const handleDuplicate = (listingId: string) => {
    const original = listings.find((l) => l.id === listingId);
    if (original) {
      const newListing: HousingListing = {
        ...original,
        id: `LST-${String(listings.length + 1).padStart(3, '0')}`,
        propertyName: `${original.propertyName} (Copy)`,
        status: 'Draft',
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setListings((prev) => [...prev, newListing]);
      toast.success('Listing duplicated as draft');
      
      // Navigate to edit page
      if (onNavigateToEdit) {
        onNavigateToEdit(newListing.id);
      }
    }
  };

  const handleArchive = () => {
    if (listingToArchive) {
      setListings((prev) =>
        prev.map((l) =>
          l.id === listingToArchive ? { ...l, status: 'Archived', visible: false } : l
        )
      );
      toast.success('Listing archived');
      setShowArchiveDialog(false);
      setListingToArchive(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Listings */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Total Listings</span>
            <FileText size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#253154]">{totalListings}</div>
          <div className="text-xs text-gray-600 mt-1">All properties</div>
        </div>

        {/* Active Listings */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Active Listings</span>
            <CheckCircle size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#253154]">{activeListings}</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <TrendingUp size={12} />
            Live now
          </div>
        </div>

        {/* Draft Listings */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Draft Listings</span>
            <Edit3 size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#253154]">{draftListings}</div>
          <div className="text-xs text-gray-600 mt-1">In progress</div>
        </div>

        {/* Avg Monthly Rent */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Avg Monthly Rent</span>
            <DollarSign size={16} className="text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-[#253154]">${avgMonthlyRent}</div>
          <div className="text-xs text-gray-600 mt-1">Per month</div>
        </div>

        {/* Available Units */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Available Units</span>
            <Home size={16} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-[#253154]">{availableUnits}</div>
          <div className="text-xs text-gray-600 mt-1">Ready to book</div>
        </div>

        {/* Most Popular City */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Top City</span>
            <Building size={16} className="text-blue-600" />
          </div>
          <div className="text-lg font-bold text-[#253154] truncate">{mostPopularCity}</div>
          <div className="text-xs text-gray-600 mt-1">{cityCounts[mostPopularCity] || 0} listings</div>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, ID, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Country Filter */}
          <Select value={filterCountry} onValueChange={setFilterCountry}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* City Filter */}
          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Listing Type Filter */}
          <Select value={filterListingType} onValueChange={setFilterListingType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Residence">Residence</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Studio">Studio</SelectItem>
              <SelectItem value="Shared Room">Shared Room</SelectItem>
              <SelectItem value="Private Room">Private Room</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Verified Toggle */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <Switch
              checked={filterVerified}
              onCheckedChange={setFilterVerified}
              id="filter-verified"
            />
            <label htmlFor="filter-verified" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Verified Only
            </label>
          </div>

          {/* Clear Filters */}
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            <X size={16} className="mr-1" />
            Clear
          </Button>

          {/* Add Listing Button */}
          <Button
            onClick={onNavigateToCreate}
            className="ml-auto bg-[#253154] hover:bg-[#1a2340]"
          >
            <Plus size={16} className="mr-2" />
            Add Listing
          </Button>
        </div>
      </div>

      {/* LISTINGS TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Property Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Country</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">City</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Rent Range</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Units</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Min Contract</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Verified</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Featured</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Visible</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Updated</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText size={48} className="text-gray-300" />
                      <p className="text-sm font-semibold text-gray-600">No listings found</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-semibold text-gray-900">{listing.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-gray-900">{listing.propertyName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{listing.listingType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{listing.country}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{listing.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900">
                        ${listing.minRent} - ${listing.maxRent}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${listing.availableUnits > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {listing.availableUnits}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{listing.minContract} months</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {listing.verified ? (
                        <CheckCircle size={18} className="inline text-emerald-600" />
                      ) : (
                        <X size={18} className="inline text-gray-300" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {listing.featured ? (
                        <Star size={18} className="inline text-amber-500 fill-amber-500" />
                      ) : (
                        <Star size={18} className="inline text-gray-300" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Switch
                        checked={listing.visible}
                        onCheckedChange={() => handleToggleVisible(listing.id)}
                        disabled={listing.status === 'Archived'}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          listing.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : listing.status === 'Draft'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        {listing.updatedAt}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() => onNavigateToDetails && onNavigateToDetails(listing.id)}
                          >
                            <Eye size={16} className="mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onNavigateToEdit && onNavigateToEdit(listing.id)}
                          >
                            <Edit3 size={16} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(listing.id)}>
                            <Copy size={16} className="mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setListingToArchive(listing.id);
                              setShowArchiveDialog(true);
                            }}
                            disabled={listing.status === 'Archived'}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Archive size={16} className="mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ARCHIVE CONFIRMATION DIALOG */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this listing? It will be hidden from students and marked as archived.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleArchive} className="bg-red-600 hover:bg-red-700">
              Archive Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
