import { api } from "@/lib/axios";
import {
  ApiResponse,
  CabinetInfo,
  Department,
  Gallery,
  MonthlyEvent,
  News,
  Progenda,
} from "@/types";

export const getCabinetInfo = async () => {
  const { data } = await api.get<ApiResponse<CabinetInfo[]>>(
    "/cabinet-info?is_active=true",
  );
  return data.data[0] || null;
};

export const getDepartments = async () => {
  const { data } = await api.get<ApiResponse<Department[]>>("/department");
  return data.data;
};

export const getLatestNews = async (limit = 5) => {
  const { data } = await api.get<ApiResponse<News[]>>(`/news?limit=${limit}`);
  return data.data;
};

export const getMonthlyEvents = async () => {
  const { data } = await api.get<ApiResponse<MonthlyEvent[]>>(
    "/monthly-event/this-month",
  );
  return data.data;
};

export const getDepartmentById = async (id: string) => {
  const { data } = await api.get<ApiResponse<Department>>(`/department/${id}`);
  return data.data;
};

export const getProgendaByDepartment = async (deptId: string) => {
  // Fetch all and filter client side if backend doesn't support filter
  const { data } = await api.get<ApiResponse<Progenda[]>>("/progenda");
  return data.data.filter((p) => p.department_id === deptId);
};

export const getAllNews = async (page = 1, limit = 9, search = "") => {
  const { data } = await api.get<ApiResponse<News[]>>(
    `/news?page=${page}&limit=${limit}&search=${search}`,
  );
  return data;
};

export const getNewsById = async (id: string) => {
  const { data } = await api.get<ApiResponse<News>>(`/news/${id}`);
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
