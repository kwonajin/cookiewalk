import React, { useState }  from 'react';
import './login.css'; // login.css 파일을 import 합니다.
import { Link } from "react-router-dom";

export default function LogIn() {

  const handleFocus = (event) => {
    event.target.placeholder = '';
  };

  const handleBlur = (event, placeholderText) => {
    event.target.placeholder = placeholderText;
  
  };

  // isPressed 상태를 추가하여 마우스 버튼이 눌려있는지 추적합니다.
  const [isPressed, setIsPressed] = useState(false);

  // 마우스 버튼을 누르고 있을 때 isPressed 상태를 true로 설정합니다.
  const handleMouseDown = () => {
    setIsPressed(true);
  };

  // 마우스 버튼을 뗄 때 isPressed 상태를 false로 설정합니다.
  const handleMouseUp = () => {
    setIsPressed(false);
  };


  return (
    <div className="background">
        <div className="logo"></div>
        <span className="title">CookieWalk</span>
        <form action="/" method = "/">
          <input
            className="id"
            type="text"
            placeholder="아이디"
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, '아이디')}
            required
          />
          <input
            className="password"
            type="password"
            placeholder="비밀번호"
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, '비밀번호')}
            required
          />
  
          <button
            className="login_btn"
            style={{ backgroundColor: isPressed ? '#C9C9C9' : '' }} // isPressed 상태에 따라 배경색이 변경됩니다.
            onMouseDown={handleMouseDown} // 마우스 버튼을 누를 때 이벤트 핸들러
            onMouseUp={handleMouseUp} // 마우스 버튼을 뗄 때 이벤트 핸들러
            onMouseLeave={handleMouseUp} // 마우스가 버튼을 벗어날 때도 원래 상태로 돌아가도록 합니다.
          >
            로그인
          </button>
        </form>

        <a href='#' className="find_id">아이디 찾기</a>
        <div className="id_pw"></div>
        <a href='#' className="find_password">비밀번호 찾기</a>
        <Link to="/Signup1"><div className="signup">회원가입</div></Link>
        <div className="line"></div>
        <div className="or">또는</div>
        <span className="easy_login">간편하게 시작하기</span>
        <button className="kakao"></button>
        <button className="naver"></button>
        <button className="google"></button>
    </div>
  );
}
