"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
    theme: "light",
    toggleTheme: () => {},
});

const STORAGE_KEY = "uranote-theme";

function getSnapshot(): Theme {
    return document.documentElement.classList.contains(
        "dark"
    )
        ? "dark"
        : "light";
}

function getServerSnapshot(): Theme {
    return "light";
}

function subscribe(callback: () => void) {
    const observer = new MutationObserver(callback);

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });

    return () => observer.disconnect();
}

function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle(
        "dark",
        theme === "dark"
    );

    document.documentElement.style.colorScheme = theme;

    try {
        window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // Ignore storage failures (private mode, etc.).
    }
}

function useThemeStore(): ThemeContextValue {
    const theme = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );

    const toggleTheme = useCallback(() => {
        applyTheme(
            getSnapshot() === "dark" ? "light" : "dark"
        );
    }, []);

    return useMemo(
        () => ({ theme, toggleTheme }),
        [theme, toggleTheme]
    );
}

export function useTheme(): ThemeContextValue {
    return useContext(ThemeContext);
}

export default function ThemeProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeContext.Provider value={useThemeStore()}>
            {children}
        </ThemeContext.Provider>
    );
}
