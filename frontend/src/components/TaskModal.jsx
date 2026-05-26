function TaskModal({ task, open, onClose }) {

    if (!open) {
        return null;
    }

    return (

        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >

            <div
                className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl p-8"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-3xl font-bold text-white whitespace-pre-wrap">
                        {task.title}
                    </h2>


                    <button
                        onClick={onClose}
                        className="bg-zinc-800 hover:bg-zinc-700 transition px-4 py-2 rounded-lg text-white cursor-pointer"
                    >
                        Fechar
                    </button>

                </div>

                <div className="space-y-6">

                    <div>

                        <p className="text-zinc-400 text-sm mb-2">
                            Descrição
                        </p>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 text-zinc-200 whitespace-pre-wrap">
                            {task.description || "Sem descrição"}
                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">

                            <p className="text-zinc-400 text-sm mb-2">
                                Status
                            </p>

                            <p className="text-lg font-semibold text-white">
                                {task.status}
                            </p>

                        </div>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">

                            <p className="text-zinc-400 text-sm mb-2">
                                Prioridade
                            </p>

                            <p className="text-lg font-semibold text-white">
                                {task.priority}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default TaskModal;