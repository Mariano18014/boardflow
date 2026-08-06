
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type TextScale = "small" | "normal" | "large" | "x-large";

interface AppearanceContextType {
    theme: Theme;
    textScale: TextScale;
    reducedMotion: boolean;
    highContrast: boolean;
    setTheme: (theme: Theme) => void;
    setTextScale: (scale: TextScale) => void;
    setReducedMotion: (reduced: boolean) => void;
    setHighContrast: (contrast: boolean) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(
        (localStorage.getItem("appearance-theme") as Theme) || "system"
    );
    const [textScale, setTextScale] = useState<TextScale>(
        (localStorage.getItem("appearance-text-scale") as TextScale) || "normal"
    );
    const [reducedMotion, setReducedMotion] = useState<boolean>(
        localStorage.getItem("appearance-reduced-motion") === "true"
    );
    const [highContrast, setHighContrast] = useState<boolean>(
        localStorage.getItem("appearance-high-contrast") === "true"
    );

    useEffect(() => {
        localStorage.setItem("appearance-theme", theme);
        localStorage.setItem("appearance-text-scale", textScale);
        localStorage.setItem("appearance-reduced-motion", reducedMotion.toString());
        localStorage.setItem("appearance-high-contrast", highContrast.toString());

        // Apply Theme
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        // Apply Text Scale
        root.setAttribute("data-text-scale", textScale);

        // Apply Reduced Motion
        if (reducedMotion) {
            root.classList.add("reduced-motion");
        } else {
            root.classList.remove("reduced-motion");
        }

        // Apply High Contrast
        if (highContrast) {
            root.classList.add("high-contrast");
        } else {
            root.classList.remove("high-contrast");
        }
    }, [theme, textScale, reducedMotion, highContrast]);

    return (
        <AppearanceContext.Provider
            value={{
                theme,
                textScale,
                reducedMotion,
                highContrast,
                setTheme,
                setTextScale,
                setReducedMotion,
                setHighContrast,
            }}
        >
            {children}
        </AppearanceContext.Provider>
    );
}

export const useAppearance = () => {
    const context = useContext(AppearanceContext);
    if (context === undefined) {
        throw new Error("useAppearance must be used within an AppearanceProvider");
    }
    return context;
}
