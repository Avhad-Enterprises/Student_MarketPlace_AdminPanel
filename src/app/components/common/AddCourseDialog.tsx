import React, { useState, useEffect } from 'react';
import { Loader2, Plus, BookOpen, Globe, Zap, Eye, EyeOff, ShieldCheck, DollarSign, Clock, Star, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Course } from "@/app/services/courseService";

export interface AddCourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Course | null;
    mode?: 'add' | 'edit';
}

export const AddCourseDialog: React.FC<AddCourseDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = 'add'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        reference_id: '',
        course_name: '',
        provider: '',
        category: 'Certification',
        duration: '',
        avg_cost: '',
        countries_covered: 0,
        status: 'active' as 'active' | 'inactive',
        student_visible: true,
        popularity: 1,
        learners_count: 0,
        rating: 0,
    });

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setFormData({
                reference_id: initialData.reference_id || '',
                course_name: initialData.course_name || '',
                provider: initialData.provider || '',
                category: initialData.category || 'Certification',
                duration: initialData.duration || '',
                avg_cost: initialData.avg_cost || '',
                countries_covered: initialData.countries_covered || 0,
                status: initialData.status || 'active',
                student_visible: initialData.student_visible ?? true,
                popularity: initialData.popularity || 0,
                learners_count: initialData.learners_count || 0,
                rating: initialData.rating || 0
            });
        } else if (open && mode === 'add') {
            setFormData({
                reference_id: '',
                course_name: '',
                provider: '',
                category: 'Certification',
                duration: '',
                avg_cost: '',
                countries_covered: 0,
                status: 'active',
                student_visible: true,
                popularity: 1,
                learners_count: 0,
                rating: 0
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
            if (!formData.course_name || !formData.provider || !formData.category) {
                toast.error("Course Name, Provider, and Category are required");
                setIsLoading(false);
                return;
            }

            const submittableData = {
                ...formData,
                countries_covered: Number(formData.countries_covered),
                popularity: Number(formData.popularity),
                learners_count: Number(formData.learners_count),
                rating: Number(formData.rating)
            };

            await onSave(submittableData);
            toast.success(mode === 'edit' ? "Course updated successfully" : "Course added successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to save course details";
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
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            {mode === 'edit' ? <BookOpen className="text-indigo-700" size={24} /> : <Plus className="text-indigo-700" size={24} />}
                        </div>
                        {mode === 'edit' ? 'Edit Course' : 'Add New Course'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update the details of the educational course.' : 'Enter the details of the new course or certification program.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="reference_id" className="text-sm font-medium text-gray-700">
                                Reference ID (e.g. CRS-001)
                            </Label>
                            <Input
                                id="reference_id"
                                value={formData.reference_id}
                                onChange={(e) => handleChange('reference_id', e.target.value)}
                                placeholder="Auto-generated if left blank"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="course_name" className="text-sm font-medium text-gray-700">
                                Course Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="course_name"
                                value={formData.course_name}
                                onChange={(e) => handleChange('course_name', e.target.value)}
                                placeholder="e.g. Full Stack Web Dev"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="provider" className="text-sm font-medium text-gray-700">
                                Provider <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="provider"
                                value={formData.provider}
                                onChange={(e) => handleChange('provider', e.target.value)}
                                placeholder="e.g. Coursera, Udemy"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.category} onValueChange={(val: any) => handleChange('category', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Certification">Certification</SelectItem>
                                    <SelectItem value="Degree">Degree</SelectItem>
                                    <SelectItem value="Bootcamp">Bootcamp</SelectItem>
                                    <SelectItem value="Short Course">Short Course</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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
                                    placeholder="e.g. 6 Months"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="avg_cost" className="text-sm font-medium text-gray-700">
                                Avg Cost
                            </Label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="avg_cost"
                                    value={formData.avg_cost}
                                    onChange={(e) => handleChange('avg_cost', e.target.value)}
                                    className="pl-9"
                                    placeholder="e.g. $49 or Free"
                                />
                            </div>
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
                                    min="0"
                                />
                            </div>
                        </div>

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

                        <div className="space-y-2">
                            <Label htmlFor="learners_count" className="text-sm font-medium text-gray-700">
                                Learners Count
                            </Label>
                            <div className="relative">
                                <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="learners_count"
                                    type="number"
                                    value={formData.learners_count}
                                    onChange={(e) => handleChange('learners_count', e.target.value)}
                                    className="pl-9"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rating" className="text-sm font-medium text-gray-700">
                                Rating (0-5.0)
                            </Label>
                            <div className="relative">
                                <Star size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="rating"
                                    type="number"
                                    step="0.1"
                                    value={formData.rating}
                                    onChange={(e) => handleChange('rating', e.target.value)}
                                    className="pl-9"
                                    min="0"
                                    max="5"
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

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 mt-6">
                            <div className="flex items-center gap-2">
                                {formData.student_visible ? <Eye className="text-indigo-600" size={18} /> : <EyeOff className="text-gray-400" size={18} />}
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
                                    {mode === 'edit' ? 'Update Course' : 'Add Course'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
