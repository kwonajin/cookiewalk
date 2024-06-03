import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext.jsx';
import Slider from 'react-slick';


export const Tab = () => {
  const [currentTab, clickTab] = useState(0);
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [email, setEmail] = useState('');
  const [distance, setDistance] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [userPostList, setUserPostList] = useState([]);

  const userInfo = useToken(); // TokenContext에서 user 상태를 가져옴
  const userID = userInfo.user;

  const menuArr = [
    { id: 1, name: '내활동', content: '' },
    { id: 2, name: '게시물', content: '' },
  ];


  const location = useLocation();
  console.log("location : ", d);

  const selectMenuHandler = (index) => {
    clickTab(index);
  };

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    navigate('/');
  }

  function logouthandle(e) {
    e.preventDefault();
    signOut();
  }

  const fetchUser = async () => {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('user_id', userID);

    if (error) {
      console.error('오류발생', error);
    } else if (data) {
      setNickname(data[0].nick_name);
      setName(data[0].name);
      setIntro(data[0].intro);
      setProfileImage(data[0].profile_image);
      setEmail(data[0].email);
      setDistance(data[0].distance);
    }
  };

  const fetchFollowInfo = async () => {
    const { count: follower, error: followerError } = await supabase
      .eq('user_id', userID);
    if (error) {
      console.error('오류발생', error);
    }
    if (data) {
      console.log(data);
      setNickname(data[0].nick_name);
      setName(data[0].name);
      setIntro(data[0].intro);
      setProfileImage(data[0].profile_image);
      setEmail(data[0].email);
    }
  };
  //팔로우 팔로워 정보 가벼오기
  const followInfo = async () => {
    const { count: follower, error: followerError } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('target_email', email);

    if (followerError) {
      console.error('오류발생', followerError);
    } else {
      setFollowerCount(follower);
    }

    const { count: following, error: followingError } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('following_email', email);

    if (followingError) {
      console.error('오류발생', followingError);
    } else {
      setFollowingCount(following);
    }
  };

  const fetchUserPostList = async () => {
    const { data, error } = await supabase
      .from("post")
      .select("*")
      .eq("user_id", userID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getUserPostList 에러", error);
    } else {
      setUserPostList(data);
    }
  };
  async function getTotalDistance() {
    // 첫 번째 테이블에서 distance 값 가져오기
    const { data: walkingRecords, error: walkingError } = await supabase
      .from('walking_record')
      .select('distance')
      .eq('user_id', userID);

    if (walkingError) {
      console.error('Error fetching walking_record:', walkingError);
      return;
    }
    console.log(walkingRecords);
    // 두 테이블의 distance 값 합산
    const totalDistance = [...walkingRecords]
      .reduce((sum, record) => sum + (record.distance || 0), 0);

    console.log('Total distance for user', userID, 'is', totalDistance);
    setDistance(totalDistance.toFixed(2));
    return totalDistance;
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userID != null) {
      fetchUser();
    }
  }, [userID]);

  useEffect(() => {
    if (email) {
      fetchFollowInfo();
    }
  }, [email]);

  useEffect(() => {
    if (userID) {
      fetchUserPostList();
    }
  }, [userID]);

  return (
    <>
      <div className='mypage_background'>
        <div className='mynav'>
          <Link to="/reward"><img className='reward_icon' src="./images/logo.png" alt="" /><div className='tot_point'>1350</div></Link>
          <div className="user_id">{nickname}</div>
          <Link to="/mypage_menu"><div className="menu"><img className="menu_icon" src="./icon/menu.svg" alt="" /></div></Link>
          <div className="title_line"></div>
        </div>

        <div><img className="profile_img" src={profileImage} alt="" /></div>
        <div className="total_distance_num">{distance}km</div>
        <div className="total_distance">총거리</div>
        <Link to="/follower">
          <div className="follower_num">{followerCount}</div>
          <div className="follower">팔로워</div>
        </Link>
        <Link to="/following">
          <div className="following_num">{followingCount}</div>
          <div className="following">팔로잉</div>
        </Link>

        <div className="user_name">{name}</div>
        <div className="introduction">{intro}</div>

        <div className="profile_edit"></div>
        <Link to="/profile_edit"><div className="profile_edit_text">프로필 편집</div></Link>
        <div className="profile_share"></div>
        <Link to="/finished_art"><div className="profile_share_text">완성한 그림</div></Link>
        <div>
          <div className='TabMenu'>
            {menuArr.map((el, index) => (
              <li
                key={el.id}
                className={index === currentTab ? 'submenu focused' : 'submenu'}
                onClick={() => selectMenuHandler(index)}
              >
                {el.name}
              </li>
            ))}
          </div>
          <div className='Desc'>
            <div>
              {menuArr[currentTab].content}
              {currentTab === 0 && (
                <>
                  <div className="carousel">
                    <Slider {...settings}>
                      <div>
                        <img className='carousel_image' src="./images/carousel_demo1.png" alt="이미지1" />
                      </div>
                      <div>
                        <img className='carousel_image' src="./images/carousel_demo2.png" alt="이미지2" />
                      </div>
                      <div>
                        <img className='carousel_image' src="./images/carousel_demo3.png" alt="이미지3" />
                      </div>
                    </Slider>
                  </div>

                  <div className="badge">획득한 뱃지</div>
                  <div className="badge_go">
                    <img className='badge_go_icon' src="./icon/arrow.svg" alt="" />
                  </div>
                  <div className="badge_list">
                    <div><img className="badge1" src="./images/badge1.png" alt="" /></div>
                    <div><img className="badge2" src="./images/badge2.png" alt="" /></div>
                    <div><img className="badge3" src="./images/badge3.png" alt="" /></div>
                    <div><img className="badge4" src="./images/badge4.png" alt="" /></div>
                  </div>

                  <Link to="/mygroup">
                    <div className="myjoingroup">내가 가입한 그룹</div>
                    <div className="group_go"><img className='group_go_icon' src="./icon/arrow.svg" alt="" /></div>
                  </Link>
                  <div className="myjoingroup_list"></div>
                  <div className="group1">
                    <div className="group1_img"></div>
                    <div className="group1_title">전국 한반도 그리기</div>
                  </div>
                  <div className="group2">
                    <div className="group2_img"></div>
                    <div className="group2_title">부산 토끼 그려요</div>
                  </div>
                  <div className="group3">
                    <div className="group3_img"></div>
                    <div className="group3_title">폼폼푸린 🍮</div>
                  </div>
                </>
              )}
              {currentTab === 1 && (
                <div className='mypage_postBox'>
                  {userPostList.map((post) => (
                    <img key={post.post_id} src={[post.image]} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="navbar">
        <Link to="/home"><div className="home"><img className="mp_my_home_icon" src="./icon/home.svg" alt="" /></div></Link>
        <Link to="/map"><div className="map"><img className="mp_my_map_icon" src="./icon/map.svg" alt="" /></div></Link>
        <Link to="/BeforeStart"><div className="run"><img className="mp_my_run_icon" src="./icon/record.svg" alt="" /></div></Link>
        <Link to="/group"><div className="group"><img className="mp_my_group_icon" src="./icon/group.svg" alt="" /></div></Link>
        <Link to="/mypage"><div className="my"><img className="mp_my_my_icon" src="./icon/my.svg" alt="" /></div></Link>
      </div>
    </>
  );
};
