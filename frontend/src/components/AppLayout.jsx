import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout({ children }) {

    const [collapsed, setCollapsed] = useState(false);

    function toggleSidebar() {

        setCollapsed(!collapsed);
    }

    return (

        <div className="min-h-screen bg-zinc-900 text-white">

            <Topbar toggleSidebar={toggleSidebar} />

            <div className="pt-16 flex">

                <Sidebar collapsed={collapsed} />

                <main
                    className={`flex-1 p-6 transition-all duration-500 ${collapsed ? "ml-0" : "ml-60"}`}
                >

                    {children}

                </main>

            </div>

        </div>
    );
}

export default AppLayout;