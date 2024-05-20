import React from 'react';
import { Link } from 'react-router-dom';
import './liked.css'

export default function Liked() {
  return (
    <div className="saved_background">
      <Link to="/mypage_menu"><div className="saved_back"><img className="saved_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>

      <span className="saved_title">좋아요한 게시물</span>
      <div className="saved_line"></div>

      

    </div>
  );
}

