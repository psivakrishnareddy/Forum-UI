import './NotificationBox.scss';
import React ,  {Dispatch, SetStateAction}from 'react';
import { INotification } from '../../../../constants/models';
import { postTimeStamp } from '../../../../utils/DateUtils';
import TickIcon from '../../../../assets/icons/tick.svg';
import DeleteIcon from '../../../../assets/icons/delete.svg';
import RefreshIcon from '../../../../assets/icons/refresh.svg';
interface INotificationBoxProps {
    notifications: INotification[],
    handleNotificationSelection: (notification: INotification | null) => void,
    handleNotificationMarkAsRead: (notification: INotification | null) => void,
    handleNotificationDelete: (notification: INotification | null) => void,
    handleRefresh: () => void,
    notificationsModalShow : Dispatch<SetStateAction<boolean>>
}

const NotificationBox: React.FC<INotificationBoxProps> = (props: INotificationBoxProps) => {
    return <>
     <div className='h-100 notification-box '>
        <div className='w-100 bg-primary text-light px-3 py-1 d-flex justify-content-between align-items-center'>
            <span>
                <span className='font-weight-bold'>Notifications</span>
                <span className='px-3 pointer-cursor' onClick={() => props.handleRefresh()}>
                <img className="pointer-cursor mark-as-read-icon" data-toggle="tooltip" title="Refresh notifications" height="15" width="15" src={RefreshIcon} alt="Notifications" />
                </span>
            </span>
            <div className='d-flex'>
                {props.notifications.length > 0 && <span className='px-3 pointer-cursor' onClick={() => props.handleNotificationMarkAsRead(null)}>Mark all as Read</span>}
                {props.notifications.length > 0 && <span className='px-3 pointer-cursor' onClick={() => props.notificationsModalShow(true)}>Delete all Notification</span>}
            </div>
        </div>
        {props.notifications.length === 0 && <span className='h-100 d-flex justify-content-center align-items-center bg-white p-3'>You have no new Notifications!</span>}
        <div className='h-100 w-100 d-flex flex-column overflow-scroll'>
            {props.notifications.map((notification: INotification, index: number) => {
                return <div key={`notification-message-${index}`} className={`d-flex border-bottom ${notification.read ? 'bg-light' : 'bg-white'}`}>
                    <div className='col-8 p-3 pointer-cursor' onClick={() => props.handleNotificationSelection(notification)}>
                        <p className='px-3 py-1 h6'>{notification.description}</p>
                        <small className='px-3 py-1 font-weight-light px-1 text-muted'>{postTimeStamp(new Date(notification.triggerTime))}</small>
                    </div>
                    <div className='col-2 p-3 d-flex justify-content-end'>
                    {!notification.read && <span className='d-flex align-items-center px-1' onClick={() => props.handleNotificationMarkAsRead(notification)}>
                        <img className="pointer-cursor mark-as-read-icon" data-toggle="tooltip" title="Mark as read" height="17" width="17" src={TickIcon} alt="Mark as Read" onClick={() => {}} />
                    </span>}
                    </div>
                    <div className='col-2 p-3 d-flex justify-content-center'>     
                        <span className='d-flex align-items-center px-1' onClick={() => props.handleNotificationDelete(notification)}>
                            <img className="pointer-cursor mark-as-read-icon" data-toggle="tooltip" title="Delete notification" height="17" width="17" src={DeleteIcon} alt="Delete" onClick={() => {}} />
                        </span>
                    </div>
                </div>
            })}
        </div>
    </div>
    </> 
}

export default NotificationBox;
NotificationBox.defaultProps = {
    notifications: []
}

/* <NotificationBox 
    notifications={
        [{text:"here we go", timestamp:"2022-07-19T13:29:12.101+0000", isRead:true}, 
        {text:"in cahgeere", timestamp:"2021-01-09T13:29:12.101+0000"}]
    }>
</NotificationBox> */