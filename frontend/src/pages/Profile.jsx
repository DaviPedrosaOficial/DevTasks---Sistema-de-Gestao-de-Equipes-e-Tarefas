import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

import AppLayout from '../components/AppLayout';
import ConfirmModal from '../components/ConfirmModal';

function Profile() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const { logout } = useContext(AuthContext);
    const userInitial = name.charAt(0).toUpperCase();

    const navigate = useNavigate();

    async function handleUpdateProfile() {

        try {

            await api.patch("/users/me",
                {
                    name,
                    email
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            toast.success("Perfil atualizado com sucesso!");

        } catch (error) {

            toast.error(`Erro ao atualizar perfil. Erro: ${error}`);

        }
    }

    async function handleDeleteAccount() {

        try {

            await api.delete("/users/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            logout();

            toast.success("Conta deletada com sucesso!");

            navigate("/");

        } catch (error) {

            toast.error(`Erro ao deletar conta. Erro: ${error}`);
        }
    }

    async function handleUpdatePassword() {

        if (!currentPassword || !newPassword || !confirmPassword) {

            return toast.error("Preencha todos os campos.");
        }

        if (newPassword !== confirmPassword) {

            return toast.error("As senhas não coincidem.");

        }

        try {

            await api.patch("/users/me/password",
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            toast.success("Senha alterada com sucesso!");

        } catch (error) {

            toast.error(`Erro ao alterar a senha. Erro: ${error}`);

        }
    }

    function openDeleteModal() {

        setIsConfirmModalOpen(true);
    }

    useEffect(() => {

        async function loadProfile() {

            try {

                const response = await api.get("/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const user = response.data.data;

                setName(user.name);
                setEmail(user.email);

            } catch (error) {

                console.log(error);

                toast.error("Erro ao carregar perfil.");
            }
        }

        loadProfile();

    }, []);

    return (

        <AppLayout>

            <div className="max-w-4xl mx-auto">

                <header className="mb-10">

                    <h1 className="text-4xl font-bold text-white">
                        Meu Perfil
                    </h1>

                    <p className="text-zinc-400 mt-2">
                        Gerencie suas informações pessoais.
                    </p>

                </header>

                <section className="bg-zinc-800 border border-zinc-700 rounded-3xl p-8 shadow-lg">

                    <div className="flex items-center gap-6 mb-10">

                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold shadow-lg shadow-blue-500/20">

                            {userInitial}

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold text-white">

                                {name || "Usuário"}

                            </h2>

                            <p className="text-zinc-400">

                                Bem-vindo ao seu perfil

                            </p>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>

                            <label className="block text-zinc-300 mb-2">
                                Nome
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                            />

                        </div>

                        <div>

                            <label className="block text-zinc-300 mb-2">
                                E-mail
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                            />

                        </div>

                    </div>

                    <button
                        className="mt-8 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-semibold"
                        onClick={handleUpdateProfile}
                    >
                        Salvar alterações
                    </button>

                    <section className="mt-10 bg-zinc-800 border border-zinc-700 rounded-3xl p-8 shadow-lg">

                        <h2 className="text-2xl font-bold text-white mb-6">
                            Alterar Senha
                        </h2>

                        <div className="space-y-5">

                            <div>

                                <label className="block text-zinc-300 mb-2">
                                    Senha Atual
                                </label>

                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                                />

                            </div>

                            <div>

                                <label className="block text-zinc-300 mb-2">
                                    Nova Senha
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                                />

                            </div>

                            <div>

                                <label className="block text-zinc-300 mb-2">
                                    Confirmar Nova Senha
                                </label>

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                                />

                            </div>

                            <button
                                onClick={handleUpdatePassword}
                                className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-semibold"
                            >
                                Alterar Senha
                            </button>

                        </div>

                    </section>

                </section>

                <section className="mt-10 bg-red-500/10 border border-red-500/30 rounded-3xl p-8">

                    <h2 className="text-2xl font-bold text-red-400">
                        Zona Perigosa
                    </h2>

                    <p className="text-zinc-400 mt-2">
                        Essa ação removerá permanentemente sua conta e todos os seus dados.
                    </p>

                    <button
                        className="mt-6 bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-xl font-semibold text-white"
                        onClick={openDeleteModal}
                    >
                        Deletar Conta
                    </button>

                </section>

            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title="Deletar Conta"
                message="Tem certeza que deseja deletar sua conta? Todos os seus dados serão removidos permanentemente."
                confirmText="Deletar Conta"
                cancelText="Cancelar"
                onConfirm={handleDeleteAccount}
                onClose={() => setIsConfirmModalOpen(false)}
            />

        </AppLayout>

    );
}

export default Profile;