import './FindPassword2.css'
import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {supabase} from '../supabaseClient'

export default function FindPassword2() {
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

  const [password, setPassword]=useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  
  
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

return (
    <div className="FindPassword_container">
        
        <span className="FindPassword2_logo1">CookieWalk</span>
        <div><img className="FindsPassword2_logo2" src="./images/new_cookie_logo.png" alt="" /></div>

        <form method='/'>
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
            <button  type="button" className='next1'>재설정 완료</button>
        </form>

        
    </div>
);
}

