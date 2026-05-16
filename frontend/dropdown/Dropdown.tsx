import "./dropdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import type { ReactNode, FC } from "react";

interface DropdownProps {
    title: string;
    children: ReactNode;
}

const Dropdown: FC<DropdownProps> = ({ title, children }) => {
    return (
        <div className="dropdown">
            <div className="dropdown-toggle box"><FontAwesomeIcon icon={faCaretRight} /> {title}</div>
            <div className="dropdown-content box">
                {children}
            </div>
        </div>
    );
};

export default Dropdown;