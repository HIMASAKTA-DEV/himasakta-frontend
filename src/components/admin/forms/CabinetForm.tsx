import type React from "react";
import { FaImages } from "react-icons/fa";

interface CabinetFormProps {
  // biome-ignore lint/suspicious/noExplicitAny: dynamic form values
  formValues: Record<string, any>;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic state setter
  setFormValues: (values: any) => void;
  setTargetField: (field: string) => void;
  setShowMediaSelector: (show: boolean) => void;
}

export const CabinetForm: React.FC<CabinetFormProps> = ({
  formValues,
  setFormValues,
  setTargetField,
  setShowMediaSelector,
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              Tagline
            </label>
            <input
              className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
              value={formValues.tagline || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, tagline: e.target.value })
              }
              placeholder="Cabinet tagline..."
            />
          </div>

          <div className="flex items-center gap-4 px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex-1">
              Active Cabinet status
            </label>
            <input
              type="checkbox"
              className="w-6 h-6 rounded-lg border-primary accent-primary"
              checked={formValues.is_active || false}
              onChange={(e) =>
                setFormValues({ ...formValues, is_active: e.target.checked })
              }
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                Period Start
              </label>
              <input
                type="date"
                className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm"
                value={
                  formValues.period_start
                    ? new Date(formValues.period_start)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    period_start: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                Period End
              </label>
              <input
                type="date"
                className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm"
                value={
                  formValues.period_end
                    ? new Date(formValues.period_end)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    period_end: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          Description
        </label>
        <textarea
          rows={3}
          className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
          value={formValues.description || ""}
          onChange={(e) =>
            setFormValues({ ...formValues, description: e.target.value })
          }
          placeholder="Cabinet overview..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
            Vision
          </label>
          <textarea
            rows={4}
            className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
            value={formValues.visi || ""}
            onChange={(e) =>
              setFormValues({ ...formValues, visi: e.target.value })
            }
            placeholder="Vision..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
            Mission
          </label>
          <textarea
            rows={4}
            className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
            value={formValues.misi || ""}
            onChange={(e) =>
              setFormValues({ ...formValues, misi: e.target.value })
            }
            placeholder="Mission..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              type="button"
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
            Organigram (Media)
          </label>
          <div className="flex flex-col gap-4">
            {formValues.organigram?.image_url && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden group border-2 border-slate-50">
                <img
                  src={formValues.organigram.image_url}
                  className="w-full h-full object-contain"
                  alt="organigram"
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setTargetField("organigram_id");
                setShowMediaSelector(true);
              }}
              className="w-full py-4 px-6 bg-[#F8F9FA] border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <FaImages size={20} />
              {formValues.organigram
                ? "Change Organigram"
                : "Select Organigram"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
