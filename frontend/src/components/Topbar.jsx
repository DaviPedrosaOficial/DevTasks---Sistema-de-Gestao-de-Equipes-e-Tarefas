import { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";

import { AuthContext } from "../contexts/AuthContext";

function Topbar({ toggleSidebar }) {

    const { logout } = useContext(AuthContext);

    return (

        <header className="fixed top-0 left-0 right-0 h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6 z-50">

            <div className="flex items-center gap-4">

                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-zinc-800 transition"
                >

                    <Menu size={20} />

                </button>

                <Link
                    to="/dashboard"
                    className="text-2xl font-bold text-blue-500"
                >
                    DevTasks
                </Link>

            </div>

            <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl transition"
            >

                <LogOut size={20} />

                Sair

            </button>

        </header>
    );
}

export default Topbar;