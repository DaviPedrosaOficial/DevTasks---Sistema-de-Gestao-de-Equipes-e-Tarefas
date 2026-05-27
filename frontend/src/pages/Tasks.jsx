import { useCallback, useContext, useEffect, useState, } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import TaskCard from "../components/TaskCard";
import AppLayout from "../components/AppLayout";

function Tasks() {

    const { id } = useParams();

    const { token } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [project, setproject] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");

    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [search, setSearch] = useState("");

    const [stats, setStats] = useState(null);

    const fetchTasks = useCallback(async () => {

        try {

            const response = await api.get(`/tasks/project/${id}`,
                {
                    params: {
                        ...(statusFilter && { status: statusFilter }),
                        ...(priorityFilter && { priority: priorityFilter }),
                        ...(search && { search }),
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

    }, [id, token, statusFilter, priorityFilter, search]);

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

    const fetchStats = useCallback(async () => {

        try {

            const response = await api.get(`/tasks/stats/project/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setStats(response.data.data);

        } catch (error) {

            toast.error(`Erro ao obter os status. Erro: ${error}`);

        }
    }, [id, token])

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

    async function updateTask(taskId, title, description, priority) {

        try {

            await api.put(`/tasks/${taskId}`,
                {
                    title,
                    description,
                    priority,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchTasks();

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

    async function handleDragEnd(result) {

        if (!result.destination) {
            return;
        }

        const taskId = Number(result.draggableId);

        const newStatus = result.destination.droppableId;

        try {

            await updateTaskStatus(taskId, newStatus);

        } catch (error) {

            toast.error(`Erro ao mover a task. Erro: ${error}`);

        }
    }

    useEffect(() => {

        if (token) {
            fetchTasks();
            fetchProject();
            fetchStats();
        }

    }, [token, fetchTasks, fetchProject]);

    const pendingTasks = tasks.filter(
        (task) => task.status === "pending"
    );

    const inProgressTasks = tasks.filter(
        (task) => task.status === "in_progress"
    );

    const doneTasks = tasks.filter(
        (task) => task.status === "done"
    );

    return (

        <AppLayout>

            <div className="min-h-screen bg-zinc-900 text-white flex">

                <main className="flex-1 p-8">

                    <header>

                        <h1 className="text-3xl font-bold">
                            {project ? `Tasks - ${project.name}` : "Tasks"}
                        </h1>

                        <p className="text-zinc-400 mt-2">
                            Gerencie as tarefas do projeto.
                        </p>

                    </header>

                    {/* Status das tasks */}
                    {
                        stats && (

                            <div className="grid grid-cols-4 gap-3 mt-6">

                                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                                    <p className="text-zinc-400 text-sm">
                                        Total
                                    </p>

                                    <h2 className="text-2xl font-bold mt-2">
                                        {stats.total}
                                    </h2>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-4">
                                    <p className="text-yellow-400 text-sm">
                                        Pendentes
                                    </p>

                                    <h2 className="text-2xl font-bold mt-2">
                                        {stats.pending}
                                    </h2>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500 rounded-xl p-4">
                                    <p className="text-blue-400 text-sm">
                                        Em progresso
                                    </p>

                                    <h2 className="text-2xl font-bold mt-2">
                                        {stats.in_progress}
                                    </h2>
                                </div>

                                <div className="bg-green-500/10 border border-green-500 rounded-xl p-4">
                                    <p className="text-green-400 text-sm">
                                        Concluídas
                                    </p>

                                    <h2 className="text-2xl font-bold mt-2">
                                        {stats.done}
                                    </h2>
                                </div>

                            </div>
                        )
                    }

                    {/* Formulário de cadastro de novas Task */}
                    <form
                        onSubmit={createTask}
                        className="mt-10 bg-zinc-800 p-6 rounded-2xl border border-zinc-700"
                    >

                        <h2 className="text-2xl font-bold mb-6">
                            Nova Task
                        </h2>

                        <div className="flex flex-wrap gap-3">

                            <input
                                type="text"
                                placeholder="Título da task"
                                className="flex-1 min-w-[260px] bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <textarea
                                placeholder="Descrição da task"
                                className="flex-[2] min-w-[320px] bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 resize-none h-[52px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="min-w-[220px] bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
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
                                className="min-w-[160px] bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-lg font-semibold cursor-pointer"
                            >
                                Criar Task
                            </button>

                        </div>

                    </form>

                    {/* Filtros de busca das tasks */}
                    <div className="mt-6 flex gap-4">

                        <input
                            type="text"
                            placeholder="Buscar tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none"
                        />

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

                    {/* Sessão das tasks */}
                    <section className="mt-10 grid gap-4">

                        <DragDropContext onDragEnd={handleDragEnd}>

                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mt-8">

                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">

                                    <h2 className="text-yellow-400 font-bold text-xl mb-4">
                                        Pendentes
                                    </h2>

                                    <Droppable droppableId="pending">

                                        {(provided, snapshot) => (

                                            <div
                                                className={`space-y-4 min-h-[200px] rounded-xl transition p-2 ${snapshot.isDraggingOver ? "bg-zinc-800/60" : ""}`}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >

                                                {
                                                    pendingTasks.map((task, index) => (
                                                        <Draggable
                                                            key={task.id}
                                                            draggableId={String(task.id)}
                                                            index={index}
                                                        >

                                                            {(provided, snapshot) => (

                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={provided.draggableProps.style}
                                                                    className={snapshot.isDragging ? "rotate-1 scale-[1.02]" : ""}
                                                                >

                                                                    <TaskCard
                                                                        task={task}
                                                                        updateTaskStatus={updateTaskStatus}
                                                                        updateTask={updateTask}
                                                                        deleteTask={deleteTask}
                                                                        isDragging={snapshot.isDragging}
                                                                    />

                                                                </div>

                                                            )}

                                                        </Draggable>
                                                    ))
                                                }

                                                {provided.placeholder}

                                            </div>
                                        )}

                                    </Droppable>



                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">

                                    <h2 className="text-blue-400 font-bold text-xl mb-4">
                                        Em progresso
                                    </h2>

                                    <Droppable droppableId="in_progress">

                                        {(provided, snapshot) => (

                                            <div
                                                className={`space-y-4 min-h-[200px] rounded-xl transition p-2 ${snapshot.isDraggingOver ? "bg-zinc-800/60" : ""}`}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >

                                                {
                                                    inProgressTasks.map((task, index) => (
                                                        <Draggable
                                                            key={task.id}
                                                            draggableId={String(task.id)}
                                                            index={index}
                                                        >

                                                            {(provided, snapshot) => (

                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={provided.draggableProps.style}
                                                                    className={snapshot.isDragging ? "rotate-1 scale-[1.02]" : ""}
                                                                >

                                                                    <TaskCard
                                                                        task={task}
                                                                        updateTaskStatus={updateTaskStatus}
                                                                        updateTask={updateTask}
                                                                        deleteTask={deleteTask}
                                                                        isDragging={snapshot.isDragging}
                                                                    />

                                                                </div>
                                                            )}

                                                        </Draggable>

                                                    ))
                                                }

                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>



                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">

                                    <h2 className="text-green-400 font-bold text-xl mb-4">
                                        Concluídas
                                    </h2>

                                    <Droppable droppableId="done">

                                        {(provided, snapshot) => (

                                            <div
                                                className={`space-y-4 min-h-[200px] rounded-xl transition p-2 ${snapshot.isDraggingOver ? "bg-zinc-800/60" : ""}`}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >

                                                {
                                                    doneTasks.map((task, index) => (
                                                        <Draggable
                                                            key={task.id}
                                                            draggableId={String(task.id)}
                                                            index={index}
                                                        >

                                                            {(provided, snapshot) => (

                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={provided.draggableProps.style}
                                                                    className={snapshot.isDragging ? "rotate-1 scale-[1.02]" : ""}
                                                                >

                                                                    <TaskCard
                                                                        task={task}
                                                                        updateTaskStatus={updateTaskStatus}
                                                                        updateTask={updateTask}
                                                                        deleteTask={deleteTask}
                                                                        isDragging={snapshot.isDragging}
                                                                    />

                                                                </div>
                                                            )}

                                                        </Draggable>

                                                    ))
                                                }

                                                {provided.placeholder}
                                            </div>
                                        )}

                                    </Droppable>



                                </div>

                            </div>

                        </DragDropContext>



                    </section>

                </main>

            </div>

        </AppLayout>
    );
}

export default Tasks;