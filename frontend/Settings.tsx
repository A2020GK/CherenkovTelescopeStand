import { createContext, useState, useContext, type ReactNode, type MouseEvent, useEffect } from 'react'
import { TextContent } from './TextContent'

export interface Settings {
    chToColMap: Record<number, number> // Maps channels (and plots) to columns
    // (5 channels, 8 columns, 3 columns = garbage)
    channelsNames?: Record<number, string>
    channelsDisplay?: Record<number, boolean>
}

const STORAGE_KEY = 'cherenkov-telescope-stand.settings'

const DEFAULT_SETTINGS: Settings = {
    chToColMap: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
    channelsNames: { 0: 'Канал 1', 1: 'Канал 2', 2: 'Канал 3', 3: 'Канал 4', 4: 'Канал 5' },
    channelsDisplay: { 0: true, 1: true, 2: true, 3: true, 4: true }
}

const normalizeSettings = (settings?: Partial<Settings> | null): Settings => ({
    chToColMap: { ...DEFAULT_SETTINGS.chToColMap, ...(settings?.chToColMap ?? {}) },
    channelsNames: { ...DEFAULT_SETTINGS.channelsNames, ...(settings?.channelsNames ?? {}) },
    channelsDisplay: { ...DEFAULT_SETTINGS.channelsDisplay, ...(settings?.channelsDisplay ?? {}) }
})

interface SettingsContextType {
    open: boolean
    setOpen: (open: boolean) => void
    settings: Settings
    setSettings: (settings: Settings) => void
    hasLoaded: boolean
}

export const SettingsContext = createContext<SettingsContextType>({
    open: false,
    setOpen: () => { },
    settings: DEFAULT_SETTINGS,
    setSettings: () => { },
    hasLoaded: false
})

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

    useEffect(() => {
        try {
            const rawSettings = window.localStorage.getItem(STORAGE_KEY)
            if (rawSettings) {
                setSettings(normalizeSettings(JSON.parse(rawSettings) as Partial<Settings>))
            }
        } catch {
            setSettings(DEFAULT_SETTINGS)
        } finally {
            setHasLoaded(true)
        }
    }, []);

    return (
        <SettingsContext.Provider value={{ open, setOpen, settings, setSettings, hasLoaded }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const Settings = () => {
    const { open, setOpen, settings, setSettings, hasLoaded } = useContext(SettingsContext);

    const handleClose = () => {
        const validatedSettings = {
            ...settings,
            chToColMap: Object.fromEntries(
                Object.entries(settings.chToColMap).map(([ch, col]) =>
                    [ch, col === -1 ? 0 : col]
                )
            )
        };
        setSettings(validatedSettings);
        setOpen(false);
    }

    useEffect(() => {
        if (!open && hasLoaded) {
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
            } catch {
                // Ignore storage write failures.
            }
        }
    }, [open, settings, hasLoaded]);

    // Close settings on Escape key
    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, handleClose]);

    const handleChannelChange = (channel: number, column: number) => {
        setSettings({
            ...settings,
            chToColMap: {
                ...settings.chToColMap,
                [channel]: column
            }
        })
    }

    const handleChannelNameChange = (channel: number, name: string) => {
        setSettings({
            ...settings,
            channelsNames: {
                ...settings.channelsNames,
                [channel]: name
            }
        })
    }

    const handleChannelDisplayChange = (channel: number, display: boolean) => {
        setSettings({
            ...settings,
            channelsDisplay: {
                ...settings.channelsDisplay,
                [channel]: display
            }
        })
    }

    return (
        <div className={`settings${open ? " open" : ""}`} onClick={handleClose}>
            <TextContent
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-heading"
                onClick={(e: MouseEvent) => e.stopPropagation()}
            >
                <h2 id="settings-heading">Настройки</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Отображать</th>
                            <th>Канал</th>
                            <th>Имя</th>
                            <th>Столбец в файле</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(settings.chToColMap).map((channel) => (
                            <tr key={channel}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={settings.channelsDisplay?.[Number(channel)] ?? true}
                                        onChange={(e) => handleChannelDisplayChange(Number(channel), e.target.checked)}
                                    />
                                </td>
                                <td>Канал {Number(channel) + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={settings.channelsNames?.[Number(channel)] || ''}
                                        onChange={(e) => handleChannelNameChange(Number(channel), e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min={1}
                                        max={8}
                                        value={settings.chToColMap[Number(channel)] === -1 ? '' : settings.chToColMap[Number(channel)] + 1}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            handleChannelChange(Number(channel), value === '' ? -1 : Number(value) - 1);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p><button onClick={handleClose}>Закрыть</button></p>
            </TextContent>
        </div>
    )
}
