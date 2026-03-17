"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, Save, FileText, Globe, School, Calendar, UserCheck, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createApplication, CreateApplicationData } from '@/app/services/applicationsService';
import { getAllStudents, Student } from '@/app/services/studentsService';
import { getAllUniversities, University } from '@/app/services/universitiesService';

interface AddApplicationPageProps {
  onNavigate?: (page: string) => void;
}

export const AddApplicationPage: React.FC<AddApplicationPageProps> = ({ onNavigate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateApplicationData>({
    studentDbId: '',
    universityName: '',
    country: '',
    intake: '',
    status: 'in-progress',
    counselor: '',
    notes: ''
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, univsRes] = await Promise.all([
          getAllStudents({ limit: 100 }),
          getAllUniversities({ limit: 100 })
        ]);
        setStudents(studentsRes.data || []);
        setUniversities(univsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch prerequisite data", error);
        toast.error("Failed to load students or universities");
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentDbId) newErrors.studentDbId = 'Student is required';
    if (!formData.universityName) newErrors.universityName = 'University is required';
    if (!formData.country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CreateApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-fill country when university changes
    if (field === 'universityName') {
      const selectedUniv = universities.find(u => u.name === value);
      if (selectedUniv) {
        setFormData(prev => ({ ...prev, country: selectedUniv.country_name || '' }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      await createApplication(formData);
      toast.success('Application created successfully');
      setIsSubmitting(false);
      onNavigate?.('students-applications'); // Navigate back
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error?.message || error.response?.data?.message || "Failed to create application";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = formData.studentDbId !== '' || formData.universityName !== '' || formData.notes !== '';
    if (hasChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) return;
    }
    onNavigate?.('students-applications');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f9fb] custom-scrollbar-light">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-[#62748e] hover:text-[#0f172b] mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium text-sm sm:text-base">Back to Applications</span>
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-[32px] font-bold text-[#0f172b] mb-1 sm:mb-2">Add New Application</h1>
              <p className="text-sm sm:text-base text-[#62748e]">Create a new application record for a student.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} className="h-12 px-6 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-12 px-6 bg-[#0e042f] hover:bg-[#1a0c4a] text-white rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Application
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileText size={16} className="text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-[#0f172b]">General Information</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Student <span className="text-red-500">*</span></Label>
                  <Select value={formData.studentDbId} onValueChange={(val) => handleChange('studentDbId', val)}>
                    <SelectTrigger className={`rounded-xl h-11 ${errors.studentDbId ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.first_name} {student.last_name} ({student.student_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.studentDbId && (
                    <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.studentDbId}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">University <span className="text-red-500">*</span></Label>
                    <Select value={formData.universityName} onValueChange={(val) => handleChange('universityName', val)}>
                      <SelectTrigger className={`rounded-xl h-11 ${errors.universityName ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select a university" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities.map((univ) => (
                          <SelectItem key={univ.id} value={univ.name}>
                            {univ.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.universityName && (
                      <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.universityName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        placeholder="Country (Auto-filled)"
                        className={`rounded-xl h-11 pl-9 ${errors.country ? 'border-red-500' : ''}`}
                        readOnly
                      />
                    </div>
                    {errors.country && (
                      <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.country}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intake">Intake Period</Label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="intake"
                      value={formData.intake}
                      onChange={(e) => handleChange('intake', e.target.value)}
                      placeholder="e.g. Sep 2024"
                      className="rounded-xl h-11 pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MessageSquare size={16} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-[#0f172b]">Additional Details</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes/Remarks</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Enter any notes about the application..."
                  className="rounded-xl min-h-[120px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Status & Assignment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-[#0f172b] mb-4">Status & Assignment</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Application Status</Label>
                  <Select value={formData.status} onValueChange={(val: any) => handleChange('status', val)}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="decision-received">Decision Received</SelectItem>
                      <SelectItem value="pending-docs">Pending Docs</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="counselor">Assigned Counselor</Label>
                  <div className="relative">
                    <UserCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="counselor"
                      value={formData.counselor}
                      onChange={(e) => handleChange('counselor', e.target.value)}
                      placeholder="Counselor Name"
                      className="rounded-xl h-11 pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
