import React, { useState } from 'react';
import { Loader2, Plus, Building2, MapPin, DollarSign, GraduationCap, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export interface AddUniversityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (data: any) => Promise<void>;
    initialData?: any; // Add initialData prop
    mode?: 'add' | 'edit'; // Add mode prop
}

export const AddUniversityDialog: React.FC<AddUniversityDialogProps> = ({
    open,
    onOpenChange,
    onAdd,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        country: '',
        tuition: '',
        acceptanceRate: '',
        type: 'Public',
        applicationStatus: 'open',
        status: 'active'
    });

    React.useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                name: initialData.name || '',
                city: initialData.city || '',
                country: initialData.country || '',
                tuition: initialData.tuition || '',
                acceptanceRate: initialData.acceptanceRate || '',
                type: initialData.type || 'Public',
                applicationStatus: initialData.applicationStatus || 'open',
                status: initialData.status || 'active'
            });
        } else if (open && mode === 'add') {
            setFormData({
                name: '',
                city: '',
                country: '',
                tuition: '',
                acceptanceRate: '',
                type: 'Public',
                applicationStatus: 'open',
                status: 'active'
            });
        }
    }, [open, mode, initialData]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate
            if (!formData.name || !formData.city || !formData.country) {
                toast.error("Please fill in all required fields");
                setIsLoading(false);
                return;
            }

            await onAdd(formData);
            toast.success(mode === 'edit' ? "University updated successfully" : "University added successfully");
            onOpenChange(false);
            // Reset form
            setFormData({
                name: '',
                city: '',
                country: '',
                tuition: '',
                acceptanceRate: '',
                type: 'Public',
                applicationStatus: 'open',
                status: 'active'
            });
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error || error.response?.data?.message || "Failed to save university";
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
                            {mode === 'edit' ? <Building2 className="text-purple-700" size={24} /> : <Plus className="text-purple-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit University' : 'Add New University'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the university.' : 'Enter the details of the new university to add it to the marketplace.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                University Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. Harvard University"
                                />
                            </div>
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                                City <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. Cambridge"
                                />
                            </div>
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                                Country <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. USA"
                                />
                            </div>
                        </div>

                        {/* Tuition */}
                        <div className="space-y-2">
                            <Label htmlFor="tuition" className="text-sm font-medium text-gray-700">
                                Tuition Fees
                            </Label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="tuition"
                                    value={formData.tuition}
                                    onChange={(e) => handleChange('tuition', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. $50,000/year"
                                />
                            </div>
                        </div>

                        {/* Acceptance Rate */}
                        <div className="space-y-2">
                            <Label htmlFor="acceptanceRate" className="text-sm font-medium text-gray-700">
                                Acceptance Rate
                            </Label>
                            <div className="relative">
                                <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="acceptanceRate"
                                    value={formData.acceptanceRate}
                                    onChange={(e) => handleChange('acceptanceRate', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. 5.2%"
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                                Institution Type
                            </Label>
                            <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Public">Public</SelectItem>
                                    <SelectItem value="Private">Private</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Application Status */}
                        <div className="space-y-2">
                            <Label htmlFor="applicationStatus" className="text-sm font-medium text-gray-700">
                                Application Status
                            </Label>
                            <Select value={formData.applicationStatus} onValueChange={(val) => handleChange('applicationStatus', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                System Status
                            </Label>
                            <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="disabled">Disabled</SelectItem>
                                </SelectContent>
                            </Select>
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
                                    {mode === 'edit' ? 'Update University' : 'Add University'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
