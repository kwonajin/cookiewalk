import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from "./login/login";
import FindPassword from './login/FindPassword.jsx';
import FindPassword2 from './login/FindPassword2.jsx';

import Home from "./main/home";
import MapSearch from './map/map';
import Pause from "./startpage/pause";
import BeforeStart from './startpage/BeforeStart'
import Group from "./group/group";
import MyPage from "./mypage/mypage";
import Signup from './signup/Signup';
import Signup2 from "./signup/Signup2";
import Signup3 from "./signup/Signup3";
import Signup4 from "./signup/Signup4";
import Write from "./main/write"; 
import Notice from './main/notice';
import Friend from './main/friend';
import Follower from './mypage/follower';
import Following from './mypage/following';
import GroupDetail from './group/group_detail';
import MyGroup from './mypage/mygroup';
import MyGroupDetail from './mypage/mygroup_detail'
import ProfileEdit from './mypage/profile_edit.jsx'
import PersonalProfile from './personal/personal_profile.jsx'
import HomePersonalProfile from './main/home_personal_profile.jsx';
import MypageMenu from './mypage/mypage_menu.jsx';

import Unfinished_route from './startpage/Unfinished_route';
import Start from './startpage/Start'
import ProtectedRoute from './ProtectedRoute.jsx';
import ProtectedRoute_2 from './ProtectedRoute_2.jsx';
import { TokenProvider } from './context/tokenContext.jsx';

import { NavermapsProvider } from 'react-naver-maps';

export default function App() {

  const naverMapClientID = import.meta.env.VITE_NAVER_CLIENT_ID;

  return (
      <TokenProvider>
        <NavermapsProvider ncpClientId={naverMapClientID}>
          <Routes>
            <Route path="/" element={<ProtectedRoute_2><LogIn /></ProtectedRoute_2>} />
            <Route path="/find_ps" element={<ProtectedRoute_2><FindPassword /></ProtectedRoute_2>} />
            <Route path="/find_ps2" element={<ProtectedRoute_2><FindPassword2 /></ProtectedRoute_2>} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/signup" element={<ProtectedRoute_2><Signup/></ProtectedRoute_2>} />
            <Route path="/signup2" element={<ProtectedRoute_2><Signup2/></ProtectedRoute_2>} />
            <Route path="/signup3" element={<ProtectedRoute><Signup3/></ProtectedRoute>} />
            <Route path="/signup4" element={<ProtectedRoute><Signup4 /></ProtectedRoute>} />
            {/* <Route path="/login" element={<ProtectedRoute_2><LogIn /></ProtectedRoute_2>} /> */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapSearch /></ProtectedRoute>} />
            <Route path="/BeforeStart" element={<ProtectedRoute><BeforeStart /></ProtectedRoute>} />
            <Route path="/Start" element={<ProtectedRoute><Start /></ProtectedRoute>} />
            <Route path="/Pause" element={<ProtectedRoute><Pause /></ProtectedRoute>} />
            <Route path="/Unfinished_route" element={<ProtectedRoute><Unfinished_route /></ProtectedRoute>} />
            <Route path="/group" element={<ProtectedRoute><Group /></ProtectedRoute>} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
            <Route path="/write" element={<ProtectedRoute><Write /></ProtectedRoute>} />
            <Route path="/notice" element={<ProtectedRoute><Notice /></ProtectedRoute>} />
            <Route path="/friend" element={<ProtectedRoute><Friend /></ProtectedRoute>} />
            <Route path="/follower" element={<ProtectedRoute><Follower /></ProtectedRoute>} />
            <Route path="/following" element={<ProtectedRoute><Following /></ProtectedRoute>} />
            <Route path="/group_detail" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
            <Route path="/mygroup" element={<ProtectedRoute><MyGroup /></ProtectedRoute>} />
            <Route path="/mygroup_detail" element={<ProtectedRoute><MyGroupDetail /></ProtectedRoute>} />
            <Route path="/profile_edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
            <Route path="/personal_profile" element={<ProtectedRoute><PersonalProfile /></ProtectedRoute>} />
            <Route path="/home_personal_profile" element={<ProtectedRoute><HomePersonalProfile /></ProtectedRoute>} />
            <Route path="/mypage_menu" element={<ProtectedRoute><MypageMenu /></ProtectedRoute>} />
          </Routes>
        </NavermapsProvider>
      </TokenProvider>

  );
}