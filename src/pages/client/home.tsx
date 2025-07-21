import { useEffect, useState } from "react";
import { fetchCatalogs } from "../../services/catalogService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Catalog } from "../../types";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const limit = 36;

  const genres = [
    "Semua",
    "Fiksi Ilmiah",
    "Fantasi",
    "Romantis",
    "Misteri",
    "Thriller",
    "Horor",
    "Petualangan",
    "Drama",
    "Fiksi Sejarah",
    "Distopia",
    "Satire",
    "Biografi",
    "self-improvement",
    "Motivasi",
    "Sejarah",
    "Filsafat",
    "Psikologi",
    "Sains",
    "Politik",
    "Sosial Budaya",
    "Travel",
    "Bisnis",
    "Teknologi",
    "Kesehatan",
    "Drama Teater",
    "Klasik",
  ];

  const [selectedGenre, setSelectedGenre] = useState<string>("Semua");

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedGenre]);

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setIsLoading(true);
        const params = {
          keyword: searchQuery || undefined,
          genre: selectedGenre !== "Semua" ? selectedGenre : undefined,
          page,
          limit,
        };
        const res = await fetchCatalogs(params);
        setCatalogs(res.data);
        setTotalPage(res.lastPage);
      } catch (err) {
        console.error("Gagal mengambil katalog", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCatalogs();
  }, [searchQuery, selectedGenre, page]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="mr-2 p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100 lg:hidden"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1
                className="text-lg sm:text-xl font-bold text-gray-900 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <span className="text-orange-600">Aksara</span>ya
              </h1>
            </div>

            <div className="hidden lg:flex flex-1 max-w-xl mx-4 xl:mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari buku atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                className="p-2 text-gray-600 hover:text-orange-600 lg:hidden"
                onClick={() => setShowSearch(!showSearch)}
              >
                <svg
                  className="h-5 w-5"
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
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2"
                  >
                    <div className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.name}
                    </div>
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
                      <div className="py-1">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>

                        {user.role === "admin" && (
                          <button
                            onClick={() => {
                              navigate("/dashboard");
                              setDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Dashboard
                          </button>
                        )}

                        <button
                          onClick={() => {
                            navigate("/profile");
                            setDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Profil Saya
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            navigate("/login");
                            setDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-orange-600 hover:text-white border border-orange-600 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
                  >
                    Daftar
                  </button>
                </div>
              )}
            </div>
          </div>

          {showSearch && (
            <div className="lg:hidden pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari buku atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 z-10">
        <aside
          className={`fixed inset-y-0 left-0 w-64 transform ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static z-40 bg-white shadow-lg`}
        >
          <div className="h-full flex flex-col">
            <div className="border-b border-gray-200 flex items-center justify-between">
              <button
                className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Kategori
                </h3>
                <ul className="space-y-1">
                  {genres.map((genre) => (
                    <li key={genre}>
                      <button
                        onClick={() => {
                          setSelectedGenre(genre);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                          selectedGenre === genre
                            ? "bg-orange-50 text-orange-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{genre}</span>
                        {selectedGenre === genre && (
                          <svg
                            className="ml-auto h-4 w-4 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-3 sm:p-4 md:p-6 max-w-screen-xl mx-auto overflow-hidden">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {selectedGenre === "Semua" ? "Koleksi Buku" : selectedGenre}
              </h2>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-1">
                  Hasil pencarian untuk:{" "}
                  <span className="font-medium">"{searchQuery}"</span>
                </p>
              )}
            </div>
            {catalogs.length > 0 && (
              <p className="text-xs md:text-sm text-gray-500">
                Menampilkan{" "}
                <span className="font-medium">{catalogs.length}</span> buku
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg aspect-[2/3] w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1 w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : catalogs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {catalogs.map((catalog) => (
                <div
                  key={catalog.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/catalogs/${catalog.id}`)}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={`${BASE_URL}${catalog.coverUrl}`}
                      alt={catalog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="inline-block px-2 py-1 bg-orange-600 text-white text-xs rounded">
                        {catalog.genre}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 line-clamp-2 text-xs md:text-sm">
                      {catalog.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {catalog.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="mx-auto w-16 h-16 mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                Buku tidak ditemukan
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                Maaf, tidak ada buku yang sesuai dengan pencarian atau filter
                yang Anda pilih.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50"
                >
                  Hapus pencarian
                </button>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre("Semua");
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
                >
                  Reset semua filter
                </button>
              </div>
            </div>
          )}
          {totalPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-3 py-1 text-sm rounded-md ${
                  page === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Sebelumnya
              </button>

              <span className="text-sm text-gray-600">
                Halaman <strong>{page}</strong> dari{" "}
                <strong>{totalPage}</strong>
              </span>

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
                disabled={page === totalPage}
                className={`px-3 py-1 text-sm rounded-md ${
                  page === totalPage
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Selanjutnya
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
