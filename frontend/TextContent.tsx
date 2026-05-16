import type { ReactNode, HTMLAttributes } from "react";

export const TextContent = ({ children, ...props }: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className="text-container" {...props}>
            {children}
        </div>
    );
};