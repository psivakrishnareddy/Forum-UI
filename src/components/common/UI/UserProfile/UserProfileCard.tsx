import { useContext} from 'react';
import AuthContext from '../../../../store/context/auth-context';
import { IAgency } from '../../../../constants/models';

const UserProfileCard = () => {
    const { userDetails } = useContext(AuthContext);
    const agencyData = userDetails.agency.map( (agency : IAgency) => {
        return <p className='fs-6 py-1' key = {agency.agencyId}>{agency.agencyName}</p>
      })
    
    return (
        <div className="profile-details-container container bg-white card w-100 h-100 mt-4 p-5" style={{ minHeight: '50vh' }}>
            <div className="profile-username row">
                <div className="col">
                    <label className="text-gray fw-light  mb-2">First Name</label>
                    <p className='fs-6 py-1'>{userDetails?.user?.firstName}</p>
                </div>
                <div className="col">
                    <label className="text-gray fw-light mb-2">Last Name</label>
                    <p className='fs-6 py-1'>{userDetails?.user?.lastName}</p>
                </div>
            </div>

            <div className="row mt-4">
                <label className="text-gray fw-light mb-2">Email ID</label>
                <p className='fs-6 py-1'>{userDetails?.user?.email}</p>
            </div>

            <div className="row mt-4">
                <label className="text-gray fw-light mb-2">Role</label>
                <p className='fs-6 py-1'>{userDetails?.role?.roleName}</p>
            </div>

            <>
            <div className="row mt-4">
                <label className="text-gray fw-light mb-2">Agency</label>
             </div>
             {agencyData}
            </>
        </div>
    )
}

export default UserProfileCard