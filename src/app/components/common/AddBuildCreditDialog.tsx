"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { BuildCredit } from '../../services/buildCreditService';

interface AddBuildCreditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: Partial<BuildCredit>) => Promise<void>;
    initialData?: BuildCredit | null;
    mode?: 'add' | 'edit';
}

export const AddBuildCreditDialog: React.FC<AddBuildCreditDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<BuildCredit>>({
        provider_name: '',
        program_name: '',
        card_type: 'Student Card',
        countries_supported: 1,
        status: 'active',
        student_visible: true,
        credit_limit: '',
        monthly_fee: '$0',
        building_period: '6 months',
        popularity: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                provider_name: '',
                program_name: '',
                card_type: 'Student Card',
                countries_supported: 1,
                status: 'active',
                student_visible: true,
                credit_limit: '',
                monthly_fee: '$0',
                building_period: '6 months',
                popularity: 0
            });
        }
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, student_visible: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.provider_name || !formData.program_name) {
            toast.error("Please fill in required fields");
            return;
        }

        setIsLoading(true);
        try {
            await onSave(formData);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
                <div className="bg-[#0e042f] px-8 py-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white">
                            {mode === 'edit' ? 'Edit Credit Program' : 'Add New Credit Program'}
                        </DialogTitle>
                        <p className="text-purple-200/60 text-sm mt-1">
                            {mode === 'edit' ? 'Update program details' : 'Register a new credit building program'}
                        </p>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-gray-50/50">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="provider_name" className="text-[14px] font-semibold text-[#253154]">Provider Name*</Label>
                            <Input
                                id="provider_name"
                                name="provider_name"
                                value={formData.provider_name}
                                onChange={handleChange}
                                placeholder="e.g. Deserve"
                                className="h-11 rounded-xl border-gray-200 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="program_name" className="text-[14px] font-semibold text-[#253154]">Program Name*</Label>
                            <Input
                                id="program_name"
                                name="program_name"
                                value={formData.program_name}
                                onChange={handleChange}
                                placeholder="e.g. Deserve EDU Mastercard"
                                className="h-11 rounded-xl border-gray-200 focus:ring-purple-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="card_type" className="text-[14px] font-semibold text-[#253154]">Card Type</Label>
                            <Select value={formData.card_type} onValueChange={(v) => handleSelectChange('card_type', v)}>
                                <SelectTrigger className="h-11 rounded-xl border-gray-200">
                                    <SelectValue placeholder="Select card type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Student Card">Student Card</SelectItem>
                                    <SelectItem value="Secured Card">Secured Card</SelectItem>
                                    <SelectItem value="Savings-Secured">Savings-Secured</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-[14px] font-semibold text-[#253154]">Status</Label>
                            <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                                <SelectTrigger className="h-11 rounded-xl border-gray-200">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="credit_limit" className="text-[14px] font-semibold text-[#253154]">Credit Limit</Label>
                            <Input
                                id="credit_limit"
                                name="credit_limit"
                                value={formData.credit_limit}
                                onChange={handleChange}
                                placeholder="e.g. $500-$1000"
                                className="h-11 rounded-xl border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="monthly_fee" className="text-[14px] font-semibold text-[#253154]">Monthly Fee</Label>
                            <Input
                                id="monthly_fee"
                                name="monthly_fee"
                                value={formData.monthly_fee}
                                onChange={handleChange}
                                placeholder="e.g. $0"
                                className="h-11 rounded-xl border-gray-200"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="building_period" className="text-[14px] font-semibold text-[#253154]">Building Period</Label>
                            <Input
                                id="building_period"
                                name="building_period"
                                value={formData.building_period}
                                onChange={handleChange}
                                placeholder="e.g. 6 months"
                                className="h-11 rounded-xl border-gray-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="countries_supported" className="text-[14px] font-semibold text-[#253154]">Countries Supported</Label>
                            <Input
                                id="countries_supported"
                                name="countries_supported"
                                type="number"
                                value={formData.countries_supported}
                                onChange={(e) => handleSelectChange('countries_supported', e.target.value)}
                                className="h-11 rounded-xl border-gray-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                        <div className="space-y-0.5">
                            <Label className="text-[15px] font-semibold text-[#253154]">Student Visibility</Label>
                            <p className="text-xs text-gray-500">Show this program in the student marketplace</p>
                        </div>
                        <Switch
                            checked={formData.student_visible}
                            onCheckedChange={handleSwitchChange}
                        />
                    </div>

                    <DialogFooter className="pt-4 border-t border-gray-100 flex gap-3">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="h-12 flex-1 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-12 flex-1 rounded-xl bg-[#0e042f] hover:bg-[#1a0c4a] text-white font-semibold transition-all shadow-lg shadow-purple-900/10"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                mode === 'edit' ? 'Update Program' : 'Add Program'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
