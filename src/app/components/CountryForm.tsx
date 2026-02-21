"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { CountryFormData, createCountry, updateCountry } from '@/services/countriesService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountryFormProps {
    initialData?: CountryFormData;
    countryId?: string;
    isEdit?: boolean;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const CountryForm: React.FC<CountryFormProps> = ({
    initialData,
    countryId,
    isEdit = false,
    onSuccess,
    onCancel
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CountryFormData>(initialData || {
        country_name: '',
        country_code: '',
        region: '',
        visa_difficulty: 'Medium',
        cost_of_living: 'Medium',
        status: 'Active',
        visible: true,
        service_availability: {
            visa: true,
            insurance: true,
            housing: true,
            loans: true,
            forex: true,
            courses: true,
            food: true
        }
    });

    const handleChange = (field: keyof CountryFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleServiceChange = (service: keyof CountryFormData['service_availability'], checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            service_availability: {
                ...prev.service_availability,
                [service]: checked
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit && countryId) {
                await updateCountry(countryId, formData);
                toast.success('Country updated successfully');
            } else {
                await createCountry(formData);
                toast.success('Country created successfully');
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/countries');
            }
        } catch (error) {
            console.error('Error saving country:', error);
            toast.error('Failed to save country');
        } finally {
            setLoading(false);
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
                        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Country' : 'Add New Country'}</h1>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className={`space-y-6 ${!onCancel ? "bg-white p-8 rounded-xl shadow-sm border border-gray-100" : ""}`}>

                {/* Basic Information */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="country_name">Country Name</Label>
                            <Input
                                id="country_name"
                                value={formData.country_name}
                                onChange={(e) => handleChange('country_name', e.target.value)}
                                required
                                placeholder="e.g. United States"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country_code">Country Code (ISO)</Label>
                            <Input
                                id="country_code"
                                value={formData.country_code}
                                onChange={(e) => handleChange('country_code', e.target.value.toUpperCase())}
                                required
                                placeholder="e.g. US"
                                maxLength={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="region">Region</Label>
                            <Select value={formData.region} onValueChange={(value) => handleChange('region', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="North America">North America</SelectItem>
                                    <SelectItem value="South America">South America</SelectItem>
                                    <SelectItem value="Europe">Europe</SelectItem>
                                    <SelectItem value="Asia">Asia</SelectItem>
                                    <SelectItem value="Africa">Africa</SelectItem>
                                    <SelectItem value="Oceania">Oceania</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Factors */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Living Factors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="visa_difficulty">Visa Difficulty</Label>
                            <Select value={formData.visa_difficulty} onValueChange={(value) => handleChange('visa_difficulty', value)}>
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

                        <div className="space-y-2">
                            <Label htmlFor="cost_of_living">Cost of Living</Label>
                            <Select value={formData.cost_of_living} onValueChange={(value) => handleChange('cost_of_living', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select cost" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Service Availability */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Service Availability</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(formData.service_availability).map(([key, value]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`service-${key}`}
                                    checked={value}
                                    onCheckedChange={(checked) => handleServiceChange(key as keyof CountryFormData['service_availability'], checked as boolean)}
                                />
                                <Label htmlFor={`service-${key}`} className="capitalize cursor-pointer">{key}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-end gap-3">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={loading} className="w-full md:w-auto min-w-[150px]">
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Country
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    );
};
