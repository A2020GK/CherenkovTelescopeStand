import type { ReactNode } from "react";
import styles from "./TextContent.module.css";

export const TextContent = ({ children }: { children: ReactNode }) => {
    return <main className={styles.textContent}>
        <div className={styles.container}>
            {children}
        </div>
    </main>
}