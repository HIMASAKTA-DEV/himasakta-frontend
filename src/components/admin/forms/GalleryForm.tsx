import type React from "react";

interface GalleryFormProps {
  // biome-ignore lint/suspicious/noExplicitAny: dynamic form values
  formValues: Record<string, any>;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic state setter
  setFormValues: (values: any) => void;
}

export const GalleryForm: React.FC<GalleryFormProps> = ({
  formValues,
  setFormValues,
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          Gallery Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
          onChange={(e) =>
            setFormValues({ ...formValues, file: e.target.files?.[0] })
          }
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          Caption
        </label>
        <input
          className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
          value={formValues.caption || ""}
          onChange={(e) =>
            setFormValues({ ...formValues, caption: e.target.value })
          }
          placeholder="Image caption"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          Category
        </label>
        <select
          className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none appearance-none"
          value={formValues.category || "General"}
          onChange={(e) =>
            setFormValues({ ...formValues, category: e.target.value })
          }
        >
          <option value="General">General</option>
          <option value="Event">Event</option>
          <option value="Department">Department</option>
        </select>
      </div>
    </div>
  );
};
