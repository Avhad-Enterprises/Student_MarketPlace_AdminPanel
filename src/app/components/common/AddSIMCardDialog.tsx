import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Smartphone, Globe, Signal, Database, Clock, Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { SimCard } from "@/app/services/simCardsService";

export interface AddSIMCardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: SimCard | null;
    mode?: 'add' | 'edit';
}

export const AddSIMCardDialog: React.FC<AddSIMCardDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        sim_id: '',
        provider_name: '',
        service_name: '',
        countries_covered: 0,
        status: 'active' as 'active' | 'inactive',
        student_visible: true,
        network_type: '4G/5G',
        data_allowance: '',
        validity: '',
        popularity: 0
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                sim_id: initialData.sim_id || '',
                provider_name: initialData.provider_name || '',
                service_name: initialData.service_name || '',
                countries_covered: initialData.countries_covered || 0,
                status: initialData.status || 'active',
                student_visible: initialData.student_visible ?? true,
                network_type: initialData.network_type || '4G/5G',
                data_allowance: initialData.data_allowance || '',
                validity: initialData.validity || '',
                popularity: initialData.popularity || 0
            });
        } else if (open && mode === 'add') {
            setFormData({
                sim_id: '',
                provider_name: '',
                service_name: '',
                countries_covered: 0,
                status: 'active',
                student_visible: true,
                network_type: '4G/5G',
                data_allowance: '',
                validity: '',
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
            if (!formData.provider_name || !formData.service_name) {
                toast.error("Provider Name and Service Name are required");
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
            toast.success(mode === 'edit' ? "SIM card updated successfully" : "SIM card added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to save SIM card";
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
                            {mode === 'edit' ? <Smartphone className="text-purple-700" size={24} /> : <Plus className="text-purple-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit SIM Plan' : 'Add New SIM Plan'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the SIM card service.' : 'Enter the details of the new SIM card to add it to the marketplace.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reference ID (sim_id) */}
                        <div className="space-y-2">
                            <Label htmlFor="sim_id" className="text-sm font-medium text-gray-700">
                                Reference ID (e.g. SIM-001)
                            </Label>
                            <Input
                                id="sim_id"
                                value={formData.sim_id}
                                onChange={(e) => handleChange('sim_id', e.target.value)}
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
                                placeholder="e.g. Airalo"
                                required
                            />
                        </div>

                        {/* Service Name */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="service_name" className="text-sm font-medium text-gray-700">
                                Service Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="service_name"
                                value={formData.service_name}
                                onChange={(e) => handleChange('service_name', e.target.value)}
                                placeholder="e.g. Europe Travel Pack"
                                required
                            />
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

                        {/* Network Type */}
                        <div className="space-y-2">
                            <Label htmlFor="network_type" className="text-sm font-medium text-gray-700">
                                Network Type
                            </Label>
                            <Select value={formData.network_type} onValueChange={(val) => handleChange('network_type', val)}>
                                <SelectTrigger>
                                    <div className="flex items-center gap-2">
                                        <Signal size={16} className="text-gray-400" />
                                        <SelectValue placeholder="Select type" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5G">5G</SelectItem>
                                    <SelectItem value="4G/5G">4G/5G</SelectItem>
                                    <SelectItem value="4G">4G</SelectItem>
                                    <SelectItem value="3G">3G</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Data Allowance */}
                        <div className="space-y-2">
                            <Label htmlFor="data_allowance" className="text-sm font-medium text-gray-700">
                                Data Allowance
                            </Label>
                            <div className="relative">
                                <Database size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="data_allowance"
                                    value={formData.data_allowance}
                                    onChange={(e) => handleChange('data_allowance', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. 10GB"
                                />
                            </div>
                        </div>

                        {/* Validity */}
                        <div className="space-y-2">
                            <Label htmlFor="validity" className="text-sm font-medium text-gray-700">
                                Validity
                            </Label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="validity"
                                    value={formData.validity}
                                    onChange={(e) => handleChange('validity', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. 30 Days"
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
                                    <div className="text-xs text-gray-500">Toggle if students can see this plan in their marketplace</div>
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
                                    {mode === 'edit' ? 'Update SIM Plan' : 'Add SIM Plan'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
