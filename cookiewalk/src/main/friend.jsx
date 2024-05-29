import React, { useEffect }  from 'react';
import './friend.css';
import { Link } from "react-router-dom";

export default function Friend() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFocus = (event) => {
    event.target.placeholder = '';
  };

  const handleBlur = (event, placeholderText) => {
    event.target.placeholder = placeholderText;
  
  };
  return (
    <div className="friend-page">
      <div className='friendnav'>
        <Link to="/home"><div className="friend_back"><img className="friend_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
        <div className="friend_title">친구찾기</div>
        <div className="friend_line1"></div>
      </div>

      <input
          className="fa_searchbar"
          type="text"
          placeholder="함께할 친구를 찾아보세요!"
          onFocus={handleFocus}
          onBlur={(event) => handleBlur(event, '함께할 친구를 찾아보세요!')}
        />
      <div className="fa_search"><img className='fa_search_icon' src="./icon/search.svg" alt="" /></div>

      <div className="friend1">
        <Link to="/personal_profile">
          <img className="friend1_profile" src="./images/ellipse_11.png" alt="" />
          <div className="friend1_text">
            <div className="friend1_id">good_running_day</div>
            <div className="friend1_name">박민준</div>
          </div>
          <div className="friend1_follow"></div>
          <div className="friend1_follow_text">팔로우</div>
          <div className="friend1_line"></div>
        </Link>
      </div>

      <div className="friend2">
        <img className="friend2_profile" src="./images/ellipse_11.png" alt="" />
        <div className="friend2_text">
          <div className="friend2_id">good_running_day</div>
          <div className="friend2_name">박민준</div>
        </div>
        <div className="friend2_follow"></div>
        <div className="friend2_follow_text">팔로우</div>
        <div className="friend2_line"></div>
      </div>

      <div className="friend3">
        <img className="friend3_profile" src="./images/ellipse_11.png" alt="" />
        <div className="friend3_text">
          <div className="friend3_id">good_running_day</div>
          <div className="friend3_name">박민준</div>
        </div>
        <div className="friend3_follow"></div>
        <div className="friend3_follow_text">팔로우</div>
        <div className="friend3_line"></div>
      </div>

      <div className="friend4">
        <img className="friend4_profile" src="./images/ellipse_11.png" alt="" />
        <div className="friend4_text">
          <div className="friend4_id">good_running_day</div>
          <div className="friend4_name">박민준</div>
        </div>
        <div className="friend4_follow"></div>
        <div className="friend4_follow_text">팔로우</div>
        <div className="friend4_line"></div>
      </div>

    </div>
  );
}

