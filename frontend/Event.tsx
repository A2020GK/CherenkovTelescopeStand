import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { StatusContext } from "./Status";
import type { Event as EventType } from "./types";
import { api } from "./api";
import Plot from "react-plotly.js";
import { TextContent } from "./TextContent";
import type { Layout } from "plotly.js";
import { SettingsContext } from "./Settings";
import type { FC } from "react";

export const Event: FC = () => {
    const params = useParams<{ eventName?: string }>();
    const eventName = params.eventName;
    const [, setStatus] = useContext(StatusContext);
    const [event, setEvent] = useState<EventType | null>(null);
    const { settings } = useContext(SettingsContext);

    const plotGroup = useRef<HTMLDivElement | null>(null);
    const [plotGroupSize, setPlotGroupSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    // Need to collect plot group div and use its offsets for plot sizing
    useEffect(() => {
        const element = plotGroup.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver(() => {
            const rect = element.getBoundingClientRect();
            setPlotGroupSize({ width: rect.width, height: rect.height });
        });

        resizeObserver.observe(element);

        return () => resizeObserver.disconnect();
    }, [event?.data]);

    // Load event when eventName changes
    useEffect(() => {
        if (!eventName) return;
        setStatus(`Загрузка события ${eventName}...`);

        (async () => {
            try {
                const response = await api.get(`/event/${eventName}`);
                setEvent(response.data);
                setStatus(`Событие ${response.data.name} загружено`);
            } catch (err) {
                setStatus(`Ошибка загрузки ${eventName}`);
            }
        })();
    }, [eventName, setStatus]);

    // Calculate visible channels
    const visibleChannels = Object.entries(settings.chToColMap).filter(([chStr]) => {
        const ch = parseInt(chStr, 10);
        return settings.channelsDisplay?.[ch] ?? true;
    });

    const plotCount = visibleChannels.length;
    const normalizedPlotCount = plotCount > 0 ? plotCount : 1;

    // Plot layout settings, + margin: 5px for plot container in CSS
    const layout: Partial<Layout> = { width: plotGroupSize.width - 20, height: plotGroupSize.height / normalizedPlotCount - 20, margin: { t: 20, b: 20, r: 20 } };
    const titleLayout: Partial<Layout['title']> = { yanchor: "middle" };

    const PlotEl: FC<{ index: number; data: number[]; chName: string }> = ({ index, data, chName }) => (
        <Plot layout={{ ...layout, title: { text: `Канал ${index + 1} (${chName})`, ...titleLayout } }} data={[{ y: data }]} />
    );

    if (!event || !event.data) {
        return <TextContent>
            <p>Загрузка события...</p>
        </TextContent>;
    }

    return (
        <>
            <div className="plot-group" ref={plotGroup}>
                {visibleChannels.map(([chStr, col]) => {
                    const ch = parseInt(chStr, 10);
                    const chName = settings.channelsNames?.[ch] ?? `Канал ${ch + 1}`;
                    const series = event.data![col];
                    return (
                        <div className="plot" key={ch}>
                            <PlotEl index={ch} data={series} chName={chName} />
                        </div>
                    );
                })}
            </div>

            <div className="sidebar">
                <h3>Действия</h3>
                <ul>
                    <li><button>Кнопка 1</button></li>
                    <li><button>Кнопка 2</button></li>
                </ul>
            </div>
        </>
    );
};