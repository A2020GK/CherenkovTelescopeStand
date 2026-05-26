import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Layout } from "plotly.js";

type Layouts = Record<string, Partial<Layout>>;

const STORAGE_KEY = 'cherenkov-telescope-stand.layouts';

const LayoutsContext = createContext<{
    getLayout: (key: string) => Partial<Layout>;
    setLayout: (key: string, layout: Partial<Layout>) => void;
}>({
    getLayout: () => ({}),
    setLayout: () => { }
});

export const LayoutsProvider = ({ children }: { children: ReactNode }) => {
    const [layouts, setLayouts] = useState<Layouts>(() => {
        if (typeof window === "undefined") return {};
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as Layouts) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
        } catch {
            // ignore
        }
    }, [layouts]);

    const getLayout = useCallback((key: string) => layouts[key] ?? {}, [layouts]);
    const setLayout = useCallback((key: string, layout: Partial<Layout>) => {
        setLayouts(prev => ({ ...prev, [key]: { ...(prev[key] ?? {}), ...layout } }));
    }, []);

    const value = useMemo(() => ({ getLayout, setLayout }), [getLayout, setLayout]);

    return (
        <LayoutsContext.Provider value={value}>
            {children}
        </LayoutsContext.Provider>
    );
};

export const useLayouts = () => useContext(LayoutsContext);
