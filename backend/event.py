from os import listdir

from . import app
from .utils import BaseSchema

from pandas import read_csv


class Event(BaseSchema):
    name: str

class EventData(Event):
    data: list[list[int]] # Columns with rows
    
parsed_events: dict[str, EventData] = {} # When an event is queried first, it's parsed and stored here
    

@app.get("/event/list", tags=["Event"], description="Get a list of all events.")
def get_event_list() -> list[Event]:
    events = [
        Event(name=x)
        for x in listdir("events")
        if x[0] != "."
    ]
    return events

@app.get("/event/{event_name}", tags=["Event"], description="Get data for a specific event.")
def get_event(event_name: str) -> EventData:
    if event_name in parsed_events:
        return parsed_events[event_name]
    df = read_csv(f"events/{event_name}", header=None, sep=";")
    # Need to extract columns as elements of a list
    data = df.transpose().values.tolist()
    event_data = EventData(name=event_name, data=data)
    parsed_events[event_name] = event_data
    return event_data
