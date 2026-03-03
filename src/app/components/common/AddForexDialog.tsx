import React, { useState, useEffect } from 'react';
import { Loader2, Plus, DollarSign, Globe, Zap, Eye, EyeOff, TrendingDown, Clock, Layers } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Forex } from "@/app/services/forexService";

export interface AddForexDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Forex | null;
    mode?: 'add' | 'edit';
}

export const AddForexDialog: React.FC<AddForexDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        forex_id: '',
        provider_name: '',
        service_type: 'Money Transfer',
        currency_pairs: 0,
        countries_covered: 0,
        avg_fee: '',
        transfer_speed: '',
        status: 'active' as 'active' | 'inactive',
        student_visible: true,
        popularity: 0
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                forex_id: initialData.forex_id || '',
                provider_name: initialData.provider_name || '',
                service_type: initialData.service_type || 'Money Transfer',
                currency_pairs: initialData.currency_pairs || 0,
                countries_covered: initialData.countries_covered || 0,
                avg_fee: initialData.avg_fee || '',
                transfer_speed: initialData.transfer_speed || '',
                status: initialData.status || 'active',
                student_visible: initialData.student_visible ?? true,
                popularity: initialData.popularity || 0
            });
        } else if (open && mode === 'add') {
            setFormData({
                forex_id: '',
                provider_name: '',
                service_type: 'Money Transfer',
                currency_pairs: 0,
                countries_covered: 0,
                avg_fee: '',
                transfer_speed: '',
                status: 'active',
                student_visible: true,
                popularity: 1
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
            if (!formData.provider_name || !formData.service_type) {
                toast.error("Provider Name and Service Type are required");
                setIsLoading(false);
                return;
            }

            // Ensure numbers are numbers
            const submittableData = {
                ...formData,
                currency_pairs: Number(formData.currency_pairs),
                countries_covered: Number(formData.countries_covered),
                popularity: Number(formData.popularity)
            };

            await onSave(submittableData);
            toast.success(mode === 'edit' ? "Forex details updated successfully" : "Forex provider added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to save forex details";
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
                            {mode === 'edit' ? <DollarSign className="text-purple-700" size={24} /> : <Plus className="text-purple-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit Forex Provider' : 'Add New Forex Provider'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the forex service partner.' : 'Enter the details of the new forex provider to add it to the services list.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reference ID (forex_id) */}
                        <div className="space-y-2">
                            <Label htmlFor="forex_id" className="text-sm font-medium text-gray-700">
                                Reference ID (e.g. FRX-001)
                            </Label>
                            <Input
                                id="forex_id"
                                value={formData.forex_id}
                                onChange={(e) => handleChange('forex_id', e.target.value)}
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
                                placeholder="e.g. Wise, Western Union"
                                required
                            />
                        </div>

                        {/* Service Type */}
                        <div className="space-y-2">
                            <Label htmlFor="service_type" className="text-sm font-medium text-gray-700">
                                Service Type <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.service_type} onValueChange={(val: any) => handleChange('service_type', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Money Transfer">Money Transfer</SelectItem>
                                    <SelectItem value="Multi-Currency Account">Multi-Currency Account</SelectItem>
                                    <SelectItem value="Currency Exchange">Currency Exchange</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Currency Pairs */}
                        <div className="space-y-2">
                            <Label htmlFor="currency_pairs" className="text-sm font-medium text-gray-700">
                                Currency Pairs
                            </Label>
                            <div className="relative">
                                <Layers size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="currency_pairs"
                                    type="number"
                                    value={formData.currency_pairs}
                                    onChange={(e) => handleChange('currency_pairs', e.target.value)}
                                    className="pl-9"
                                    min="0"
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

                        {/* Avg Fee */}
                        <div className="space-y-2">
                            <Label htmlFor="avg_fee" className="text-sm font-medium text-gray-700">
                                Avg Fee (%)
                            </Label>
                            <div className="relative">
                                <TrendingDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="avg_fee"
                                    value={formData.avg_fee}
                                    onChange={(e) => handleChange('avg_fee', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. 0.5%"
                                />
                            </div>
                        </div>

                        {/* Transfer Speed */}
                        <div className="space-y-2">
                            <Label htmlFor="transfer_speed" className="text-sm font-medium text-gray-700">
                                Transfer Speed
                            </Label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="transfer_speed"
                                    value={formData.transfer_speed}
                                    onChange={(e) => handleChange('transfer_speed', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. Instant, 1-2 days"
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

                        {/* Student Visibility */}
                        <div className="md:col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                {formData.student_visible ? <Eye className="text-purple-600" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                                <div>
                                    <div className="text-sm font-bold text-gray-700">Visible to Students</div>
                                    <div className="text-xs text-gray-500">Toggle if students can see this provider in their marketplace</div>
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
                                    {mode === 'edit' ? 'Update Provider' : 'Add Provider'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
