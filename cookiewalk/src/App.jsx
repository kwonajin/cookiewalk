import Home from "./main/home"
// import MyPage from "./mypage/mypage"
// import Pause from "./startpage/pause";
import LogIn from "./login/login"
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}


export default App;


// function App(){
//   return(
//     <>
//       <LogIn/>
//     </>
//   )
// }

// export default App

