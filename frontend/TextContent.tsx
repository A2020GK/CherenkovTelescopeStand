import type { ReactNode } from "react";

export const TextContent = ({ children, ...props }: { children: ReactNode, [key: string]: any }) => {
    return <div className="text-container" {...props}>
        {children}
    </div>
}