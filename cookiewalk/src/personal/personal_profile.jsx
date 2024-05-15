import React, {useEffect, useState } from 'react';
import './personal_profile.css';
import { Link, redirect , useNavigate, useLocation} from 'react-router-dom';

export default function PersonalProfile() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태를 관리합니다.

  // 팔로우 버튼을 클릭할 때 실행되는 함수
  const handleFollowClick = () => {
    setIsFollowing(prevState => !prevState); // 팔로우 상태를 토글합니다.
  };

  const postID=location.state.key
  console.log(postID)

  return (
    <>
    <div className="pp_background">
      <div className='ppnav'>
        <Link to="/friend"><div className="pp_back"><img className="pp_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
        <div className="pp_user_id">good_runnig_day</div>
        <div className="pp_line"></div>
      </div>

  
      <div><img className="profile_img" src="./images/ellipse_11.png" alt="" /></div>
      <div className="pp_total_distance_num">78km</div>
      <div className="pp_total_distance">총거리</div>
      <div className="pp_follower_num">793</div>
      <div className="pp_follower">팔로워</div>
      <div className="pp_following_num">282</div>
      <div className="pp_following">팔로잉</div>
      <div className="pp_user_name">박민준</div>
      <div className="pp_introduction">도심에서 즐기는 재미있는 러닝 🌆👟</div>
      
      <button className={`pp_follow_box ${isFollowing ? 'pp_following_box' : ''}`} onClick={handleFollowClick}>
      {isFollowing ? '팔로잉' : '팔로우'}
      </button>
      <div className="e216_19"></div>
      <div className="e216_20"></div>
      <div className="e216_21"></div>
      <div className="e216_22"></div>
      <div className="e216_23"></div>
      <div className="e216_24"></div>
      <div className="e216_25"></div>
      <div className="e216_26"></div>
      <div className="e216_27"></div>
      <div className="e216_28"></div>
      <div className="e216_29"></div>
      <div className="e216_30"></div>
      <div className="e216_31"></div>
      <div className="e216_32"></div>
      <div className="e216_33"></div>
      <div className="e216_34"></div>
      <div className="e216_35"></div>
      <div className="e216_36"></div>
      <div className="e216_37"></div>
      <div className="e216_38"></div>
      <div className="e216_39"></div>
      <div className="e216_40"></div>
      <div className="e216_41"></div>
      <div className="e216_42"></div>
      <div className="e216_43">
        <div className="e216_44">
          <div className="e216_45"></div>
          <div className="e216_46"></div>
        </div>
      </div>
      <div className="e216_48"></div>
      <div className="e216_61"></div>
    </div>

    

    <div className="navbar">
      <Link to="/home"><div className="home"><img className="my_home_icon" src="./icon/home.svg" alt="" /></div></Link>
      <Link to="/map"><div className="map"><img className="my_map_icon" src="./icon/map.svg" alt="" /></div></Link>
      <Link to="/pause"><div className="run"><img className="my_run_icon" src="./icon/record.svg" alt="" /></div></Link>
      <Link to="/group"><div className="group"><img className="my_group_icon" src="./icon/group.svg" alt="" /></div></Link>
      <Link to="/mypage"><div className="my"><img className="my_my_icon" src="./icon/my.svg" alt="" /></div></Link>
    </div></>
  );
}


