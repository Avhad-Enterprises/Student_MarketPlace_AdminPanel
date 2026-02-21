"use client";

import React from 'react';
import { DatePickerWithRange } from "./ui/date-range-picker";
import { useState } from 'react';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

// --- MetricCard Component ---
interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendColor: 'green' | 'red';
  graphPath: string;
  graphColor: string;
  graphViewBox?: string;
}

const MetricCard = ({
  title,
  value,
  trend,
  trendColor,
  graphPath,
  graphColor,
  graphViewBox = "0 0 71 15"
}: MetricCardProps) => {
  return (
    <div className="bg-white rounded-[14px] p-5 shadow-sm border border-slate-100 relative overflow-hidden h-[154px] flex flex-col justify-between">
      {/* Top: Title + Value */}
      <div className="space-y-2 relative z-10">
        <h3 className="text-xs font-bold text-[#62748e] uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-2xl font-bold text-[#0f172b]">
          {value}
        </p>
      </div>

      {/* Bottom: Trend + Chart */}
      <div className="flex items-end justify-between relative z-10">
        <div className="flex items-center gap-1.5">
          {/* Trend Arrow */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {trendColor === 'green' ? (
              <>
                <path d="M4.66667 11.3333L11.3333 4.66667" stroke="#00BC7D" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.66667 4.66667H11.3333V11.3333" stroke="#00BC7D" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
              </>
            ) : (
              <>
                <path d="M4.66667 4.66667L11.3333 11.3333" stroke="#FF2056" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.3333 4.66667V11.3333H4.66667" stroke="#FF2056" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}
          </svg>
          <span className={`text-xs font-bold ${trendColor === 'green' ? 'text-[#00bc7d]' : 'text-[#ff2056]'}`}>
            {trend}
          </span>
        </div>

        {/* Mini Chart */}
        <div className="w-[80px] h-[40px] relative">
          <svg className="w-full h-full" viewBox={graphViewBox} fill="none" preserveAspectRatio="none">
            <path d={graphPath} stroke={graphColor} strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// --- AnnouncementItem Component ---
interface AnnouncementItemProps {
  color: 'blue' | 'yellow' | 'emerald' | 'purple';
  title: string;
  time: string;
  desc: string;
}

const AnnouncementItem = ({ color, title, time, desc }: AnnouncementItemProps) => {
  const colorMap: Record<string, { bg: string; text: string; letter: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', letter: 'S' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', letter: 'M' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', letter: 'U' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', letter: 'P' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
      {/* Icon Circle */}
      <div className={`${c.bg} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
        <span className={`${c.text} font-bold text-sm`}>{c.letter}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1d293d] truncate">{title}</h4>
          <span className="text-[10px] text-[#90a1b9] whitespace-nowrap">{time}</span>
        </div>
        <p className="text-xs text-[#62748e] mt-0.5 truncate">{desc}</p>
      </div>

      {/* Three-Dot Menu */}
      <button className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-slate-500">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="1" fill="currentColor" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
          <circle cx="4" cy="8" r="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};

// --- InsightItem Component ---
interface InsightItemProps {
  img: string;
  title: string;
  time: string;
  desc: string;
}

const InsightItem = ({ img, title, time, desc }: InsightItemProps) => {
  return (
    <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
      {/* Image Thumbnail */}
      <div className="w-10 h-10 rounded-[10px] bg-slate-100 shrink-0 overflow-hidden">
        <img src={img} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1d293d] truncate">{title}</h4>
          <span className="text-[10px] text-[#90a1b9] whitespace-nowrap">{time}</span>
        </div>
        <p className="text-xs text-[#62748e] mt-0.5 truncate">{desc}</p>
      </div>

      {/* Three-Dot Menu */}
      <button className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-slate-500">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="1" fill="currentColor" />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
          <circle cx="4" cy="8" r="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};

// --- Main AdminDashboardPage Component ---
interface AdminDashboardPageProps {
  onNavigate?: (view: string) => void;
}

export const AdminDashboardPage = ({ onNavigate }: AdminDashboardPageProps) => {
  // State management for date picker
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31)
  });

  const handleRefresh = () => {
    toast.success('Data refreshed successfully!');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">

      {/* Desktop Action Bar */}
      <div className="hidden md:flex justify-between items-center gap-4 mb-8">
        {/* Left: Date Picker */}
        <div className="bg-white px-2 h-[50px] rounded-xl shadow-sm border border-gray-100 flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <CalendarIcon size={20} className="text-[#253154]" />
                <span className="font-medium text-[#253154] text-[14px]">
                  {date?.from && date?.to
                    ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}`
                    : 'Select date range'}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <div className="w-px h-4 bg-gray-200 mx-2" />
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-50 rounded-full transition-all hover:rotate-180 duration-500"
          >
            <RefreshCw size={20} className="text-[#253154]" />
          </button>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="flex md:hidden flex-col gap-4 mb-6">
        {/* Date Range Pill */}
        <div className="w-full h-[50px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <CalendarIcon size={18} className="text-[#253154]" />
            <span className="text-sm font-medium text-[#253154]">
              {date?.from && date?.to
                ? `${format(date.from, 'd MMM')} - ${format(date.to, 'd MMM')}`
                : 'Select range'}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors active:rotate-180 active:duration-500"
          >
            <RefreshCw size={18} className="text-[#253154]" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8 pb-10">

        {/* Section 2: Metrics Grid (5 KPI Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <MetricCard
            title="Active Users"
            value="12,847"
            trend="15.3%"
            trendColor="green"
            graphPath="M0 8L14.2 6.8L28.4 9.2L42.6 7.4L56.8 10.6L71 4"
            graphColor="#8884D8"
            graphViewBox="0 0 71 15"
          />
          <MetricCard
            title="API Calls"
            value="2.4M"
            trend="23.1%"
            trendColor="green"
            graphPath="M0 15L14.4 12L28.8 8L43.2 4L57.6 2L72 0"
            graphColor="#82CA9D"
            graphViewBox="0 0 72 22"
          />
          <MetricCard
            title="New Registrations"
            value="847"
            trend="3.7%"
            trendColor="red"
            graphPath="M0 4L14.2 6L28.4 3L42.6 8L56.8 5L71 10"
            graphColor="#FFC658"
            graphViewBox="0 0 71 15"
          />
          <MetricCard
            title="Failed Requests"
            value="127"
            trend="8.9%"
            trendColor="green"
            graphPath="M0 18L14.4 14L28.8 10L43.2 6L57.6 3L72 0"
            graphColor="#FF8042"
            graphViewBox="0 0 72 23"
          />
          <MetricCard
            title="Storage Used"
            value="847 GB"
            trend="4.2%"
            trendColor="red"
            graphPath="M0 8L14.4 12L28.8 7L43.2 15L57.6 10L72 16"
            graphColor="#FF6B6B"
            graphViewBox="0 0 72 21"
          />
        </div>

        {/* Section 3: Announcements & System Insights (Two-Column Grid) */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column: System Alerts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-[#1d293d]">System Alerts</h3>
              <button className="text-sm font-bold text-[#4f39f6] hover:text-[#3d2cdb]">
                See All
              </button>
            </div>
            <div className="space-y-1">
              <AnnouncementItem
                color="blue"
                title="Security Patch Available"
                time="1 hour ago"
                desc="Critical security update ready for deployment."
              />
              <AnnouncementItem
                color="yellow"
                title="Scheduled Maintenance"
                time="3 hours ago"
                desc="Database maintenance window at 2:00 AM UTC."
              />
              <AnnouncementItem
                color="emerald"
                title="System Upgrade Complete"
                time="1 day ago"
                desc="Application upgraded to v2.5.0 successfully."
              />
              <AnnouncementItem
                color="purple"
                title="Policy Update Required"
                time="2 days ago"
                desc="New data retention policy requires admin review."
              />
            </div>
          </div>

          {/* Right Column: Performance Insights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-[#1d293d]">Performance Insights</h3>
              <button className="text-sm font-bold text-[#4f39f6] hover:text-[#3d2cdb]">
                See All
              </button>
            </div>
            <div className="space-y-1">
              <InsightItem
                img="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400"
                title="Server Load High"
                time="30 min ago"
                desc="CPU usage at 87% on primary servers."
              />
              <InsightItem
                img="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400"
                title="Database Performance"
                time="2 hours ago"
                desc="Query response time improved by 15%."
              />
              <InsightItem
                img="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
                title="Traffic Spike Detected"
                time="5 hours ago"
                desc="Unusual traffic pattern from APAC region."
              />
              <InsightItem
                img="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"
                title="Backup Completed"
                time="1 day ago"
                desc="Daily backup finished successfully at 3:15 AM."
              />
            </div>
          </div>

        </div>

        {/* Section 4: New Admin Users Banner */}
        <div className="bg-white rounded-[14px] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: Stats */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-[#1d293d]">
                New Admin Users This Week
              </h3>
              <div className="bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3.5 3.5H8.5V8.5" stroke="#00BC7D" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.5 8.5L8.5 3.5" stroke="#00BC7D" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-bold text-[#00bc7d]">18.5%</span>
              </div>
            </div>
            <p className="text-4xl font-bold text-[#0f172b]">247</p>
          </div>

          {/* Right: Avatars + CTA */}
          <div className="flex items-center gap-4">
            {/* Overlapping Avatars */}
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${1500000000000 + i * 10000000}?w=100&h=100&fit=crop&crop=faces`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                +242
              </div>
            </div>

            {/* CTA Button */}
            <button className="bg-app-primary-action hover:bg-app-primary-action-hover text-white px-6 py-2 rounded-full font-medium text-sm transition-colors">
              View All Users
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};