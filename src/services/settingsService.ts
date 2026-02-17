interface VideoSettings {
    BASE_INPUT: string;
    BASE_OUTPUT: string;
}

export function readSettings(): VideoSettings {
    return {
        BASE_INPUT: localStorage.getItem("BASE_INPUT") ||  "",
        BASE_OUTPUT: localStorage.getItem("BASE_OUTPUT") || "",
    };
}

export function writeSettings(settings: VideoSettings) {
    localStorage.setItem("BASE_INPUT", settings.BASE_INPUT);
    localStorage.setItem("BASE_OUTPUT", settings.BASE_OUTPUT);
}
