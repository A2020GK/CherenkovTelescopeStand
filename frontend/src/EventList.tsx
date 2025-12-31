import { useEffect, useState } from "react";
import { TextContent } from "./TextContent";
import { api } from "./api";
import type { Event } from "./types";


export const EventList = () => {

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => { (async () => setEvents((await api.get("/event/list")).data))() }, [setEvents])

    return <>
        <TextContent>
            <h2>Список событий</h2>
            <table width="100%">
                <thead>
                    <tr><th>Название</th></tr>
                </thead>
                <tbody>
                    {events.map((event, index) => <tr key={index}><td><a href={`/event/${event.name}`}>{event.name}</a></td></tr>)}
                </tbody>
            </table>
        </TextContent>
    </>
}