import type React from "react";
import { FaImages } from "react-icons/fa";

interface NewsFormProps {
  // biome-ignore lint/suspicious/noExplicitAny: dynamic form values
  formValues: Record<string, any>;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic state setter
  setFormValues: (values: any) => void;
  setTargetField: (field: string) => void;
  setShowMediaSelector: (show: boolean) => void;
}

export const NewsForm: React.FC<NewsFormProps> = ({
  formValues,
  setFormValues,
  setTargetField,
  setShowMediaSelector,
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          News Title
        </label>
        <input
          className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
          value={formValues.title || ""}
          onChange={(e) =>
            setFormValues({ ...formValues, title: e.target.value })
          }
          placeholder="Enter title..."
        />
      </div>
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
          placeholder="Brief summary..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          Content (Markdown)
        </label>
        <textarea
          rows={10}
          className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
          value={formValues.content || ""}
          onChange={(e) =>
            setFormValues({ ...formValues, content: e.target.value })
          }
          placeholder="# Use Markdown here..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
            Hashtags
          </label>
          <input
            className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
            value={formValues.hashtags || ""}
            onChange={(e) =>
              setFormValues({ ...formValues, hashtags: e.target.value })
            }
            placeholder="#tag1, #tag2"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
            Published At
          </label>
          <input
            type="datetime-local"
            className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
            value={
              formValues.published_at
                ? new Date(formValues.published_at as string)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setFormValues({
                ...formValues,
                published_at: new Date(e.target.value).toISOString(),
              })
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          Thumbnail Image
        </label>
        <div className="flex flex-col gap-4">
          {formValues.thumbnail?.image_url && (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden group">
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
            {formValues.thumbnail ? "Change Image" : "Select Image"}
          </button>
        </div>
      </div>
    </div>
  );
};
