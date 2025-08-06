import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 px-4 py-8">
      <div className="w-full flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-sm text-center">
        <svg
          className="w-16 h-16 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Oops! Halaman Tidak Ditemukan
        </h3>
        <p className="mt-2 text-gray-600">
          Sepertinya halaman yang Anda cari tidak ada.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 mt-6 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
        >
          Kembali ke beranda
        </button>
      </div>
    </div>
  );
}
