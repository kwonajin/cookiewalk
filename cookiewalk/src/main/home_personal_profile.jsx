import React, {useContext, useEffect, useState} from 'react';
import './home_personal_profile.css';
import { Link, useNavigate,useParams} from 'react-router-dom';
import mainContext from '../context/MainContext';
import { supabase } from '../supabaseClient'; // Supabase 클라이언트

export default function HomePersonalProfile() {
  const { userId } = useParams(); // URL에서 userId 추출
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(userId); // 추출한 userId 확인
  }, [userId]);

  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태를 관리합니다.
  const navigate = useNavigate(); // useNavigate를 사용하여 navigate 함수를 가져옵니다. 

  // 팔로우 버튼을 클릭할 때 실행되는 함수
  const handleFollowClick = () => {
    setIsFollowing(prevState => !prevState); // 팔로우 상태를 토글합니다.
  };

  // 이전 페이지로 이동하는 함수
  const handleGoBack = () => {
    navigate(-1); // navigate 함수를 사용하여 이전 페이지로 이동합니다.
  };




  return (
    <>
    <div className="hpp_background">
      <div className='hppnav'>
        <div className="hpp_back" onClick={handleGoBack}>
            <img className="hpp_back_icon" src="../../public/icon/arrow.svg" alt="" />
        </div>
        <div className="hpp_user_id">good_runnig_day</div>
        <div className="hpp_line"></div>
      </div>

  
      <div><img className="h_profile_img" src="../../images/ellipse_11.png" alt="" /></div>
      <div className="hpp_total_distance_num">78km</div>
      <div className="hpp_total_distance">총거리</div>
      <div className="hpp_follower_num">793</div>
      <div className="hpp_follower">팔로워</div>
      <div className="hpp_following_num">282</div>
      <div className="hpp_following">팔로잉</div>
      <div className="hpp_user_name">박민준</div>
      <div className="hpp_introduction">도심에서 즐기는 재미있는 러닝 🌆👟</div>
      
      <button className={`hpp_follow_box ${isFollowing ? 'hpp_following_box' : ''}`} onClick={handleFollowClick}>
      {isFollowing ? '팔로잉' : '팔로우'}
      </button>
      <div className="e216_19"></div>
      <div className="e216_20"></div>
      <div className="e216_21"></div>
      <div className="e216_25"></div>
      <div className="e216_26"></div>
      <div className="e216_27"></div>
      <div className="e216_31"></div>
      <div className="e216_32"></div>
      <div className="e216_33"></div>
      <div className="e216_37"></div>
      <div className="e216_38"></div>
      <div className="e216_39"></div>
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
      <Link to="/home"><div className="home"><img className="my_home_icon" src="../../icon/home.svg" alt="" /></div></Link>
      <Link to="/map"><div className="map"><img className="my_map_icon" src="../../icon/map.svg" alt="" /></div></Link>
      <Link to="/pause"><div className="run"><img className="my_run_icon" src="../../icon/record.svg" alt="" /></div></Link>
      <Link to="/group"><div className="group"><img className="my_group_icon" src="../../icon/group.svg" alt="" /></div></Link>
      <Link to="/mypage"><div className="my"><img className="my_my_icon" src="../../icon/my.svg" alt="" /></div></Link>
    </div></>
  );
}


