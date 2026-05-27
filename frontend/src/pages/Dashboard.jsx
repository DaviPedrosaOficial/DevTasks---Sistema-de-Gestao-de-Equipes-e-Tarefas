import { useState, useEffect, useContext, useCallback } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import toast from 'react-hot-toast';

import { AuthContext } from '../contexts/AuthContext';
import AppLayout from '../components/AppLayout';
import api from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {

    const { token } = useContext(AuthContext);

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    const fetchProjects = useCallback(async () => {

        try {

            const response = await api.get("/projects", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            setProjects(response.data.data)

        } catch (error) {

            toast.error(`Erro ao buscar projetos. Erro: ${error}`);

        }
    }, [token]);

    const fetchTasks = useCallback(async () => {

        try {

            const response = await api.get("/tasks", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            setTasks(response.data.data);

        } catch (error) {

            toast.error(`Erro ao buscar as tasks. Erro: ${error}`);

        }
    }, [token]);

    useEffect(() => {

        if (token) {
            fetchProjects();
            fetchTasks();
        }

    }, [token, fetchProjects, fetchTasks]);

    const pendingTasks = tasks.filter(
        (task) => task.status === "pending"
    );

    const inProgressTasks = tasks.filter(
        (task) => task.status === "in_progress"
    );

    const doneTasks = tasks.filter(
        (task) => task.status === "done"
    );

    const productivity = tasks.length ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

    const chartData = {
        labels: [
            "Pendentes",
            "Em progresso",
            "Concluídas"
        ],
        datasets: [
            {
                data: [
                    pendingTasks.length,
                    inProgressTasks.length,
                    doneTasks.length
                ],
                backgroundColor: [
                    "#eab308",
                    "#3b82f6",
                    "#22c55e"
                ],
                borderWidth: 0
            }
        ]
    };

    return (

        <AppLayout>
            <div className="min-h-screen bg-zinc-900 text-white flex">

                <main className="flex-1 p-8">

                    <header>

                        <h1 className="text-4xl font-bold">
                            Dashboard
                        </h1>

                        <p className="text-zinc-400 mt-2">
                            Visão geral da sua produtividade.
                        </p>

                    </header>

                    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

                        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">

                            <p className="text-zinc-400">
                                Projetos
                            </p>

                            <h2 className="text-4xl font-bold mt-3">
                                {projects.length}
                            </h2>

                        </div>

                        <div className="bg-blue-500/10 border border-blue-500 rounded-2xl p-6">

                            <p className="text-blue-300">
                                Tasks
                            </p>

                            <h2 className="text-4xl font-bold mt-3">
                                {tasks.length}
                            </h2>

                        </div>

                        <div className="bg-green-500/10 border border-green-500 rounded-2xl p-6">

                            <p className="text-green-300">
                                Concluídas
                            </p>

                            <h2 className="text-4xl font-bold mt-3">
                                {doneTasks.length}
                            </h2>

                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500 rounded-2xl p-6">

                            <p className="text-yellow-300">
                                Produtividade
                            </p>

                            <h2 className="text-4xl font-bold mt-3">
                                {productivity}%
                            </h2>

                            <div className="w-full h-3 bg-zinc-700 rounded-full mt-5 overflow-hidden">

                                <div
                                    className="h-full bg-yellow-400 transition-all duration-500"
                                    style={{
                                        width: `${productivity}%`
                                    }}
                                />

                            </div>

                        </div>

                    </section>

                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

                        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8">

                            <h2 className="text-2xl font-bold mb-6">
                                Distribuição das Tasks
                            </h2>

                            <div className="w-full max-w-[420px] mx-auto flex items-center justify-center min-h-[280px]">

                                <div className="w-full flex items-center justify-center min-h-[420px]">

                                    <Doughnut
                                        height={320}
                                        data={chartData}
                                        options={{
                                            cutout: "80%",
                                            plugins: {
                                                legend: {
                                                    position: "bottom",
                                                    labels: {
                                                        color: "#ffffff",
                                                        padding: 30,
                                                        usePointStyle: true,
                                                        pointStyle: "circle"
                                                    }
                                                }
                                            }
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8">

                            <h2 className="text-2xl font-bold mb-6">
                                Resumo das Tasks
                            </h2>

                            <div className="space-y-5">

                                <div>

                                    <div className="flex items-center justify-between mb-2">

                                        <span className="text-zinc-300">
                                            Pendentes
                                        </span>

                                        <span className="text-yellow-400 font-semibold">
                                            {pendingTasks.length}
                                        </span>

                                    </div>

                                    <div className="w-full h-3 bg-zinc-700 rounded-full overflow-hidden">

                                        <div
                                            className="h-full bg-yellow-500"
                                            style={{
                                                width: `${tasks.length ? (pendingTasks.length / tasks.length) * 100 : 0}%`
                                            }}
                                        />

                                    </div>

                                </div>

                                <div>

                                    <div className="flex items-center justify-between mb-2">

                                        <span className="text-zinc-300">
                                            Em progresso
                                        </span>

                                        <span className="text-blue-400 font-semibold">
                                            {inProgressTasks.length}
                                        </span>

                                    </div>

                                    <div className="w-full h-3 bg-zinc-700 rounded-full overflow-hidden">

                                        <div
                                            className="h-full bg-blue-500"
                                            style={{
                                                width: `${tasks.length ? (inProgressTasks.length / tasks.length) * 100 : 0}%`
                                            }}
                                        />

                                    </div>

                                </div>

                                <div>

                                    <div className="flex items-center justify-between mb-2">

                                        <span className="text-zinc-300">
                                            Concluídas
                                        </span>

                                        <span className="text-green-400 font-semibold">
                                            {doneTasks.length}
                                        </span>

                                    </div>

                                    <div className="w-full h-3 bg-zinc-700 rounded-full overflow-hidden">

                                        <div
                                            className="h-full bg-green-500"
                                            style={{
                                                width: `${tasks.length ? (doneTasks.length / tasks.length) * 100 : 0}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8">

                            <h2 className="text-2xl font-bold mb-6">
                                Tarefas
                            </h2>

                            <div className="space-y-4">

                                {
                                    tasks.slice(0, 5).map((task) => (

                                        <div
                                            key={task.id}
                                            className="bg-zinc-900 border border-zinc-700 rounded-xl p-4"
                                        >

                                            <h3 className="font-semibold">
                                                {task.title}
                                            </h3>

                                            <p className="text-zinc-400 text-sm mt-1">
                                                {task.status}
                                            </p>

                                        </div>
                                    ))
                                }

                            </div>

                        </div>

                    </section>

                </main>
            </div>
        </AppLayout>
    );
}

export default Dashboard;