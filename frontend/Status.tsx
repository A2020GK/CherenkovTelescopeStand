import { createContext, useContext, useState, type ReactNode } from "react";

export const StatusContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>]>(["Ready", () => {}]);

export const StatusProvider = ({children}: {children: ReactNode}) => {
    const [status, setStatus] = useState<string>("Готово");
    return <StatusContext.Provider value={[status, setStatus]}>
        {children}
    </StatusContext.Provider>
}

export const Status = () => {
    const [status] = useContext(StatusContext);
    return <div className="status">{status}</div>
}