import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from "./login/login";
import FindPassword from './login/FindPassword.jsx';
import FindPassword2 from './login/FindPassword2.jsx';

import Home from "./main/home";
import Comment from './main/comment.jsx'
import MapSearch from './map/map';
import Map_detail from './map/map_detail.jsx';

import BeforeStart from './startpage/BeforeStart'
import Group from "./group/group";
import MyPage from "./mypage/mypage";
import Signup from './signup/Signup';
import Signup3 from "./signup/Signup3";
import Signup4 from "./signup/Signup4";
import Write from "./main/write";
import Write_map from './main/write_map.jsx'; 
import Notice from './main/notice';
import Friend from './main/friend';
import Follower from './mypage/follower';
import Following from './mypage/following';
import GroupDetail from './group/group_detail';
import MyGroup from './mypage/mygroup';
import DrawGroupMap from './group/draw_group.jsx';
import MyGroupDetail from './mypage/mygroup_detail'
import ProfileEdit from './mypage/profile_edit.jsx'
import PersonalProfile from './personal/personal_profile.jsx'
import HomePersonalProfile from './main/home_personal_profile.jsx';
import MypageMenu from './mypage/mypage_menu.jsx';
import DrawMap from './map/draw_map.jsx';
import AccountSetting from './mypage/account_setting.jsx';
import AccountSetting2 from './mypage/account_setting2.jsx';
import FinishedArt from './mypage/finished_art.jsx';
// import Saved from './mypage/saved.jsx';
import Liked from './mypage/liked.jsx';
import Blocked from './mypage/blocked.jsx';
import Reward from './mypage/reward/reward.jsx';
import Saved from './mypage/saved_art/saved.jsx';

import Unfinished_route from './startpage/Unfinished_route';
import Start from './startpage/Start'
import Activity_save from './startpage/activity_save.jsx';
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
            <Route path="/signup3" element={<ProtectedRoute><Signup3/></ProtectedRoute>} />
            <Route path="/signup4" element={<ProtectedRoute><Signup4 /></ProtectedRoute>} />
            {/* <Route path="/login" element={<ProtectedRoute_2><LogIn /></ProtectedRoute_2>} /> */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapSearch /></ProtectedRoute>} />
            <Route path="/mapDetail" element={<ProtectedRoute><Map_detail /></ProtectedRoute>} />
            <Route path="/drawmap" element={<ProtectedRoute><DrawMap /></ProtectedRoute>} />
            <Route path="/BeforeStart" element={<ProtectedRoute><BeforeStart /></ProtectedRoute>} />
            <Route path="/Start" element={<ProtectedRoute><Start /></ProtectedRoute>} />            
            <Route path="/Unfinished_route" element={<ProtectedRoute><Unfinished_route /></ProtectedRoute>} />
            <Route path="/Activity_Save" element={<ProtectedRoute><Activity_save /></ProtectedRoute>} />
            <Route path="/group" element={<ProtectedRoute><Group /></ProtectedRoute>} />
            <Route path="/draw_group_map" element={<ProtectedRoute><DrawGroupMap /></ProtectedRoute>} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
            <Route path="/write" element={<ProtectedRoute><Write /></ProtectedRoute>} />
            <Route path="/comment/:postID" element={<ProtectedRoute><Comment /></ProtectedRoute>} />
            <Route path="/write_map" element={<ProtectedRoute><Write_map /></ProtectedRoute>} />
            <Route path="/notice" element={<ProtectedRoute><Notice /></ProtectedRoute>} />
            <Route path="/friend" element={<ProtectedRoute><Friend /></ProtectedRoute>} />
            <Route path="/follower" element={<ProtectedRoute><Follower /></ProtectedRoute>} />
            <Route path="/following" element={<ProtectedRoute><Following /></ProtectedRoute>} />
            <Route path="/group_detail" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
            <Route path="/mygroup" element={<ProtectedRoute><MyGroup /></ProtectedRoute>} />
            <Route path="/mygroup_detail" element={<ProtectedRoute><MyGroupDetail /></ProtectedRoute>} />
            <Route path="/profile_edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
            <Route path="/personal_profile" element={<ProtectedRoute><PersonalProfile /></ProtectedRoute>} />
            <Route path="/home_personal_profile/:userId" element={<ProtectedRoute><HomePersonalProfile /></ProtectedRoute>} />
            <Route path="/mypage_menu" element={<ProtectedRoute><MypageMenu /></ProtectedRoute>} />
            <Route path="/account_setting" element={<ProtectedRoute><AccountSetting /></ProtectedRoute>} />
            <Route path="/account_setting2" element={<ProtectedRoute><AccountSetting2 /></ProtectedRoute>} />
            <Route path="/finished_art" element={<ProtectedRoute><FinishedArt /></ProtectedRoute>} />
            {/* <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} /> */}
            <Route path="/liked" element={<ProtectedRoute><Liked /></ProtectedRoute>} />
            <Route path="/blocked" element={<ProtectedRoute><Blocked /></ProtectedRoute>} />
            <Route path="/reward" element={<ProtectedRoute><Reward /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />







          </Routes>
        </NavermapsProvider>
      </TokenProvider>

  );
}