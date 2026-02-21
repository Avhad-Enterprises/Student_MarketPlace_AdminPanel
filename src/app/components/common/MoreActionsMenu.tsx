import React from 'react';
import { MoreVertical, Edit, RefreshCw, User, Activity, Archive } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface MoreActionsMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditStudent?: () => void;
  onChangeStatus?: () => void;
  onChangeCounselor?: () => void;
  onViewAuditLog?: () => void;
  onArchiveStudent?: () => void;
}

export const MoreActionsMenu: React.FC<MoreActionsMenuProps> = ({
  open,
  onOpenChange,
  onEditStudent,
  onChangeStatus,
  onChangeCounselor,
  onViewAuditLog,
  onArchiveStudent,
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
          <MoreVertical size={15} className="text-gray-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="end">
        <div className="space-y-1">
          <button
            onClick={() => {
              onChangeStatus?.();
              onOpenChange(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={16} className="text-gray-600" />
            <span>Change Status</span>
          </button>
          <button
            onClick={() => {
              onChangeCounselor?.();
              onOpenChange(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <User size={16} className="text-gray-600" />
            <span>Assign / Change Counselor</span>
          </button>
          <button
            onClick={() => {
              onViewAuditLog?.();
              onOpenChange(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Activity size={16} className="text-gray-600" />
            <span>View Audit Log</span>
          </button>
          <div className="my-1 border-t border-gray-200"></div>
          <button
            onClick={() => {
              onArchiveStudent?.();
              onOpenChange(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Archive size={16} className="text-amber-600" />
            <span>Archive Student</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};