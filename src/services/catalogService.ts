import api from "./api";
import axios from "axios";
import { CatalogSearchParams } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchAllCatalogs = async () => {
  const res = await api.get("/catalogs");
  return res.data.catalogs;
};

export async function fetchCatalogs(params: CatalogSearchParams) {
  const response = await axios.get(`${BASE_URL}/catalogs/search`, { params });
  return response.data;
}
