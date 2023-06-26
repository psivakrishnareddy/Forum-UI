
import { useContext } from "react";
import { Link, Outlet } from "react-router-dom"
import DashTabs from "../../components/common/UI/Tabs/DashTabs"
import ProfileBadge from "../../components/common/UI/UserProfile/ProfileBadge"
import { ProfileHeaderTabs } from "../../constants/appConstants";
// import { IAgency, IUserDetails } from "../../constants/models";
// import { UserService } from "../../services/UserService";
import AuthContext from "../../store/context/auth-context";
import "./Profile.scss";
const Profile: React.FC<{}> = (props) => {
    const { userDetails } = useContext(AuthContext);
    // const [userAgencyList, setuserAgencyList] = useState<String[]>([]);

    // useEffect(() => {
    //     let agencyList = userDetails.agency.map((data: IAgency) => data.agencyName);
    //     setuserAgencyList(agencyList);
    // }, []);


    return (
        <>
           <Link className="back-link" to={"/forum/threads"}>Back</Link>
           <div className="profile-container d-flex align-items-start justify-content-evenly h-100 w-100 mt-3">
            <div className="left-side-profile-container w-25 d-flex flex-column">
                <div className="profile-card card d-flex flex-column align-items-center justify-content-around p-5 text-center">
                    <ProfileBadge username={userDetails?.user?.firstName!} />
                    <div className="profile-name fs-5 text-wrap fw-bold text-primary">
                        <span>{userDetails?.user?.firstName}</span> <span>{userDetails?.user?.lastName}</span>
                    </div>
                    <div className="profile-agency fs-6 fw-bold text-dark text-center">
                        {/* <span>{userAgencyList.join('')}</span> */}
                        <span>{userDetails?.agency?.agencyName}</span>
                    </div>
                </div>
            </div>
            <div className="right-side-main-content w-75 px-2 ms-4">
                <DashTabs headers={ProfileHeaderTabs} isRouteTabs />
                <Outlet />
            </div>
        </div>
        </>
       
    )
}

export default Profile