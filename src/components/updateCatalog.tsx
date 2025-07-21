import { useState } from "react";
import { AxiosError } from "axios";
import api from "../services/api";
import { UpdateCatalogProps } from "../types";

export default function UpdateCatalog({
  initialData,
  onClose,
  onSuccess,
}: UpdateCatalogProps) {
  const [form, setForm] = useState({
    title: initialData.title,
    author: initialData.author,
    genre: initialData.genre,
    year: initialData.year,
    type: initialData.type,
    publisher: initialData.publisher,
    synopsis: initialData.synopsis,
    cover: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: string }>({
    text: "",
    type: "",
  });
  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    setMessage({ text: "", type: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, cover: file }));
      setMessage({ text: "", type: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "cover" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      await api.put(`/catalogs/${initialData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ text: "Katalog berhasil diperbarui!", type: "success" });
      setTimeout(onSuccess, 1200);
    } catch (err: unknown) {
      console.error(err);

      let errorMessage = "Terjadi kesalahan saat memperbarui katalog.";

      if (err instanceof AxiosError && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-orange-100">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-orange-200 bg-orange-50">
          <h2 className="text-2xl font-bold text-orange-800">Edit Buku</h2>
          <button
            onClick={onClose}
            className="text-orange-500 hover:text-orange-700 transition-colors p-1 rounded-full hover:bg-orange-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <div className="p-6">
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.type === "error"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <Input
                  label="Judul Buku*"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Penulis*"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Genre*"
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    options={genreOptions}
                  />
                  <Input
                    label="Tahun Terbit*"
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Select
                  label="Tipe"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  options={typeOptions}
                />
              </div>

              <div className="space-y-5">
                <Input
                  label="Penerbit"
                  name="publisher"
                  value={form.publisher}
                  onChange={handleChange}
                />
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">
                    Cover Baru
                  </label>
                  <div className="flex flex-col gap-3">
                    <label className="cursor-pointer flex flex-col items-center justify-center px-4 py-8 border-2 border-dashed border-orange-200 rounded-xl hover:border-orange-300 bg-orange-50 transition-colors">
                      <svg
                        className="h-10 w-10 text-orange-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm text-orange-600 font-medium">
                        {form.cover ? form.cover.name : "Pilih cover baru"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center gap-4">
                      {form.cover ? (
                        <img
                          src={URL.createObjectURL(form.cover)}
                          alt="new cover"
                          className="h-24 object-contain border rounded-lg"
                        />
                      ) : (
                        <img
                          src={`${BASE_URL}${initialData.coverUrl}`}
                          alt="existing cover"
                          className="h-24 object-contain border rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Sinopsis
              </label>
              <textarea
                name="synopsis"
                value={form.synopsis}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-orange-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-orange-300 rounded-xl text-orange-700 hover:bg-orange-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-60 transition-colors font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0"
                      ></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const genreOptions = [
  "Fiksi",
  "Non-Fiksi",
  "Fantasi",
  "Fiksi Ilmiah",
  "Sejarah",
  "Biografi",
  "Misteri",
  "Romantis",
  "Petualangan",
  "Horor",
  "Puisi",
  "Self-Improvement",
  "Psikologi",
  "Pendidikan",
  "Agama",
  "Politik",
  "Sains",
  "Seni & Budaya",
  "Komik",
  "Anak-anak",
  "Teknologi",
  "Ekonomi",
  "Sosial",
  "Kesehatan",
];

const typeOptions = [
  "Cetak",
  "Ebook",
  "Audiobook",
  "Komik",
  "Majalah",
  "Jurnal",
  "Artikel",
  "Ensiklopedia",
  "Manual Book",
];

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-orange-700">
        {label}
        {required}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 bg-white placeholder-orange-300"
      />
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[];
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-orange-700">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 bg-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
