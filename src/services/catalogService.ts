import api from "./api";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export interface CatalogSearchParams {
  keyword?: string;
  genre?: string;
  type?: string;
  year?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const fetchAllCatalogs = async () => {
  const res = await api.get("/catalogs");
  return res.data.catalogs;
};

export async function fetchCatalogs(params: CatalogSearchParams) {
  const response = await axios.get(`${BASE_URL}/catalogs/search`, { params });
  return response.data;
}
