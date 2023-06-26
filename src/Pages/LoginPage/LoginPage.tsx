import React, { useContext, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import DashModal from '../../components/common/UI/DashModal/DashModal';
import AuthContext from '../../store/context/auth-context'
import GlobalContext from '../../store/context/global-context';
import { SET_LOGGED_OUT_TIMEOUT } from '../../store/Types/GlobalTypes';

const LoginPage = () => {
    const { login, token, userDetails, isAuthenticated} = useContext(AuthContext);
    const { state,dispatch } = React.useContext(GlobalContext);
    const navigate = useNavigate();
    const handleModalTrigger = () => {
        dispatch({ type: SET_LOGGED_OUT_TIMEOUT, payload: false })
        window.location.reload();
    }

    useEffect(() => {
        if(!isAuthenticated && !state.loggedOutThroughTimeout) {
            login();
        }
        if (isAuthenticated && token !== '' && userDetails) {
            navigate("/forum");
        }
    }, [token, isAuthenticated, userDetails, navigate])

    return (
        <div className='login-page-container'>
            {state.loggedOutThroughTimeout === true  && 
                  <DashModal
                  color='primary'
                  title='Logged out'
                  body={"You have been logged out since your session has expired ! Please login to continue"}
                  show={true}
                  onHide={handleModalTrigger}
                  actionBtnName = "Okay"
                  onActionTrigger={handleModalTrigger}
              ></DashModal>
            }
        </div>

    )
}

export default LoginPage