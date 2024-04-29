import React from 'react';
import './following.css';
import { Link } from "react-router-dom";

export default function Following() {
  return (
    <div className="following_background">
      <div className='followingnav'>
        <Link to="/mypage"><div className="following_back"><img className="friend_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
        <div className="following_tilte">팔로잉</div>
        <div className="following_line1"></div>
      </div>

      <div className="following_searchbar"></div>
      <span className="following_searchbar_text">검색</span>
      <div className="following_search"><img className="following_search_icon" src="./icon/search.svg" alt="" /></div>

      <div className="following1">
        <img className="following1_profile" src="./images/ellipse_11.png" alt="" />
        <div className="following1_text">
          <div className="following1_id">good_running_day</div>
          <div className="following1_name">박민준</div>
        </div>
        <div className="following1_follow"></div>
        <div className="following1_follow_text">팔로잉</div>
        <div className="following1_line"></div>
      </div>

      <div className="friend2">
        <img className="following2_profile" src="./images/ellipse_11.png" alt="" />
        <div className="following2_text">
          <div className="following2_id">good_running_day</div>
          <div className="following2_name">박민준</div>
        </div>
        <div className="following2_follow"></div>
        <div className="following2_follow_text">팔로잉</div>
        <div className="following2_line"></div>
      </div>

      <div className="following3">
        <img className="following3_profile" src="./images/ellipse_11.png" alt="" />
        <div className="following3_text">
          <div className="following3_id">good_running_day</div>
          <div className="following3_name">박민준</div>
        </div>
        <div className="following3_follow"></div>
        <div className="following3_follow_text">팔로잉</div>
        <div className="following3_line"></div>
      </div>

      <div className="following4">
        <img className="following4_profile" src="./images/ellipse_11.png" alt="" />
        <div className="following4_text">
          <div className="following4_id">good_running_day</div>
          <div className="following4_name">박민준</div>
        </div>
        <div className="following4_follow"></div>
        <div className="following4_follow_text">팔로잉</div>
        <div className="following4_line"></div>
      </div>

    </div>
  );
}

