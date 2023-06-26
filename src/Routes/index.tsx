import { Navigate, Route, Routes } from 'react-router-dom'
import UserProfileCard from '../components/common/UI/UserProfile/UserProfileCard'
import QuestionsQueue from '../Pages/ThreadQueue/QuestionsQueue/QuestionsQueue'
import Profile from '../Pages/Profile/Profile'
import ProfileQueue from '../Pages/Profile/ProfileQueue/ProfileQueue'
import CreateQuestion from '../Pages/ThreadQueue/CreateQuestion/CreateQuestion'
import Faqs from '../Pages/ThreadQueue/Faqs/Faqs'
import ThreadQueue from '../Pages/ThreadQueue/ThreadQueue'
import PrivateOutlet from './PrivateOutlet'
import ThreadDetails from '../Pages/ThreadQueue/ThreadDetails/ThreadDetails'
import LoginPage from '../Pages/LoginPage/LoginPage'
import Loader from '../components/common/UI/Loader/Loader'


function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path='/' element={<Navigate to={"/login"} replace />}></Route>
      <Route path='/login' element={<LoginPage />}></Route>
      <Route path='/callback' element={<Loader backDrop/>}></Route>
      {/* Private Routes */}
      <Route element={<PrivateOutlet />} >
        <Route path='/forum' element={<ThreadQueue />}>
          <Route index element={<Navigate to={"threads"} replace />} />
          <Route path='threads' >
            <Route path='' element={<QuestionsQueue />}></Route>
            <Route path='answered' element={<QuestionsQueue />}></Route>
            <Route path='unanswered' element={<QuestionsQueue />}></Route>
            <Route path=':postid' element={<ThreadDetails />}></Route>
            <Route path='edit/:postid' element={<CreateQuestion />}></Route>
          </Route>
          <Route path='create' element={<CreateQuestion />}></Route>
          <Route path='faqs' element={<Faqs />}></Route>
        </Route>
        <Route path='/profile' element={<Profile />}>
          <Route index element={<Navigate to={"details"} replace />} />
          <Route path='details' element={<UserProfileCard />} />
          <Route path='activities' element={<ProfileQueue />} />
          <Route path='saved-posts' element={<ProfileQueue isSavedDiscussion />} />
          <Route path='*' element={<Navigate to={"details"} replace />} />
        </Route>
      </Route>
      {/* no match */}
      <Route path='*' element={<p>NOTHING FOUND</p>}></Route>
    </Routes >
  )
}

export default AppRoutes