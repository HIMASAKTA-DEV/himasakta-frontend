import { Progenda } from "@/types";
import type React from "react";
import { FaImages, FaPlus } from "react-icons/fa";
import { HiPencil, HiTrash } from "react-icons/hi";

interface DepartmentFormProps {
  // biome-ignore lint/suspicious/noExplicitAny: dynamic form values
  formValues: Record<string, any>;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic state setter
  setFormValues: (values: any) => void;
  setTargetField: (field: string) => void;
  setShowMediaSelector: (show: boolean) => void;
  progendas: Progenda[];
  isProgendaLoading: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic edit handler
  handleEditProgenda: (item: any) => void;
  handleDeleteProgenda: (id: string) => void;
  setShowProgendaModal: (show: boolean) => void;
  setProgendaModalMode: (mode: "add" | "edit") => void;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic state setter
  setProgendaFormValues: (values: any) => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  formValues,
  setFormValues,
  setTargetField,
  setShowMediaSelector,
  progendas,
  isProgendaLoading,
  handleEditProgenda,
  handleDeleteProgenda,
  setShowProgendaModal,
  setProgendaModalMode,
  setProgendaFormValues,
}) => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              Logo (Media)
            </label>
            <div className="flex flex-col gap-4">
              {formValues.logo?.image_url && (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden group mx-auto border-2 border-slate-50">
                  <img
                    src={formValues.logo.image_url}
                    className="w-full h-full object-contain"
                    alt="logo"
                  />
                </div>
              )}
              <button
                onClick={() => {
                  setTargetField("logo_id");
                  setShowMediaSelector(true);
                }}
                className="w-full py-4 px-6 bg-[#F8F9FA] border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <FaImages size={20} />
                {formValues.logo ? "Change Logo" : "Select Logo"}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              Department Name
            </label>
            <input
              className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
              value={formValues.name || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
              placeholder="e.g. Kaderisasi"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              Description / Motto
            </label>
            <textarea
              rows={6}
              className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
              value={formValues.description || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
              placeholder="Enter description..."
            />
          </div>
        </div>
      </div>

      {/* Progenda Section */}
      <div className="pt-10 border-t border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">
              Program & Agenda
            </h4>
            <p className="text-sm text-slate-400 font-medium">
              Manage activities associated with this department
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setProgendaModalMode("add");
              setProgendaFormValues({ department_id: formValues.id });
              setShowProgendaModal(true);
            }}
            className="py-3 px-6 bg-primary/10 text-primary rounded-2xl font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-sm"
          >
            <FaPlus size={14} />
            <span>Add Progenda</span>
          </button>
        </div>

        {isProgendaLoading ? (
          <div className="py-10 flex justify-center">
            <div className="w-8 h-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {progendas.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary/20 hover:bg-white transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden">
                    {item.thumbnail?.image_url ? (
                      <img
                        src={item.thumbnail.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-slate-50 rounded-lg" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-700">{item.name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {item.timelines?.length || 0} Steps
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleEditProgenda(item)}
                    className="p-2.5 rounded-xl bg-white text-slate-400 hover:bg-primary/10 hover:text-primary transition-all border border-slate-100 shadow-sm"
                  >
                    <HiPencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProgenda(item.id)}
                    className="p-2.5 rounded-xl bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100 shadow-sm"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
            {progendas.length === 0 && (
              <div className="py-12 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-sm">
                  No progendas found for this department.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
