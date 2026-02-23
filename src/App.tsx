import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TrimVideo from "./pages/TrimVideo";
import Layout from "./layout/Layout";
import TimelineEditor from "./pages/TimelineEditor";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/" />} />
                    <Route path="trimVideo" element={<TrimVideo />} />
                    <Route path="editVideo" element={<TimelineEditor />} />
                </Route>
            </Routes>
        </Router>
    );
}
