import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StatusContext } from "./Status";
import type { Event as EventType } from "./types";
import { api } from "./api";

export const Event = () => {
    const { eventName } = useParams<{ eventName: string }>();
    const [, setStatus] = useContext(StatusContext);
    const [event, setEvent] = useState<EventType>({ name: eventName || "" });
    useEffect(() => {
        setStatus(`Загрузка события ${event.name}...`);
    }, [eventName])
    useEffect(() => {
        (async () => {
            setEvent((await api.get(`/event/${eventName}`)).data)
            setStatus(`Событие ${event.name} загружено`);
        })()
    }, [setEvent])
    return <main>
        
    </main>
}