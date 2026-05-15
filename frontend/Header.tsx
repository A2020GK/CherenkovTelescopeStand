import { useContext } from "react"
import { SettingsContext } from "./Settings"

export const Header = () => {
    const { setOpen } = useContext(SettingsContext)
    return <header>
        <ul>
            <li><span className="box"><a href="/"><img src="/favicon.ico" alt="favicon" width={17}/> <b>Тестовый стенд</b></a></span></li>
            <li><span className="box"><a href="#" onClick={() => setOpen(true)}>Настройки</a></span></li>
        </ul>
    </header>
}