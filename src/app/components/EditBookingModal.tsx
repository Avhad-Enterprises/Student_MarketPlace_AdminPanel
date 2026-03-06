"use client";

import React, { useState, useEffect } from 'react';
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
import { bookingService, Booking } from '../../services/bookingService';
import { toast } from "sonner";
import { CalendarIcon, Clock, User, Briefcase, MapPin, Activity } from 'lucide-react';
import { format } from "date-fns";

interface EditBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    booking: Booking | null;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({ isOpen, onClose, onSuccess, booking }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<Booking>>({});

    useEffect(() => {
        if (booking) {
            setFormData({
                ...booking,
                // Ensure date_time is in the format expected by datetime-local input
                date_time: booking.date_time ? format(new Date(booking.date_time), "yyyy-MM-dd'T'HH:mm") : ""
            });
        }
    }, [booking]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.student_name || !formData.expert || !booking?.booking_id) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            await bookingService.updateBooking(booking.booking_id, formData);
            toast.success("Booking updated successfully");
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error("Failed to update booking");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof Booking, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[24px]">
                <div className="bg-[#0e042f] p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <CalendarIcon size={24} className="text-purple-400" />
                            </div>
                            Edit Booking Information
                        </DialogTitle>
                        <p className="text-purple-200/60 mt-1 text-sm">Update the details for this student session.</p>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-6 bg-white space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Activity size={14} /> Booking ID
                            </Label>
                            <Input
                                value={formData.booking_id || ''}
                                disabled
                                className="h-11 rounded-xl border-gray-100 bg-gray-50/50 cursor-not-allowed font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Clock size={14} /> Date & Time
                            </Label>
                            <Input
                                type="datetime-local"
                                value={formData.date_time || ''}
                                onChange={(e) => handleChange('date_time', e.target.value)}
                                className="h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                                required
                            />
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
                            <Briefcase size={14} /> Service Type
                        </Label>
                        <Select
                            value={formData.service}
                            onValueChange={(value) => handleChange('service', value)}
                        >
                            <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all">
                                <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Initial Consultation">Initial Consultation</SelectItem>
                                <SelectItem value="Visa Interview Prep">Visa Interview Prep</SelectItem>
                                <SelectItem value="Document Review">Document Review</SelectItem>
                                <SelectItem value="Application Support">Application Support</SelectItem>
                                <SelectItem value="SOP Review">SOP Review</SelectItem>
                                <SelectItem value="University Selection">University Selection</SelectItem>
                                <SelectItem value="Concierge Request">Concierge Request</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <User size={14} /> Assigned Expert
                        </Label>
                        <Input
                            value={formData.expert || ''}
                            onChange={(e) => handleChange('expert', e.target.value)}
                            placeholder="Search or enter expert name"
                            className="h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <MapPin size={14} /> Mode
                            </Label>
                            <Select
                                value={formData.mode}
                                onValueChange={(value) => handleChange('mode', value)}
                            >
                                <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all">
                                    <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Online">Online</SelectItem>
                                    <SelectItem value="In-Person">In-Person</SelectItem>
                                    <SelectItem value="Call">Phone Call</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Activity size={14} /> Booking Status
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleChange('status', value as any)}
                            >
                                <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="no-show">No-show</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-gray-50 gap-3">
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
                            {isSubmitting ? "Updating..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
