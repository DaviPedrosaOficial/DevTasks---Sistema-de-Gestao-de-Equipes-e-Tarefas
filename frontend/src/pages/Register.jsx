import { Link } from "react-router-dom";

function Register() {
    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-zinc-800 p-8 rounded-2xl shadow-xl">

                <h1 className="text-4xl font-bold text-white text-center">
                    Criar Conta
                </h1>

                <p className="text-zinc-400 text-center mt-2">
                    Comece a organizar seus projetos e tarefas.
                </p>

                <form className="mt-8 space-y-4">

                    <div>
                        <label className="text-zinc-300 block mb-2">
                            Nome
                        </label>

                        <input
                            type="text"
                            placeholder="Digite seu nome"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-zinc-300 block mb-2">
                            E-mail
                        </label>

                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
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
                        />
                    </div>

                    <div>
                        <label className="text-zinc-300 block mb-2">
                            Confirmar Senha
                        </label>

                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 text-white font-semibold cursor-pointer"
                    >
                        Criar Conta
                    </button>

                </form>

                <p className="text-zinc-400 text-center mt-6">
                    Já possui conta?{" "}

                    <Link
                        to="/"
                        className="text-blue-500 hover:text-blue-400"
                    >
                        Entrar
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;