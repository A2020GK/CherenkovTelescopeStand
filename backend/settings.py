from . import app
from .utils import BaseSchema
import json
import os


class Settings(BaseSchema):
    ch_to_col_map: dict[int, int]  # Mapping from channel number to column number (zero-based)
    channels_names: dict[int, str] | None = None  # Custom names for channels
    channels_display: dict[int, bool] | None = None  # Display flags for channels


def _default_settings() -> Settings:
    return Settings(
        ch_to_col_map={i: i for i in range(0, 5)},
        channels_names={i: f"Канал {i + 1}" for i in range(0, 5)},
        channels_display={i: True for i in range(0, 5)},
    )

@app.get("/settings", tags=["Settings"], description="Get current application settings.")
def get_settings() -> Settings:
    try:
        with open("settings.json", "r", encoding='utf-8') as f:
            data = json.load(f)
        settings = Settings(**data)
    except (json.JSONDecodeError, FileNotFoundError):
        settings = _default_settings()
        with open("settings.json", "w", encoding='utf-8') as f:
            json.dump(settings.model_dump(), f, indent=4, ensure_ascii=False)
    return settings

@app.post("/settings", tags=["Settings"], description="Update application settings.")
def update_settings(settings: Settings) -> Settings:
    with open("settings.json", "w", encoding='utf-8') as f:
        json.dump(settings.model_dump(), f, indent=4, ensure_ascii=False)
    return settings