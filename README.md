# CherenkovTelescopeStand
Test Stand Software

## Plan
An Event is a CSV file with 1024 rows of 8 columns
So the task is to parse that file to 8 columns, map that columns to the 5 physical channels, draw plots.
Also the UI need to show temperature (from Arduino somehow, need to know how exactly, mb serial port?)

## Backend
HTTP:
- `/event/list` - List all the events
- `/event/{event}` - Get the event
- `/settings` - Get/set the settings
Socket.IO:
- `event` - New event
- `temp` - New temperature
