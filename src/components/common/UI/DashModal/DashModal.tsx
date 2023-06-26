import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import ReactDOM from 'react-dom';

declare type ModalProps = {
    secondaryBtnName?: string,
    actionBtnName?: string,
    onHide: () => void,
    show: boolean,
    showSecondaryBtn?: boolean,
    title: string,
    body: string,
    color?: string
    onActionTrigger: () => void

}

const DashModal: React.FC<ModalProps> = ({
    secondaryBtnName,
    actionBtnName,
    showSecondaryBtn,
    onActionTrigger,
    color,
    title,
    body,
    ...rest }) => {

    return (<>
        {ReactDOM.createPortal(
            <Modal
                {...rest}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered backdrop="static"
            >
                <ModalHeader closeVariant='white' closeButton className={`px-5 bg-${color}`}>
                    <ModalTitle id="contained-modal-title-vcenter" className='text-white'>
                        {title}
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className='px-5'>
                    <div className="body-content fs-4 fw-light">
                        <div className="float-start me-3">
                            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" fill='#ED6A5E'>
                                <path d="M24.05 24.45ZM2 42 24 4 46 42ZM22.7 30.6H25.7V19.4H22.7ZM24.2 36.15Q24.85 36.15 25.275 35.725Q25.7 35.3 25.7 34.65Q25.7 34 25.275 33.575Q24.85 33.15 24.2 33.15Q23.55 33.15 23.125 33.575Q22.7 34 22.7 34.65Q22.7 35.3 23.125 35.725Q23.55 36.15 24.2 36.15ZM7.2 39H40.8L24 10Z" />
                            </svg>
                        </div>
                        {body}
                    </div>
                </ModalBody>
                <ModalFooter className='border-0 px-5'>
                    {showSecondaryBtn && <Button variant='secondary' className='fw-bold px-3' onClick={rest.onHide}>{secondaryBtnName}</Button>}
                    <Button variant='primary' className='fw-bold px-3' onClick={onActionTrigger}>{actionBtnName}</Button>
                </ModalFooter>
            </Modal>,
            document.getElementById('modal-overlay-root') as Element
        )}</>

    );
}
DashModal.defaultProps = {
    secondaryBtnName: 'No',
    actionBtnName: "Yes",
    show: false,
    showSecondaryBtn: false,
    color: 'primary'
}

export default DashModal