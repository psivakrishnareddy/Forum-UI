import { ReactNode, useContext } from "react"
import GlobalContext from "../../../store/context/global-context";
import Loader from "../UI/Loader/Loader";
import Header from "./Header/Header"


const Layout: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const { state } = useContext(GlobalContext);
    return (
        <>
            <Header />
            <main className="dash-app-container container-fluid container-md">
                {children}
            </main>
            {state?.isAppLoading && <Loader backDrop />}
        </>
    )
}

export default Layout