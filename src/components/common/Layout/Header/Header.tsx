import { useContext, useEffect, useState } from "react";
import { Container, Dropdown, Nav, Navbar} from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../../../assets/images/sbsd_logo.png";
import AuthContext from "../../../../store/context/auth-context";
import NotificationBox from "../../UI/NotificationBox/NotificationBox";
import ProfileBadge from "../../UI/UserProfile/ProfileBadge";
import "./Header.scss";
import { UserService } from '../../../../services/UserService';
import { INotification } from '../../../../constants/models';
import { useNavigate } from 'react-router-dom'
import NotificationIcon from '../../../../assets/icons/notification-bell.svg';
import DashModal from "../../UI/DashModal/DashModal";
import { toast } from "react-toastify";
const Header = () => {

    const navigate = useNavigate();
    const { logout, userDetails, isAuthenticated, token } = useContext(AuthContext);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationsData, setNotificationsData] = useState([]);
    const [notificationsModalShow, setNotificationsModalShow] = useState(false);
    useEffect(() => {
        if (showNotifications === true) {
            document.addEventListener("mousedown", (event: any) => {
                let notificationContainerRef = document.getElementById("notifications-container");
                !notificationContainerRef?.contains(event.target) && setShowNotifications(false);
            });
        } else {
            document.removeEventListener("mousedown", (event: any) => {
                let notificationContainerRef = document.getElementById("notifications-container");
                !notificationContainerRef?.contains(event.target) && setShowNotifications(false);
            });
        }
    }, [showNotifications])

    useEffect(() => {
    }, [userDetails])

    useEffect(() => {
        token && UserService.getUserNotifications().then((data: any) => {
            setNotificationsData(data);
        });
    }, [token]);

    const handleNotificationRefresh = () => {
        token && UserService.getUserNotifications().then((data: any) => {
            setNotificationsData(data);
        });
    }

    const handleNotificationRead = (notification: INotification | null): void => {
        let notificationId = notification === null ? 0 : notification.id;
        let filter = notification === null ? 'all' : '';
        UserService.markUserNotificationRead(notificationId, filter)
            .then((data: any) => {
                notificationsData.forEach((noti: INotification) => {
                                if(!notification) noti.read = data;
                                else if(noti.id === notification.id) noti.read = data;
                            });
                            setNotificationsData(notificationsData.slice());
            }).catch(()=>{
                toast.error("Error in marking notification read");
            });
    }

    const handleNotificationDelete = (notification: INotification | null) => {
        let notificationId = notification === null ? 0 : notification.id;
        let filter = notification === null ? 'all' : '';
        let filteredNotificationData: any = [];
        if(filter !== "all")
        {
            filteredNotificationData = notificationsData.filter((noti: INotification) => noti !== notification).slice();
        }
        else 
        {
            toast.info("All notifications deleted");
        }
        UserService.deleteUserNotificationRead(notificationId, filter)
            .then((data: any) => {
                data && setNotificationsData(filteredNotificationData);
            }).catch(()=>{
                toast.error("Error in deleting notification");
            });
        setNotificationsModalShow(false);
    }

    const handleNotificationSelection = (notification: INotification | null): void => {
        if(notification !== null) {
            handleNotificationRead(notification);
            setShowNotifications(false);
            navigate(`/forum/threads/${notification.postId}`);
        }
    }

    return (<>
      <DashModal 
       color='danger' 
       title='Delete All Notifications' 
        body={"Are you sure you want to delete all notifications? You cannot undo this action"}
        show={notificationsModalShow} 
        onHide={() => setNotificationsModalShow(false)} 
        showSecondaryBtn 
        onActionTrigger={()=>handleNotificationDelete(null)} ></DashModal>
        <Navbar bg="dark-indigo" variant="dark" expand="lg" fixed="top">
            <Container>
                <Link to={"/forum/threads"} style={{ textDecoration: "none" }}>
                    <Navbar.Brand className="d-flex align-items-center justify-content-start">
                        <img
                            alt="brand_logo"
                            src={logo}
                            width="60"
                            height="60"
                            className="d-inline-block align-top float-start"
                        />
                        <div className="fs-7 fw-bold text-start ms-2 float-right lh-sm">
                            <p className="p-0 m-0">Expenditure</p>
                            <p className="p-0 m-0">Dashboard</p>
                            <p className="p-0 m-0">Forum</p>
                        </div>
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse className="justify-content-center w-100" >
                    <Nav className="global-search-container">
                    { isAuthenticated && <div className="dash-input-field-wrapper rounded d-flex align-items-center position-relative w-100">
                            <i className="position-absolute ms-3">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#9ca3af">
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                </svg>
                            </i>
                            <input className="form-control text-dark ps-5" placeholder="Search For Topics" />
                        </div>}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        {isAuthenticated && <div className="notification-button me-3 pointer-cursor position-relative">
                            <span className='d-flex align-items-center px-1 position-relative' onClick={() => setShowNotifications(true)}>
                                <span className='d-flex align-items-center px-1'>
                                    <img className="pointer-cursor mark-as-read-icon" data-toggle="tooltip" title="Notifications" height="30" width="30" src={NotificationIcon} alt="Notifications" />
                                </span>
                            </span>
                            { notificationsData.length > 0 && notificationsData.filter((noti: INotification) => !noti.read).length > 0 && <span className="notification-badge ">{notificationsData.length > 0 && notificationsData.filter((noti: INotification) => !noti.read).length}</span>}
                        </div>}
                        {showNotifications && <div className="notifications-container" id="notifications-container">
                            <NotificationBox handleRefresh={handleNotificationRefresh} handleNotificationSelection={handleNotificationSelection} handleNotificationDelete={handleNotificationDelete} handleNotificationMarkAsRead={handleNotificationRead} notifications={notificationsData} notificationsModalShow = {setNotificationsModalShow}></NotificationBox>
                        </div>}
                    </Nav>
                    <Nav className="d-flex justify-conent-end align-items-lg-center">
                        {/* <div style={{ height: '30px', width: '30px' }} className="profile-image border border-success border-5 rounded-circle p-3 float-start bg-success d-flex align-items-center">
                            <div className="text-white fw-bolder fs-1">S</div>
                        </div> */}
                        {/* <Link to={"/profile/details"}> */}
                        {isAuthenticated && userDetails && <Dropdown className="dropdown-toggler">
                            <Dropdown.Toggle >
                                <ProfileBadge size="40" username={userDetails.user.firstName!} className="float-start" data-toggle="dropdown"/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Link style={{ textDecoration: "none" }} to={"/profile/details"}><Dropdown.Item as="div">Account</Dropdown.Item></Link>
                                <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>}
                        {/* </Link> */}
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    </>
    )
}

export default Header