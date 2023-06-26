
import React from "react"
import ReactDOM from "react-dom"
import "./Loader.scss"

const Loader: React.FC<{ backDrop?: boolean }> = ({ backDrop }) => {
    return (
        <>
            {ReactDOM.createPortal(<>
                {backDrop && <div className="backdrop position-fixed top-0 left-0 w-100 h-100 bg-dark"></div>}
                <div className='loader'></div></>, document.getElementById('global-loader-overlay-root') as Element)}
        </>
    )
}

export default Loader