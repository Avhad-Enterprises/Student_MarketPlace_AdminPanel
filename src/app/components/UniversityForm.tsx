"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Building2, MapPin, DollarSign, GraduationCap, Globe, ArrowLeft, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { universityService } from '@/services/universityService';

export interface UniversityFormProps {
    initialData?: any;
    isEdit?: boolean;
    onSuccess?: () => void;
    onCancel?: () => void;
    onAdd?: (data: any) => Promise<void>; // Backwards compatibility for dialog
}

export const UniversityForm: React.FC<UniversityFormProps> = ({
    initialData,
    isEdit = false,
    onSuccess,
    onCancel,
    onAdd
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        country: '',
        tuition: '',
        acceptanceRate: '',
        type: 'Public',
        applicationStatus: 'open',
        status: 'active'
    });

    React.useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                name: initialData.name || '',
                city: initialData.city || '',
                country: initialData.country || '',
                tuition: initialData.tuition || '',
                acceptanceRate: initialData.acceptanceRate || '',
                type: initialData.type || 'Public',
                applicationStatus: initialData.applicationStatus || 'open',
                status: initialData.status || 'active'
            });
        }
    }, [isEdit, initialData]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate
            if (!formData.name || !formData.city || !formData.country) {
                toast.error("Please fill in all required fields");
                setIsLoading(false);
                return;
            }

            if (onAdd) {
                await onAdd(formData);
            } else {
                if (isEdit) {
                    toast.error("Edit mode not implemented for full page yet");
                } else {
                    await universityService.create(formData);
                    toast.success("University added successfully");
                }
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/universities');
            }
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.error || error.response?.data?.message || "Failed to save university";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            router.back();
        }
    };

    return (
        <div className="w-full">
            {!onCancel && (
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">{isEdit ? 'Edit University' : 'Add New University'}</h1>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className={`space-y-6 ${!onCancel ? "bg-white p-8 rounded-xl shadow-sm border border-gray-100" : "pt-4"}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            University Name <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="pl-9"
                                placeholder="e.g. Harvard University"
                                required
                            />
                        </div>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                            City <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className="pl-9"
                                placeholder="e.g. Cambridge"
                                required
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                            Country <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => handleChange('country', e.target.value)}
                                className="pl-9"
                                placeholder="e.g. USA"
                                required
                            />
                        </div>
                    </div>

                    {/* Tuition */}
                    <div className="space-y-2">
                        <Label htmlFor="tuition" className="text-sm font-medium text-gray-700">
                            Tuition Fees
                        </Label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="tuition"
                                value={formData.tuition}
                                onChange={(e) => handleChange('tuition', e.target.value)}
                                className="pl-9"
                                placeholder="e.g. $50,000/year"
                            />
                        </div>
                    </div>

                    {/* Acceptance Rate */}
                    <div className="space-y-2">
                        <Label htmlFor="acceptanceRate" className="text-sm font-medium text-gray-700">
                            Acceptance Rate
                        </Label>
                        <div className="relative">
                            <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="acceptanceRate"
                                value={formData.acceptanceRate}
                                onChange={(e) => handleChange('acceptanceRate', e.target.value)}
                                className="pl-9"
                                placeholder="e.g. 5.2%"
                            />
                        </div>
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                            Institution Type
                        </Label>
                        <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Public">Public</SelectItem>
                                <SelectItem value="Private">Private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Application Status */}
                    <div className="space-y-2">
                        <Label htmlFor="applicationStatus" className="text-sm font-medium text-gray-700">
                            Application Status
                        </Label>
                        <Select value={formData.applicationStatus} onValueChange={(val) => handleChange('applicationStatus', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                            System Status
                        </Label>
                        <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="disabled">Disabled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                    {onCancel && (
                        <Button variant="outline" type="button" onClick={handleCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" className="bg-[#0e042f] hover:bg-[#1a0c4a] text-white min-w-[150px]" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isEdit ? 'Updating...' : 'Adding...'}
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {isEdit ? 'Update University' : 'Add University'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};
