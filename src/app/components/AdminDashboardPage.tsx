"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Server, Database, Wallet, Shield, Users } from 'lucide-react';
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { GlobalDateFilter } from './common/GlobalDateFilter';
import { Skeleton } from './ui/skeleton';
import {
  getDashboardSummary,
  getDashboardAlerts,
  getDashboardInsights,
  getDashboardAdminUsers,
  DashboardSummary,
  DashboardAlert,
  DashboardInsight,
  DashboardAdminUsers,
} from '../services/dashboardService';

// ─── Sparkline ───────────────────────────────────────────────────────────────
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 80, h = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" preserveAspectRatio="none">
      <polyline points={pts} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── MetricCard ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  change: number;
  trend: number[];
  graphColor: string;
  loading?: boolean;
}

const MetricCard = ({ title, value, change, trend, graphColor, loading }: MetricCardProps) => {
  const isPositive = change >= 0;
  const trendColor = isPositive ? '#00bc7d' : '#ff2056';
  const arrowColor = trendColor;

  return (
    <div className="bg-white rounded-[14px] p-5 shadow-sm border border-slate-100 relative overflow-hidden h-[154px] flex flex-col justify-between">
      <div className="space-y-2 relative z-10">
        <h3 className="text-xs font-bold text-[#62748e] uppercase tracking-wider">{title}</h3>
        <div className="text-2xl font-bold text-[#0f172b]">
          {loading ? <Skeleton className="h-8 w-20" /> : value}
        </div>
      </div>
      <div className="flex items-end justify-between relative z-10">
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {isPositive ? (
              <>
                <path d="M4.66667 11.3333L11.3333 4.66667" stroke={arrowColor} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.66667 4.66667H11.3333V11.3333" stroke={arrowColor} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
              </>
            ) : (
              <>
                <path d="M4.66667 4.66667L11.3333 11.3333" stroke={arrowColor} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.3333 4.66667V11.3333H4.66667" stroke={arrowColor} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}
          </svg>
          <span className="text-xs font-bold" style={{ color: trendColor }}>
            {loading ? '...' : `${isPositive ? '+' : ''}${change}%`}
          </span>
        </div>
        <div className="w-[80px] h-[40px]">
          {loading ? (
            <Skeleton className="w-full h-full rounded" />
          ) : (
            <Sparkline data={trend} color={graphColor} />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── AlertItem ───────────────────────────────────────────────────────────────
const colorMap: Record<string, { bg: string; text: string; letter: string }> = {
  blue:    { bg: 'bg-blue-100',    text: 'text-blue-600',    letter: 'S' },
  yellow:  { bg: 'bg-yellow-100',  text: 'text-yellow-600',  letter: 'M' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', letter: 'U' },
  purple:  { bg: 'bg-purple-100',  text: 'text-purple-600',  letter: 'P' },
  red:     { bg: 'bg-red-100',     text: 'text-red-600',     letter: '!' },
};

const AlertItem = ({ alert }: { alert: DashboardAlert }) => {
  const c = colorMap[alert.color] || colorMap.blue;
  const elapsed = (() => {
    const ms = Date.now() - new Date(alert.timestamp).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? 's' : ''} ago`;
  })();

  return (
    <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
      <div className={`${c.bg} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
        <span className={`${c.text} font-bold text-sm`}>{c.letter}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1d293d] truncate">{alert.title}</h4>
          <span className="text-[10px] text-[#90a1b9] whitespace-nowrap">{elapsed}</span>
        </div>
        <p className="text-xs text-[#62748e] mt-0.5 truncate">{alert.description}</p>
      </div>
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

// ─── InsightItem ─────────────────────────────────────────────────────────────
const insightIconMap: Record<string, React.ReactNode> = {
  server:   <Server size={18} className="text-blue-500" />,
  database: <Database size={18} className="text-purple-500" />,
  wallet:   <Wallet size={18} className="text-orange-500" />,
  shield:   <Shield size={18} className="text-green-500" />,
};

const InsightItem = ({ insight }: { insight: DashboardInsight }) => {
  const elapsed = (() => {
    const ms = Date.now() - new Date(insight.timestamp).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? 's' : ''} ago`;
  })();

  return (
    <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
      <div className="w-10 h-10 rounded-[10px] bg-slate-100 shrink-0 flex items-center justify-center">
        {insightIconMap[insight.icon] || <Server size={18} className="text-slate-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1d293d] truncate">{insight.title}</h4>
          <span className="text-[10px] text-[#90a1b9] whitespace-nowrap">{elapsed}</span>
        </div>
        <p className="text-xs text-[#62748e] mt-0.5 truncate">{insight.description}</p>
      </div>
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

// ─── SkeletonList ─────────────────────────────────────────────────────────────
const SkeletonList = ({ count = 3 }: { count?: number }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex gap-4 p-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
interface AdminDashboardPageProps {
  onNavigate?: (view: string) => void;
}

export const AdminDashboardPage = ({ onNavigate }: AdminDashboardPageProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [summary,    setSummary]    = useState<DashboardSummary | null>(null);
  const [alerts,     setAlerts]     = useState<DashboardAlert[]>([]);
  const [insights,   setInsights]   = useState<DashboardInsight[]>([]);
  const [adminUsers, setAdminUsers] = useState<DashboardAdminUsers | null>(null);

  const [loadingSummary,    setLoadingSummary]    = useState(true);
  const [loadingAlerts,     setLoadingAlerts]     = useState(true);
  const [loadingInsights,   setLoadingInsights]   = useState(true);
  const [loadingAdminUsers, setLoadingAdminUsers] = useState(true);

  const fetchAll = useCallback(async (showToast = false) => {
    setLoadingSummary(true);
    setLoadingAlerts(true);
    setLoadingInsights(true);
    setLoadingAdminUsers(true);

    const results = await Promise.allSettled([
      getDashboardSummary(),
      getDashboardAlerts(),
      getDashboardInsights(),
      getDashboardAdminUsers(),
    ]);

    const [summaryResult, alertsResult, insightsResult, adminUsersResult] = results;

    if (summaryResult.status === 'fulfilled') setSummary(summaryResult.value);
    else toast.error('Failed to load metrics');
    setLoadingSummary(false);

    if (alertsResult.status === 'fulfilled') setAlerts(alertsResult.value);
    setLoadingAlerts(false);

    if (insightsResult.status === 'fulfilled') setInsights(insightsResult.value);
    setLoadingInsights(false);

    if (adminUsersResult.status === 'fulfilled') setAdminUsers(adminUsersResult.value);
    setLoadingAdminUsers(false);

    if (showToast) toast.success('Dashboard refreshed!');
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const isPositiveGrowth = (adminUsers?.growth ?? 0) >= 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar-light">

      {/* Desktop Action Bar */}
      <div className="hidden md:flex justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <GlobalDateFilter date={date} onDateChange={setDate} className="w-[300px]" />
          <button
            onClick={() => fetchAll(true)}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:rotate-180 duration-500 shadow-sm"
          >
            <RefreshCw size={20} className="text-[#253154]" />
          </button>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="flex md:hidden flex-col gap-4 mb-6">
        <div className="flex items-center gap-3">
          <GlobalDateFilter date={date} onDateChange={setDate} className="flex-1" />
          <button onClick={() => fetchAll(true)} className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <RefreshCw size={18} className="text-[#253154]" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8 pb-10">

        {/* ── Section 1: KPI Metric Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <MetricCard
            title="Total Students"
            value={summary?.students.total.toLocaleString() ?? '0'}
            change={summary?.students.change ?? 0}
            trend={summary?.students.trend ?? []}
            graphColor="#8884D8"
            loading={loadingSummary}
          />
          <MetricCard
            title="Active Applications"
            value={summary?.applications.total.toLocaleString() ?? '0'}
            change={summary?.applications.change ?? 0}
            trend={summary?.applications.trend ?? []}
            graphColor="#82CA9D"
            loading={loadingSummary}
          />
          <MetricCard
            title="Published Blogs"
            value={summary?.blogs.total.toLocaleString() ?? '0'}
            change={summary?.blogs.change ?? 0}
            trend={summary?.blogs.trend ?? []}
            graphColor="#FFC658"
            loading={loadingSummary}
          />
          <MetricCard
            title="Total Payments"
            value={summary?.payments.total.toLocaleString() ?? '0'}
            change={summary?.payments.change ?? 0}
            trend={summary?.payments.trend ?? []}
            graphColor="#FF8042"
            loading={loadingSummary}
          />
          <MetricCard
            title="Registered Users"
            value={summary?.users.total.toLocaleString() ?? '0'}
            change={summary?.users.change ?? 0}
            trend={summary?.users.trend ?? []}
            graphColor="#FF6B6B"
            loading={loadingSummary}
          />
        </div>

        {/* ── Section 2: Alerts & Insights ── */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* System Alerts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-[#1d293d]">System Alerts</h3>
              <button className="text-sm font-bold text-[#4f39f6] hover:text-[#3d2cdb]">See All</button>
            </div>
            <div className="space-y-1">
              {loadingAlerts ? (
                <SkeletonList count={3} />
              ) : alerts.length > 0 ? (
                alerts.map(alert => <AlertItem key={alert.id} alert={alert} />)
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No alerts at this time</p>
              )}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-[#1d293d]">Performance Insights</h3>
              <button className="text-sm font-bold text-[#4f39f6] hover:text-[#3d2cdb]">See All</button>
            </div>
            <div className="space-y-1">
              {loadingInsights ? (
                <SkeletonList count={4} />
              ) : insights.length > 0 ? (
                insights.map(insight => <InsightItem key={insight.id} insight={insight} />)
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No insights available</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Section 3: New Admin Users ── */}
        <div className="bg-white rounded-[14px] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: Stats */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-[#1d293d]">New Admin Users This Week</h3>
              {!loadingAdminUsers && adminUsers && (
                <div className={`px-2 py-1 rounded-full flex items-center gap-1 ${isPositiveGrowth ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    {isPositiveGrowth ? (
                      <>
                        <path d="M3.5 3.5H8.5V8.5" stroke="#00BC7D" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.5 8.5L8.5 3.5" stroke="#00BC7D" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    ) : (
                      <>
                        <path d="M3.5 8.5H8.5V3.5" stroke="#FF2056" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.5 3.5L8.5 8.5" stroke="#FF2056" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    )}
                  </svg>
                  <span className={`text-xs font-bold ${isPositiveGrowth ? 'text-[#00bc7d]' : 'text-[#ff2056]'}`}>
                    {isPositiveGrowth ? '+' : ''}{adminUsers.growth}%
                  </span>
                </div>
              )}
            </div>
            {loadingAdminUsers ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <p className="text-4xl font-bold text-[#0f172b]">{adminUsers?.thisWeek ?? 0}</p>
            )}
            <p className="text-xs text-[#90a1b9]">
              {loadingAdminUsers ? '' : `${adminUsers?.total ?? 0} total registered users`}
            </p>
          </div>

          {/* Right: Avatars + CTA */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {loadingAdminUsers ? (
                [...Array(5)].map((_, i) => <Skeleton key={i} className="w-10 h-10 rounded-full border-2 border-white" />)
              ) : (
                <>
                  {(adminUsers?.recentUsers ?? []).map(user => (
                    <div
                      key={user.id}
                      title={user.name}
                      className="w-10 h-10 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 shadow-sm"
                    >
                      {user.initials}
                    </div>
                  ))}
                  {(adminUsers?.total ?? 0) > 5 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      +{(adminUsers?.total ?? 0) - (adminUsers?.recentUsers?.length ?? 0)}
                    </div>
                  )}
                </>
              )}
            </div>
            <button
              onClick={() => onNavigate?.('settings')}
              className="bg-[#0e042f] hover:bg-purple-900 text-white px-6 py-2 rounded-full font-medium text-sm transition-colors"
            >
              View All Users
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};