import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { readSettings, writeSettings } from "../services/settingsService";

export default function SettingsPage() {
    const [baseInput, setBaseInput] = useState("");
    const [baseOutput, setBaseOutput] = useState("");

    useEffect(() => {
        const settings = readSettings();
        setBaseInput(settings.BASE_INPUT);
        setBaseOutput(settings.BASE_OUTPUT);
    }, []);

    const handleSave = () => {
        writeSettings({ BASE_INPUT: baseInput, BASE_OUTPUT: baseOutput });
        toast.success("Settings saved!");
    };

    return (
        <div className="max-w-xl bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>

            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Base Input Path</label>
                    <input
                        type="text"
                        value={baseInput}
                        placeholder="E:/Videos/Raw"
                        onChange={(e) => setBaseInput(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Base Output Path</label>
                    <input
                        type="text"
                        value={baseOutput}
                        placeholder="E:/Videos/Trimmed"
                        onChange={(e) => setBaseOutput(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
}
