import './Signup.css'
import React, { useState } from 'react';
import { Link } from "react-router-dom";

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

  return (
    <div className="signup_container">
      <div><img className='e83_104' src="./icon/ic--round-arrow-back.svg" /></div>
      <span className="cookiewalk_logo">CookieWalk</span>
      <span className="e82_14">쿠키워크의 계정정보를 입력해주세요</span>
      <span className="e82_15">아래의 정보로 계정이 생성됩니다.</span>
      <form action="/" method = "/">
        <input type="text" className="userIdInput" placeholder="아이디를 입력해주세요" required/>
        <button type='submit' className="Id_double_check">중복확인</button>
        <input type={passwordVisible ? "text" : "password"} className="userPwInput" placeholder="비밀번호를 입력해주세요" required/>
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
        <input type={passwordConfirmVisible ? "text" : "password"} className="userPwInput2" placeholder="비밀번호를 재입력해주세요" required/>
        <button type='button' className="e83_32" onClick={togglePasswordConfirmVisibility}>
          <img className="e83_33"  src={passwordConfirmVisible ? "./icon/mdi--eye.svg" : "./icon/mdi--eye-off.svg"} alt="Toggle Password Confirm Visibility"/>
        </button>
        <button className='next1'>다음</button>
      </form>
    </div>
  );
}
