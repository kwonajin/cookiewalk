import './Signup.css'
import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  // 첫 번째 비밀번호 입력 필드의 가시성 상태
  const [passwordVisible, setPasswordVisible] = useState(false);
  // 비밀번호 재입력 필드의 가시성 상태
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

  // 첫 번째 비밀번호 입력 필드의 가시성을 토글하는 함수
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // 비밀번호 재입력 필드의 가시성을 토글하는 함수
  const togglePasswordConfirmVisibility = () => {
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };

  const [username, setUsername]=useState('');
  const [confirmUsername, setConfirmUsername] = useState(false);
  const [password, setPassword]=useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const navigate = useNavigate();
  
  //아이디 중복 검사 요청
  const onSubmitHandlerID = (e) =>{
    e.preventDefault();
    axios.post('http://localhost:3000/login/join', {username})
      .then(response=>{
        console.log(response.data)
        setConfirmUsername(response.data==='사용가능')
      })
  }

  //비밀 번호 검사 
  const confirmFuntion = (e)=>{
    const {name, value} = e.target;
    if (name === 'password'){
      setPassword(value);
    }else if (name === 'confirmPassword'){
      setConfirmPassword(value)
    }
  }
   // 비밀번호와 비밀번호 확인 입력이 변경될 때 실행시킴
  useEffect(()=>{
    setPasswordsMatch(password === confirmPassword)
  },[password, confirmPassword])

  // setpasswordsMatch 상태가 변경될 때마다 실행해 취신 결과값 확인
  useEffect(() => {
    console.log(password, confirmPassword, passwordsMatch);
  }, [passwordsMatch]);

  const nextStep = (e) =>{
    // console.log(confirmUsername, passwordsMatch);
    e.preventDefault(); //버튼 클릭시 마다 제출되는 것을 방지 하는 함수
    if( confirmUsername && passwordsMatch){
      console.log(confirmUsername, passwordsMatch);
      axios.post('http://localhost:3000/login/join/signup1', {username,password})
        .then(response=>{
          console.log(response.status)
          if (response.status === 200) {
            navigate('/signup2'); // signup2로 이동
          }
        });
    }   
  }
  return (
    <div className="signup_container">
      <div><img className='e83_104' src="./icon/ic--round-arrow-back.svg" /></div>
      <span className="cookiewalk_logo">CookieWalk</span>
      <span className="e82_14">쿠키워크의 계정정보를 입력해주세요</span>
      <span className="e82_15">아래의 정보로 계정이 생성됩니다.</span>
      <form method = "/" onSubmit={nextStep}>
        {/* 아이디 입력 */}
        <input type="text" className="userIdInput" onChange={(e)=>setUsername(e.target.value)} value={username} placeholder="아이디를 입력해주세요" required/>
        <button type='submit' className="Id_double_check" onClick={onSubmitHandlerID}>중복확인</button>
        
        {/* 비밀번호 비밀 번호 입력부분 */}
        <input type={passwordVisible ? "text" : "password"} className="userPwInput" name="password" onChange={confirmFuntion} placeholder="비밀번호를 입력해주세요" required/>
        <button type="button" className="e83_30" onClick={togglePasswordVisibility}>
            <img className="e83_31" src={passwordVisible ? "./icon/mdi--eye.svg" : "./icon/mdi--eye-off.svg"} alt="Toggle Password Visibility"/>
        </button>
        <div className="e83_21">
          <div><img className="e83_22" src="./icon/ei--check.svg"/></div>
        </div>
        <span className="e83_24">영문 8자리이상 16자리 이하</span>
        <div className="e83_25">
          <div><img className="e83_26" src="./icon/ei--check.svg"/></div>
        </div>
        <span className="e83_29">숫자 포함</span>
        <input type={passwordConfirmVisible ? "text" : "password"} className="userPwInput2" name="confirmPassword" onChange={confirmFuntion} placeholder="비밀번호를 재입력해주세요" required/>
        <button type='button' className="e83_32" onClick={togglePasswordConfirmVisibility}>
          <img className="e83_33"  src={passwordConfirmVisible ? "./icon/mdi--eye.svg" : "./icon/mdi--eye-off.svg"} alt="Toggle Password Confirm Visibility"/>
        </button>
        <button className='next1'>다음</button>
      </form>
    </div>
  );
}