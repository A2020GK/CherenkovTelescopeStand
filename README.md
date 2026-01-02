# Cherenkov Telescope Stand

A visualization system for the SPHERE test stand. This application processes event data from CSV files, maps them to physical detector channels, and provides real-time (not fully implemented) visualization and monitoring capabilities.

## Overview

This is a full-stack application designed to:
- Parse and manage event data from CSV files (1024 rows × 8 columns)
- Map raw data columns to 5 physical detector channels
- Visualize event data through interactive plots
- Provide some math tools (not implemented)

## Project Structure

```
CherenkovTelescopeStand/
├── backend/              # FastAPI Python backend
│   ├── __init__.py      # FastAPI app initialization and Socket.IO setup (Socket.IO is not actually used)
│   ├── event.py         # Event data endpoints
│   ├── settings.py      # Settings management endpoints
│   └── utils.py         # Shared utilities
├── frontend/            # React + TypeScript frontend
│   ├── src/            # Source code
│   │   ├── App.tsx     # Main app component
│   │   ├── Event.tsx   # Event detail view with plots
│   │   ├── EventList.tsx # Event listing page
│   │   ├── Header.tsx  # Navigation header
│   │   ├── Settings.tsx # Settings dialog
│   │   ├── Status.tsx  # Status indicator
│   │   ├── api.ts      # API client
│   │   ├── types.ts    # TypeScript types
│   │   └── dropdown/   # Dropdown component
│   └── index.html      # Entry point
├── events/             # CSV data files directory
├── settings.json       # Application settings
├── requirements.txt    # Python dependencies
└── LICENSE            # MIT License
```

## Technology Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Python-SocketIO** - Real-time bidirectional communication (Not used for now)
- **Pandas** - Data processing and CSV parsing
- **Python-dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Plotly.js** - Interactive data visualization
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **FontAwesome** - Icon library

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Installation

1. Navigate to the project root directory
2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   python -m uvicorn backend:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx vite --port 4000
   ```
   The frontend will be available at `http://localhost:4000`

## API Documentation

### REST Endpoints

#### Events
- **GET `/event/list`** - Get list of all available events
  ```json
  [
    { "name": "test.csv" },
    { "name": "test2.csv" }
  ]
  ```

- **GET `/event/{event_name}`** - Get event data with parsed columns
  ```json
  {
    "name": "test.csv",
    "data": [[col1_values...], [col2_values...], ...]
  }
  ```

#### Settings
- **GET `/settings`** - Get current application settings
  ```json
  {
    "ch_to_col_map": { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4 },
    "channels_names": { "0": "Канал 1", "1": "Канал 2", ... }
  }
  ```

- **POST `/settings`** - Update application settings
  - Accepts same format as GET response

### WebSocket Events (Socket.IO)

- **`connect`** - Client connects to server
- **`disconnect`** - Client disconnects
- **`event`** - New event notification (planned)
- **`temp`** - Temperature update (planned)

## Configuration

### settings.json

Configure channel-to-column mapping and channel names:

```json
{
    "ch_to_col_map": {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4
    },
    "channels_names": {
        "0": "Канал 1",
        "1": "Канал 2",
        "2": "Канал 3",
        "3": "Канал 4",
        "4": "Канал 5"
    }
}
```

- `ch_to_col_map`: Maps physical channels to CSV columns
- `channels_names`: Custom display names for each channel

## Usage

1. **Add Event Data**: Place CSV files in the `events/` directory
   - Expected format: 1024 rows × 8 columns

2. **View Events**: Navigate to the event list page to see all available events

3. **Analyze Events**: Click on an event to view its data visualized as interactive plots

4. **Configure Channels**: Use the Settings dialog to:
   - Remap columns to physical channels
   - Set custom names for channels

## Development

### Backend Development
- API endpoints are defined in `backend/event.py` and `backend/settings.py`
- Modify `settings.py` to add new configuration options
- Socket.IO event handlers are in `backend/__init__.py` (not used)

### Frontend Development
- Page components are in `frontend/src/` root
- Reusable components are in subdirectories (e.g., `dropdown/`)
- API calls are centralized in `frontend/src/api.ts`
- Types are defined in `frontend/src/types.ts`

## Future Enhancements

- [ ] Temperature monitoring via Arduino serial port
- [ ] Real-time event streaming via Socket.IO
- [ ] Event data export functionality
- [ ] Advanced data analysis and statistics

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Developed by [Antony](https://github.com/A2020GK/CherenkovTelescopeStand)
