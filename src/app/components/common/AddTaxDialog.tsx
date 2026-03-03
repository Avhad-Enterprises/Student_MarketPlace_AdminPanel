'use client';

import React, { useState, useEffect } from 'react';
import {
    Loader2, Plus, Shield, Globe, FileCheck, Clock, CheckCircle2,
    AlertCircle, Eye, EyeOff, Zap, Award, Briefcase, FileText, TrendingUp, Building, DollarSign
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tax } from "@/app/services/taxesService";

export interface AddTaxDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Tax | null;
    mode?: 'add' | 'edit';
}

export const AddTaxDialog: React.FC<AddTaxDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        tax_id: '',
        service_name: '',
        provider: '',
        filing_type: 'Full Service',
        countries_covered: 1,
        status: 'active' as 'active' | 'inactive',
        student_visible: true,
        residency_type: 'Non-Resident',
        complexity: 'Medium',
        usage_rate: '0%',
        popularity: 0
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                tax_id: initialData.tax_id || '',
                service_name: initialData.service_name || '',
                provider: initialData.provider || '',
                filing_type: initialData.filing_type || 'Full Service',
                countries_covered: initialData.countries_covered || 1,
                status: initialData.status || 'active',
                student_visible: initialData.student_visible ?? true,
                residency_type: initialData.residency_type || 'Non-Resident',
                complexity: initialData.complexity || 'Medium',
                usage_rate: initialData.usage_rate || '0%',
                popularity: initialData.popularity || 0
            });
        } else if (open && mode === 'add') {
            setFormData({
                tax_id: '',
                service_name: '',
                provider: '',
                filing_type: 'Full Service',
                countries_covered: 1,
                status: 'active',
                student_visible: true,
                residency_type: 'Non-Resident',
                complexity: 'Medium',
                usage_rate: '0%',
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
            if (!formData.service_name || !formData.provider) {
                toast.error("Service Name and Provider are required");
                setIsLoading(false);
                return;
            }

            const submittableData = {
                ...formData,
                countries_covered: Number(formData.countries_covered),
                popularity: Number(formData.popularity)
            };

            await onSave(submittableData);
            toast.success(mode === 'edit' ? "Tax service updated successfully" : "Tax service added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to save tax service details");
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
                            {mode === 'edit' ? <FileText className="text-purple-700" size={24} /> : <Plus className="text-purple-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit Tax Service' : 'Add New Tax Service'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the tax advisory service.' : 'Enter the details of the new tax service to add it to the platform.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tax_id" className="text-sm font-medium text-gray-700">
                                Reference ID
                            </Label>
                            <Input
                                id="tax_id"
                                value={formData.tax_id}
                                onChange={(e) => handleChange('tax_id', e.target.value)}
                                placeholder="Auto-generated if left blank"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="service_name" className="text-sm font-medium text-gray-700">
                                Service Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="service_name"
                                value={formData.service_name}
                                onChange={(e) => handleChange('service_name', e.target.value)}
                                placeholder="e.g. International Tax Filing"
                                required
                            />
                        </div>

                        <div className="space-y-2 text-sm">
                            <Label htmlFor="provider" className="text-sm font-medium text-gray-700">
                                Provider <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="provider"
                                value={formData.provider}
                                onChange={(e) => handleChange('provider', e.target.value)}
                                placeholder="e.g. TurboTax Global"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="filing_type" className="text-sm font-medium text-gray-700">
                                Filing Type
                            </Label>
                            <Select value={formData.filing_type} onValueChange={(val: any) => handleChange('filing_type', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select filing type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full Service">Full Service</SelectItem>
                                    <SelectItem value="Self-Service">Self-Service</SelectItem>
                                    <SelectItem value="Advisory Only">Advisory Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="residency_type" className="text-sm font-medium text-gray-700">
                                Residency Type
                            </Label>
                            <Select value={formData.residency_type} onValueChange={(val: any) => handleChange('residency_type', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select residency type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Resident">Resident</SelectItem>
                                    <SelectItem value="Non-Resident">Non-Resident</SelectItem>
                                    <SelectItem value="Both">Both</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="complexity" className="text-sm font-medium text-gray-700">
                                Complexity
                            </Label>
                            <Select value={formData.complexity} onValueChange={(val: any) => handleChange('complexity', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select complexity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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
                                    min="1"
                                />
                            </div>
                        </div>

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

                        <div className="md:col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                {formData.student_visible ? <Eye className="text-purple-600" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                                <div>
                                    <div className="text-sm font-bold text-gray-700">Visible to Students</div>
                                    <div className="text-xs text-gray-500">Toggle if students can see this service</div>
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
                        <Button type="submit" className="bg-[#0e042f] hover:bg-[#1a0c4a] text-white min-w-[140px]" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {mode === 'edit' ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                <>
                                    {mode === 'edit' ? 'Update Service' : 'Add Tax Service'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
