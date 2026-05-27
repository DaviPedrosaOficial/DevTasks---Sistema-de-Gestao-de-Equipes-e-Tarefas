function ConfirmModal({ isOpen, title, message, confirmText = "Confirmar", cancelText = "Cancelar", onConfirm, onClose }) {

    if (!isOpen) {
        return null;
    }

    return (

        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200"
            >

                <div className="mb-6">

                    <h2 className="text-2xl font-bold text-white">

                        {title}

                    </h2>

                    <p className="text-zinc-400 mt-3 leading-relaxed">

                        {message}

                    </p>

                </div>

                <div className="flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        className="bg-zinc-700 hover:bg-zinc-600 transition px-5 py-3 rounded-xl font-semibold cursor-pointer"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-xl font-semibold cursor-pointer"
                    >
                        {confirmText}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ConfirmModal;