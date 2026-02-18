import type React from "react";
import { HiX } from "react-icons/hi";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  loading?: boolean;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  loading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-3xl font-extrabold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <HiX size={24} className="text-slate-400" />
          </button>
        </div>
        <div className="p-10 max-h-[60vh] overflow-y-auto">{children}</div>
        <div className="p-10 bg-slate-50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 bg-white text-slate-600 rounded-2xl font-bold border border-slate-200 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className="flex-[2] py-4 px-6 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Confirm Changes
          </button>
        </div>
      </div>
    </div>
  );
};
