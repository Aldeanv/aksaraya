import { useEffect, useState } from "react";
import { fetchAllCatalogs } from "../../services/catalogService";
import api from "../../services/api";
import CreateCatalog from "../../components/createCatalog";
import UpdateCatalog from "../../components/updateCatalog";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Navbar from "../../components/Navbar";

interface Catalog {
  id: number;
  coverUrl: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  synopsis: string;
  publisher: string;
  type: string;
}

export default function DashboardAdmin() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalType, setModalType] = useState<"create" | "edit" | null>(null);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [catalogToDelete, setCatalogToDelete] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const loadCatalogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCatalogs();
      setCatalogs(data);
    } catch (err) {
      console.error("Gagal memuat katalog", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const confirmDelete = async () => {
    if (!catalogToDelete) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/catalogs/${catalogToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadCatalogs();
    } catch (err) {
      console.error("Gagal menghapus katalog", err);
    } finally {
      setCatalogToDelete(null);
    }
  };

  const filteredCatalogs = catalogs.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const truncateSynopsis = (text: string, maxWords: number) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-orange-900">
                Dashboard Katalog
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari berdasarkan judul atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
                />
              </div>
              <button
                onClick={() => setModalType("create")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Tambah Buku Baru
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredCatalogs.length === 0 ? (
              <div className="p-12 text-center text-orange-600">
                Tidak ada katalog ditemukan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-orange-100">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-orange-700 uppercase tracking-wider">
                        Buku
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-orange-700 uppercase tracking-wider">
                        Penulis
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-orange-700 uppercase tracking-wider">
                        Genre
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-orange-700 uppercase tracking-wider">
                        Tahun
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-orange-700 uppercase tracking-wider">
                        Sinopsis
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-orange-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-50">
                    {filteredCatalogs.map((cat) => (
                      <tr
                        key={cat.id}
                        className="hover:bg-orange-50 transition-colors"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center">
                            <img
                              src={`${BASE_URL}${cat.coverUrl}`}
                              alt={cat.title}
                              className="h-16 w-12 object-cover border border-orange-200 rounded-md shadow-sm"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/100x150?text=No+Cover")
                              }
                            />
                            <div className="ml-4">
                              <div className="text-base font-medium text-orange-900">
                                {cat.title}
                              </div>
                              <div className="text-sm text-orange-600">
                                {cat.publisher}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-orange-800">
                          {cat.author}
                        </td>
                        <td className="px-6 py-5 text-orange-700">
                          {cat.genre}
                        </td>
                        <td className="px-6 py-5 text-orange-700">
                          {cat.year}
                        </td>
                        <td className="px-6 py-5 text-orange-700">
                          {truncateSynopsis(cat.synopsis, 25)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => {
                                setSelectedCatalog(cat);
                                setModalType("edit");
                              }}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setCatalogToDelete(cat)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {modalType === "create" && (
            <CreateCatalog
              onClose={() => setModalType(null)}
              onSuccess={() => {
                loadCatalogs();
                setModalType(null);
              }}
            />
          )}

          {modalType === "edit" && selectedCatalog && (
            <UpdateCatalog
              initialData={selectedCatalog}
              onClose={() => {
                setModalType(null);
                setSelectedCatalog(null);
              }}
              onSuccess={() => {
                loadCatalogs();
                setModalType(null);
                setSelectedCatalog(null);
              }}
            />
          )}

          {catalogToDelete && (
            <ConfirmDeleteModal
              title={catalogToDelete.title}
              onCancel={() => setCatalogToDelete(null)}
              onConfirm={confirmDelete}
            />
          )}
        </div>
      </div>
    </>
  );
}
