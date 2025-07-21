import { useEffect, useState } from "react";
import { fetchCatalogs } from "../../services/catalogService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Catalog {
  id: number;
  coverUrl: string;
  title: string;
  author: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCatalogs();
        setCatalogs(data);
      } catch (err) {
        console.error("Gagal mengambil katalog", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCatalogs();
  }, []);

  const filteredCatalogs = catalogs.filter((catalog) =>
    catalog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-4 items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Aksaraya</h1>

          <div className="relative flex-1 max-w-md w-full">
            <input
              type="text"
              placeholder="Cari buku..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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

          <div className="flex items-center space-x-2 relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-orange-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profil
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 py-1 text-sm text-orange-600 hover:text-white border border-orange-600 rounded hover:bg-orange-600 transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-orange-100 rounded-lg aspect-[2/3] w-full mb-3"></div>
                <div className="h-4 bg-orange-100 rounded mb-2"></div>
                <div className="h-3 bg-orange-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredCatalogs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredCatalogs.map((catalog) => (
              <div key={catalog.id} className="group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-orange-100 shadow-md">
                  <img
                    src={`${BASE_URL}${catalog.coverUrl}`}
                    alt={catalog.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {catalog.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{catalog.author}</p>
                  <button
                    onClick={() => navigate(`/catalogs/${catalog.id}`)}
                    className="mt-2 text-sm text-orange-600 hover:text-orange-800 font-medium flex items-center"
                  >
                    Lihat Detail
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="mx-auto h-20 w-20 text-orange-200 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Buku tidak ditemukan
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Tidak ditemukan buku yang sesuai dengan "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-5 py-2 bg-orange-600 text-white rounded-full text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm"
            >
              Hapus pencarian
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
