import { createContext, useState, useContext, type ReactNode, type MouseEvent, useEffect } from 'react'
import { TextContent } from './TextContent'
import { api } from './api'

export interface Settings {
    chToColMap: Record<number, number> // Maps channels (and plots) to columns
    // (5 channels, 8 columns, 3 columns = garbage)
    channelsNames?: Record<number, string>
}

interface SettingsContextType {
    open: boolean
    setOpen: (open: boolean) => void
    settings: Settings
    setSettings: (settings: Settings) => void
}

export const SettingsContext = createContext<SettingsContextType>({
    open: false,
    setOpen: () => { },
    settings: { chToColMap: { } },
    setSettings: () => { }
})

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false)
    const [settings, setSettings] = useState<Settings>({ chToColMap: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 }, channelsNames: { 0: "Канал 1", 1: "Канал 2", 2: "Канал 3", 3: "Канал 4", 4: "Канал 5" } })

    useEffect(() => {
        (async () => {
            setSettings((await api.get("/settings")).data);
            console.log("Settings loaded");
        })()
    }, []);

    return (
        <SettingsContext.Provider value={{ open, setOpen, settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const Settings = () => {
    const { open, setOpen, settings, setSettings } = useContext(SettingsContext);

    useEffect(() => {
        if (!open) {
            (async () => {
                await api.post("/settings", settings);
                console.log("Settings saved");
            })()
        }
    }, [open, settings]);

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

    const handleClose = () => {
        // Validate: convert empty values to 0
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
                            <th>Канал</th>
                            <th>Имя</th>
                            <th>Столбец в файле</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(settings.chToColMap).map((channel) => (
                            <tr key={channel}>
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
