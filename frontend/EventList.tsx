import { useEffect, useState } from "react";
import { TextContent } from "./TextContent";
import { api } from "./api";
import type { Event } from "./types";
import { Link } from "react-router-dom";

export const EventList = () => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        (async () => {
            const response = await api.get("/event/list");
            setEvents(response.data);
        })();
    }, []);

    return (
        <TextContent>
            <p className="logo"><img src="/favicon.ico" alt="Icon" width={48} /></p>
            <h2>Список событий</h2>
            <table width="100%">
                <thead>
                    <tr><th>Название</th></tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr key={index}>
                            <td><Link to={`/event/${event.name}`}>{event.name}</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TextContent>
    );
};