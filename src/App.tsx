import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TrimVideo from "./pages/TrimVideo";
import Layout from "./layout/Layout";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/trim" />} />
                    <Route path="trim" element={<TrimVideo />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
