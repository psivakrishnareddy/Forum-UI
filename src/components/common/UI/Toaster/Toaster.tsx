import { ToastContent } from '../../../../constants/types';
import { ToastContainer} from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
/**
 * USAGE
 * -----
 * 
 * const { toastContent, setToastContent } = useContext<IToastContext>(ToastContext);
 * toastContent - content of the toast
 * setToastContent - pass a new toast object
 * 
 * sample toast obj
 * setToastContent({
    timestamp: Date.now(),
    type: 'Primary'/'Secondary'/'Success'/'Danger'/'Warning'/'Info'/'Dark'
    ,message: 'PUT YOUR MESSAGE HERE',
    expireAt: Date.now() + (PUT YOU SECONDS HERE * 1000),
    show: true
 * });
 */

declare type ToasterProps = {
    toasterContent?: ToastContent[]
}

const Toaster: React.FC<ToasterProps> = () => {
    // let { toastContent } = useContext<IToastContext>(ToastContext);
    return <div>
           {/* <ToastContainer position="top-end" className="p-3">
        {toastContent?.map((contentObj: ToastContent) => {
            return <Toast bg={contentObj.type.toLowerCase()} key={`toaster-${contentObj.timestamp}`} show={contentObj.show} delay={Date.now() - contentObj.expireAt} autohide>
                {contentObj.header && <Toast.Header closeButton={false}>
                    <strong className="me-auto">{contentObj.header}</strong>
                </Toast.Header>}
                    <Toast.Body className={['dark', 'warning', 'success', 'primary', 'danger'].includes(contentObj.type.toLowerCase()) ? 'text-white' : ''}>
                        {contentObj.message}
                    </Toast.Body>
                </Toast>
        })}
      </ToastContainer> */}
        <ToastContainer position="top-right"  autoClose={2000} hideProgressBar={false} newestOnTop={false}
            closeOnClick rtl={false}
            pauseOnFocusLoss={false}
            draggable pauseOnHover theme="light"/> 
     </div>
}

Toaster.defaultProps = {}

export default Toaster;