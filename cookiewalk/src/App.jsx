import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from "./login/login";
import Home from "./main/home";
// import Map from "./map/map";
import Pause from "./startpage/pause";
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

import ProtectedRoute from './ProtectedRoute.jsx';
import { TokenProvider } from './context/tokenContext.jsx';

export default function App() {
  return (
      <TokenProvider>
        <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup2" element={<Signup2 />} />
            <Route path="/signup3" element={<Signup3 />} />
            <Route path="/signup4" element={<Signup4 />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            {/* <Route path="/map" element={<Map />} /> */}
            <Route path="/pause" element={<ProtectedRoute><Pause /></ProtectedRoute>} />
            <Route path="/group" element={<ProtectedRoute><Group /></ProtectedRoute>} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
            <Route path="/write" element={<ProtectedRoute><Write /></ProtectedRoute>} />
            <Route path="/notice" element={<ProtectedRoute><Notice /></ProtectedRoute>} />
            <Route path="/friend" element={<ProtectedRoute><Friend /></ProtectedRoute>} />
            <Route path="/follower" element={<ProtectedRoute><Follower /></ProtectedRoute>} />
            <Route path="/following" element={<ProtectedRoute><Following /></ProtectedRoute>} />
            <Route path="/group_detail" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
            <Route path="/mygroup" element={<ProtectedRoute><MyGroup /></ProtectedRoute>} />
      </Routes>
      </TokenProvider>

  );
}