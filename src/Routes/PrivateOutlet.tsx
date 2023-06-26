import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/UI/Loader/Loader';
import { useContext } from 'react';
import AuthContext from '../store/context/auth-context';


const PrivateOutlet = () => {
    let location = useLocation()
    const isLoading = false;
    const { userDetails, isAuthenticated } = useContext(AuthContext)

    if (isLoading) {
        return (<Loader backDrop />)
    }
    if (!userDetails || !isAuthenticated) {
        return <Navigate to={"/login"} state={{ from: location }} replace />
    }
    return <Outlet />;
}

export default PrivateOutlet