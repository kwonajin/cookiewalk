import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from "./login/login";
import Home from "./main/home";
// import Map from "./map/map";
import Pause from "./startpage/pause";
import Group from "./group/group";
import MyPage from "./mypage/mypage";


export default function App(){
  return(
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/home" element={<Home />} />
      {/* <Route path="/map" element={<Map />} /> */}
      <Route path="/pause" element={<Pause />} />
      <Route path="/group" element={<Group />} />
      <Route path="/mypage" element={<MyPage />} />

    </Routes>
  )
}
