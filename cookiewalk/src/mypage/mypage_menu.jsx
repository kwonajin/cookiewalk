import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './mypage_menu.css'

export default function MypageMenu() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // 여기서 다크 모드를 활성화 또는 비활성화하는 코드를 추가할 수 있습니다.
  };

  return (
    <div className="mm_background">

      <Link to="/mypage"><div className="mm_back"><img className="mm_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
      <span className="mm_title">설정 및 활동</span>
      <div className="mm_line"></div>

      <span className="menu1">계정 및 앱 설정</span>
      <Link to="/account_setting">
        <div className='account_info_box'>
          <div className="account"><img className='account_icon' src="./icon/profile.svg" alt="" /></div>
          <span className="account_info">계정 정보</span>
          <div className="go1"><img className='go1_icon' src="./icon/arrow.svg" alt="" /></div>
        </div>
      </Link>
      <div className="mm_line1"></div>
      <div className="darkmode" onClick={toggleDarkMode}>
        <img className="darkmode_icon" src="./icon/bright.svg" alt="" />
        <div className={`darkmode_onoff ${darkMode ? 'on' : ''}`} onClick={toggleDarkMode}></div>
      </div>
      <span className="darkmode_text">다크모드</span>
      <div className="division1"></div>

      <span className="menu2">내활동 관리</span>
      <div className="saved"><img className="saved_icon" src="./icon/save.svg" alt="" /></div>
      <span className="saved_text">저장한 경로</span>
      <div className="go2"><img className='go2_icon' src="./icon/arrow.svg" alt="" /></div>

      <div className="mm_line2"></div>
      <div className="liked"><img className="liked_icon" src="./icon/heart.svg" alt="" /></div>
      <span className="liked_text">좋아요한 게시물</span>
      <div className="go3"><img className='go3_icon' src="./icon/arrow.svg" alt="" /></div>

      <div className="mm_line3"></div>
      <div className="commented"><img className="commented_icon" src="./icon/comment.svg" alt="" /></div>
      <span className="commented_text">댓글단 게시물</span>
      <div className="go4"><img className='go4_icon' src="./icon/arrow.svg" alt="" /></div>

      <div className="mm_line4"></div>
      <div className="block"><img className="block_icon" src="./icon/block.svg" alt="" /></div>
      <span className="block_text">차단한 사용자</span>
      <div className="go5"><img className='go5_icon' src="./icon/arrow.svg" alt="" /></div>

      <div className="division2"></div>

      <span className="menu3">더많은 지원</span>
      <div className="info"><img className="info_icon" src="./icon/information.svg" alt="" /></div>
      <span className="info_text">정보</span>
      <div className="go6"><img className='go6_icon' src="./icon/arrow.svg" alt="" /></div>

      <div className="division3"></div>

      <span className="menu4">로그인 관리</span>
      <span className="logout">로그아웃</span>
    </div>
  );
}