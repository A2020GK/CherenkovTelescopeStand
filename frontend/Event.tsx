import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { StatusContext } from "./Status";
import type { Event as EventType } from "./types";
import { api } from "./api";
import Plot from "react-plotly.js";
import { TextContent } from "./TextContent";
import type { Layout } from "plotly.js";
import { SettingsContext } from "./Settings";

export const Event = () => {
    const { eventName } = useParams<{ eventName: string }>();
    const [, setStatus] = useContext(StatusContext);
    const [event, setEvent] = useState<EventType>({ name: eventName || "", data: undefined });
    const { settings } = useContext(SettingsContext);

    const plotGroup = useRef<HTMLDivElement>(null);
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
    }, [event.data]);

    useEffect(() => {
        console.log(`Loading event ${eventName}...`);
        setStatus(`Загрузка события ${event.name}...`);
    }, [eventName])
    useEffect(() => {
        (async () => {
            setEvent((await api.get(`/event/${eventName}`)).data);
            console.log(`Event ${event.name} loaded`);
            setStatus(`Событие ${event.name} загружено`);
        })()
    }, [setEvent]);


    // Calculate visible channels before rendering
    const visibleChannels = Object.entries(settings.chToColMap).filter(([chStr]) => {
        const ch = parseInt(chStr);
        const shouldDisplay = settings.channelsDisplay?.[ch] ?? true;
        return shouldDisplay;
    });

    const plotCount = visibleChannels.length;
    const normalizedPlotCount = plotCount > 0 ? plotCount : 1;

    // Plot layout settings, + margin: 5px for plot container in CSS
    const layout: Partial<Layout> = { width: plotGroupSize.width - 20, height: plotGroupSize.height / normalizedPlotCount - 20, margin: { t: 20, b: 20, r: 20 } };

    const titleLayout: Partial<Layout['title']> = { yanchor: "middle" };

    const PlotEl = ({ index, data, chName }: { index: number, data: number[], chName: string }) => <Plot layout={{ ...layout, title: { text: `Канал ${index + 1} (${chName})`, ...titleLayout } }} data={[{ y: data }]} />



    return event.data ? <>
        <div className="plot-group" ref={plotGroup}>

            {/* Render pre-filtered visible channels */}
            {visibleChannels.map(([chStr, col]) => {
                const ch = parseInt(chStr);
                const chName = settings.channelsNames && settings.channelsNames[ch] ? settings.channelsNames[ch] : `Канал ${ch + 1}`;
                return <div className="plot" key={ch}><PlotEl index={ch} data={event.data![col]} chName={chName} /></div>
            })}

        </div>
        <div className="sidebar">
            <h3>Действа</h3>
            <ul>
                <li><button>Кнопко раз</button></li>
                <li><button>Кнопко два</button></li>
            </ul>
        </div>

    </> : <TextContent>
        <p>Загрузка события...</p>
    </TextContent>
}