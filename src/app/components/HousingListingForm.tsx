/**
 * HOUSING CREATE/EDIT LISTING - FULL PAGE
 * 
 * Comprehensive form with 8 accordion sections:
 * 1. Basic Info
 * 2. Location
 * 3. Images & Media
 * 4. Pricing
 * 5. Inventory & Rooms
 * 6. Amenities
 * 7. Contract & Policies
 * 8. Availability & Booking
 * 
 * Action buttons in top-right header (Cancel/Save Draft/Publish)
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Upload,
  Trash2,
  Plus,
  GripVertical,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Map,
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
import { toast } from 'sonner';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface ListingFormData {
  // Basic Info
  propertyName: string;
  listingType: string;
  occupancyType: string;
  targetAudience: string;
  genderPreference: string;
  shortDescription: string;
  fullDescription: string;

  // Location
  country: string;
  city: string;
  neighborhood: string;
  address: string;
  zipCode: string;
  latitude: string;
  longitude: string;

  // Images
  featuredImage: string;
  galleryImages: string[];
  floorPlan: string;
  videoTourUrl: string;

  // Pricing
  currency: string;
  pricingType: string;
  baseRentMin: number;
  baseRentMax: number;
  depositAmount: number;
  applicationFee: number;
  utilitiesIncluded: boolean;
  utilityCharge: number;
  optionalFees: Array<{ name: string; type: string; amount: number }>;

  // Inventory
  totalUnits: number;
  availableUnits: number;
  bedrooms: number;
  bathrooms: number;
  roomSize: number;
  roomTypes: Array<{ name: string; price: number; available: number; images: string[] }>;

  // Amenities
  propertyAmenities: string[];
  roomAmenities: string[];
  lifestyleAmenities: string[];
  customAmenities: string[];

  // Contract
  minContract: number;
  maxContract: number;
  cancellationPolicy: string;
  refundPolicy: string;
  noticePeriod: number;
  earlyTerminationFee: number;

  // Availability
  bookingModel: string;
  leadTime: number;
  moveInDateStart: string;
  moveInDateEnd: string;
  moveOutDateStart: string;
  moveOutDateEnd: string;
  blockedDates: string[];

  // Visibility
  visibleToStudents: boolean;
  featuredListing: boolean;
  boostLevel: number;
  internalNotes: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

interface HousingListingFormProps {
  listingId?: string;
  mode: 'create' | 'edit';
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export const HousingListingForm: React.FC<HousingListingFormProps> = ({
  listingId,
  mode,
  onBack,
  onNavigate,
}) => {
  // Accordion state
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
  });

  // Form state
  const [formData, setFormData] = useState<ListingFormData>({
    propertyName: '',
    listingType: 'Residence',
    occupancyType: 'Private',
    targetAudience: 'All',
    genderPreference: 'No Restriction',
    shortDescription: '',
    fullDescription: '',
    country: '',
    city: '',
    neighborhood: '',
    address: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    featuredImage: '',
    galleryImages: [],
    floorPlan: '',
    videoTourUrl: '',
    currency: 'USD',
    pricingType: 'Monthly',
    baseRentMin: 0,
    baseRentMax: 0,
    depositAmount: 0,
    applicationFee: 0,
    utilitiesIncluded: false,
    utilityCharge: 0,
    optionalFees: [],
    totalUnits: 0,
    availableUnits: 0,
    bedrooms: 0,
    bathrooms: 0,
    roomSize: 0,
    roomTypes: [],
    propertyAmenities: [],
    roomAmenities: [],
    lifestyleAmenities: [],
    customAmenities: [],
    minContract: 6,
    maxContract: 12,
    cancellationPolicy: '',
    refundPolicy: '',
    noticePeriod: 30,
    earlyTerminationFee: 0,
    bookingModel: 'Manual Approval',
    leadTime: 7,
    moveInDateStart: '',
    moveInDateEnd: '',
    moveOutDateStart: '',
    moveOutDateEnd: '',
    blockedDates: [],
    visibleToStudents: true,
    featuredListing: false,
    boostLevel: 1,
    internalNotes: '',
  });

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  const toggleSection = (section: number) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Listing saved as draft');
      if (onBack) onBack();
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    // Validation
    if (!formData.propertyName) {
      toast.error('Property name is required');
      return;
    }
    if (!formData.country || !formData.city) {
      toast.error('Country and city are required');
      return;
    }
    if (!formData.featuredImage) {
      toast.error('Featured image is required');
      return;
    }
    if (formData.galleryImages.length < 5) {
      toast.error('Minimum 5 gallery images required');
      return;
    }
    if (formData.baseRentMin <= 0 || formData.baseRentMax <= 0) {
      toast.error('Valid rent range is required');
      return;
    }
    if (formData.availableUnits > formData.totalUnits) {
      toast.error('Available units cannot exceed total units');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(mode === 'create' ? 'Listing published successfully' : 'Listing updated successfully');
      if (onBack) onBack();
    } catch (error) {
      toast.error('Failed to publish listing');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (onBack) onBack();
  };

  const addOptionalFee = () => {
    setFormData({
      ...formData,
      optionalFees: [...formData.optionalFees, { name: '', type: 'fixed', amount: 0 }],
    });
  };

  const removeOptionalFee = (index: number) => {
    setFormData({
      ...formData,
      optionalFees: formData.optionalFees.filter((_, i) => i !== index),
    });
  };

  const addRoomType = () => {
    setFormData({
      ...formData,
      roomTypes: [...formData.roomTypes, { name: '', price: 0, available: 0, images: [] }],
    });
  };

  const removeRoomType = (index: number) => {
    setFormData({
      ...formData,
      roomTypes: formData.roomTypes.filter((_, i) => i !== index),
    });
  };

  const toggleAmenity = (category: 'propertyAmenities' | 'roomAmenities' | 'lifestyleAmenities', amenity: string) => {
    const current = formData[category];
    if (current.includes(amenity)) {
      setFormData({
        ...formData,
        [category]: current.filter((a) => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        [category]: [...current, amenity],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#253154]">
                {mode === 'create' ? 'Create New Listing' : 'Edit Listing'}
              </h1>
              {/* Status Pill */}
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                Draft
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
                <Save size={16} className="mr-2" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isSaving}
                className="bg-[#253154] hover:bg-[#1a2340]"
              >
                <CheckCircle size={16} className="mr-2" />
                {isSaving ? 'Publishing...' : mode === 'create' ? 'Publish' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        {/* SECTION 1: BASIC INFO */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection(1)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Home size={20} className="text-[#253154]" />
              <div className="text-left">
                <h3 className="text-base font-bold text-[#253154]">Basic Information</h3>
                <p className="text-xs text-gray-600">Property name, type, and description</p>
              </div>
            </div>
            {openSections[1] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections[1] && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Property Name <span className="text-red-600">*</span>
                </label>
                <Input
                  value={formData.propertyName}
                  onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                  placeholder="e.g., Downtown Student Hub"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Listing Type</label>
                <Select
                  value={formData.listingType}
                  onValueChange={(val) => setFormData({ ...formData, listingType: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residence">Student Residence</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Shared Room">Shared Room</SelectItem>
                    <SelectItem value="Private Room">Private Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Occupancy Type</label>
                <Select
                  value={formData.occupancyType}
                  onValueChange={(val) => setFormData({ ...formData, occupancyType: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Shared">Shared</SelectItem>
                    <SelectItem value="Entire Unit">Entire Unit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience</label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(val) => setFormData({ ...formData, targetAudience: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Undergrad">Undergrad</SelectItem>
                    <SelectItem value="Postgrad">Postgrad</SelectItem>
                    <SelectItem value="Working">Working Professionals</SelectItem>
                    <SelectItem value="All">All Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Gender Preference</label>
                <Select
                  value={formData.genderPreference}
                  onValueChange={(val) => setFormData({ ...formData, genderPreference: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male Only</SelectItem>
                    <SelectItem value="Female">Female Only</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                    <SelectItem value="No Restriction">No Restriction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Short Description <span className="text-red-600">*</span>
                </label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief one-line description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Description</label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={4}
                  placeholder="Detailed property description..."
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: LOCATION */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection(2)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-[#253154]" />
              <div className="text-left">
                <h3 className="text-base font-bold text-[#253154]">Location</h3>
                <p className="text-xs text-gray-600">Address and geographical information</p>
              </div>
            </div>
            {openSections[2] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections[2] && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Country <span className="text-red-600">*</span>
                </label>
                <Select
                  value={formData.country}
                  onValueChange={(val) => setFormData({ ...formData, country: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  City <span className="text-red-600">*</span>
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g., New York"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Neighborhood/Area</label>
                <Input
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="e.g., Manhattan"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code</label>
                <Input
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="e.g., 10001"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete street address"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Latitude</label>
                <Input
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="e.g., 40.7128"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Longitude</label>
                <Input
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="e.g., -74.0060"
                />
              </div>

              <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Map size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Google Map Integration</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Map pin location picker would be integrated here in production
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: IMAGES & MEDIA */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection(3)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ImageIcon size={20} className="text-[#253154]" />
              <div className="text-left">
                <h3 className="text-base font-bold text-[#253154]">Images & Media</h3>
                <p className="text-xs text-gray-600">Featured image, gallery, floor plan, video tour</p>
              </div>
            </div>
            {openSections[3] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections[3] && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Featured Image <span className="text-red-600">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">Upload Featured Image</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Choose File
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Gallery Images <span className="text-red-600">*</span> (Minimum 5)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">Upload Gallery Images</p>
                  <p className="text-xs text-gray-500">Multiple images, drag to reorder</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Choose Files
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Floor Plan (Optional)</label>
                  <div className="border border-gray-300 rounded-lg p-4 text-center">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <Button variant="outline" size="sm">
                      Upload Floor Plan
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Video Tour URL (Optional)</label>
                  <div className="flex items-center gap-2">
                    <Video size={20} className="text-gray-400" />
                    <Input
                      value={formData.videoTourUrl}
                      onChange={(e) => setFormData({ ...formData, videoTourUrl: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: PRICING */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection(4)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-[#253154]" />
              <div className="text-left">
                <h3 className="text-base font-bold text-[#253154]">Pricing</h3>
                <p className="text-xs text-gray-600">Rent, deposit, fees, and utilities</p>
              </div>
            </div>
            {openSections[4] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections[4] && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
                  <Select
                    value={formData.currency}
                    onValueChange={(val) => setFormData({ ...formData, currency: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pricing Type</label>
                  <Select
                    value={formData.pricingType}
                    onValueChange={(val) => setFormData({ ...formData, pricingType: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Semester">Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Base Rent Min <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.baseRentMin}
                    onChange={(e) => setFormData({ ...formData, baseRentMin: Number(e.target.value) })}
                    placeholder="e.g., 1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Base Rent Max <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.baseRentMax}
                    onChange={(e) => setFormData({ ...formData, baseRentMax: Number(e.target.value) })}
                    placeholder="e.g., 2000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deposit Amount</label>
                  <Input
                    type="number"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                    placeholder="e.g., 1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Application Fee</label>
                  <Input
                    type="number"
                    value={formData.applicationFee}
                    onChange={(e) => setFormData({ ...formData, applicationFee: Number(e.target.value) })}
                    placeholder="e.g., 50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-bold text-gray-900">Utilities Included</p>
                  <p className="text-xs text-gray-600">Include utilities in base rent</p>
                </div>
                <Switch
                  checked={formData.utilitiesIncluded}
                  onCheckedChange={(checked) => setFormData({ ...formData, utilitiesIncluded: checked })}
                />
              </div>

              {!formData.utilitiesIncluded && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Utility Charge (per month)</label>
                  <Input
                    type="number"
                    value={formData.utilityCharge}
                    onChange={(e) => setFormData({ ...formData, utilityCharge: Number(e.target.value) })}
                    placeholder="e.g., 100"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-gray-700">Optional Fees</label>
                  <Button variant="outline" size="sm" onClick={addOptionalFee}>
                    <Plus size={16} className="mr-1" />
                    Add Fee
                  </Button>
                </div>
                {formData.optionalFees.map((fee, index) => (
                  <div key={index} className="flex items-center gap-3 mb-3">
                    <Input
                      placeholder="Fee name"
                      value={fee.name}
                      onChange={(e) => {
                        const newFees = [...formData.optionalFees];
                        newFees[index].name = e.target.value;
                        setFormData({ ...formData, optionalFees: newFees });
                      }}
                    />
                    <Select
                      value={fee.type}
                      onValueChange={(val) => {
                        const newFees = [...formData.optionalFees];
                        newFees[index].type = val;
                        setFormData({ ...formData, optionalFees: newFees });
                      }}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={fee.amount}
                      onChange={(e) => {
                        const newFees = [...formData.optionalFees];
                        newFees[index].amount = Number(e.target.value);
                        setFormData({ ...formData, optionalFees: newFees });
                      }}
                      className="w-[150px]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOptionalFee(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: INVENTORY & ROOMS */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection(5)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Home size={20} className="text-[#253154]" />
              <div className="text-left">
                <h3 className="text-base font-bold text-[#253154]">Inventory & Rooms</h3>
                <p className="text-xs text-gray-600">Units, bedrooms, bathrooms, room types</p>
              </div>
            </div>
            {openSections[5] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections[5] && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Total Units</label>
                  <Input
                    type="number"
                    value={formData.totalUnits}
                    onChange={(e) => setFormData({ ...formData, totalUnits: Number(e.target.value) })}
                    placeholder="e.g., 20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Available Units</label>
                  <Input
                    type="number"
                    value={formData.availableUnits}
                    onChange={(e) => setFormData({ ...formData, availableUnits: Number(e.target.value) })}
                    placeholder="e.g., 15"
                  />
                  {formData.availableUnits > formData.totalUnits && (
                    <p className="text-xs text-red-600 mt-1">Cannot exceed total units</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Room Size (sqft)</label>
                  <Input
                    type="number"
                    value={formData.roomSize}
                    onChange={(e) => setFormData({ ...formData, roomSize: Number(e.target.value) })}
                    placeholder="e.g., 350"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bedrooms</label>
                  <Input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    placeholder="e.g., 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bathrooms</label>
                  <Input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-gray-700">Room Types</label>
                  <Button variant="outline" size="sm" onClick={addRoomType}>
                    <Plus size={16} className="mr-1" />
                    Add Room Type
                  </Button>
                </div>
                {formData.roomTypes.map((room, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <Input
                        placeholder="Room type name"
                        value={room.name}
                        onChange={(e) => {
                          const newRooms = [...formData.roomTypes];
                          newRooms[index].name = e.target.value;
                          setFormData({ ...formData, roomTypes: newRooms });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={room.price}
                        onChange={(e) => {
                          const newRooms = [...formData.roomTypes];
                          newRooms[index].price = Number(e.target.value);
                          setFormData({ ...formData, roomTypes: newRooms });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Available count"
                        value={room.available}
                        onChange={(e) => {
                          const newRooms = [...formData.roomTypes];
                          newRooms[index].available = Number(e.target.value);
                          setFormData({ ...formData, roomTypes: newRooms });
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRoomType(index)}
                        className="text-red-600"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remove
                      </Button>
                    </div>
                    <div className="border border-gray-300 rounded-lg p-3 text-center">
                      <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600">Upload room images</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 6: AMENITIES */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection(6)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-[#253154]" />
              <div className="text-left">
                <h3 className="text-base font-bold text-[#253154]">Amenities</h3>
                <p className="text-xs text-gray-600">Property, room, and lifestyle amenities</p>
              </div>
            </div>
            {openSections[6] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections[6] && (
            <div className="p-6 space-y-6">
              {/* Property Amenities */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Property Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['WiFi', 'Laundry', 'Elevator', 'Security', 'CCTV', 'Reception'].map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`prop-${amenity}`}
                        checked={formData.propertyAmenities.includes(amenity)}
                        onChange={() => toggleAmenity('propertyAmenities', amenity)}
                        className="w-4 h-4 text-[#253154] border-gray-300 rounded"
                      />
                      <label htmlFor={`prop-${amenity}`} className="text-sm text-gray-700 cursor-pointer">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Amenities */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Room Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Furnished', 'AC', 'Heating', 'Desk', 'Wardrobe', 'Balcony'].map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`room-${amenity}`}
                        checked={formData.roomAmenities.includes(amenity)}
                        onChange={() => toggleAmenity('roomAmenities', amenity)}
                        className="w-4 h-4 text-[#253154] border-gray-300 rounded"
                      />
                      <label htmlFor={`room-${amenity}`} className="text-sm text-gray-700 cursor-pointer">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle Amenities */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Lifestyle Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Gym', 'Common Room', 'Game Room', 'Bike Storage', 'Study Room', 'Parking'].map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`life-${amenity}`}
                        checked={formData.lifestyleAmenities.includes(amenity)}
                        onChange={() => toggleAmenity('lifestyleAmenities', amenity)}
                        className="w-4 h-4 text-[#253154] border-gray-300 rounded"
                      />
                      <label htmlFor={`life-${amenity}`} className="text-sm text-gray-700 cursor-pointer">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Amenities */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Custom Amenities</label>
                <Input placeholder="Enter custom amenity and press Enter" />
                <p className="text-xs text-gray-500 mt-1">Add amenities not listed above</p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 7: CONTRACT & POLICIES */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection(7)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-[#253154]" />
              <div className="text-left">
                <h3 className="text-base font-bold text-[#253154]">Contract & Policies</h3>
                <p className="text-xs text-gray-600">Lease terms, cancellation, refund policies</p>
              </div>
            </div>
            {openSections[7] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections[7] && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Min Contract (months)</label>
                  <Input
                    type="number"
                    value={formData.minContract}
                    onChange={(e) => setFormData({ ...formData, minContract: Number(e.target.value) })}
                    placeholder="e.g., 6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Max Contract (months)</label>
                  <Input
                    type="number"
                    value={formData.maxContract}
                    onChange={(e) => setFormData({ ...formData, maxContract: Number(e.target.value) })}
                    placeholder="e.g., 12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Notice Period (days)</label>
                  <Input
                    type="number"
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData({ ...formData, noticePeriod: Number(e.target.value) })}
                    placeholder="e.g., 30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Early Termination Fee</label>
                  <Input
                    type="number"
                    value={formData.earlyTerminationFee}
                    onChange={(e) => setFormData({ ...formData, earlyTerminationFee: Number(e.target.value) })}
                    placeholder="e.g., 500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cancellation Policy</label>
                <textarea
                  value={formData.cancellationPolicy}
                  onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={3}
                  placeholder="Describe cancellation terms..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Refund Policy</label>
                <textarea
                  value={formData.refundPolicy}
                  onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={3}
                  placeholder="Describe refund terms..."
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 8: AVAILABILITY & BOOKING */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection(8)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-[#253154]" />
              <div className="text-left">
                <h3 className="text-base font-bold text-[#253154]">Availability & Booking</h3>
                <p className="text-xs text-gray-600">Booking model, move-in/out dates, lead time</p>
              </div>
            </div>
            {openSections[8] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openSections[8] && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Booking Model</label>
                  <Select
                    value={formData.bookingModel}
                    onValueChange={(val) => setFormData({ ...formData, bookingModel: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instant">Instant Booking</SelectItem>
                      <SelectItem value="Manual Approval">Manual Approval</SelectItem>
                      <SelectItem value="Inquiry only">Inquiry Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lead Time Required (days)</label>
                  <Input
                    type="number"
                    value={formData.leadTime}
                    onChange={(e) => setFormData({ ...formData, leadTime: Number(e.target.value) })}
                    placeholder="e.g., 7"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Move-in Date Start</label>
                  <Input
                    type="date"
                    value={formData.moveInDateStart}
                    onChange={(e) => setFormData({ ...formData, moveInDateStart: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Move-in Date End</label>
                  <Input
                    type="date"
                    value={formData.moveInDateEnd}
                    onChange={(e) => setFormData({ ...formData, moveInDateEnd: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Move-out Date Start</label>
                  <Input
                    type="date"
                    value={formData.moveOutDateStart}
                    onChange={(e) => setFormData({ ...formData, moveOutDateStart: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Move-out Date End</label>
                  <Input
                    type="date"
                    value={formData.moveOutDateEnd}
                    onChange={(e) => setFormData({ ...formData, moveOutDateEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Blocked Dates Calendar</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Interactive calendar for selecting blocked dates would be integrated here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};