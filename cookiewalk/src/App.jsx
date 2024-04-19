import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./main/home"
import MyPage from "./mypage/mypage"
import Pause from "./startpage/pause";
// import LogIn from "./login/login"


export default function App(){
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/pause" element={<Pause />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}
