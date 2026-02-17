import { NavLink } from "react-router-dom";
import { Scissors, Settings } from "lucide-react"; // import desired icons

const routes = [
    { path: "/trim", label: "Trim Video", icon: Scissors },
];

const settings = { path: "/settings", label: "Settings", icon: Settings }

export default function Sidebar() {
    return (
        <aside className="w-80 bg-gray-800 text-white flex flex-col">
            <h1 className="text-xl font-bold p-4 border-b border-gray-700">
                Video Trimmer
            </h1>

            <nav className="flex-1 p-4 flex flex-col gap-2">
                {routes.map((route) => {
                    const Icon = route.icon;
                    return (
                        <NavLink
                            key={route.path}
                            to={route.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            {route.label}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-700">
                <NavLink
                    key={settings.path}
                    to={settings.path}
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""
                        }`
                    }
                >
                    <settings.icon className="w-5 h-5" />
                    {settings.label}
                </NavLink>

            </div>
        </aside>
    );
}
