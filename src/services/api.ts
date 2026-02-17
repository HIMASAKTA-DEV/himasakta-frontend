import { api } from "@/lib/axios";
import {
  ApiResponse,
  AuthResponse,
  CabinetInfo,
  Department,
  Gallery,
  LoginCredentials,
  Member,
  MonthlyEvent,
  News,
  Progenda,
} from "@/types";

// Cabinet API
export const getCabinetInfo = async () => {
  const { data } = await api.get<ApiResponse<CabinetInfo[]>>("/cabinet-info");
  return data.data[0]; // Assuming we only have one cabinet info
};

export const getCurrentCabinet = async () => {
  const { data } = await api.get<ApiResponse<CabinetInfo>>("/current-cabinet");
  return data.data;
};

// Admin Cabinet CRUD
export const updateCabinetInfo = async (
  id: string,
  cabinetData: Record<string, unknown>,
) => {
  const { data } = await api.put(`/cabinet-info/${id}`, cabinetData);
  return data.data;
};

export const getDepartments = async (page = 1, limit = 100) => {
  const { data } = await api.get<ApiResponse<Department[]>>(
    `/department?page=${page}&limit=${limit}`,
  );
  return data;
};

// News API
export const getLatestNews = async (limit = 6) => {
  const { data } = await api.get<ApiResponse<News[]>>(`/news?limit=${limit}`);
  return data;
};

export const getMonthlyEvents = async () => {
  const { data } = await api.get<ApiResponse<MonthlyEvent[]>>(
    "/monthly-event/this-month",
  );
  return data;
};

export const getDepartmentByName = async (name: string) => {
  const { data } = await api.get<ApiResponse<Department>>(
    `/department/${name}`,
  );
  return data.data;
};

// Admin Department CRUD
export const createDepartment = async (deptData: Record<string, unknown>) => {
  const { data } = await api.post("/department", deptData);
  return data.data;
};

export const updateDepartment = async (
  id: string,
  deptData: Record<string, unknown>,
) => {
  const { data } = await api.put(`/department/${id}`, deptData);
  return data.data;
};

export const deleteDepartment = async (id: string) => {
  const { data } = await api.delete(`/department/${id}`);
  return data.data;
};

export const getProgendaByDepartment = async (deptId: string) => {
  // Fetch all and filter client side if backend doesn't support filter
  const { data } = await api.get<ApiResponse<Progenda[]>>("/progenda");
  return (data.data || []).filter((p) => p.department_id === deptId);
};

export const getAllNews = async (page = 1, limit = 10, search = "") => {
  const { data } = await api.get<ApiResponse<News[]>>(
    `/news?page=${page}&limit=${limit}&search=${search}`,
  );
  return data;
};

export const getNewsAutocompletion = async (keyword: string) => {
  const { data } = await api.get<ApiResponse<string[]>>(
    `/news/autocompletion?search=${keyword}`,
  );
  return data.data;
};

export const getNewsBySlug = async (slug: string) => {
  const { data } = await api.get<ApiResponse<News>>(`/news/${slug}`);
  return data.data;
};

// Admin News CRUD
export const createNews = async (newsData: Record<string, unknown>) => {
  const { data } = await api.post("/news", newsData);
  return data.data;
};

export const updateNews = async (
  id: string,
  newsData: Record<string, unknown>,
) => {
  const { data } = await api.put(`/news/${id}`, newsData);
  return data.data;
};

export const deleteNews = async (id: string) => {
  const { data } = await api.delete(`/news/${id}`);
  return data.data;
};

export const getProgendaById = async (id: string) => {
  const { data } = await api.get<ApiResponse<Progenda>>(`/progenda/${id}`);
  return data.data;
};

// Gallery API
export const getGallery = async (page = 1, limit = 10) => {
  const { data } = await api.get<ApiResponse<Gallery[]>>(
    `/gallery?page=${page}&limit=${limit}`,
  );
  return data;
};

export const getGalleryByDepartment = async (deptId: string) => {
  // Assuming /gallery endpoint exists and returns all or filters
  // If backend has specific endpoint like /gallery/department/:id use that
  // For now, fetch all and filter client side as fallback
  try {
    const response = await getGallery(1, 100);
    return (response.data || []).filter((g) => g.department_id === deptId);
  } catch (e) {
    console.error("Failed to fetch gallery", e);
    return [];
  }
};

export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const { data } = await api.post("/auth/login", credentials);
  return data.data || data; // Handle both nested and flat structures
}

// Gallery API
export const uploadGalleryImage = async (formData: FormData) => {
  const { data } = await api.post("/gallery", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

export const deleteGalleryItem = async (id: string) => {
  const { data } = await api.delete(`/gallery/${id}`);
  return data.data;
};

// Member API
export const getAllMembers = async (page = 1, limit = 100) => {
  const { data } = await api.get<ApiResponse<Member[]>>(
    `/member?page=${page}&limit=${limit}`,
  );
  return data;
};

export const getMembersByDepartment = async (deptId: string) => {
  const { data } = await api.get<ApiResponse<Member[]>>(
    `/member?filter_by=department_id&filter=${deptId}`,
  );
  return data.data;
};

export const createMember = async (memberData: Record<string, unknown>) => {
  const { data } = await api.post("/member", memberData);
  return data.data;
};

export const updateMember = async (
  id: string,
  memberData: Record<string, unknown>,
) => {
  const { data } = await api.put(`/member/${id}`, memberData);
  return data.data;
};

export const deleteMember = async (id: string) => {
  const { data } = await api.delete(`/member/${id}`);
  return data.data;
};
