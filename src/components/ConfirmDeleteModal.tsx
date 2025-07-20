interface ConfirmDeleteModalProps {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  title,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-orange-800 mb-4">Konfirmasi Hapus</h3>
        <p className="text-orange-600 mb-6">
          Apakah Anda yakin ingin menghapus buku <strong>{title}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
