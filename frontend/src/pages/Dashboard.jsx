import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

import { AuthContext } from '../contexts/AuthContext';

import api from '../services/api';

import Sidebar from '../components/Sidebar';

function Dashboard() {

    const [projects, setProjects] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { token } = useContext(AuthContext);

    const navigate = useNavigate();

    const fetchProjects = useCallback(async () => {

        try {

            const response = await api.get("/projects", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            setProjects(response.data.data);

        } catch (error) {

            toast.error(`Erro ao buscar projetos. Erro: ${error}`);

        }
    }, [token]);

    async function createProject(event) {
        event.preventDefault();

        if (!name || !description) {
            return toast.error("Prencha todos os campos!");
        }

        try {

            await api.post("/projects",
                {
                    name,
                    description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            setName("");
            setDescription("");

            fetchProjects();

            toast.success("Projeto criado com sucesso!");

        } catch (error) {

            toast.error(`Erro ao criar projeto. Erro: ${error}`);
        }
    }

    useEffect(() => {

        if (token) {
            fetchProjects();
        }
    }, [token, fetchProjects])

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex">

            <Sidebar />

            {/* Conteúdo */}
            <main className="flex-1 p-8">

                <header className="flex items-center justify-between">

                    <div>
                        <h2 className="text-3xl font-bold">
                            Dashboard
                        </h2>

                        <p className="text-zinc-400 mt-1">
                            Gerencie seus projetos e tarefas.
                        </p>
                    </div>

                    <button className="bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-lg font-semibold cursor-pointer">
                        Sair
                    </button>

                </header>

                <form
                    onSubmit={createProject}
                    className="mt-10 bg-zinc-800 p-6 rounded-2xl border border-zinc-700"
                >

                    <h3 className="text-2xl font-bold mb-6">
                        Novo Projeto
                    </h3>

                    <div className="space-y-4">

                        <input
                            type="text"
                            placeholder="Nome do projeto"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <textarea
                            placeholder="Descrição do projeto"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 resize-none h-32"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-lg font-semibold cursor-pointer"
                        >
                            Criar Projeto
                        </button>

                    </div>

                </form>

                {/* Área principal */}
                <section className="mt-10">

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {
                            projects.map((project) => (

                                <div
                                    key={project.id}
                                    className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700"
                                    onClick={() => navigate(`/projects/${project.id}/tasks`)}
                                >
                                    <h3 className="text-xl font-semibold">
                                        {project.name}
                                    </h3>

                                    <p className="text-zinc-400 mt-2">
                                        {project.description}
                                    </p>
                                </div>
                            ))
                        }

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;