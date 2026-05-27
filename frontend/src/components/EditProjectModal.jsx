import { useState, useEffect } from "react";

function EditProjectModal({ isOpen, onClose, onSave, project }) {

    const [name, setName] = useState("");

    const [description, setDescription] =
        useState("");

    useEffect(() => {

        if (project) {

            setName(project.name);

            setDescription(project.description);
        }

    }, [project]);

    if (!isOpen || !project) {
        return null;
    }

    return (

        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200"
            >

                <div className="flex items-center justify-between mb-8">

                    <h2 className="text-3xl font-bold text-white">

                        Editar Projeto

                    </h2>

                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition text-xl cursor-pointer"
                    >
                        ✕
                    </button>

                </div>

                <div className="space-y-5">

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Nome do projeto"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white outline-none focus:border-blue-500"
                    />

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        placeholder="Descrição do projeto"
                        className="w-full h-36 resize-none bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white outline-none focus:border-blue-500"
                    />

                </div>

                <div className="flex justify-end gap-4 mt-8">

                    <button
                        onClick={onClose}
                        className="bg-zinc-700 hover:bg-zinc-600 transition px-5 py-3 rounded-xl font-semibold cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={() =>
                            onSave({
                                id: project.id,
                                name,
                                description
                            })
                        }
                        className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl font-semibold cursor-pointer"
                    >
                        Salvar Alterações
                    </button>

                </div>

            </div>

        </div>
    );
}

export default EditProjectModal;