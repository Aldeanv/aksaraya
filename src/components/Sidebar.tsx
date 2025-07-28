interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  selectedGenre: string;
  setSelectedGenre: (value: string) => void;
  genres: string[];
  visibleGenres: string[];
  showAllGenres: boolean;
  setShowAllGenres: (value: boolean) => void;
}

export default function Sidebar({
  mobileMenuOpen,
  setMobileMenuOpen,
  selectedGenre,
  setSelectedGenre,
  visibleGenres,
  showAllGenres,
  setShowAllGenres,
}: SidebarProps) {
  return (
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
              {visibleGenres.map((genre) => (
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
            <div className="mt-3">
              <button
                onClick={() => setShowAllGenres(!showAllGenres)}
                className="text-sm text-orange-600 hover:underline focus:outline-none"
              >
                {showAllGenres
                  ? "Sembunyikan Kategori"
                  : "Tampilkan Semua Kategori"}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
