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
import { tokenContext } from './tokenContext';
import { supabase } from './supabaseClient';
import { useState } from 'react';
import { useEffect } from 'react';
import GroupDetail from './group/group_detail';
import ProtectedRoute from './protect';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkToken() {
      const {data,error}= await supabase.auth.getUser();
      setUser(data);
      console.log(user,1111);
      const authString = localStorage.getItem('sb-rbdndushdupsmytidea-auth-token');
      console.log(authString)
      if (authString) {
        try {
          const authObject = JSON.parse(authString);
          const accessToken = authObject.access_token;
          console.log('Access Token:', accessToken);
          return accessToken;
        } catch (e) {
          console.error('Error parsing auth token from local storage:', e);
        }
      } else {
        console.log('No auth token found in local storage.');
        return null;
      }
    }
    checkToken();
  }, []);

  return (
      <tokenContext.Provider value={{user,setUser}}>
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
          <Route path="/group_detail" element={<GroupDetail />} />

      </Routes>
      </tokenContext.Provider>

  );
}