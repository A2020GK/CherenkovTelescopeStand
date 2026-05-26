import { Header } from "./Header"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import type { ReactNode } from "react"
import { Status, StatusProvider } from "./Status"
import { Settings, SettingsProvider } from "./Settings"
import { LayoutsProvider } from "./LayoutContext"

export const App = ({ children }: { children: ReactNode }) => {
    return <>
        <StatusProvider>
            <SettingsProvider>
                <LayoutsProvider>
                    <Header />
                    <main>
                        {children}
                    </main>
                    <footer>
                        <Status />
                        <div>Developed by <a target="_blank" href="https://github.com/A2020GK/CherenkovTelescopeStand">Antony <FontAwesomeIcon icon={faGithub} /></a></div>
                    </footer>
                    <Settings />
                </LayoutsProvider>
            </SettingsProvider>
        </StatusProvider>
    </>
}