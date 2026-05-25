import { useCallback, useContext, useEffect, useState, } from "react";

import { useParams } from "react-router-dom";

import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";

import { AuthContext } from "../contexts/AuthContext";

import api from "../services/api";

function Tasks() {

    const { id } = useParams();

    const { token } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [project, setproject] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");

    const [editingTaskId, setEditingTaskId] = useState(null);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("medium");

    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    const fetchTasks = useCallback(async () => {

        try {

            const response = await api.get(`/tasks/project/${id}`,
                {
                    params: {
                        ...(statusFilter && { status: statusFilter }),
                        ...(priorityFilter && { priority: priorityFilter }),
                    },

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTasks(response.data.data.tasks);

        } catch (error) {

            console.log(error);

            toast.error(`Erro ao buscar tasks. Erro: ${error}`);
        }

    }, [id, token, statusFilter, priorityFilter]);

    const fetchProject = useCallback(async () => {

        try {

            const response = await api.get(`/projects/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setproject(response.data.data);

        } catch (error) {

            toast.error(`Erro ao buscar projeto. Erro: ${error}`);

        }
    }, [id, token]);

    async function createTask(event) {

        event.preventDefault();

        if (!title || !description) {
            return toast.error("Preencha todos os campos.");
        }

        try {

            await api.post("/tasks",
                {
                    title,
                    description,
                    priority,
                    projectId: Number(id),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTitle("");
            setDescription("");
            setPriority("medium");

            fetchTasks();

            toast.success("Task criada com sucesso!");

        } catch (error) {

            console.log(error);

            toast.error(`Erro ao criar task. Erro: ${error}`);
        }
    }

    async function updateTaskStatus(taskId, status) {

        try {

            await api.patch(
                `/tasks/${taskId}/status`,
                {
                    status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchTasks();

            toast.success("Status atualizado!");

        } catch (error) {

            console.log(error);

            toast.error(`Erro ao atualizar status. Erro: ${error}`);
        }
    }

    function startEditTask(task) {

        setEditingTaskId(task.id);

        setEditTitle(task.title);
        setEditDescription(task.description || "");
        setEditPriority(task.priority);
    }

    function cancelEdit() {

        setEditingTaskId(null);

        setEditTitle("");
        setEditDescription("");
        setEditPriority("medium");
    }

    async function updateTask(taskId) {

        try {

            await api.put(`/tasks/${taskId}`,
                {
                    title: editTitle,
                    description: editDescription,
                    priority: editPriority,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchTasks();

            cancelEdit();

            toast.success("Task atualizada!");

        } catch (error) {

            console.log(error);

            toast.error("Erro ao atualizar task.");
        }
    }

    async function deleteTask(taskId) {

        try {

            await api.delete(
                `/tasks/${taskId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchTasks();

            toast.success("Task deletada com sucesso!");

        } catch (error) {

            console.log(error);

            toast.error("Erro ao deletar task.");
        }
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

    function getTaskCardStyle(status) {

        switch (status) {

            case "pending":
                return `
                border-yellow-500
                bg-yellow-500/5
            `;

            case "in_progress":
                return `
                border-blue-500
                bg-blue-500/5
                shadow-lg shadow-blue-500/10
            `;

            case "done":
                return `
                border-green-500
                bg-green-500/5
                opacity-70
            `;

            default:
                return `
                border-zinc-700
            `;
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

    useEffect(() => {

        if (token) {
            fetchTasks();
            fetchProject();
        }

    }, [token, fetchTasks, fetchProject]);

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex">

            <Sidebar />

            <main className="flex-1 p-8">

                <header>

                    <h1 className="text-3xl font-bold">
                        {project ? `Tasks - ${project.name}` : "Tasks"}
                    </h1>

                    <p className="text-zinc-400 mt-2">
                        Gerencie as tarefas do projeto.
                    </p>

                </header>
                <form
                    onSubmit={createTask}
                    className="mt-10 bg-zinc-800 p-6 rounded-2xl border border-zinc-700"
                >

                    <h2 className="text-2xl font-bold mb-6">
                        Nova Task
                    </h2>

                    <div className="space-y-4">

                        <input
                            type="text"
                            placeholder="Título da task"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            placeholder="Descrição da task"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 resize-none h-32"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
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

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-lg font-semibold cursor-pointer"
                        >
                            Criar Task
                        </button>

                    </div>

                </form>

                <div className="mt-6 flex gap-4">

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none"
                    >

                        <option value="">
                            Todos os status
                        </option>

                        <option value="pending">
                            Pendentes
                        </option>

                        <option value="in_progress">
                            Em progresso
                        </option>

                        <option value="done">
                            Concluídas
                        </option>

                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none"
                    >

                        <option value="">
                            Todas prioridades
                        </option>

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

                </div>

                <section className="mt-10 grid gap-4">

                    {
                        tasks.map((task) => (

                            <div
                                key={task.id}
                                className={`bg-zinc-800 border rounded-xl p-5 transition-all duration-300 ${getTaskCardStyle(task.status)}`}
                            >

                                <div className="flex items-start justify-between gap-4">

                                    {
                                        editingTaskId === task.id ? (

                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white outline-none"
                                            />

                                        ) : (

                                            <h2 className="text-xl font-semibold">
                                                {task.title}
                                            </h2>
                                        )
                                    }

                                    <div className="flex gap-2 shrink-0">

                                        {
                                            editingTaskId === task.id ? (

                                                <>
                                                    <button
                                                        onClick={() => updateTask(task.id)}
                                                        className="bg-green-600 hover:bg-green-700 transition px-3 py-2 rounded-lg text-sm cursor-pointer"
                                                    >
                                                        Salvar
                                                    </button>

                                                    <button
                                                        onClick={cancelEdit}
                                                        className="bg-zinc-600 hover:bg-zinc-700 transition px-3 py-2 rounded-lg text-sm cursor-pointer"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>

                                            ) : (

                                                <>
                                                    <button
                                                        onClick={() => startEditTask(task)}
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
                                    editingTaskId === task.id ? (

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

                                <div className="flex items-center justify-between mt-6">

                                    {
                                        editingTaskId === task.id ? (

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

                                                {task.priority === "low" ? "Baixa prioridade" : task.priority === "medium" ? "Média prioridade" : "Alta prioridade"}

                                            </div>
                                        )
                                    }

                                    <select
                                        value={task.status}
                                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
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
                        ))
                    }

                </section>

            </main>

        </div>
    );
}

export default Tasks;