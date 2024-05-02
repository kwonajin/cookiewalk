import React, { useEffect }  from 'react';
import './follower.css';
import { Link } from "react-router-dom";

export default function Follower() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="follower_background">
      <div className='followernav'>
        <Link to="/mypage"><div className="follower_back"><img className="friend_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
        <div className="follower_tilte">팔로워</div>
        <div className="follower_line1"></div>
      </div>

      <div className="follower_searchbar"></div>
      <span className="follower_searchbar_text">검색</span>
      <div className="follower_search"><img className="follower_search_icon" src="./icon/search.svg" alt="" /></div>

      <div className="follower1">
        <img className="follower1_profile" src="./images/ellipse_11.png" alt="" />
        <div className="follower1_text">
          <div className="follower1_id">good_running_day</div>
          <div className="follower1_name">박민준</div>
        </div>
        <div className="follower1_follow"></div>
        <div className="follower1_follow_text">팔로우</div>
        <div className="follower1_line"></div>
      </div>

      <div className="friend2">
        <img className="follower2_profile" src="./images/ellipse_11.png" alt="" />
        <div className="follower2_text">
          <div className="follower2_id">good_running_day</div>
          <div className="follower2_name">박민준</div>
        </div>
        <div className="follower2_follow"></div>
        <div className="follower2_follow_text">팔로우</div>
        <div className="follower2_line"></div>
      </div>

      <div className="follower3">
        <img className="follower3_profile" src="./images/ellipse_11.png" alt="" />
        <div className="follower3_text">
          <div className="follower3_id">good_running_day</div>
          <div className="follower3_name">박민준</div>
        </div>
        <div className="follower3_follow"></div>
        <div className="follower3_follow_text">팔로우</div>
        <div className="follower3_line"></div>
      </div>

      <div className="follower4">
        <img className="follower4_profile" src="./images/ellipse_11.png" alt="" />
        <div className="follower4_text">
          <div className="follower4_id">good_running_day</div>
          <div className="follower4_name">박민준</div>
        </div>
        <div className="follower4_follow"></div>
        <div className="follower4_follow_text">팔로우</div>
        <div className="follower4_line"></div>
      </div>

    </div>
  );
}

