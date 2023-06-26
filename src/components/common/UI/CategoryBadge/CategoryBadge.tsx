import { ReactNode } from "react";
import "./CategoryBadge.scss"
import CatIndicator from "./CatIndicator";

const CategoryBadge: React.FC<{ children?: ReactNode, color?: string }> = ({ children, color }) => {
    return (<div className="d-flex justify-content-around align-items-center border border-1 border-primary catg-badge px-2 py-1">
        <CatIndicator color={color}></CatIndicator>
        <div className="label px-1 text-primary fw-normal fs-9">{children}</div>
    </div>)
}

export default CategoryBadge;