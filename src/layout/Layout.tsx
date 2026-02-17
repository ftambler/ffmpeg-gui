import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
    return (
        <div className="flex h-screen">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 bg-grey-100 p-6 overflow-auto">
                <Outlet />
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
    );
}
