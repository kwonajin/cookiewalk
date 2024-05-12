import React from 'react';
import './account_setting.css';
import { Link } from "react-router-dom";


export default function AccountSetting() {
  return (
    <div className="as_background">
      <Link to="/mypage_menu"><div className="as_back"><img className='as_back_icon' src="./icon/arrow.svg" alt="" /></div></Link>
      <span className="as_title">계정정보</span>
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
        <Link to="/account_setting2">
          <div className="as_password_change_btn"></div>
          <span className="as_password_change">비밀번호 변경</span>
        </Link>
      </div>





    </div>
  );
}
