import { api } from "@/lib/axios";
import {
  ApiResponse,
  CabinetInfo,
  Department,
  Gallery,
  MonthlyEvent,
  News,
  NewsAutocompletion,
  Progenda,
  LoginCredentials,
  AuthResponse,
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

export const getDepartments = async () => {
  const { data } = await api.get<ApiResponse<Department[]>>("/department");
  return data.data;
};

// News API
export const getLatestNews = async (limit = 6) => {
  const { data } = await api.get<ApiResponse<News[]>>(`/news?limit=${limit}`);
  return data.data;
};

export const getMonthlyEvents = async () => {
  const { data } = await api.get<ApiResponse<MonthlyEvent[]>>(
    "/monthly-event/this-month",
  );
  return data.data;
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
  return data.data.filter((p) => p.department_id === deptId);
};

export const getAllNews = async (page = 1, limit = 10, search = "") => {
  const { data } = await api.get<ApiResponse<News[]>>(
    `/news?page=${page}&limit=${limit}&search=${search}`,
  );
  return data;
};

export const getNewsAutocompletion = async (keyword: string) => {
  const { data } = await api.get<ApiResponse<NewsAutocompletion[]>>(
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

export const getGalleryByDepartment = async (deptId: string) => {
  // Assuming /gallery endpoint exists and returns all or filters
  // If backend has specific endpoint like /gallery/department/:id use that
  // For now, fetch all and filter client side as fallback
  try {
    const { data } = await api.get<ApiResponse<Gallery[]>>("/gallery");
    return data.data.filter((g) => g.department_id === deptId);
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
