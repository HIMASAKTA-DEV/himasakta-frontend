import type React from "react";
import { FaImages } from "react-icons/fa";

interface MonthlyEventFormProps {
  // biome-ignore lint/suspicious/noExplicitAny: dynamic form values
  formValues: Record<string, any>;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic state setter
  setFormValues: (values: any) => void;
  setTargetField: (field: string) => void;
  setShowMediaSelector: (show: boolean) => void;
}

export const MonthlyEventForm: React.FC<MonthlyEventFormProps> = ({
  formValues,
  setFormValues,
  setTargetField,
  setShowMediaSelector,
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          Event Title
        </label>
        <input
          className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
          value={formValues.title || ""}
          onChange={(e) =>
            setFormValues({ ...formValues, title: e.target.value })
          }
          placeholder="e.g. HIMASAKTA Cup"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          Description
        </label>
        <textarea
          rows={4}
          className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
          value={formValues.description || ""}
          onChange={(e) =>
            setFormValues({ ...formValues, description: e.target.value })
          }
          placeholder="Detailed description..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
            Event Month/Date
          </label>
          <input
            type="date"
            className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
            value={
              formValues.month
                ? new Date(formValues.month as string)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) =>
              setFormValues({
                ...formValues,
                month: new Date(e.target.value).toISOString(),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
            Registration/Event Link
          </label>
          <input
            className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
            value={formValues.link || ""}
            onChange={(e) =>
              setFormValues({ ...formValues, link: e.target.value })
            }
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          Thumbnail
        </label>
        <div className="flex flex-col gap-4">
          {formValues.thumbnail?.image_url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
              <img
                src={formValues.thumbnail.image_url}
                className="w-full h-full object-cover"
                alt="thumbnail"
              />
            </div>
          )}
          <button
            onClick={() => {
              setTargetField("thumbnail_id");
              setShowMediaSelector(true);
            }}
            className="w-full py-4 px-6 bg-[#F8F9FA] border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <FaImages size={20} />
            {formValues.thumbnail ? "Change Thumbnail" : "Select Thumbnail"}
          </button>
        </div>
      </div>
    </div>
  );
};
