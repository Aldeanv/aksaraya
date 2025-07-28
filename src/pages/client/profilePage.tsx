import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileUser, setProfileUser] = useState(user);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      if (location.state?.refreshed) {
        const latestUser = await refreshUser();
        setProfileUser(latestUser);
      } else {
        setProfileUser(user);
      }
    };

    refreshIfNeeded();
  }, [user, navigate, refreshUser, location.state]);

  if (!profileUser) return null;

  const isRegularUser = profileUser.role === "user";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 p-8 rounded-md">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {profileUser.name}
              </h1>
              <p className="text-gray-600">{profileUser.email}</p>
            </div>
            {!isRegularUser && (
              <span className="px-4 py-2 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                {profileUser.role.toUpperCase()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Informasi Profil
                </h2>
                <div className="space-y-4">
                  <InfoField label="Nama" value={profileUser.name} />
                  <InfoField label="Email" value={profileUser.email} />
                  {!isRegularUser && (
                    <>
                      <InfoField label="NIK" value={profileUser.NIK || "-"} />
                      <InfoField
                        label="Nomor Telepon"
                        value={profileUser.phone || "-"}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Wishlist Saya
                  </h2>
                  <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    Cari Buku Lain
                  </button>
                </div>

                <div className="p-6">
                  {profileUser.wishlists?.length ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
                      {profileUser.wishlists.map((book) => (
                        <div
                          key={book.id}
                          className="group cursor-pointer transition-all hover:-translate-y-1"
                          onClick={() => navigate(`/catalogs/${book.id}`)}
                        >
                          <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow relative">
                            <img
                              src={`${BASE_URL}${book.coverUrl}`}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                              <span className="text-white text-sm font-medium">
                                Lihat Detail
                              </span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                              {book.title}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyWishlist />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
        {label}
      </p>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}

function EmptyWishlist() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-10 h-10 text-orange-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">
        Wishlist Anda Kosong
      </h3>
      <p className="text-gray-500 mt-2 max-w-md mx-auto">
        Tambahkan buku favorit Anda ke wishlist untuk menyimpannya di sini.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
      >
        Jelajahi Koleksi Buku
      </button>
    </div>
  );
}
