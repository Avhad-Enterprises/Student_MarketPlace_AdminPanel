import React, { useState, useEffect } from 'react';
import { Loader2, Plus, User, MapPin, Building2, Sparkles, CheckCircle, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SOP } from '@/services/sopAssistantService';

export interface SOPFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: Partial<SOP>) => Promise<void>;
    initialData?: SOP | null;
    mode?: 'add' | 'edit';
}

export const SOPFormDialog: React.FC<SOPFormDialogProps> = ({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<SOP>>({
        studentName: '',
        country: '',
        university: '',
        reviewStatus: 'Draft',
        aiConfidenceScore: '0%',
        status: 'active'
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                studentName: initialData.studentName || '',
                country: initialData.country || '',
                university: initialData.university || '',
                reviewStatus: initialData.reviewStatus || 'Draft',
                aiConfidenceScore: initialData.aiConfidenceScore || '0%',
                status: initialData.status || 'active'
            });
        } else if (open && mode === 'add') {
            setFormData({
                studentName: '',
                country: '',
                university: '',
                reviewStatus: 'Draft',
                aiConfidenceScore: '0%',
                status: 'active'
            });
        }
    }, [open, mode, initialData]);

    const handleChange = (field: keyof SOP, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!formData.studentName || !formData.country || !formData.university) {
                toast.error("Please fill in all required fields");
                setIsLoading(false);
                return;
            }

            await onSubmit(formData);
            toast.success(mode === 'edit' ? "SOP updated successfully" : "SOP added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error || error.response?.data?.message || "Failed to save SOP";
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
                            {mode === 'edit' ? <FileText className="text-purple-700" size={24} /> : <Plus className="text-purple-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit SOP Record' : 'Add New SOP'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the student SOP record.' : 'Enter the details of the new SOP to track it in the assistant.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Student Name */}
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">
                                Student Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="studentName"
                                    value={formData.studentName}
                                    onChange={(e) => handleChange('studentName', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                                Target Country <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. Canada"
                                />
                            </div>
                        </div>

                        {/* University */}
                        <div className="space-y-2">
                            <Label htmlFor="university" className="text-sm font-medium text-gray-700">
                                University <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="university"
                                    value={formData.university}
                                    onChange={(e) => handleChange('university', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. University of Toronto"
                                />
                            </div>
                        </div>

                        {/* Review Status */}
                        <div className="space-y-2">
                            <Label htmlFor="reviewStatus" className="text-sm font-medium text-gray-700">
                                Review Status
                            </Label>
                            <Select value={formData.reviewStatus} onValueChange={(val) => handleChange('reviewStatus', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Under Review">Under Review</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* AI Score */}
                        <div className="space-y-2">
                            <Label htmlFor="aiConfidenceScore" className="text-sm font-medium text-gray-700">
                                AI Confidence Score
                            </Label>
                            <div className="relative">
                                <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="aiConfidenceScore"
                                    value={formData.aiConfidenceScore}
                                    onChange={(e) => handleChange('aiConfidenceScore', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. 85%"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                System Status
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
                                    {mode === 'edit' ? 'Update SOP' : 'Add SOP'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
