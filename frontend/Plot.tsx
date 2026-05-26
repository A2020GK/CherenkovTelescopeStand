import { type FC, useRef, useEffect } from "react";
import Plot, { type Figure } from "react-plotly.js";
import type { Layout } from "plotly.js";
import { useLayouts } from "./LayoutContext";

type PlotElProps = {
    index: number;
    data: number[];
    chName: string;
    layout?: Partial<Layout>;
    titleLayout?: Partial<Layout["title"]>;
    storageKey?: string;
};

const cutExternalLayout = (layout: Partial<Layout>): Partial<Layout> => {
    // Remove properties width, height, margin if they exist
    const { width, height, margin, title, ...rest } = layout;
    return rest;
}

const figureToLayout = (update: Readonly<Figure>): Partial<Layout> => {
    return cutExternalLayout(update.layout ?? {});
}

const applyAxisRelayout = (layout: Partial<Layout>, relayoutEvent: any): Partial<Layout> => {
    if (!relayoutEvent || typeof relayoutEvent !== "object") return layout;

    const next = { ...layout } as Partial<Layout>;
    const xaxis = { ...(next.xaxis ?? {}) } as Record<string, unknown>;

    Object.entries(relayoutEvent).forEach(([key, value]) => {
        if (!key.startsWith("xaxis.")) return;
        const axisKey = key.slice("xaxis.".length);
        xaxis[axisKey] = value;
    });

    if (Object.keys(xaxis).length > 0) next.xaxis = xaxis;
    return next;
};

const PlotEl: FC<PlotElProps> = ({ index, data, chName, layout, titleLayout, storageKey }) => {
    const { getLayout, setLayout } = useLayouts();
    const initialLayout = storageKey ? getLayout(storageKey) : {};
    const storedLayoutRef = useRef<Partial<Layout>>(initialLayout);

    useEffect(() => {
        if (!storageKey) return;
        const saved = getLayout(storageKey);
        if (saved && Object.keys(saved).length > 0) storedLayoutRef.current = saved;
    }, [storageKey]);

    const persistFromFigure = (update: Readonly<Figure>) => {
        storedLayoutRef.current = figureToLayout(update);
    };

    const handleRelayout = (relayoutEvent: any) => {
        // relayoutEvent may contain partial keys; merge into stored layout if possible
        // What is my life?
        try {
            const merged = { ...(storedLayoutRef.current ?? {}), ...(relayoutEvent as Partial<Layout>) };
            storedLayoutRef.current = applyAxisRelayout(merged, relayoutEvent);
        } catch {
            // ignore
        }
        if (storageKey) setLayout(storageKey, storedLayoutRef.current);
    };

    useEffect(() => {
        return () => {
            if (storageKey) setLayout(storageKey, storedLayoutRef.current);
        };
    }, [storageKey, setLayout]);

    return (
        <Plot 
            layout={{
                ...storedLayoutRef.current,
                ...(layout ?? {}),
                // Keep X axis pinned to the bottom and show a y=0 reference line.
                xaxis: {
                    ...(storedLayoutRef.current?.xaxis ?? {}),
                    side: "bottom",
                    automargin: true,
                    showline: true,
                    linecolor: "#888",
                    linewidth: 1,
                    ticks: "outside",
                    tickcolor: "#888",
                    ...(layout?.xaxis ?? {})
                },
                yaxis: {
                    ...(storedLayoutRef.current?.yaxis ?? {}),
                    zeroline: true,
                    zerolinecolor: "#888",
                    zerolinewidth: 1,
                    ...(layout?.yaxis ?? {})
                },
                margin: { ...(storedLayoutRef.current?.margin ?? {}), b: 40, ...(layout?.margin ?? {}) },
                title: { text: `Канал ${index + 1} (${chName})`, ...(titleLayout ?? {}) }
            }}
            data={[{ y: data }]}
            onInitialized={persistFromFigure}
            onUpdate={persistFromFigure}
            onRelayout={handleRelayout}
            config={{modeBarButtonsToRemove:["resetScale2d"]}}
        />
    );
};

export default PlotEl;
