import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Shield, Globe, FileCheck, Clock, CheckCircle2, AlertCircle, Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Insurance } from "@/app/services/insuranceService";

export interface AddInsuranceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Insurance | null;
    mode?: 'add' | 'edit';
}

export const AddInsuranceDialog: React.FC<AddInsuranceDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        insurance_id: '',
        provider_name: '',
        policy_name: '',
        coverage_type: 'Comprehensive',
        countries_covered: 0,
        status: 'active' as 'active' | 'inactive',
        student_visible: true,
        duration: '12 months',
        visa_compliant: true,
        mandatory: false,
        popularity: 0
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                insurance_id: initialData.insurance_id || '',
                provider_name: initialData.provider_name || '',
                policy_name: initialData.policy_name || '',
                coverage_type: initialData.coverage_type || 'Comprehensive',
                countries_covered: initialData.countries_covered || 0,
                status: initialData.status || 'active',
                student_visible: initialData.student_visible ?? true,
                duration: initialData.duration || '12 months',
                visa_compliant: initialData.visa_compliant ?? true,
                mandatory: initialData.mandatory ?? false,
                popularity: initialData.popularity || 0
            });
        } else if (open && mode === 'add') {
            setFormData({
                insurance_id: '',
                provider_name: '',
                policy_name: '',
                coverage_type: 'Comprehensive',
                countries_covered: 0,
                status: 'active',
                student_visible: true,
                duration: '12 months',
                visa_compliant: true,
                mandatory: false,
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
            if (!formData.provider_name || !formData.policy_name) {
                toast.error("Provider Name and Policy Name are required");
                setIsLoading(false);
                return;
            }

            // Ensure countries_covered and popularity are numbers
            const submittableData = {
                ...formData,
                countries_covered: Number(formData.countries_covered),
                popularity: Number(formData.popularity)
            };

            await onSave(submittableData);
            toast.success(mode === 'edit' ? "Insurance details updated successfully" : "Insurance policy added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to save insurance details";
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
                            {mode === 'edit' ? <Shield className="text-purple-700" size={24} /> : <Plus className="text-purple-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit Insurance' : 'Add New Insurance'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the insurance policy.' : 'Enter the details of the new insurance policy to add it to the services list.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reference ID (insurance_id) */}
                        <div className="space-y-2">
                            <Label htmlFor="insurance_id" className="text-sm font-medium text-gray-700">
                                Reference ID (e.g. INS-001)
                            </Label>
                            <Input
                                id="insurance_id"
                                value={formData.insurance_id}
                                onChange={(e) => handleChange('insurance_id', e.target.value)}
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
                                placeholder="e.g. Allianz Care"
                                required
                            />
                        </div>

                        {/* Policy Name */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="policy_name" className="text-sm font-medium text-gray-700">
                                Policy Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <FileCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="policy_name"
                                    value={formData.policy_name}
                                    onChange={(e) => handleChange('policy_name', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. Student Health Plus"
                                    required
                                />
                            </div>
                        </div>

                        {/* Coverage Type */}
                        <div className="space-y-2">
                            <Label htmlFor="coverage_type" className="text-sm font-medium text-gray-700">
                                Coverage Type
                            </Label>
                            <Select value={formData.coverage_type} onValueChange={(val: any) => handleChange('coverage_type', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select coverage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                                    <SelectItem value="Medical Only">Medical Only</SelectItem>
                                    <SelectItem value="Travel Only">Travel Only</SelectItem>
                                    <SelectItem value="Basic">Basic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                                Duration
                            </Label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    onChange={(e) => handleChange('duration', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. 12 months"
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

                        {/* Switches Grid */}
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            {/* Visa Compliant */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-blue-600" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">Visa Compliant</div>
                                        <div className="text-[10px] text-gray-500 italic">Meets visa requirements?</div>
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.visa_compliant}
                                    onCheckedChange={(val) => handleChange('visa_compliant', val)}
                                />
                            </div>

                            {/* Mandatory */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="text-amber-600" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">Mandatory</div>
                                        <div className="text-[10px] text-gray-500 italic">Required by law?</div>
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.mandatory}
                                    onCheckedChange={(val) => handleChange('mandatory', val)}
                                />
                            </div>
                        </div>

                        {/* Student Visibility */}
                        <div className="md:col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                {formData.student_visible ? <Eye className="text-purple-600" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                                <div>
                                    <div className="text-sm font-bold text-gray-700">Visible to Students</div>
                                    <div className="text-xs text-gray-500">Toggle if students can see this in their marketplace</div>
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
                                    {mode === 'edit' ? 'Update Insurance' : 'Add Insurance'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
