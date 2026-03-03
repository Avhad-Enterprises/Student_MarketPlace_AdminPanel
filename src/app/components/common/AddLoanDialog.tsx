'use client';

import React, { useState, useEffect } from 'react';
import {
    Loader2, Plus, Shield, Globe, FileCheck, Clock, CheckCircle2,
    AlertCircle, Eye, EyeOff, Zap, Award, Briefcase, FileText, TrendingUp, Building, DollarSign, CreditCard, Percent
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loan } from "@/app/services/loansService";

export interface AddLoanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Loan | null;
    mode?: 'add' | 'edit';
}

export const AddLoanDialog: React.FC<AddLoanDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        loan_id: '',
        provider_name: '',
        product_name: '',
        amount_range: '',
        countries_supported: 0,
        status: 'active' as 'active' | 'inactive',
        student_visible: true,
        interest_type: 'Fixed' as 'Fixed' | 'Variable',
        collateral_required: false,
        approval_rate: '0%',
        popularity: 0
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                loan_id: initialData.loan_id || '',
                provider_name: initialData.provider_name || '',
                product_name: initialData.product_name || '',
                amount_range: initialData.amount_range || '',
                countries_supported: initialData.countries_supported || 0,
                status: initialData.status || 'active',
                student_visible: initialData.student_visible ?? true,
                interest_type: initialData.interest_type || 'Fixed',
                collateral_required: initialData.collateral_required ?? false,
                approval_rate: initialData.approval_rate || '0%',
                popularity: initialData.popularity || 0
            });
        } else if (open && mode === 'add') {
            setFormData({
                loan_id: '',
                provider_name: '',
                product_name: '',
                amount_range: '',
                countries_supported: 0,
                status: 'active',
                student_visible: true,
                interest_type: 'Fixed',
                collateral_required: false,
                approval_rate: '0%',
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
            if (!formData.provider_name || !formData.product_name) {
                toast.error("Provider Name and Product Name are required");
                setIsLoading(false);
                return;
            }

            const submittableData = {
                ...formData,
                countries_supported: Number(formData.countries_supported),
                popularity: Number(formData.popularity)
            };

            await onSave(submittableData);
            toast.success(mode === 'edit' ? "Loan product updated successfully" : "Loan product added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to save loan product details");
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
                            {mode === 'edit' ? <CreditCard className="text-purple-700" size={24} /> : <Plus className="text-purple-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit Loan Product' : 'Add New Loan Product'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the student loan product.' : 'Enter the details of the new loan product to add it to the platform.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="loan_id" className="text-sm font-medium text-gray-700">
                                Reference ID
                            </Label>
                            <Input
                                id="loan_id"
                                value={formData.loan_id}
                                onChange={(e) => handleChange('loan_id', e.target.value)}
                                placeholder="Auto-generated if left blank"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="provider_name" className="text-sm font-medium text-gray-700">
                                Provider Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="provider_name"
                                value={formData.provider_name}
                                onChange={(e) => handleChange('provider_name', e.target.value)}
                                placeholder="e.g. Prodigy Finance"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="product_name" className="text-sm font-medium text-gray-700">
                                Product Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="product_name"
                                value={formData.product_name}
                                onChange={(e) => handleChange('product_name', e.target.value)}
                                placeholder="e.g. International Student Loan"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount_range" className="text-sm font-medium text-gray-700">
                                Amount Range
                            </Label>
                            <Input
                                id="amount_range"
                                value={formData.amount_range}
                                onChange={(e) => handleChange('amount_range', e.target.value)}
                                placeholder="e.g. $10k - $100k"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interest_type" className="text-sm font-medium text-gray-700">
                                Interest Type
                            </Label>
                            <Select value={formData.interest_type} onValueChange={(val: any) => handleChange('interest_type', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select interest type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fixed">Fixed</SelectItem>
                                    <SelectItem value="Variable">Variable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="approval_rate" className="text-sm font-medium text-gray-700">
                                Approval Rate
                            </Label>
                            <Input
                                id="approval_rate"
                                value={formData.approval_rate}
                                onChange={(e) => handleChange('approval_rate', e.target.value)}
                                placeholder="e.g. 85%"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="countries_supported" className="text-sm font-medium text-gray-700">
                                Countries Supported
                            </Label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="countries_supported"
                                    type="number"
                                    value={formData.countries_supported}
                                    onChange={(e) => handleChange('countries_supported', e.target.value)}
                                    className="pl-9"
                                    min="0"
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

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <Shield className={formData.collateral_required ? "text-amber-600" : "text-green-600"} size={20} />
                                <div>
                                    <div className="text-sm font-bold text-gray-700">Collateral Required</div>
                                    <div className="text-xs text-gray-500">Does this loan require security?</div>
                                </div>
                            </div>
                            <Switch
                                checked={formData.collateral_required}
                                onCheckedChange={(val) => handleChange('collateral_required', val)}
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                {formData.student_visible ? <Eye className="text-purple-600" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                                <div>
                                    <div className="text-sm font-bold text-gray-700">Visible to Students</div>
                                    <div className="text-xs text-gray-500">Toggle student visibility</div>
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
                                    {mode === 'edit' ? 'Update Loan' : 'Add Loan Product'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
