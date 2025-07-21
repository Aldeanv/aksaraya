import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Catalog } from "../../types";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function CatalogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/catalogs/${id}`);
        if (!response.ok) throw new Error("Catalog not found");
        const data = await response.json();
        setCatalog(data);
      } catch (err) {
        console.error("Failed to fetch catalog", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [id, navigate]);

  useEffect(() => {
    if (user?.wishlists && catalog) {
      const exists = user.wishlists.some((item) => item.id === catalog.id);
      setIsInWishlist(exists);
    }
  }, [user, catalog]);

  const toggleWishlist = async () => {
    if (!user || !catalog) {
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);
      const method = isInWishlist ? "DELETE" : "POST";
      const response = await fetch(`${BASE_URL}/wishlists/${catalog.id}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to update wishlist");

      setIsInWishlist(!isInWishlist);
      setUser((prev) => {
        if (!prev) return prev;
        const updatedWishlists = isInWishlist
          ? prev.wishlists?.filter((w) => w.id !== catalog.id)
          : [...(prev.wishlists ?? []), catalog];

        return { ...prev, wishlists: updatedWishlists };
      });
    } catch (err) {
      console.error("Error updating wishlist:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="animate-pulse flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="aspect-[2/3] bg-gray-200 rounded-2xl shadow-xl"></div>
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
              <div className="h-10 bg-gray-200 rounded-full w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded-full w-1/2"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Book Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The book you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-all font-medium shadow-md hover:shadow-lg"
          >
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-600 hover:text-orange-800 mb-8 transition-all group"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 xl:w-1/4 p-6 lg:p-8 flex flex-col items-center">
              <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={`${BASE_URL}${catalog.coverUrl}`}
                  alt={catalog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {catalog.type}
                </div>
              </div>

              <div className="mt-6 w-full">
                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className={`py-2 px-4 rounded ${
                    isInWishlist
                      ? "bg-gray-200 text-orange-600"
                      : "bg-orange-600 text-white"
                  }`}
                >
                  {wishlistLoading
                    ? "Loading..."
                    : isInWishlist
                    ? "Hapus dari wishlist"
                    : "Tambah ke wishlist"}
                </button>
              </div>
            </div>

            <div className="lg:w-2/3 xl:w-3/4 p-6 lg:p-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {catalog.title}
                </h1>
                <p className="text-xl text-orange-600 font-medium">
                  Penulis {catalog.author}
                </p>
              </div>

              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "details"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Detail Buku
                  </button>
                  <button
                    onClick={() => setActiveTab("synopsis")}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "synopsis"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Sinopsis
                  </button>
                </nav>
              </div>

              <div className="min-h-[300px]">
                {activeTab === "details" && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      DETAIL PUBLIKASI
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Penerbit</span>
                        <span className="text-gray-900 font-medium">
                          {catalog.publisher}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Tahun Terbit</span>
                        <span className="text-gray-900 font-medium">
                          {catalog.year}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Tipe</span>
                        <span className="text-gray-900 font-medium">
                          {catalog.type}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Genre</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          {catalog.genre}
                        </span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === "synopsis" && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Deskripsi
                    </h3>
                    <div className="prose max-w-none text-gray-700">
                      <p className="whitespace-pre-line">{catalog.synopsis}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
