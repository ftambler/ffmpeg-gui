import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
    return (
        <div className="h-screen overflow-hidden bg-[#0B1220] text-gray-200 flex">
            <Sidebar />

            <div className="flex-1 min-w-0 min-h-0 flex flex-col">
                {/* <TopBar /> */}

                <main className="flex-1 min-h-0 overflow-hidden">
                    <Outlet></Outlet>
                </main>

                {/* Global Toast Container */}
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
