import React, { useState, useEffect }  from 'react';
import './profile_edit.css'; 
import { Link } from "react-router-dom";

export default function ProfileEdit() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [nicknameVisible, setNicknameVisible] = useState(true);
  const [usernameVisible, setUsernameVisible] = useState(true);
  const [introduceVisible, setIntroduceVisible] = useState(true);

  // 포커스 이벤트 핸들러
  const handleNicknameFocus = () => {
    setNicknameVisible(false); // 닉네임 플레이스홀더를 숨김
    setUsernameVisible(true); // 사용자 이름 플레이스홀더를 보이게 함
    setIntroduceVisible(true); // 소개 플레이스홀더를 보이게 함
  };

  const handleUsernameFocus = () => {
    setUsernameVisible(false); // 사용자 이름 플레이스홀더를 숨김
    setNicknameVisible(true); // 닉네임 플레이스홀더를 보이게 함
    setIntroduceVisible(true); // 소개 플레이스홀더를 보이게 함
  };

  const handleIntroduceFocus = () => {
    setIntroduceVisible(false); // 소개 플레이스홀더를 숨김
    setNicknameVisible(true); // 닉네임 플레이스홀더를 보이게 함
    setUsernameVisible(true); // 사용자 이름 플레이스홀더를 보이게 함
  };

  const handleBlur = () => {
    setNicknameVisible(true); // 닉네임 플레이스홀더를 다시 보이게 함
    setUsernameVisible(true); // 사용자 이름 플레이스홀더를 다시 보이게 함
    setIntroduceVisible(true); // 소개 플레이스홀더를 다시 보이게 함
  };

  return (
    <div className="pe_background">
      <Link to="/mypage"><div className="pe_back"><img className="pe_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
      <span className="pe_title">프로필 편집</span>
      <div className='pe_complete'>저장</div>
      <div className="pe_line"></div>
      <img className='pe_profile_img' src="./images/ellipse_7.png" alt="" />
      <div className="pe_img_mod"></div>
      <span className="pe_img_mod_text">프로필 사진 수정</span>
      <div className="pe_line1"></div>
      <span className="pe_nickname">닉네임</span>
      <input type="text" className='pe_nickname_input' placeholder={nicknameVisible ? "닉네임" : ""} onFocus={handleNicknameFocus} onBlur={handleBlur}/>
      <div className="pe_line2"></div>
      <span className="pe_user_name">사용자 이름</span>
      <input type="text" className='pe_user_name_input' placeholder={usernameVisible ? "사용자 이름" : ""} onFocus={handleUsernameFocus} onBlur={handleBlur}/>
      <div className="pe_line3"></div>
      <span className="pe_introduce">소개</span>
      <input type="text" className='pe_introduce_input' placeholder={introduceVisible ? "소개" : ""} onFocus={handleIntroduceFocus} onBlur={handleBlur}/>
      <div className="pe_line4"></div>
    </div>
  );
}

