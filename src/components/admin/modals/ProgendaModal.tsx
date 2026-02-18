import type React from "react";
import { FaArrowLeft, FaImages, FaTrash } from "react-icons/fa";

interface ProgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  // biome-ignore lint/suspicious/noExplicitAny: dynamic form values
  progendaFormValues: Record<string, any>;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic state setter
  setProgendaFormValues: (values: any) => void;
  onConfirm: () => void;
  isSaving: boolean;
  setTargetField: (field: string) => void;
  setShowMediaSelector: (show: boolean) => void;
}

export const ProgendaModal: React.FC<ProgendaModalProps> = ({
  isOpen,
  onClose,
  mode,
  progendaFormValues,
  setProgendaFormValues,
  onConfirm,
  isSaving,
  setTargetField,
  setShowMediaSelector,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl transition-all duration-500"
        onClick={() => !isSaving && onClose()}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-full animate-in fade-in zoom-in duration-300">
        <div className="p-8 sm:p-10 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {mode === "add" ? "Add Progenda" : "Edit Progenda"}
          </h3>
          <button
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-2xl"
          >
            <FaArrowLeft size={20} />
          </button>
        </div>

        <div className="p-8 sm:p-10 flex-1 overflow-y-auto space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              Progenda Name
            </label>
            <input
              className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
              value={progendaFormValues.name || ""}
              onChange={(e) =>
                setProgendaFormValues({
                  ...progendaFormValues,
                  name: e.target.value,
                })
              }
              placeholder="Progenda Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              Goal
            </label>
            <input
              className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
              value={progendaFormValues.goal || ""}
              onChange={(e) =>
                setProgendaFormValues({
                  ...progendaFormValues,
                  goal: e.target.value,
                })
              }
              placeholder="The goal of this progenda"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
              value={progendaFormValues.description || ""}
              onChange={(e) =>
                setProgendaFormValues({
                  ...progendaFormValues,
                  description: e.target.value,
                })
              }
              placeholder="Detailed description..."
            />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                Timeline
              </label>
              <button
                type="button"
                onClick={() => {
                  const newTimeline = {
                    id: Math.random().toString(),
                    date: new Date().toISOString(),
                    info: "",
                    link: "",
                  };
                  setProgendaFormValues({
                    ...progendaFormValues,
                    timelines: [
                      ...(progendaFormValues.timelines || []),
                      newTimeline,
                    ],
                  });
                }}
                className="text-[10px] font-bold text-primary hover:underline"
              >
                + Add Step
              </button>
            </div>

            <div className="space-y-4">
              {[...(progendaFormValues.timelines || [])]
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
                )
                // biome-ignore lint/suspicious/noExplicitAny: dynamic timeline
                .map((t: any, idx: number) => (
                  <div
                    key={t.id || idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-6 bg-slate-50 rounded-2xl relative group"
                  >
                    <div className="sm:col-span-4 space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-slate-100 outline-none text-sm"
                        value={
                          t.date
                            ? new Date(t.date).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newTimelines = [
                            ...progendaFormValues.timelines,
                          ];
                          newTimelines[idx] = {
                            ...t,
                            date: new Date(e.target.value).toISOString(),
                          };
                          setProgendaFormValues({
                            ...progendaFormValues,
                            timelines: newTimelines,
                          });
                        }}
                      />
                    </div>
                    <div className="sm:col-span-8 space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">
                        Information
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-white rounded-xl border border-slate-100 outline-none text-sm"
                        placeholder="e.g. Opening Ceremony"
                        value={t.info || ""}
                        onChange={(e) => {
                          const newTimelines = [
                            ...progendaFormValues.timelines,
                          ];
                          newTimelines[idx] = { ...t, info: e.target.value };
                          setProgendaFormValues({
                            ...progendaFormValues,
                            timelines: newTimelines,
                          });
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newTimelines =
                          progendaFormValues.timelines.filter(
                            (_: unknown, i: number) => i !== idx,
                          );
                        setProgendaFormValues({
                          ...progendaFormValues,
                          timelines: newTimelines,
                        });
                      }}
                      className="absolute -top-2 -right-2 p-2 bg-white text-slate-300 hover:text-red-500 shadow-sm rounded-full border border-slate-100 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              {(!progendaFormValues.timelines ||
                progendaFormValues.timelines.length === 0) && (
                <p className="text-center text-xs text-slate-400 italic">
                  No timeline steps added
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              Thumbnail
            </label>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setTargetField("progenda_thumbnail_id");
                  setShowMediaSelector(true);
                }}
                className="w-full py-4 px-6 bg-[#F8F9FA] border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <FaImages size={20} />
                {progendaFormValues.thumbnail_id
                  ? "Change Thumbnail"
                  : "Select Thumbnail"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10 bg-slate-50 border-t border-slate-100 flex gap-4 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 bg-white text-slate-600 rounded-2xl font-bold border border-slate-200 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            disabled={isSaving}
            onClick={onConfirm}
            className="flex-[2] py-4 px-6 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSaving && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Save Progenda
          </button>
        </div>
      </div>
    </div>
  );
};
