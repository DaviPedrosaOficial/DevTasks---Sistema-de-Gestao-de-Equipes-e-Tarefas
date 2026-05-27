import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from 'react';

import toast from 'react-hot-toast';

import api from '../services/api';

import { AuthContext } from "../contexts/AuthContext";



function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();

        if (!email || !password) {
            return toast.error("Preencha todos os campos!");
        }

        try {
            const response = await api.post("/users/login", {
                email,
                password
            });

            const token = response.data.data.token;

            login(token);

            localStorage.setItem("token", token);

            toast.success("Usuário logado com sucesso!");

            navigate("/dashboard");

        } catch (error) {
            console.log(error);

            toast.error("Email ou senha inválidos.");
        }
    }

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-zinc-800 p-8 rounded-2xl shadow-xl">

                <h1 className="text-4xl font-bold text-white text-center">
                    Login
                </h1>

                <p className="text-zinc-400 text-center mt-2">
                    Gerencie suas tarefas de forma simples.
                </p>

                <form
                    className="mt-8 space-y-4"
                    onSubmit={handleLogin}
                >

                    <div>
                        <label className="text-zinc-300 block mb-2">
                            E-mail
                        </label>

                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-zinc-300 block mb-2">
                            Senha
                        </label>

                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 text-white font-semibold cursor-pointer"
                    >
                        Entrar
                    </button>

                </form>

                <p className="text-zinc-400 text-center mt-4">
                    Não tem uma conta?{" "}

                    <Link to="/register" className="text-blue-500 hover:underline">
                        Registre-se
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;