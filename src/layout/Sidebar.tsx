import { NavLink } from "react-router-dom";
import { Scissors, Settings } from "lucide-react";

const routes = [
    { path: "/trim", label: "Trim Video", icon: Scissors },
];

const settings = { path: "/settings", label: "Settings", icon: Settings };

export default function Sidebar() {
    return (
        <aside className="w-72 shrink-0 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 flex flex-col shadow-xl">
            <h1 className="text-2xl font-semibold px-6 py-5 border-b border-slate-700 tracking-wide">
                FFMPEG - GUI
            </h1>

            <nav className="flex-1 px-4 py-6 flex flex-col gap-3">
                {routes.map((route) => {
                    const Icon = route.icon;
                    return (
                        <NavLink
                            key={route.path}
                            to={route.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                hover:bg-slate-700/60 hover:translate-x-1
                                ${isActive ? "bg-slate-700 shadow-inner" : ""}`
                            }
                        >
                            <Icon className="w-5 h-5 opacity-80" />
                            <span className="text-sm font-medium tracking-wide">
                                {route.label}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="px-4 py-5 border-t border-slate-700">
                <NavLink
                    key={settings.path}
                    to={settings.path}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                        hover:bg-slate-700/60 hover:translate-x-1
                        ${isActive ? "bg-slate-700 shadow-inner" : ""}`
                    }
                >
                    <settings.icon className="w-5 h-5 opacity-80" />
                    <span className="text-sm font-medium tracking-wide">
                        {settings.label}
                    </span>
                </NavLink>
            </div>
        </aside>
    );
}
