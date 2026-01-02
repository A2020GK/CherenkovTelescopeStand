import { useContext, useEffect, useState } from "react";
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

    const layout: Partial<Layout> = { width: 1000, height: 160, margin: { t: 20, b: 20, r: 20 } };
    const titleLayout: Partial<Layout['title']> = { yanchor: "middle" };

    const PlotEl = ({ index, data, chName }: { index: number, data: number[], chName: string }) => <Plot layout={{ ...layout, title: { text: `Канал ${index + 1} (${chName})`, ...titleLayout } }} data={[{ y: data }]} />

    return event.data ? <>

        {/* We use settings as channels source and chToColMap for mapping channels to data items from event */}
        {Object.entries(settings.chToColMap).map(([chStr, col]) => {
            const ch = parseInt(chStr);
            const chName = settings.channelsNames && settings.channelsNames[ch] ? settings.channelsNames[ch] : `Канал ${ch + 1}`;
            return <div className="plot" key={ch}><PlotEl index={ch} data={event.data![col]} chName={chName} /></div>
        })}

    </> : <TextContent>
        <p>Загрузка события...</p>
    </TextContent>
}