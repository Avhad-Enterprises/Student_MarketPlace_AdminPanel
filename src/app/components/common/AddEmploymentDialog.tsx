import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Briefcase, Globe, Zap, Eye, EyeOff, TrendingUp, MapPin, ShieldCheck, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Employment } from "@/app/services/employmentService";

export interface AddEmploymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Employment | null;
    mode?: 'add' | 'edit';
}

export const AddEmploymentDialog: React.FC<AddEmploymentDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        reference_id: '',
        platform: '',
        service_type: 'Job Board',
        job_types: '',
        countries_covered: 0,
        avg_salary: '',
        verified: true,
        status: 'active' as 'active' | 'inactive',
        student_visible: true,
        popularity: 1
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                reference_id: initialData.reference_id || '',
                platform: initialData.platform || '',
                service_type: initialData.service_type || 'Job Board',
                job_types: initialData.job_types || '',
                countries_covered: initialData.countries_covered || 0,
                avg_salary: initialData.avg_salary || '',
                verified: initialData.verified ?? true,
                status: initialData.status || 'active',
                student_visible: initialData.student_visible ?? true,
                popularity: initialData.popularity || 0
            });
        } else if (open && mode === 'add') {
            setFormData({
                reference_id: '',
                platform: '',
                service_type: 'Job Board',
                job_types: '',
                countries_covered: 0,
                avg_salary: '',
                verified: true,
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
            if (!formData.platform || !formData.service_type) {
                toast.error("Platform Name and Service Type are required");
                setIsLoading(false);
                return;
            }

            // Ensure numbers are numbers
            const submittableData = {
                ...formData,
                countries_covered: Number(formData.countries_covered),
                popularity: Number(formData.popularity)
            };

            await onSave(submittableData);
            toast.success(mode === 'edit' ? "Platform details updated successfully" : "Platform added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to save platform details";
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
                            {mode === 'edit' ? <Briefcase className="text-purple-700" size={24} /> : <Plus className="text-purple-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit Employment Platform' : 'Add New Employment Platform'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the employment service partner.' : 'Enter the details of the new platform to add it to the services list.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reference ID (reference_id) */}
                        <div className="space-y-2">
                            <Label htmlFor="reference_id" className="text-sm font-medium text-gray-700">
                                Reference ID (e.g. EMP-001)
                            </Label>
                            <Input
                                id="reference_id"
                                value={formData.reference_id}
                                onChange={(e) => handleChange('reference_id', e.target.value)}
                                placeholder="Auto-generated if left blank"
                            />
                        </div>

                        {/* Platform Name */}
                        <div className="space-y-2">
                            <Label htmlFor="platform" className="text-sm font-medium text-gray-700">
                                Platform Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="platform"
                                value={formData.platform}
                                onChange={(e) => handleChange('platform', e.target.value)}
                                placeholder="e.g. Handshake, WayUp"
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
                                    <SelectItem value="Job Board">Job Board</SelectItem>
                                    <SelectItem value="Career Platform">Career Platform</SelectItem>
                                    <SelectItem value="Freelance">Freelance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Job Types */}
                        <div className="space-y-2">
                            <Label htmlFor="job_types" className="text-sm font-medium text-gray-700">
                                Job Types
                            </Label>
                            <Input
                                id="job_types"
                                value={formData.job_types}
                                onChange={(e) => handleChange('job_types', e.target.value)}
                                placeholder="e.g. Internships, Part-time"
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

                        {/* Avg Salary */}
                        <div className="space-y-2">
                            <Label htmlFor="avg_salary" className="text-sm font-medium text-gray-700">
                                Avg Salary Range
                            </Label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="avg_salary"
                                    value={formData.avg_salary}
                                    onChange={(e) => handleChange('avg_salary', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. $15-25/hr"
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

                        {/* switches */}
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            {/* Verified */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-green-600" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">Verified Platform</div>
                                        <div className="text-[10px] text-gray-500 italic">Vetted by team?</div>
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.verified}
                                    onCheckedChange={(val) => handleChange('verified', val)}
                                />
                            </div>

                            {/* Student Visibility */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    {formData.student_visible ? <Eye className="text-purple-600" size={18} /> : <EyeOff className="text-gray-400" size={18} />}
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">Student Visible</div>
                                        <div className="text-[10px] text-gray-500 italic">Show to users?</div>
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.student_visible}
                                    onCheckedChange={(val) => handleChange('student_visible', val)}
                                />
                            </div>
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
                                    {mode === 'edit' ? 'Update Platform' : 'Add Platform'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
