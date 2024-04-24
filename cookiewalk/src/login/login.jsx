import React, { useState, useEffect }  from 'react';
import './login.css'; // login.css 파일을 import 합니다.
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogIn() {
  
  // const handleInputChange = (e, setter) => {
  //   setter(e.target.value);
  // };
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

  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('')
  const navigate = useNavigate();

  //로그인 버튼 클릭시 백엔드서버로 로그인 요청
  const onSubmitHandler = (e) =>{
    e.preventDefault();
    axios.post('http://localhost:3000/login', {username,password}).then(response=>{
      console.log(response)
      if (response.data.token || response.status === 200) {
        navigate('/home'); // homepage로 이동
      }
    }).catch(error =>{
      navigate('/');
      console.error('Login request failed:', error);
      alert("아이디나 비밀번호가 일치하지 않습니다.")
      navigate('/');
    })
      
  
  }

  return (
    <div className="background">
        {/* <div className="logo"></div> */}
        <span className="title">CookieWalk</span>
        <form onSubmit={onSubmitHandler}>
          <input
            className="id"
            name='username'
            type="text"
            placeholder="아이디"
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, '아이디')}
            // onChange={(e) => handleInputChange(e, setUsername)}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
          <input
            className="password"
            name="password"
            type="password"
            placeholder="비밀번호"
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, '비밀번호')}
            // onChange={(e) => handleInputChange(e, setPassword)}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
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
        <Link to="/signup1"><div className="signup">회원가입</div></Link>
        <div className="line"></div>
        <div className="or">또는</div>
        <span className="easy_login">간편하게 시작하기</span>
        <a href='/kakaologin'><button className="kakao"></button></a>
        <button className="naver"></button>
        <button className="google"></button>

    </div>
  );
}
