"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select";
import { enquiryService, Enquiry } from '../../services/enquiryService';
import { toast } from "sonner";
import { MessageSquare, User, Mail, FileText, AlertCircle, Activity } from 'lucide-react';

interface AddEnquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddEnquiryModal: React.FC<AddEnquiryModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<Enquiry>>({
        priority: 'medium',
        status: 'new'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.student_name || !formData.email || !formData.subject || !formData.enquiry_id) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            await enquiryService.createEnquiry(formData as Enquiry);
            toast.success("Enquiry created successfully");
            onSuccess();
            onClose();
            setFormData({ priority: 'medium', status: 'new' });
        } catch (error) {
            console.error('Error creating enquiry:', error);
            toast.error("Failed to create enquiry");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof Enquiry, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[24px]">
                <div className="bg-[#0e042f] p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <MessageSquare size={24} className="text-purple-400" />
                            </div>
                            New Enquiry
                        </DialogTitle>
                        <p className="text-purple-200/60 mt-1 text-sm">Create a new student enquiry manually.</p>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="bg-white flex flex-col max-h-[80vh]">
                    <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Activity size={14} /> Enquiry ID
                                </Label>
                                <Input
                                    value={formData.enquiry_id || ''}
                                    onChange={(e) => handleChange('enquiry_id', e.target.value)}
                                    placeholder="e.g. ENQ-001"
                                    className="h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <AlertCircle size={14} /> Priority
                                </Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => handleChange('priority', value as any)}
                                >
                                    <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <User size={14} /> Student Name
                            </Label>
                            <Input
                                value={formData.student_name || ''}
                                onChange={(e) => handleChange('student_name', e.target.value)}
                                placeholder="Enter full name"
                                className="h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Mail size={14} /> Email Address
                            </Label>
                            <Input
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="student@example.com"
                                className="h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={14} /> Subject
                            </Label>
                            <Input
                                value={formData.subject || ''}
                                onChange={(e) => handleChange('subject', e.target.value)}
                                placeholder="Enquiry subject"
                                className="h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle size={14} /> Message (Optional)
                            </Label>
                            <textarea
                                value={formData.message || ''}
                                onChange={(e) => handleChange('message', e.target.value)}
                                placeholder="Enter enquiry details..."
                                className="w-full min-h-[100px] p-3 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all outline-none text-sm"
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-gray-50 gap-3 bg-gray-50/30">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="h-12 flex-1 rounded-xl border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 flex-[1.5] rounded-xl bg-[#0e042f] text-white font-bold hover:bg-[#1a0c4a] transition-all shadow-lg shadow-purple-900/10"
                        >
                            {isSubmitting ? "Creating..." : "Create Enquiry"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
