import React, { useState, useEffect } from 'react';
import {
    Loader2, Plus, Shield, Globe, FileCheck, Clock, CheckCircle2,
    AlertCircle, Eye, EyeOff, Zap, Award, Briefcase, FileText, TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Visa } from "@/app/services/visaService";

export interface AddVisaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Visa | null;
    mode?: 'add' | 'edit';
}

export const AddVisaDialog: React.FC<AddVisaDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        visa_id: '',
        visa_type: '',
        category: 'Study',
        countries_covered: 1,
        status: 'active' as 'active' | 'inactive',
        student_visible: true,
        processing_difficulty: 'Medium',
        work_rights: true,
        high_approval: true,
        popularity: 0
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                visa_id: initialData.visa_id || '',
                visa_type: initialData.visa_type || '',
                category: initialData.category || 'Study',
                countries_covered: initialData.countries_covered || 1,
                status: initialData.status || 'active',
                student_visible: initialData.student_visible ?? true,
                processing_difficulty: initialData.processing_difficulty || 'Medium',
                work_rights: initialData.work_rights ?? true,
                high_approval: initialData.high_approval ?? true,
                popularity: initialData.popularity || 0
            });
        } else if (open && mode === 'add') {
            setFormData({
                visa_id: '',
                visa_type: '',
                category: 'Study',
                countries_covered: 1,
                status: 'active',
                student_visible: true,
                processing_difficulty: 'Medium',
                work_rights: true,
                high_approval: true,
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
            if (!formData.visa_type || !formData.category) {
                toast.error("Visa Type and Category are required");
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
            toast.success(mode === 'edit' ? "Visa details updated successfully" : "Visa type added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to save visa details");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar-light">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            {mode === 'edit' ? <Award className="text-blue-700" size={24} /> : <Plus className="text-blue-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit Visa Type' : 'Add New Visa Type'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the visa processing pathway.' : 'Enter the details of the new visa type to add it to the services list.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reference ID (visa_id) */}
                        <div className="space-y-2">
                            <Label htmlFor="visa_id" className="text-sm font-medium text-gray-700">
                                Reference ID (e.g. VIS-001)
                            </Label>
                            <Input
                                id="visa_id"
                                value={formData.visa_id}
                                onChange={(e) => handleChange('visa_id', e.target.value)}
                                placeholder="Auto-generated if left blank"
                            />
                        </div>

                        {/* Visa Type */}
                        <div className="space-y-2">
                            <Label htmlFor="visa_type" className="text-sm font-medium text-gray-700">
                                Visa Type <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="visa_type"
                                value={formData.visa_type}
                                onChange={(e) => handleChange('visa_type', e.target.value)}
                                placeholder="e.g. Student Visa (F-1)"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.category} onValueChange={(val: any) => handleChange('category', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Study">Study</SelectItem>
                                    <SelectItem value="Work">Work</SelectItem>
                                    <SelectItem value="Dependent">Dependent</SelectItem>
                                    <SelectItem value="Visitor">Visitor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Processing Difficulty */}
                        <div className="space-y-2">
                            <Label htmlFor="processing_difficulty" className="text-sm font-medium text-gray-700">
                                Processing Difficulty
                            </Label>
                            <Select value={formData.processing_difficulty} onValueChange={(val: any) => handleChange('processing_difficulty', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
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
                                    min="1"
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
                            {/* Work Rights */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="text-blue-600" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">Work Rights</div>
                                        <div className="text-[10px] text-gray-500 italic">Includes right to work?</div>
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.work_rights}
                                    onCheckedChange={(val) => handleChange('work_rights', val)}
                                />
                            </div>

                            {/* High Approval */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="text-green-600" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">High Approval</div>
                                        <div className="text-[10px] text-gray-500 italic">Consistently high rates?</div>
                                    </div>
                                </div>
                                <Switch
                                    checked={formData.high_approval}
                                    onCheckedChange={(val) => handleChange('high_approval', val)}
                                />
                            </div>
                        </div>

                        {/* Student Visibility */}
                        <div className="md:col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                {formData.student_visible ? <Eye className="text-blue-600" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                                <div>
                                    <div className="text-sm font-bold text-gray-700">Visible to Students</div>
                                    <div className="text-xs text-gray-500">Toggle if students can see this path</div>
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
                                    {mode === 'edit' ? 'Update Visa' : 'Add Visa Type'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
