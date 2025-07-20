import api from "./api"

export const fetchCatalogs = async () => {
    const res = await api.get('/catalogs');
    return res.data.catalogs;
}