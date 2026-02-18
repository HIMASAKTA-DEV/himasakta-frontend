import { CabinetInfo, Department, Role } from "@/types";
import type React from "react";
import { FaImages } from "react-icons/fa";

interface MemberFormProps {
  // biome-ignore lint/suspicious/noExplicitAny: dynamic form values
  formValues: Record<string, any>;
  // biome-ignore lint/suspicious/noExplicitAny: dynamic state setter
  setFormValues: (values: any) => void;
  setTargetField: (field: string) => void;
  setShowMediaSelector: (show: boolean) => void;
  roleOptions: Role[];
  cabinetOptions: CabinetInfo[];
  departmentOptions: Department[];
  isAddingRole: boolean;
  setIsAddingRole: (val: boolean) => void;
  newRoleName: string;
  setNewRoleName: (val: string) => void;
  roleLoading: boolean;
  handleCreateRole: () => void;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  formValues,
  setFormValues,
  setTargetField,
  setShowMediaSelector,
  roleOptions,
  cabinetOptions,
  departmentOptions,
  isAddingRole,
  setIsAddingRole,
  newRoleName,
  setNewRoleName,
  roleLoading,
  handleCreateRole,
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              NRP
            </label>
            <input
              className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
              value={formValues.nrp || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, nrp: e.target.value })
              }
              placeholder="e.g. 12345678"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              Full Name
            </label>
            <input
              className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
              value={formValues.name || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
              placeholder="Member full name"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
                Role / Position
              </label>
              <button
                type="button"
                onClick={() => setIsAddingRole(!isAddingRole)}
                className="text-[10px] font-bold text-primary hover:underline"
              >
                {isAddingRole ? "Cancel" : "+ Add Role"}
              </button>
            </div>

            {isAddingRole ? (
              <div className="flex gap-2">
                <input
                  className="flex-1 px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none text-sm"
                  placeholder="New role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
                <button
                  type="button"
                  disabled={roleLoading || !newRoleName}
                  onClick={handleCreateRole}
                  className="px-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            ) : (
              <select
                className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none appearance-none"
                value={formValues.role_id || ""}
                onChange={(e) =>
                  setFormValues({ ...formValues, role_id: e.target.value })
                }
              >
                <option value="">Select Role</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
              Cabinet
            </label>
            <select
              className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none appearance-none"
              value={formValues.cabinet_id || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, cabinet_id: e.target.value })
              }
            >
              <option value="">Select Cabinet</option>
              {cabinetOptions
                .filter((c) => !c.DeletedAt)
                .sort(
                  (a, b) =>
                    new Date(b.period_start).getTime() -
                    new Date(a.period_start).getTime(),
                )
                .map((cab) => (
                  <option key={cab.id} value={cab.id}>
                    {new Date(cab.period_start).getFullYear()} -{" "}
                    {new Date(cab.period_end).getFullYear()} (
                    {cab.is_active ? "Active" : "Inactive"}) {cab.tagline}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
            Department
          </label>
          <select
            className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none appearance-none"
            value={formValues.department_id || ""}
            onChange={(e) =>
              setFormValues({ ...formValues, department_id: e.target.value })
            }
          >
            <option value="">Select Department</option>
            {departmentOptions.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
            Sorting Index
          </label>
          <input
            type="number"
            className="w-full px-6 py-4 bg-[#F8F9FA] rounded-2xl border border-transparent focus:bg-white focus:border-primary/30 outline-none"
            value={formValues.index || 0}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                index: Number.parseInt(e.target.value),
              })
            }
            placeholder="e.g. 1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-4">
          Member Photo
        </label>
        <div className="flex flex-col gap-4">
          {formValues.photo?.image_url && (
            <div className="relative w-24 h-32 rounded-xl overflow-hidden group mx-auto">
              <img
                src={formValues.photo.image_url}
                className="w-full h-full object-cover"
                alt="photo"
              />
            </div>
          )}
          <button
            onClick={() => {
              setTargetField("photo_id");
              setShowMediaSelector(true);
            }}
            className="w-full py-4 px-6 bg-[#F8F9FA] border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <FaImages size={20} />
            {formValues.photo ? "Change Photo" : "Select Photo"}
          </button>
        </div>
      </div>
    </div>
  );
};
