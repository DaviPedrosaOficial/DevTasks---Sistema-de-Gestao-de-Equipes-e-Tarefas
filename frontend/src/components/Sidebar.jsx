import { Link } from "react-router-dom";

function Sidebar() {

    return (
        <aside className="w-64 bg-zinc-800 p-6 border-r border-zinc-700">

            <h1 className="text-3xl font-bold text-blue-500">
                DevTasks
            </h1>

            <nav className="mt-10 space-y-4">

                <Link
                    to="/dashboard"
                    className="block w-full px-4 py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition"
                >
                    Projetos
                </Link>

            </nav>

        </aside>
    );
}

export default Sidebar;