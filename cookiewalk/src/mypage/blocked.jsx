import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import './blocked.css'

export default function Blocked() {
  
  const [isBlocked, setIsBlocked] = useState(true);

  const handleBlockClick = () => {
    setIsBlocked(!isBlocked);
  };

  return (
    <div className="saved_background">
      <Link to="/mypage_menu"><div className="saved_back"><img className="saved_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>

      <span className="saved_title">차단한 사용자</span>
      <div className="saved_line"></div>

      <div className="blocked_user_box">
        <img className="blocked_user_profile" src="./images/ellipse_11.png" alt="" />
        <div className="blocked_user_text">
          <div className="blocked_user_id">good_running_day</div>
          <div className="blocked_user_name">박민준</div>
        </div>
        <button
          className={`blocked_button ${isBlocked ? 'blocked' : 'unblocked'}`}
          onClick={handleBlockClick}
        >
          {isBlocked ? "차단 해제" : "차단"}
        </button>
        <div className='blocked_user_line'></div>
      </div>
    </div>
  );
}

