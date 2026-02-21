/**
 * HOUSING LISTING DETAILS - READ-ONLY VIEW
 * 
 * Complete listing details page with:
 * - Header summary with status badges
 * - Media gallery
 * - All sections displayed as read-only cards
 * - Activity log timeline
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Copy,
  Archive,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  CheckCircle,
  Star,
  Eye,
  EyeOff,
  Globe,
  Users,
  Bed,
  Bath,
  Maximize,
  Shield,
  Clock,
  FileText,
  Image as ImageIcon,
  Video,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from './ui/button';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface ListingDetails {
  id: string;
  propertyName: string;
  listingType: string;
  status: 'Active' | 'Draft' | 'Archived';
  visible: boolean;
  featured: boolean;
  verified: boolean;

  // Location
  country: string;
  city: string;
  neighborhood: string;
  address: string;
  zipCode: string;

  // Pricing
  currency: string;
  minRent: number;
  maxRent: number;
  depositAmount: number;
  applicationFee: number;
  utilitiesIncluded: boolean;

  // Inventory
  totalUnits: number;
  availableUnits: number;
  bedrooms: number;
  bathrooms: number;
  roomSize: number;

  // Contract
  minContract: number;
  maxContract: number;
  cancellationPolicy: string;
  refundPolicy: string;

  // Amenities
  amenities: string[];

  // Media
  images: string[];
  videoTourUrl?: string;

  // Dates
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  details: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

interface HousingListingDetailsProps {
  listingId: string;
  onBack: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
}

export const HousingListingDetails: React.FC<HousingListingDetailsProps> = ({
  listingId,
  onBack,
  onEdit,
  onDuplicate,
  onArchive,
}) => {
  // Mock data
  const [listing] = useState<ListingDetails>({
    id: 'LST-001',
    propertyName: 'Downtown Student Hub',
    listingType: 'Student Residence',
    status: 'Active',
    visible: true,
    featured: true,
    verified: true,
    country: 'USA',
    city: 'New York',
    neighborhood: 'Manhattan',
    address: '123 University Ave',
    zipCode: '10001',
    currency: 'USD',
    minRent: 1200,
    maxRent: 2400,
    depositAmount: 1200,
    applicationFee: 50,
    utilitiesIncluded: false,
    totalUnits: 20,
    availableUnits: 15,
    bedrooms: 2,
    bathrooms: 1,
    roomSize: 350,
    minContract: 6,
    maxContract: 12,
    cancellationPolicy: 'Free cancellation up to 48 hours before move-in. After that, 50% refund up to 7 days before move-in.',
    refundPolicy: 'Full refund of deposit if property is not as described. Partial refund based on damage assessment.',
    amenities: ['WiFi', 'Laundry', 'Elevator', 'Security', 'CCTV', 'Furnished', 'AC', 'Gym', 'Study Room'],
    images: [],
    videoTourUrl: 'https://youtube.com/...',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-10',
    lastModifiedBy: 'Admin User',
  });

  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      timestamp: '2024-02-10 14:30',
      admin: 'Admin User',
      action: 'Updated',
      details: 'Changed rent range from $1000-$2200 to $1200-$2400',
    },
    {
      id: '2',
      timestamp: '2024-02-05 10:15',
      admin: 'Admin User',
      action: 'Featured',
      details: 'Marked listing as featured',
    },
    {
      id: '3',
      timestamp: '2024-01-20 16:45',
      admin: 'Admin User',
      action: 'Published',
      details: 'Listing published and made visible to students',
    },
    {
      id: '4',
      timestamp: '2024-01-15 09:00',
      admin: 'Admin User',
      action: 'Created',
      details: 'Listing created as draft',
    },
  ]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#253154]">{listing.propertyName}</h1>
                  {listing.verified && (
                    <CheckCircle size={20} className="text-emerald-600" aria-label="Verified" />
                  )}
                  {listing.featured && (
                    <Star size={20} className="text-amber-500 fill-amber-500" aria-label="Featured" />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-600 font-mono">{listing.id}</span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    {listing.city}, {listing.country}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-lg text-sm font-bold ${listing.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : listing.status === 'Draft'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {listing.status}
              </span>
              {listing.visible ? (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                  <Eye size={14} />
                  Visible
                </div>
              ) : (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold">
                  <EyeOff size={14} />
                  Hidden
                </div>
              )}
              <Button variant="outline" onClick={onDuplicate}>
                <Copy size={16} className="mr-2" />
                Duplicate
              </Button>
              <Button onClick={onEdit} className="bg-[#253154] hover:bg-[#1a2340]">
                <Edit3 size={16} className="mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* HEADER SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-purple-600" />
              <span className="text-xs font-semibold text-gray-600">Rent Range</span>
            </div>
            <div className="text-lg font-bold text-[#253154]">
              ${listing.minRent} - ${listing.maxRent}
            </div>
            <div className="text-xs text-gray-600 mt-1">Per month</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Home size={16} className="text-blue-600" />
              <span className="text-xs font-semibold text-gray-600">Available Units</span>
            </div>
            <div className="text-lg font-bold text-[#253154]">
              {listing.availableUnits} / {listing.totalUnits}
            </div>
            <div className="text-xs text-gray-600 mt-1">Units ready</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-emerald-600" />
              <span className="text-xs font-semibold text-gray-600">Contract</span>
            </div>
            <div className="text-lg font-bold text-[#253154]">
              {listing.minContract}-{listing.maxContract} mo
            </div>
            <div className="text-xs text-gray-600 mt-1">Lease term</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-indigo-600" />
              <span className="text-xs font-semibold text-gray-600">Deposit</span>
            </div>
            <div className="text-lg font-bold text-[#253154]">${listing.depositAmount}</div>
            <div className="text-xs text-gray-600 mt-1">Refundable</div>
          </div>
        </div>

        {/* MEDIA GALLERY */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Media Gallery</h3>

          {/* Placeholder for image gallery */}
          <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-4">
            <div className="text-center">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Property images would be displayed here</p>
              <p className="text-xs text-gray-500 mt-1">Interactive gallery with navigation</p>
            </div>
          </div>

          {/* Image navigation placeholder */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">Image 1 of 8</span>
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>

          {listing.videoTourUrl && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              <Video size={20} className="text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Video Tour Available</p>
                <a href={listing.videoTourUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                  {listing.videoTourUrl}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* BASIC INFORMATION */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Listing Type</div>
              <div className="text-sm font-bold text-gray-900">{listing.listingType}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Status</div>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-bold ${listing.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : listing.status === 'Draft'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {listing.status}
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Verified</div>
              <div className="text-sm font-bold text-gray-900">
                {listing.verified ? (
                  <span className="text-emerald-600">✓ Yes</span>
                ) : (
                  <span className="text-gray-600">✗ No</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Country</div>
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-900">{listing.country}</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">City</div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-900">{listing.city}</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Neighborhood</div>
              <div className="text-sm font-bold text-gray-900">{listing.neighborhood}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Zip Code</div>
              <div className="text-sm font-bold text-gray-900">{listing.zipCode}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs font-semibold text-gray-600 mb-1">Full Address</div>
              <div className="text-sm font-bold text-gray-900">{listing.address}</div>
            </div>
          </div>
        </div>

        {/* PRICING DETAILS */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Pricing Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">Currency</div>
              <div className="text-sm font-bold text-gray-900">{listing.currency}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">Min Rent</div>
              <div className="text-sm font-bold text-gray-900">${listing.minRent}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">Max Rent</div>
              <div className="text-sm font-bold text-gray-900">${listing.maxRent}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">Deposit</div>
              <div className="text-sm font-bold text-gray-900">${listing.depositAmount}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">Application Fee</div>
              <div className="text-sm font-bold text-gray-900">${listing.applicationFee}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">Utilities</div>
              <div className="text-sm font-bold text-gray-900">
                {listing.utilitiesIncluded ? 'Included' : 'Not Included'}
              </div>
            </div>
          </div>
        </div>

        {/* PROPERTY DETAILS */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Property Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Home size={20} className="text-blue-600" />
              <div>
                <div className="text-xs font-semibold text-gray-600">Total Units</div>
                <div className="text-sm font-bold text-gray-900">{listing.totalUnits}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle size={20} className="text-emerald-600" />
              <div>
                <div className="text-xs font-semibold text-gray-600">Available</div>
                <div className="text-sm font-bold text-gray-900">{listing.availableUnits}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Bed size={20} className="text-purple-600" />
              <div>
                <div className="text-xs font-semibold text-gray-600">Bedrooms</div>
                <div className="text-sm font-bold text-gray-900">{listing.bedrooms}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Bath size={20} className="text-indigo-600" />
              <div>
                <div className="text-xs font-semibold text-gray-600">Bathrooms</div>
                <div className="text-sm font-bold text-gray-900">{listing.bathrooms}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Maximize size={20} className="text-amber-600" />
              <div>
                <div className="text-xs font-semibold text-gray-600">Room Size</div>
                <div className="text-sm font-bold text-gray-900">{listing.roomSize} sqft</div>
              </div>
            </div>
          </div>
        </div>

        {/* AMENITIES */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {listing.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* CONTRACT & POLICIES */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Contract & Policies</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-semibold text-gray-600 mb-1">Min Contract</div>
                <div className="text-sm font-bold text-gray-900">{listing.minContract} months</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-semibold text-gray-600 mb-1">Max Contract</div>
                <div className="text-sm font-bold text-gray-900">{listing.maxContract} months</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">Cancellation Policy</div>
              <p className="text-sm text-gray-900 leading-relaxed bg-gray-50 p-3 rounded-lg">
                {listing.cancellationPolicy}
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">Refund Policy</div>
              <p className="text-sm text-gray-900 leading-relaxed bg-gray-50 p-3 rounded-lg">
                {listing.refundPolicy}
              </p>
            </div>
          </div>
        </div>

        {/* METADATA */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Created At</div>
              <div className="text-sm font-bold text-gray-900">{listing.createdAt}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Last Updated</div>
              <div className="text-sm font-bold text-gray-900">{listing.updatedAt}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Last Modified By</div>
              <div className="text-sm font-bold text-gray-900">{listing.lastModifiedBy}</div>
            </div>
          </div>
        </div>

        {/* ACTIVITY LOG */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Activity Log</h3>
          <div className="space-y-3">
            {activityLogs.map((log, index) => (
              <div key={log.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock size={16} className="text-blue-600" />
                  </div>
                  {index < activityLogs.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">{log.action}</span>
                    <span className="text-xs text-gray-500">by {log.admin}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{log.details}</p>
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
