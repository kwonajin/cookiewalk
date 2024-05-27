import React, { useState, useEffect }  from 'react';
import './following.css';
import { Link } from "react-router-dom";

export default function Following() {

  const [isFollowing, setIsFollowing] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  
  return (
    <div className="following_background">
      <div className='followingnav'>
        <Link to="/mypage"><div className="following_back"><img className="friend_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
        <div className="following_tilte">팔로잉</div>
        <div className="following_line1"></div>
      </div>

      <input type='text' className="following_searchbar" placeholder='검색'></input>
      <div className="following_search"><img className="following_search_icon" src="./icon/search.svg" alt="" /></div>

      <div className="following1">
        <img className="following1_profile" src="./images/ellipse_11.png" alt="" />
        <div className="following1_text">
          <div className="following1_id">good_running_day</div>
          <div className="following1_name">박민준</div>
        </div>
        <button
          className={`following1_follow ${isFollowing ? 'following' : ''}`}
          onClick={handleFollowClick}
        >
          {isFollowing ? "팔로잉" : "팔로우"}
        </button>
        <div className="following1_line"></div>
      </div>
    </div>
  );
}

