// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LogIn from "./login/login";
// import Home from "./main/home";
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

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup2" element={<Signup2 />} />
        <Route path="/signup3" element={<Signup3 />} />
        <Route path="/signup4" element={<Signup4 />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/map" element={<Map />} /> */}
        <Route path="/pause" element={<Pause />} />
        <Route path="/group" element={<Group />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/write" element={<Write />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/friend" element={<Friend />} />
        <Route path="/follower" element={<Follower />} />
        <Route path="/following" element={<Following />} />
      </Routes>

  );
}