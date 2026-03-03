import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Home, MapPin, Building, Database, DollarSign, Zap, Eye, EyeOff, ShieldCheck, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Housing } from "@/app/services/housingService";

export interface AddHousingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Housing | null;
    mode?: 'add' | 'edit';
}

export const AddHousingDialog: React.FC<AddHousingDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        reference_id: '',
        provider_name: '',
        housing_type: '',
        location: '',
        countries_covered: 0,
        status: 'active' as 'active' | 'inactive',
        student_visible: true,
        avg_rent: '',
        verified: false,
        popularity: 0
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                reference_id: initialData.reference_id || '',
                provider_name: initialData.provider_name || '',
                housing_type: initialData.housing_type || '',
                location: initialData.location || '',
                countries_covered: initialData.countries_covered || 0,
                status: initialData.status || 'active',
                student_visible: initialData.student_visible ?? true,
                avg_rent: initialData.avg_rent || '',
                verified: initialData.verified || false,
                popularity: initialData.popularity || 0
            });
        } else if (open && mode === 'add') {
            setFormData({
                reference_id: '',
                provider_name: '',
                housing_type: '',
                location: '',
                countries_covered: 0,
                status: 'active',
                student_visible: true,
                avg_rent: '',
                verified: false,
                popularity: 0
            });
        }
    }, [open, mode, initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate
            if (!formData.provider_name || !formData.housing_type || !formData.location) {
                toast.error("Provider Name, Housing Type and Location are required");
                setIsLoading(false);
                return;
            }

            const submittableData = {
                ...formData,
                countries_covered: Number(formData.countries_covered),
                popularity: Number(formData.popularity)
            };

            await onSave(submittableData);
            toast.success(mode === 'edit' ? "Housing provider updated successfully" : "Housing provider added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to save housing provider";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar-light">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            {mode === 'edit' ? <Home className="text-purple-700" size={24} /> : <Plus className="text-purple-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit Housing Provider' : 'Add New Housing Provider'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the housing provider.' : 'Enter the details of the new housing provider to add it to the marketplace.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reference ID */}
                        <div className="space-y-2">
                            <Label htmlFor="reference_id" className="text-sm font-medium text-gray-700">
                                Reference ID (e.g. HSG-001)
                            </Label>
                            <Input
                                id="reference_id"
                                value={formData.reference_id}
                                onChange={(e) => handleChange('reference_id', e.target.value)}
                                placeholder="Auto-generated if left blank"
                            />
                        </div>

                        {/* Provider Name */}
                        <div className="space-y-2">
                            <Label htmlFor="provider_name" className="text-sm font-medium text-gray-700">
                                Provider Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="provider_name"
                                value={formData.provider_name}
                                onChange={(e) => handleChange('provider_name', e.target.value)}
                                placeholder="e.g. Student.com"
                                required
                            />
                        </div>

                        {/* Housing Type */}
                        <div className="space-y-2">
                            <Label htmlFor="housing_type" className="text-sm font-medium text-gray-700">
                                Housing Type <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.housing_type} onValueChange={(val) => handleChange('housing_type', val)}>
                                <SelectTrigger>
                                    <div className="flex items-center gap-2">
                                        <Building size={16} className="text-gray-400" />
                                        <SelectValue placeholder="Select type" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Student Residence">Student Residence</SelectItem>
                                    <SelectItem value="Shared Apartment">Shared Apartment</SelectItem>
                                    <SelectItem value="Homestay">Homestay</SelectItem>
                                    <SelectItem value="Private Room">Private Room</SelectItem>
                                    <SelectItem value="Multiple">Multiple</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                                Location <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. London, UK"
                                    required
                                />
                            </div>
                        </div>

                        {/* Countries Covered */}
                        <div className="space-y-2">
                            <Label htmlFor="countries_covered" className="text-sm font-medium text-gray-700">
                                Countries Covered
                            </Label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="countries_covered"
                                    type="number"
                                    value={formData.countries_covered}
                                    onChange={(e) => handleChange('countries_covered', e.target.value)}
                                    className="pl-9"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Avg Rent */}
                        <div className="space-y-2">
                            <Label htmlFor="avg_rent" className="text-sm font-medium text-gray-700">
                                Avg Monthly Rent
                            </Label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="avg_rent"
                                    value={formData.avg_rent}
                                    onChange={(e) => handleChange('avg_rent', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. $800/mo"
                                />
                            </div>
                        </div>

                        {/* Popularity */}
                        <div className="space-y-2">
                            <Label htmlFor="popularity" className="text-sm font-medium text-gray-700">
                                Popularity Score
                            </Label>
                            <div className="relative">
                                <Zap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="popularity"
                                    type="number"
                                    value={formData.popularity}
                                    onChange={(e) => handleChange('popularity', e.target.value)}
                                    className="pl-9"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                Status
                            </Label>
                            <Select value={formData.status} onValueChange={(val: any) => handleChange('status', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Verified Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className={formData.verified ? "text-green-600" : "text-gray-400"} size={20} />
                                <div>
                                    <div className="text-sm font-bold text-gray-700">Verified Provider</div>
                                    <div className="text-xs text-gray-500">Is this housing provider verified?</div>
                                </div>
                            </div>
                            <Switch
                                checked={formData.verified}
                                onCheckedChange={(val) => handleChange('verified', val)}
                            />
                        </div>

                        {/* Student Visibility */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                {formData.student_visible ? <Eye className="text-purple-600" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                                <div>
                                    <div className="text-sm font-bold text-gray-700">Visible to Students</div>
                                    <div className="text-xs text-gray-500">Students can see this in marketplace</div>
                                </div>
                            </div>
                            <Switch
                                checked={formData.student_visible}
                                onCheckedChange={(val) => handleChange('student_visible', val)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-gray-100">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#0e042f] hover:bg-[#1a0c4a] text-white min-w-[120px]" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {mode === 'edit' ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                <>
                                    {mode === 'edit' ? 'Update Housing' : 'Add Housing'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
