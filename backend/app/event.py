from os import listdir
from math import isfinite

from .utils import BaseSchema
from pandas import read_csv
from fastapi import APIRouter

router = APIRouter(prefix="/event")

class Event(BaseSchema):
    name: str

class EventData(Event):
    data: list[list[float | None]] # Columns with rows
    
parsed_events: dict[str, EventData] = {} # When an event is queried first, it's parsed and stored here


def _sanitize_data(data: list[list[float]]) -> list[list[float | None]]:
    sanitized: list[list[float | None]] = []
    for column in data:
        sanitized_column: list[float | None] = []
        for value in column:
            if value is None:
                sanitized_column.append(None)
                continue
            try:
                sanitized_column.append(value if isfinite(value) else None)
            except TypeError:
                sanitized_column.append(None)
        sanitized.append(sanitized_column)
    return sanitized
    

@router.get("/list", tags=["Event"], description="Get a list of all events.")
def get_event_list() -> list[Event]:
    events = [
        Event(name=x)
        for x in listdir("events")
        if x[0] != "."
    ]
    return events

@router.get("/{event_name}", tags=["Event"], description="Get data for a specific event.")
def get_event(event_name: str) -> EventData:
    # if event_name in parsed_events:
    #     return parsed_events[event_name]
    df = read_csv(f"events/{event_name}", header=None, sep=",")
    # Need to extract columns as elements of a list
    data = df.transpose().values.tolist()
    event_data = EventData(name=event_name, data=_sanitize_data(data))
    parsed_events[event_name] = event_data
    return event_data
