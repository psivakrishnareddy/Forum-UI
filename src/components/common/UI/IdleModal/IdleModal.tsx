import React, { useContext, useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import AuthContext from '../../../../store/context/auth-context';
import GlobalContext from '../../../../store/context/global-context';
import { SET_CONTINUE } from '../../../../store/Types/GlobalTypes';
const IdleModal: React.FC = ()  => {
const { logout, timeout} = useContext(AuthContext);
    const [delayMinute, setDelayMinute] = useState(30);
    const [delaySeconds, setDelaySeconds] = useState(59);
    const [showModal,setShowModal]=useState(true)
    const { dispatch } = useContext(GlobalContext);
    let interval:any = 0;  
    const onCLose=() => {
        setDelayMinute(30);
        setDelaySeconds(59);
        setShowModal(false)
        for (let i = 0; i <= interval; i++) {
            clearInterval(i);
        }
        dispatch({ type: SET_CONTINUE, payload: false })
    }
    const modalLogout=() => {
        dispatch({ type: SET_CONTINUE, payload: false })
        setShowModal(false)
        logout();
    }
    useEffect(() => {
        if(showModal) {
        for (let i = 0; i <= interval; i++) {
            clearInterval(i);
        }
         interval = setInterval(() => {
            if(delayMinute == 0 && delaySeconds === 0)
            {
                setShowModal(false)
                timeout()
            }
            else 
            {
                setDelaySeconds(delaySeconds-1)
                if(delaySeconds === 0 ) {
                    setDelayMinute(delayMinute-1);
                    setDelaySeconds(60);
                }
            }
           
          }, 1000);
        }
          return () => clearInterval(interval);
        }, [delayMinute, delaySeconds]);
    return (
<main>
        {showModal && <Modal show={true}   size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <ModalHeader closeVariant='black' closeButton onClick={onCLose}>
                <ModalTitle id="contained-modal-title-vcenter">
                Session Timeout Warning
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className='px-5'>
                    <div className="body-content fs-4 fw-light">
                        <div className="float-start me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" fill='#ED6A5E'>
                                <path d="M24.05 24.45ZM2 42 24 4 46 42ZM22.7 30.6H25.7V19.4H22.7ZM24.2 36.15Q24.85 36.15 25.275 35.725Q25.7 35.3 25.7 34.65Q25.7 34 25.275 33.575Q24.85 33.15 24.2 33.15Q23.55 33.15 23.125 33.575Q22.7 34 22.7 34.65Q22.7 35.3 23.125 35.725Q23.55 36.15 24.2 36.15ZM7.2 39H40.8L24 10Z" />
                            </svg>
                        </div>
                        <div>Your session will expire in 00 : {(delayMinute<10)? '0'+delayMinute: delayMinute} : {(delaySeconds < 10)? '0'+delaySeconds :delaySeconds}. Please click "Continue Session" to keep working or click
                "Logout" to end your session now.</div>
                    </div>
                </ModalBody>
                <ModalFooter className='border-0 px-5'>
                    {<Button variant='secondary' className='fw-bold px-3' onClick={modalLogout}>Log Out</Button>}
                    <Button variant='primary' className='fw-bold px-3' onClick={onCLose}>Continue</Button>
                </ModalFooter>
        </Modal>}
      </main>
    );
}
export default IdleModal