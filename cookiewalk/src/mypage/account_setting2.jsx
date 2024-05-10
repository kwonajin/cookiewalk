import React from 'react';
import './account_setting2.css';
import { Link } from "react-router-dom";


export default function AccountSetting2() {
  return (
    <div className="as_background">
      <Link to="/account_setting"><div className="as_back"><img className='as_back_icon' src="./icon/arrow.svg" alt="" /></div></Link>
      <span className="as_title">계정정보</span>
      <div className="as_change">변경</div>
      <div className="as_line"></div>
      <img className="as_profile_img" src="./images/ellipse_11.png" alt="" />
      <span className="as_nickname">닉네임</span>
      <span className="as_username">사용자 이름</span>
      <div className="as_line1"></div>

      <div className="as_contents">
        <span className="as_email">이메일</span>
        <div className="as_user_email">사용자 이메일이 와야함</div>
        <div className="as_line_1"></div>
        <span className="as_password">비밀번호</span>
        <input className="as_user_password" placeholder='비밀번호 입력'/>
        <div className="as_line_2"></div>
        <span className="as_password2">비밀번호 재입력</span>
        <input className="as_user_password2" placeholder='비밀번호 재입력'/>
        <div className="as_line_3"></div>
      </div>





    </div>
  );
}
