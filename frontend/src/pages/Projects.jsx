import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

import AppLayout from '../components/AppLayout';
import EditProjectModal from '../components/EditProjectModal';
import ConfirmModal from '../components/ConfirmModal';

function Projects() {

    const [projects, setProjects] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

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

    function openEditModal(project) {

        setSelectedProject(project);
        setIsEditModalOpen(true);
    }

    async function updateProject(updatedProject) {

        try {

            await api.put(`/projects/${updatedProject.id}`,
                {
                    name: updatedProject.name,
                    description:
                        updatedProject.description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Projeto atualizado com sucesso!");

            setIsEditModalOpen(false);
            setSelectedProject(null);

            fetchProjects();

        } catch (error) {

            toast.error(`Erro ao atualizar projeto. Erro: ${error}`);
        }
    }

    async function deleteProject() {

        try {

            await api.delete(`/projects/${projectToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Projeto deletado com sucesso!");

            setIsConfirmModalOpen(false);
            setProjectToDelete(null);

            fetchProjects();

        } catch (error) {

            toast.error(`Erro ao deletar projeto. Erro: ${error}`);

        }
    }

    function openDeleteModal(projectId) {

        setProjectToDelete(projectId);
        setIsConfirmModalOpen(true);
    }

    useEffect(() => {

        if (token) {
            fetchProjects();
        }
    }, [token, fetchProjects])

    return (

        <AppLayout>
            <div className="min-h-screen bg-zinc-900 text-white flex">

                {/* Conteúdo */}
                <main className="flex-1 p-8">

                    <header className="flex items-center justify-between">

                        <div>
                            <h2 className="text-3xl font-bold">
                                Projetos
                            </h2>

                            <p className="text-zinc-400 mt-1">
                                Gerencie seus projetos e tarefas.
                            </p>
                        </div>

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
                                        className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-blue-500 transition flex flex-col justify-between min-h-[220px]"
                                    >

                                        <div
                                            onClick={() => navigate(`/projects/${project.id}/tasks`)}
                                            className="cursor-pointer flex-1"
                                        >

                                            <h3 className="text-xl font-semibold">

                                                {project.name}

                                            </h3>

                                            <p className="text-zinc-400 mt-2">

                                                {project.description}

                                            </p>

                                        </div>

                                        <div className="flex gap-3 mt-6">

                                            <button
                                                onClick={() => openEditModal(project)}
                                                className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg font-semibold cursor-pointer"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => openDeleteModal(project.id)}
                                                className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-semibold cursor-pointer"
                                            >
                                                Deletar
                                            </button>

                                        </div>
                                    </div>

                                ))
                            }

                        </div>

                    </section>

                </main>

            </div>

            <EditProjectModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedProject(null);
                }}
                onSave={updateProject}
                project={selectedProject}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title="Deletar Projeto"
                message="Tem certeza que deseja deletar este projeto? Essa ação não poderá ser desfeita."
                confirmText="Deletar"
                cancelText="Cancelar"
                onConfirm={deleteProject}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                    setProjectToDelete(null);
                }}
            />

        </AppLayout>
    );
}

export default Projects;