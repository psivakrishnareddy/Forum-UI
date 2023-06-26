import { Navigate } from 'react-router-dom';

const RequiresAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const user = true;
    return user ? (children) : (<Navigate to={"/login"} replace />)
}

export default RequiresAuth;