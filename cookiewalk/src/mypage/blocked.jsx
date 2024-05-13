import React from 'react';
import { Link } from 'react-router-dom';
import './blocked.css'

export default function Blocked() {
  return (
    <div className="saved_background">
      <Link to="/mypage_menu"><div className="saved_back"><img className="saved_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>

      <span className="saved_title">차단한 사용자</span>
      <div className="saved_line"></div>

    </div>
  );
}

