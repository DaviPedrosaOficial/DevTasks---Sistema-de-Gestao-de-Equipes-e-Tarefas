import { useState } from "react";

function TaskCard({ task, updateTaskStatus, updateTask, deleteTask, isDragging }) {

    const [editing, setEditing] = useState(false);

    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || "");
    const [editPriority, setEditPriority] = useState(task.priority);

    async function handleSave() {

        await updateTask(
            task.id,
            editTitle,
            editDescription,
            editPriority
        );

        setEditing(false);
    }

    function getStatusColor(status) {

        switch (status) {

            case "pending":
                return "bg-yellow-600";

            case "in_progress":
                return "bg-blue-600";

            case "done":
                return "bg-green-600";

            default:
                return "bg-zinc-700";
        }
    }

    function getPriorityColor(priority) {

        switch (priority) {

            case "low":
                return "bg-green-600";

            case "medium":
                return "bg-yellow-600";

            case "high":
                return "bg-red-600";

            default:
                return "bg-zinc-600";
        }
    }

    function getTaskCardStyle(status) {

        switch (status) {

            case "pending":
                return "border-yellow-500 bg-yellow-500/5";

            case "in_progress":
                return "border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10";

            case "done":
                return "border-green-500 bg-green-500/5 opacity-70";

            default:
                return "border-zinc-700";
        }
    }

    return (

        <div
            className={`border rounded-2xl p-5 transition-all duration-45 min-w-0 ${getTaskCardStyle(task.status)} ${isDragging ? "shadow-2xl scale-[1.02] rotate-1 z-50" : ""}`}
        >

            <div className="flex items-start justify-between gap-4">

                {
                    editing ? (

                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white outline-none"
                        />

                    ) : (

                        <h2 className="text-xl font-semibold break-words">
                            {task.title}
                        </h2>
                    )
                }

                <div className="flex gap-2 shrink-0">

                    {
                        editing ? (

                            <>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 hover:bg-green-700 transition px-3 py-2 rounded-lg text-sm cursor-pointer"
                                >
                                    Salvar
                                </button>

                                <button
                                    onClick={() => setEditing(false)}
                                    className="bg-zinc-600 hover:bg-zinc-700 transition px-3 py-2 rounded-lg text-sm cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            </>

                        ) : (

                            <>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="bg-blue-600 hover:bg-blue-700 transition px-3 py-2 rounded-lg text-sm cursor-pointer"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="bg-red-600 hover:bg-red-700 transition px-3 py-2 rounded-lg text-sm cursor-pointer"
                                >
                                    Deletar
                                </button>
                            </>
                        )
                    }

                </div>

            </div>

            {
                editing ? (

                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full mt-4 bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none resize-none h-28"
                    />

                ) : (

                    <p className="text-zinc-400 mt-2">
                        {task.description}
                    </p>
                )
            }

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mt-6">

                {
                    editing ? (

                        <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white outline-none"
                        >

                            <option value="low">
                                Baixa prioridade
                            </option>

                            <option value="medium">
                                Média prioridade
                            </option>

                            <option value="high">
                                Alta prioridade
                            </option>

                        </select>

                    ) : (

                        <div className={`px-4 py-2 rounded-full text-sm font-medium text-white ${getPriorityColor(task.priority)}`}>

                            {
                                task.priority === "low"
                                    ? "Baixa prioridade"
                                    : task.priority === "medium"
                                        ? "Média prioridade"
                                        : "Alta prioridade"
                            }

                        </div>
                    )
                }

                <select
                    value={task.status}
                    onChange={(e) =>
                        updateTaskStatus(task.id, e.target.value)
                    }
                    className={`${getStatusColor(task.status)} border border-zinc-600 rounded-lg px-4 py-2 text-white font-medium min-w-[170px]`}
                >

                    <option value="pending">
                        Pendente
                    </option>

                    <option value="in_progress">
                        Em progresso
                    </option>

                    <option value="done">
                        Concluída
                    </option>

                </select>

            </div>

        </div>
    );
}

export default TaskCard;