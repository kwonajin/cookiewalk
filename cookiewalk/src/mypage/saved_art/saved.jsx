import React from 'react';
import { Link } from 'react-router-dom';
import './saved.css'

export default function Saved() {
  return (
    <div className="saved_background">
      <Link to="/mypage_menu"><div className="saved_back"><img className="saved_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>

      <span className="saved_title">저장한 경로</span>
      <div className="saved_line"></div>

    </div>
  );
}

