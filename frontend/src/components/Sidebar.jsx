import { NavLink } from "react-router-dom";

function Sidebar({ collapsed }) {

    return (

        <aside
            className={`
                fixed
                top-16
                left-0
                h-[calc(100vh-64px)]
                bg-zinc-800
                border-r
                border-zinc-700
                overflow-hidden
                transition-all
                duration-500
                ease-in-out
                ${collapsed ? "w-0 opacity-0" : "w-60 opacity-100"}
            `}
        >

            <nav className="space-y-4 p-4 w-60">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-xl transition font-medium ${isActive
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/projects"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-xl transition font-medium ${isActive
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"
                        }`
                    }
                >
                    Projetos
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-xl transition font-medium ${isActive
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"
                        }`
                    }
                >
                    Perfil
                </NavLink>

            </nav>

        </aside>
    );
}

export default Sidebar;