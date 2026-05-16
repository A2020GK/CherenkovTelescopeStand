import { useContext } from "react";
import { SettingsContext } from "./Settings";
import { Link } from "react-router-dom";

export const Header = () => {
    const { setOpen } = useContext(SettingsContext);
    return (
        <header>
            <ul>
                <li>
                    <span className="box">
                        <Link to="/"><img src="/favicon.ico" alt="favicon" width={17} /> <b>Тестовый стенд</b></Link>
                    </span>
                </li>
                <li>
                    <span className="box">
                        <button className="link-like" onClick={() => setOpen(true)}>Настройки</button>
                    </span>
                </li>
            </ul>
        </header>
    );
};