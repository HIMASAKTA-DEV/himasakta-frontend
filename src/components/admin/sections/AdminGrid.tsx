import type React from "react";
import { HiChevronRight, HiPencil, HiPlus, HiTrash } from "react-icons/hi";

interface AdminGridProps {
  activeTab: string;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic items
  items: Record<string, any>[];
  isDataLoading: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic edit handler
  handleEdit: (item: any) => void;
  handleDelete: (id: string) => void;
  handleAdd: () => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  refreshKey?: number;
}

export const AdminGrid: React.FC<AdminGridProps> = ({
  activeTab,
  items,
  isDataLoading,
  handleEdit,
  handleDelete,
  handleAdd,
  page,
  setPage,
  totalPages,
  refreshKey: _refreshKey,
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Title & Action */}
      <div className="flex justify-between items-end mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Manage your {activeTab} content
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <HiPlus size={20} />
          Add {activeTab}
        </button>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isDataLoading && (
          <div className="col-span-full py-20 text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-bold">Loading {activeTab}...</p>
          </div>
        )}

        {!isDataLoading && items.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">No {activeTab} found.</p>
          </div>
        )}

        {!isDataLoading &&
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group relative"
            >
              <div className="aspect-[16/9] bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden">
                {item.thumbnail?.image_url ||
                item.logo?.image_url ||
                item.photo?.image_url ||
                item.image_url ? (
                  <img
                    src={
                      item.thumbnail?.image_url ||
                      item.logo?.image_url ||
                      item.photo?.image_url ||
                      item.image_url
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt=""
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl animate-pulse" />
                )}
              </div>

              <div className="p-8 relative z-10">
                <h4 className="text-xl font-black text-slate-800 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {activeTab === "kabinet"
                    ? item.tagline
                    : item.title || item.name || item.caption || "Untitled"}
                </h4>

                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                  {item.published_at
                    ? new Date(item.published_at).toLocaleDateString()
                    : activeTab === "berita"
                      ? item.published_at
                        ? new Date(item.published_at).toLocaleDateString()
                        : "Draft"
                      : activeTab === "kabinet"
                        ? `${new Date(item.period_start).getFullYear()} - ${new Date(item.period_end).getFullYear()}`
                        : activeTab === "anggota" || activeTab === "departemen"
                          ? item.role?.name || item.name
                          : item.month || "No Date"}
                </p>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <HiPencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-primary transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiChevronRight className="rotate-180" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg transition-all ${
                page === p
                  ? "bg-primary text-white shadow-primary/20"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-primary transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};
