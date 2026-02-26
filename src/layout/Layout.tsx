import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
    return (
        <div className="h-screen bg-[#0B1220] text-gray-200 flex overflow-hidden">
            <div className="shrink-0">
                <Sidebar />
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>

                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    draggable
                />
            </div>
        </div>
    );
}
