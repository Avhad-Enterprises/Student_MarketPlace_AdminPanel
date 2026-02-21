import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Building2, Globe, CreditCard, DollarSign, Smartphone, Users, Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Bank } from "@/app/services/banksService";

export interface AddBankDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Bank | null;
    mode?: 'add' | 'edit';
}

export const AddBankDialog: React.FC<AddBankDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        bank_id: '',
        bank_name: '',
        account_type: '',
        countries_covered: 0,
        status: 'active' as 'active' | 'inactive',
        student_visible: true,
        min_balance: '',
        digital_onboarding: true,
        student_friendly: true,
        popularity: 0
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                bank_id: initialData.bank_id || '',
                bank_name: initialData.bank_name || '',
                account_type: initialData.account_type || '',
                countries_covered: initialData.countries_covered || 0,
                status: initialData.status || 'active',
                student_visible: initialData.student_visible ?? true,
                min_balance: initialData.min_balance || '',
                digital_onboarding: initialData.digital_onboarding ?? true,
                student_friendly: initialData.student_friendly ?? true,
                popularity: initialData.popularity || 0
            });
        } else if (open && mode === 'add') {
            setFormData({
                bank_id: '',
                bank_name: '',
                account_type: '',
                countries_covered: 0,
                status: 'active',
                student_visible: true,
                min_balance: '',
                digital_onboarding: true,
                student_friendly: true,
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
            if (!formData.bank_name || !formData.account_type) {
                toast.error("Bank Name and Account Type are required");
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
            toast.success(mode === 'edit' ? "Bank details updated successfully" : "Bank added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to save bank details";
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
                        {mode === 'edit' ? 'Edit Bank' : 'Add New Bank'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the banking partner.' : 'Enter the details of the new bank to add it to the services list.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reference ID (bank_id) */}
                        <div className="space-y-2">
                            <Label htmlFor="bank_id" className="text-sm font-medium text-gray-700">
                                Reference ID (e.g. BNK-001)
                            </Label>
                            <Input
                                id="bank_id"
                                value={formData.bank_id}
                                onChange={(e) => handleChange('bank_id', e.target.value)}
                                placeholder="Auto-generated if left blank"
                            />
                        </div>

                        {/* Bank Name */}
                        <div className="space-y-2">
                            <Label htmlFor="bank_name" className="text-sm font-medium text-gray-700">
                                Bank Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="bank_name"
                                value={formData.bank_name}
                                onChange={(e) => handleChange('bank_name', e.target.value)}
                                placeholder="e.g. HSBC International"
                                required
                            />
                        </div>

                        {/* Account Type */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="account_type" className="text-sm font-medium text-gray-700">
                                Account Type <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="account_type"
                                    value={formData.account_type}
                                    onChange={(e) => handleChange('account_type', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. Student Savings Account"
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

                        {/* Minimum Balance */}
                        <div className="space-y-2">
                            <Label htmlFor="min_balance" className="text-sm font-medium text-gray-700">
                                Minimum Balance
                            </Label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="min_balance"
                                    value={formData.min_balance}
                                    onChange={(e) => handleChange('min_balance', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. $100"
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
                            {/* Digital Onboarding */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="text-blue-600" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">Digital Onboarding</div>
                                        <div className="text-[10px] text-gray-500 italic">Online application?</div>
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.digital_onboarding}
                                    onCheckedChange={(val) => handleChange('digital_onboarding', val)}
                                />
                            </div>

                            {/* Student Friendly */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Users className="text-amber-600" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">Student Friendly</div>
                                        <div className="text-[10px] text-gray-500 italic">Special student offers?</div>
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.student_friendly}
                                    onCheckedChange={(val) => handleChange('student_friendly', val)}
                                />
                            </div>
                        </div>

                        {/* Student Visibility */}
                        <div className="md:col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                {formData.student_visible ? <Eye className="text-purple-600" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                                <div>
                                    <div className="text-sm font-bold text-gray-700">Visible to Students</div>
                                    <div className="text-xs text-gray-500">Toggle if students can see this bank in their marketplace</div>
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
                                    {mode === 'edit' ? 'Update Bank' : 'Add Bank'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
