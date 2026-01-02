from . import app
from .utils import BaseSchema
import json

class Settings(BaseSchema):
    ch_to_col_map: dict[int, int] # Mapping from channel number to column number
    channels_names: dict[int, str] | None = None # Custom names for channels


# Create settings.json if not exists to 1,2,3,4,5: 1,2,3,4,5
import os
if not os.path.exists("settings.json"):
    default_settings = Settings(ch_to_col_map={i: i for i in range(1, 6)}, channels_names={i: f"Channel {i}" for i in range(1, 6)})
    with open("settings.json", "w") as f:
        json.dump(default_settings.model_dump(), f, indent=4) 

@app.get("/settings", tags=["Settings"], description="Get current application settings.")
def get_settings() -> Settings:
    # Read file settings.json
    with open("settings.json", "r") as f:
        data = json.load(f)
    settings = Settings(**data)
    return settings

@app.post("/settings", tags=["Settings"], description="Update application settings.")
def update_settings(settings: Settings) -> Settings:
    # Write to file settings.json
    with open("settings.json", "w") as f:
        json.dump(settings.model_dump(), f, indent=4)
    return settings